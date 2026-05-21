import type { EmergencyRemoteSyncState } from "@/features/emergency/emergencySyncQueue";

import {
  resolveRemoteFinishFailureLog,
  resolveRemoteFinishStateFromSync,
  type FinishRemoteFailureLogDecision
} from "./finishRemoteSyncPolicy";

export type FinishRemoteSyncPendingResultActions = {
  remoteFinishState?: EmergencyRemoteSyncState;
};

export type FinishRemoteSyncCompletionActions = {
  failureLog: FinishRemoteFailureLogDecision;
  remoteFinishFailed: boolean;
};

export function resolveFinishRemoteSyncPendingResultActions(input: {
  packageId: string;
  syncStates: EmergencyRemoteSyncState[];
}): FinishRemoteSyncPendingResultActions {
  return {
    remoteFinishState: resolveRemoteFinishStateFromSync({
      packageId: input.packageId,
      syncStates: input.syncStates
    })
  };
}

export function resolveFinishRemoteSyncCompletionActions(input: {
  packageId: string;
  platform: string;
  remoteFinishState?: EmergencyRemoteSyncState;
  remoteSessionIdToFinish?: string | null;
}): FinishRemoteSyncCompletionActions {
  const failureLog = resolveRemoteFinishFailureLog(input);

  return {
    failureLog,
    remoteFinishFailed: failureLog.remoteFinishFailed
  };
}
