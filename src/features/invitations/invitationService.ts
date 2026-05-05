import * as Crypto from "expo-crypto";
import { deleteSecureRecord, listSecureRecords, saveSecureRecord } from "@/storage/secureJsonStore";
import { LocalInvitation } from "./types";

const INVITATION_NAMESPACE = "sinalseguro.invitations.v1";
const PUBLIC_INVITE_URL = "https://www.sinalseguro.com.br/baixar";

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

export async function createLocalInvitation(displayLabel = "Anjo de confianca") {
  const now = new Date();
  const invitationCode = await createOpaqueToken();
  const invitation: LocalInvitation = {
    id: Crypto.randomUUID(),
    token: invitationCode,
    displayLabel,
    inviteUrl: `${PUBLIC_INVITE_URL}?convite=${encodeURIComponent(invitationCode)}`,
    deepLinkUrl: `sinalseguro://convite?convite=${encodeURIComponent(invitationCode)}`,
    createdAt: now.toISOString(),
    expiresAt: addDays(now, 7).toISOString(),
    singleUsePolicy: "backend_validation_required",
    status: "pendente",
    syncStatus: "local_pre_invite"
  };

  await saveSecureRecord(INVITATION_NAMESPACE, invitation);
  return invitation;
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
