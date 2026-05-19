import assert from "node:assert/strict";

import { resolveFinishActiveCallRuntimeStartActions } from "../src/features/emergency-home/finishActiveCallRuntimeStartPolicy";

assert.deepEqual(
  resolveFinishActiveCallRuntimeStartActions({
    platform: "android",
    remoteSessionIdToFinish: "session-1"
  }),
  {
    finishProgress: {
      detail: "Interrompendo a gravacao local e salvando o pacote.",
      progress: 12,
      status: "running",
      title: "Encerrando chamado"
    },
    logEvent: "emergency_finish_button_pressed",
    logPayload: {
      platform: "android"
    },
    recordingStatus: "Encerrando chamado seguro...",
    shouldClearLiveRemoteSession: true,
    shouldClearOwnerAutoCallSession: true,
    shouldMarkFinishInProgress: true,
    shouldResetLiveAudioCall: true,
    shouldStopOwnerLiveVideoEvidence: true
  }
);

assert.deepEqual(
  resolveFinishActiveCallRuntimeStartActions({
    platform: "ios",
    remoteSessionIdToFinish: null
  }),
  {
    finishProgress: {
      detail: "Interrompendo a gravacao local e salvando o pacote.",
      progress: 12,
      status: "running",
      title: "Encerrando chamado"
    },
    logEvent: "emergency_finish_button_pressed",
    logPayload: {
      platform: "ios"
    },
    recordingStatus: "Encerrando chamado seguro...",
    shouldClearLiveRemoteSession: true,
    shouldClearOwnerAutoCallSession: false,
    shouldMarkFinishInProgress: true,
    shouldResetLiveAudioCall: true,
    shouldStopOwnerLiveVideoEvidence: true
  }
);

console.log("finish-active-call-runtime-start-policy ok");
