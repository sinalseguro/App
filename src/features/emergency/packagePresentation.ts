import { EmergencyPackage } from "./types";

export function summarizeLocation(packageRecord: EmergencyPackage) {
  if (packageRecord.location.status === "captured") {
    return `Georreferencia preservada no pacote local com precisao de ${Math.round(packageRecord.location.accuracyMeters)}m.`;
  }

  return `Georreferencia nao anexada: ${packageRecord.location.reason}`;
}

export function summarizeDelivery(packageRecord: EmergencyPackage) {
  return `Envio externo bloqueado neste build; ${packageRecord.deliveryPlan.trustedContacts.length} contato(s) apenas listado(s) para validacao futura.`;
}

export function summarizeCapture(packageRecord: EmergencyPackage) {
  const duration = packageRecord.capture.plannedDurationSeconds ?? 60;
  const durationText = duration < 60 ? `${duration}s` : `${Math.round(duration / 60)}min`;

  if (packageRecord.capture.status === "recording") {
    return `Coleta local ativa por ate ${durationText}; pode ser finalizada manualmente.`;
  }

  const reason =
    packageRecord.capture.endReason === "manual_finish"
      ? "finalizada pela usuaria"
      : packageRecord.capture.endReason === "default_duration_elapsed"
        ? "finalizada pelo tempo padrao"
        : "pacote tecnico imediato";

  return `Coleta ${reason}; duracao planejada ${durationText}.`;
}

export function summarizePackage(packageRecord: EmergencyPackage) {
  return [
    `Criado em ${new Date(packageRecord.createdAt).toLocaleString("pt-BR")}.`,
    summarizeCapture(packageRecord),
    summarizeLocation(packageRecord),
    `Midia: ${packageRecord.media.status}.`,
    summarizeDelivery(packageRecord),
    `Hash: ${packageRecord.integrity.sha256.slice(0, 16)}...`
  ].join(" ");
}
