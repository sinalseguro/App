import assert from "node:assert/strict";

import {
  buildTrustedAngelContactRevocationPlan,
  buildTrustedAngelInvitationRevocationPlan,
  resolveTrustedAngelActionFailure,
  resolveTrustedAngelShareFailure,
  resolveTrustedAngelShareStart,
  trustedAngelActionMessages
} from "../src/features/invitations/trustedAngelsActionPolicy";
import type { LocalInvitation } from "../src/features/invitations/types";
import { buildProtectionProfile, canCreateTrustedContactInvitation } from "../src/features/profiles/profilePolicy";
import type { ApiTrustedContact } from "../src/services/apiClient";

const allowedGate = canCreateTrustedContactInvitation(buildProtectionProfile("adult_self_managed"));
const blockedGate = canCreateTrustedContactInvitation(null);

assert.deepEqual(resolveTrustedAngelShareStart({ gate: blockedGate, inviteLabel: "Mae" }), {
  dialog: "profile_block",
  kind: "blocked",
  status: blockedGate.message
});

assert.deepEqual(resolveTrustedAngelShareStart({ gate: allowedGate, inviteLabel: "  Minha mãe  " }), {
  kind: "allowed",
  label: "Minha mãe",
  status: trustedAngelActionMessages.createStart
});

assert.deepEqual(resolveTrustedAngelShareStart({ gate: allowedGate, inviteLabel: "   " }), {
  kind: "allowed",
  label: "Anjo de confiança",
  status: trustedAngelActionMessages.createStart
});

assert.deepEqual(resolveTrustedAngelShareFailure({ isUnauthorized: true, message: "401" }), {
  clearSession: true,
  closeDialog: true,
  status: trustedAngelActionMessages.sessionExpired
});

assert.deepEqual(resolveTrustedAngelShareFailure({ isUnauthorized: false, message: "Entre com Google novamente." }), {
  clearSession: false,
  closeDialog: true,
  status: "Entre com Google novamente."
});

assert.deepEqual(resolveTrustedAngelShareFailure({ isUnauthorized: false, message: "" }), {
  clearSession: false,
  closeDialog: false,
  status: trustedAngelActionMessages.createUnknownFailure
});

const invitation: LocalInvitation = {
  id: "local-1",
  backendInvitationId: "backend-1",
  trustedContactId: "contact-1",
  token: "redacted",
  displayLabel: "Maria",
  inviteUrl: "",
  deepLinkUrl: "",
  createdAt: "2026-05-21T10:00:00.000Z",
  expiresAt: "2026-05-22T10:00:00.000Z",
  singleUsePolicy: "backend_single_use_enforced",
  status: "pendente",
  syncStatus: "backend_validated"
};

assert.deepEqual(
  buildTrustedAngelInvitationRevocationPlan({
    apiSessionAvailable: true,
    invitation,
    localInvitationIds: ["local-1", "local-2"]
  }),
  {
    backendInvitationId: "backend-1",
    localInvitationId: "local-1",
    shouldRevokeBackend: true,
    shouldRevokeLocal: true,
    startStatus: trustedAngelActionMessages.invitationRevokeStart,
    successStatus: trustedAngelActionMessages.invitationRevokeSuccess
  }
);

assert.deepEqual(
  buildTrustedAngelInvitationRevocationPlan({
    apiSessionAvailable: false,
    invitation: { ...invitation, backendInvitationId: undefined },
    localInvitationIds: []
  }),
  {
    backendInvitationId: undefined,
    localInvitationId: "local-1",
    shouldRevokeBackend: false,
    shouldRevokeLocal: false,
    startStatus: trustedAngelActionMessages.invitationRevokeStart,
    successStatus: trustedAngelActionMessages.invitationRevokeSuccess
  }
);

const contact: ApiTrustedContact = {
  id: "contact-1",
  protected_subject: null,
  contact_display_name: "Maria",
  display_label: "Maria",
  status: "accepted",
  can_receive_alerts: true,
  can_receive_media: false,
  can_receive_location: false,
  accepted_at: "2026-05-21T10:00:00.000Z",
  revoked_at: null,
  created_at: "2026-05-21T10:00:00.000Z",
  updated_at: "2026-05-21T10:00:00.000Z"
};

assert.deepEqual(buildTrustedAngelContactRevocationPlan(contact), {
  cacheRelationshipId: "contact-1",
  trustedContactId: "contact-1",
  startStatus: trustedAngelActionMessages.trustedContactRevokeStart,
  successStatus: trustedAngelActionMessages.trustedContactRevokeSuccess
});

assert.equal(resolveTrustedAngelActionFailure("Falha remota", "fallback"), "Falha remota");
assert.equal(resolveTrustedAngelActionFailure("", "fallback"), "fallback");

console.log("trusted angels action policy ok");
