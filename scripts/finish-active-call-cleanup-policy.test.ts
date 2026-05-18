import assert from "node:assert/strict";

import { resolveFinishActiveCallCleanup } from "../src/features/emergency-home/finishActiveCallCleanupPolicy";

assert.deepEqual(
  resolveFinishActiveCallCleanup({ mediaStopPurpose: "finish" }),
  {
    shouldClearMediaStopPending: true,
    shouldClearMediaStopPurpose: true,
    shouldReleaseFinishInProgress: true,
    shouldUnlockCaptureStop: true
  }
);

assert.deepEqual(
  resolveFinishActiveCallCleanup({ mediaStopPurpose: "live_call_handoff" }),
  {
    shouldClearMediaStopPending: true,
    shouldClearMediaStopPurpose: false,
    shouldReleaseFinishInProgress: true,
    shouldUnlockCaptureStop: true
  }
);

assert.deepEqual(
  resolveFinishActiveCallCleanup({ mediaStopPurpose: null }),
  {
    shouldClearMediaStopPending: true,
    shouldClearMediaStopPurpose: false,
    shouldReleaseFinishInProgress: true,
    shouldUnlockCaptureStop: true
  }
);

console.log("finish-active-call-cleanup-policy ok");
