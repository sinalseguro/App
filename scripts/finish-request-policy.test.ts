import assert from "node:assert/strict";

import { resolveFinishRequestDecision } from "../src/features/emergency-home/finishRequestPolicy";

assert.deepEqual(
  resolveFinishRequestDecision({
    finishInProgress: false,
    finishInProgressRef: false,
    requireSecurityCode: true
  }),
  {
    reason: "missing_active_package",
    shouldContinue: false
  }
);

assert.deepEqual(
  resolveFinishRequestDecision({
    activePackageId: "pkg-1",
    finishInProgress: true,
    finishInProgressRef: false,
    requireSecurityCode: true
  }),
  {
    reason: "finish_in_progress",
    shouldContinue: false
  }
);

assert.deepEqual(
  resolveFinishRequestDecision({
    activePackageId: "pkg-1",
    finishInProgress: false,
    finishInProgressRef: true,
    requireSecurityCode: true
  }),
  {
    reason: "finish_ref_in_progress",
    shouldContinue: false
  }
);

assert.deepEqual(
  resolveFinishRequestDecision({
    activePackageId: "pkg-1",
    finishInProgress: false,
    finishInProgressRef: false,
    requireSecurityCode: true
  }),
  {
    action: "open_security_confirmation",
    shouldContinue: true,
    shouldResetConfirmationForm: true
  }
);

assert.deepEqual(
  resolveFinishRequestDecision({
    activePackageId: "pkg-1",
    finishInProgress: false,
    finishInProgressRef: false,
    requireSecurityCode: false
  }),
  {
    action: "finish_now",
    shouldContinue: true,
    shouldResetConfirmationForm: true
  }
);

console.log("finish-request-policy ok");
