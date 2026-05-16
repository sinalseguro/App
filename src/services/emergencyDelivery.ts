import { EmergencyPackage } from "@/features/emergency/types";
import { ApiEmergencySession, ApiRequestError, apiClient, apiConfig } from "@/services/apiClient";
import { deviceBindingService } from "@/services/deviceBinding";

export type EmergencySyncResult =
  | {
      remoteSession: ApiEmergencySession;
      status: "sent_to_ec2";
    }
  | {
      reason: string;
      status: "api_disabled" | "login_required" | "remote_failed";
    };

export function buildCreateAlertDraft(packageRecord: EmergencyPackage) {
  return {
    clientAlertId: packageRecord.clientAlertId,
    endpoint: packageRecord.deliveryPlan.api.endpoint,
    idempotencyKey: packageRecord.idempotencyKey,
    kind: packageRecord.kind,
    locationStatus: packageRecord.location.status,
    trustedContactCount: packageRecord.deliveryPlan.trustedContacts.length,
    triggeredAt: packageRecord.createdAt
  };
}

function packageAccuracyMeters(packageRecord: EmergencyPackage) {
  if (packageRecord.location.status !== "captured") return null;
  return packageRecord.location.accuracyMeters;
}

function isDeviceReferenceError(error: ApiRequestError) {
  const details = JSON.stringify(error.details ?? "").toLowerCase();
  const message = error.message.toLowerCase();
  return (
    error.status === 400 &&
    (details.includes('"device"') ||
      message.includes("dispositivo indisponivel") ||
      message.includes("invalid pk"))
  );
}

async function createRemoteEmergencySession(packageRecord: EmergencyPackage, deviceId?: string | null) {
  return apiClient.createEmergencySession({
    clientAlertId: packageRecord.clientAlertId,
    deviceId,
    idempotencyKey: packageRecord.idempotencyKey,
    kind: packageRecord.kind,
    locationAccuracyMeters: packageAccuracyMeters(packageRecord),
    locationStatus: packageRecord.location.status,
    protectedSubjectId: null,
    startedAt: packageRecord.capture.startedAt
  });
}

async function resolveEmergencyDeviceId(deviceId?: string | null) {
  if (deviceId !== undefined) return deviceId;

  try {
    const refreshedDevice = await deviceBindingService.registerAuthenticatedDevice();
    return refreshedDevice.device.id;
  } catch {
    return deviceBindingService.getRegisteredApiDeviceId();
  }
}

export function getEmergencyDeliveryReadiness(packageRecord: EmergencyPackage) {
  const apiReady = apiConfig.apiEnabled && Boolean(apiConfig.apiBaseUrl);

  return {
    apiReady,
    p2pAdapterReady: false,
    ec2CoordinatorReady: apiReady,
    realtimeChannelsReady: false,
    keyExchangeReady: false,
    mediaUploadReady: packageRecord.media.assets.length > 0,
    coordinatorService: packageRecord.deliveryPlan.remoteSharing.coordinator.service,
    realtimeChannels: packageRecord.deliveryPlan.remoteSharing.realtime.channels,
    reason:
      packageRecord.media.status === "blocked_public_build"
        ? "Pacote preservado no cofre local; arquivos permanecem somente neste aparelho."
        : apiReady
          ? packageRecord.deliveryPlan.trustedContacts.length > 0
            ? "EC2 configurada; ocorrencia sera registrada e roteada aos anjos aceitos quando houver conexao."
            : "EC2 configurada; ocorrencia sera registrada, mas ainda nao ha anjo aceito para avisar."
          : "Pacote preservado; envio protegido depende de login, chaves, sinalizacao, P2P e autorizacoes."
  };
}

export async function syncEmergencySessionWithApi(
  packageRecord: EmergencyPackage,
  deviceId?: string | null
): Promise<EmergencySyncResult> {
  if (!apiConfig.apiEnabled || !apiConfig.apiBaseUrl) {
    return {
      reason: "API SinalSeguro desabilitada neste build.",
      status: "api_disabled"
    };
  }

  const currentSession = await apiClient.getStoredSession();
  if (!currentSession) {
    return {
      reason: "Login SinalSeguro necessario antes do compartilhamento remoto.",
      status: "login_required"
    };
  }

  try {
    const registeredDeviceId = await resolveEmergencyDeviceId(deviceId);
    let remoteSession: ApiEmergencySession;

    try {
      remoteSession = await createRemoteEmergencySession(packageRecord, registeredDeviceId);
    } catch (error) {
      if (!(error instanceof ApiRequestError) || !registeredDeviceId || !isDeviceReferenceError(error)) {
        throw error;
      }

      await deviceBindingService.clearRegisteredDeviceSession();
      const refreshedDevice = await deviceBindingService.registerAuthenticatedDevice();
      remoteSession = await createRemoteEmergencySession(packageRecord, refreshedDevice.device.id);
    }

    return {
      remoteSession,
      status: "sent_to_ec2"
    };
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      return {
        reason: "Sessao expirada ou login ausente.",
        status: "login_required"
      };
    }

    return {
      reason: error instanceof Error ? error.message : "Falha ao sincronizar emergencia com a EC2.",
      status: "remote_failed"
    };
  }
}
