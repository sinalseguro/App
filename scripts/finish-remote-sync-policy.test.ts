import assert from "node:assert/strict";

import {
  resolveFinishRemoteSyncMode,
  resolveFinishRemoteSyncStartActions,
  resolveRemoteFinishFailureLog,
  resolveRemoteFinishStateAfterDirect,
  resolveRemoteFinishStateFromSync,
  shouldRetryRemoteFinishAfterDirect
} from "../src/features/emergency-home/finishRemoteSyncPolicy";
import type { EmergencyRemoteSyncState } from "../src/features/emergency/emergencySyncQueue";

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

assert.deepEqual(resolveFinishRemoteSyncStartActions(), {
  finishProgress: {
    detail: "Confirmando o encerramento seguro com a central.",
    progress: 86,
    status: "running",
    title: "Sincronizando chamado"
  },
  shouldQueueForRemoteSync: true
});

assert.deepEqual(
  resolveFinishRemoteSyncMode({
    remoteSessionIdToFinish: "session-1"
  }),
  {
    mode: "direct_finish",
    remoteSessionId: "session-1",
    shouldSyncPendingOnly: false
  }
);

assert.deepEqual(
  resolveFinishRemoteSyncMode({
    remoteSessionIdToFinish: null
  }),
  {
    mode: "pending_sync",
    shouldSyncPendingOnly: true
  }
);

assert.deepEqual(
  resolveFinishRemoteSyncMode({
    remoteSessionIdToFinish: ""
  }),
  {
    mode: "pending_sync",
    shouldSyncPendingOnly: true
  }
);

assert.equal(shouldRetryRemoteFinishAfterDirect(finishedDirect), false);

assert.deepEqual(
  resolveRemoteFinishStateAfterDirect({
    directFinishState: finishedDirect,
    packageId: "pkg-1",
    retryStates: [
      state({
        packageId: "pkg-1",
        remoteFinishStatus: "failed"
      })
    ]
  }),
  finishedDirect
);

const failedDirect = state({
  packageId: "pkg-2",
  remoteFinishReason: "temporarily unavailable",
  remoteFinishStatus: "failed",
  remoteSessionId: "session-2"
});
const retryFinished = state({
  packageId: "pkg-2",
  remoteFinishStatus: "finished",
  remoteSessionId: "session-2"
});

assert.equal(shouldRetryRemoteFinishAfterDirect(failedDirect), true);

assert.deepEqual(
  resolveRemoteFinishStateAfterDirect({
    directFinishState: failedDirect,
    packageId: "pkg-2",
    retryStates: [state({ packageId: "other", remoteFinishStatus: "failed" }), retryFinished]
  }),
  retryFinished
);

assert.deepEqual(
  resolveRemoteFinishStateAfterDirect({
    directFinishState: failedDirect,
    packageId: "pkg-2",
    retryStates: [state({ packageId: "other", remoteFinishStatus: "finished" })]
  }),
  failedDirect
);

assert.deepEqual(
  resolveRemoteFinishStateFromSync({
    packageId: "pkg-3",
    syncStates: [state({ packageId: "other" }), state({ packageId: "pkg-3", remoteFinishStatus: "pending" })]
  }),
  state({ packageId: "pkg-3", remoteFinishStatus: "pending" })
);

assert.equal(
  resolveRemoteFinishStateFromSync({
    packageId: "pkg-missing",
    syncStates: [state({ packageId: "other" })]
  }),
  undefined
);

assert.deepEqual(
  resolveRemoteFinishFailureLog({
    packageId: "pkg-1",
    platform: "android",
    remoteFinishState: finishedDirect,
    remoteSessionIdToFinish: "session-request"
  }),
  {
    remoteFinishFailed: false,
    shouldLog: false
  }
);

assert.deepEqual(
  resolveRemoteFinishFailureLog({
    packageId: "pkg-2",
    platform: "android",
    remoteFinishState: failedDirect,
    remoteSessionIdToFinish: "session-request"
  }),
  {
    logEvent: "emergency_remote_finish_sync_error",
    logPayload: {
      packageId: "pkg-2",
      platform: "android",
      remoteFinishReason: "temporarily unavailable",
      remoteSessionId: "session-request"
    },
    remoteFinishFailed: true,
    shouldLog: true
  }
);

console.log("finish-remote-sync-policy ok");
