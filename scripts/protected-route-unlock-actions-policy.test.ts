import assert from "node:assert/strict";

import { resolveProtectedRouteUnlockActions } from "../src/features/emergency-home/protectedRouteUnlockActionsPolicy";

assert.deepEqual(
  resolveProtectedRouteUnlockActions({
    decision: {
      action: "ignore_missing_request"
    }
  }),
  {
    shouldUnlockProtectedAccess: false
  }
);

assert.deepEqual(
  resolveProtectedRouteUnlockActions({
    decision: {
      action: "show_error",
      errorMessage: "Codigo incorreto. Area protegida bloqueada."
    },
    request: {
      route: "/arquivos"
    }
  }),
  {
    formPatch: {
      protectedRouteError: "Codigo incorreto. Area protegida bloqueada."
    },
    shouldUnlockProtectedAccess: false
  }
);

assert.deepEqual(
  resolveProtectedRouteUnlockActions({
    decision: {
      action: "unlock_and_navigate"
    }
  }),
  {
    shouldUnlockProtectedAccess: false
  }
);

assert.deepEqual(
  resolveProtectedRouteUnlockActions({
    decision: {
      action: "unlock_and_navigate"
    },
    request: {
      panel: "cofre",
      route: "/arquivos"
    }
  }),
  {
    formPatch: {
      protectedRouteCodeInput: "",
      protectedRouteError: "",
      protectedRouteRequest: null
    },
    navigationTarget: {
      panel: "cofre",
      route: "/arquivos"
    },
    shouldUnlockProtectedAccess: true
  }
);

console.log("protected-route-unlock-actions-policy ok");
