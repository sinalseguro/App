import assert from "node:assert/strict";

import { resolveLiveCallPanelPolicy } from "../src/features/emergency-home/liveCallPanelPolicy";

assert.deepEqual(
  resolveLiveCallPanelPolicy({
    activePackageId: null,
    finishInProgress: false,
    liveAudioCallStatus: "idle",
    liveRemoteSessionId: null,
    mediaStopPending: false
  }),
  {
    primaryActionDisabled: true,
    shouldAvoidMediaRecorderPanel: false,
    shouldRenderPanel: false,
    shouldRenderStatusBand: true
  }
);

assert.deepEqual(
  resolveLiveCallPanelPolicy({
    activePackageId: "pkg-1",
    finishInProgress: false,
    liveAudioCallStatus: "idle",
    liveRemoteSessionId: null,
    mediaStopPending: false
  }),
  {
    primaryActionDisabled: true,
    shouldAvoidMediaRecorderPanel: false,
    shouldRenderPanel: false,
    shouldRenderStatusBand: true
  }
);

assert.deepEqual(
  resolveLiveCallPanelPolicy({
    activePackageId: "pkg-1",
    finishInProgress: false,
    liveAudioCallStatus: "waiting",
    liveRemoteSessionId: "session-1",
    mediaStopPending: false
  }),
  {
    primaryActionDisabled: false,
    shouldAvoidMediaRecorderPanel: true,
    shouldRenderPanel: true,
    shouldRenderStatusBand: false
  }
);

assert.equal(
  resolveLiveCallPanelPolicy({
    activePackageId: "pkg-1",
    finishInProgress: true,
    liveAudioCallStatus: "waiting",
    liveRemoteSessionId: "session-1",
    mediaStopPending: false
  }).primaryActionDisabled,
  true
);

assert.equal(
  resolveLiveCallPanelPolicy({
    activePackageId: "pkg-1",
    finishInProgress: false,
    liveAudioCallStatus: "waiting",
    liveRemoteSessionId: "session-1",
    mediaStopPending: true
  }).primaryActionDisabled,
  true
);

assert.deepEqual(
  resolveLiveCallPanelPolicy({
    activePackageId: "pkg-1",
    finishInProgress: false,
    liveAudioCallStatus: "connected",
    liveRemoteSessionId: null,
    mediaStopPending: false
  }),
  {
    primaryActionDisabled: true,
    shouldAvoidMediaRecorderPanel: true,
    shouldRenderPanel: true,
    shouldRenderStatusBand: false
  }
);

console.log("live-call-panel-policy ok");
