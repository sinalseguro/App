export type InvitationStatus = "pendente" | "compartilhado" | "aceito" | "revogado" | "expirado";

export type InvitationSyncStatus = "local_pre_invite" | "backend_validated" | "failed";

export type LocalInvitation = {
  id: string;
  token: string;
  displayLabel: string;
  inviteUrl: string;
  deepLinkUrl: string;
  createdAt: string;
  expiresAt: string;
  singleUsePolicy: "backend_validation_required";
  status: InvitationStatus;
  syncStatus: InvitationSyncStatus;
};
