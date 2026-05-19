import assert from "node:assert/strict";

import { resolveMediaStopPendingRequestCompletion } from "../src/features/emergency-home/mediaStopPendingRequestCompletionPolicy";

assert.deepEqual(
  resolveMediaStopPendingRequestCompletion({
    hasPendingRequest: true,
    pendingSerial: 4,
    serial: 4
  }),
  {
    shouldClearPendingRequest: true,
    shouldClearTimeout: true,
    shouldResolvePendingRequest: true
  }
);

assert.deepEqual(
  resolveMediaStopPendingRequestCompletion({
    hasPendingRequest: true,
    pendingSerial: 3,
    serial: 4
  }),
  {
    shouldClearPendingRequest: false,
    shouldClearTimeout: false,
    shouldResolvePendingRequest: false
  }
);

assert.deepEqual(
  resolveMediaStopPendingRequestCompletion({
    hasPendingRequest: false,
    pendingSerial: 4,
    serial: 4
  }),
  {
    shouldClearPendingRequest: false,
    shouldClearTimeout: false,
    shouldResolvePendingRequest: false
  }
);

console.log("media-stop-pending-request-completion-policy ok");
