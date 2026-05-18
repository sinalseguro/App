import assert from "node:assert/strict";

import { resolveRecordingConsentDialogPresentation } from "../src/features/emergency-home/recordingConsentDialogPolicy";

assert.deepEqual(resolveRecordingConsentDialogPresentation(), {
  cancelLabel: "Agora nao",
  confirmLabel: "Abrir termos",
  message: "Revise e aceite os termos para permitir gravacao local durante o SOS.",
  title: "Autorizar gravacao"
});

console.log("recording-consent-dialog-policy ok");
