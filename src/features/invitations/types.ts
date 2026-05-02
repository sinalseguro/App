export type InvitationStatus = "pendente" | "compartilhado" | "aceito" | "revogado" | "expirado";

export type InvitationSyncStatus = "pendente_api" | "sincronizado" | "falhou";

export type LocalInvitation = {
  id: string;
  token: string;
  displayLabel: string;
  inviteUrl: string;
  deepLinkUrl: string;
  createdAt: string;
  expiresAt: string;
  singleUse: true;
  status: InvitationStatus;
  syncStatus: InvitationSyncStatus;
};
