import type { LocalInvitation } from "@/features/invitations/types";
import type { ProfileGateDecision } from "@/features/profiles/profilePolicy";
import type { ApiTrustedContact } from "@/services/apiClient";

export const trustedAngelActionMessages = {
  createSuccess: "Convite seguro criado. Ele é único, validado no servidor e tem validade limitada.",
  createStart: "Gerando convite seguro no servidor...",
  createUnknownFailure: "Não foi possível criar convite agora.",
  invitationRevokeFailure: "Não foi possível revogar convite agora.",
  invitationRevokeStart: "Revogando convite...",
  invitationRevokeSuccess: "Convite revogado.",
  sessionExpired: "Sessao expirada. Entre com Google novamente para criar convite seguro.",
  trustedContactRevokeFailure: "Não foi possível revogar vínculo agora.",
  trustedContactRevokeStart: "Revogando vínculo...",
  trustedContactRevokeSuccess: "Vínculo revogado."
} as const;

export type TrustedAngelShareStartDecision =
  | {
      kind: "blocked";
      dialog: "profile_block";
      status: string;
    }
  | {
      kind: "allowed";
      label: string;
      status: string;
    };

export function resolveTrustedAngelShareStart({
  gate,
  inviteLabel
}: {
  gate: ProfileGateDecision;
  inviteLabel: string;
}): TrustedAngelShareStartDecision {
  if (!gate.allowed) {
    return {
      dialog: "profile_block",
      kind: "blocked",
      status: gate.message
    };
  }

  return {
    kind: "allowed",
    label: inviteLabel.trim() || "Anjo de confiança",
    status: trustedAngelActionMessages.createStart
  };
}

export function resolveTrustedAngelShareFailure({
  isUnauthorized,
  message
}: {
  isUnauthorized: boolean;
  message: string;
}) {
  if (isUnauthorized) {
    return {
      clearSession: true,
      closeDialog: true,
      status: trustedAngelActionMessages.sessionExpired
    };
  }

  return {
    clearSession: false,
    closeDialog: message.includes("Entre com Google"),
    status: message || trustedAngelActionMessages.createUnknownFailure
  };
}

export function buildTrustedAngelInvitationRevocationPlan({
  apiSessionAvailable,
  invitation,
  localInvitationIds
}: {
  apiSessionAvailable: boolean;
  invitation: LocalInvitation;
  localInvitationIds: string[];
}) {
  return {
    backendInvitationId: invitation.backendInvitationId,
    localInvitationId: invitation.id,
    shouldRevokeBackend: Boolean(invitation.backendInvitationId && apiSessionAvailable),
    shouldRevokeLocal: localInvitationIds.includes(invitation.id),
    startStatus: trustedAngelActionMessages.invitationRevokeStart,
    successStatus: trustedAngelActionMessages.invitationRevokeSuccess
  };
}

export function buildTrustedAngelContactRevocationPlan(contact: ApiTrustedContact) {
  return {
    cacheRelationshipId: contact.id,
    trustedContactId: contact.id,
    startStatus: trustedAngelActionMessages.trustedContactRevokeStart,
    successStatus: trustedAngelActionMessages.trustedContactRevokeSuccess
  };
}

export function resolveTrustedAngelActionFailure(message: string, fallback: string) {
  return message || fallback;
}
