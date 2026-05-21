import assert from "node:assert/strict";

import {
  buildTrustedAngelsDashboardSummary,
  buildTrustedAngelsReadinessState
} from "../src/features/invitations/trustedAngelsDashboardPolicy";

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
