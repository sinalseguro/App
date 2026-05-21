import type { LiveCallCleanupDecision } from "./liveCallCleanupPolicy";

export type LiveCallCleanupActions =
  | {
      shouldApply: false;
    }
  | {
      liveCallAction: "reset_idle_call_state" | "stop_active_call";
      shouldApply: true;
      shouldClearAutoCallState: true;
      shouldClearLiveRemoteSession: true;
    };

export function resolveLiveCallCleanupActions(decision: LiveCallCleanupDecision): LiveCallCleanupActions {
  if (!decision.shouldCleanup) {
    return {
      shouldApply: false
    };
  }

  return {
    liveCallAction: decision.liveCallAction,
    shouldApply: true,
    shouldClearAutoCallState: decision.shouldClearAutoCallState,
    shouldClearLiveRemoteSession: decision.shouldClearLiveRemoteSession
  };
}
