import { ReactNode, useEffect, useState } from "react";
import { Linking, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Camera as ExpoCamera } from "expo-camera";
import * as Location from "expo-location";
import {
  BookOpenCheck,
  Camera,
  Clock,
  Download,
  KeyRound,
  LockKeyhole,
  LocateFixed,
  MapPin,
  Mic,
  PhoneCall,
  RefreshCw,
  Smartphone,
  Settings as SettingsIcon,
  ShieldCheck,
  SwitchCamera,
  UserCircle2,
  Video
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppTopBar } from "@/components/AppTopBar";
import { BrandedDialog, BrandedDialogAction } from "@/components/BrandedDialog";
import { ButtonIcon } from "@/components/ButtonIcon";
import { PermissionGate } from "@/components/PermissionGate";
import { ProtectedAccessGate } from "@/components/ProtectedAccessGate";
import { ResourceTile } from "@/components/ResourceTile";
import { theme } from "@/design/theme";
import { trustedContactsMock } from "@/features/contacts/contactMocks";
import { EmergencySettingsDrawer } from "@/features/emergency-home/EmergencySettingsDrawer";
import { EmergencyHomePanel, EmergencyHomeRoute } from "@/features/emergency-home/routes";
import {
  defaultEmergencyPreferences,
  durationOptions,
  EmergencyDurationSeconds,
  EmergencyPreferences,
  formatDuration,
  getEmergencyPreferences,
  LocalVideoCameraMode,
  saveEmergencyPreferences
} from "@/features/emergency/emergencyPreferences";
import { getLocationPermissionReadiness, prepareForegroundLocationPermission } from "@/features/emergency/locationCapture";
import {
  clearProtectedAccess,
  hashSecurityCode,
  hasSecurityCode,
  isProtectedAccessUnlocked,
  verifySecurityCodeStatus,
  validateSecurityCodePair
} from "@/security/protectedAccess";
import { ApiRequestError, ApiSession, apiClient, apiConfig } from "@/services/apiClient";
import {
  AppUpdateState,
  checkForAppUpdate,
  formatAppVersion,
  openAppUpdateDownload
} from "@/services/appUpdate";
import { AppleIdentityCancelledError, appleIdentityService } from "@/services/appleIdentity";
import { DeviceBootstrapResult, deviceBindingService } from "@/services/deviceBinding";
import { beginGoogleOidcAuthorizationAsync, consumeGoogleOidcLoginStatus, getGoogleOidcReadiness } from "@/services/googleOidc";
import {
  beginNativeGoogleSignInAsync,
  buildGoogleSignInNotice,
  completeGoogleSignInFromRedirect,
  getNativeGoogleSignInReadiness,
  signOutNativeGoogleIfAvailable
} from "@/services/googleSignIn";

type PermissionStatusText = "pendente" | "permitido" | "negado" | "bloqueado";
type SettingsPanel =
  | "duracao"
  | "encerramento"
  | "localizacao"
  | "compartilhamento"
  | "video"
  | "atualizacao"
  | "termos"
  | "login"
  | null;

type InfoDialog = {
  title: string;
  message: string;
  icon?: ReactNode;
  actions: BrandedDialogAction[];
};

function getErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) return fallback;
  return error.message || fallback;
}

function isActiveDeviceLoginBlocked(error: unknown) {
  if (!(error instanceof ApiRequestError) || error.status !== 409) return false;
  if (!error.details || typeof error.details !== "object") return false;

  const details = error.details as { code?: unknown };
  return details.code === "active_device_login_blocked";
}

function toPermissionStatus(status: Location.PermissionStatus): PermissionStatusText {
  if (status === Location.PermissionStatus.GRANTED) return "permitido";
  if (status === Location.PermissionStatus.DENIED) return "negado";
  return "pendente";
}

function formatCameraModeLabel(cameraMode: LocalVideoCameraMode) {
  if (cameraMode === "back") return "Traseira";
  if (cameraMode === "both") return "Duas cameras";
  return "Frontal";
}

function formatTrustedContactStatus(status: string) {
  if (status === "accepted" || status === "ativo" || status === "validado") return "Autorizado";
  if (status === "pending" || status === "pendente") return "Aguardando aceite";
  if (status === "revoked" || status === "revogado") return "Revogado";
  return "Em revisao";
}

