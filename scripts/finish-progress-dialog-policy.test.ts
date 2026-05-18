import assert from "node:assert/strict";

import { resolveFinishProgressDialogPresentation } from "../src/features/emergency-home/finishProgressDialogPolicy";

assert.deepEqual(resolveFinishProgressDialogPresentation({ progress: -10, status: "running" }), {
  accentTone: "secure",
  canDismiss: false,
  iconKind: "shield",
  mutedActionAccessibilityLabel: "Continuar na tela inicial",
  mutedActionLabel: "Continuar",
  normalizedProgress: 0,
  pendingText: "Mantendo o pacote local consistente.",
  primaryActionAccessibilityLabel: "Abrir cofre local",
  primaryActionLabel: "Abrir cofre",
  shouldShowPendingRow: true
});

assert.deepEqual(resolveFinishProgressDialogPresentation({ progress: 130, status: "warning" }), {
  accentTone: "warning",
  canDismiss: true,
  iconKind: "video_off",
  mutedActionAccessibilityLabel: "Continuar na tela inicial",
  mutedActionLabel: "Continuar",
  normalizedProgress: 100,
  pendingText: "Mantendo o pacote local consistente.",
  primaryActionAccessibilityLabel: "Abrir cofre local",
  primaryActionLabel: "Abrir cofre",
  shouldShowPendingRow: false
});

assert.equal(resolveFinishProgressDialogPresentation({ progress: 75, status: "error" }).accentTone, "danger");
assert.equal(resolveFinishProgressDialogPresentation({ progress: 75, status: "done" }).iconKind, "shield");

console.log("finish-progress-dialog-policy ok");
