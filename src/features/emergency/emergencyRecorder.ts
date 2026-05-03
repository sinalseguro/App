import * as Crypto from "expo-crypto";
import { captureForegroundLocation } from "./locationCapture";
import { listEmergencyPackages, saveEmergencyPackage } from "./emergencyOutbox";
import {
  EmergencyExchangeEnvelope,
  EmergencyFinishReason,
  EmergencyKind,
  EmergencyPackage,
  MediaCaptureManifest
} from "./types";

type RecordEmergencyPackageInput = {
  kind: EmergencyKind;
  trustedContactIds?: string[];
  captureLocation?: boolean;
  defaultDurationSeconds?: number;
  locationConsentMode?: EmergencyPackage["consentSnapshot"]["location"];
};

type EmergencyPackageWithoutIntegrity = Omit<EmergencyPackage, "integrity">;
type EmergencyPackageStartResult = {
  packageRecord: EmergencyPackage;
  exchangeEnvelope: EmergencyExchangeEnvelope;
};

let activeStartPromise: Promise<EmergencyPackageStartResult> | null = null;

function stripIntegrity(packageRecord: EmergencyPackage): EmergencyPackageWithoutIntegrity {
  const { integrity: _ignoredIntegrity, ...packageWithoutIntegrity } = packageRecord;
  return packageWithoutIntegrity;
}

const mediaBlockedManifest: MediaCaptureManifest = {
  status: "blocked_public_build",
  recordingMode: "none",
  assets: [],
  policy: "Midia real permanece bloqueada neste build publico ate RIPD/DPIA, consentimento, auditoria e ambiente de homologacao."
};

export function buildEmergencyExchangeEnvelope(packageRecord: EmergencyPackage): EmergencyExchangeEnvelope {
  return {
    protocolVersion: "sinalseguro.emergency-exchange.v1",
    packageId: packageRecord.id,
    clientAlertId: packageRecord.clientAlertId,
    idempotencyKey: packageRecord.idempotencyKey,
    readyForBackend: false,
    readyForP2PAdapter: false,
    locationStatus: packageRecord.location.status,
    mediaStatus: packageRecord.media.status,
    packageSha256: packageRecord.integrity.sha256,
    createdAt: packageRecord.createdAt
  };
}

function buildEmergencyPackageResult(packageRecord: EmergencyPackage): EmergencyPackageStartResult {
  return {
    packageRecord,
    exchangeEnvelope: buildEmergencyExchangeEnvelope(packageRecord)
  };
}

async function attachIntegrity(packageWithoutIntegrity: EmergencyPackageWithoutIntegrity): Promise<EmergencyPackage> {
  const sha256 = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    JSON.stringify(packageWithoutIntegrity)
  );

  return {
    ...packageWithoutIntegrity,
    integrity: {
      sha256,
      calculatedAt: new Date().toISOString()
    }
  };
}

async function createEmergencyPackage({
  kind,
  trustedContactIds = [],
  captureLocation = true,
  defaultDurationSeconds = 60,
  locationConsentMode = "foreground_when_triggered"
}: RecordEmergencyPackageInput) {
  const startedAt = new Date().toISOString();
  const location = captureLocation
    ? await captureForegroundLocation()
    : {
        status: "skipped" as const,
        capturedAt: new Date().toISOString(),
        reason: "Captura de localizacao desativada para este acionamento."
      };
  const completedAt = new Date().toISOString();

  const packageWithoutIntegrity: EmergencyPackageWithoutIntegrity = {
    id: Crypto.randomUUID(),
    schemaVersion: "sinalseguro.emergency-package.v1" as const,
    kind,
    status: "recording_local",
    clientAlertId: Crypto.randomUUID(),
    idempotencyKey: Crypto.randomUUID(),
    createdAt: startedAt,
    updatedAt: completedAt,
    capture: {
      status: "recording",
      startedAt,
      plannedDurationSeconds: defaultDurationSeconds,
      evidenceTypes: ["timestamp", "location_snapshot", "media_manifest", "delivery_plan"] as const
    },
    consentSnapshot: {
      termsVersion: "mvp-controlado-2026-05-02" as const,
      location: locationConsentMode,
      media: "blocked_until_homologation" as const,
      sharing: "blocked_until_contract_backend_audit" as const
    },
    location,
    media: mediaBlockedManifest,
    deliveryPlan: {
      api: {
        status: "waiting_backend" as const,
        endpoint: "/alerts" as const
      },
      p2p: {
        status: "waiting_adapter" as const,
        candidates: ["webrtc", "nearby", "multipeer"] as const
      },
      trustedContacts: trustedContactIds.map((contactId) => ({
        contactId,
        status: "local_reference_pending_contract" as const
      }))
    }
  };

  const packageRecord = await attachIntegrity(packageWithoutIntegrity);
  await saveEmergencyPackage(packageRecord);

  return buildEmergencyPackageResult(packageRecord);
}

