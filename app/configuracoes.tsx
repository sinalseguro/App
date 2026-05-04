import { ReactNode, useEffect, useState } from "react";
import { Linking, StyleSheet, Text, TextInput, View } from "react-native";
import { Camera as ExpoCamera } from "expo-camera";
import * as Location from "expo-location";
import * as Crypto from "expo-crypto";
import {
  BookOpenCheck,
  Camera,
  Clock,
  KeyRound,
  LockKeyhole,
  LocateFixed,
  MapPin,
  Mic,
  PhoneCall,
  RefreshCw,
  Settings as SettingsIcon,
  ShieldCheck,
  SwitchCamera,
  UserCircle2,
  Video,
  Volume2
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppTopBar } from "@/components/AppTopBar";
import { BrandedDialog, BrandedDialogAction } from "@/components/BrandedDialog";
import { ButtonIcon } from "@/components/ButtonIcon";
import { PermissionGate } from "@/components/PermissionGate";
import { ResourceTile } from "@/components/ResourceTile";
import { theme } from "@/design/theme";
import { trustedContactsMock } from "@/features/contacts/contactMocks";
import {
  durationOptions,
  EmergencyDurationSeconds,
  EmergencyPreferences,
  formatDuration,
  getEmergencyPreferences,
  LocalVideoCameraMode,
  saveEmergencyPreferences
} from "@/features/emergency/emergencyPreferences";
import { getLocationPermissionReadiness, prepareForegroundLocationPermission } from "@/features/emergency/locationCapture";

type PermissionStatusText = "pendente" | "permitido" | "negado" | "bloqueado";
type SettingsPanel = "duracao" | "encerramento" | "localizacao" | "compartilhamento" | "video" | "atalhos" | "termos" | "login" | null;

type InfoDialog = {
  title: string;
  message: string;
  icon?: ReactNode;
  actions: BrandedDialogAction[];
};

function toPermissionStatus(status: Location.PermissionStatus): PermissionStatusText {
  if (status === Location.PermissionStatus.GRANTED) return "permitido";
  if (status === Location.PermissionStatus.DENIED) return "negado";
  return "pendente";
}

