import {
  resolveFinishActiveCallCleanup,
  type FinishActiveCallCleanupDecision,
  type FinishActiveCallCleanupMediaStopPurpose
} from "./finishActiveCallCleanupPolicy";
import {
  resolveFinishFailureActions,
  type FinishFailureActionsDecision
} from "./finishFailureActionsPolicy";

export type FinishFailureRuntimeActions = Omit<FinishFailureActionsDecision, "logEvent" | "logPayload"> & {
  log: {
    event: FinishFailureActionsDecision["logEvent"];
    payload: FinishFailureActionsDecision["logPayload"];
  };
};

export function resolveFinishFailureRuntimeActions(input: {
  platform: string;
}): FinishFailureRuntimeActions {
  const failureActions = resolveFinishFailureActions(input);

  return {
    finishProgress: failureActions.finishProgress,
    log: {
      event: failureActions.logEvent,
      payload: failureActions.logPayload
    },
    recordingStatus: failureActions.recordingStatus
  };
}

export function resolveFinishFinallyCleanupActions(input: {
  mediaStopPurpose: FinishActiveCallCleanupMediaStopPurpose;
}): FinishActiveCallCleanupDecision {
  return resolveFinishActiveCallCleanup(input);
}
