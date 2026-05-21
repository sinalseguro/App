import type { EmergencyRemoteSyncState } from "@/features/emergency/emergencySyncQueue";

export type EmergencyStartRemoteSyncResultActions = {
  applyRemoteSyncStateOptions: {
    locationText: string;
    source: "initial";
  };
  log: {
    event: "emergency_remote_sync_start_result";
    payload: {
      platform: string;
      recipientCount: number;
      remoteSessionCreated: boolean;
      status: EmergencyRemoteSyncState["status"];
    };
  };
  shouldApplyRemoteSyncState: true;
};

export type EmergencyStartRemoteSyncErrorActions = {
  log: {
    event: "emergency_remote_sync_start_error";
    payload: {
      platform: string;
    };
  };
};

export function resolveEmergencyStartRemoteSyncResultActions(input: {
  locationText: string;
  platform: string;
  syncState: Pick<EmergencyRemoteSyncState, "recipientCount" | "remoteSessionId" | "status">;
}): EmergencyStartRemoteSyncResultActions {
  return {
    applyRemoteSyncStateOptions: {
      locationText: input.locationText,
      source: "initial"
    },
    log: {
      event: "emergency_remote_sync_start_result",
      payload: {
        platform: input.platform,
        recipientCount: input.syncState.recipientCount,
        remoteSessionCreated: Boolean(input.syncState.remoteSessionId),
        status: input.syncState.status
      }
    },
    shouldApplyRemoteSyncState: true
  };
}

export function resolveEmergencyStartRemoteSyncErrorActions(input: {
  platform: string;
}): EmergencyStartRemoteSyncErrorActions {
  return {
    log: {
      event: "emergency_remote_sync_start_error",
      payload: {
        platform: input.platform
      }
    }
  };
}
