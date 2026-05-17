import { randomUUID } from "expo-crypto";

import {
  ApiLiveRecipient,
  ApiP2PSignal,
  apiClient,
  CreateKeyEnvelopeInput,
  SendP2PSignalInput
} from "@/services/apiClient";

export const LIVE_CALL_SIGNAL_TTL_MS = 5 * 60 * 1000;

export type LiveSignalRole = "angel" | "owner";

type LiveSignalRoutingMetadata = {
  recipientDeviceId?: string | null;
  recipientRole?: LiveSignalRole;
  senderDeviceId?: string | null;
  senderRole?: LiveSignalRole;
};

export type LiveSignalPayload =
  | ({
      callSessionId: string;
      sdp: string;
    } & LiveSignalRoutingMetadata)
  | ({
      callSessionId: string;
      candidate: string;
      sdpMLineIndex?: number | null;
      sdpMid?: string | null;
      usernameFragment?: string | null;
    } & LiveSignalRoutingMetadata);

export type LiveIcePayload = Extract<LiveSignalPayload, { candidate: string }>;
export type LiveSdpPayload = Extract<LiveSignalPayload, { sdp: string }>;
export type LiveSignalKind = SendP2PSignalInput["signalType"];

type PendingSignalFilter = {
  callSessionId?: string;
  remoteSessionId: string;
  recipientDeviceId?: string | null;
  recipientId?: string;
  recipientRole?: LiveSignalRole;
  requireDeviceRouting?: boolean;
  senderDeviceId?: string | null;
  senderId?: string;
  senderRole?: LiveSignalRole;
  signalTypes?: LiveSignalKind[];
};

function expiresAtFromNow(now = Date.now()) {
  return new Date(now + LIVE_CALL_SIGNAL_TTL_MS).toISOString();
}

export function createLiveCallSessionId() {
  return randomUUID();
}

export function isAllowedLiveSignalRoute(signalType: LiveSignalKind, payload: LiveSignalPayload) {
  if (!payload.senderDeviceId || !payload.recipientDeviceId || !payload.senderRole || !payload.recipientRole) return false;
  if (payload.senderRole === payload.recipientRole) return false;
  if (payload.senderRole === "owner" && payload.recipientRole === "angel") {
    return signalType === "offer" || signalType === "ice";
  }
  if (payload.senderRole === "angel" && payload.recipientRole === "owner") {
    return signalType === "answer" || signalType === "ice";
  }
  return false;
}

export async function listAcceptedLiveRecipients(remoteSessionId: string) {
  const response = await apiClient.listLiveRecipients(remoteSessionId);
  return response.recipients.filter((recipient) => recipient.relationship_role === "angel" && recipient.devices.length > 0);
}

export async function createLiveSessionEnvelope(
  input: Omit<CreateKeyEnvelopeInput, "algorithm" | "encryptedKey" | "expiresAt" | "scope"> &
    Partial<Pick<CreateKeyEnvelopeInput, "algorithm" | "encryptedKey">>
) {
  return apiClient.createKeyEnvelope({
    ...input,
    algorithm: input.algorithm ?? "webrtc-dtls-srtp-v1",
    expiresAt: expiresAtFromNow(),
    scope: "live_session"
  });
}

export async function sendLiveSignal(input: {
  payload: LiveSignalPayload;
  recipientId: string;
  remoteSessionId: string;
  signalType: LiveSignalKind;
}) {
  return apiClient.sendP2PSignal({
    emergencySessionId: input.remoteSessionId,
    expiresAt: expiresAtFromNow(),
    payload: input.payload,
    recipientId: input.recipientId,
    signalType: input.signalType
  });
}

function hasAllowedSignalPayload(signal: ApiP2PSignal): signal is ApiP2PSignal & { payload: LiveSignalPayload } {
  const payload = signal.payload;
  if (!payload || typeof payload !== "object") return false;
  if (typeof payload.callSessionId !== "string" || !payload.callSessionId.trim()) return false;

  if (signal.signal_type === "offer" || signal.signal_type === "answer") {
    return typeof payload.sdp === "string" && Boolean(payload.sdp.trim());
  }

  if (signal.signal_type === "ice") {
    return typeof payload.candidate === "string" && Boolean(payload.candidate.trim());
  }

  return false;
}

export async function listPendingLiveSignalsForSession(filter: PendingSignalFilter) {
  const pendingSignals = await apiClient.listP2PSignals();
  const allowedTypes = filter.signalTypes ? new Set(filter.signalTypes) : null;

  return pendingSignals.filter((signal) => {
    if (signal.emergency_session !== filter.remoteSessionId) return false;
    if (allowedTypes && !allowedTypes.has(signal.signal_type as LiveSignalKind)) return false;
    if (!hasAllowedSignalPayload(signal)) return false;
    if (!isAllowedLiveSignalRoute(signal.signal_type as LiveSignalKind, signal.payload)) return false;
    if (filter.callSessionId && signal.payload.callSessionId !== filter.callSessionId) return false;
    if (filter.senderId && signal.sender !== filter.senderId) return false;
    if (filter.recipientId && signal.recipient !== filter.recipientId) return false;
    if (filter.requireDeviceRouting && (!signal.payload.senderDeviceId || !signal.payload.recipientDeviceId)) return false;
    if (filter.senderDeviceId && signal.payload.senderDeviceId !== filter.senderDeviceId) return false;
    if (filter.recipientDeviceId && signal.payload.recipientDeviceId !== filter.recipientDeviceId) return false;
    if (filter.senderRole && signal.payload.senderRole !== filter.senderRole) return false;
    if (filter.recipientRole && signal.payload.recipientRole !== filter.recipientRole) return false;
    return true;
  }) as Array<ApiP2PSignal & { payload: LiveSignalPayload }>;
}

export async function consumeLiveSignal(signalId: string) {
  return apiClient.consumeP2PSignal(signalId);
}

export async function receivePendingLiveSignalsForSession(filter: PendingSignalFilter) {
  const pendingSignals = await listPendingLiveSignalsForSession(filter);
  const consumedSignals: Array<ApiP2PSignal & { payload: LiveSignalPayload }> = [];

  for (const signal of pendingSignals) {
    await consumeLiveSignal(signal.id);
    consumedSignals.push(signal);
  }

  return consumedSignals;
}

export async function receivePendingLiveSignals() {
  throw new Error("Use receivePendingLiveSignalsForSession com filtro por ocorrencia e sessao de chamada.");
}

export function firstLiveRecipientDevice(recipient: ApiLiveRecipient) {
  return recipient.devices[0] ?? null;
}
