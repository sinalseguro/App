import assert from "node:assert/strict";

import {
  EmergencyCallTarget
} from "../src/features/emergency-home/EmergencyCallTarget";
import { resolveEmergencyCallConfirmation } from "../src/features/emergency-home/emergencyCallConfirmationPolicy";

const target = new EmergencyCallTarget("Policia", "Policia Militar", "190", "police");

assert.deepEqual(resolveEmergencyCallConfirmation(target), {
  cancelLabel: "Cancelar",
  confirmLabel: "Ligar",
  message: "",
  title: "Ligar para Policia Militar?"
});

assert.equal(target.callUri, "tel:190");

console.log("emergency-call-confirmation-policy ok");
