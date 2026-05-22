import {
  formatDuration,
  type EmergencyPreferences,
  type LocalVideoCameraMode
} from "@/features/emergency/emergencyPreferences";

export type PermissionStatusText = "pendente" | "permitido" | "negado" | "bloqueado";

export type SettingsPanel =
  | "duracao"
  | "encerramento"
  | "localizacao"
  | "compartilhamento"
  | "video"
  | "atualizacao"
  | "termos"
  | "login"
  | null;

export type SettingsConcretePanel = Exclude<SettingsPanel, null>;

export type SettingsLegalConsentItem = {
  text: string;
  title: string;
};

export type SettingsPanelHelp = {
  message: string;
  title: string;
};

export type SettingsPermissionGateState = {
  status: PermissionStatusText;
  text: string;
  title: string;
};

export type SettingsLocationPanelState = {
  backgroundGate: SettingsPermissionGateState;
  foregroundGate: SettingsPermissionGateState;
};

export type SettingsSecurityCodePanelState = {
  changeActionLabel: string;
  disableActionLabel: string;
  enableActionLabel: string;
  isEnabled: boolean;
  statusLabel: string;
};

export type SettingsPanelActionIcon =
  | "camera"
  | "key"
  | "location"
  | "lock"
  | "microphone"
  | "phone"
  | "refresh"
  | "shield"
  | "smartphone"
  | "switch-camera"
  | "video";

export type SettingsPanelActionStyle = "danger" | "muted" | "selected";

export type SettingsSharingPanelActionKey =
  | "call-190"
  | "police-home"
  | "receiver-call-190"
  | "receiver-save"
  | "stream-audio"
  | "stream-location"
  | "stream-video"
  | "trusted-contact-call";

export type SettingsSharingPanelAction = {
  disabled: boolean;
  icon: SettingsPanelActionIcon;
  key: SettingsSharingPanelActionKey;
  label: string;
  selected: boolean;
  streamScope?: keyof EmergencyPreferences["trustedStream"]["requestedMedia"];
};

export type SettingsSharingPanelState = {
  actions: SettingsSharingPanelAction[];
  contactSummary: string;
};

export type SettingsVideoPanelActionKey =
  | "authorize-media"
  | "camera-back"
  | "camera-both"
  | "camera-front"
  | "toggle-local-video";

export type SettingsVideoPanelAction = {
  cameraMode?: LocalVideoCameraMode;
  icon: SettingsPanelActionIcon;
  key: SettingsVideoPanelActionKey;
  label: string;
  selected: boolean;
};

export type SettingsVideoPanelState = {
  actions: SettingsVideoPanelAction[];
};

export type SettingsPreferenceUpdateResult = {
  message: string;
  nextPreferences: EmergencyPreferences;
};

export type SettingsUpdatePanelSourceState = {
  checkedAt?: string;
  currentVersion?: string;
  currentVersionCode?: number;
  downloadUrl?: string;
  latestVersion?: string;
  latestVersionCode?: number;
  message?: string;
  status?: string;
};

export type SettingsUpdatePanelState = {
  actions: SettingsUpdatePanelAction[];
  availableVersionLabel?: string;
  checkedAtLabel?: string;
  downloadButtonDisabled: boolean;
  downloadButtonLabel: string;
  downloadButtonSelected: boolean;
  infoActive: boolean;
  infoText: string;
  installedActive: boolean;
  installedVersionLabel: string;
  verifyButtonDisabled: boolean;
  verifyButtonLabel: string;
};

export type SettingsUpdatePanelActionKey = "download-update" | "verify-update";

export type SettingsUpdatePanelAction = {
  disabled: boolean;
  icon: SettingsPanelActionIcon;
  key: SettingsUpdatePanelActionKey;
  label: string;
  style?: SettingsPanelActionStyle;
};

