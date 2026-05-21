import {
  resolveFinishRemoteSyncMode,
  resolveFinishRemoteSyncStartActions,
  type FinishRemoteSyncModeDecision,
  type FinishRemoteSyncStartActionsDecision
} from "./finishRemoteSyncPolicy";

export type FinishRemoteSyncRequestActionsDecision = {
  mode: FinishRemoteSyncModeDecision;
  startActions: FinishRemoteSyncStartActionsDecision;
};

export function resolveFinishRemoteSyncRequestActions(input: {
  remoteSessionIdToFinish?: string | null;
}): FinishRemoteSyncRequestActionsDecision {
  return {
    mode: resolveFinishRemoteSyncMode({
      remoteSessionIdToFinish: input.remoteSessionIdToFinish
    }),
    startActions: resolveFinishRemoteSyncStartActions()
  };
}
