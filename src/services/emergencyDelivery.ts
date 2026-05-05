import { EmergencyPackage } from "@/features/emergency/types";

export function buildCreateAlertDraft(packageRecord: EmergencyPackage) {
  return {
    clientAlertId: packageRecord.clientAlertId,
    kind: packageRecord.kind,
    triggeredAt: packageRecord.createdAt,
    locationStatus: packageRecord.location.status,
    exactLocationBlockedReason: "exact_location_blocked_until_authorized_backend"
  };
}

export function getEmergencyDeliveryReadiness(packageRecord: EmergencyPackage) {
  return {
    apiReady: false,
    p2pAdapterReady: false,
    mediaUploadReady: packageRecord.media.assets.length > 0,
    reason:
      packageRecord.media.status === "blocked_public_build"
        ? "Pacote preservado no cofre local; arquivos permanecem somente neste aparelho."
        : "Pacote preservado; envio protegido depende de conta, contrato e autorizacoes."
  };
}
