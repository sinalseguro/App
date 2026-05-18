import assert from "node:assert/strict";

import { resolveFinishConfirmationDialogPresentation } from "../src/features/emergency-home/finishConfirmationDialogPolicy";

assert.deepEqual(resolveFinishConfirmationDialogPresentation(), {
  cancelLabel: "Manter ativo",
  confirmLabel: "Encerrar chamado",
  inputAccessibilityLabel: "Codigo para encerrar chamado",
  inputPlaceholder: "Codigo de encerramento",
  message: "Informe o codigo para confirmar o encerramento do chamado.",
  title: "Confirmar encerramento"
});

console.log("finish-confirmation-dialog-policy ok");
