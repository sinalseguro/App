import assert from "node:assert/strict";

import {
  resolveOwnerAutoCallErrorActions,
  resolveOwnerAutoCallFinallyActions,
  resolveOwnerAutoCallRecipientActions,
  resolveOwnerAutoCallStartResultActions
} from "../src/features/emergency-home/ownerAutoCallResultActionsPolicy";

assert.deepEqual(resolveOwnerAutoCallRecipientActions({ recipientCount: 0 }), {
  shouldPrepareAndStartCall: false,
  statusMessage: "Você pediu ajuda. Aguardando anjo."
});

assert.deepEqual(resolveOwnerAutoCallRecipientActions({ recipientCount: 2 }), {
  shouldPrepareAndStartCall: true,
  statusMessage: "Anjo entrou. Chamando agora."
});

assert.deepEqual(resolveOwnerAutoCallStartResultActions({ remoteSessionId: "session-1", started: false }), {
  shouldMarkStarted: false
});

assert.deepEqual(resolveOwnerAutoCallStartResultActions({ remoteSessionId: "session-1", started: true }), {
  remoteSessionId: "session-1",
  shouldMarkStarted: true
});

assert.deepEqual(resolveOwnerAutoCallErrorActions({ platform: "android", remoteSessionId: "session-1" }), {
  log: {
    event: "emergency_live_call_auto_start_error",
    payload: {
      platform: "android",
      remoteSessionId: "session-1"
    }
  }
});

assert.deepEqual(resolveOwnerAutoCallFinallyActions(), {
  shouldClearInFlight: true
});

console.log("owner-auto-call-result-actions-policy ok");