export async function getActiveEmergencyPackage() {
  const packages = await listEmergencyPackages();
  return packages.find((packageRecord) => packageRecord.status === "recording_local") ?? null;
}

export async function startEmergencyPackage(input: RecordEmergencyPackageInput): Promise<EmergencyPackageStartResult> {
  if (activeStartPromise) {
    return activeStartPromise;
  }

  const activePackage = await getActiveEmergencyPackage();
  if (activePackage) {
    return buildEmergencyPackageResult(activePackage);
  }

  if (activeStartPromise) {
    return activeStartPromise;
  }

  activeStartPromise = createEmergencyPackage(input).finally(() => {
    activeStartPromise = null;
  });

  return activeStartPromise;
}

export async function finishEmergencyPackage(packageId: string, endReason: EmergencyFinishReason = "manual_finish") {
  const packages = await listEmergencyPackages();
  const activePackage = packages.find((packageRecord) => packageRecord.id === packageId);

  if (!activePackage) return null;

  if (activePackage.status !== "recording_local") {
    return buildEmergencyPackageResult(activePackage);
  }

  const completedAt = new Date().toISOString();
  const elapsedMs = new Date(completedAt).getTime() - new Date(activePackage.capture.startedAt).getTime();
  const packageWithoutIntegrity: EmergencyPackageWithoutIntegrity = {
    ...stripIntegrity(activePackage),
    status: "recorded_local",
    updatedAt: completedAt,
    capture: {
      ...activePackage.capture,
      status: "recorded",
      completedAt,
      elapsedMs,
      endReason
    }
  };

  const packageRecord = await attachIntegrity(packageWithoutIntegrity);
  await saveEmergencyPackage(packageRecord);

  return buildEmergencyPackageResult(packageRecord);
}

export async function finishActiveEmergencyPackage(endReason: EmergencyFinishReason = "manual_finish") {
  const activePackage = await getActiveEmergencyPackage();
  if (!activePackage) return null;

  return finishEmergencyPackage(activePackage.id, endReason);
}

export async function finishExpiredActiveEmergencyPackage() {
  const activePackage = await getActiveEmergencyPackage();
  if (!activePackage) return null;

  const plannedDurationMs = activePackage.capture.plannedDurationSeconds * 1000;
  const elapsedMs = Date.now() - new Date(activePackage.capture.startedAt).getTime();

  if (elapsedMs < plannedDurationMs) {
    return null;
  }

  return finishEmergencyPackage(activePackage.id, "default_duration_elapsed");
}

export async function recordEmergencyPackage(input: RecordEmergencyPackageInput) {
  if (activeStartPromise || (await getActiveEmergencyPackage())) {
    throw new Error("Ja existe chamado local ativo para este dispositivo.");
  }

  const started = await createEmergencyPackage(input);
  const finished = await finishEmergencyPackage(started.packageRecord.id, "immediate_package");
  if (!finished) {
    throw new Error("Falha ao finalizar pacote tecnico local.");
  }

  return finished;
}
