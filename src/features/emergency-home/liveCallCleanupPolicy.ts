import type { LiveAudioStatus } from "@/features/live-call/liveCallSessionPolicy";

export type LiveCallCleanupSkipReason =
  | "active_package"
  | "start_in_progress"
  | "media_stop_pending"
  | "finish_in_progress"
  | "nothing_to_cleanup";

export type LiveCallCleanupAction = "reset_idle_call_state" | "stop_active_call";

export type LiveCallCleanupInput = {
  activePackageId?: string | null;
  finishInProgress: boolean;
  liveAudioCallStatus: LiveAudioStatus;
  liveRemoteSessionId?: string | null;
  mediaStopPending: boolean;
  startInProgress: boolean;
};

export type LiveCallCleanupDecision =
  | {
      reason: LiveCallCleanupSkipReason;
      shouldCleanup: false;
    }
  | {
      liveCallAction: LiveCallCleanupAction;
      shouldCleanup: true;
      shouldClearAutoCallState: true;
      shouldClearLiveRemoteSession: true;
    };

export function resolveLiveCallCleanupDecision(input: LiveCallCleanupInput): LiveCallCleanupDecision {
  if (input.activePackageId) {
    return { reason: "active_package", shouldCleanup: false };
  }

  if (input.startInProgress) {
    return { reason: "start_in_progress", shouldCleanup: false };
  }

  if (input.mediaStopPending) {
    return { reason: "media_stop_pending", shouldCleanup: false };
  }

  if (input.finishInProgress) {
    return { reason: "finish_in_progress", shouldCleanup: false };
  }

  if (!input.liveRemoteSessionId && input.liveAudioCallStatus === "idle") {
    return { reason: "nothing_to_cleanup", shouldCleanup: false };
  }

  return {
    liveCallAction: input.liveAudioCallStatus === "idle" ? "reset_idle_call_state" : "stop_active_call",
    shouldCleanup: true,
    shouldClearAutoCallState: true,
    shouldClearLiveRemoteSession: true
  };
}
