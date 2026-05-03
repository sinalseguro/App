import { ReactNode, useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { Linking, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { Activity, HelpCircle, LockKeyhole, PhoneCall } from "lucide-react-native";
import * as Crypto from "expo-crypto";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandBackground } from "@/components/BrandBackground";
import { BrandedDialog, BrandedDialogAction } from "@/components/BrandedDialog";
import { PanicButton } from "@/components/PanicButton";
import { theme } from "@/design/theme";
import { EmergencyCallDock } from "@/features/emergency-home/EmergencyCallDock";
import { EmergencyCallTarget } from "@/features/emergency-home/EmergencyCallTarget";
import { EmergencySettingsDrawer } from "@/features/emergency-home/EmergencySettingsDrawer";
import { EmergencyTopBar } from "@/features/emergency-home/EmergencyTopBar";
import { EmergencyHomeRoute } from "@/features/emergency-home/routes";
import { countPendingEmergencyPackages } from "@/features/emergency/emergencyOutbox";
import { EmergencyMediaRecorder } from "@/features/emergency/EmergencyMediaRecorder";
import {
  finishEmergencyPackage,
  getActiveEmergencyPackage,
  startEmergencyPackage
} from "@/features/emergency/emergencyRecorder";
import {
  defaultEmergencyPreferences,
  EmergencyPreferences,
  formatDuration,
  getEmergencyPreferences
} from "@/features/emergency/emergencyPreferences";

type HomeDialog = {
  title: string;
  message: string;
  icon?: ReactNode;
  actions: BrandedDialogAction[];
};

export default function HomeScreen() {
  const [outboxCount, setOutboxCount] = useState(0);
  const [activePackageId, setActivePackageId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<EmergencyPreferences>(defaultEmergencyPreferences);
  const [menuOpen, setMenuOpen] = useState(false);
  const [finishCodeInput, setFinishCodeInput] = useState("");
  const [finishConfirmationOpen, setFinishConfirmationOpen] = useState(false);
  const [finishError, setFinishError] = useState("");
  const [dialog, setDialog] = useState<HomeDialog | null>(null);
  const [recordingStatus, setRecordingStatus] = useState(
    "Pronto para preservar um chamado local com horario, consentimento e localizacao pontual autorizada."
  );

  async function refreshOutboxCount() {
    const activePackage = await getActiveEmergencyPackage();
    setActivePackageId(activePackage?.id ?? null);
    setOutboxCount(await countPendingEmergencyPackages());
  }

  function openRoute(route: EmergencyHomeRoute) {
    setMenuOpen(false);
    router.push(route);
  }

  function confirmEmergencyCall(target: EmergencyCallTarget) {
    setDialog({
      title: `Ligar para ${target.description}?`,
      message: "O SinalSeguro abre o discador do telefone. O atendimento e a ligacao continuam pelos canais oficiais.",
      icon: <PhoneCall size={18} color={theme.colors.primary} />,
      actions: [
        { label: "Cancelar", tone: "muted" },
        {
          label: "Ligar",
          onPress: () => {
            void Linking.openURL(target.callUri);
          }
        }
      ]
    });
  }

  function openModeHelp() {
    setDialog({
      title: "Modo discreto",
      message:
        "A tela principal reduz textos sensiveis e prioriza o gesto do SOS, contatos oficiais e acesso rapido ao cofre. O modo nao oculta gravacoes nem burla regras do sistema.",
      icon: <HelpCircle size={18} color={theme.colors.primary} />,
      actions: [{ label: "Entendi" }]
    });
  }

  function openModeOptions() {
    setDialog({
      title: "Opcoes de modo",
      message:
        "Neste MVP o modo padrao e discreto. Outros modos dependem de testes com usuarias, revisao juridica e criterios de loja antes de virar configuracao publica.",
      icon: <Activity size={18} color={theme.colors.primary} />,
      actions: [
        { label: "Manter discreto" },
        { label: "Ver configuracoes", tone: "muted", onPress: () => router.push("/configuracoes") }
      ]
    });
  }

  useFocusEffect(
    useCallback(() => {
      async function prepareScreen() {
        const nextPreferences = await getEmergencyPreferences();
        setPreferences(nextPreferences);
        await refreshOutboxCount();
      }

      void prepareScreen();
    }, [])
  );

  async function handlePanicTrigger() {
    setMenuOpen(false);

    if (activePackageId) {
      requestFinishActiveCall();
      return;
    }

    setRecordingStatus(
      Platform.OS === "web"
        ? "Iniciando chamado local de simulador sem captura real de localizacao..."
        : "Iniciando chamado local e capturando localizacao pontual..."
    );

    try {
      const result = await startEmergencyPackage({
        kind: "test",
        trustedContactIds: [],
        captureLocation: Platform.OS !== "web",
        defaultDurationSeconds: preferences.defaultDurationSeconds,
        locationConsentMode:
          preferences.locationMode === "foreground_pre_authorized"
            ? "foreground_pre_authorized"
            : "foreground_when_triggered"
      });
      await refreshOutboxCount();

      const locationText =
        result.packageRecord.location.status === "captured"
          ? "localizacao registrada"
          : `localizacao ${result.packageRecord.location.status}`;

      setRecordingStatus(
        `Chamado ${result.packageRecord.id.slice(0, 8)} ativo ate encerramento manual; gravacao ${formatDuration(preferences.defaultDurationSeconds)}; ${locationText}; envio externo indisponivel neste build.`
      );
    } catch {
      setActivePackageId(null);
      setRecordingStatus("Falha controlada ao preservar o chamado local. Tente novamente e use os canais oficiais.");
      setDialog({
        title: "Chamado nao preservado",
        message:
          "Nao foi possivel salvar o pacote local com seguranca neste dispositivo. Use 190, 193 ou 192 em risco imediato.",
        icon: <LockKeyhole size={18} color={theme.colors.danger} />,
        actions: [{ label: "Entendi", tone: "danger" }]
      });
    }
  }

  function requestFinishActiveCall() {
    if (!activePackageId) return;

    setFinishError("");
    setFinishCodeInput("");

    if (preferences.finishSafety.requireCode) {
      setFinishConfirmationOpen(true);
      return;
    }

    setDialog({
      title: "Encerrar chamado ativo?",
      message: "O pacote sera encerrado e preservado no cofre local deste dispositivo. Nenhuma evidencia sera apagada.",
      icon: <LockKeyhole size={18} color={theme.colors.primary} />,
      actions: [
        { label: "Cancelar", tone: "muted" },
        {
          label: "Encerrar",
          tone: "danger",
          onPress: () => {
            void handleFinishActiveCall();
          }
        }
      ]
    });
  }

  async function handleFinishActiveCall() {
    if (!activePackageId) return;

    setRecordingStatus("Finalizando chamado local...");
    const result = await finishEmergencyPackage(activePackageId, "manual_finish");
    await refreshOutboxCount();

    if (!result) {
      setRecordingStatus("Nenhum chamado ativo encontrado para finalizar.");
      return;
    }

    setRecordingStatus(
      `Chamado ${result.packageRecord.id.slice(0, 8)} finalizado e preservado somente no cofre local deste dispositivo.`
    );
    setFinishConfirmationOpen(false);
    setFinishCodeInput("");
    setFinishError("");
  }

  async function confirmFinishWithCode() {
    if (!preferences.finishSafety.requireCode) {
      void handleFinishActiveCall();
      return;
    }

    const codeHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, finishCodeInput.trim());

    if (codeHash !== preferences.finishSafety.codeHash) {
      setFinishError("Codigo incorreto. O chamado continua ativo.");
      return;
    }

    void handleFinishActiveCall();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.homeShell} testID="home-emergency-screen">
        <EmergencyTopBar
          active={Boolean(activePackageId)}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((current) => !current)}
        />

        {menuOpen ? (
          <EmergencySettingsDrawer
            active={Boolean(activePackageId)}
            onOpenModeHelp={openModeHelp}
            onOpenModeOptions={openModeOptions}
            onNavigate={openRoute}
            outboxCount={outboxCount}
            recordingStatus={recordingStatus}
          />
        ) : null}

        <View style={styles.emergencySurface}>
          <BrandBackground active={Boolean(activePackageId)} />
          <EmergencyMediaRecorder
            activePackageId={activePackageId}
            preferences={preferences}
            onMediaAttached={refreshOutboxCount}
            onStatusChange={setRecordingStatus}
          />
          <View style={styles.panicStage}>
            <PanicButton
              active={Boolean(activePackageId)}
              label={activePackageId ? "Segurar para encerrar" : "Segurar para acionar"}
              holdMs={preferences.inAppHoldMs}
              onTrigger={handlePanicTrigger}
            />
          </View>

          <EmergencyCallDock
            onCallTarget={confirmEmergencyCall}
            showPoliceShortcut={preferences.emergencyPhoneCall.call190ShortcutEnabled}
          />
        </View>

        <BrandedDialog
          actions={[
            {
              label: "Manter ativo",
              tone: "muted",
              onPress: () => setFinishConfirmationOpen(false)
            },
            {
              autoClose: false,
              label: "Encerrar chamado",
              tone: "danger",
              onPress: () => {
                void confirmFinishWithCode();
              }
            }
          ]}
          icon={<LockKeyhole size={18} color={theme.colors.primary} />}
          message="O codigo de seguranca impede encerramento nao autorizado caso outra pessoa tome o aparelho."
          onClose={() => setFinishConfirmationOpen(false)}
          title="Confirmar encerramento"
          visible={finishConfirmationOpen}
        >
          <TextInput
            accessibilityLabel="Codigo para encerrar chamado"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            onChangeText={setFinishCodeInput}
            placeholder="Codigo de encerramento"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            style={styles.codeInput}
            value={finishCodeInput}
          />
          {finishError ? <Text style={styles.finishError}>{finishError}</Text> : null}
        </BrandedDialog>
        <BrandedDialog
          actions={dialog?.actions ?? []}
          icon={dialog?.icon}
          message={dialog?.message}
          onClose={() => setDialog(null)}
          title={dialog?.title ?? ""}
          visible={Boolean(dialog)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1
  },
  homeShell: {
    backgroundColor: theme.colors.background,
    flex: 1,
    overflow: "hidden"
  },
  emergencySurface: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md
  },
  panicStage: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 0,
    width: "100%"
  },
  closeButton: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36
  },
  codeInput: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0,
    minHeight: 52,
    paddingHorizontal: theme.spacing.md
  },
  finishError: {
    color: theme.colors.danger,
    fontSize: theme.typography.small,
    fontWeight: "800",
    lineHeight: 18
  }
});
