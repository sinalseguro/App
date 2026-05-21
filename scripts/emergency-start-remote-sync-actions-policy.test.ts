import assert from "node:assert/strict";

import {
  resolveEmergencyStartRemoteSyncErrorActions,
  resolveEmergencyStartRemoteSyncResultActions
} from "../src/features/emergency-home/emergencyStartRemoteSyncActionsPolicy";

assert.deepEqual(
  resolveEmergencyStartRemoteSyncResultActions({
    locationText: "Localizacao preservada.",
    platform: "android",
    syncState: {
      recipientCount: 1,
      remoteSessionId: "session-1",
      status: "sent_to_ec2"
    }
  }),
  {
    applyRemoteSyncStateOptions: {
      locationText: "Localizacao preservada.",
      source: "initial"
    },
    log: {
      event: "emergency_remote_sync_start_result",
      payload: {
        platform: "android",
        recipientCount: 1,
        remoteSessionCreated: true,
        status: "sent_to_ec2"
      }
    },
    shouldApplyRemoteSyncState: true
  }
);

assert.deepEqual(
  resolveEmergencyStartRemoteSyncResultActions({
    locationText: "Localizacao nao registrada.",
    platform: "ios",
    syncState: {
      recipientCount: 0,
      remoteSessionId: undefined,
      status: "failed"
    }
  }).log.payload,
  {
    platform: "ios",
    recipientCount: 0,
    remoteSessionCreated: false,
    status: "failed"
  }
);

assert.deepEqual(
  resolveEmergencyStartRemoteSyncErrorActions({
    platform: "android"
  }),
  {
    log: {
      event: "emergency_remote_sync_start_error",
      payload: {
        platform: "android"
      }
    }
  }
);

console.log("emergency-start-remote-sync-actions-policy ok");
