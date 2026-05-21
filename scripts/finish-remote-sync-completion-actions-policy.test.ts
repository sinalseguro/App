import assert from "node:assert/strict";

import type { EmergencyRemoteSyncState } from "../src/features/emergency/emergencySyncQueue";
import {
  resolveFinishRemoteSyncCompletionActions,
  resolveFinishRemoteSyncPendingResultActions
} from "../src/features/emergency-home/finishRemoteSyncCompletionActionsPolicy";

function state(
  patch: Partial<EmergencyRemoteSyncState> & Pick<EmergencyRemoteSyncState, "packageId">
): EmergencyRemoteSyncState {
  return {
    attempts: 0,
    id: patch.packageId,
    recipientCount: 1,
    status: "sent_to_ec2",
    updatedAt: "2026-05-18T00:00:00.000Z",
    ...patch
  };
}

const pending = state({
  packageId: "pkg-1",
  remoteFinishStatus: "pending",
  remoteSessionId: "session-1"
});
const failed = state({
  packageId: "pkg-2",
  remoteFinishReason: "temporarily unavailable",
  remoteFinishStatus: "failed",
  remoteSessionId: "session-2"
});

assert.deepEqual(
  resolveFinishRemoteSyncPendingResultActions({
    packageId: "pkg-1",
    syncStates: [state({ packageId: "other", remoteFinishStatus: "finished" }), pending]
  }),
  {
    remoteFinishState: pending
  }
);

assert.deepEqual(
  resolveFinishRemoteSyncPendingResultActions({
    packageId: "missing",
    syncStates: [pending]
  }),
  {
    remoteFinishState: undefined
  }
);

assert.deepEqual(
  resolveFinishRemoteSyncCompletionActions({
    packageId: "pkg-1",
    platform: "android",
    remoteFinishState: pending,
    remoteSessionIdToFinish: "session-request"
  }),
  {
    failureLog: {
      remoteFinishFailed: false,
      shouldLog: false
    },
    remoteFinishFailed: false
  }
);

assert.deepEqual(
  resolveFinishRemoteSyncCompletionActions({
    packageId: "pkg-2",
    platform: "android",
    remoteFinishState: failed,
    remoteSessionIdToFinish: "session-request"
  }),
  {
    failureLog: {
      logEvent: "emergency_remote_finish_sync_error",
      logPayload: {
        packageId: "pkg-2",
        platform: "android",
        remoteFinishReason: "temporarily unavailable",
        remoteSessionId: "session-request"
      },
      remoteFinishFailed: true,
      shouldLog: true
    },
    remoteFinishFailed: true
  }
);

console.log("finish-remote-sync-completion-actions-policy ok");
