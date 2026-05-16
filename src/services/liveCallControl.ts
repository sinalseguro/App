import { randomUUID } from "expo-crypto";

import {
  ApiLiveRecipient,
  ApiP2PSignal,
  apiClient,
  CreateKeyEnvelopeInput,
  SendP2PSignalInput
} from "@/services/apiClient";

export const LIVE_CALL_SIGNAL_TTL_MS = 5 * 60 * 1000;

export type LiveSignalPayload =
  | {
      callSessionId: string;
      sdp: string;
    }
  | {
      callSessionId: string;
      candidate: string;
      sdpMLineIndex?: number | null;
      sdpMid?: string | null;
      usernameFragment?: string | null;
    };

export type LiveIcePayload = Extract<LiveSignalPayload, { candidate: string }>;
export type LiveSdpPayload = Extract<LiveSignalPayload, { sdp: string }>;
export type LiveSignalKind = SendP2PSignalInput["signalType"];

type PendingSignalFilter = {
  callSessionId?: string;
  remoteSessionId: string;
  signalTypes?: LiveSignalKind[];
};

function expiresAtFromNow(now = Date.now()) {
  return new Date(now + LIVE_CALL_SIGNAL_TTL_MS).toISOString();
}

export function createLiveCallSessionId() {
  return randomUUID();
}

export async function listAcceptedLiveRecipients(remoteSessionId: string) {
  const response = await apiClient.listLiveRecipients(remoteSessionId);
  return response.recipients.filter((recipient) => recipient.devices.length > 0);
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
    if (filter.callSessionId && signal.payload.callSessionId !== filter.callSessionId) return false;
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
