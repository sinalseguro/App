import assert from "node:assert/strict";

import { resolveFinishRemoteSyncRequestActions } from "../src/features/emergency-home/finishRemoteSyncRequestActionsPolicy";

assert.deepEqual(
  resolveFinishRemoteSyncRequestActions({
    remoteSessionIdToFinish: "session-1"
  }),
  {
    mode: {
      mode: "direct_finish",
      remoteSessionId: "session-1",
      shouldSyncPendingOnly: false
    },
    startActions: {
      finishProgress: {
        detail: "Confirmando o encerramento seguro com a central.",
        progress: 86,
        status: "running",
        title: "Sincronizando chamado"
      },
      shouldQueueForRemoteSync: true
    }
  }
);

assert.deepEqual(
  resolveFinishRemoteSyncRequestActions({
    remoteSessionIdToFinish: null
  }),
  {
    mode: {
      mode: "pending_sync",
      shouldSyncPendingOnly: true
    },
    startActions: {
      finishProgress: {
        detail: "Confirmando o encerramento seguro com a central.",
        progress: 86,
        status: "running",
        title: "Sincronizando chamado"
      },
      shouldQueueForRemoteSync: true
    }
  }
);

console.log("finish-remote-sync-request-actions-policy ok");
