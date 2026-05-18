import {
  resolveFinishFailedProgress,
  type FinishFlowProgress
} from "./finishFlowProgressPolicy";
import { resolveLocalSosPackageStatus } from "./localSosPackageStatusPolicy";

export type FinishFailureActionsDecision = {
  finishProgress: FinishFlowProgress;
  logEvent: "emergency_finish_package_error";
  logPayload: {
    platform: string;
  };
  recordingStatus: string;
};

export function resolveFinishFailureActions(input: {
  platform: string;
}): FinishFailureActionsDecision {
  return {
    finishProgress: resolveFinishFailedProgress(),
    logEvent: "emergency_finish_package_error",
    logPayload: {
      platform: input.platform
    },
    recordingStatus: resolveLocalSosPackageStatus({ event: "finish_failed" })
  };
}
