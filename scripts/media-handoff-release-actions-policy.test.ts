import assert from "node:assert/strict";

import {
  resolveMediaHandoffReleaseCleanupActions,
  resolveMediaHandoffReleaseCompletionActions,
  resolveMediaHandoffReleaseWaitActions
} from "../src/features/emergency-home/mediaHandoffReleaseActionsPolicy";

assert.deepEqual(
  resolveMediaHandoffReleaseWaitActions({ stopSerial: null }),
  {
    action: "skip_missing_stop_serial",
    shouldClearPurpose: true,
    shouldSetPending: false,
    shouldWaitForRelease: false
  }
);

assert.deepEqual(
  resolveMediaHandoffReleaseWaitActions({ stopSerial: 7 }),
  {
    action: "wait_for_release",
    shouldClearPurpose: false,
    shouldSetPending: true,
    shouldWaitForRelease: true,
    stopSerial: 7
  }
);

assert.deepEqual(
  resolveMediaHandoffReleaseCompletionActions({
    packageId: "pkg-1",
    platform: "android",
    stage: {
      auditMarker: "owner_media_handoff_complete",
      connectionState: "connecting",
      localEvidenceStatus: "metadata_only",
      liveEvidenceStatus: "transmitting"
    },
    stopSerial: 7
  }),
  {
    auditMarker: {
      event: "owner_media_handoff_complete",
      options: {
        connectionState: "connecting",
        localEvidenceStatus: "metadata_only"
      }
    },
    evidenceUpdate: {
      localEvidenceStatus: "metadata_only",
      packageId: "pkg-1",
      status: "transmitting"
    },
    log: {
      event: "emergency_live_call_media_handoff_camera_released",
      payload: {
        packageId: "pkg-1",
        platform: "android",
        stopRequestSerial: 7
      }
    }
  }
);

assert.deepEqual(
  resolveMediaHandoffReleaseCleanupActions({ packageId: "pkg-1" }),
  {
    mediaRecorderPackageId: "pkg-1",
    mediaStopPending: false,
    shouldClearPurpose: true
  }
);

console.log("media-handoff-release-actions-policy ok");
