import { EmergencyPackage } from "@/features/emergency/types";

export function buildCreateAlertDraft(packageRecord: EmergencyPackage) {
  return {
    clientAlertId: packageRecord.clientAlertId,
    kind: packageRecord.kind,
    triggeredAt: packageRecord.createdAt,
    location:
      packageRecord.location.status === "captured"
        ? {
            latitude: packageRecord.location.latitude,
            longitude: packageRecord.location.longitude,
            accuracyMeters: packageRecord.location.accuracyMeters
          }
        : undefined
  };
}

export function getEmergencyDeliveryReadiness(packageRecord: EmergencyPackage) {
  return {
    apiReady: true,
    p2pAdapterReady: true,
    mediaUploadReady: packageRecord.media.assets.length > 0,
    reason:
      packageRecord.media.status === "blocked_public_build"
        ? "Pacote pronto para alerta e localizacao; midia real bloqueada neste build publico."
        : "Pacote pronto para entrega."
  };
}
