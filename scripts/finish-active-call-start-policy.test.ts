import assert from "node:assert/strict";

import { resolveFinishActiveCallStart } from "../src/features/emergency-home/finishActiveCallStartPolicy";

assert.deepEqual(
  resolveFinishActiveCallStart({
    activePackageId: null,
    captureStopLocked: false,
    finishInProgress: false,
    finishInProgressRef: false,
    liveAudioRemoteSessionId: null,
    liveRemoteSessionId: null,
    ownerLiveVideoRecordingActive: false,
    ownerLiveVideoStartRequestActive: false
  }),
  { reason: "missing_active_package", shouldStart: false }
);

assert.deepEqual(
  resolveFinishActiveCallStart({
    activePackageId: "pkg-1",
    captureStopLocked: false,
    finishInProgress: true,
    finishInProgressRef: true,
    liveAudioRemoteSessionId: "live-audio-1",
    liveRemoteSessionId: "live-fallback-1",
    ownerLiveVideoRecordingActive: false,
    ownerLiveVideoStartRequestActive: false
  }),
  { reason: "finish_in_progress", shouldStart: false }
);

assert.deepEqual(
  resolveFinishActiveCallStart({
    activePackageId: "pkg-1",
    captureStopLocked: false,
    finishInProgress: false,
    finishInProgressRef: true,
    liveAudioRemoteSessionId: "live-audio-1",
    liveRemoteSessionId: "live-fallback-1",
    ownerLiveVideoRecordingActive: false,
    ownerLiveVideoStartRequestActive: false
  }),
  { reason: "finish_ref_in_progress", shouldStart: false }
);

assert.deepEqual(
  resolveFinishActiveCallStart({
    activePackageId: "pkg-1",
    captureStopLocked: false,
    finishInProgress: false,
    finishInProgressRef: false,
    liveAudioRemoteSessionId: "live-audio-1",
    liveRemoteSessionId: "live-fallback-1",
    ownerLiveVideoRecordingActive: true,
    ownerLiveVideoStartRequestActive: false
  }),
  {
    mediaWasHandedToLiveCall: true,
    packageId: "pkg-1",
    remoteSessionIdToFinish: "live-audio-1",
    shouldStart: true
  }
);

assert.deepEqual(
  resolveFinishActiveCallStart({
    activePackageId: "pkg-2",
    captureStopLocked: false,
    finishInProgress: false,
    finishInProgressRef: false,
    liveAudioRemoteSessionId: null,
    liveRemoteSessionId: "live-fallback-2",
    ownerLiveVideoRecordingActive: false,
    ownerLiveVideoStartRequestActive: true
  }),
  {
    mediaWasHandedToLiveCall: true,
    packageId: "pkg-2",
    remoteSessionIdToFinish: "live-fallback-2",
    shouldStart: true
  }
);

assert.deepEqual(
  resolveFinishActiveCallStart({
    activePackageId: "pkg-3",
    captureStopLocked: false,
    finishInProgress: false,
    finishInProgressRef: false,
    liveAudioRemoteSessionId: null,
    liveRemoteSessionId: null,
    ownerLiveVideoRecordingActive: false,
    ownerLiveVideoStartRequestActive: false
  }),
  {
    mediaWasHandedToLiveCall: false,
    packageId: "pkg-3",
    remoteSessionIdToFinish: null,
    shouldStart: true
  }
);

console.log("finish-active-call-start-policy ok");
