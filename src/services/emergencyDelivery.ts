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
    ec2CoordinatorReady: false,
    realtimeChannelsReady: false,
    keyExchangeReady: false,
    mediaUploadReady: packageRecord.media.assets.length > 0,
    coordinatorService: packageRecord.deliveryPlan.remoteSharing.coordinator.service,
    realtimeChannels: packageRecord.deliveryPlan.remoteSharing.realtime.channels,
    reason:
      packageRecord.media.status === "blocked_public_build"
        ? "Pacote preservado no cofre local; arquivos permanecem somente neste aparelho."
        : "Pacote preservado; envio protegido depende de login, chaves, sinalizacao, P2P e autorizacoes."
  };
}
