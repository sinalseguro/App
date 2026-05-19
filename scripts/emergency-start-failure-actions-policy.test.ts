import assert from "node:assert/strict";

import { resolveEmergencyStartFailureActions } from "../src/features/emergency-home/emergencyStartFailureActionsPolicy";

assert.deepEqual(
  resolveEmergencyStartFailureActions({
    platform: "android"
  }),
  {
    dialogPresentation: {
      confirmLabel: "Entendi",
      message: "Nao foi possivel salvar o pacote local com seguranca neste dispositivo. Use 190, 193 ou 192 em risco imediato.",
      title: "Chamado nao preservado"
    },
    logEvent: "emergency_start_error",
    logPayload: {
      platform: "android"
    },
    recordingStatus: "Nao foi possivel iniciar o chamado neste aparelho.",
    shouldClearActivePackageId: true,
    shouldShowDialog: true
  }
);

console.log("emergency-start-failure-actions-policy ok");
