import assert from "node:assert/strict";

import {
  buildSettingsPanelHelp,
  formatSettingsCameraModeLabel,
  formatSettingsTrustedContactStatus,
  resolveSettingsPermissionStatus,
  settingsLegalConsentItems,
  settingsPanelTitles
} from "../src/features/settings/settingsPresentationPolicy";

assert.equal(resolveSettingsPermissionStatus("granted"), "permitido");
assert.equal(resolveSettingsPermissionStatus("denied"), "negado");
assert.equal(resolveSettingsPermissionStatus("undetermined"), "pendente");
assert.equal(resolveSettingsPermissionStatus(null), "pendente");

assert.equal(formatSettingsCameraModeLabel("front"), "Frontal");
assert.equal(formatSettingsCameraModeLabel("back"), "Traseira");
assert.equal(formatSettingsCameraModeLabel("both"), "Duas cameras");

assert.equal(formatSettingsTrustedContactStatus("accepted"), "Autorizado");
assert.equal(formatSettingsTrustedContactStatus("ativo"), "Autorizado");
assert.equal(formatSettingsTrustedContactStatus("validado"), "Autorizado");
assert.equal(formatSettingsTrustedContactStatus("pending"), "Aguardando aceite");
assert.equal(formatSettingsTrustedContactStatus("pendente"), "Aguardando aceite");
assert.equal(formatSettingsTrustedContactStatus("revoked"), "Revogado");
assert.equal(formatSettingsTrustedContactStatus("revogado"), "Revogado");
assert.equal(formatSettingsTrustedContactStatus("unknown"), "Em revisao");

assert.equal(settingsPanelTitles.login, "Login");
assert.equal(settingsPanelTitles.video, "Video local");
assert.equal(settingsLegalConsentItems.length, 3);
assert.deepEqual(buildSettingsPanelHelp("duracao"), {
  title: "Ajuda: Tempo de gravacao",
  message: "Este tempo controla apenas a gravacao local. O chamado de emergencia continua ativo ate a usuaria encerrar pelo botao SOS."
});
assert.deepEqual(buildSettingsPanelHelp("compartilhamento"), {
  title: "Ajuda: Compartilhamento",
  message:
    "Os anjos recebem dados somente quando houver convite aceito, autorizacao da usuaria e contrato de privacidade. A opcao de ligar 190 junto com o SOS vem desativada por padrao."
});

console.log("settings presentation policy ok");
