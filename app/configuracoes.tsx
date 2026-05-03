import { useEffect, useState } from "react";
import { Linking, StyleSheet, Text, TextInput, View } from "react-native";
import * as Location from "expo-location";
import * as Crypto from "expo-crypto";
import {
  Clock,
  Camera,
  LockKeyhole,
  LocateFixed,
  MapPin,
  Mic,
  PhoneCall,
  RefreshCw,
  Settings as SettingsIcon,
  ShieldCheck,
  SwitchCamera,
  Video,
  Volume2
} from "lucide-react-native";
import { ButtonIcon } from "@/components/ButtonIcon";
import { PermissionGate } from "@/components/PermissionGate";
import { SafeScreen } from "@/components/SafeScreen";
import { StatusBanner } from "@/components/StatusBanner";
import { theme } from "@/design/theme";
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
    setStatusText("Preferencias carregadas. A permissao ja concedida sera reutilizada nos proximos chamados.");
  }

  useEffect(() => {
    void loadSettings();
  }, []);

  async function updateDuration(defaultDurationSeconds: EmergencyDurationSeconds) {
    if (!preferences) return;

    const nextPreferences = {
      ...preferences,
      defaultDurationSeconds
    };
    await saveEmergencyPreferences(nextPreferences);
    setPreferences(nextPreferences);
    setStatusText(`Duracao padrao definida para ${formatDuration(defaultDurationSeconds)}.`);
  }

  async function updatePreferences(nextPreferences: EmergencyPreferences, message: string) {
    await saveEmergencyPreferences(nextPreferences);
    setPreferences(nextPreferences);
    setStatusText(message);
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
      enabled
        ? "Atalho 190 ativo. A ligacao sempre exige confirmacao da usuaria."
        : "Atalho 190 desativado nas preferencias."
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
        ? "Preferencia futura marcada para analise. Ligacao real exige contato validado, contrato e confirmacao."
        : "Preferencia futura de chamada ao anjo desmarcada."
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
      "Codigo de encerramento atualizado como hash local. O codigo nao entra em logs, URLs, push ou pacote de evidencia."
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

  async function updateCameraMode(cameraMode: LocalVideoCameraMode) {
    if (!preferences) return;

    await updatePreferences(
      {
        ...preferences,
        localVideoCapture: {
          ...preferences.localVideoCapture,
          cameraMode,
          status: "public_build_blocked"
        }
      },
      "Preferencia de camera registrada para homologacao. O build publico nao solicita camera nem microfone."
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
          status: "public_build_blocked"
        }
      },
      requestOnSos
        ? "Solicitacao futura marcada. Video local real segue bloqueado ate RIPD/DPIA, termos e homologacao controlada."
        : "Solicitacao futura de video local desmarcada."
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

  async function openSystemSettings() {
    await Linking.openSettings();
  }

  return (
    <SafeScreen
      title="Configuracoes"
      subtitle="Permissoes sao incrementais, explicadas e revogaveis."
    >
      <StatusBanner tone="secure" title="Agilidade no chamado" text={statusText} />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Clock size={20} color={theme.colors.primary} />
          <Text style={styles.cardTitle}>Duracao padrao do chamado</Text>
        </View>
        <Text style={styles.text}>
          Define por quanto tempo o pacote local permanece ativo antes do encerramento automatico. A usuaria pode finalizar antes.
        </Text>
        <View style={styles.optionGrid}>
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
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <LockKeyhole size={20} color={theme.colors.primary} />
          <Text style={styles.cardTitle}>Seguranca para encerrar</Text>
        </View>
        <Text style={styles.text}>
          Opcional e desativado por padrao. Quando ativo, o SOS so encerra o chamado depois do gesto e do codigo local.
        </Text>
        <ButtonIcon
          icon={<LockKeyhole size={18} color={theme.colors.primary} />}
          label={preferences?.finishSafety.requireCode ? "Codigo ativo" : "Ativar codigo"}
          onPress={toggleFinishSafetyCode}
        />
        <View style={styles.codeBlock}>
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
      </View>

      <PermissionGate
        title="Localizacao do chamado"
        text={
          servicesEnabled
            ? "Pode ser pre-autorizada aqui para reduzir atrito no momento do chamado."
            : "O GPS/localizacao do aparelho esta desativado no sistema."
        }
        status={foregroundStatus}
      />
      <ButtonIcon
        icon={<LocateFixed size={20} color={theme.colors.primary} />}
        label="Autorizar localizacao agora"
        onPress={authorizeForegroundLocation}
      />
      <ButtonIcon
        icon={<SettingsIcon size={20} color={theme.colors.primary} />}
        label="Abrir configuracoes do sistema"
        onPress={openSystemSettings}
      />

      <PermissionGate
        title="Segundo plano"
        text="No build publico, localizacao em segundo plano fica bloqueada. Homologacao futura exige foreground service, permissao especifica, notificacao persistente e revisao juridica."
        status={backgroundStatus === "permitido" ? "permitido" : "bloqueado"}
      />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ShieldCheck size={20} color={theme.colors.primary} />
          <Text style={styles.cardTitle}>Compartilhamento interno futuro</Text>
        </View>
        <Text style={styles.text}>
          Audio, video e localizacao em tempo real exigem contrato eletronico bilateral, backend, criptografia, auditoria e homologacao.
        </Text>
        <ButtonIcon
          icon={<PhoneCall size={18} color={theme.colors.primary} />}
          label={preferences?.emergencyPhoneCall.call190ShortcutEnabled ? "Atalho 190 ativo" : "Ativar atalho 190"}
          onPress={toggleCall190Shortcut}
        />
        <ButtonIcon
          icon={<PhoneCall size={18} color={theme.colors.primary} />}
          label={
            preferences?.emergencyPhoneCall.callTrustedContactOnAlert
              ? "Preferencia futura marcada"
              : "Ativar chamada ao anjo"
          }
          onPress={toggleTrustedContactCall}
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
              ? "Localizacao em tempo real solicitada"
              : "Solicitar localizacao em tempo real"
          }
          onPress={() => toggleStreamScope("locationLive")}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Camera size={20} color={theme.colors.primary} />
          <Text style={styles.cardTitle}>Video local em homologacao</Text>
        </View>
        <Text style={styles.text}>
          Prepara a preferencia para o SOS gravar video local criptografado quando a trilha juridica e tecnica liberar. Este build publico nao pede permissao de camera ou microfone.
        </Text>
        <ButtonIcon
          icon={<Video size={18} color={theme.colors.primary} />}
          label={preferences?.localVideoCapture.requestOnSos ? "Solicitacao marcada" : "Solicitar video no SOS futuro"}
          onPress={toggleLocalVideoRequest}
        />
        <View style={styles.optionGrid}>
          <ButtonIcon
            icon={<Camera size={18} color={theme.colors.primary} />}
            label="Frontal"
            onPress={() => updateCameraMode("front")}
            style={preferences?.localVideoCapture.cameraMode === "front" ? styles.selectedOption : undefined}
          />
          <ButtonIcon
            icon={<Camera size={18} color={theme.colors.primary} />}
            label="Traseira"
            onPress={() => updateCameraMode("back")}
            style={preferences?.localVideoCapture.cameraMode === "back" ? styles.selectedOption : undefined}
          />
          <ButtonIcon
            icon={<SwitchCamera size={18} color={theme.colors.primary} />}
            label="Ambas"
            onPress={() => updateCameraMode("both")}
            style={preferences?.localVideoCapture.cameraMode === "both" ? styles.selectedOption : undefined}
          />
        </View>
      </View>

      <PermissionGate
        title="Atalho por botao de volume"
        text="Pesquisa futura nativa. O MVP nao promete acionamento por volume com tela travada porque Android/iOS limitam esse uso."
        status="bloqueado"
      />
      <ButtonIcon
        icon={<Volume2 size={20} color={theme.colors.primary} />}
        label="Ver status dos atalhos"
        onPress={() =>
          setStatusText("Atalho fisico permanece em pesquisa: sem uso de acessibilidade, overlay ou captura indevida de botoes do sistema.")
        }
      />

      <ButtonIcon
        icon={<RefreshCw size={20} color={theme.colors.primary} />}
        label="Atualizar permissoes"
        onPress={loadSettings}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  cardTitle: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "800"
  },
  codeBlock: {
    gap: theme.spacing.sm
  },
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
  optionGrid: {
    gap: theme.spacing.sm
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    borderWidth: 2
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 21
  }
});
