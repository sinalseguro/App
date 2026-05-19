import assert from "node:assert/strict";

import { resolveFinishMediaStopResultActions } from "../src/features/emergency-home/finishMediaStopResultPolicy";

assert.deepEqual(
  resolveFinishMediaStopResultActions({
    attachedAssets: 2,
    platform: "android",
    status: "attached"
  }),
  {
    finishProgress: {
      detail: "Midia criptografada. A finalizacao do pacote pode seguir em segundo plano.",
      progress: 72,
      status: "background",
      title: "Midia protegida"
    },
    logEvent: "emergency_media_stop_progress_result",
    logPayload: {
      attachedAssets: 2,
      platform: "android",
      status: "attached"
    },
    shouldClearMediaStopPending: true
  }
);

assert.deepEqual(
  resolveFinishMediaStopResultActions({
    attachedAssets: 0,
    platform: "ios",
    status: "empty"
  }),
  {
    finishProgress: {
      detail: "Camera liberada. Confirmando se o pacote ja recebeu midia preservada.",
      progress: 48,
      status: "running",
      title: "Conferindo cofre"
    },
    logEvent: "emergency_media_stop_progress_result",
    logPayload: {
      attachedAssets: 0,
      platform: "ios",
      status: "empty"
    },
    shouldClearMediaStopPending: true
  }
);

console.log("finish-media-stop-result-policy ok");
