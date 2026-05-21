import type { LocalInvitation } from "@/features/invitations/types";
import type { ApiInvitation, ApiTrustedContact, ApiTrustedContactRelationship } from "@/services/apiClient";
import { invitationFromApi, trustedContactFallbackRelationship } from "@/features/invitations/trustedAngelsPresentationPolicy";

const FINAL_CONTACT_STATUSES = new Set(["accepted", "revoked"]);

function isAcceptedOrRevoked(status: string) {
  return FINAL_CONTACT_STATUSES.has(status);
}

export function mergeTrustedAngelInvitations({
  backendInvitations,
  localInvitations,
  nowMs = Date.now(),
  trustedContacts,
  trustedRelationships
}: {
  backendInvitations: ApiInvitation[];
  localInvitations: LocalInvitation[];
  nowMs?: number;
  trustedContacts: ApiTrustedContact[];
  trustedRelationships: ApiTrustedContactRelationship[];
}) {
  const localByBackendId = new Set(localInvitations.map((invitation) => invitation.backendInvitationId).filter(Boolean));
  const acceptedOrRevokedContactIds = new Set(
    [
      ...trustedContacts.filter((contact) => isAcceptedOrRevoked(contact.status)).map((contact) => contact.id),
      ...trustedRelationships
        .filter(
          (relationship) => relationship.relationship_role === "owner" && isAcceptedOrRevoked(relationship.status)
        )
        .map((relationship) => relationship.id)
    ]
  );
  const visibleLocalInvitations = localInvitations.filter(
    (invitation) => !invitation.trustedContactId || !acceptedOrRevokedContactIds.has(invitation.trustedContactId)
  );
  const remoteOnly = backendInvitations
    .filter(
      (invitation) =>
        !localByBackendId.has(invitation.id) && !acceptedOrRevokedContactIds.has(invitation.trusted_contact)
    )
    .map((invitation) => invitationFromApi(invitation, nowMs));

  return [...visibleLocalInvitations, ...remoteOnly].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

export function buildTrustedAngelRelationshipLists({
  trustedContacts,
  trustedRelationships
}: {
  trustedContacts: ApiTrustedContact[];
  trustedRelationships: ApiTrustedContactRelationship[];
}) {
  const ownerRelationships = trustedRelationships.filter(
    (relationship) => relationship.relationship_role === "owner" && isAcceptedOrRevoked(relationship.status)
  );
  const relationshipIds = new Set(ownerRelationships.map((relationship) => relationship.id));
  const contactFallbacks = trustedContacts
    .filter((contact) => isAcceptedOrRevoked(contact.status) && !relationshipIds.has(contact.id))
    .map(trustedContactFallbackRelationship);
  const angelLinks = trustedRelationships.filter(
    (relationship) => relationship.relationship_role === "angel" && isAcceptedOrRevoked(relationship.status)
  );

  return {
    angelLinks,
    linkedContacts: [...ownerRelationships, ...contactFallbacks]
  };
}

export function splitTrustedAngelInvitationSections(invitations: LocalInvitation[]) {
  const backendValidatedInvitations = invitations.filter((invitation) => invitation.syncStatus === "backend_validated");
  const localPreInvitations = invitations.filter((invitation) => invitation.syncStatus !== "backend_validated");

  return {
    backendValidatedInvitations,
    invitationCount: backendValidatedInvitations.length + localPreInvitations.length,
    localPreInvitations
  };
}
