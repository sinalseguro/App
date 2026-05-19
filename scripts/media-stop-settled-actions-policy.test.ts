import assert from "node:assert/strict";

import { resolveMediaStopSettledActions } from "../src/features/emergency-home/mediaStopSettledActionsPolicy";

assert.deepEqual(
  resolveMediaStopSettledActions({
    expectedSerial: 7,
    platform: "android",
    result: {
      attachedAssets: 1,
      status: "attached"
    },
    serial: 7
  }),
  {
    settlementLog: {
      logEvent: "emergency_media_stop_settled",
      logPayload: {
        attachedAssets: 1,
        platform: "android",
        status: "attached"
      }
    },
    settlementPresentation: {
      recordingStatus: "Video finalizado e preservado no cofre local.",
      shouldRefreshOutbox: true
    },
    shouldHandle: true,
    shouldResolveMediaReleaseWaiter: true
  }
);

assert.deepEqual(
  resolveMediaStopSettledActions({
    expectedSerial: 7,
    platform: "android",
    result: {
      attachedAssets: 0,
      status: "empty"
    },
    serial: 8
  }),
  {
    shouldHandle: false
  }
);

console.log("media-stop-settled-actions-policy ok");
