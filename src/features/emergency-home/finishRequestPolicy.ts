export type FinishRequestSkipReason = "missing_active_package" | "finish_in_progress" | "finish_ref_in_progress";

export type FinishRequestAction = "open_security_confirmation" | "finish_now";

export type FinishRequestInput = {
  activePackageId?: string | null;
  finishInProgress: boolean;
  finishInProgressRef: boolean;
  requireSecurityCode: boolean;
};

export type FinishRequestDecision =
  | {
      reason: FinishRequestSkipReason;
      shouldContinue: false;
    }
  | {
      action: FinishRequestAction;
      shouldContinue: true;
      shouldResetConfirmationForm: true;
    };

export function resolveFinishRequestDecision(input: FinishRequestInput): FinishRequestDecision {
  if (!input.activePackageId) {
    return { reason: "missing_active_package", shouldContinue: false };
  }

  if (input.finishInProgress) {
    return { reason: "finish_in_progress", shouldContinue: false };
  }

  if (input.finishInProgressRef) {
    return { reason: "finish_ref_in_progress", shouldContinue: false };
  }

  return {
    action: input.requireSecurityCode ? "open_security_confirmation" : "finish_now",
    shouldContinue: true,
    shouldResetConfirmationForm: true
  };
}
