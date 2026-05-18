import assert from "node:assert/strict";

import {
  resolveMediaStopTimeout,
  resolveMediaStopWaiterStart
} from "../src/features/emergency-home/mediaStopWaiterPolicy";

assert.deepEqual(resolveMediaStopWaiterStart(false), {
  previousRequestResult: {
    attachedAssets: 0,
    status: "error"
  },
  shouldResolvePreviousRequest: false
});

assert.deepEqual(resolveMediaStopWaiterStart(true), {
  previousRequestResult: {
    attachedAssets: 0,
    status: "error"
  },
  shouldResolvePreviousRequest: true
});

assert.deepEqual(resolveMediaStopTimeout({ currentSerial: 7, platform: "android", serial: 6, timeoutMs: 30000 }), {
  shouldResolve: false
});

assert.deepEqual(resolveMediaStopTimeout({ currentSerial: 6, platform: "android", serial: 6, timeoutMs: 30000 }), {
  logEvent: "emergency_media_stop_timeout",
  logPayload: {
    platform: "android",
    timeoutMs: 30000
  },
  result: {
    attachedAssets: 0,
    status: "error"
  },
  shouldClearPendingRequest: true,
  shouldResolve: true
});

console.log("media-stop-waiter-policy ok");
