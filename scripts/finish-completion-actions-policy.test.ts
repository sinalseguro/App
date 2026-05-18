import assert from "node:assert/strict";

import { resolveFinishCompletionActions } from "../src/features/emergency-home/finishCompletionActionsPolicy";
import type { FinishOutcomeDecision } from "../src/features/emergency-home/finishOutcomePolicy";

const finishOutcome: FinishOutcomeDecision = {
  auditMarker: "local_evidence_metadata_only",
  diagnosticReason: "camera_no_file_returned",
  finishProgress: {
    detail: "A camera foi liberada, mas nao devolveu arquivo de video para este pacote.",
    progress: 100,
    status: "warning",
    title: "Chamado salvo sem video"
  },
  localEvidenceStatus: "metadata_only",
  recordingStatus: "Chamado encerrado. Pacote local salvo sem gravacao de video."
};

assert.deepEqual(
  resolveFinishCompletionActions({
    finishOutcome
  }),
  {
    finishProgress: finishOutcome.finishProgress,
    recordingStatus: finishOutcome.recordingStatus,
    shouldClearFinishCodeInput: true,
    shouldClearFinishError: true,
    shouldCloseFinishConfirmation: true
  }
);

console.log("finish-completion-actions-policy ok");