export default function SettingsScreen() {
  const [preferences, setPreferences] = useState<EmergencyPreferences | null>(null);
  const [foregroundStatus, setForegroundStatus] = useState<PermissionStatusText>("pendente");
  const [backgroundStatus, setBackgroundStatus] = useState<PermissionStatusText>("bloqueado");
  const [servicesEnabled, setServicesEnabled] = useState(false);
  const [finishCodeDraft, setFinishCodeDraft] = useState("");
  const [activePanel, setActivePanel] = useState<SettingsPanel>(null);
  const [infoDialog, setInfoDialog] = useState<InfoDialog | null>(null);
  const [statusText, setStatusText] = useState("Carregando preferencias de emergencia...");

  async function refreshReadiness() {
    const readiness = await getLocationPermissionReadiness();
    setForegroundStatus(toPermissionStatus(readiness.foreground));
    setBackgroundStatus(toPermissionStatus(readiness.background));
    setServicesEnabled(readiness.servicesEnabled);
  }

  async function loadSettings() {
    const nextPreferences = await getEmergencyPreferences();
    setPreferences(nextPreferences);
    await refreshReadiness();
    setStatusText("Preferencias carregadas. As permissoes concedidas serao reutilizadas nos proximos chamados.");
  }

  useEffect(() => {
    void loadSettings();
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

  async function toggleCall190Shortcut() {
    if (!preferences) return;

    const enabled = !preferences.emergencyPhoneCall.call190ShortcutEnabled;
    await updatePreferences(
      {
        ...preferences,
        emergencyPhoneCall: {
          ...preferences.emergencyPhoneCall,
          call190ShortcutEnabled: enabled
        }
      },
      enabled ? "Atalho Policia 190 ativo na Home." : "Atalho Policia 190 removido da Home."
    );
  }

  async function toggleTrustedContactCall() {
    if (!preferences) return;

    const enabled = !preferences.emergencyPhoneCall.callTrustedContactOnAlert;
    await updatePreferences(
      {
        ...preferences,
        emergencyPhoneCall: {
          ...preferences.emergencyPhoneCall,
          callTrustedContactOnAlert: enabled
        }
      },
      enabled
        ? "Preferencia futura marcada. Ligacao ao anjo exige contato validado, contrato e confirmacao."
        : "Preferencia futura de chamada ao anjo desmarcada."
    );
  }

  async function toggleReceiverCall190() {
    if (!preferences) return;

    const enabled = !preferences.emergencyPhoneCall.allowReceiverCall190;
    await updatePreferences(
      {
        ...preferences,
        emergencyPhoneCall: {
          ...preferences.emergencyPhoneCall,
          allowReceiverCall190: enabled
        },
        trustedStream: {
          ...preferences.trustedStream,
          allowReceiverRelayTo190: enabled
        }
      },
      enabled
        ? "Preferencia futura marcada para o anjo acionar 190 com dados autorizados dentro do SinalSeguro."
        : "Permissao futura para anjo acionar 190 foi desmarcada."
    );
  }

  async function toggleFinishSafetyCode() {
    if (!preferences) return;

    const enabled = !preferences.finishSafety.requireCode;
    if (enabled) {
      setStatusText("Digite um novo codigo e toque em Salvar codigo para ativar o encerramento protegido.");
      return;
    }

    await updatePreferences(
      {
        ...preferences,
        finishSafety: {
          ...preferences.finishSafety,
          requireCode: false
        }
      },
      "Codigo de encerramento desativado. Finalizacao volta a exigir apenas confirmacao."
    );
  }

  async function saveFinishCode() {
    if (!preferences) return;

    const normalizedCode = finishCodeDraft.trim();
    if (normalizedCode.length < 4) {
      setStatusText("Use um codigo de encerramento com pelo menos 4 caracteres.");
      return;
    }

    const codeHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, normalizedCode.slice(0, 12));
    await updatePreferences(
      {
        ...preferences,
        finishSafety: {
          requireCode: true,
          codeHash
        }
      },
      "Codigo de encerramento salvo como hash local. O codigo nao entra em logs, URLs, push ou pacote de evidencia."
    );
    setFinishCodeDraft("");
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
      enabled
        ? "Escopo solicitado para contrato futuro. Streaming real segue bloqueado neste build publico."
        : "Escopo removido das preferencias locais."
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
        ? "Preferencia futura marcada: anjo autorizado podera salvar copia criptografada dentro do app."
        : "Salvamento criptografado pelo anjo foi desmarcado."
    );
  }

  async function updateCameraMode(cameraMode: LocalVideoCameraMode) {
    if (!preferences) return;

    const cameraLabel =
      cameraMode === "front"
        ? "frontal"
        : cameraMode === "back"
          ? "traseira"
          : "ambas solicitadas para homologacao nativa";

    await updatePreferences(
      {
        ...preferences,
        localVideoCapture: {
          ...preferences.localVideoCapture,
          cameraMode,
          status: "enabled_local"
        }
      },
      `Camera ${cameraLabel} definida para a proxima gravacao local.`
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
        ? "Video local sera solicitado quando o SOS iniciar, com permissao explicita de camera e microfone."
        : "Video local desativado para o proximo SOS."
    );
  }

  async function authorizeMediaPermissions() {
    const cameraPermission = await ExpoCamera.requestCameraPermissionsAsync();
    const microphonePermission = await ExpoCamera.requestMicrophonePermissionsAsync();
    setStatusText(
      cameraPermission.granted && microphonePermission.granted
        ? "Camera e microfone autorizados. O proximo SOS pode gravar midia local no sandbox do app."
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
      "Aceites locais registrados para homologacao. O aceite juridico definitivo sera versionado pela API."
    );
  }

  async function openSystemSettings() {
    await Linking.openSettings();
  }

  function showOidcPlan(provider: "Google" | "Apple/iCloud") {
    setInfoDialog({
      title: `Login ${provider}`,
      message:
        "Fluxo preparado para OIDC via API. A configuracao real de client_id, redirect URI e chaves fica fora do Git e sera feita na etapa de backend/lojas, sem armazenar credenciais no app.",
      icon: <KeyRound size={18} color={theme.colors.primary} />,
      actions: [{ label: "Entendi" }]
    });
  }

  const panelTitle = {
    atalhos: "Atalhos",
    compartilhamento: "Compartilhamento",
    duracao: "Tempo de gravacao",
    encerramento: "Encerramento seguro",
    localizacao: "Localizacao",
    login: "Login",
    termos: "Termos e privacidade",
    video: "Video local"
  } satisfies Record<Exclude<SettingsPanel, null>, string>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell} testID="settings-screen">
        <AppTopBar contextLabel="Configuracoes" showBack />

        <View style={styles.content}>
          <View style={styles.statusPill}>
            <View style={styles.statusIcon}>
              <SettingsIcon size={20} color={theme.colors.secure} />
            </View>
            <View style={styles.statusCopy}>
              <Text style={styles.statusTitle}>Configuracoes</Text>
              <Text style={styles.statusText} numberOfLines={2}>
                {statusText}
              </Text>
            </View>
          </View>

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
              description="Google/Apple"
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
              label="Encerrar"
              description={preferences?.finishSafety.requireCode ? "Codigo" : "Livre"}
              onPress={() => setActivePanel("encerramento")}
            />
            <ResourceTile
              icon={<Video size={24} color={theme.colors.primary} />}
              label="Midia"
              description={preferences?.localVideoCapture.requestOnSos ? "Ativa local" : "Desativada"}
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
              icon={<Volume2 size={24} color={theme.colors.primary} />}
              label="Atalhos"
              description="Volume futuro"
              onPress={() => setActivePanel("atalhos")}
            />
          </View>
        </View>

        <BrandedDialog
          actions={[{ label: "Fechar", tone: "muted" }]}
          icon={<SettingsIcon size={18} color={theme.colors.primary} />}
          message="Configuracoes por modais para manter a tela principal fixa, simples e acionavel."
          onClose={() => setActivePanel(null)}
          title={activePanel ? panelTitle[activePanel] : ""}
          visible={Boolean(activePanel)}
        >
          {activePanel === "termos" ? (
            <View style={styles.dialogStack}>
              <Text style={styles.dialogText}>
                O uso de dados de emergencia exige aceite de termos, politica de privacidade e autorizacao especifica de
                compartilhamento com anjos vinculados. O aceite definitivo sera versionado no backend.
              </Text>
              <ButtonIcon
                icon={<ShieldCheck size={18} color={theme.colors.primary} />}
                label={preferences?.legalConsent.privacyAccepted ? "Privacidade aceita localmente" : "Aceitar termos locais"}
                onPress={acceptLegalConsent}
              />
            </View>
          ) : null}

          {activePanel === "login" ? (
            <View style={styles.dialogStack}>
              <Text style={styles.dialogText}>
                Login proprio, Google e Apple/iCloud entram por OIDC na API. Nenhuma chave, client secret ou credencial deve
                ser salva em Git, memoria ou bundle publico.
              </Text>
              <ButtonIcon
                icon={<KeyRound size={18} color={theme.colors.primary} />}
                label="Preparar login Google"
                onPress={() => showOidcPlan("Google")}
              />
              <ButtonIcon
                icon={<KeyRound size={18} color={theme.colors.primary} />}
                label="Preparar login Apple/iCloud"
                onPress={() => showOidcPlan("Apple/iCloud")}
              />
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
                text="No build publico, localizacao em segundo plano fica bloqueada. Homologacao futura exige foreground service, permissao especifica, notificacao persistente e revisao juridica."
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
              <Text style={styles.dialogText}>
                Define por quanto tempo a gravacao local fica ativa. O chamado de emergencia nao encerra sozinho:
                ele continua ate a usuaria finalizar pelo botao.
              </Text>
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
              <Text style={styles.dialogText}>
                Opcional e desativado por padrao. Quando ativo, o SOS so encerra o chamado depois do gesto e do codigo local.
              </Text>
              <ButtonIcon
                icon={<LockKeyhole size={18} color={theme.colors.primary} />}
                label={preferences?.finishSafety.requireCode ? "Codigo ativo" : "Ativar codigo"}
                onPress={toggleFinishSafetyCode}
              />
              <TextInput
                accessibilityLabel="Novo codigo de encerramento"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="number-pad"
                maxLength={12}
                onChangeText={setFinishCodeDraft}
                placeholder="Novo codigo"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
                style={styles.codeInput}
                value={finishCodeDraft}
              />
              <ButtonIcon
                icon={<LockKeyhole size={18} color={theme.colors.primary} />}
                label="Salvar codigo"
                onPress={saveFinishCode}
              />
            </View>
          ) : null}

          {activePanel === "compartilhamento" ? (
            <View style={styles.dialogStack}>
              <Text style={styles.dialogText}>
                Audio, video e localizacao em tempo real exigem contrato eletronico bilateral, backend, criptografia,
                auditoria e homologacao.
              </Text>
              <View style={styles.inlineInfo}>
                <MapPin size={18} color={theme.colors.secure} />
                <Text style={styles.inlineInfoText}>
                  Anjo convidado: {trustedContactsMock[0].name}. Status atual: {trustedContactsMock[0].status}.
                </Text>
              </View>
              <ButtonIcon
                icon={<PhoneCall size={18} color={theme.colors.primary} />}
                label={preferences?.emergencyPhoneCall.call190ShortcutEnabled ? "Atalho 190 ativo" : "Ativar atalho 190"}
                onPress={toggleCall190Shortcut}
              />
              <ButtonIcon
                icon={<PhoneCall size={18} color={theme.colors.primary} />}
                label={
                  preferences?.emergencyPhoneCall.callTrustedContactOnAlert
                    ? "Chamada ao anjo marcada"
                    : "Ativar chamada ao anjo"
                }
                onPress={toggleTrustedContactCall}
              />
              <ButtonIcon
                icon={<ShieldCheck size={18} color={theme.colors.primary} />}
                label={
                  preferences?.emergencyPhoneCall.allowReceiverCall190
                    ? "Anjo pode acionar 190 futuro"
                    : "Permitir anjo acionar 190 futuro"
                }
                onPress={toggleReceiverCall190}
              />
              <ButtonIcon
                icon={<Video size={18} color={theme.colors.primary} />}
                label={preferences?.trustedStream.requestedMedia.video ? "Video solicitado" : "Solicitar video futuro"}
                onPress={() => toggleStreamScope("video")}
              />
              <ButtonIcon
                icon={<Mic size={18} color={theme.colors.primary} />}
                label={preferences?.trustedStream.requestedMedia.audio ? "Audio solicitado" : "Solicitar audio futuro"}
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
                    ? "Anjo salva criptografado futuro"
                    : "Permitir salvamento criptografado futuro"
                }
                onPress={toggleReceiverEncryptedSave}
              />
            </View>
          ) : null}

          {activePanel === "video" ? (
            <View style={styles.dialogStack}>
              <Text style={styles.dialogText}>
                Habilita o SOS para gravar video e audio localmente no sandbox privado do app. O envio para anjos/API
                continua bloqueado ate backend, contrato, chaves e auditoria. A opcao ambas registra a preferencia, mas
                captura dupla simultanea exige modulo nativo homologado.
              </Text>
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
                label="Camera frontal"
                onPress={() => updateCameraMode("front")}
                style={preferences?.localVideoCapture.cameraMode === "front" ? styles.selectedOption : undefined}
              />
              <ButtonIcon
                icon={<Camera size={18} color={theme.colors.primary} />}
                label="Camera traseira"
                onPress={() => updateCameraMode("back")}
                style={preferences?.localVideoCapture.cameraMode === "back" ? styles.selectedOption : undefined}
              />
              <ButtonIcon
                icon={<SwitchCamera size={18} color={theme.colors.primary} />}
                label="Ambas (homologar)"
                onPress={() => updateCameraMode("both")}
                style={preferences?.localVideoCapture.cameraMode === "both" ? styles.selectedOption : undefined}
              />
            </View>
          ) : null}

          {activePanel === "atalhos" ? (
            <View style={styles.dialogStack}>
              <Text style={styles.dialogText}>
                Botao de volume com tela travada segue como pesquisa nativa. O MVP nao usa acessibilidade, overlay ou captura
                indevida de botoes do sistema.
              </Text>
              <PermissionGate
                title="Atalho por botao de volume"
                text="Pesquisa futura nativa. Precisa validar limites Android/iOS, foreground service e politicas de loja."
                status="bloqueado"
              />
              <ButtonIcon icon={<RefreshCw size={18} color={theme.colors.primary} />} label="Atualizar permissoes" onPress={loadSettings} />
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
  dialogStack: {
    gap: theme.spacing.md
  },
  dialogText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 22
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
  shell: {
    backgroundColor: theme.colors.background,
    flex: 1,
    overflow: "hidden"
  },
  statusPill: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 56,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadow
  },
  statusCopy: {
    flex: 1,
    gap: 2
  },
  statusIcon: {
    alignItems: "center",
    backgroundColor: "rgba(20, 184, 166, 0.12)",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  statusText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
    fontWeight: "700",
    lineHeight: 17
  },
  statusTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontWeight: "800",
    textTransform: "uppercase"
  }
});
