import * as Crypto from "expo-crypto";
import { captureForegroundLocation } from "./locationCapture";
import { saveEmergencyPackage } from "./emergencyOutbox";
import { EmergencyExchangeEnvelope, EmergencyKind, EmergencyPackage, MediaCaptureManifest } from "./types";

type RecordEmergencyPackageInput = {
  kind: EmergencyKind;
  trustedContactIds?: string[];
  captureLocation?: boolean;
};

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
    readyForBackend: true,
    readyForP2PAdapter: true,
    locationStatus: packageRecord.location.status,
    mediaStatus: packageRecord.media.status,
    packageSha256: packageRecord.integrity.sha256,
    createdAt: packageRecord.createdAt
  };
}

export async function recordEmergencyPackage({
  kind,
  trustedContactIds = [],
  captureLocation = true
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

  const packageWithoutIntegrity = {
    id: Crypto.randomUUID(),
    schemaVersion: "sinalseguro.emergency-package.v1" as const,
    kind,
    status: "queued_for_delivery" as const,
    clientAlertId: Crypto.randomUUID(),
    idempotencyKey: Crypto.randomUUID(),
    createdAt: startedAt,
    updatedAt: completedAt,
    capture: {
      status: "recorded" as const,
      startedAt,
      completedAt,
      evidenceTypes: ["timestamp", "location_snapshot", "media_manifest", "delivery_plan"] as const
    },
    consentSnapshot: {
      termsVersion: "mvp-controlado-2026-05-02" as const,
      location: "foreground_when_triggered" as const,
      media: "blocked_until_homologation" as const,
      sharing: "trusted_contacts_and_api_when_available" as const
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
        status: "authorized_pending_delivery" as const
      }))
    }
  };

  const sha256 = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    JSON.stringify(packageWithoutIntegrity)
  );

  const packageRecord: EmergencyPackage = {
    ...packageWithoutIntegrity,
    integrity: {
      sha256,
      calculatedAt: new Date().toISOString()
    }
  };

  await saveEmergencyPackage(packageRecord);

  return {
    packageRecord,
    exchangeEnvelope: buildEmergencyExchangeEnvelope(packageRecord)
  };
}
