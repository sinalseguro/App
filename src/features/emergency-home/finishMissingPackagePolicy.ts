import {
  resolveFinishMissingPackageProgress,
  type FinishFlowProgress
} from "./finishFlowProgressPolicy";
import { resolveLocalSosPackageStatus } from "./localSosPackageStatusPolicy";

export type FinishMissingPackageActionsDecision = {
  finishProgress?: FinishFlowProgress;
  recordingStatus: string;
  shouldShowMissingPackageProgress: boolean;
};

export function resolveFinishMissingPackageActions(input: {
  stopSerialPresent: boolean;
}): FinishMissingPackageActionsDecision {
  const shouldShowMissingPackageProgress = !input.stopSerialPresent;

  return {
    finishProgress: shouldShowMissingPackageProgress ? resolveFinishMissingPackageProgress() : undefined,
    recordingStatus: resolveLocalSosPackageStatus({ event: "finish_missing_package" }),
    shouldShowMissingPackageProgress
  };
}
