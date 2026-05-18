import assert from "node:assert/strict";

import { resolveFinishCodeConfirmationDecision } from "../src/features/emergency-home/finishCodePolicy";

assert.deepEqual(
  resolveFinishCodeConfirmationDecision({
    requireSecurityCode: false
  }),
  {
    action: "finish_now"
  }
);

assert.deepEqual(
  resolveFinishCodeConfirmationDecision({
    requireSecurityCode: true
  }),
  {
    action: "show_error",
    errorMessage: "Codigo de seguranca nao verificado. O chamado continua ativo."
  }
);

assert.deepEqual(
  resolveFinishCodeConfirmationDecision({
    requireSecurityCode: true,
    verification: {
      ok: false,
      message: "Codigo incorreto.",
      reason: "incorrect"
    }
  }),
  {
    action: "show_error",
    errorMessage: "Codigo incorreto. O chamado continua ativo."
  }
);

assert.deepEqual(
  resolveFinishCodeConfirmationDecision({
    requireSecurityCode: true,
    verification: {
      lockedUntil: 1_780_000_000_000,
      message: "Aguarde 2 minutos antes de tentar novamente.",
      ok: false,
      reason: "locked"
    }
  }),
  {
    action: "show_error",
    errorMessage: "Aguarde 2 minutos antes de tentar novamente. O chamado continua ativo."
  }
);

assert.deepEqual(
  resolveFinishCodeConfirmationDecision({
    requireSecurityCode: true,
    verification: {
      ok: true
    }
  }),
  {
    action: "finish_now"
  }
);

console.log("finish-code-policy ok");
