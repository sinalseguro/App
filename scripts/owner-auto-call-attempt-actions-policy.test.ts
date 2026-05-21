import assert from "node:assert/strict";

import { resolveOwnerAutoCallAttemptActions } from "../src/features/emergency-home/ownerAutoCallAttemptActionsPolicy";
import type { OwnerAutoCallDecisionInput } from "../src/features/emergency-home/ownerAutoCallPolicy";

function input(overrides: Partial<OwnerAutoCallDecisionInput> = {}) {
  return {
    alreadyStarted: false,
    cancelled: false,
    currentRemoteSessionId: undefined,
    currentStatus: "idle",
    inFlight: false,
    liveRemoteSessionId: "session-1",
    paused: false,
    platform: "android",
    ...overrides
  } satisfies OwnerAutoCallDecisionInput & { platform: string };
}

assert.deepEqual(resolveOwnerAutoCallAttemptActions(input({ liveRemoteSessionId: null })), {
  shouldAttempt: false,
  shouldSetInFlight: false
});

assert.deepEqual(resolveOwnerAutoCallAttemptActions(input({ alreadyStarted: true })), {
  shouldAttempt: false,
  shouldSetInFlight: false
});

assert.deepEqual(
  resolveOwnerAutoCallAttemptActions(input({ currentRemoteSessionId: "session-1", currentStatus: "connected" })),
  {
    shouldAttempt: false,
    shouldSetInFlight: false
  }
);

assert.deepEqual(resolveOwnerAutoCallAttemptActions(input()), {
  log: {
    event: "emergency_live_call_auto_start_attempt",
    payload: {
      platform: "android",
      remoteSessionId: "session-1"
    }
  },
  shouldAttempt: true,
  shouldSetInFlight: true,
  statusMessage: "Você pediu ajuda. Avisando anjo."
});

console.log("owner-auto-call-attempt-actions-policy ok");
