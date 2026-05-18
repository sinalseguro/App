import type { LiveAudioStatus } from "@/features/live-call/liveCallSessionPolicy";

export type LiveCallPanelPolicyInput = {
  activePackageId?: string | null;
  finishInProgress: boolean;
  liveAudioCallStatus: LiveAudioStatus;
  liveRemoteSessionId?: string | null;
  mediaStopPending: boolean;
};

export type LiveCallPanelPolicy = {
  primaryActionDisabled: boolean;
  shouldAvoidMediaRecorderPanel: boolean;
  shouldRenderPanel: boolean;
  shouldRenderStatusBand: boolean;
};

export function resolveLiveCallPanelPolicy(input: LiveCallPanelPolicyInput): LiveCallPanelPolicy {
  const hasActivePackage = Boolean(input.activePackageId);
  const hasLiveCallState = Boolean(input.liveRemoteSessionId) || input.liveAudioCallStatus !== "idle";
  const shouldRenderPanel = hasActivePackage && hasLiveCallState;

  return {
    primaryActionDisabled:
      !hasActivePackage || !input.liveRemoteSessionId || input.mediaStopPending || input.finishInProgress,
    shouldAvoidMediaRecorderPanel: shouldRenderPanel,
    shouldRenderPanel,
    shouldRenderStatusBand: !shouldRenderPanel
  };
}
