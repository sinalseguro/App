import type { ProfileGateDecision } from "@/features/profiles/profilePolicy";

export type InvitationAcceptanceNotice = {
  text: string;
  title: string;
  tone: "secure" | "warning" | "danger";
};

export type InvitationAcceptanceStatusNotice = Pick<ProfileGateDecision, "message" | "title" | "tone">;

export type InvitationAcceptancePresentationInput = {
  acceptGate: ProfileGateDecision;
  acceptedOwnerName: string;
  busy: boolean;
  checkingInvitation: boolean;
  hasInvitationCode: boolean;
  invitationReady: boolean;
};

export const invitationAcceptanceScreenCopy = {
  acceptedLinksButtonLabel: "Ver meus vínculos",
  acceptButtonLabel: "Aceitar como anjo",
  acceptedButtonLabel: "Convite aceito",
  checkingButtonLabel: "Verificando convite...",
  profileButtonLabel: "Configurar perfil",
  securityNotice: {
    text: "Este app não permite entrar como outra pessoa. O vínculo só será criado com sua conta, seu aceite e autorização da pessoa que convidou.",
    title: "Limite de seguranca",
    tone: "warning" as const
  },
  subtitle: "Entre com sua própria conta para aceitar um convite de anjo.",
  title: "Convite recebido",
  validatingButtonLabel: "Validando convite..."
} as const;

export const invitationAcceptanceMessages = {
  acceptMissing: "Convite ausente ou invalido.",
  acceptRequiresServer: "Antes de aceitar, abra um convite valido gerado pelo servidor SinalSeguro.",
  accepted: (ownerName: string) => `Aceite confirmado no servidor. Você agora é anjo de ${ownerName}.`,
  invalidLink: "Abra um link de convite válido enviado por uma pessoa de confiança.",
  routeIdentified: "Convite identificado. Aceite somente se reconhecer a pessoa que enviou.",
  resumed: "Convite retomado. Verificando se ele ainda e valido no servidor...",
  unavailable: "Convite indisponivel. Solicite um novo convite a pessoa que enviou.",
  verifying: "Verificando convite seguro no servidor..."
} as const;

export function buildInvitationAcceptanceInitialStatus(hasRouteInvitationCode: boolean) {
  return hasRouteInvitationCode ? invitationAcceptanceMessages.routeIdentified : invitationAcceptanceMessages.invalidLink;
}

export function buildInvitationAcceptanceBannerTitle({
  checkingInvitation,
  hasInvitationCode,
  invitationReady
}: {
  checkingInvitation: boolean;
  hasInvitationCode: boolean;
  invitationReady: boolean;
}) {
  if (!hasInvitationCode) return "Convite ausente";
  if (checkingInvitation) return "Verificando convite";
  if (invitationReady) return "Convite valido";
  return "Convite indisponivel";
}

export function buildInvitationAcceptanceAcceptStatus({
  acceptGate,
  hasInvitationCode,
  invitationReady
}: {
  acceptGate: ProfileGateDecision;
  hasInvitationCode: boolean;
  invitationReady: boolean;
}): InvitationAcceptanceStatusNotice {
  if (!acceptGate.allowed) return acceptGate;

  if (hasInvitationCode && !invitationReady) {
    return {
      message: "Seu perfil permite aceitar convites, mas este link nao esta disponivel no servidor.",
      title: "Aceite bloqueado",
      tone: "warning"
    };
  }

  return acceptGate;
}

export function buildAcceptedOwnerNotice(ownerName: string): InvitationAcceptanceNotice | null {
  if (!ownerName) return null;

  return {
    text: `Seu aparelho está vinculado como anjo de ${ownerName}. Você só verá alertas autorizados pelo SinalSeguro.`,
    title: "Você é anjo",
    tone: "secure"
  };
}

export function buildInvitationAcceptanceButtonLabel({
  acceptedOwnerName,
  busy,
  checkingInvitation
}: {
  acceptedOwnerName: string;
  busy: boolean;
  checkingInvitation: boolean;
}) {
  if (acceptedOwnerName) return invitationAcceptanceScreenCopy.acceptedButtonLabel;
  if (busy) return invitationAcceptanceScreenCopy.validatingButtonLabel;
  if (checkingInvitation) return invitationAcceptanceScreenCopy.checkingButtonLabel;
  return invitationAcceptanceScreenCopy.acceptButtonLabel;
}

export function buildInvitationAcceptancePresentation(input: InvitationAcceptancePresentationInput) {
  const canAcceptInvitation = Boolean(
    input.hasInvitationCode && input.invitationReady && input.acceptGate.allowed && !input.acceptedOwnerName
  );

  return {
    acceptButtonDisabled: input.busy || input.checkingInvitation || !canAcceptInvitation,
    acceptButtonLabel: buildInvitationAcceptanceButtonLabel(input),
    acceptedOwnerNotice: buildAcceptedOwnerNotice(input.acceptedOwnerName),
    acceptStatus: buildInvitationAcceptanceAcceptStatus(input),
    bannerTitle: buildInvitationAcceptanceBannerTitle(input),
    canAcceptInvitation,
    showAcceptedLinksAction: Boolean(input.acceptedOwnerName),
    showProfileAction: !input.acceptGate.allowed
  };
}
