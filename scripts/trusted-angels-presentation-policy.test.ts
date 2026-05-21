import assert from "node:assert/strict";

import {
  acceptedAngelSummary,
  acceptedOwnerSummary,
  buildNotice,
  contactStatus,
  formatShortDate,
  invitationDescription,
  invitationDetail,
  invitationFromApi,
  relationshipNamesSummary,
  trustedContactFallbackRelationship,
  trustedRelationshipDescription,
  trustedRelationshipDetail,
  trustedRelationshipName
} from "../src/features/invitations/trustedAngelsPresentationPolicy";
import type { LocalInvitation } from "../src/features/invitations/types";
import type { ApiInvitation, ApiSession, ApiTrustedContact, ApiTrustedContactRelationship } from "../src/services/apiClient";

const localInvitation: LocalInvitation = {
  id: "local-1",
  backendInvitationId: "remote-1",
  trustedContactId: "contact-1",
  token: "redacted-test-token",
  displayLabel: "Maria",
  inviteUrl: "",
  deepLinkUrl: "",
  createdAt: "2026-05-16T12:00:00.000Z",
  expiresAt: "2026-05-18T12:00:00.000Z",
  singleUsePolicy: "backend_single_use_enforced",
  status: "compartilhado",
  syncStatus: "backend_validated"
};

const legacyInvitation: LocalInvitation = {
  ...localInvitation,
  id: "legacy-1",
  syncStatus: "local_pre_invite"
};

const remoteInvitation: ApiInvitation = {
  id: "remote-2",
  trusted_contact: "contact-2",
  protected_subject: null,
  display_label: "Joao",
  status: "pending",
  expires_at: "2999-05-18T12:00:00.000Z",
  accepted_at: null,
  created_at: "2026-05-16T12:00:00.000Z"
};

const acceptedContact: ApiTrustedContact = {
  id: "contact-1",
  protected_subject: null,
  contact_display_name: "Maria",
  display_label: "Maria",
  status: "accepted",
  can_receive_alerts: true,
  can_receive_media: true,
  can_receive_location: true,
  accepted_at: "2026-05-16T12:00:00.000Z",
  revoked_at: null,
  created_at: "2026-05-16T12:00:00.000Z",
  updated_at: "2026-05-16T12:00:00.000Z"
};

const ownerRelationship: ApiTrustedContactRelationship = {
  ...acceptedContact,
  owner_display_name: "",
  relationship_role: "owner"
};

const angelRelationship: ApiTrustedContactRelationship = {
  ...acceptedContact,
  id: "contact-2",
  contact_display_name: "",
  display_label: "Roberto",
  owner_display_name: "Roberto",
  relationship_role: "angel"
};

const apiSession: ApiSession = {
  access: "redacted-access",
  refresh: "redacted-refresh"
};

assert.equal(formatShortDate("2026-05-16T12:00:00.000Z"), "16/05");
assert.equal(invitationDescription(legacyInvitation), "Convite antigo sem validacao no servidor. Gere um novo convite seguro.");
assert.equal(
  invitationDescription(localInvitation),
  "Convite compartilhado. O vínculo só nasce após aceite com conta própria."
);
assert.equal(invitationDetail(localInvitation), "Servidor validado · expira em 18/05");
assert.equal(invitationFromApi(remoteInvitation).status, "pendente");
assert.equal(invitationFromApi({ ...remoteInvitation, status: "accepted" }).status, "aceito");
assert.equal(invitationFromApi({ ...remoteInvitation, expires_at: "2000-01-01T12:00:00.000Z" }).status, "expirado");

assert.equal(contactStatus(acceptedContact), "aceito");
assert.equal(contactStatus({ ...acceptedContact, status: "revoked" }), "revogado");
assert.equal(contactStatus({ ...acceptedContact, status: "pending" }), "pendente");

assert.equal(trustedRelationshipName(ownerRelationship), "Maria");
assert.equal(trustedRelationshipName(angelRelationship), "Roberto");
assert.equal(trustedRelationshipName({ ...angelRelationship, owner_display_name: "" }), "Pessoa protegida");
assert.equal(trustedRelationshipDetail(ownerRelationship), "Meu anjo · Aceito em 16/05");
assert.equal(trustedRelationshipDetail({ ...angelRelationship, accepted_at: null }), "Sou anjo · Conta própria exigida");
assert.equal(
  trustedRelationshipDescription(ownerRelationship),
  "Maria aceitou ser seu anjo de confiança. Nada é enviado fora de um alerta autorizado."
);
assert.equal(
  trustedRelationshipDescription({ ...angelRelationship, status: "revoked" }),
  "Vínculo com Roberto revogado."
);

assert.equal(acceptedOwnerSummary(0), "Nenhum");
assert.equal(acceptedOwnerSummary(1), "1 aceitou");
assert.equal(acceptedOwnerSummary(2), "2 aceitaram");
assert.equal(acceptedAngelSummary(1), "1 pessoa");
assert.equal(
  relationshipNamesSummary(
    [
      ownerRelationship,
      {
        ...ownerRelationship,
        contact_display_name: "Ana",
        display_label: "Ana",
        id: "contact-3"
      }
    ],
    "fallback"
  ),
  "Maria e Ana"
);

assert.deepEqual(
  trustedContactFallbackRelationship({ ...acceptedContact, contact_display_name: undefined, display_label: "Label seguro" }),
  {
    ...acceptedContact,
    contact_display_name: "Label seguro",
    display_label: "Label seguro",
    owner_display_name: "",
    relationship_role: "owner"
  }
);

assert.deepEqual(buildNotice({ apiSession, angelLinks: [], busy: true, invitations: [], ownerLinks: [] }), {
  text: "Atualizando vínculos e convites.",
  title: "Sincronizando",
  tone: "secure"
});

assert.deepEqual(buildNotice({ apiSession, angelLinks: [], busy: false, invitations: [localInvitation], ownerLinks: [] }), {
  text: "Convite compartilhado. O vínculo só nasce quando a pessoa aceita com a própria conta.",
  title: "Aguardando aceite",
  tone: "warning"
});

assert.deepEqual(buildNotice({ apiSession, angelLinks: [], busy: false, invitations: [], ownerLinks: [] }), {
  text: "Convide uma pessoa de confiança. O convite é o único dado compartilhado nesta etapa.",
  title: "Nenhum anjo ativo ainda",
  tone: "secure"
});

assert.deepEqual(buildNotice({ apiSession: null, angelLinks: [], busy: false, invitations: [], ownerLinks: [] }), {
  text: "Entre em Configurações > Login para criar convite validado pela API. Sem login, o convite fica local.",
  title: "Nenhum anjo ativo ainda",
  tone: "warning"
});

const acceptedNotice = buildNotice({
  apiSession,
  angelLinks: [angelRelationship],
  busy: false,
  invitations: [],
  ownerLinks: [ownerRelationship]
});
assert.equal(acceptedNotice.title, "Meus anjos");
assert.match(acceptedNotice.text, /Maria aceitou ser seu anjo/);
assert.match(acceptedNotice.text, /você é anjo de Roberto/);
assert.equal(acceptedNotice.tone, "secure");

console.log("trusted angels presentation policy ok");
