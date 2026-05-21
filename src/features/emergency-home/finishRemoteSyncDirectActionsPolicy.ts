import type { EmergencyRemoteSyncState } from "@/features/emergency/emergencySyncQueue";

import {
  resolveRemoteFinishStateAfterDirect,
  shouldRetryRemoteFinishAfterDirect
} from "./finishRemoteSyncPolicy";

export type FinishRemoteSyncDirectRetryActions = {
  shouldSyncPendingAfterDirect: boolean;
};

export type FinishRemoteSyncDirectResultActions = {
  remoteFinishState: EmergencyRemoteSyncState;
};

export function resolveFinishRemoteSyncDirectRetryActions(input: {
  directFinishState: EmergencyRemoteSyncState;
}): FinishRemoteSyncDirectRetryActions {
  return {
    shouldSyncPendingAfterDirect: shouldRetryRemoteFinishAfterDirect(input.directFinishState)
  };
}

export function resolveFinishRemoteSyncDirectResultActions(input: {
  directFinishState: EmergencyRemoteSyncState;
  packageId: string;
  retryStates: EmergencyRemoteSyncState[];
}): FinishRemoteSyncDirectResultActions {
  return {
    remoteFinishState: resolveRemoteFinishStateAfterDirect({
      directFinishState: input.directFinishState,
      packageId: input.packageId,
      retryStates: input.retryStates
    })
  };
}
