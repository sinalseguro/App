import assert from "node:assert/strict";

import {
  buildTrustedAngelsAcceptedCounts,
  buildTrustedAngelsDashboardSummary,
  buildTrustedAngelsReadinessState
} from "../src/features/invitations/trustedAngelsDashboardPolicy";
import type { ApiTrustedContactRelationship } from "../src/services/apiClient";

const acceptedOwner: ApiTrustedContactRelationship = {
  id: "owner-1",
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

const pendingOwner: ApiTrustedContactRelationship = {
  ...acceptedOwner,
  id: "owner-2",
  status: "pending"
};

const acceptedAngel: ApiTrustedContactRelationship = {
  ...acceptedOwner,
  id: "angel-1",
  relationship_role: "angel"
};

assert.deepEqual(
  buildTrustedAngelsAcceptedCounts({
    angelLinks: [acceptedAngel, { ...acceptedAngel, id: "angel-2", status: "revoked" }],
    ownerLinks: [acceptedOwner, pendingOwner]
  }),
  {
    acceptedAngelCount: 1,
    acceptedOwnerCount: 1
  }
);

assert.deepEqual(
  buildTrustedAngelsDashboardSummary({
    acceptedAngelCount: 0,
    acceptedOwnerCount: 0,
    apiSessionAvailable: false,
    busy: false,
    deviceReady: false,
    invitationCount: 0,
    invitationGateAllowed: false,
    noticeTitle: "Nenhum anjo ativo ainda",
    profileTitle: "Perfil pendente"
  }),
  {
    acceptedAngelDescription: "Nenhum",
    acceptedOwnerDescription: "Nenhum",
    createInvitationDescription: "Bloqueado",
    invitationsDescription: "Nenhum",
    profileDescription: "Perfil pendente",
    readinessDescription: "Pendente",
    stateDescription: "Nenhum anjo ativo ainda",
    syncDescription: "Sincronizar"
  }
);

assert.deepEqual(
  buildTrustedAngelsDashboardSummary({
    acceptedAngelCount: 2,
    acceptedOwnerCount: 1,
    apiSessionAvailable: true,
    busy: true,
    deviceReady: true,
    invitationCount: 3,
    invitationGateAllowed: true,
    noticeTitle: "Meus anjos",
    profileTitle: "Pessoa adulta"
  }),
  {
    acceptedAngelDescription: "2 pessoas",
    acceptedOwnerDescription: "1 aceitou",
    createInvitationDescription: "API",
    invitationsDescription: "3 item",
    profileDescription: "Pessoa adulta",
    readinessDescription: "Dispositivo",
    stateDescription: "Meus anjos",
    syncDescription: "Sincronizando"
  }
);

assert.equal(
  buildTrustedAngelsDashboardSummary({
    acceptedAngelCount: 1,
    acceptedOwnerCount: 2,
    apiSessionAvailable: false,
    busy: false,
    deviceReady: true,
    invitationCount: 1,
    invitationGateAllowed: true,
    noticeTitle: "Aguardando aceite",
    profileTitle: "Responsável"
  }).createInvitationDescription,
  "Local"
);

assert.deepEqual(
  buildTrustedAngelsReadinessState({
    apiEnabled: true,
    apiSessionAvailable: true,
    deviceReady: true
  }),
  {
    account: {
      label: "Conta conectada",
      secure: true
    },
    api: {
      enabled: true,
      label: "API configurada"
    },
    device: {
      label: "Dispositivo registrado",
      secure: true
    }
  }
);

assert.deepEqual(
  buildTrustedAngelsReadinessState({
    apiEnabled: false,
    apiSessionAvailable: false,
    deviceReady: false
  }),
  {
    account: {
      label: "Conta local",
      secure: false
    },
    api: {
      enabled: false,
      label: "API desativada"
    },
    device: {
      label: "Dispositivo pendente",
      secure: false
    }
  }
);

console.log("trusted angels dashboard policy ok");
