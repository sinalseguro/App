import assert from "node:assert/strict";

import { resolveFinishPostOutcomeActions } from "../src/features/emergency-home/finishPostOutcomeActionsPolicy";
import type { FinishOutcomeDecision } from "../src/features/emergency-home/finishOutcomePolicy";

const failedOutcome: FinishOutcomeDecision = {
  auditMarker: "local_evidence_failed",
  diagnosticReason: "camera_no_file_returned",
  finishProgress: {
    detail: "O anjo acompanhou a chamada, mas o video local nao foi anexado ao cofre deste aparelho.",
    progress: 100,
    status: "warning",
    title: "Video local pendente"
  },
  localEvidenceStatus: "failed",
  recordingStatus: "Chamado encerrado. A transmissao ocorreu, mas o video local precisa de nova verificacao."
};

assert.deepEqual(
  resolveFinishPostOutcomeActions({
    finishOutcome: failedOutcome,
    packageId: "pkg-1"
  }),
  {
    completionActions: {
      finishProgress: failedOutcome.finishProgress,
      recordingStatus: failedOutcome.recordingStatus,
      shouldClearFinishCodeInput: true,
      shouldClearFinishError: true,
      shouldCloseFinishConfirmation: true
    },
    noMediaDiagnostic: {
      packageId: "pkg-1",
      reason: "camera_no_file_returned",
      shouldPersist: true
    }
  }
);

const protectedOutcome: FinishOutcomeDecision = {
  auditMarker: "local_evidence_protected",
  finishProgress: {
    detail: "Video protegido e anexado ao cofre local.",
    progress: 100,
    status: "done",
    title: "Video protegido"
  },
  localEvidenceStatus: "protected",
  recordingStatus: "Chamado encerrado. Video preservado no cofre local."
};

assert.deepEqual(
  resolveFinishPostOutcomeActions({
    finishOutcome: protectedOutcome,
    packageId: "pkg-2"
  }),
  {
    completionActions: {
      finishProgress: protectedOutcome.finishProgress,
      recordingStatus: protectedOutcome.recordingStatus,
      shouldClearFinishCodeInput: true,
      shouldClearFinishError: true,
      shouldCloseFinishConfirmation: true
    },
    noMediaDiagnostic: {
      shouldPersist: false
    }
  }
);

console.log("finish-post-outcome-actions-policy ok");
