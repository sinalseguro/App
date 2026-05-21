import assert from "node:assert/strict";

import {
  resolveFinishFailureRuntimeActions,
  resolveFinishFinallyCleanupActions
} from "../src/features/emergency-home/finishFailureCleanupActionsPolicy";

assert.deepEqual(
  resolveFinishFailureRuntimeActions({
    platform: "android"
  }),
  {
    finishProgress: {
      detail: "Nao foi possivel finalizar o pacote local. Tente novamente pelo botao seguro.",
      progress: 100,
      status: "error",
      title: "Falha no encerramento"
    },
    log: {
      event: "emergency_finish_package_error",
      payload: {
        platform: "android"
      }
    },
    recordingStatus: "Nao foi possivel encerrar o chamado neste aparelho. Tente novamente pelo botao seguro."
  }
);

assert.deepEqual(
  resolveFinishFinallyCleanupActions({
    mediaStopPurpose: "finish"
  }),
  {
    shouldClearMediaStopPending: true,
    shouldClearMediaStopPurpose: true,
    shouldReleaseFinishInProgress: true,
    shouldUnlockCaptureStop: true
  }
);

assert.deepEqual(
  resolveFinishFinallyCleanupActions({
    mediaStopPurpose: null
  }),
  {
    shouldClearMediaStopPending: true,
    shouldClearMediaStopPurpose: false,
    shouldReleaseFinishInProgress: true,
    shouldUnlockCaptureStop: true
  }
);

console.log("finish-failure-cleanup-actions-policy ok");
