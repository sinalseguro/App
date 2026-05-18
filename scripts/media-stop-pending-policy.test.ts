import assert from "node:assert/strict";

import { resolveMediaStopPendingState } from "../src/features/emergency-home/mediaStopPendingPolicy";

assert.deepEqual(resolveMediaStopPendingState(true, { clearMediaRecorderPackageIdOnRelease: true }), {
  mediaStopPending: true,
  shouldClearMediaRecorderPackageId: false
});

assert.deepEqual(resolveMediaStopPendingState(false, { clearMediaRecorderPackageIdOnRelease: true }), {
  mediaStopPending: false,
  shouldClearMediaRecorderPackageId: true
});

assert.deepEqual(resolveMediaStopPendingState(false), {
  mediaStopPending: false,
  shouldClearMediaRecorderPackageId: false
});

console.log("media-stop-pending-policy ok");
