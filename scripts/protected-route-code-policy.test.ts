import assert from "node:assert/strict";

import { resolveProtectedRouteCodeDecision } from "../src/features/emergency-home/protectedRouteCodePolicy";

assert.deepEqual(
  resolveProtectedRouteCodeDecision({
    hasProtectedRouteRequest: false
  }),
  {
    action: "ignore_missing_request"
  }
);

assert.deepEqual(
  resolveProtectedRouteCodeDecision({
    hasProtectedRouteRequest: true
  }),
  {
    action: "show_error",
    errorMessage: "Codigo de seguranca nao verificado. Area protegida bloqueada."
  }
);

assert.deepEqual(
  resolveProtectedRouteCodeDecision({
    hasProtectedRouteRequest: true,
    verification: {
      ok: false,
      message: "Codigo incorreto.",
      reason: "incorrect"
    }
  }),
  {
    action: "show_error",
    errorMessage: "Codigo incorreto. Area protegida bloqueada."
  }
);

assert.deepEqual(
  resolveProtectedRouteCodeDecision({
    hasProtectedRouteRequest: true,
    verification: {
      lockedUntil: 1_780_000_000_000,
      message: "Aguarde 2 minutos antes de tentar novamente.",
      ok: false,
      reason: "locked"
    }
  }),
  {
    action: "show_error",
    errorMessage: "Aguarde 2 minutos antes de tentar novamente. Area protegida bloqueada."
  }
);

assert.deepEqual(
  resolveProtectedRouteCodeDecision({
    hasProtectedRouteRequest: true,
    verification: {
      ok: true
    }
  }),
  {
    action: "unlock_and_navigate"
  }
);

console.log("protected-route-code-policy ok");