export type SettingsLoginPanelState = {
  accountActive: boolean;
  accountActions: SettingsLoginPanelAction[];
  accountLabel: string;
  apiActive: boolean;
  apiText: string;
  appleButtonDisabled: boolean;
  appleButtonMuted: boolean;
  deviceActive: boolean;
  deviceText: string;
  emailActions: SettingsLoginPanelAction[];
  emailLoginButtonLabel: string;
  googleActive: boolean;
  googleButtonDisabled: boolean;
  googleButtonMuted: boolean;
  googleText: string;
  providerActions: SettingsLoginPanelAction[];
  sessionActionDisabled: boolean;
  testApiButtonDisabled: boolean;
};

export type SettingsLoginPanelActionKey =
  | "apple-login"
  | "email-login"
  | "google-login"
  | "logout"
  | "test-api"
  | "validate-session";

export type SettingsLoginPanelAction = {
  disabled: boolean;
  icon: SettingsPanelActionIcon;
  key: SettingsLoginPanelActionKey;
  label: string;
  style?: SettingsPanelActionStyle;
};

export type SettingsDashboardTileIcon =
  | "angels"
  | "duration"
  | "login"
  | "media"
  | "permissions"
  | "security-code"
  | "terms"
  | "update";

export type SettingsDashboardTileKey =
  | "angels"
  | "duration"
  | "login"
  | "media"
  | "permissions"
  | "security-code"
  | "terms"
  | "update";

export type SettingsDashboardTileAction = {
  kind: "panel";
  panel: SettingsConcretePanel;
};

export type SettingsDashboardTile = {
  action: SettingsDashboardTileAction;
  description: string;
  icon: SettingsDashboardTileIcon;
  key: SettingsDashboardTileKey;
  label: string;
};

export const settingsLegalConsentItems: SettingsLegalConsentItem[] = [
  {
    title: "Uso emergencial",
    text: "O SinalSeguro apoia um pedido de ajuda e guarda arquivos locais autorizados. Ele nao substitui 190, 193, 192 nem atendimento publico."
  },
  {
    title: "Privacidade",
    text: "Localizacao, video e audio so devem ser usados para protecao, orientacao e entrega autorizada dentro do fluxo SinalSeguro."
  },
  {
    title: "Arquivos locais",
    text: "Os arquivos ficam neste aparelho ate exclusao local ou envio futuro com backend, chaves, auditoria, termos completos e revisao juridica."
  }
];

export const settingsPanelTitles = {
  compartilhamento: "Compartilhamento",
  duracao: "Tempo de gravacao",
  encerramento: "Codigo de seguranca",
  localizacao: "Localizacao",
  login: "Login",
  atualizacao: "Atualizacao",
  termos: "Termos e privacidade",
  video: "Video local"
} satisfies Record<SettingsConcretePanel, string>;

const settingsPanelHelpMessages = {
  compartilhamento:
    "Os anjos recebem dados somente quando houver convite aceito, autorizacao da usuaria e contrato de privacidade. A opcao de ligar 190 junto com o SOS vem desativada por padrao.",
  duracao:
    "Este tempo controla apenas a gravacao local. O chamado de emergencia continua ativo ate a usuaria encerrar pelo botao SOS.",
  encerramento: "Quando ativo, o codigo protege o encerramento do SOS e o acesso as areas privadas do app.",
  localizacao:
    "Autorizar localizacao antes da emergencia reduz etapas no momento do acionamento. A permissao pode ser revogada no sistema.",
  login: "Use sua conta para proteger convites, anjos e acesso aos arquivos autorizados.",
  atualizacao:
    "A verificacao usa o canal oficial de download do SinalSeguro e informa quando houver uma versao Android mais recente.",
  termos:
    "Termos e privacidade registram consentimento para uso emergencial, anjos autorizados e preservacao dos arquivos.",
  video:
    "O SOS pode gravar video local no aparelho autorizado. A opcao padrao tenta usar as duas cameras; se o aparelho bloquear, o app preserva a camera disponivel."
} satisfies Record<SettingsConcretePanel, string>;

export function resolveSettingsPermissionStatus(status: unknown): PermissionStatusText {
  if (status === "granted") return "permitido";
  if (status === "denied") return "negado";
  return "pendente";
}

