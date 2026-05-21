import assert from "node:assert/strict";

import {
  buildTrustedAngelRelationshipLists,
  mergeTrustedAngelInvitations,
  splitTrustedAngelInvitationSections
} from "../src/features/invitations/trustedAngelsListPolicy";
import type { LocalInvitation } from "../src/features/invitations/types";
import type { ApiInvitation, ApiTrustedContact, ApiTrustedContactRelationship } from "../src/services/apiClient";

function localInvitation(overrides: Partial<LocalInvitation> = {}): LocalInvitation {
  return {
    id: "local-1",
    backendInvitationId: "remote-1",
    trustedContactId: "contact-local",
    token: "redacted",
    displayLabel: "Convite local",
    inviteUrl: "",
    deepLinkUrl: "",
    createdAt: "2026-05-17T12:00:00.000Z",
    expiresAt: "2026-05-20T12:00:00.000Z",
    singleUsePolicy: "backend_single_use_enforced",
    status: "pendente",
    syncStatus: "backend_validated",
    ...overrides
  };
}

function apiInvitation(overrides: Partial<ApiInvitation> = {}): ApiInvitation {
  return {
    id: "remote-2",
    trusted_contact: "contact-remote",
    protected_subject: null,
    display_label: "Convite remoto",
    status: "pending",
    expires_at: "2026-05-30T12:00:00.000Z",
    accepted_at: null,
    created_at: "2026-05-18T12:00:00.000Z",
    ...overrides
  };
}

function trustedContact(overrides: Partial<ApiTrustedContact> = {}): ApiTrustedContact {
  return {
    id: "contact-1",
    protected_subject: null,
    contact_display_name: "Maria",
    display_label: "Maria",
    status: "accepted",
    can_receive_alerts: true,
    can_receive_media: false,
    can_receive_location: false,
    accepted_at: "2026-05-18T12:00:00.000Z",
    revoked_at: null,
    created_at: "2026-05-18T12:00:00.000Z",
    updated_at: "2026-05-18T12:00:00.000Z",
    ...overrides
  };
}

function relationship(overrides: Partial<ApiTrustedContactRelationship> = {}): ApiTrustedContactRelationship {
  return {
    ...trustedContact(),
    contact_display_name: "Maria",
    owner_display_name: "Roberto",
    relationship_role: "owner",
    ...overrides
  };
}

const hiddenAcceptedContact = trustedContact({ id: "contact-hidden", status: "accepted" });
const hiddenRevokedRelationship = relationship({ id: "contact-revoked", relationship_role: "owner", status: "revoked" });
const mergedInvitations = mergeTrustedAngelInvitations({
  backendInvitations: [
    apiInvitation({ id: "remote-1", trusted_contact: "contact-duplicate", display_label: "Duplicado" }),
    apiInvitation({ id: "remote-2", trusted_contact: "contact-remote", display_label: "Remoto novo" }),
    apiInvitation({ id: "remote-hidden", trusted_contact: "contact-hidden", display_label: "Oculto contato aceito" }),
    apiInvitation({ id: "remote-revoked", trusted_contact: "contact-revoked", display_label: "Oculto revogado" }),
    apiInvitation({
      id: "remote-expired",
      trusted_contact: "contact-expired",
      display_label: "Expirado",
      expires_at: "2026-05-10T12:00:00.000Z"
    })
  ],
  localInvitations: [
    localInvitation({ backendInvitationId: "remote-1", id: "local-duplicate", trustedContactId: "contact-duplicate" }),
    localInvitation({ id: "local-hidden", trustedContactId: "contact-hidden" }),
    localInvitation({
      backendInvitationId: undefined,
      createdAt: "2026-05-19T12:00:00.000Z",
      displayLabel: "Local visivel",
      id: "local-visible",
      syncStatus: "local_pre_invite",
      trustedContactId: undefined
    })
  ],
  nowMs: new Date("2026-05-21T12:00:00.000Z").getTime(),
  trustedContacts: [hiddenAcceptedContact],
  trustedRelationships: [hiddenRevokedRelationship]
});

assert.deepEqual(
  mergedInvitations.map((invitation) => invitation.displayLabel),
  ["Local visivel", "Remoto novo", "Expirado", "Convite local"]
);
assert.equal(mergedInvitations.find((invitation) => invitation.displayLabel === "Expirado")?.status, "expirado");
assert.equal(mergedInvitations.some((invitation) => invitation.displayLabel === "Duplicado"), false);
assert.equal(mergedInvitations.some((invitation) => invitation.displayLabel === "Oculto contato aceito"), false);
assert.equal(mergedInvitations.some((invitation) => invitation.displayLabel === "Oculto revogado"), false);

const relationshipLists = buildTrustedAngelRelationshipLists({
  trustedContacts: [
    trustedContact({ id: "owner-1", contact_display_name: "Duplicado", display_label: "Duplicado" }),
    trustedContact({ id: "fallback-1", contact_display_name: "", display_label: "Contato fallback" }),
    trustedContact({ id: "pending-1", status: "pending" })
  ],
  trustedRelationships: [
    relationship({ id: "owner-1", contact_display_name: "Dono principal", relationship_role: "owner", status: "accepted" }),
    relationship({ id: "owner-revoked", contact_display_name: "Dono revogado", relationship_role: "owner", status: "revoked" }),
    relationship({ id: "angel-1", owner_display_name: "Pessoa protegida", relationship_role: "angel", status: "accepted" }),
    relationship({ id: "angel-pending", relationship_role: "angel", status: "pending" })
  ]
});

assert.deepEqual(
  relationshipLists.linkedContacts.map((contact) => contact.id),
  ["owner-1", "owner-revoked", "fallback-1"]
);
assert.deepEqual(
  relationshipLists.angelLinks.map((contact) => contact.id),
  ["angel-1"]
);
assert.equal(relationshipLists.linkedContacts.find((contact) => contact.id === "fallback-1")?.relationship_role, "owner");

const sections = splitTrustedAngelInvitationSections(mergedInvitations);
assert.equal(sections.backendValidatedInvitations.length, 3);
assert.equal(sections.localPreInvitations.length, 1);
assert.equal(sections.invitationCount, 4);

console.log("trusted angels list policy ok");
