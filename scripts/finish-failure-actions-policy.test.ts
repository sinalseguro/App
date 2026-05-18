import assert from "node:assert/strict";

import { resolveFinishFailureActions } from "../src/features/emergency-home/finishFailureActionsPolicy";

assert.deepEqual(
  resolveFinishFailureActions({
    platform: "android"
  }),
  {
    finishProgress: {
      detail: "Nao foi possivel finalizar o pacote local. Tente novamente pelo botao seguro.",
      progress: 100,
      status: "error",
      title: "Falha no encerramento"
    },
    logEvent: "emergency_finish_package_error",
    logPayload: {
      platform: "android"
    },
    recordingStatus: "Nao foi possivel encerrar o chamado neste aparelho. Tente novamente pelo botao seguro."
  }
);

console.log("finish-failure-actions-policy ok");
