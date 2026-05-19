import {
  resolveFinishRequestedProgress,
  type FinishFlowProgress
} from "./finishFlowProgressPolicy";
import { resolveLocalSosPackageStatus } from "./localSosPackageStatusPolicy";

export type FinishActiveCallRuntimeStartActionsDecision = {
  finishProgress: FinishFlowProgress;
  logEvent: "emergency_finish_button_pressed";
  logPayload: {
    platform: string;
  };
  recordingStatus: string;
  shouldClearLiveRemoteSession: true;
  shouldClearOwnerAutoCallSession: boolean;
  shouldMarkFinishInProgress: true;
  shouldResetLiveAudioCall: true;
  shouldStopOwnerLiveVideoEvidence: true;
};

export function resolveFinishActiveCallRuntimeStartActions(input: {
  platform: string;
  remoteSessionIdToFinish?: string | null;
}): FinishActiveCallRuntimeStartActionsDecision {
  return {
    finishProgress: resolveFinishRequestedProgress(),
    logEvent: "emergency_finish_button_pressed",
    logPayload: {
      platform: input.platform
    },
    recordingStatus: resolveLocalSosPackageStatus({ event: "finish_requested" }),
    shouldClearLiveRemoteSession: true,
    shouldClearOwnerAutoCallSession: Boolean(input.remoteSessionIdToFinish),
    shouldMarkFinishInProgress: true,
    shouldResetLiveAudioCall: true,
    shouldStopOwnerLiveVideoEvidence: true
  };
}
