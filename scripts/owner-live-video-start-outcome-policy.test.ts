import assert from "node:assert/strict";

import { resolveOwnerLiveVideoStartOutcomeActions } from "../src/features/emergency-home/ownerLiveVideoStartOutcomePolicy";

assert.deepEqual(
  resolveOwnerLiveVideoStartOutcomeActions({
    outcome: "recording_started",
    packageId: "pkg-1",
    platform: "android",
    remoteSessionId: "remote-1"
  }),
  {
    auditMarker: {
      event: "local_evidence_recording",
      options: {
        connectionState: "connected",
        localEvidenceStatus: "recording"
      }
    },
    evidenceUpdate: {
      localEvidenceStatus: "recording",
      packageId: "pkg-1",
      status: "recording"
    },
    recordingStatusInput: {
      event: "live_call_recording_started"
    },
    shouldStoreActiveRecording: true
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoStartOutcomeActions({
    outcome: "metadata_only",
    packageId: "pkg-1",
    platform: "android",
    remoteSessionId: "remote-1"
  }),
  {
    evidenceUpdate: {
      localEvidenceStatus: "metadata_only",
      packageId: "pkg-1",
      status: "transmitting"
    },
    shouldStoreActiveRecording: false
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoStartOutcomeActions({
    outcome: "start_error",
    packageId: "pkg-1",
    platform: "android",
    remoteSessionId: "remote-1"
  }),
  {
    evidenceUpdate: {
      localEvidenceStatus: "metadata_only",
      packageId: "pkg-1",
      status: "transmitting"
    },
    log: {
      event: "live_video_recording_start_error",
      payload: {
        platform: "android",
        remoteSessionId: "remote-1"
      }
    },
    shouldStoreActiveRecording: false
  }
);

console.log("owner-live-video-start-outcome-policy ok");
