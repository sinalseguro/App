import { acceptedAngelSummary, acceptedOwnerSummary } from "@/features/invitations/trustedAngelsPresentationPolicy";
import type { ApiTrustedContactRelationship } from "@/services/apiClient";

export type TrustedAngelsDashboardSummary = {
  acceptedAngelDescription: string;
  acceptedOwnerDescription: string;
  createInvitationDescription: string;
  profileDescription: string;
  readinessDescription: string;
  stateDescription: string;
  syncDescription: string;
  invitationsDescription: string;
};

export type TrustedAngelsAcceptedCounts = {
  acceptedAngelCount: number;
  acceptedOwnerCount: number;
};

export type TrustedAngelsReadinessState = {
  account: {
    secure: boolean;
    label: string;
  };
  api: {
    enabled: boolean;
    label: string;
  };
  device: {
    secure: boolean;
    label: string;
  };
};

export function buildTrustedAngelsAcceptedCounts({
  angelLinks,
  ownerLinks
}: {
  angelLinks: ApiTrustedContactRelationship[];
  ownerLinks: ApiTrustedContactRelationship[];
}): TrustedAngelsAcceptedCounts {
  return {
    acceptedAngelCount: angelLinks.filter((contact) => contact.status === "accepted").length,
    acceptedOwnerCount: ownerLinks.filter((contact) => contact.status === "accepted").length
  };
}

export function buildTrustedAngelsDashboardSummary({
  acceptedAngelCount,
  acceptedOwnerCount,
  apiSessionAvailable,
  busy,
  deviceReady,
  invitationCount,
  invitationGateAllowed,
  noticeTitle,
  profileTitle
}: {
  acceptedAngelCount: number;
  acceptedOwnerCount: number;
  apiSessionAvailable: boolean;
  busy: boolean;
  deviceReady: boolean;
  invitationCount: number;
  invitationGateAllowed: boolean;
  noticeTitle: string;
  profileTitle: string;
}): TrustedAngelsDashboardSummary {
  return {
    acceptedAngelDescription: acceptedAngelSummary(acceptedAngelCount),
    acceptedOwnerDescription: acceptedOwnerSummary(acceptedOwnerCount),
    createInvitationDescription: invitationGateAllowed ? (apiSessionAvailable ? "API" : "Local") : "Bloqueado",
    invitationsDescription: invitationCount ? `${invitationCount} item` : "Nenhum",
    profileDescription: profileTitle,
    readinessDescription: deviceReady ? "Dispositivo" : "Pendente",
    stateDescription: noticeTitle,
    syncDescription: busy ? "Sincronizando" : "Sincronizar"
  };
}

export function buildTrustedAngelsReadinessState({
  apiEnabled,
  apiSessionAvailable,
  deviceReady
}: {
  apiEnabled: boolean;
  apiSessionAvailable: boolean;
  deviceReady: boolean;
}): TrustedAngelsReadinessState {
  return {
    account: {
      label: apiSessionAvailable ? "Conta conectada" : "Conta local",
      secure: apiSessionAvailable
    },
    api: {
      enabled: apiEnabled,
      label: apiEnabled ? "API configurada" : "API desativada"
    },
    device: {
      label: deviceReady ? "Dispositivo registrado" : "Dispositivo pendente",
      secure: deviceReady
    }
  };
}