export function formatSettingsCameraModeLabel(cameraMode: LocalVideoCameraMode) {
  if (cameraMode === "back") return "Traseira";
  if (cameraMode === "both") return "Duas cameras";
  return "Frontal";
}

export function formatSettingsTrustedContactStatus(status: string) {
  if (status === "accepted" || status === "ativo" || status === "validado") return "Autorizado";
  if (status === "pending" || status === "pendente") return "Aguardando aceite";
  if (status === "revoked" || status === "revogado") return "Revogado";
  return "Em revisao";
}

export function buildSettingsPanelHelp(panel: SettingsConcretePanel): SettingsPanelHelp {
  return {
    message: settingsPanelHelpMessages[panel],
    title: `Ajuda: ${settingsPanelTitles[panel]}`
  };
}

export function buildSettingsLocationPanelState({
  backgroundStatus,
  foregroundStatus,
  servicesEnabled
}: {
  backgroundStatus: PermissionStatusText;
  foregroundStatus: PermissionStatusText;
  servicesEnabled: boolean;
}): SettingsLocationPanelState {
  return {
    backgroundGate: {
      status: backgroundStatus === "permitido" ? "permitido" : "bloqueado",
      text: "Mantem a localizacao do chamado enquanto a emergencia estiver ativa, quando essa permissao estiver disponivel.",
      title: "Segundo plano"
    },
    foregroundGate: {
      status: foregroundStatus,
      text: servicesEnabled
        ? "Pode ser pre-autorizada aqui para reduzir atrito no momento do chamado."
        : "O GPS/localizacao do aparelho esta desativado no sistema.",
      title: "Localizacao do chamado"
    }
  };
}

export function buildSettingsSecurityCodePanelState(securityCodeRequired: boolean): SettingsSecurityCodePanelState {
  return {
    changeActionLabel: "Alterar codigo",
    disableActionLabel: "Desativar codigo",
    enableActionLabel: "Ativar codigo",
    isEnabled: securityCodeRequired,
    statusLabel: securityCodeRequired ? "Codigo habilitado" : "Sem codigo"
  };
}

export function buildSettingsSharingPanelState({
  preferences,
  trustedContactName,
  trustedContactStatus
}: {
  preferences: EmergencyPreferences | null;
  trustedContactName: string;
  trustedContactStatus: string;
}): SettingsSharingPanelState {
  return {
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
        label: preferences?.emergencyPhoneCall.call190OnSosEnabled
          ? "190 junto com SOS ativo"
          : "Ligar 190 junto com SOS",
        selected: Boolean(preferences?.emergencyPhoneCall.call190OnSosEnabled)
      },
      {
        disabled: true,
        icon: "phone",
        key: "trusted-contact-call",
        label: preferences?.emergencyPhoneCall.callTrustedContactOnAlert
          ? "Videochamada ao anjo aguardando gestao"
          : "Atalho de anjo desativado",
        selected: false
      },
      {
        disabled: true,
        icon: "shield",
        key: "receiver-call-190",
        label: preferences?.emergencyPhoneCall.allowReceiverCall190
          ? "Anjo 190 aguardando contrato"
          : "Anjo 190 bloqueado ate aceite",
        selected: false
      },
      {
        disabled: false,
        icon: "video",
        key: "stream-video",
        label: preferences?.trustedStream.requestedMedia.video
          ? "Video para anjos solicitado"
          : "Preparar video para anjos",
        selected: false,
        streamScope: "video"
      },
      {
        disabled: false,
        icon: "microphone",
        key: "stream-audio",
        label: preferences?.trustedStream.requestedMedia.audio
          ? "Audio para anjos solicitado"
          : "Preparar audio para anjos",
        selected: false,
        streamScope: "audio"
      },
      {
        disabled: false,
        icon: "location",
        key: "stream-location",
        label: preferences?.trustedStream.requestedMedia.locationLive
          ? "Localizacao ao vivo solicitada"
          : "Solicitar localizacao ao vivo",
        selected: false,
        streamScope: "locationLive"
      },
      {
        disabled: false,
        icon: "lock",
        key: "receiver-save",
        label: preferences?.trustedStream.allowReceiverEncryptedSave
          ? "Salvamento no app do anjo solicitado"
          : "Preparar salvamento no app do anjo",
        selected: false
      }
    ],
    contactSummary: `Anjo convidado: ${trustedContactName}. ${formatSettingsTrustedContactStatus(trustedContactStatus)}.`
  };
}

