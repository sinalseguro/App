export type FinishActiveCallStartSkipReason =
  | "missing_active_package"
  | "finish_in_progress"
  | "finish_ref_in_progress";

export type FinishActiveCallStartInput = {
  activePackageId?: string | null;
  captureStopLocked: boolean;
  finishInProgress: boolean;
  finishInProgressRef: boolean;
  liveAudioRemoteSessionId?: string | null;
  liveRemoteSessionId?: string | null;
  ownerLiveVideoRecordingActive: boolean;
  ownerLiveVideoStartRequestActive: boolean;
};

export type FinishActiveCallStartDecision =
  | {
      reason: FinishActiveCallStartSkipReason;
      shouldStart: false;
    }
  | {
      mediaWasHandedToLiveCall: boolean;
      packageId: string;
      remoteSessionIdToFinish: string | null;
      shouldStart: true;
    };

export function resolveFinishActiveCallStart(input: FinishActiveCallStartInput): FinishActiveCallStartDecision {
  if (!input.activePackageId) {
    return { reason: "missing_active_package", shouldStart: false };
  }

  if (input.finishInProgress) {
    return { reason: "finish_in_progress", shouldStart: false };
  }

  if (input.finishInProgressRef) {
    return { reason: "finish_ref_in_progress", shouldStart: false };
  }

  return {
    mediaWasHandedToLiveCall:
      input.captureStopLocked ||
      input.ownerLiveVideoRecordingActive ||
      input.ownerLiveVideoStartRequestActive,
    packageId: input.activePackageId,
    remoteSessionIdToFinish: input.liveAudioRemoteSessionId ?? input.liveRemoteSessionId ?? null,
    shouldStart: true
  };
}
