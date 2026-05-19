import assert from "node:assert/strict";

import { resolveFinishMediaStopStartActions } from "../src/features/emergency-home/finishMediaStopStartPolicy";

assert.deepEqual(
  resolveFinishMediaStopStartActions({
    packageId: "pkg-123"
  }),
  {
    finishProgress: {
      detail: "Camera sinalizada. O chamado saiu do modo ativo enquanto a midia continua protegendo.",
      progress: 24,
      status: "running",
      title: "Encerrando gravacao"
    },
    mediaRecorderPackageId: "pkg-123",
    nextActivePackageId: null,
    shouldLockCaptureStop: true,
    shouldSetMediaStopPending: true
  }
);

console.log("finish-media-stop-start-policy ok");