const legalConsentItems = [
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

function SecurityCodeInput({
  label,
  onChangeText,
  value
}: {
  label: string;
  onChangeText: (value: string) => void;
  value: string;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="number-pad"
        maxLength={16}
        onChangeText={(text) => {
          onChangeText(text);
        }}
        placeholder={label}
        placeholderTextColor={theme.colors.textMuted}
        secureTextEntry
        style={styles.codeInput}
        value={value}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const googleOidcReadiness = getGoogleOidcReadiness();
  const nativeGoogleReadiness = getNativeGoogleSignInReadiness();
  const googleNativePlatform = Platform.OS === "android" || Platform.OS === "ios";
  const googleLoginConfigured = googleNativePlatform
    ? nativeGoogleReadiness.currentPlatformConfigured
    : googleOidcReadiness.currentPlatformConfigured;
  const [preferences, setPreferences] = useState<EmergencyPreferences | null>(null);
  const [foregroundStatus, setForegroundStatus] = useState<PermissionStatusText>("pendente");
  const [backgroundStatus, setBackgroundStatus] = useState<PermissionStatusText>("bloqueado");
  const [servicesEnabled, setServicesEnabled] = useState(false);
  const [currentFinishCode, setCurrentFinishCode] = useState("");
  const [newFinishCode, setNewFinishCode] = useState("");
  const [repeatFinishCode, setRepeatFinishCode] = useState("");
  const [securityCodeError, setSecurityCodeError] = useState("");
  const [securityCodeNotice, setSecurityCodeNotice] = useState("");
  const [activePanel, setActivePanel] = useState<SettingsPanel>(null);
  const [infoDialog, setInfoDialog] = useState<InfoDialog | null>(null);
  const [accessReady, setAccessReady] = useState(false);
  const [accessGateVisible, setAccessGateVisible] = useState(false);
  const [apiSession, setApiSession] = useState<ApiSession | null>(null);
  const [registeredDeviceId, setRegisteredDeviceId] = useState<string | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginNotice, setLoginNotice] = useState("");
  const [updateState, setUpdateState] = useState<AppUpdateState | null>(null);
  const [updateBusy, setUpdateBusy] = useState(false);
  const [appleLoginAvailable, setAppleLoginAvailable] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setStatusText] = useState("Carregando preferencias de emergencia...");

  function showLoginFailureMessage(message: string, title = "Login nao concluido") {
    setLoginError(message);
    setInfoDialog({
      title,
      message,
      icon: <LockKeyhole size={18} color={theme.colors.danger} />,
      actions: [{ label: "Entendi" }]
    });
  }

  function showLoginFailure(error: unknown, fallback: string) {
    showLoginFailureMessage(
      getErrorMessage(error, fallback),
      isActiveDeviceLoginBlocked(error) ? "Login bloqueado neste aparelho" : "Login nao concluido"
    );
  }

  async function refreshReadiness() {
    const readiness = await getLocationPermissionReadiness();
    setForegroundStatus(toPermissionStatus(readiness.foreground));
    setBackgroundStatus(toPermissionStatus(readiness.background));
    setServicesEnabled(readiness.servicesEnabled);
  }

  async function loadSettings() {
    const nextPreferences = await getEmergencyPreferences();
    setPreferences(nextPreferences);
    setApiSession(await apiClient.getStoredSession());
    setRegisteredDeviceId(await deviceBindingService.getRegisteredApiDeviceId());
    setUpdateState(await checkForAppUpdate({ force: true }));
    const googleLoginStatus = await consumeGoogleOidcLoginStatus();
    if (googleLoginStatus) {
      setActivePanel("login");
      if (googleLoginStatus.kind === "success") {
        setLoginNotice(googleLoginStatus.message);
      } else {
        showLoginFailureMessage(googleLoginStatus.message);
      }
    }
    await refreshReadiness();
    if (hasSecurityCode(nextPreferences)) {
      setAccessGateVisible(!(await isProtectedAccessUnlocked()));
    }
    setAccessReady(true);
    setStatusText("Configuracoes carregadas.");
  }

  useEffect(() => {
    void loadSettings();
  }, []);

  useEffect(() => {
    void appleIdentityService.isAvailable().then(setAppleLoginAvailable).catch(() => setAppleLoginAvailable(false));
  }, []);

  async function updatePreferences(nextPreferences: EmergencyPreferences, message: string) {
    await saveEmergencyPreferences(nextPreferences);
    setPreferences(nextPreferences);
    setStatusText(message);
  }

  async function updateDuration(defaultDurationSeconds: EmergencyDurationSeconds) {
    if (!preferences) return;

    await updatePreferences(
      {
        ...preferences,
        defaultDurationSeconds
      },
      `Tempo de gravacao local definido para ${formatDuration(defaultDurationSeconds)}. O chamado continua ate encerramento manual.`
    );
  }

  async function toggleCall190OnSos() {
    if (!preferences) return;

    const enabled = !preferences.emergencyPhoneCall.call190OnSosEnabled;
    await updatePreferences(
      {
        ...preferences,
        emergencyPhoneCall: {
          ...preferences.emergencyPhoneCall,
          call190OnSosEnabled: enabled
        }
      },
      enabled ? "Ligacao 190 junto com SOS ativada." : "Ligacao 190 junto com SOS desativada."
    );
  }

  function resetSecurityCodeFields() {
    setCurrentFinishCode("");
    setNewFinishCode("");
    setRepeatFinishCode("");
    setSecurityCodeError("");
  }

  async function refreshApiSession() {
    setLoginError("");
    setLoginNotice("");
    setLoginBusy(true);

    try {
      const currentSession = await apiClient.getStoredSession();
      if (!currentSession) {
        setApiSession(null);
        setLoginNotice("Nenhuma conta SinalSeguro conectada neste aparelho.");
        return;
      }

      const user = await apiClient.getMe();
      const nextSession = {
        ...currentSession,
        user
      };
      const bootstrap = await completeDeviceBootstrap(nextPreferencesOrCurrent());
      setApiSession(nextSession);
      setLoginNotice(buildLoginBootstrapNotice("Sessao SinalSeguro validada.", bootstrap));
    } catch (error) {
      await apiClient.clearSession();
      setApiSession(null);
      setLoginError(error instanceof Error ? error.message : "Nao foi possivel validar a sessao.");
    } finally {
      setLoginBusy(false);
    }
  }

  function nextPreferencesOrCurrent() {
    return preferences ?? defaultEmergencyPreferences;
  }

  function buildLoginBootstrapNotice(prefix: string, bootstrap: DeviceBootstrapResult) {
    return buildGoogleSignInNotice(prefix, bootstrap);
  }

  async function completeDeviceBootstrap(currentPreferences: EmergencyPreferences) {
    const bootstrap = await deviceBindingService.completeAuthenticatedBootstrap(currentPreferences);
    setRegisteredDeviceId(bootstrap.device.id);
    return bootstrap;
  }

  async function loginWithEmailPassword() {
    const email = loginEmail.trim().toLowerCase();
    if (!email || !loginPassword) {
      setLoginError("Informe e-mail e senha da conta SinalSeguro.");
      return;
    }

    setLoginBusy(true);
    setLoginError("");
    setLoginNotice("");

    try {
      const deviceContext = await deviceBindingService.getLoginDeviceContext();
      const session = await apiClient.loginWithEmail(email, loginPassword, deviceContext);
      const bootstrap = await completeDeviceBootstrap(nextPreferencesOrCurrent());
      setApiSession(session);
      setLoginPassword("");
      setLoginNotice(buildLoginBootstrapNotice("Conta SinalSeguro conectada neste aparelho.", bootstrap));
    } catch (error) {
      showLoginFailure(error, "Nao foi possivel entrar agora.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function logoutApiSession() {
    setLoginBusy(true);
    setLoginError("");
    setLoginNotice("");

    try {
      const deviceContext = await deviceBindingService.getLogoutDeviceContext();
      await apiClient.logout(deviceContext);
      if (googleNativePlatform) {
        await signOutNativeGoogleIfAvailable();
      }
      await deviceBindingService.clearRegisteredDeviceSession();
      setApiSession(null);
      setRegisteredDeviceId(null);
      setLoginNotice("Conta desconectada deste aparelho.");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Nao foi possivel sair agora.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function loginWithGoogle() {
    setLoginBusy(true);
    setLoginError("");
    setLoginNotice("");

    if (!googleLoginConfigured) {
      setLoginBusy(false);
      showLoginFailureMessage(
        Platform.OS === "ios"
          ? "Google no iPhone exige EXPO_PUBLIC_GOOGLE_OIDC_WEB_CLIENT_ID, EXPO_PUBLIC_GOOGLE_OIDC_IOS_CLIENT_ID e o Client ID iOS liberado na API."
          : "Google Android exige EXPO_PUBLIC_GOOGLE_OIDC_WEB_CLIENT_ID local."
      );
      return;
    }

    try {
      if (googleNativePlatform) {
        const completion = await beginNativeGoogleSignInAsync();
        setApiSession(completion.session);
        setRegisteredDeviceId(completion.bootstrap.device.id);
        setLoginNotice(completion.notice);
        return;
      }

      const response = await beginGoogleOidcAuthorizationAsync();
      if (response.type !== "success") {
        setLoginNotice("Login Google cancelado.");
        return;
      }

      setLoginNotice("Login Google autorizado; validando com o SinalSeguro.");
      const completion = await completeGoogleSignInFromRedirect(response.params);
      setApiSession(completion.session);
      setRegisteredDeviceId(completion.bootstrap.device.id);
      setLoginNotice(completion.notice);
    } catch (error) {
      if (googleNativePlatform && error instanceof ApiRequestError) {
        await signOutNativeGoogleIfAvailable();
      }
      showLoginFailure(error, "Nao foi possivel entrar com Google agora.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function loginWithApple() {
    setLoginBusy(true);
    setLoginError("");
    setLoginNotice("");

    if (!appleLoginAvailable) {
      setLoginBusy(false);
      showLoginFailureMessage("Login Apple indisponivel neste aparelho ou assinatura/capability ainda nao habilitada.");
      return;
    }

    try {
      const appleLogin = await appleIdentityService.signIn();
      const deviceContext = await deviceBindingService.getLoginDeviceContext();
      const session = await apiClient.loginWithAppleIdentityToken(
        appleLogin.identityToken,
        appleLogin.displayName,
        deviceContext
      );
      const bootstrap = await completeDeviceBootstrap(nextPreferencesOrCurrent());
      setApiSession(session);
      setLoginNotice(buildLoginBootstrapNotice("Conta Apple conectada ao SinalSeguro.", bootstrap));
    } catch (error) {
      if (error instanceof AppleIdentityCancelledError) {
        setLoginNotice(error.message);
        return;
      }
      showLoginFailure(error, "Nao foi possivel entrar com Apple agora.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function checkApiConnection() {
    setLoginBusy(true);
    setLoginError("");
    setLoginNotice("");

    try {
      const health = await apiClient.getHealth();
      setLoginNotice(`API SinalSeguro online${health.status ? `: ${health.status}` : ""}.`);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "API SinalSeguro indisponivel.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function verifyAppUpdate() {
    setUpdateBusy(true);
    try {
      const state = await checkForAppUpdate({ force: true });
      setUpdateState(state);
    } finally {
      setUpdateBusy(false);
    }
  }

  async function downloadAppUpdate() {
    await openAppUpdateDownload(updateState);
  }

  async function saveNewSecurityCode() {
    if (!preferences) return;

    const validation = validateSecurityCodePair(newFinishCode, repeatFinishCode);
    if (!validation.ok) {
      setSecurityCodeError(validation.message);
      return;
    }

    const codeHash = await hashSecurityCode(validation.code);
    await updatePreferences(
      {
        ...preferences,
        finishSafety: {
          requireCode: true,
          codeHash
        }
      },
      "Codigo habilitado."
    );
    await clearProtectedAccess();
    resetSecurityCodeFields();
    setSecurityCodeNotice("Codigo habilitado.");
  }

  async function changeSecurityCode() {
    if (!preferences) return;

    const verification = await verifySecurityCodeStatus(preferences, currentFinishCode);
    if (!verification.ok) {
      setSecurityCodeError(verification.message);
      return;
    }

    const validation = validateSecurityCodePair(newFinishCode, repeatFinishCode);
    if (!validation.ok) {
      setSecurityCodeError(validation.message);
      return;
    }

    const codeHash = await hashSecurityCode(validation.code);
    await updatePreferences(
      {
        ...preferences,
        finishSafety: {
          requireCode: true,
          codeHash
        }
      },
      "Codigo atualizado."
    );
    await clearProtectedAccess();
    resetSecurityCodeFields();
    setSecurityCodeNotice("Codigo atualizado.");
  }

  async function disableSecurityCode() {
    if (!preferences) return;

    const verification = await verifySecurityCodeStatus(preferences, currentFinishCode);
    if (!verification.ok) {
      setSecurityCodeError(verification.message);
      return;
    }

    await updatePreferences(
      {
        ...preferences,
        finishSafety: {
          requireCode: false,
          codeHash: ""
        }
      },
      "Codigo removido."
    );
    await clearProtectedAccess();
    resetSecurityCodeFields();
    setSecurityCodeNotice("Codigo removido.");
  }

  async function toggleStreamScope(scope: keyof EmergencyPreferences["trustedStream"]["requestedMedia"]) {
    if (!preferences) return;

    const enabled = !preferences.trustedStream.requestedMedia[scope];
    await updatePreferences(
      {
        ...preferences,
        trustedStream: {
          ...preferences.trustedStream,
          status: "homologation_blocked",
          requestedMedia: {
            ...preferences.trustedStream.requestedMedia,
            [scope]: enabled
          }
        }
      },
      enabled ? "Preferencia ativada para anjos autorizados." : "Preferencia removida."
    );
  }

  async function toggleReceiverEncryptedSave() {
    if (!preferences) return;

    const enabled = !preferences.trustedStream.allowReceiverEncryptedSave;
    await updatePreferences(
      {
        ...preferences,
        trustedStream: {
          ...preferences.trustedStream,
          allowReceiverEncryptedSave: enabled
        }
      },
      enabled
        ? "Anjo autorizado podera salvar copia protegida dentro do app."
        : "Salvamento pelo anjo foi desmarcado."
    );
  }

  async function updateCameraMode(cameraMode: LocalVideoCameraMode) {
    if (!preferences) return;

    const cameraLabel = formatCameraModeLabel(cameraMode).toLowerCase();

    await updatePreferences(
      {
        ...preferences,
        localVideoCapture: {
          ...preferences.localVideoCapture,
          cameraMode,
          status: "enabled_local"
        }
      },
      cameraMode === "both"
        ? "Duas cameras selecionadas para a proxima gravacao local."
        : `Camera ${cameraLabel} definida para a proxima gravacao local.`
    );
  }

  async function toggleLocalVideoRequest() {
    if (!preferences) return;

    const requestOnSos = !preferences.localVideoCapture.requestOnSos;
    await updatePreferences(
      {
        ...preferences,
        localVideoCapture: {
          ...preferences.localVideoCapture,
          requestOnSos,
          status: "enabled_local"
        }
      },
      requestOnSos
        ? "Video local sera solicitado quando o SOS iniciar."
        : "Video local desativado para o proximo SOS."
    );
  }

  async function authorizeMediaPermissions() {
    const cameraPermission = await ExpoCamera.requestCameraPermissionsAsync();
    const microphonePermission = await ExpoCamera.requestMicrophonePermissionsAsync();
    setStatusText(
      cameraPermission.granted && microphonePermission.granted
        ? "Camera e microfone autorizados para o proximo SOS."
        : "Camera ou microfone negados. O SOS preserva metadados e localizacao, mas sem video local."
    );
  }

  async function authorizeForegroundLocation() {
    const permission = await prepareForegroundLocationPermission();
    await refreshReadiness();

    if (!preferences) return;

    const nextPreferences = {
      ...preferences,
      locationMode:
        permission.status === Location.PermissionStatus.GRANTED
          ? ("foreground_pre_authorized" as const)
          : ("ask_when_needed" as const)
    };
    await saveEmergencyPreferences(nextPreferences);
    setPreferences(nextPreferences);

    setStatusText(
      permission.status === Location.PermissionStatus.GRANTED
        ? "Localizacao autorizada. O proximo chamado usa essa permissao sem repetir o dialogo do sistema."
        : "Localizacao nao autorizada. O chamado ainda sera gravado com status de permissao negada."
    );
  }

  async function acceptLegalConsent() {
    if (!preferences) return;

    await updatePreferences(
      {
        ...preferences,
        legalConsent: {
          termsAccepted: true,
          privacyAccepted: true,
          emergencyDataSharingAccepted: true,
          version: preferences.legalConsent.version,
          acceptedAt: new Date().toISOString()
        }
      },
      "Termos e privacidade aceitos neste aparelho."
    );
  }

  async function openSystemSettings() {
    if (Platform.OS === "web" || typeof Linking.openSettings !== "function") {
      setInfoDialog({
        title: "Ajustes do sistema",
        message: "No navegador, ajuste permissoes diretamente nas configuracoes do site.",
        icon: <SettingsIcon size={18} color={theme.colors.primary} />,
        actions: [{ label: "Entendi" }]
      });
      return;
    }

    await Linking.openSettings();
  }

  function showPanelHelp(panel: Exclude<SettingsPanel, null>) {
    const helpByPanel = {
      compartilhamento:
        "Os anjos recebem dados somente quando houver convite aceito, autorizacao da usuaria e contrato de privacidade. A opcao de ligar 190 junto com o SOS vem desativada por padrao.",
      duracao:
        "Este tempo controla apenas a gravacao local. O chamado de emergencia continua ativo ate a usuaria encerrar pelo botao SOS.",
      encerramento:
        "Quando ativo, o codigo protege o encerramento do SOS e o acesso as areas privadas do app.",
      localizacao:
        "Autorizar localizacao antes da emergencia reduz etapas no momento do acionamento. A permissao pode ser revogada no sistema.",
      login:
        "Use sua conta para proteger convites, anjos e acesso aos arquivos autorizados.",
      atualizacao:
        "A verificacao usa o canal oficial de download do SinalSeguro e informa quando houver uma versao Android mais recente.",
      termos:
        "Termos e privacidade registram consentimento para uso emergencial, anjos autorizados e preservacao dos arquivos.",
      video:
        "O SOS pode gravar video local no aparelho autorizado. A opcao padrao tenta usar as duas cameras; se o aparelho bloquear, o app preserva a camera disponivel."
    } satisfies Record<Exclude<SettingsPanel, null>, string>;

    setInfoDialog({
      title: `Ajuda: ${panelTitle[panel]}`,
      message: helpByPanel[panel],
      icon: <SettingsIcon size={18} color={theme.colors.primary} />,
      actions: [{ label: "Entendi" }]
    });
  }

  const panelTitle = {
    compartilhamento: "Compartilhamento",
    duracao: "Tempo de gravacao",
    encerramento: "Codigo de seguranca",
    localizacao: "Localizacao",
    login: "Login",
    atualizacao: "Atualizacao",
    termos: "Termos e privacidade",
    video: "Video local"
  } satisfies Record<Exclude<SettingsPanel, null>, string>;

  function openMenuRoute(route: EmergencyHomeRoute, panel?: EmergencyHomePanel) {
    setMenuOpen(false);
    if (route === "/arquivos" && panel) {
      router.push({ pathname: "/arquivos", params: { painel: panel } });
      return;
    }
    router.push(route);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell} testID="settings-screen">
        <AppTopBar
          contextLabel="Configuracoes"
          menuIcon="settings"
          menuOpen={menuOpen}
          onMenuPress={() => setMenuOpen((current) => !current)}
          showBack
          showMenu
        />

        {menuOpen ? (
          <>
            <Pressable
              accessibilityLabel="Fechar menu"
              onPress={() => setMenuOpen(false)}
              style={styles.menuBackdrop}
            />
            <EmergencySettingsDrawer onNavigate={openMenuRoute} />
          </>
        ) : null}

        <View style={styles.content}>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<BookOpenCheck size={24} color={theme.colors.primary} />}
              label="Termos"
              description={preferences?.legalConsent.termsAccepted ? "Aceito" : "Revisar"}
              onPress={() => setActivePanel("termos")}
            />
            <ResourceTile
              icon={<UserCircle2 size={24} color={theme.colors.primary} />}
              label="Login"
              description={apiSession?.user?.email ? "Conectado" : "Conta"}
              onPress={() => setActivePanel("login")}
            />
          </View>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<LocateFixed size={24} color={theme.colors.primary} />}
              label="Permissoes"
              description={foregroundStatus === "permitido" ? "Permitido" : foregroundStatus}
              onPress={() => setActivePanel("localizacao")}
            />
            <ResourceTile
              icon={<Clock size={24} color={theme.colors.primary} />}
              label="Gravacao"
              description={preferences ? formatDuration(preferences.defaultDurationSeconds) : "Carregando"}
              onPress={() => setActivePanel("duracao")}
            />
          </View>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<LockKeyhole size={24} color={theme.colors.primary} />}
              label="Codigo de seguranca"
              description={preferences?.finishSafety.requireCode ? "Ativo" : "Configurar"}
              onPress={() => setActivePanel("encerramento")}
            />
            <ResourceTile
              icon={<Video size={24} color={theme.colors.primary} />}
              label="Midia"
              description={
                preferences?.localVideoCapture.requestOnSos
                  ? formatCameraModeLabel(preferences.localVideoCapture.cameraMode)
                  : "Desativada"
              }
              onPress={() => setActivePanel("video")}
            />
          </View>
          <View style={styles.resourceGrid}>
            <ResourceTile
              icon={<MapPin size={24} color={theme.colors.primary} />}
              label="Anjos"
              description="Dados"
              onPress={() => setActivePanel("compartilhamento")}
            />
            <ResourceTile
              icon={<Smartphone size={24} color={theme.colors.primary} />}
              label="Atualizacao"
              description={updateState?.status === "available" ? "Disponivel" : "Verificar"}
              onPress={() => setActivePanel("atualizacao")}
            />
          </View>
        </View>

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<SettingsIcon size={18} color={theme.colors.primary} />}
          helpLabel="Explicar recurso"
          onHelpPress={activePanel ? () => showPanelHelp(activePanel) : undefined}
          onClose={() => setActivePanel(null)}
          title={activePanel ? panelTitle[activePanel] : ""}
          visible={Boolean(activePanel)}
        >
          {activePanel === "termos" ? (
            <View style={styles.dialogStack}>
              {legalConsentItems.map((item) => (
                <View key={item.title} style={styles.consentSummaryItem}>
                  <BookOpenCheck size={18} color={theme.colors.primary} />
                  <View style={styles.consentSummaryText}>
                    <Text style={styles.consentSummaryTitle}>{item.title}</Text>
                    <Text style={styles.consentSummaryBody}>{item.text}</Text>
                  </View>
                </View>
              ))}
              <ButtonIcon
                icon={<ShieldCheck size={18} color={theme.colors.primary} />}
                label={preferences?.legalConsent.privacyAccepted ? "Privacidade aceita localmente" : "Aceitar termos locais"}
                onPress={acceptLegalConsent}
              />
            </View>
          ) : null}

          {activePanel === "login" ? (
            <View style={styles.dialogStack}>
              <View style={[styles.statusPill, apiSession?.user && styles.statusPillActive]}>
                <KeyRound size={18} color={apiSession?.user ? theme.colors.textOnDark : theme.colors.primary} />
                <Text style={[styles.statusPillText, apiSession?.user && styles.statusPillTextActive]}>
                  {apiSession?.user?.email ?? "Conta SinalSeguro desconectada"}
                </Text>
              </View>
              <View style={styles.inlineInfo}>
                <ShieldCheck size={18} color={apiConfig.apiEnabled ? theme.colors.secure : theme.colors.textMuted} />
                <Text style={styles.inlineInfoText}>
                  {apiConfig.apiEnabled && apiConfig.apiBaseUrl
                    ? `API configurada em ${apiConfig.apiBaseUrl}.`
                    : "API SinalSeguro desabilitada neste build."}
                </Text>
              </View>
              <View style={styles.inlineInfo}>
                <LockKeyhole size={18} color={registeredDeviceId ? theme.colors.secure : theme.colors.textMuted} />
                <Text style={styles.inlineInfoText}>
                  {registeredDeviceId
                    ? "Dispositivo autenticado registrado para esta conta."
                    : "Dispositivo sera registrado apos login validado."}
                </Text>
              </View>
              <View style={styles.inlineInfo}>
                <KeyRound
                  size={18}
                  color={googleLoginConfigured ? theme.colors.secure : theme.colors.textMuted}
                />
                <Text style={styles.inlineInfoText}>
                  {googleLoginConfigured
                    ? googleNativePlatform
                      ? `Google Sign-In nativo configurado para ${Platform.OS === "ios" ? "iOS" : "Android"}.`
                      : "Google OIDC configurado para esta plataforma."
                    : "Google ainda nao configurado para esta plataforma."}
                </Text>
              </View>
              {apiSession?.user ? (
                <>
                  <ButtonIcon
                    disabled={loginBusy}
                    icon={<RefreshCw size={18} color={theme.colors.primary} />}
                    label="Validar sessao"
                    onPress={refreshApiSession}
                  />
                  <ButtonIcon
                    disabled={loginBusy}
                    icon={<LockKeyhole size={18} color={theme.colors.danger} />}
                    label="Sair desta conta"
                    onPress={logoutApiSession}
                    style={styles.dangerOption}
                  />
                </>
              ) : (
                <>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>E-mail</Text>
                    <TextInput
                      accessibilityLabel="E-mail SinalSeguro"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect={false}
                      keyboardType="email-address"
                      onChangeText={setLoginEmail}
                      placeholder="conta@sinalseguro.com.br"
                      placeholderTextColor={theme.colors.textMuted}
                      style={styles.textInput}
                      textContentType="emailAddress"
                      value={loginEmail}
                    />
                  </View>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Senha</Text>
                    <TextInput
                      accessibilityLabel="Senha SinalSeguro"
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect={false}
                      onChangeText={setLoginPassword}
                      placeholder="Senha da conta"
                      placeholderTextColor={theme.colors.textMuted}
                      secureTextEntry
                      style={styles.textInput}
                      textContentType="password"
                      value={loginPassword}
                    />
                  </View>
                  <ButtonIcon
                    disabled={loginBusy}
                    icon={<KeyRound size={18} color={theme.colors.primary} />}
                    label={loginBusy ? "Conectando..." : "Entrar com e-mail"}
                    onPress={loginWithEmailPassword}
                  />
                </>
              )}
              <ButtonIcon
                disabled={loginBusy}
                icon={<RefreshCw size={18} color={theme.colors.primary} />}
                label="Testar API"
                onPress={checkApiConnection}
              />
              <ButtonIcon
                disabled={loginBusy}
                icon={<KeyRound size={18} color={theme.colors.primary} />}
                label="Entrar com Google"
                onPress={loginWithGoogle}
                style={googleLoginConfigured ? undefined : styles.disabledOidcOption}
              />
              <ButtonIcon
                disabled={loginBusy || !appleLoginAvailable}
                icon={<KeyRound size={18} color={theme.colors.primary} />}
                label="Entrar com Apple/iCloud"
                onPress={loginWithApple}
                style={appleLoginAvailable ? undefined : styles.disabledOidcOption}
              />
              {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
              {loginNotice ? <Text style={styles.noticeText}>{loginNotice}</Text> : null}
            </View>
          ) : null}

          {activePanel === "localizacao" ? (
            <View style={styles.dialogStack}>
              <PermissionGate
                title="Localizacao do chamado"
                text={
                  servicesEnabled
                    ? "Pode ser pre-autorizada aqui para reduzir atrito no momento do chamado."
                    : "O GPS/localizacao do aparelho esta desativado no sistema."
                }
                status={foregroundStatus}
              />
              <PermissionGate
                title="Segundo plano"
                text="Mantem a localizacao do chamado enquanto a emergencia estiver ativa, quando essa permissao estiver disponivel."
                status={backgroundStatus === "permitido" ? "permitido" : "bloqueado"}
              />
              <ButtonIcon
                icon={<LocateFixed size={18} color={theme.colors.primary} />}
                label="Autorizar localizacao agora"
                onPress={authorizeForegroundLocation}
              />
              <ButtonIcon
                icon={<SettingsIcon size={18} color={theme.colors.primary} />}
                label="Abrir configuracoes do sistema"
                onPress={openSystemSettings}
              />
            </View>
          ) : null}

          {activePanel === "duracao" ? (
            <View style={styles.dialogStack}>
              {durationOptions.map((duration) => (
                <ButtonIcon
                  key={duration}
                  icon={<Clock size={18} color={theme.colors.primary} />}
                  label={formatDuration(duration)}
                  onPress={() => updateDuration(duration)}
                  style={preferences?.defaultDurationSeconds === duration ? styles.selectedOption : undefined}
                />
              ))}
            </View>
          ) : null}

          {activePanel === "encerramento" ? (
            <View style={styles.dialogStack}>
              <View style={[styles.statusPill, preferences?.finishSafety.requireCode && styles.statusPillActive]}>
                <LockKeyhole size={18} color={preferences?.finishSafety.requireCode ? theme.colors.textOnDark : theme.colors.primary} />
                <Text style={[styles.statusPillText, preferences?.finishSafety.requireCode && styles.statusPillTextActive]}>
                  {preferences?.finishSafety.requireCode ? "Codigo habilitado" : "Sem codigo"}
                </Text>
              </View>
              {preferences?.finishSafety.requireCode ? (
                <>
                  <SecurityCodeInput label="Codigo atual" onChangeText={setCurrentFinishCode} value={currentFinishCode} />
                  <SecurityCodeInput label="Novo codigo" onChangeText={setNewFinishCode} value={newFinishCode} />
                  <SecurityCodeInput label="Repetir novo codigo" onChangeText={setRepeatFinishCode} value={repeatFinishCode} />
                  {securityCodeError ? <Text style={styles.errorText}>{securityCodeError}</Text> : null}
                  {securityCodeNotice ? <Text style={styles.noticeText}>{securityCodeNotice}</Text> : null}
                  <ButtonIcon
                    icon={<LockKeyhole size={18} color={theme.colors.primary} />}
                    label="Alterar codigo"
                    onPress={changeSecurityCode}
                  />
                  <ButtonIcon
                    icon={<LockKeyhole size={18} color={theme.colors.danger} />}
                    label="Desativar codigo"
                    onPress={disableSecurityCode}
                    style={styles.dangerOption}
                  />
                </>
              ) : (
                <>
                  <SecurityCodeInput label="Codigo" onChangeText={setNewFinishCode} value={newFinishCode} />
                  <SecurityCodeInput label="Repetir codigo" onChangeText={setRepeatFinishCode} value={repeatFinishCode} />
                  {securityCodeError ? <Text style={styles.errorText}>{securityCodeError}</Text> : null}
                  {securityCodeNotice ? <Text style={styles.noticeText}>{securityCodeNotice}</Text> : null}
                  <ButtonIcon
                    icon={<LockKeyhole size={18} color={theme.colors.primary} />}
                    label="Ativar codigo"
                    onPress={saveNewSecurityCode}
                  />
                </>
              )}
            </View>
          ) : null}

          {activePanel === "compartilhamento" ? (
            <View style={styles.dialogStack}>
              <View style={styles.inlineInfo}>
                <MapPin size={18} color={theme.colors.secure} />
                <Text style={styles.inlineInfoText}>
                  Anjo convidado: {trustedContactsMock[0].name}. {formatTrustedContactStatus(trustedContactsMock[0].status)}.
                </Text>
              </View>
              <ButtonIcon
                disabled
                icon={<PhoneCall size={18} color={theme.colors.primary} />}
                label="Policia sempre na Home"
                style={styles.selectedOption}
              />
              <ButtonIcon
                icon={<PhoneCall size={18} color={theme.colors.primary} />}
                label={
                  preferences?.emergencyPhoneCall.call190OnSosEnabled
                    ? "190 junto com SOS ativo"
                    : "Ligar 190 junto com SOS"
                }
                onPress={toggleCall190OnSos}
                style={preferences?.emergencyPhoneCall.call190OnSosEnabled ? styles.selectedOption : undefined}
              />
              <ButtonIcon
                disabled
                icon={<PhoneCall size={18} color={theme.colors.primary} />}
                label={
                  preferences?.emergencyPhoneCall.callTrustedContactOnAlert
                    ? "Chamada ao anjo aguardando gestao"
                    : "Atalho de anjo desativado"
                }
              />
              <ButtonIcon
                disabled
                icon={<ShieldCheck size={18} color={theme.colors.primary} />}
                label={
                  preferences?.emergencyPhoneCall.allowReceiverCall190
                    ? "Anjo 190 aguardando contrato"
                    : "Anjo 190 bloqueado ate aceite"
                }
              />
              <ButtonIcon
                icon={<Video size={18} color={theme.colors.primary} />}
                label={preferences?.trustedStream.requestedMedia.video ? "Video para anjos solicitado" : "Preparar video para anjos"}
                onPress={() => toggleStreamScope("video")}
              />
              <ButtonIcon
                icon={<Mic size={18} color={theme.colors.primary} />}
                label={preferences?.trustedStream.requestedMedia.audio ? "Audio para anjos solicitado" : "Preparar audio para anjos"}
                onPress={() => toggleStreamScope("audio")}
              />
              <ButtonIcon
                icon={<MapPin size={18} color={theme.colors.primary} />}
                label={
                  preferences?.trustedStream.requestedMedia.locationLive
                    ? "Localizacao ao vivo solicitada"
                    : "Solicitar localizacao ao vivo"
                }
                onPress={() => toggleStreamScope("locationLive")}
              />
              <ButtonIcon
                icon={<LockKeyhole size={18} color={theme.colors.primary} />}
                label={
                  preferences?.trustedStream.allowReceiverEncryptedSave
                    ? "Salvamento no app do anjo solicitado"
                    : "Preparar salvamento no app do anjo"
                }
                onPress={toggleReceiverEncryptedSave}
              />
            </View>
          ) : null}

          {activePanel === "video" ? (
            <View style={styles.dialogStack}>
              <ButtonIcon
                icon={<Video size={18} color={theme.colors.primary} />}
                label={preferences?.localVideoCapture.requestOnSos ? "Video local ativo no SOS" : "Ativar video local no SOS"}
                onPress={toggleLocalVideoRequest}
              />
              <ButtonIcon
                icon={<Mic size={18} color={theme.colors.primary} />}
                label="Autorizar camera e microfone"
                onPress={authorizeMediaPermissions}
              />
              <ButtonIcon
                icon={<Camera size={18} color={theme.colors.primary} />}
                label="Usar camera frontal"
                onPress={() => updateCameraMode("front")}
                style={preferences?.localVideoCapture.cameraMode === "front" ? styles.selectedOption : undefined}
              />
              <ButtonIcon
                icon={<Camera size={18} color={theme.colors.primary} />}
                label="Usar camera traseira"
                onPress={() => updateCameraMode("back")}
                style={preferences?.localVideoCapture.cameraMode === "back" ? styles.selectedOption : undefined}
              />
              <ButtonIcon
                icon={<SwitchCamera size={18} color={theme.colors.primary} />}
                label="Usar duas cameras"
                onPress={() => updateCameraMode("both")}
                style={preferences?.localVideoCapture.cameraMode === "both" ? styles.selectedOption : undefined}
              />
            </View>
          ) : null}

          {activePanel === "atualizacao" ? (
            <View style={styles.dialogStack}>
              <View style={[styles.statusPill, updateState?.status === "current" && styles.statusPillActive]}>
                <Smartphone
                  size={18}
                  color={updateState?.status === "current" ? theme.colors.textOnDark : theme.colors.primary}
                />
                <Text style={[styles.statusPillText, updateState?.status === "current" && styles.statusPillTextActive]}>
                  Instalada {formatAppVersion(updateState?.currentVersion, updateState?.currentVersionCode)}
                </Text>
              </View>
              {updateState?.status === "available" && updateState.latestVersion ? (
                <View style={[styles.statusPill, updateState.status === "available" && styles.availableVersionPill]}>
                  <Download size={18} color={theme.colors.primary} />
                  <Text style={styles.statusPillText}>
                    Disponivel {formatAppVersion(updateState.latestVersion, updateState.latestVersionCode)}
                  </Text>
                </View>
              ) : null}
              <View style={styles.inlineInfo}>
                <ShieldCheck
                  size={18}
                  color={updateState?.status === "available" ? theme.colors.secure : theme.colors.textMuted}
                />
                <Text style={styles.inlineInfoText}>
                  {updateState?.message ?? "Toque em verificar para consultar a versao Android disponivel."}
                </Text>
              </View>
              {updateState?.checkedAt ? (
                <Text style={styles.noticeText}>
                  Ultima verificacao: {new Date(updateState.checkedAt).toLocaleDateString("pt-BR")}
                </Text>
              ) : null}
              <ButtonIcon
                disabled={updateBusy}
                icon={<RefreshCw size={18} color={theme.colors.primary} />}
                label={updateBusy ? "Verificando..." : "Verificar atualizacao"}
                onPress={verifyAppUpdate}
              />
              <ButtonIcon
                disabled={!updateState?.downloadUrl}
                icon={<Smartphone size={18} color={theme.colors.primary} />}
                label="Baixar versao Android"
                onPress={downloadAppUpdate}
                style={updateState?.status === "available" ? styles.selectedOption : undefined}
              />
            </View>
          ) : null}
        </BrandedDialog>

        <BrandedDialog
          actions={infoDialog?.actions ?? []}
          icon={infoDialog?.icon}
          message={infoDialog?.message}
          onClose={() => setInfoDialog(null)}
          title={infoDialog?.title ?? ""}
          visible={Boolean(infoDialog)}
        />

        <ProtectedAccessGate
          message="Informe o codigo para abrir as configuracoes."
          onCancel={() => router.replace("/")}
          onUnlocked={() => setAccessGateVisible(false)}
          preferences={preferences}
          visible={accessReady && accessGateVisible}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  codeInput: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "800",
    minHeight: 52,
    paddingHorizontal: theme.spacing.md
  },
  content: {
    flex: 1,
    gap: theme.spacing.sm,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  consentSummaryBody: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    fontWeight: "700",
    lineHeight: 19
  },
  consentSummaryItem: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.md
  },
  consentSummaryText: {
    flex: 1,
    gap: 2
  },
  consentSummaryTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontWeight: "900",
    lineHeight: 18
  },
  dialogStack: {
    gap: theme.spacing.md
  },
  dangerOption: {
    borderColor: theme.colors.danger,
    borderWidth: 2
  },
  disabledOidcOption: {
    opacity: 0.7
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.typography.small,
    fontWeight: "800"
  },
  fieldGroup: {
    gap: theme.spacing.xs
  },
  fieldLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontWeight: "900"
  },
  inlineInfo: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.md
  },
  inlineInfoText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: theme.typography.small,
    fontWeight: "800",
    lineHeight: 18
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 20
  },
  resourceGrid: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    borderWidth: 2
  },
  textInput: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: "800",
    minHeight: 52,
    paddingHorizontal: theme.spacing.md
  },
  noticeText: {
    color: theme.colors.secure,
    fontSize: theme.typography.small,
    fontWeight: "800"
  },
  shell: {
    backgroundColor: theme.colors.background,
    flex: 1,
    overflow: "hidden"
  },
  statusPill: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 48,
    paddingHorizontal: theme.spacing.md
  },
  statusPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  statusPillText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: theme.typography.body,
    fontWeight: "900"
  },
  statusPillTextActive: {
    color: theme.colors.textOnDark
  },
  availableVersionPill: {
    borderColor: theme.colors.primary,
    borderWidth: 2
  }
});
