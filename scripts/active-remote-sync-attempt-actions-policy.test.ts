import assert from "node:assert/strict";

import { resolveActiveRemoteSyncAttemptActions } from "../src/features/emergency-home/activeRemoteSyncAttemptActionsPolicy";

assert.deepEqual(
  resolveActiveRemoteSyncAttemptActions({
    activePackageId: "pkg-1",
    cancelled: true,
    inFlight: false,
    liveRemoteSessionId: null,
    platform: "android",
    source: "resume"
  }),
  {
    reason: "cancelled",
    shouldAttempt: false,
    shouldSetInFlight: false
  }
);

assert.deepEqual(
  resolveActiveRemoteSyncAttemptActions({
    activePackageId: null,
    cancelled: false,
    inFlight: false,
    liveRemoteSessionId: null,
    platform: "android",
    source: "resume"
  }),
  {
    reason: "missing_package",
    shouldAttempt: false,
    shouldSetInFlight: false
  }
);

assert.deepEqual(
  resolveActiveRemoteSyncAttemptActions({
    activePackageId: "pkg-1",
    cancelled: false,
    inFlight: true,
    liveRemoteSessionId: null,
    platform: "android",
    source: "retry"
  }),
  {
    reason: "in_flight",
    shouldAttempt: false,
    shouldSetInFlight: false
  }
);

assert.deepEqual(
  resolveActiveRemoteSyncAttemptActions({
    activePackageId: "pkg-1",
    cancelled: false,
    inFlight: false,
    liveRemoteSessionId: "session-1",
    platform: "android",
    source: "retry"
  }),
  {
    reason: "has_remote_session",
    shouldAttempt: false,
    shouldSetInFlight: false
  }
);

assert.deepEqual(
  resolveActiveRemoteSyncAttemptActions({
    activePackageId: "pkg-1",
    cancelled: false,
    inFlight: false,
    liveRemoteSessionId: null,
    platform: "android",
    source: "resume"
  }),
  {
    log: {
      event: "emergency_active_remote_sync_attempt",
      payload: {
        packageId: "pkg-1",
        platform: "android",
        source: "resume"
      }
    },
    shouldAttempt: true,
    shouldSetInFlight: true
  }
);

console.log("active-remote-sync-attempt-actions-policy ok");
