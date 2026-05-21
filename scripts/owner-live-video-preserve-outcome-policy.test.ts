import assert from "node:assert/strict";

import {
  resolveOwnerLiveVideoPreserveCompletionActions,
  resolveOwnerLiveVideoPreserveErrorActions,
  resolveOwnerLiveVideoPreserveStoppedActions
} from "../src/features/emergency-home/ownerLiveVideoPreserveOutcomePolicy";

assert.deepEqual(
  resolveOwnerLiveVideoPreserveStoppedActions({
    packageId: "pkg-1",
    platform: "android",
    reason: "finish",
    remoteSessionId: "remote-1",
    requestedCameraMode: "back"
  }),
  {
    shouldPreserve: false
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoPreserveStoppedActions({
    audioCaptured: true,
    completedAt: "2026-05-20T20:00:02.000Z",
    frameCount: 12,
    packageId: "pkg-1",
    platform: "android",
    reason: "manual_stop",
    remoteSessionId: "remote-1",
    requestedCameraMode: "both",
    sizeBytes: 1024,
    sourceUri: "cache://owner-live.mp4",
    startedAt: "2026-05-20T20:00:00.000Z"
  }),
  {
    audioCaptured: true,
    completedAt: "2026-05-20T20:00:02.000Z",
    preserveAssetInput: {
      cameraMode: "back",
      completedAt: "2026-05-20T20:00:02.000Z",
      packageId: "pkg-1",
      requestedCameraMode: "both",
      sourceUri: "cache://owner-live.mp4",
      startedAt: "2026-05-20T20:00:00.000Z",
      verificationMode: "bounded"
    },
    preserveStartLog: {
      event: "live_video_recording_preserve_start",
      payload: {
        audioCaptured: true,
        frameCount: 12,
        platform: "android",
        reason: "manual_stop",
        remoteSessionId: "remote-1",
        sizeBytes: 1024
      }
    },
    shouldPreserve: true
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoPreserveCompletionActions({
    assetCreated: true,
    audioCaptured: false,
    completedAt: "2026-05-20T20:00:02.000Z",
    packageId: "pkg-1",
    platform: "android",
    reason: "finish",
    remoteSessionId: "remote-1"
  }),
  {
    auditMarker: {
      event: "local_evidence_protected",
      options: {
        connectionState: "ended",
        localEvidenceStatus: "protected"
      }
    },
    evidenceUpdate: {
      endedAt: "2026-05-20T20:00:02.000Z",
      localEvidenceStatus: "protected",
      packageId: "pkg-1",
      status: "protected"
    },
    recordingStatusInput: {
      audioCaptured: false,
      event: "live_call_recording_preserved"
    },
    successLog: {
      event: "live_video_recording_preserve_success",
      payload: {
        assetCreated: true,
        audioCaptured: false,
        platform: "android",
        reason: "finish",
        remoteSessionId: "remote-1"
      }
    }
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoPreserveCompletionActions({
    assetCreated: false,
    audioCaptured: true,
    completedAt: "2026-05-20T20:00:02.000Z",
    packageId: "pkg-1",
    platform: "android",
    reason: "replace_recording",
    remoteSessionId: "remote-1"
  }),
  {
    auditMarker: {
      event: "local_evidence_protected",
      options: {
        connectionState: "connected",
        localEvidenceStatus: "protected"
      }
    },
    evidenceUpdate: {
      endedAt: undefined,
      localEvidenceStatus: "protected",
      packageId: "pkg-1",
      status: "transmitting"
    },
    recordingStatusInput: {
      audioCaptured: true,
      event: "live_call_recording_preserved"
    },
    successLog: {
      event: "live_video_recording_preserve_success",
      payload: {
        assetCreated: false,
        audioCaptured: true,
        platform: "android",
        reason: "replace_recording",
        remoteSessionId: "remote-1"
      }
    }
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoPreserveErrorActions({
    packageId: "pkg-1",
    platform: "android",
    reason: "finish",
    remoteSessionId: "remote-1"
  }),
  {
    auditMarker: {
      event: "local_evidence_failed",
      options: {
        connectionState: "failed",
        localEvidenceStatus: "failed"
      }
    },
    errorLog: {
      event: "live_video_recording_preserve_error",
      payload: {
        platform: "android",
        reason: "finish",
        remoteSessionId: "remote-1"
      }
    },
    evidenceUpdate: {
      localEvidenceStatus: "failed",
      packageId: "pkg-1",
      status: "failed"
    }
  }
);

console.log("owner-live-video-preserve-outcome-policy ok");
