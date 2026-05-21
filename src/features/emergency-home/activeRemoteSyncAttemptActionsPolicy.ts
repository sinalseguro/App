export type ActiveRemoteSyncAttemptSource = "retry" | "resume";

export type ActiveRemoteSyncAttemptSkipReason = "cancelled" | "missing_package" | "in_flight" | "has_remote_session";

export type ActiveRemoteSyncAttemptActions =
  | {
      reason: ActiveRemoteSyncAttemptSkipReason;
      shouldAttempt: false;
      shouldSetInFlight: false;
    }
  | {
      log: {
        event: "emergency_active_remote_sync_attempt";
        payload: {
          packageId: string;
          platform: string;
          source: ActiveRemoteSyncAttemptSource;
        };
      };
      shouldAttempt: true;
      shouldSetInFlight: true;
    };

export function resolveActiveRemoteSyncAttemptActions(input: {
  activePackageId?: string | null;
  cancelled: boolean;
  inFlight: boolean;
  liveRemoteSessionId?: string | null;
  platform: string;
  source: ActiveRemoteSyncAttemptSource;
}): ActiveRemoteSyncAttemptActions {
  if (input.cancelled) {
    return { reason: "cancelled", shouldAttempt: false, shouldSetInFlight: false };
  }

  if (!input.activePackageId) {
    return { reason: "missing_package", shouldAttempt: false, shouldSetInFlight: false };
  }

  if (input.inFlight) {
    return { reason: "in_flight", shouldAttempt: false, shouldSetInFlight: false };
  }

  if (input.liveRemoteSessionId) {
    return { reason: "has_remote_session", shouldAttempt: false, shouldSetInFlight: false };
  }

  return {
    log: {
      event: "emergency_active_remote_sync_attempt",
      payload: {
        packageId: input.activePackageId,
        platform: input.platform,
        source: input.source
      }
    },
    shouldAttempt: true,
    shouldSetInFlight: true
  };
}
