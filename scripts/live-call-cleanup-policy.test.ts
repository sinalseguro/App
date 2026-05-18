import assert from "node:assert/strict";

import { resolveLiveCallCleanupDecision } from "../src/features/emergency-home/liveCallCleanupPolicy";

assert.deepEqual(
  resolveLiveCallCleanupDecision({
    activePackageId: "pkg-1",
    finishInProgress: false,
    liveAudioCallStatus: "connected",
    liveRemoteSessionId: "session-1",
    mediaStopPending: false,
    startInProgress: false
  }),
  {
    reason: "active_package",
    shouldCleanup: false
  }
);

assert.deepEqual(
  resolveLiveCallCleanupDecision({
    finishInProgress: false,
    liveAudioCallStatus: "idle",
    liveRemoteSessionId: "session-1",
    mediaStopPending: false,
    startInProgress: true
  }),
  {
    reason: "start_in_progress",
    shouldCleanup: false
  }
);

assert.deepEqual(
  resolveLiveCallCleanupDecision({
    finishInProgress: false,
    liveAudioCallStatus: "idle",
    liveRemoteSessionId: "session-1",
    mediaStopPending: true,
    startInProgress: false
  }),
  {
    reason: "media_stop_pending",
    shouldCleanup: false
  }
);

assert.deepEqual(
  resolveLiveCallCleanupDecision({
    finishInProgress: true,
    liveAudioCallStatus: "idle",
    liveRemoteSessionId: "session-1",
    mediaStopPending: false,
    startInProgress: false
  }),
  {
    reason: "finish_in_progress",
    shouldCleanup: false
  }
);

assert.deepEqual(
  resolveLiveCallCleanupDecision({
    finishInProgress: false,
    liveAudioCallStatus: "idle",
    mediaStopPending: false,
    startInProgress: false
  }),
  {
    reason: "nothing_to_cleanup",
    shouldCleanup: false
  }
);

assert.deepEqual(
  resolveLiveCallCleanupDecision({
    finishInProgress: false,
    liveAudioCallStatus: "idle",
    liveRemoteSessionId: "session-1",
    mediaStopPending: false,
    startInProgress: false
  }),
  {
    liveCallAction: "reset_idle_call_state",
    shouldCleanup: true,
    shouldClearAutoCallState: true,
    shouldClearLiveRemoteSession: true
  }
);

assert.deepEqual(
  resolveLiveCallCleanupDecision({
    finishInProgress: false,
    liveAudioCallStatus: "connected",
    mediaStopPending: false,
    startInProgress: false
  }),
  {
    liveCallAction: "stop_active_call",
    shouldCleanup: true,
    shouldClearAutoCallState: true,
    shouldClearLiveRemoteSession: true
  }
);

console.log("live-call-cleanup-policy ok");
