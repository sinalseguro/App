import assert from "node:assert/strict";

import {
  buildLiveMediaConstraints,
  liveMediaOpenTimeoutMs,
  normalizeLiveAudioMode,
  normalizeLiveVideoMode,
  remoteStreamFromTrackEvent,
  shouldAddRecvOnlyAudioTransceiver,
  shouldAddRecvOnlyVideoTransceiver,
  shouldCaptureLiveAudio,
  shouldCaptureLiveVideo,
  shouldOpenLocalLiveMedia,
  toLiveConnectionState
} from "../src/features/live-call/liveWebRtcPolicy";

type FakeStream = {
  id: string;
  getTracks: () => readonly string[];
  getVideoTracks: () => readonly string[];
};

function fakeStream(id: string, tracks: readonly string[], videoTracks: readonly string[]): FakeStream {
  return {
    getTracks: () => tracks,
    getVideoTracks: () => videoTracks,
    id
  };
}

assert.equal(liveMediaOpenTimeoutMs, 12000);
assert.equal(normalizeLiveAudioMode(), "sendrecv");
assert.equal(normalizeLiveAudioMode("recvonly"), "recvonly");
assert.equal(normalizeLiveVideoMode(undefined, false), "disabled");
assert.equal(normalizeLiveVideoMode(undefined, true), "sendrecv");
assert.equal(normalizeLiveVideoMode("recvonly", false), "recvonly");

assert.equal(shouldCaptureLiveAudio("sendrecv"), true);
assert.equal(shouldCaptureLiveAudio("recvonly"), false);
assert.equal(shouldCaptureLiveVideo("sendrecv"), true);
assert.equal(shouldCaptureLiveVideo("recvonly"), false);
assert.equal(shouldCaptureLiveVideo("disabled"), false);
assert.equal(shouldOpenLocalLiveMedia("sendrecv", "disabled"), true);
assert.equal(shouldOpenLocalLiveMedia("recvonly", "sendrecv"), true);
assert.equal(shouldOpenLocalLiveMedia("recvonly", "recvonly"), false);
assert.equal(shouldAddRecvOnlyAudioTransceiver("recvonly"), true);
assert.equal(shouldAddRecvOnlyAudioTransceiver("sendrecv"), false);
assert.equal(shouldAddRecvOnlyVideoTransceiver("recvonly"), true);
assert.equal(shouldAddRecvOnlyVideoTransceiver("sendrecv"), false);

assert.deepEqual(buildLiveMediaConstraints("sendrecv", "sendrecv", "environment"), {
  audio: true,
  video: {
    facingMode: "environment",
    frameRate: { ideal: 12, max: 15 },
    height: { ideal: 360, max: 360 },
    width: { ideal: 640, max: 640 }
  }
});
assert.deepEqual(buildLiveMediaConstraints("recvonly", "disabled", "user"), {
  audio: false,
  video: false
});

assert.equal(toLiveConnectionState("connected"), "connected");
assert.equal(toLiveConnectionState("completed"), "connected");
assert.equal(toLiveConnectionState("checking"), "connecting");
assert.equal(toLiveConnectionState("connecting"), "connecting");
assert.equal(toLiveConnectionState("disconnected"), "disconnected");
assert.equal(toLiveConnectionState("failed"), "failed");
assert.equal(toLiveConnectionState("closed"), "closed");
assert.equal(toLiveConnectionState("unknown"), "new");

const audioOnly = fakeStream("audio", ["audio"], []);
const video = fakeStream("video", ["audio", "video"], ["video"]);
const fallback = fakeStream("fallback", ["track"], []);

assert.equal(
  remoteStreamFromTrackEvent({ streams: [audioOnly, video] }, () => fallback).id,
  "video"
);
assert.equal(
  remoteStreamFromTrackEvent({ streams: [audioOnly] }, () => fallback).id,
  "audio"
);
assert.equal(
  remoteStreamFromTrackEvent({ track: "detached-track" }, () => fallback).id,
  "fallback"
);
assert.equal(remoteStreamFromTrackEvent({}, () => fallback), null);

console.log("Live WebRTC policy test aprovado.");
