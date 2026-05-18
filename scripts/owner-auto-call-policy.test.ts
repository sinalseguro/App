import assert from "node:assert/strict";

import {
  isOwnerLiveCallActiveForSession,
  ownerAutoCallAttemptMessage,
  ownerAutoCallRecipientStatus,
  shouldAttemptOwnerAutoCall,
  type OwnerAutoCallDecisionInput
} from "../src/features/emergency-home/ownerAutoCallPolicy";

function decisionInput(input: Partial<OwnerAutoCallDecisionInput> = {}): OwnerAutoCallDecisionInput {
  return {
    alreadyStarted: false,
    cancelled: false,
    currentRemoteSessionId: undefined,
    currentStatus: "idle",
    inFlight: false,
    liveRemoteSessionId: "session-1",
    paused: false,
    ...input
  };
}

assert.equal(ownerAutoCallAttemptMessage(), "Você pediu ajuda. Avisando anjo.");

assert.equal(isOwnerLiveCallActiveForSession(decisionInput({ currentRemoteSessionId: "session-1", currentStatus: "waiting" })), true);
assert.equal(isOwnerLiveCallActiveForSession(decisionInput({ currentRemoteSessionId: "session-1", currentStatus: "connecting" })), true);
assert.equal(isOwnerLiveCallActiveForSession(decisionInput({ currentRemoteSessionId: "session-1", currentStatus: "connected" })), true);
assert.equal(isOwnerLiveCallActiveForSession(decisionInput({ currentRemoteSessionId: "session-1", currentStatus: "failed" })), false);
assert.equal(isOwnerLiveCallActiveForSession(decisionInput({ currentRemoteSessionId: "session-2", currentStatus: "connected" })), false);

assert.equal(shouldAttemptOwnerAutoCall(decisionInput()), true);
assert.equal(shouldAttemptOwnerAutoCall(decisionInput({ cancelled: true })), false);
assert.equal(shouldAttemptOwnerAutoCall(decisionInput({ paused: true })), false);
assert.equal(shouldAttemptOwnerAutoCall(decisionInput({ alreadyStarted: true })), false);
assert.equal(shouldAttemptOwnerAutoCall(decisionInput({ inFlight: true })), false);
assert.equal(shouldAttemptOwnerAutoCall(decisionInput({ liveRemoteSessionId: null })), false);
assert.equal(
  shouldAttemptOwnerAutoCall(decisionInput({ currentRemoteSessionId: "session-1", currentStatus: "connected" })),
  false
);

assert.deepEqual(ownerAutoCallRecipientStatus(0), {
  message: "Você pediu ajuda. Aguardando anjo.",
  shouldStartCall: false
});
assert.deepEqual(ownerAutoCallRecipientStatus(1), {
  message: "Anjo entrou. Chamando agora.",
  shouldStartCall: true
});

console.log("owner-auto-call-policy ok");
