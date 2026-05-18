import assert from "node:assert/strict";

import { resolveProtectedRouteDialogPresentation } from "../src/features/emergency-home/protectedRouteDialogPolicy";

assert.deepEqual(resolveProtectedRouteDialogPresentation(), {
  cancelLabel: "Cancelar",
  confirmLabel: "Liberar",
  inputAccessibilityLabel: "Codigo para abrir area protegida",
  inputPlaceholder: "Codigo de seguranca",
  message: "Informe o codigo de seguranca para continuar.",
  title: "Codigo de seguranca"
});

console.log("protected-route-dialog-policy ok");
