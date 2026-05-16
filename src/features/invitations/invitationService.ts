import * as Crypto from "expo-crypto";
import { deleteSecureRecord, listSecureRecords, saveSecureRecord } from "@/storage/secureJsonStore";
import { ApiTrustedContactRelationship, apiClient } from "@/services/apiClient";
import { deviceBindingService } from "@/services/deviceBinding";
import { syncActiveProtectionProfileToApi } from "@/features/profiles/profileStore";
import { LocalInvitation } from "./types";

const INVITATION_NAMESPACE = "sinalseguro.invitations.v1";
const PUBLIC_INVITE_URL = "https://www.sinalseguro.com.br/convite";

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

async function createOpaqueToken() {
  const entropy = `${Crypto.randomUUID()}.${Crypto.randomUUID()}.${Date.now()}`;
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, entropy);
  return digest.slice(0, 40);
}

export function buildInvitationShareText(invitation: LocalInvitation) {
  return [
    "Voce recebeu um convite para ser anjo de confianca no SinalSeguro.",
    "Instale o app pelo link abaixo. O vinculo sera confirmado com sua propria conta.",
    invitation.inviteUrl,
    "",
    "Use este convite apenas se reconhecer a pessoa que enviou."
  ].join("\n");
}

function buildInvitationUrls(token: string, inviteUrl?: string) {
  const encodedInvitationCode = encodeURIComponent(token);
  return {
    deepLinkUrl: `sinalseguro://convite?convite=${encodedInvitationCode}`,
    inviteUrl: inviteUrl ?? `${PUBLIC_INVITE_URL}#convite=${encodedInvitationCode}`
  };
}

async function createBackendInvitation(displayLabel: string): Promise<LocalInvitation | null> {
  const currentSession = await apiClient.getStoredSession();
  if (!currentSession) return null;

  await deviceBindingService.registerAuthenticatedDevice();
  await syncActiveProtectionProfileToApi();
  const trustedContact = await apiClient.createTrustedContact({
    canReceiveLocation: false,
    canReceiveMedia: false,
    displayLabel
  });
  const invitation = await apiClient.createInvitation({
    displayLabel,
    trustedContactId: trustedContact.id
  });

  if (!invitation.token) {
    throw new Error("A API nao retornou token claro para compartilhamento unico.");
  }

  const urls = buildInvitationUrls(invitation.token, invitation.invite_url);
  return {
    id: invitation.id,
    backendInvitationId: invitation.id,
    trustedContactId: trustedContact.id,
    token: invitation.token,
    displayLabel: invitation.display_label,
    inviteUrl: urls.inviteUrl,
    deepLinkUrl: urls.deepLinkUrl,
    createdAt: invitation.created_at,
    expiresAt: invitation.expires_at,
    singleUsePolicy: "backend_single_use_enforced",
    status: "pendente",
    syncStatus: "backend_validated"
  };
}

async function createLocalPreInvitation(displayLabel: string) {
  const now = new Date();
  const invitationCode = await createOpaqueToken();
  const urls = buildInvitationUrls(invitationCode);
  const invitation: LocalInvitation = {
    id: Crypto.randomUUID(),
    token: invitationCode,
    displayLabel,
    inviteUrl: urls.inviteUrl,
    deepLinkUrl: urls.deepLinkUrl,
    createdAt: now.toISOString(),
    expiresAt: addDays(now, 7).toISOString(),
    singleUsePolicy: "backend_validation_required",
    status: "pendente",
    syncStatus: "local_pre_invite"
  };

  return invitation;
}

export async function createLocalInvitation(displayLabel = "Anjo de confianca") {
  const invitation = (await createBackendInvitation(displayLabel)) ?? (await createLocalPreInvitation(displayLabel));
  await saveSecureRecord(INVITATION_NAMESPACE, invitation);
  return invitation;
}

export async function acceptBackendInvitation(
  token: string,
  displayLabel?: string
): Promise<ApiTrustedContactRelationship> {
  const currentSession = await apiClient.getStoredSession();
  if (!currentSession) {
    throw new Error("Entre com sua propria conta SinalSeguro antes de aceitar o convite.");
  }

  await syncActiveProtectionProfileToApi();
  await deviceBindingService.registerAuthenticatedDevice();
  return apiClient.acceptInvitation({ displayLabel, token });
}

export async function listLocalInvitations() {
  const invitations = await listSecureRecords<LocalInvitation>(INVITATION_NAMESPACE);
  const now = Date.now();

  return invitations.map((invitation) => {
    if (invitation.status === "pendente" && new Date(invitation.expiresAt).getTime() < now) {
      return { ...invitation, status: "expirado" as const };
    }

    return invitation;
  });
}

export async function markInvitationShared(invitationId: string) {
  const invitations = await listLocalInvitations();
  const invitation = invitations.find((item) => item.id === invitationId);
  if (!invitation) return undefined;

  const updated: LocalInvitation = {
    ...invitation,
    status: invitation.status === "pendente" ? "compartilhado" : invitation.status
  };

  await saveSecureRecord(INVITATION_NAMESPACE, updated);
  return updated;
}

export async function revokeLocalInvitation(invitationId: string) {
  await deleteSecureRecord(INVITATION_NAMESPACE, invitationId);
}