export function buildSettingsVideoPanelState(preferences: EmergencyPreferences | null): SettingsVideoPanelState {
  return {
    actions: [
      {
        icon: "video",
        key: "toggle-local-video",
        label: preferences?.localVideoCapture.requestOnSos ? "Video local ativo no SOS" : "Ativar video local no SOS",
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
        selected: preferences?.localVideoCapture.cameraMode === "front"
      },
      {
        cameraMode: "back",
        icon: "camera",
        key: "camera-back",
        label: "Usar camera traseira",
        selected: preferences?.localVideoCapture.cameraMode === "back"
      },
      {
        cameraMode: "both",
        icon: "switch-camera",
        key: "camera-both",
        label: "Usar duas cameras",
        selected: preferences?.localVideoCapture.cameraMode === "both"
      }
    ]
  };
}

export function buildSettingsCall190PreferenceUpdate(
  preferences: EmergencyPreferences
): SettingsPreferenceUpdateResult {
  const enabled = !preferences.emergencyPhoneCall.call190OnSosEnabled;

  return {
    message: enabled ? "Ligacao 190 junto com SOS ativada." : "Ligacao 190 junto com SOS desativada.",
    nextPreferences: {
      ...preferences,
      emergencyPhoneCall: {
        ...preferences.emergencyPhoneCall,
        call190OnSosEnabled: enabled
      }
    }
  };
}

export function buildSettingsStreamScopePreferenceUpdate({
  preferences,
  scope
}: {
  preferences: EmergencyPreferences;
  scope: keyof EmergencyPreferences["trustedStream"]["requestedMedia"];
}): SettingsPreferenceUpdateResult {
  const enabled = !preferences.trustedStream.requestedMedia[scope];

  return {
    message: enabled ? "Preferencia ativada para anjos autorizados." : "Preferencia removida.",
    nextPreferences: {
      ...preferences,
      trustedStream: {
        ...preferences.trustedStream,
        status: "homologation_blocked",
        requestedMedia: {
          ...preferences.trustedStream.requestedMedia,
          [scope]: enabled
        }
      }
    }
  };
}

export function buildSettingsReceiverEncryptedSavePreferenceUpdate(
  preferences: EmergencyPreferences
): SettingsPreferenceUpdateResult {
  const enabled = !preferences.trustedStream.allowReceiverEncryptedSave;

  return {
    message: enabled
      ? "Anjo autorizado podera salvar copia protegida dentro do app."
      : "Salvamento pelo anjo foi desmarcado.",
    nextPreferences: {
      ...preferences,
      trustedStream: {
        ...preferences.trustedStream,
        allowReceiverEncryptedSave: enabled
      }
    }
  };
}

export function buildSettingsCameraModePreferenceUpdate({
  cameraMode,
  preferences
}: {
  cameraMode: LocalVideoCameraMode;
  preferences: EmergencyPreferences;
}): SettingsPreferenceUpdateResult {
  const cameraLabel = formatSettingsCameraModeLabel(cameraMode).toLowerCase();

  return {
    message:
      cameraMode === "both"
        ? "Duas cameras selecionadas para a proxima gravacao local."
        : `Camera ${cameraLabel} definida para a proxima gravacao local.`,
    nextPreferences: {
      ...preferences,
      localVideoCapture: {
        ...preferences.localVideoCapture,
        cameraMode,
        status: "enabled_local"
      }
    }
  };
}

export function buildSettingsLocalVideoRequestPreferenceUpdate(
  preferences: EmergencyPreferences
): SettingsPreferenceUpdateResult {
  const requestOnSos = !preferences.localVideoCapture.requestOnSos;

  return {
    message: requestOnSos
      ? "Video local sera solicitado quando o SOS iniciar."
      : "Video local desativado para o proximo SOS.",
    nextPreferences: {
      ...preferences,
      localVideoCapture: {
        ...preferences.localVideoCapture,
        requestOnSos,
        status: "enabled_local"
      }
    }
  };
}

