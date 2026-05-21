import assert from "node:assert/strict";

import { resolveFinishCodeConfirmationActions } from "../src/features/emergency-home/finishCodeConfirmationActionsPolicy";

assert.deepEqual(
  resolveFinishCodeConfirmationActions({
    action: "show_error",
    errorMessage: "Codigo incorreto. O chamado continua ativo."
  }),
  {
    formPatch: {
      finishError: "Codigo incorreto. O chamado continua ativo."
    },
    shouldFinishActiveCall: false
  }
);

assert.deepEqual(
  resolveFinishCodeConfirmationActions({
    action: "finish_now"
  }),
  {
    shouldFinishActiveCall: true
  }
);

console.log("finish-code-confirmation-actions-policy ok");
