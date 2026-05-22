import assert from "node:assert/strict";

import {
  buildInvitationAcceptanceInitialStatus,
  buildInvitationAcceptancePresentation,
  invitationAcceptanceMessages,
  invitationAcceptanceScreenCopy
} from "../src/features/invitations/invitationAcceptancePresentationPolicy";
import { buildProtectionProfile, canAcceptAngelInvitation } from "../src/features/profiles/profilePolicy";

const allowedGate = canAcceptAngelInvitation(buildProtectionProfile("adult_self_managed"));
const blockedGate = canAcceptAngelInvitation(null);

assert.equal(buildInvitationAcceptanceInitialStatus(false), invitationAcceptanceMessages.invalidLink);
assert.equal(buildInvitationAcceptanceInitialStatus(true), invitationAcceptanceMessages.routeIdentified);
assert.equal(invitationAcceptanceScreenCopy.title, "Convite recebido");
assert.equal(invitationAcceptanceScreenCopy.subtitle, "Entre com sua própria conta para aceitar um convite de anjo.");
assert.equal(invitationAcceptanceScreenCopy.securityNotice.title, "Limite de seguranca");
assert.match(invitationAcceptanceScreenCopy.securityNotice.text, /não permite entrar como outra pessoa/i);

const withoutInvite = buildInvitationAcceptancePresentation({
  acceptGate: allowedGate,
  acceptedOwnerName: "",
  busy: false,
  checkingInvitation: false,
  hasInvitationCode: false,
  invitationReady: false
});

assert.equal(withoutInvite.bannerTitle, "Convite ausente");
assert.equal(withoutInvite.canAcceptInvitation, false);
assert.equal(withoutInvite.acceptButtonDisabled, true);
assert.equal(withoutInvite.acceptButtonLabel, "Aceitar como anjo");
assert.equal(withoutInvite.showProfileAction, false);

const checkingInvite = buildInvitationAcceptancePresentation({
  acceptGate: allowedGate,
  acceptedOwnerName: "",
  busy: false,
  checkingInvitation: true,
  hasInvitationCode: true,
  invitationReady: false
});

assert.equal(checkingInvite.bannerTitle, "Verificando convite");
assert.equal(checkingInvite.acceptButtonLabel, "Verificando convite...");
assert.equal(checkingInvite.acceptButtonDisabled, true);
assert.equal(checkingInvite.acceptStatus.title, "Aceite bloqueado");

const validInvite = buildInvitationAcceptancePresentation({
  acceptGate: allowedGate,
  acceptedOwnerName: "",
  busy: false,
  checkingInvitation: false,
  hasInvitationCode: true,
  invitationReady: true
});

assert.equal(validInvite.bannerTitle, "Convite valido");
assert.equal(validInvite.canAcceptInvitation, true);
assert.equal(validInvite.acceptButtonDisabled, false);
assert.equal(validInvite.acceptButtonLabel, "Aceitar como anjo");
assert.equal(validInvite.acceptStatus.title, allowedGate.title);

const blockedByProfile = buildInvitationAcceptancePresentation({
  acceptGate: blockedGate,
  acceptedOwnerName: "",
  busy: false,
  checkingInvitation: false,
  hasInvitationCode: true,
  invitationReady: true
});

assert.equal(blockedByProfile.canAcceptInvitation, false);
assert.equal(blockedByProfile.acceptButtonDisabled, true);
assert.equal(blockedByProfile.showProfileAction, true);
assert.equal(blockedByProfile.acceptStatus.title, blockedGate.title);
assert.equal(blockedByProfile.acceptStatus.message, blockedGate.message);

const busyInvite = buildInvitationAcceptancePresentation({
  acceptGate: allowedGate,
  acceptedOwnerName: "",
  busy: true,
  checkingInvitation: false,
  hasInvitationCode: true,
  invitationReady: true
});

assert.equal(busyInvite.canAcceptInvitation, true);
assert.equal(busyInvite.acceptButtonDisabled, true);
assert.equal(busyInvite.acceptButtonLabel, "Validando convite...");

const acceptedInvite = buildInvitationAcceptancePresentation({
  acceptGate: allowedGate,
  acceptedOwnerName: "Roberto",
  busy: false,
  checkingInvitation: false,
  hasInvitationCode: true,
  invitationReady: false
});

assert.equal(acceptedInvite.canAcceptInvitation, false);
assert.equal(acceptedInvite.acceptButtonLabel, "Convite aceito");
assert.equal(acceptedInvite.showAcceptedLinksAction, true);
assert.equal(acceptedInvite.acceptedOwnerNotice?.title, "Você é anjo");
assert.match(acceptedInvite.acceptedOwnerNotice?.text ?? "", /Roberto/);

assert.equal(invitationAcceptanceMessages.accepted("Roberto"), "Aceite confirmado no servidor. Você agora é anjo de Roberto.");

console.log("invitation acceptance presentation policy ok");
