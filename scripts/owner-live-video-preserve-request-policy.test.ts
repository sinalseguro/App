import assert from "node:assert/strict";

import { resolveOwnerLiveVideoPreserveRequest } from "../src/features/emergency-home/ownerLiveVideoPreserveRequestPolicy";

assert.deepEqual(
  resolveOwnerLiveVideoPreserveRequest({
    hasActiveRecording: true,
    hasPendingStart: false,
    preserveInFlight: false,
    preservePromiseActive: true
  }),
  {
    action: "reuse_preserve_promise",
    shouldAwaitPendingStart: false,
    shouldReturnPreservePromise: true,
    shouldStartPreserve: false
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoPreserveRequest({
    hasActiveRecording: false,
    hasPendingStart: true,
    preserveInFlight: true,
    preservePromiseActive: false
  }),
  {
    action: "await_pending_start",
    shouldAwaitPendingStart: true,
    shouldReturnPreservePromise: false,
    shouldStartPreserve: false
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoPreserveRequest({
    hasActiveRecording: false,
    hasPendingStart: false,
    preserveInFlight: false,
    preservePromiseActive: false
  }),
  {
    action: "skip_no_recording",
    shouldAwaitPendingStart: false,
    shouldReturnPreservePromise: false,
    shouldStartPreserve: false
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoPreserveRequest({
    hasActiveRecording: true,
    hasPendingStart: false,
    preserveInFlight: true,
    preservePromiseActive: false
  }),
  {
    action: "skip_preserve_in_flight",
    shouldAwaitPendingStart: false,
    shouldReturnPreservePromise: false,
    shouldStartPreserve: false
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoPreserveRequest({
    hasActiveRecording: true,
    hasPendingStart: false,
    preserveInFlight: false,
    preservePromiseActive: false
  }),
  {
    action: "start_preserve",
    shouldAwaitPendingStart: false,
    shouldReturnPreservePromise: false,
    shouldStartPreserve: true
  }
);

console.log("owner-live-video-preserve-request-policy ok");
