import assert from "node:assert/strict";

import {
  buildSettingsDashboardTileAction,
  buildSettingsDashboardTileRows,
  buildSettingsLocationPanelState,
  buildSettingsPanelHelp,
  buildSettingsSecurityCodePanelState,
  buildSettingsSharingPanelState,
  buildSettingsVideoPanelState,
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

assert.deepEqual(
  buildSettingsSharingPanelState({
    preferences: {
      ...defaultEmergencyPreferences,
      emergencyPhoneCall: {
        ...defaultEmergencyPreferences.emergencyPhoneCall,
        allowReceiverCall190: true,
        call190OnSosEnabled: true,
        callTrustedContactOnAlert: true
      },
      trustedStream: {
        ...defaultEmergencyPreferences.trustedStream,
        allowReceiverEncryptedSave: true,
        requestedMedia: {
          ...defaultEmergencyPreferences.trustedStream.requestedMedia,
          audio: true,
          locationLive: true,
          video: true
        }
      }
    },
    trustedContactName: "Maria",
    trustedContactStatus: "accepted"
  }),
  {
    actions: [
      {
        disabled: true,
        icon: "phone",
        key: "police-home",
        label: "Policia sempre na Home",
        selected: true
      },
      {
        disabled: false,
        icon: "phone",
        key: "call-190",
        label: "190 junto com SOS ativo",
        selected: true
      },
      {
        disabled: true,
        icon: "phone",
        key: "trusted-contact-call",
        label: "Videochamada ao anjo aguardando gestao",
        selected: false
      },
      {
        disabled: true,
        icon: "shield",
        key: "receiver-call-190",
        label: "Anjo 190 aguardando contrato",
        selected: false
      },
      {
        disabled: false,
        icon: "video",
        key: "stream-video",
        label: "Video para anjos solicitado",
        selected: false,
        streamScope: "video"
      },
      {
        disabled: false,
        icon: "microphone",
        key: "stream-audio",
        label: "Audio para anjos solicitado",
        selected: false,
        streamScope: "audio"
      },
      {
        disabled: false,
        icon: "location",
        key: "stream-location",
        label: "Localizacao ao vivo solicitada",
        selected: false,
        streamScope: "locationLive"
      },
      {
        disabled: false,
        icon: "lock",
        key: "receiver-save",
        label: "Salvamento no app do anjo solicitado",
        selected: false
      }
    ],
    contactSummary: "Anjo convidado: Maria. Autorizado."
  }
);

const fallbackSharingPanel = buildSettingsSharingPanelState({
  preferences: null,
  trustedContactName: "Contato de confianca",
  trustedContactStatus: "pendente"
});
assert.equal(fallbackSharingPanel.contactSummary, "Anjo convidado: Contato de confianca. Aguardando aceite.");
assert.equal(fallbackSharingPanel.actions[1].label, "Ligar 190 junto com SOS");
assert.equal(fallbackSharingPanel.actions[2].label, "Atalho de anjo desativado");
assert.equal(fallbackSharingPanel.actions[3].label, "Anjo 190 bloqueado ate aceite");
assert.equal(fallbackSharingPanel.actions[4].label, "Preparar video para anjos");
assert.equal(fallbackSharingPanel.actions[5].label, "Preparar audio para anjos");
assert.equal(fallbackSharingPanel.actions[6].label, "Solicitar localizacao ao vivo");
assert.equal(fallbackSharingPanel.actions[7].label, "Preparar salvamento no app do anjo");

assert.deepEqual(
  buildSettingsVideoPanelState({
    ...defaultEmergencyPreferences,
    localVideoCapture: {
      ...defaultEmergencyPreferences.localVideoCapture,
      cameraMode: "both",
      requestOnSos: true
    }
  }),
  {
    actions: [
      {
        icon: "video",
        key: "toggle-local-video",
        label: "Video local ativo no SOS",
        selected: false
      },
      {
        icon: "microphone",
        key: "authorize-media",
        label: "Autorizar camera e microfone",
        selected: false
      },
      {
        cameraMode: "front",
        icon: "camera",
        key: "camera-front",
        label: "Usar camera frontal",
        selected: false
      },
      {
        cameraMode: "back",
        icon: "camera",
        key: "camera-back",
        label: "Usar camera traseira",
        selected: false
      },
      {
        cameraMode: "both",
        icon: "switch-camera",
        key: "camera-both",
        label: "Usar duas cameras",
        selected: true
      }
    ]
  }
);

const fallbackVideoPanel = buildSettingsVideoPanelState(null);
assert.equal(fallbackVideoPanel.actions[0].label, "Ativar video local no SOS");
assert.equal(fallbackVideoPanel.actions[2].selected, false);
assert.equal(fallbackVideoPanel.actions[3].selected, false);
assert.equal(fallbackVideoPanel.actions[4].selected, false);

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
