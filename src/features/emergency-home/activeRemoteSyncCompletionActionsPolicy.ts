import type { ActiveRemoteSyncAttemptSource } from "./activeRemoteSyncAttemptActionsPolicy";
import { activeRemoteSyncRetryMessage } from "./remoteSyncStatusPolicy";

export type ActiveRemoteSyncPackageSkipReason = "cancelled" | "missing_package" | "package_changed";

export type ActiveRemoteSyncPackageActions<TPackage extends { id: string }> =
  | {
      reason: ActiveRemoteSyncPackageSkipReason;
      shouldSyncPackage: false;
    }
  | {
      packageToSync: TPackage;
      shouldSyncPackage: true;
    };

export type ActiveRemoteSyncResultActions =
  | {
      reason: "cancelled" | "missing_sync_state";
      shouldApplySyncState: false;
    }
  | {
      shouldApplySyncState: true;
    };

export type ActiveRemoteSyncFailureActions =
  | {
      shouldApply: false;
    }
  | {
      log: {
        event: "emergency_active_remote_sync_error";
        payload: {
          packageId: string;
          platform: string;
          source: ActiveRemoteSyncAttemptSource;
        };
      };
      recordingStatus: string;
      shouldApply: true;
    };

export type ActiveRemoteSyncFinallyActions = {
  shouldClearInFlight: true;
};

export function resolveActiveRemoteSyncPackageActions<TPackage extends { id: string }>(input: {
  activePackage?: TPackage | null;
  activePackageId: string;
  cancelled: boolean;
}): ActiveRemoteSyncPackageActions<TPackage> {
  if (input.cancelled) {
    return { reason: "cancelled", shouldSyncPackage: false };
  }

  if (!input.activePackage) {
    return { reason: "missing_package", shouldSyncPackage: false };
  }

  if (input.activePackage.id !== input.activePackageId) {
    return { reason: "package_changed", shouldSyncPackage: false };
  }

  return {
    packageToSync: input.activePackage,
    shouldSyncPackage: true
  };
}

export function resolveActiveRemoteSyncResultActions(input: {
  cancelled: boolean;
  hasSyncState: boolean;
}): ActiveRemoteSyncResultActions {
  if (input.cancelled) {
    return { reason: "cancelled", shouldApplySyncState: false };
  }

  if (!input.hasSyncState) {
    return { reason: "missing_sync_state", shouldApplySyncState: false };
  }

  return { shouldApplySyncState: true };
}

export function resolveActiveRemoteSyncFailureActions(input: {
  activePackageId: string;
  cancelled: boolean;
  platform: string;
  source: ActiveRemoteSyncAttemptSource;
}): ActiveRemoteSyncFailureActions {
  if (input.cancelled) {
    return { shouldApply: false };
  }

  return {
    log: {
      event: "emergency_active_remote_sync_error",
      payload: {
        packageId: input.activePackageId,
        platform: input.platform,
        source: input.source
      }
    },
    recordingStatus: activeRemoteSyncRetryMessage(),
    shouldApply: true
  };
}

export function resolveActiveRemoteSyncFinallyActions(): ActiveRemoteSyncFinallyActions {
  return {
    shouldClearInFlight: true
  };
}
