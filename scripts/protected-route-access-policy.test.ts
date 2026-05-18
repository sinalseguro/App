import assert from "node:assert/strict";

import { resolveProtectedRouteAccessDecision } from "../src/features/emergency-home/protectedRouteAccessPolicy";

assert.equal(
  resolveProtectedRouteAccessDecision({
    protectedAccessUnlocked: false,
    requireSecurityCode: true
  }),
  "request_security_code"
);

assert.equal(
  resolveProtectedRouteAccessDecision({
    protectedAccessUnlocked: true,
    requireSecurityCode: true
  }),
  "navigate"
);

assert.equal(
  resolveProtectedRouteAccessDecision({
    protectedAccessUnlocked: false,
    requireSecurityCode: false
  }),
  "navigate"
);

console.log("protected-route-access-policy ok");
