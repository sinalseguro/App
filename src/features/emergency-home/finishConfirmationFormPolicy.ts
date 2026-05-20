import type { FinishCompletionActionsDecision } from "./finishCompletionActionsPolicy";
import type { FinishRequestDecision } from "./finishRequestPolicy";

export type FinishConfirmationFormPatch = {
  finishCodeInput?: string;
  finishConfirmationOpen?: boolean;
  finishError?: string;
};

export function resolveFinishRequestConfirmationFormPatch(
  decision: FinishRequestDecision
): FinishConfirmationFormPatch {
  if (!decision.shouldContinue) return {};

  const patch: FinishConfirmationFormPatch = decision.shouldResetConfirmationForm
    ? {
        finishCodeInput: "",
        finishError: ""
      }
    : {};

  if (decision.action === "open_security_confirmation") {
    patch.finishConfirmationOpen = true;
  }

  return patch;
}

export function shouldFinishImmediatelyAfterRequest(decision: FinishRequestDecision) {
  return decision.shouldContinue && decision.action === "finish_now";
}

export function resolveFinishCompletionConfirmationFormPatch(
  decision: Pick<
    FinishCompletionActionsDecision,
    "shouldClearFinishCodeInput" | "shouldClearFinishError" | "shouldCloseFinishConfirmation"
  >
): FinishConfirmationFormPatch {
  const patch: FinishConfirmationFormPatch = {};

  if (decision.shouldCloseFinishConfirmation) {
    patch.finishConfirmationOpen = false;
  }

  if (decision.shouldClearFinishCodeInput) {
    patch.finishCodeInput = "";
  }

  if (decision.shouldClearFinishError) {
    patch.finishError = "";
  }

  return patch;
}
