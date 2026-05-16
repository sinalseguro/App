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

export type LiveSignalKind = SendP2PSignalInput["signalType"];

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

export async function createLiveSessionEnvelope(input: Omit<CreateKeyEnvelopeInput, "expiresAt" | "scope">) {
  return apiClient.createKeyEnvelope({
    ...input,
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

export async function receivePendingLiveSignals() {
  const pendingSignals = await apiClient.listP2PSignals();
  const consumedSignals: ApiP2PSignal[] = [];

  for (const signal of pendingSignals) {
    consumedSignals.push(await apiClient.consumeP2PSignal(signal.id));
  }

  return consumedSignals;
}

export function firstLiveRecipientDevice(recipient: ApiLiveRecipient) {
  return recipient.devices[0] ?? null;
}
