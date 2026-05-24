export type InviteCardStatus = "pendente" | "compartilhado" | "aceito" | "revogado" | "expirado";

export type InviteCardIconKey = "check-circle" | "clock" | "shield-alert" | "shield-check" | "x-circle";

export type InviteCardTone = "danger" | "primary" | "secure" | "warning";

export type InviteCardTextFit = {
  adjustsFontSizeToFit: true;
  maxFontSizeMultiplier: number;
  minimumFontScale: number;
  numberOfLines: number;
};

export type InviteCardPresentation = {
  descriptionTextFit: InviteCardTextFit;
  detailTextFit: InviteCardTextFit;
  iconKey: InviteCardIconKey;
  iconSize: number;
  label: string;
  nameTextFit: InviteCardTextFit;
  pressableAccessibilityRole: "button";
  statusTextFit: InviteCardTextFit;
  tone: InviteCardTone;
};

export const inviteCardNameTextFit: InviteCardTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.82,
  numberOfLines: 1
};

export const inviteCardDetailTextFit: InviteCardTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.84,
  numberOfLines: 1
};

export const inviteCardStatusTextFit: InviteCardTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.84,
  numberOfLines: 1
};

export const inviteCardDescriptionTextFit: InviteCardTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.86,
  numberOfLines: 3
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
    descriptionTextFit: inviteCardDescriptionTextFit,
    detailTextFit: inviteCardDetailTextFit,
    iconSize: inviteCardIconSize,
    nameTextFit: inviteCardNameTextFit,
    pressableAccessibilityRole: "button",
    statusTextFit: inviteCardStatusTextFit
  };
}