function formatSettingsAppVersion(version?: string, versionCode?: number) {
  const readableVersion = version && version.trim().length > 0 ? version : "nao identificada";
  return typeof versionCode === "number" ? `${readableVersion} (codigo ${versionCode})` : readableVersion;
}

export function buildSettingsUpdatePanelState({
  updateBusy,
  updateState
}: {
  updateBusy: boolean;
  updateState: SettingsUpdatePanelSourceState | null;
}): SettingsUpdatePanelState {
  const updateAvailable = updateState?.status === "available";
  const latestVersionKnown = updateAvailable && Boolean(updateState?.latestVersion);
  const downloadButtonDisabled = !updateState?.downloadUrl;
  const downloadButtonSelected = updateAvailable;
  const downloadButtonLabel = "Baixar versao Android";
  const verifyButtonDisabled = updateBusy;
  const verifyButtonLabel = updateBusy ? "Verificando..." : "Verificar atualizacao";

  return {
    actions: [
      {
        disabled: verifyButtonDisabled,
        icon: "refresh",
        key: "verify-update",
        label: verifyButtonLabel
      },
      {
        disabled: downloadButtonDisabled,
        icon: "smartphone",
        key: "download-update",
        label: downloadButtonLabel,
        style: downloadButtonSelected ? "selected" : undefined
      }
    ],
    availableVersionLabel: latestVersionKnown
      ? `Disponivel ${formatSettingsAppVersion(updateState?.latestVersion, updateState?.latestVersionCode)}`
      : undefined,
    checkedAtLabel: updateState?.checkedAt
      ? `Ultima verificacao: ${new Date(updateState.checkedAt).toLocaleDateString("pt-BR")}`
      : undefined,
    downloadButtonDisabled,
    downloadButtonLabel,
    downloadButtonSelected,
    infoActive: updateAvailable,
    infoText: updateState?.message ?? "Toque em verificar para consultar a versao Android disponivel.",
    installedActive: updateState?.status === "current",
    installedVersionLabel: `Instalada ${formatSettingsAppVersion(
      updateState?.currentVersion,
      updateState?.currentVersionCode
    )}`,
    verifyButtonDisabled,
    verifyButtonLabel
  };
}

export function buildSettingsLoginPanelState({
  accountEmail,
  apiBaseUrl,
  apiEnabled,
  appleLoginAvailable,
  googleLoginConfigured,
  googleNativePlatform,
  loginBusy,
  platform,
  registeredDeviceId
}: {
  accountEmail?: string | null;
  apiBaseUrl?: string | null;
  apiEnabled: boolean;
  appleLoginAvailable: boolean;
  googleLoginConfigured: boolean;
  googleNativePlatform: boolean;
  loginBusy: boolean;
  platform: string;
} & {
  registeredDeviceId?: string | null;
}): SettingsLoginPanelState {
  const accountActive = Boolean(accountEmail);
  const apiActive = apiEnabled && Boolean(apiBaseUrl);
  const deviceActive = Boolean(registeredDeviceId);
  const appleButtonDisabled = loginBusy || !appleLoginAvailable;
  const appleButtonMuted = !appleLoginAvailable;
  const emailLoginButtonLabel = loginBusy ? "Conectando..." : "Entrar com e-mail";
  const googleButtonDisabled = loginBusy;
  const googleButtonMuted = !googleLoginConfigured;
  const sessionActionDisabled = loginBusy;
  const testApiButtonDisabled = loginBusy;
  const googleText = googleLoginConfigured
    ? googleNativePlatform
      ? `Google Sign-In nativo configurado para ${platform === "ios" ? "iOS" : "Android"}.`
      : "Google OIDC configurado para esta plataforma."
    : "Google ainda nao configurado para esta plataforma.";

  return {
    accountActive,
    accountActions: accountActive
      ? [
          {
            disabled: sessionActionDisabled,
            icon: "refresh",
            key: "validate-session",
            label: "Validar sessao"
          },
          {
            disabled: sessionActionDisabled,
            icon: "lock",
            key: "logout",
            label: "Sair desta conta",
            style: "danger"
          }
        ]
      : [],
    accountLabel: accountEmail ?? "Conta SinalSeguro desconectada",
    apiActive,
    apiText: apiActive ? `API configurada em ${apiBaseUrl}.` : "API SinalSeguro desabilitada neste build.",
    appleButtonDisabled,
    appleButtonMuted,
    deviceActive,
    deviceText: deviceActive
      ? "Dispositivo autenticado registrado para esta conta."
      : "Dispositivo sera registrado apos login validado.",
    emailActions: accountActive
      ? []
      : [
          {
            disabled: sessionActionDisabled,
            icon: "key",
            key: "email-login",
            label: emailLoginButtonLabel
          }
        ],
    emailLoginButtonLabel,
    googleActive: googleLoginConfigured,
    googleButtonDisabled,
    googleButtonMuted,
    googleText,
    providerActions: [
      {
        disabled: testApiButtonDisabled,
        icon: "refresh",
        key: "test-api",
        label: "Testar API"
      },
      {
        disabled: googleButtonDisabled,
        icon: "key",
        key: "google-login",
        label: "Entrar com Google",
        style: googleButtonMuted ? "muted" : undefined
      },
      {
        disabled: appleButtonDisabled,
        icon: "key",
        key: "apple-login",
        label: "Entrar com Apple/iCloud",
        style: appleButtonMuted ? "muted" : undefined
      }
    ],
    sessionActionDisabled,
    testApiButtonDisabled
  };
}

