import assert from "node:assert/strict";

import {
  resolveFinishCompletionConfirmationFormPatch,
  resolveFinishRequestConfirmationFormPatch,
  shouldFinishImmediatelyAfterRequest
} from "../src/features/emergency-home/finishConfirmationFormPolicy";
import { resolveFinishRequestDecision } from "../src/features/emergency-home/finishRequestPolicy";

const missingPackageDecision = resolveFinishRequestDecision({
  finishInProgress: false,
  finishInProgressRef: false,
  requireSecurityCode: true
});

assert.deepEqual(resolveFinishRequestConfirmationFormPatch(missingPackageDecision), {});
assert.equal(shouldFinishImmediatelyAfterRequest(missingPackageDecision), false);

const secureFinishDecision = resolveFinishRequestDecision({
  activePackageId: "pkg-1",
  finishInProgress: false,
  finishInProgressRef: false,
  requireSecurityCode: true
});

assert.deepEqual(resolveFinishRequestConfirmationFormPatch(secureFinishDecision), {
  finishCodeInput: "",
  finishConfirmationOpen: true,
  finishError: ""
});
assert.equal(shouldFinishImmediatelyAfterRequest(secureFinishDecision), false);

const directFinishDecision = resolveFinishRequestDecision({
  activePackageId: "pkg-1",
  finishInProgress: false,
  finishInProgressRef: false,
  requireSecurityCode: false
});

assert.deepEqual(resolveFinishRequestConfirmationFormPatch(directFinishDecision), {
  finishCodeInput: "",
  finishError: ""
});
assert.equal(shouldFinishImmediatelyAfterRequest(directFinishDecision), true);

assert.deepEqual(
  resolveFinishCompletionConfirmationFormPatch({
    shouldClearFinishCodeInput: true,
    shouldClearFinishError: true,
    shouldCloseFinishConfirmation: true
  }),
  {
    finishCodeInput: "",
    finishConfirmationOpen: false,
    finishError: ""
  }
);

console.log("finish-confirmation-form-policy ok");
