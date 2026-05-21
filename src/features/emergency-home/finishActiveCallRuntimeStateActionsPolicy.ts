import type { FinishActiveCallRuntimeStartActionsDecision } from "./finishActiveCallRuntimeStartPolicy";

export type FinishActiveCallRuntimeStateActions = {
  finishProgress: FinishActiveCallRuntimeStartActionsDecision["finishProgress"];
  log: {
    event: FinishActiveCallRuntimeStartActionsDecision["logEvent"];
    payload: FinishActiveCallRuntimeStartActionsDecision["logPayload"];
  };
  ownerAutoCallSessionIdToClear?: string;
  recordingStatus: string;
  shouldClearLiveRemoteSession: boolean;
  shouldMarkFinishInProgress: boolean;
  shouldResetLiveAudioCall: boolean;
  shouldStopOwnerLiveVideoEvidence: boolean;
  stopOwnerLiveVideoEvidenceReason?: "finish";
};

export function resolveFinishActiveCallRuntimeStateActions(input: {
  remoteSessionIdToFinish?: string | null;
  runtimeStartActions: FinishActiveCallRuntimeStartActionsDecision;
}): FinishActiveCallRuntimeStateActions {
  const shouldClearOwnerSession =
    input.runtimeStartActions.shouldClearOwnerAutoCallSession && Boolean(input.remoteSessionIdToFinish);

  return {
    finishProgress: input.runtimeStartActions.finishProgress,
    log: {
      event: input.runtimeStartActions.logEvent,
      payload: input.runtimeStartActions.logPayload
    },
    ownerAutoCallSessionIdToClear: shouldClearOwnerSession ? input.remoteSessionIdToFinish ?? undefined : undefined,
    recordingStatus: input.runtimeStartActions.recordingStatus,
    shouldClearLiveRemoteSession: input.runtimeStartActions.shouldClearLiveRemoteSession,
    shouldMarkFinishInProgress: input.runtimeStartActions.shouldMarkFinishInProgress,
    shouldResetLiveAudioCall: input.runtimeStartActions.shouldResetLiveAudioCall,
    shouldStopOwnerLiveVideoEvidence: input.runtimeStartActions.shouldStopOwnerLiveVideoEvidence,
    stopOwnerLiveVideoEvidenceReason: input.runtimeStartActions.shouldStopOwnerLiveVideoEvidence ? "finish" : undefined
  };
}
