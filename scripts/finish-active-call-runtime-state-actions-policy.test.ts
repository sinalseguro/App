import assert from "node:assert/strict";

import { resolveFinishActiveCallRuntimeStateActions } from "../src/features/emergency-home/finishActiveCallRuntimeStateActionsPolicy";
import { resolveFinishActiveCallRuntimeStartActions } from "../src/features/emergency-home/finishActiveCallRuntimeStartPolicy";

const androidStartActions = resolveFinishActiveCallRuntimeStartActions({
  platform: "android",
  remoteSessionIdToFinish: "session-1"
});

assert.deepEqual(
  resolveFinishActiveCallRuntimeStateActions({
    remoteSessionIdToFinish: "session-1",
    runtimeStartActions: androidStartActions
  }),
  {
    finishProgress: androidStartActions.finishProgress,
    log: {
      event: "emergency_finish_button_pressed",
      payload: {
        platform: "android"
      }
    },
    ownerAutoCallSessionIdToClear: "session-1",
    recordingStatus: "Encerrando chamado seguro...",
    shouldClearLiveRemoteSession: true,
    shouldMarkFinishInProgress: true,
    shouldResetLiveAudioCall: true,
    shouldStopOwnerLiveVideoEvidence: true,
    stopOwnerLiveVideoEvidenceReason: "finish"
  }
);

const iosStartActions = resolveFinishActiveCallRuntimeStartActions({
  platform: "ios",
  remoteSessionIdToFinish: null
});

assert.deepEqual(
  resolveFinishActiveCallRuntimeStateActions({
    remoteSessionIdToFinish: null,
    runtimeStartActions: iosStartActions
  }).ownerAutoCallSessionIdToClear,
  undefined
);

console.log("finish-active-call-runtime-state-actions-policy ok");
