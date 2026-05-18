import assert from "node:assert/strict";

import { resolveMediaStopSignal } from "../src/features/emergency-home/mediaStopSignalPolicy";

assert.deepEqual(
  resolveMediaStopSignal({
    currentSerial: 8,
    isWebPlatform: false,
    platform: "android",
    requestLocalVideoOnSos: true
  }),
  {
    logEvent: "emergency_media_stop_signal",
    logPayload: {
      platform: "android",
      stopRequestSerial: 9
    },
    serial: 9,
    shouldSignal: true
  }
);

assert.deepEqual(
  resolveMediaStopSignal({
    currentSerial: 8,
    isWebPlatform: true,
    platform: "web",
    requestLocalVideoOnSos: true
  }),
  { shouldSignal: false }
);

assert.deepEqual(
  resolveMediaStopSignal({
    currentSerial: 8,
    isWebPlatform: false,
    platform: "android",
    requestLocalVideoOnSos: false
  }),
  { shouldSignal: false }
);

console.log("media-stop-signal-policy ok");
