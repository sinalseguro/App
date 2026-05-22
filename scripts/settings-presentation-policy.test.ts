import assert from "node:assert/strict";

import {
  buildSettingsDashboardTileAction,
  buildSettingsDashboardTileRows,
  buildSettingsLocationPanelState,
  buildSettingsPanelHelp,
  buildSettingsSecurityCodePanelState,
  formatSettingsCameraModeLabel,
  formatSettingsTrustedContactStatus,
  resolveSettingsPermissionStatus,
  settingsLegalConsentItems,
  settingsPanelTitles
} from "../src/features/settings/settingsPresentationPolicy";
import { defaultEmergencyPreferences } from "../src/features/emergency/emergencyPreferences";

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

assert.deepEqual(
  buildSettingsLocationPanelState({
    backgroundStatus: "permitido",
    foregroundStatus: "permitido",
    servicesEnabled: true
  }),
  {
    backgroundGate: {
      status: "permitido",
      text: "Mantem a localizacao do chamado enquanto a emergencia estiver ativa, quando essa permissao estiver disponivel.",
      title: "Segundo plano"
    },
    foregroundGate: {
      status: "permitido",
      text: "Pode ser pre-autorizada aqui para reduzir atrito no momento do chamado.",
      title: "Localizacao do chamado"
    }
  }
);

assert.deepEqual(
  buildSettingsLocationPanelState({
    backgroundStatus: "negado",
    foregroundStatus: "negado",
    servicesEnabled: false
  }),
  {
    backgroundGate: {
      status: "bloqueado",
      text: "Mantem a localizacao do chamado enquanto a emergencia estiver ativa, quando essa permissao estiver disponivel.",
      title: "Segundo plano"
    },
    foregroundGate: {
      status: "negado",
      text: "O GPS/localizacao do aparelho esta desativado no sistema.",
      title: "Localizacao do chamado"
    }
  }
);

assert.deepEqual(buildSettingsSecurityCodePanelState(true), {
  changeActionLabel: "Alterar codigo",
  disableActionLabel: "Desativar codigo",
  enableActionLabel: "Ativar codigo",
  isEnabled: true,
  statusLabel: "Codigo habilitado"
});
assert.deepEqual(buildSettingsSecurityCodePanelState(false), {
  changeActionLabel: "Alterar codigo",
  disableActionLabel: "Desativar codigo",
  enableActionLabel: "Ativar codigo",
  isEnabled: false,
  statusLabel: "Sem codigo"
});

assert.deepEqual(buildSettingsDashboardTileAction("video"), {
  kind: "panel",
  panel: "video"
});

assert.deepEqual(
  buildSettingsDashboardTileRows({
    accountConnected: true,
    foregroundStatus: "permitido",
    preferences: {
      ...defaultEmergencyPreferences,
      defaultDurationSeconds: 60,
      finishSafety: {
        codeHash: "hash",
        requireCode: true
      },
      legalConsent: {
        ...defaultEmergencyPreferences.legalConsent,
        termsAccepted: true
      },
      localVideoCapture: {
        ...defaultEmergencyPreferences.localVideoCapture,
        cameraMode: "both",
        requestOnSos: true
      }
    },
    updateAvailable: true
  }),
  [
    [
      {
        action: { kind: "panel", panel: "termos" },
        description: "Aceito",
        icon: "terms",
        key: "terms",
        label: "Termos"
      },
      {
        action: { kind: "panel", panel: "login" },
        description: "Conectado",
        icon: "login",
        key: "login",
        label: "Login"
      }
    ],
    [
      {
        action: { kind: "panel", panel: "localizacao" },
        description: "Permitido",
        icon: "permissions",
        key: "permissions",
        label: "Permissoes"
      },
      {
        action: { kind: "panel", panel: "duracao" },
        description: "1min",
        icon: "duration",
        key: "duration",
        label: "Gravacao"
      }
    ],
    [
      {
        action: { kind: "panel", panel: "encerramento" },
        description: "Ativo",
        icon: "security-code",
        key: "security-code",
        label: "Codigo de seguranca"
      },
      {
        action: { kind: "panel", panel: "video" },
        description: "Duas cameras",
        icon: "media",
        key: "media",
        label: "Midia"
      }
    ],
    [
      {
        action: { kind: "panel", panel: "compartilhamento" },
        description: "Dados",
        icon: "angels",
        key: "angels",
        label: "Anjos"
      },
      {
        action: { kind: "panel", panel: "atualizacao" },
        description: "Disponivel",
        icon: "update",
        key: "update",
        label: "Atualizacao"
      }
    ]
  ]
);

const fallbackRows = buildSettingsDashboardTileRows({
  accountConnected: false,
  foregroundStatus: "negado",
  preferences: null,
  updateAvailable: false
});
assert.equal(fallbackRows[0][0].description, "Revisar");
assert.equal(fallbackRows[0][1].description, "Conta");
assert.equal(fallbackRows[1][0].description, "negado");
assert.equal(fallbackRows[1][1].description, "Carregando");
assert.equal(fallbackRows[2][0].description, "Configurar");
assert.equal(fallbackRows[2][1].description, "Desativada");
assert.equal(fallbackRows[3][1].description, "Verificar");

console.log("settings presentation policy ok");
