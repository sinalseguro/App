import type { FinishOutcomeDecision, FinishOutcomeProgress } from "./finishOutcomePolicy";

export type FinishCompletionActionsDecision = {
  finishProgress: FinishOutcomeProgress;
  recordingStatus: string;
  shouldClearFinishCodeInput: true;
  shouldClearFinishError: true;
  shouldCloseFinishConfirmation: true;
};

export function resolveFinishCompletionActions(input: {
  finishOutcome: FinishOutcomeDecision;
}): FinishCompletionActionsDecision {
  return {
    finishProgress: input.finishOutcome.finishProgress,
    recordingStatus: input.finishOutcome.recordingStatus,
    shouldClearFinishCodeInput: true,
    shouldClearFinishError: true,
    shouldCloseFinishConfirmation: true
  };
}