export function buildSettingsDashboardTileAction(panel: SettingsConcretePanel): SettingsDashboardTileAction {
  return {
    kind: "panel",
    panel
  };
}

export function buildSettingsDashboardTileRows({
  accountConnected,
  foregroundStatus,
  preferences,
  updateAvailable
}: {
  accountConnected: boolean;
  foregroundStatus: PermissionStatusText;
  preferences: EmergencyPreferences | null;
  updateAvailable: boolean;
}): SettingsDashboardTile[][] {
  return [
    [
      {
        action: buildSettingsDashboardTileAction("termos"),
        description: preferences?.legalConsent.termsAccepted ? "Aceito" : "Revisar",
        icon: "terms",
        key: "terms",
        label: "Termos"
      },
      {
        action: buildSettingsDashboardTileAction("login"),
        description: accountConnected ? "Conectado" : "Conta",
        icon: "login",
        key: "login",
        label: "Login"
      }
    ],
    [
      {
        action: buildSettingsDashboardTileAction("localizacao"),
        description: foregroundStatus === "permitido" ? "Permitido" : foregroundStatus,
        icon: "permissions",
        key: "permissions",
        label: "Permissoes"
      },
      {
        action: buildSettingsDashboardTileAction("duracao"),
        description: preferences ? formatDuration(preferences.defaultDurationSeconds) : "Carregando",
        icon: "duration",
        key: "duration",
        label: "Gravacao"
      }
    ],
    [
      {
        action: buildSettingsDashboardTileAction("encerramento"),
        description: preferences?.finishSafety.requireCode ? "Ativo" : "Configurar",
        icon: "security-code",
        key: "security-code",
        label: "Codigo de seguranca"
      },
      {
        action: buildSettingsDashboardTileAction("video"),
        description: preferences?.localVideoCapture.requestOnSos
          ? formatSettingsCameraModeLabel(preferences.localVideoCapture.cameraMode)
          : "Desativada",
        icon: "media",
        key: "media",
        label: "Midia"
      }
    ],
    [
      {
        action: buildSettingsDashboardTileAction("compartilhamento"),
        description: "Dados",
        icon: "angels",
        key: "angels",
        label: "Anjos"
      },
      {
        action: buildSettingsDashboardTileAction("atualizacao"),
        description: updateAvailable ? "Disponivel" : "Verificar",
        icon: "update",
        key: "update",
        label: "Atualizacao"
      }
    ]
  ];
}
