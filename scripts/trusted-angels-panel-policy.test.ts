import assert from "node:assert/strict";

import {
  buildTrustedAngelsAngelPanelState,
  buildTrustedAngelsInvitationPanelState,
  buildTrustedAngelsOwnerPanelState
} from "../src/features/invitations/trustedAngelsPanelPolicy";
import type { LocalInvitation } from "../src/features/invitations/types";
import type { ApiTrustedContactRelationship } from "../src/services/apiClient";

const relationship: ApiTrustedContactRelationship = {
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
  updated_at: "2026-05-21T10:00:00.000Z",
  owner_display_name: "Roberto",
  relationship_role: "owner"
};

const backendInvitation: LocalInvitation = {
  id: "backend-invite-1",
  backendInvitationId: "backend-invite-1",
  token: "",
  displayLabel: "Maria",
  inviteUrl: "",
  deepLinkUrl: "",
  createdAt: "2026-05-21T10:00:00.000Z",
  expiresAt: "2026-05-22T10:00:00.000Z",
  singleUsePolicy: "backend_single_use_enforced",
  status: "pendente",
  syncStatus: "backend_validated"
};

const localInvitation: LocalInvitation = {
  ...backendInvitation,
  backendInvitationId: undefined,
  id: "local-invite-1",
  singleUsePolicy: "backend_validation_required",
  syncStatus: "local_pre_invite"
};

assert.deepEqual(buildTrustedAngelsOwnerPanelState([relationship]), {
  emptyState: {
    icon: "users",
    text: "O vínculo só nasce após aceite com conta própria.",
    title: "Nenhum anjo ativo ainda"
  },
  items: [relationship]
});

assert.deepEqual(buildTrustedAngelsAngelPanelState([]), {
  emptyState: {
    icon: "userCheck",
    text: "Quando aceitar um convite, o nome de quem convidou aparecerá aqui.",
    title: "Você ainda não é anjo"
  },
  items: []
});

assert.deepEqual(
  buildTrustedAngelsInvitationPanelState({
    backendValidatedInvitations: [backendInvitation],
    invitationCount: 2,
    localPreInvitations: [localInvitation]
  }),
  {
    emptyState: undefined,
    sections: [
      {
        invitations: [backendInvitation],
        key: "backend_validated",
        title: "Convites validados",
        tone: "primary"
      },
      {
        invitations: [localInvitation],
        key: "local_pre_invite",
        title: "Convites antigos sem servidor",
        tone: "warning"
      }
    ]
  }
);

assert.deepEqual(
  buildTrustedAngelsInvitationPanelState({
    backendValidatedInvitations: [],
    invitationCount: 0,
    localPreInvitations: []
  }),
  {
    emptyState: {
      icon: "users",
      text: "Crie um convite quando quiser preparar um anjo.",
      title: "Nenhum convite criado"
    },
    sections: []
  }
);

console.log("trusted angels panel policy ok");
