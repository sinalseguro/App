export type FinishActiveCallCleanupMediaStopPurpose = "finish" | "live_call_handoff" | null;

export type FinishActiveCallCleanupDecision = {
  shouldClearMediaStopPending: true;
  shouldClearMediaStopPurpose: boolean;
  shouldReleaseFinishInProgress: true;
  shouldUnlockCaptureStop: true;
};

export function resolveFinishActiveCallCleanup(input: {
  mediaStopPurpose: FinishActiveCallCleanupMediaStopPurpose;
}): FinishActiveCallCleanupDecision {
  return {
    shouldClearMediaStopPending: true,
    shouldClearMediaStopPurpose: input.mediaStopPurpose === "finish",
    shouldReleaseFinishInProgress: true,
    shouldUnlockCaptureStop: true
  };
}
