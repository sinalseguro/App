import { EmergencyPackage } from "./types";

export function summarizeLocation(packageRecord: EmergencyPackage) {
  if (packageRecord.location.status === "captured") {
    return `Georreferencia preservada no pacote local com precisao de ${Math.round(packageRecord.location.accuracyMeters)}m.`;
  }

  return `Georreferencia nao anexada: ${packageRecord.location.reason}`;
}

export function summarizeDelivery(packageRecord: EmergencyPackage) {
  return `API ${packageRecord.deliveryPlan.api.status}; P2P ${packageRecord.deliveryPlan.p2p.status}; ${packageRecord.deliveryPlan.trustedContacts.length} anjo(s) autorizado(s).`;
}

export function summarizePackage(packageRecord: EmergencyPackage) {
  return [
    `Criado em ${new Date(packageRecord.createdAt).toLocaleString("pt-BR")}.`,
    summarizeLocation(packageRecord),
    `Midia: ${packageRecord.media.status}.`,
    summarizeDelivery(packageRecord),
    `Hash: ${packageRecord.integrity.sha256.slice(0, 16)}...`
  ].join(" ");
}
