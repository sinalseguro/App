import {
  resolveFinishCompletionActions,
  type FinishCompletionActionsDecision
} from "./finishCompletionActionsPolicy";
import {
  resolveFinishNoMediaDiagnosticRequest,
  type FinishNoMediaDiagnosticDecision
} from "./finishNoMediaDiagnosticPolicy";
import type { FinishOutcomeDecision } from "./finishOutcomePolicy";

export type FinishPostOutcomeActionsDecision = {
  completionActions: FinishCompletionActionsDecision;
  noMediaDiagnostic: FinishNoMediaDiagnosticDecision;
};

export function resolveFinishPostOutcomeActions(input: {
  finishOutcome: FinishOutcomeDecision;
  packageId: string;
}): FinishPostOutcomeActionsDecision {
  return {
    completionActions: resolveFinishCompletionActions({
      finishOutcome: input.finishOutcome
    }),
    noMediaDiagnostic: resolveFinishNoMediaDiagnosticRequest({
      diagnosticReason: input.finishOutcome.diagnosticReason,
      packageId: input.packageId
    })
  };
}
