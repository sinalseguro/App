export type ConsentCardStatus = "obrigatorio" | "opcional" | "bloqueado";

export type ConsentCardPresentation = {
  statusLabel: string;
};

export const consentCardStatusLabels: Record<ConsentCardStatus, string> = {
  obrigatorio: "obrigatorio",
  opcional: "opcional",
  bloqueado: "bloqueado"
};

export function buildConsentCardPresentation(status: ConsentCardStatus): ConsentCardPresentation {
  return {
    statusLabel: consentCardStatusLabels[status]
  };
}
