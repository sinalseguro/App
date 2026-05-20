import assert from "node:assert/strict";

import {
  resolveProtectedRouteAcceptedFormPatch,
  resolveProtectedRouteClosedFormPatch,
  resolveProtectedRouteErrorFormPatch,
  resolveProtectedRouteRequestFormPatch
} from "../src/features/emergency-home/protectedRouteFormPolicy";

assert.deepEqual(resolveProtectedRouteRequestFormPatch({ route: "/arquivos" }), {
  menuOpen: false,
  protectedRouteCodeInput: "",
  protectedRouteError: "",
  protectedRouteRequest: { route: "/arquivos" }
});

assert.deepEqual(resolveProtectedRouteRequestFormPatch({ panel: "cofre", route: "/arquivos" }), {
  menuOpen: false,
  protectedRouteCodeInput: "",
  protectedRouteError: "",
  protectedRouteRequest: { panel: "cofre", route: "/arquivos" }
});

assert.deepEqual(resolveProtectedRouteErrorFormPatch("Codigo incorreto."), {
  protectedRouteError: "Codigo incorreto."
});

assert.deepEqual(resolveProtectedRouteAcceptedFormPatch(), {
  protectedRouteCodeInput: "",
  protectedRouteError: "",
  protectedRouteRequest: null
});

assert.deepEqual(resolveProtectedRouteClosedFormPatch(), {
  protectedRouteCodeInput: "",
  protectedRouteError: "",
  protectedRouteRequest: null
});

console.log("protected-route-form-policy ok");
