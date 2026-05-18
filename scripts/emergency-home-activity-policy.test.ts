import assert from "node:assert/strict";

import { resolveEmergencyHomeActivityPresentation } from "../src/features/emergency-home/emergencyHomeActivityPolicy";

assert.deepEqual(
  resolveEmergencyHomeActivityPresentation({
    activePackageId: null,
    finishInProgress: false,
    mediaStopPending: false,
    startInProgress: false
  }),
  {
    activeVisualState: false,
    shouldKeepAwake: false,
    statusBandActive: false
  }
);

assert.deepEqual(
  resolveEmergencyHomeActivityPresentation({
    activePackageId: "pkg-1",
    finishInProgress: false,
    mediaStopPending: false,
    startInProgress: false
  }),
  {
    activeVisualState: true,
    shouldKeepAwake: true,
    statusBandActive: true
  }
);

assert.deepEqual(
  resolveEmergencyHomeActivityPresentation({
    activePackageId: null,
    finishInProgress: false,
    mediaStopPending: true,
    startInProgress: false
  }),
  {
    activeVisualState: false,
    shouldKeepAwake: true,
    statusBandActive: true
  }
);

assert.deepEqual(
  resolveEmergencyHomeActivityPresentation({
    activePackageId: null,
    finishInProgress: true,
    mediaStopPending: false,
    startInProgress: false
  }),
  {
    activeVisualState: false,
    shouldKeepAwake: true,
    statusBandActive: false
  }
);

console.log("emergency-home-activity-policy ok");
