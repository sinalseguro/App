import assert from "node:assert/strict";

import { EmergencyCallTarget } from "../src/features/emergency-home/EmergencyCallTarget";
import { resolveEmergencyCallHeroPresentation } from "../src/features/emergency-home/emergencyCallHeroPolicy";

const target = new EmergencyCallTarget("SAMU", "SAMU", "192", "samu");

assert.deepEqual(resolveEmergencyCallHeroPresentation(target), {
  accessibilityHint: "Liga para 192",
  accessibilityLabel: "192 SAMU"
});

console.log("emergency-call-hero-policy ok");
