import { deleteSecureRecord, getSecureRecord, saveSecureRecord } from "@/storage/secureJsonStore";

const PENDING_INVITATION_NAMESPACE = "sinalseguro.pending-invitation.v1";
const PENDING_INVITATION_ID = "pending";
const PENDING_INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type PendingInvitationSource = "deeplink" | "web";

type PendingInvitationRecord = {
  id: typeof PENDING_INVITATION_ID;
  receivedAt: string;
  source: PendingInvitationSource;
  token: string;
};

export function normalizeInvitationTokenValue(value?: string | string[]) {
  const rawInvitationValue = Array.isArray(value) ? value[0] : value;
  return rawInvitationValue?.trim() ?? "";
}

export function extractInvitationTokenFromUrl(url?: string | null) {
  if (!url) return "";

  const [, query = ""] = url.split("?");
  const [rawQuery = "", rawHash = ""] = query.split("#");
  const hash = url.includes("#") ? url.split("#").slice(1).join("#") : rawHash;
  const candidates = [rawQuery, hash];

  for (const candidate of candidates) {
    const params = new URLSearchParams(candidate);
    const inviteCode = normalizeInvitationTokenValue(params.get("convite") ?? params.get("token") ?? undefined);
    if (inviteCode) return inviteCode;
  }

  return "";
}

export async function savePendingInvitationToken(token: string, source: PendingInvitationSource = "deeplink") {
  const normalizedInvitationCode = normalizeInvitationTokenValue(token);
  if (!normalizedInvitationCode) return null;

  const record: PendingInvitationRecord = {
    id: PENDING_INVITATION_ID,
    receivedAt: new Date().toISOString(),
    source,
    token: normalizedInvitationCode
  };

  await saveSecureRecord(PENDING_INVITATION_NAMESPACE, record);
  return record;
}

export async function getPendingInvitationToken() {
  const record = await getSecureRecord<PendingInvitationRecord>(PENDING_INVITATION_NAMESPACE, PENDING_INVITATION_ID);
  if (!record) return "";

  const receivedAt = Date.parse(record.receivedAt);
  if (!Number.isFinite(receivedAt) || Date.now() - receivedAt > PENDING_INVITATION_TTL_MS) {
    await clearPendingInvitationToken();
    return "";
  }

  return record.token;
}

export async function clearPendingInvitationToken() {
  await deleteSecureRecord(PENDING_INVITATION_NAMESPACE, PENDING_INVITATION_ID);
}
