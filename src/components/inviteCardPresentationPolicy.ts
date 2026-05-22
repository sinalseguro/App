export type InviteCardStatus = "pendente" | "compartilhado" | "aceito" | "revogado" | "expirado";

export type InviteCardIconKey = "check-circle" | "clock" | "shield-alert" | "shield-check" | "x-circle";

export type InviteCardTone = "danger" | "primary" | "secure" | "warning";

export type InviteCardTextFit = {
  maxFontSizeMultiplier: number;
  numberOfLines: number;
};

export type InviteCardPresentation = {
  detailTextFit: InviteCardTextFit;
  iconKey: InviteCardIconKey;
  iconSize: number;
  label: string;
  nameTextFit: InviteCardTextFit;
  pressableAccessibilityRole: "button";
  tone: InviteCardTone;
};

export const inviteCardNameTextFit: InviteCardTextFit = {
  maxFontSizeMultiplier: 1.2,
  numberOfLines: 1
};

export const inviteCardDetailTextFit: InviteCardTextFit = {
  maxFontSizeMultiplier: 1.2,
  numberOfLines: 1
};

export const inviteCardIconSize = 20;

export const inviteCardStatusPresentation: Record<InviteCardStatus, Pick<InviteCardPresentation, "iconKey" | "label" | "tone">> = {
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
  return {
    ...inviteCardStatusPresentation[status],
    detailTextFit: inviteCardDetailTextFit,
    iconSize: inviteCardIconSize,
    nameTextFit: inviteCardNameTextFit,
    pressableAccessibilityRole: "button"
  };
}
