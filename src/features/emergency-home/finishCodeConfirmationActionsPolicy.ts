import type { FinishCodeConfirmationDecision } from "./finishCodePolicy";
import type { FinishConfirmationFormPatch } from "./finishConfirmationFormPolicy";

export type FinishCodeConfirmationActions =
  | {
      formPatch: FinishConfirmationFormPatch;
      shouldFinishActiveCall: false;
    }
  | {
      formPatch?: undefined;
      shouldFinishActiveCall: true;
    };

export function resolveFinishCodeConfirmationActions(
  decision: FinishCodeConfirmationDecision
): FinishCodeConfirmationActions {
  if (decision.action === "show_error") {
    return {
      formPatch: {
        finishError: decision.errorMessage
      },
      shouldFinishActiveCall: false
    };
  }

  return {
    shouldFinishActiveCall: true
  };
}
