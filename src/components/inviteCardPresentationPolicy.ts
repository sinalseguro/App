export type InviteCardStatus = "pendente" | "compartilhado" | "aceito" | "revogado" | "expirado";

export type InviteCardIconKey = "check-circle" | "clock" | "shield-alert" | "shield-check" | "x-circle";

export type InviteCardTone = "danger" | "primary" | "secure" | "warning";

export type InviteCardPresentation = {
  iconKey: InviteCardIconKey;
  label: string;
  tone: InviteCardTone;
};

export const inviteCardStatusPresentation: Record<InviteCardStatus, InviteCardPresentation> = {
  aceito: {
    iconKey: "shield-check",
    label: "Autorizado",
    tone: "secure"
  },
  compartilhado: {
    iconKey: "check-circle",
    label: "Compartilhado",
    tone: "primary"
  },
  expirado: {
    iconKey: "shield-alert",
    label: "Expirado",
    tone: "warning"
  },
  pendente: {
    iconKey: "clock",
    label: "Pendente",
    tone: "warning"
  },
  revogado: {
    iconKey: "x-circle",
    label: "Revogado",
    tone: "danger"
  }
};

export function buildInviteCardPresentation(status: InviteCardStatus): InviteCardPresentation {
  return inviteCardStatusPresentation[status];
}
