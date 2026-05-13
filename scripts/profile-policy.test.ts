import assert from "node:assert/strict";

import {
  buildProtectionProfile,
  canAcceptAngelInvitation,
  canCreateTrustedContactInvitation,
  canReceiveFutureEmergencyDelivery,
  getProfileSummary
} from "../src/features/profiles/profilePolicy";

const adult = buildProtectionProfile("adult_self_managed", new Date("2026-05-13T12:00:00.000Z"));
const minor = buildProtectionProfile("minor_protected", new Date("2026-05-13T12:00:00.000Z"));
const responsibleWithoutMinor = buildProtectionProfile(
  "responsible_without_minor",
  new Date("2026-05-13T12:00:00.000Z")
);
const responsibleWithMinor = buildProtectionProfile("responsible_with_minor", new Date("2026-05-13T12:00:00.000Z"));

assert.equal(canCreateTrustedContactInvitation(null).allowed, false);
assert.equal(canCreateTrustedContactInvitation(adult).allowed, true);
assert.equal(canCreateTrustedContactInvitation(minor).allowed, false);
assert.equal(canCreateTrustedContactInvitation(minor).code, "minor_cannot_invite");
assert.equal(canCreateTrustedContactInvitation(responsibleWithoutMinor).allowed, false);
assert.equal(canCreateTrustedContactInvitation(responsibleWithMinor).allowed, true);

assert.equal(canAcceptAngelInvitation(null).allowed, false);
assert.equal(canAcceptAngelInvitation(minor).allowed, false);
assert.equal(canAcceptAngelInvitation(minor).code, "minor_cannot_act_as_angel");
assert.equal(canAcceptAngelInvitation(adult).allowed, true);
assert.equal(canAcceptAngelInvitation(responsibleWithMinor).allowed, true);

assert.equal(canReceiveFutureEmergencyDelivery({ authorizationStatus: "authorized", contactStatus: "accepted" }), true);
assert.equal(canReceiveFutureEmergencyDelivery({ authorizationStatus: "pending", contactStatus: "accepted" }), false);
assert.equal(canReceiveFutureEmergencyDelivery({ authorizationStatus: "authorized", contactStatus: "revoked" }), false);

assert.equal(getProfileSummary(null).tone, "warning");
assert.equal(getProfileSummary(minor).tone, "warning");
assert.equal(getProfileSummary(adult).tone, "secure");

console.log("Profile policy test aprovado.");
