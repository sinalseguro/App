import assert from "node:assert/strict";

import {
  resolveFinishMediaStopRequestActions,
  resolveFinishMediaStopSignaledActions
} from "../src/features/emergency-home/finishMediaStopRequestActionsPolicy";

assert.deepEqual(
  resolveFinishMediaStopRequestActions({
    mediaWasHandedToLiveCall: true
  }),
  {
    shouldSignalMediaRecorderStop: false
  }
);

assert.deepEqual(
  resolveFinishMediaStopRequestActions({
    mediaWasHandedToLiveCall: false
  }),
  {
    shouldSignalMediaRecorderStop: true
  }
);

assert.deepEqual(
  resolveFinishMediaStopSignaledActions({
    packageId: "pkg-1",
    stopSerial: null
  }),
  {
    shouldApply: false
  }
);

assert.deepEqual(
  resolveFinishMediaStopSignaledActions({
    packageId: "pkg-1",
    stopSerial: 7
  }),
  {
    shouldApply: true,
    startActions: {
      finishProgress: {
        detail: "Camera sinalizada. O chamado saiu do modo ativo enquanto a midia continua protegendo.",
        progress: 24,
        status: "running",
        title: "Encerrando gravacao"
      },
      mediaRecorderPackageId: "pkg-1",
      nextActivePackageId: null,
      shouldLockCaptureStop: true,
      shouldSetMediaStopPending: true
    },
    stopSerial: 7
  }
);

console.log("finish-media-stop-request-actions-policy ok");
