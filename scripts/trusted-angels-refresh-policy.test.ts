import assert from "node:assert/strict";

import {
  buildTrustedAngelsLocalRefreshState,
  resolveTrustedAngelsNoSessionRefresh,
  resolveTrustedAngelsPanelParam,
  resolveTrustedAngelsRefreshFailure,
  resolveTrustedAngelsRefreshStart,
  resolveTrustedAngelsRemoteRefreshOutcome,
  shouldRefreshTrustedAngelsOnAppState,
  TRUSTED_ANGELS_REFRESH_INTERVAL_MS
} from "../src/features/invitations/trustedAngelsRefreshPolicy";
import type { ApiInvitation, ApiSession, ApiTrustedContact, ApiTrustedContactRelationship } from "../src/services/apiClient";

const apiSession: ApiSession = {
  access: "redacted-access",
  refresh: "redacted-refresh"
};

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

const relationship: ApiTrustedContactRelationship = {
  ...contact,
  owner_display_name: "Roberto",
  relationship_role: "owner"
};

const invitation: ApiInvitation = {
  id: "invite-1",
  trusted_contact: "contact-1",
  protected_subject: null,
  display_label: "Maria",
  status: "pending",
  expires_at: "2026-05-22T10:00:00.000Z",
  accepted_at: null,
  created_at: "2026-05-21T10:00:00.000Z"
};

assert.deepEqual(resolveTrustedAngelsRefreshStart({ inFlight: true, silent: false }), {
  clearBusy: true,
  setBusy: true,
  shouldRefresh: false,
  silent: false
});

assert.deepEqual(resolveTrustedAngelsRefreshStart({ inFlight: false, silent: true }), {
  clearBusy: false,
  setBusy: false,
  shouldRefresh: true,
  silent: true
});

assert.equal(TRUSTED_ANGELS_REFRESH_INTERVAL_MS, 15000);
assert.equal(shouldRefreshTrustedAngelsOnAppState("active"), true);
assert.equal(shouldRefreshTrustedAngelsOnAppState("background"), false);
assert.equal(shouldRefreshTrustedAngelsOnAppState("inactive"), false);

assert.deepEqual(
  buildTrustedAngelsLocalRefreshState({
    cachedRelationships: [relationship],
    currentSession: apiSession,
    registeredDeviceId: "device-1"
  }),
  {
    apiSession,
    deviceReady: true,
    trustedRelationships: [relationship]
  }
);

assert.deepEqual(resolveTrustedAngelsNoSessionRefresh({ silent: false }), {
  backendInvitations: [],
  status: "Entre com sua conta para sincronizar anjos.",
  trustedContacts: [],
  trustedRelationships: []
});

assert.equal(resolveTrustedAngelsNoSessionRefresh({ silent: true }).status, undefined);

const fulfilledOutcome = resolveTrustedAngelsRemoteRefreshOutcome({
  cachedRelationshipsCount: 0,
  contactsResult: { status: "fulfilled", value: [contact] },
  relationshipsResult: { status: "fulfilled", value: [relationship] },
  remoteInvitationsResult: { status: "fulfilled", value: [invitation] },
  silent: false
});

assert.deepEqual(fulfilledOutcome, {
  backendInvitations: [invitation],
  cacheRelationships: [relationship],
  status: "Anjos atualizados.",
  trustedContacts: [contact],
  trustedRelationships: [relationship]
});

const silentFailureWithCache = resolveTrustedAngelsRemoteRefreshOutcome({
  cachedRelationshipsCount: 1,
  contactsResult: { status: "rejected", reason: new Error("contacts offline") },
  relationshipsResult: { status: "rejected", reason: new Error("relationships offline") },
  remoteInvitationsResult: { status: "rejected", reason: new Error("invites offline") },
  silent: true
});

assert.deepEqual(silentFailureWithCache, {});

const visibleFailureWithCache = resolveTrustedAngelsRemoteRefreshOutcome({
  cachedRelationshipsCount: 1,
  contactsResult: { status: "rejected", reason: new Error("contacts offline") },
  relationshipsResult: { status: "rejected", reason: new Error("relationships offline") },
  remoteInvitationsResult: { status: "rejected", reason: new Error("invites offline") },
  silent: false
});

assert.deepEqual(visibleFailureWithCache, {
  status: "Sem internet agora. Mostrando vínculos salvos neste aparelho."
});

const visibleFailureWithoutCache = resolveTrustedAngelsRemoteRefreshOutcome({
  cachedRelationshipsCount: 0,
  contactsResult: { status: "rejected", reason: new Error("contacts offline") },
  relationshipsResult: { status: "rejected", reason: new Error("Falha de vinculos") },
  remoteInvitationsResult: { status: "rejected", reason: new Error("invites offline") },
  silent: false
});

assert.deepEqual(visibleFailureWithoutCache, {
  status: "Falha de vinculos"
});

assert.deepEqual(resolveTrustedAngelsRefreshFailure({ message: "Falha local", silent: false }), {
  status: "Falha local"
});
assert.deepEqual(resolveTrustedAngelsRefreshFailure({ message: "", silent: false }), {
  status: "Não foi possível atualizar anjos agora."
});
assert.deepEqual(resolveTrustedAngelsRefreshFailure({ message: "Falha local", silent: true }), {
  status: undefined
});

assert.equal(resolveTrustedAngelsPanelParam("anjos"), "anjos");
assert.equal(resolveTrustedAngelsPanelParam("sou_anjo"), "sou_anjo");
assert.equal(resolveTrustedAngelsPanelParam("convites"), "convites");
assert.equal(resolveTrustedAngelsPanelParam("estado"), null);
assert.equal(resolveTrustedAngelsPanelParam(undefined), null);

console.log("trusted angels refresh policy ok");
