import assert from "node:assert/strict";

import {
  buildTrustedAngelInvitationCardKey,
  buildTrustedAngelsDialogActionLabels,
  buildTrustedAngelsDialogVisibility,
  canShowTrustedAngelInvitationRevocationAction
} from "../src/features/invitations/trustedAngelsDialogPolicy";
import type { InvitationStatus } from "../src/features/invitations/types";

assert.deepEqual(
  buildTrustedAngelsDialogVisibility({
    dialogKind: "invite",
    panel: "estado"
  }),
  {
    angelLinksPanel: false,
    invitationsPanel: false,
    inviteDialog: true,
    ownerLinksPanel: false,
    profileBlockDialog: false,
    readinessPanel: false,
    revokeContactDialog: false,
    revokeInvitationDialog: false,
    statePanel: true
  }
);

assert.deepEqual(
  buildTrustedAngelsDialogVisibility({
    dialogKind: "revoke_contact",
    panel: "sou_anjo"
  }),
  {
    angelLinksPanel: true,
    invitationsPanel: false,
    inviteDialog: false,
    ownerLinksPanel: false,
    profileBlockDialog: false,
    readinessPanel: false,
    revokeContactDialog: true,
    revokeInvitationDialog: false,
    statePanel: false
  }
);

assert.deepEqual(
  buildTrustedAngelsDialogVisibility({
    dialogKind: null,
    panel: null
  }),
  {
    angelLinksPanel: false,
    invitationsPanel: false,
    inviteDialog: false,
    ownerLinksPanel: false,
    profileBlockDialog: false,
    readinessPanel: false,
    revokeContactDialog: false,
    revokeInvitationDialog: false,
    statePanel: false
  }
);

const actionableStatuses: InvitationStatus[] = ["pendente", "compartilhado"];
const lockedStatuses: InvitationStatus[] = ["aceito", "revogado", "expirado"];

for (const status of actionableStatuses) {
  assert.equal(canShowTrustedAngelInvitationRevocationAction(status), true, status);
}

for (const status of lockedStatuses) {
  assert.equal(canShowTrustedAngelInvitationRevocationAction(status), false, status);
}

assert.equal(
  buildTrustedAngelInvitationCardKey({
    id: "invite-1",
    syncStatus: "backend_validated"
  }),
  "backend_validated-invite-1"
);

assert.deepEqual(buildTrustedAngelsDialogActionLabels({ busy: false }), {
  revokeContactLabel: "Revogar vínculo",
  revokeInvitationLabel: "Revogar convite",
  shareInviteLabel: "Compartilhar convite"
});

assert.deepEqual(buildTrustedAngelsDialogActionLabels({ busy: true }), {
  revokeContactLabel: "Revogando...",
  revokeInvitationLabel: "Revogando...",
  shareInviteLabel: "Criando..."
});

console.log("trusted angels dialog policy ok");
