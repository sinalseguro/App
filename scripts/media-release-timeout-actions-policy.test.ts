import assert from "node:assert/strict";

import { resolveMediaReleaseTimeoutActions } from "../src/features/emergency-home/mediaReleaseTimeoutActionsPolicy";

assert.deepEqual(
  resolveMediaReleaseTimeoutActions({
    hasPendingRequest: true,
    platform: "android",
    timeoutMs: 12000
  }),
  {
    logEvent: "emergency_live_call_media_release_timeout",
    logPayload: {
      platform: "android",
      timeoutMs: 12000
    },
    shouldClearPendingRequest: true,
    shouldResolvePendingRequest: true
  }
);

assert.deepEqual(
  resolveMediaReleaseTimeoutActions({
    hasPendingRequest: false,
    platform: "ios",
    timeoutMs: 8000
  }),
  {
    logEvent: "emergency_live_call_media_release_timeout",
    logPayload: {
      platform: "ios",
      timeoutMs: 8000
    },
    shouldClearPendingRequest: false,
    shouldResolvePendingRequest: true
  }
);

console.log("media-release-timeout-actions-policy ok");
