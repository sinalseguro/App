export type InvitationStatus = "pendente" | "compartilhado" | "aceito" | "revogado" | "expirado";

export type InvitationSyncStatus = "local_pre_invite" | "backend_validated" | "failed";

export type LocalInvitation = {
  id: string;
  backendInvitationId?: string;
  trustedContactId?: string;
  token: string;
  displayLabel: string;
  inviteUrl: string;
  deepLinkUrl: string;
  createdAt: string;
  expiresAt: string;
  singleUsePolicy: "backend_validation_required" | "backend_single_use_enforced";
  status: InvitationStatus;
  syncStatus: InvitationSyncStatus;
};
