import assert from "node:assert/strict";

import {
  resolveMediaReleaseTimeout,
  resolveMediaReleaseWaiterStart
} from "../src/features/emergency-home/mediaReleaseWaiterPolicy";

assert.deepEqual(resolveMediaReleaseWaiterStart(false), {
  shouldResolvePreviousRequest: false
});

assert.deepEqual(resolveMediaReleaseWaiterStart(true), {
  shouldResolvePreviousRequest: true
});

assert.deepEqual(resolveMediaReleaseTimeout({ platform: "android", timeoutMs: 12000 }), {
  logEvent: "emergency_live_call_media_release_timeout",
  logPayload: {
    platform: "android",
    timeoutMs: 12000
  },
  shouldClearPendingRequest: true
});

console.log("media-release-waiter-policy ok");
