import type { ApiEmergencySession, ApiLiveRecipient } from "@/services/apiClient";

type RecipientStatus = "accepted" | "declined" | "ended" | "queued" | "seen" | string | undefined;

export function currentEmergencyRecipientStatus(session: ApiEmergencySession): RecipientStatus {
  if (session.current_recipient_status) return session.current_recipient_status;

  const recipients = session.recipients ?? [];
  if (recipients.length === 1) return recipients[0]?.status;
  return undefined;
}

export function isActiveReceivedEmergency(session: ApiEmergencySession) {
  return Boolean(session.current_recipient) && session.status === "active" && session.phase !== "ended";
}

export function canAngelAutoAcceptIncomingEmergency(session: ApiEmergencySession) {
  if (!isActiveReceivedEmergency(session)) return false;
  const recipientStatus = currentEmergencyRecipientStatus(session);
  return recipientStatus !== "accepted" && recipientStatus !== "declined" && recipientStatus !== "ended";
}

export function canAngelStartRealtime(session: ApiEmergencySession) {
  if (!isActiveReceivedEmergency(session)) return false;
  return currentEmergencyRecipientStatus(session) === "accepted";
}

export function canOwnerStartLiveCallWithRecipient(recipient: ApiLiveRecipient | null | undefined) {
  if (!recipient) return false;
  if (recipient.relationship_role !== "angel") return false;
  if (!recipient.accepted_at) return false;
  return recipient.devices.some(
    (device) => Boolean(device.id) && Boolean(device.public_key) && Boolean(device.public_key_sha256)
  );
}
