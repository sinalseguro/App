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
    endpoint: "/emergency-sessions/",
    idempotencyKey: packageRecord.idempotencyKey,
    kind: packageRecord.kind,
    locationStatus: packageRecord.location.status,
    triggeredAt: packageRecord.createdAt
  };
}

function packageAccuracyMeters(packageRecord: EmergencyPackage) {
  if (packageRecord.location.status !== "captured") return null;
  return packageRecord.location.accuracyMeters;
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
          ? "EC2 configurada; envio remoto depende de login, chaves dos anjos e canais P2P autorizados."
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
    const registeredDeviceId = deviceId ?? (await deviceBindingService.getRegisteredApiDeviceId());
    const remoteSession = await apiClient.createEmergencySession({
      clientAlertId: packageRecord.clientAlertId,
      deviceId: registeredDeviceId,
      idempotencyKey: packageRecord.idempotencyKey,
      kind: packageRecord.kind,
      locationAccuracyMeters: packageAccuracyMeters(packageRecord),
      locationStatus: packageRecord.location.status,
      startedAt: packageRecord.capture.startedAt
    });

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
