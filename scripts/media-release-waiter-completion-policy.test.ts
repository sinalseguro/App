import assert from "node:assert/strict";

import { resolveMediaReleaseWaiterCompletion } from "../src/features/emergency-home/mediaReleaseWaiterCompletionPolicy";

assert.deepEqual(resolveMediaReleaseWaiterCompletion(false), {
  shouldClearPendingRequest: false,
  shouldClearTimeout: false,
  shouldResolvePendingRequest: false
});

assert.deepEqual(resolveMediaReleaseWaiterCompletion(true), {
  shouldClearPendingRequest: true,
  shouldClearTimeout: true,
  shouldResolvePendingRequest: true
});

console.log("media-release-waiter-completion-policy ok");
