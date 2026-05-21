import assert from "node:assert/strict";

import type { EmergencyRemoteSyncState } from "../src/features/emergency/emergencySyncQueue";
import {
  resolveFinishRemoteSyncDirectResultActions,
  resolveFinishRemoteSyncDirectRetryActions
} from "../src/features/emergency-home/finishRemoteSyncDirectActionsPolicy";

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

const finishedDirect = state({
  packageId: "pkg-1",
  remoteFinishStatus: "finished",
  remoteSessionId: "session-1"
});
const failedDirect = state({
  packageId: "pkg-2",
  remoteFinishStatus: "failed",
  remoteSessionId: "session-2"
});
const retryFinished = state({
  packageId: "pkg-2",
  remoteFinishStatus: "finished",
  remoteSessionId: "session-2"
});

assert.deepEqual(resolveFinishRemoteSyncDirectRetryActions({ directFinishState: finishedDirect }), {
  shouldSyncPendingAfterDirect: false
});

assert.deepEqual(resolveFinishRemoteSyncDirectRetryActions({ directFinishState: failedDirect }), {
  shouldSyncPendingAfterDirect: true
});

assert.deepEqual(
  resolveFinishRemoteSyncDirectResultActions({
    directFinishState: finishedDirect,
    packageId: "pkg-1",
    retryStates: [state({ packageId: "pkg-1", remoteFinishStatus: "failed" })]
  }),
  {
    remoteFinishState: finishedDirect
  }
);

assert.deepEqual(
  resolveFinishRemoteSyncDirectResultActions({
    directFinishState: failedDirect,
    packageId: "pkg-2",
    retryStates: [state({ packageId: "other", remoteFinishStatus: "finished" }), retryFinished]
  }),
  {
    remoteFinishState: retryFinished
  }
);

console.log("finish-remote-sync-direct-actions-policy ok");
