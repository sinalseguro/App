import type { EmergencyRemoteSyncState } from "@/features/emergency/emergencySyncQueue";

import {
  resolveFinishRemoteSyncProgress,
  type FinishFlowProgress
} from "./finishFlowProgressPolicy";

export type FinishRemoteSyncStartActionsDecision = {
  finishProgress: FinishFlowProgress;
  shouldQueueForRemoteSync: true;
};

export type FinishRemoteSyncModeDecision =
  | {
      mode: "direct_finish";
      remoteSessionId: string;
      shouldSyncPendingOnly: false;
    }
  | {
      mode: "pending_sync";
      remoteSessionId?: undefined;
      shouldSyncPendingOnly: true;
    };

export type FinishRemoteFailureLogDecision =
  | {
      remoteFinishFailed: false;
      shouldLog: false;
    }
  | {
      logEvent: "emergency_remote_finish_sync_error";
      logPayload: {
        packageId: string;
        platform: string;
        remoteFinishReason?: string;
        remoteSessionId?: string;
      };
      remoteFinishFailed: true;
      shouldLog: true;
    };

export function resolveFinishRemoteSyncStartActions(): FinishRemoteSyncStartActionsDecision {
  return {
    finishProgress: resolveFinishRemoteSyncProgress(),
    shouldQueueForRemoteSync: true
  };
}

export function resolveFinishRemoteSyncMode(input: {
  remoteSessionIdToFinish?: string | null;
}): FinishRemoteSyncModeDecision {
  if (input.remoteSessionIdToFinish) {
    return {
      mode: "direct_finish",
      remoteSessionId: input.remoteSessionIdToFinish,
      shouldSyncPendingOnly: false
    };
  }

  return {
    mode: "pending_sync",
    shouldSyncPendingOnly: true
  };
}

export function shouldRetryRemoteFinishAfterDirect(state: EmergencyRemoteSyncState): boolean {
  return state.remoteFinishStatus !== "finished";
}

export function resolveRemoteFinishStateAfterDirect(input: {
  directFinishState: EmergencyRemoteSyncState;
  packageId: string;
  retryStates: EmergencyRemoteSyncState[];
}): EmergencyRemoteSyncState {
  if (!shouldRetryRemoteFinishAfterDirect(input.directFinishState)) {
    return input.directFinishState;
  }

  return input.retryStates.find((state) => state.packageId === input.packageId) ?? input.directFinishState;
}

export function resolveRemoteFinishStateFromSync(input: {
  packageId: string;
  syncStates: EmergencyRemoteSyncState[];
}): EmergencyRemoteSyncState | undefined {
  return input.syncStates.find((state) => state.packageId === input.packageId);
}

export function resolveRemoteFinishFailureLog(input: {
  packageId: string;
  platform: string;
  remoteFinishState?: EmergencyRemoteSyncState;
  remoteSessionIdToFinish?: string | null;
}): FinishRemoteFailureLogDecision {
  if (input.remoteFinishState?.remoteFinishStatus !== "failed") {
    return {
      remoteFinishFailed: false,
      shouldLog: false
    };
  }

  return {
    logEvent: "emergency_remote_finish_sync_error",
    logPayload: {
      packageId: input.packageId,
      platform: input.platform,
      remoteFinishReason: input.remoteFinishState.remoteFinishReason,
      remoteSessionId: input.remoteSessionIdToFinish ?? input.remoteFinishState.remoteSessionId
    },
    remoteFinishFailed: true,
    shouldLog: true
  };
}
