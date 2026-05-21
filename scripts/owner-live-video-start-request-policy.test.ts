import assert from "node:assert/strict";

import { resolveOwnerLiveVideoStartRequest } from "../src/features/emergency-home/ownerLiveVideoStartRequestPolicy";

assert.deepEqual(
  resolveOwnerLiveVideoStartRequest({
    activeRecordingRemoteSessionId: "remote-1",
    requestPackageId: "pkg-1",
    requestRemoteSessionId: "remote-1"
  }),
  {
    action: "reuse_active_recording",
    shouldReturnActiveRecording: true,
    shouldReturnPendingStart: false,
    shouldStartNewRecording: false,
    shouldStopActiveRecording: false
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoStartRequest({
    pendingStartPackageId: "pkg-1",
    pendingStartRemoteSessionId: "remote-1",
    requestPackageId: "pkg-1",
    requestRemoteSessionId: "remote-1"
  }),
  {
    action: "reuse_pending_start",
    shouldReturnActiveRecording: false,
    shouldReturnPendingStart: true,
    shouldStartNewRecording: false,
    shouldStopActiveRecording: false
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoStartRequest({
    activeRecordingRemoteSessionId: "remote-old",
    requestPackageId: "pkg-1",
    requestRemoteSessionId: "remote-1"
  }),
  {
    action: "replace_active_recording",
    shouldReturnActiveRecording: false,
    shouldReturnPendingStart: false,
    shouldStartNewRecording: true,
    shouldStopActiveRecording: true
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoStartRequest({
    requestPackageId: "pkg-1",
    requestRemoteSessionId: "remote-1"
  }),
  {
    action: "start_new_recording",
    shouldReturnActiveRecording: false,
    shouldReturnPendingStart: false,
    shouldStartNewRecording: true,
    shouldStopActiveRecording: false
  }
);

console.log("owner-live-video-start-request-policy ok");
