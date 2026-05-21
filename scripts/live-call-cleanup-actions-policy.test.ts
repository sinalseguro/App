import assert from "node:assert/strict";

import { resolveLiveCallCleanupActions } from "../src/features/emergency-home/liveCallCleanupActionsPolicy";

assert.deepEqual(
  resolveLiveCallCleanupActions({
    reason: "active_package",
    shouldCleanup: false
  }),
  {
    shouldApply: false
  }
);

assert.deepEqual(
  resolveLiveCallCleanupActions({
    liveCallAction: "reset_idle_call_state",
    shouldCleanup: true,
    shouldClearAutoCallState: true,
    shouldClearLiveRemoteSession: true
  }),
  {
    liveCallAction: "reset_idle_call_state",
    shouldApply: true,
    shouldClearAutoCallState: true,
    shouldClearLiveRemoteSession: true
  }
);

assert.deepEqual(
  resolveLiveCallCleanupActions({
    liveCallAction: "stop_active_call",
    shouldCleanup: true,
    shouldClearAutoCallState: true,
    shouldClearLiveRemoteSession: true
  }),
  {
    liveCallAction: "stop_active_call",
    shouldApply: true,
    shouldClearAutoCallState: true,
    shouldClearLiveRemoteSession: true
  }
);

console.log("live-call-cleanup-actions-policy ok");
