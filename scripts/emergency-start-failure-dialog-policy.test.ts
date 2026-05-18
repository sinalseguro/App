import assert from "node:assert/strict";

import { resolveEmergencyStartFailureDialogPresentation } from "../src/features/emergency-home/emergencyStartFailureDialogPolicy";

assert.deepEqual(resolveEmergencyStartFailureDialogPresentation(), {
  confirmLabel: "Entendi",
  message: "Nao foi possivel salvar o pacote local com seguranca neste dispositivo. Use 190, 193 ou 192 em risco imediato.",
  title: "Chamado nao preservado"
});

console.log("emergency-start-failure-dialog-policy ok");
