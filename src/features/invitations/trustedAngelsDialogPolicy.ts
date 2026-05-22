import type { InvitationStatus, InvitationSyncStatus } from "@/features/invitations/types";
import type { TrustedAngelsPanel } from "@/features/invitations/trustedAngelsRefreshPolicy";

export type TrustedAngelsDialogKind = "invite" | "revoke_invitation" | "revoke_contact" | "profile_block" | null;

export type TrustedAngelsDialogVisibility = {
  angelLinksPanel: boolean;
  invitationsPanel: boolean;
  inviteDialog: boolean;
  ownerLinksPanel: boolean;
  profileBlockDialog: boolean;
  readinessPanel: boolean;
  revokeContactDialog: boolean;
  revokeInvitationDialog: boolean;
  statePanel: boolean;
};

export type TrustedAngelsDialogActionLabels = {
  revokeContactLabel: string;
  revokeInvitationLabel: string;
  shareInviteLabel: string;
};

export function buildTrustedAngelsDialogVisibility({
  dialogKind,
  panel
}: {
  dialogKind: TrustedAngelsDialogKind;
  panel: TrustedAngelsPanel;
}): TrustedAngelsDialogVisibility {
  return {
    angelLinksPanel: panel === "sou_anjo",
    invitationsPanel: panel === "convites",
    inviteDialog: dialogKind === "invite",
    ownerLinksPanel: panel === "anjos",
    profileBlockDialog: dialogKind === "profile_block",
    readinessPanel: panel === "prontidao",
    revokeContactDialog: dialogKind === "revoke_contact",
    revokeInvitationDialog: dialogKind === "revoke_invitation",
    statePanel: panel === "estado"
  };
}

export function canShowTrustedAngelInvitationRevocationAction(status: InvitationStatus) {
  return status === "pendente" || status === "compartilhado";
}

export function buildTrustedAngelInvitationCardKey({
  id,
  syncStatus
}: {
  id: string;
  syncStatus: InvitationSyncStatus;
}) {
  return `${syncStatus}-${id}`;
}

export function buildTrustedAngelsDialogActionLabels({ busy }: { busy: boolean }): TrustedAngelsDialogActionLabels {
  return {
    revokeContactLabel: busy ? "Revogando..." : "Revogar vínculo",
    revokeInvitationLabel: busy ? "Revogando..." : "Revogar convite",
    shareInviteLabel: busy ? "Criando..." : "Compartilhar convite"
  };
}
