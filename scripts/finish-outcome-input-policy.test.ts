import assert from "node:assert/strict";

import { resolveFinishOutcomeInput } from "../src/features/emergency-home/finishOutcomeInputPolicy";

assert.deepEqual(
  resolveFinishOutcomeInput({
    finishPackageResult: {
      attachedAssetsAfterFinish: 2,
      liveVideoAttached: true
    },
    mediaWasHandedToLiveCall: true,
    remoteFinishFailed: false,
    stopResultStatus: "attached",
    stopSerialPresent: true
  }),
  {
    attachedAssetsAfterFinish: 2,
    liveVideoAttached: true,
    mediaWasHandedToLiveCall: true,
    remoteFinishFailed: false,
    stopResultStatus: "attached",
    stopSerialPresent: true
  }
);

assert.deepEqual(
  resolveFinishOutcomeInput({
    finishPackageResult: {
      attachedAssetsAfterFinish: 0,
      liveVideoAttached: false
    },
    mediaWasHandedToLiveCall: false,
    remoteFinishFailed: true,
    stopSerialPresent: false
  }),
  {
    attachedAssetsAfterFinish: 0,
    liveVideoAttached: false,
    mediaWasHandedToLiveCall: false,
    remoteFinishFailed: true,
    stopResultStatus: undefined,
    stopSerialPresent: false
  }
);

console.log("finish-outcome-input-policy ok");
