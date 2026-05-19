import {
  resolveFinishMediaStopSignaledProgress,
  type FinishFlowProgress
} from "./finishFlowProgressPolicy";

export type FinishMediaStopStartActionsDecision = {
  finishProgress: FinishFlowProgress;
  mediaRecorderPackageId: string;
  nextActivePackageId: null;
  shouldLockCaptureStop: true;
  shouldSetMediaStopPending: true;
};

export function resolveFinishMediaStopStartActions(input: {
  packageId: string;
}): FinishMediaStopStartActionsDecision {
  return {
    finishProgress: resolveFinishMediaStopSignaledProgress(),
    mediaRecorderPackageId: input.packageId,
    nextActivePackageId: null,
    shouldLockCaptureStop: true,
    shouldSetMediaStopPending: true
  };
}
