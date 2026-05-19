import {
  resolveFinishMediaStopSettledProgress,
  type FinishFlowMediaStopStatus,
  type FinishFlowProgress
} from "./finishFlowProgressPolicy";

export type FinishMediaStopResultActionsDecision = {
  finishProgress: FinishFlowProgress;
  logEvent: "emergency_media_stop_progress_result";
  logPayload: {
    attachedAssets: number;
    platform: string;
    status: FinishFlowMediaStopStatus;
  };
  shouldClearMediaStopPending: true;
};

export function resolveFinishMediaStopResultActions(input: {
  attachedAssets: number;
  platform: string;
  status: FinishFlowMediaStopStatus;
}): FinishMediaStopResultActionsDecision {
  return {
    finishProgress: resolveFinishMediaStopSettledProgress(input.status),
    logEvent: "emergency_media_stop_progress_result",
    logPayload: {
      attachedAssets: input.attachedAssets,
      platform: input.platform,
      status: input.status
    },
    shouldClearMediaStopPending: true
  };
}
