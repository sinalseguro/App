import { ReactNode, useCallback, useRef, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { useKeepAwake } from "expo-keep-awake";
import { Linking, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LockKeyhole, PhoneCall } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandBackground } from "@/components/BrandBackground";
import { BrandedDialog, BrandedDialogAction } from "@/components/BrandedDialog";
import { PanicButton } from "@/components/PanicButton";
import { theme } from "@/design/theme";
import { EmergencyCallDock } from "@/features/emergency-home/EmergencyCallDock";
import { EmergencyCallTarget } from "@/features/emergency-home/EmergencyCallTarget";
import { EmergencySettingsDrawer } from "@/features/emergency-home/EmergencySettingsDrawer";
import { EmergencyTopBar } from "@/features/emergency-home/EmergencyTopBar";
import { EmergencyHomePanel, EmergencyHomeRoute } from "@/features/emergency-home/routes";
import { CameraCaptureResidueCleaner } from "@/features/emergency/CameraCaptureResidueCleaner";
import { countPendingEmergencyPackages } from "@/features/emergency/emergencyOutbox";
import { EmergencyMediaRecorder, MediaStopRequestResult } from "@/features/emergency/EmergencyMediaRecorder";
import {
  finishEmergencyPackage,
  getActiveEmergencyPackage,
  startEmergencyPackage
} from "@/features/emergency/emergencyRecorder";
import { appendMediaOperationalLog } from "@/features/emergency/MediaOperationalLog";
import {
  defaultEmergencyPreferences,
  EmergencyPreferences,
  formatDuration,
  getEmergencyPreferences
} from "@/features/emergency/emergencyPreferences";
import { isProtectedAccessUnlocked, unlockProtectedAccess, verifySecurityCodeStatus } from "@/security/protectedAccess";

type HomeDialog = {
  title: string;
  message: string;
  icon?: ReactNode;
  children?: ReactNode;
  actions: BrandedDialogAction[];
};

type ProtectedRouteRequest = {
  panel?: EmergencyHomePanel;
  route: EmergencyHomeRoute;
};

type PendingMediaStopRequest = {
  resolve: (result: MediaStopRequestResult) => void;
  serial: number;
  timeout: ReturnType<typeof setTimeout>;
};

const mediaStopWaitTimeoutMs = 30000;

function EmergencyRecordingWakeLock() {
  useKeepAwake("sinalseguro.emergency-recording", { suppressDeactivateWarnings: true });
  return null;
}

function CallNumberHero({ onPress, target }: { onPress: () => void; target: EmergencyCallTarget }) {
  return (
    <Pressable
      accessibilityHint={`Liga para ${target.number}`}
      accessibilityLabel={`${target.number} ${target.description}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.callNumberPanel, pressed && styles.callNumberPanelPressed]}
    >
      <Text style={styles.callNumber}>{target.number}</Text>
      <Text style={styles.callService}>{target.description}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const [outboxCount, setOutboxCount] = useState(0);
  const [activePackageId, setActivePackageId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<EmergencyPreferences>(defaultEmergencyPreferences);
  const [menuOpen, setMenuOpen] = useState(false);
  const [finishCodeInput, setFinishCodeInput] = useState("");
  const [finishConfirmationOpen, setFinishConfirmationOpen] = useState(false);
  const [finishError, setFinishError] = useState("");
  const [finishInProgress, setFinishInProgress] = useState(false);
  const [startInProgress, setStartInProgress] = useState(false);
  const [stopRecordingRequestSerial, setStopRecordingRequestSerial] = useState(0);
  const [protectedRouteRequest, setProtectedRouteRequest] = useState<ProtectedRouteRequest | null>(null);
  const [protectedRouteCodeInput, setProtectedRouteCodeInput] = useState("");
  const [protectedRouteError, setProtectedRouteError] = useState("");
  const [dialog, setDialog] = useState<HomeDialog | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("Pronto para iniciar um chamado seguro.");
  const pendingMediaStopRequestRef = useRef<PendingMediaStopRequest | null>(null);
  const finishInProgressRef = useRef(false);
  const stopRecordingRequestSerialRef = useRef(0);

  async function refreshOutboxCount() {
    const activePackage = await getActiveEmergencyPackage();
    if (!activePackage && Platform.OS !== "web") {
      await new CameraCaptureResidueCleaner().cleanupAfterSuccessfulPreservation().catch(() => undefined);
    }
    setActivePackageId(activePackage?.id ?? null);
    setOutboxCount(await countPendingEmergencyPackages());
  }

  function navigateRoute(route: EmergencyHomeRoute, panel?: EmergencyHomePanel) {
    setMenuOpen(false);
    if (route === "/arquivos" && panel) {
      router.push({ pathname: "/arquivos", params: { painel: panel } });
      return;
    }
    router.push(route);
  }

  function openRoute(route: EmergencyHomeRoute, panel?: EmergencyHomePanel) {
    void openRouteAsync(route, panel);
  }

  async function openRouteAsync(route: EmergencyHomeRoute, panel?: EmergencyHomePanel) {
    if (preferences.finishSafety.requireCode && !(await isProtectedAccessUnlocked())) {
      setMenuOpen(false);
      setProtectedRouteRequest({ route, panel });
      setProtectedRouteCodeInput("");
      setProtectedRouteError("");
      return;
    }

    navigateRoute(route, panel);
  }

  function confirmEmergencyCall(target: EmergencyCallTarget) {
    const callTarget = () => {
      void Linking.openURL(target.callUri);
    };

    setDialog({
      title: `Ligar para ${target.description}?`,
      message: "",
      children: <CallNumberHero target={target} onPress={callTarget} />,
      icon: <PhoneCall size={18} color={theme.colors.primary} />,
      actions: [
        { label: "Cancelar", tone: "muted" },
        {
          label: "Ligar",
          onPress: callTarget
        }
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

    if (startInProgress) return;

    if (activePackageId) {
      requestFinishActiveCall();
      return;
    }

    if (
      preferences.localVideoCapture.requestOnSos &&
      (!preferences.legalConsent.termsAccepted ||
        !preferences.legalConsent.privacyAccepted ||
        !preferences.legalConsent.emergencyDataSharingAccepted)
    ) {
      setDialog({
        title: "Autorizar gravacao",
        message: "Revise e aceite os termos para permitir gravacao local durante o SOS.",
        icon: <LockKeyhole size={18} color={theme.colors.primary} />,
        actions: [
          { label: "Agora nao", tone: "muted" },
          {
            label: "Abrir termos",
            onPress: () => {
              router.push("/configuracoes");
            }
          }
        ]
      });
      return;
    }

    setRecordingStatus("Iniciando chamado seguro...");
    setStartInProgress(true);
    appendMediaOperationalLog("emergency_start_requested", {
      defaultDurationSeconds: preferences.defaultDurationSeconds,
      localVideoEnabled: preferences.localVideoCapture.requestOnSos,
      platform: Platform.OS,
      requestedCameraMode: preferences.localVideoCapture.cameraMode
    });

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

      if (preferences.emergencyPhoneCall.call190OnSosEnabled && Platform.OS !== "web") {
        void Linking.openURL("tel:190").catch(() => undefined);
      }

      const locationText =
        result.packageRecord.location.status === "captured"
          ? "Localizacao preservada."
          : "Localizacao nao registrada.";
      appendMediaOperationalLog("emergency_start_package_created", {
        localVideoEnabled: preferences.localVideoCapture.requestOnSos,
        locationCaptured: result.packageRecord.location.status === "captured",
        platform: Platform.OS
      });

      setRecordingStatus(
        `Chamado ativo. Gravacao ${formatDuration(preferences.defaultDurationSeconds)}. ${locationText} Arquivo no cofre local.`
      );
    } catch (error) {
      appendMediaOperationalLog("emergency_start_error", {
        platform: Platform.OS
      }, error);
      setActivePackageId(null);
      setRecordingStatus("Nao foi possivel iniciar o chamado neste aparelho.");
      setDialog({
        title: "Chamado nao preservado",
        message:
          "Nao foi possivel salvar o pacote local com seguranca neste dispositivo. Use 190, 193 ou 192 em risco imediato.",
        icon: <LockKeyhole size={18} color={theme.colors.danger} />,
        actions: [{ label: "Entendi", tone: "danger" }]
      });
    } finally {
      setStartInProgress(false);
    }
  }

  function requestFinishActiveCall() {
    if (!activePackageId || finishInProgress || finishInProgressRef.current) return;

    setFinishError("");
    setFinishCodeInput("");

    if (preferences.finishSafety.requireCode) {
      setFinishConfirmationOpen(true);
      return;
    }

    void handleFinishActiveCall();
  }

  async function handleFinishActiveCall() {
    if (!activePackageId || finishInProgress || finishInProgressRef.current) return;

    const packageId = activePackageId;
    let mediaStopResult: MediaStopRequestResult | null = null;
    finishInProgressRef.current = true;
    setFinishInProgress(true);
    setRecordingStatus("Encerrando chamado seguro...");
    appendMediaOperationalLog("emergency_finish_button_pressed", {
      platform: Platform.OS
    });

    try {
      const stopSerial = signalMediaRecorderStop();
      if (stopSerial) {
        setRecordingStatus("Encerrando gravacao local e preparando arquivo seguro.");
        mediaStopResult = await waitForMediaRecorderStop(stopSerial);
      }

      const result = await finishEmergencyPackage(packageId, "manual_finish");
      await refreshOutboxCount();

      if (!result) {
        setRecordingStatus("Nenhum chamado ativo encontrado.");
        return;
      }

      const attachedAssetsAfterFinish =
        result.packageRecord.media.status === "recorded_local" ? result.packageRecord.media.assets.length : 0;
      appendMediaOperationalLog("emergency_finish_package_result", {
        attachedAssetCount: attachedAssetsAfterFinish,
        mediaRecorded: result.packageRecord.media.status === "recorded_local",
        platform: Platform.OS
      });
      if (attachedAssetsAfterFinish > 0) {
        setRecordingStatus("Chamado encerrado. Video preservado no cofre local.");
      } else if (mediaStopResult?.status === "error") {
        setRecordingStatus("Chamado encerrado. O video local ainda esta sendo protegido e sera anexado ao cofre.");
      } else {
        setRecordingStatus(
          "Chamado encerrado. A camera local foi interrompida; se o iOS devolver o arquivo, o video sera anexado ao cofre."
        );
      }
      setFinishConfirmationOpen(false);
      setFinishCodeInput("");
      setFinishError("");
    } catch (error) {
      appendMediaOperationalLog("emergency_finish_package_error", {
        platform: Platform.OS
      }, error);
      setRecordingStatus("Nao foi possivel encerrar o chamado neste aparelho. Tente novamente pelo botao seguro.");
    } finally {
      finishInProgressRef.current = false;
      setFinishInProgress(false);
    }
  }

  function handleMediaStopRequestSettled(serial: number, result: MediaStopRequestResult) {
    if (serial <= 0 || serial !== stopRecordingRequestSerialRef.current) return;

    appendMediaOperationalLog("emergency_media_stop_settled", {
      attachedAssets: result.attachedAssets,
      platform: Platform.OS,
      status: result.status
    });
    if (result.status === "attached" && result.attachedAssets > 0) {
      void refreshOutboxCount();
      setRecordingStatus("Video finalizado e preservado no cofre local.");
    }

    const pendingRequest = pendingMediaStopRequestRef.current;
    if (pendingRequest?.serial === serial) {
      clearTimeout(pendingRequest.timeout);
      pendingMediaStopRequestRef.current = null;
      pendingRequest.resolve(result);
    }
  }

  function signalMediaRecorderStop() {
    if (!preferences.localVideoCapture.requestOnSos || Platform.OS === "web") {
      return null;
    }

    const serial = stopRecordingRequestSerialRef.current + 1;
    stopRecordingRequestSerialRef.current = serial;
    appendMediaOperationalLog("emergency_media_stop_signal", {
      platform: Platform.OS,
      stopRequestSerial: serial
    });
    setStopRecordingRequestSerial(serial);
    return serial;
  }

  function waitForMediaRecorderStop(serial: number) {
    const previousRequest = pendingMediaStopRequestRef.current;
    if (previousRequest) {
      clearTimeout(previousRequest.timeout);
      previousRequest.resolve({ attachedAssets: 0, status: "error" });
    }

    return new Promise<MediaStopRequestResult>((resolve) => {
      const timeout = setTimeout(() => {
        if (pendingMediaStopRequestRef.current?.serial !== serial) return;

        pendingMediaStopRequestRef.current = null;
        appendMediaOperationalLog("emergency_media_stop_timeout", {
          platform: Platform.OS,
          timeoutMs: mediaStopWaitTimeoutMs
        });
        resolve({ attachedAssets: 0, status: "error" });
      }, mediaStopWaitTimeoutMs);

      pendingMediaStopRequestRef.current = {
        resolve,
        serial,
        timeout
      };
    });
  }

  async function confirmFinishWithCode() {
    if (!preferences.finishSafety.requireCode) {
      void handleFinishActiveCall();
      return;
    }

    const verification = await verifySecurityCodeStatus(preferences, finishCodeInput);
    if (!verification.ok) {
      setFinishError(`${verification.message} O chamado continua ativo.`);
      return;
    }

    void handleFinishActiveCall();
  }

  async function confirmProtectedRouteWithCode() {
    if (!protectedRouteRequest) return;

    const verification = await verifySecurityCodeStatus(preferences, protectedRouteCodeInput);
    if (!verification.ok) {
      setProtectedRouteError(`${verification.message} Area protegida bloqueada.`);
      return;
    }

    const nextRequest = protectedRouteRequest;
    setProtectedRouteRequest(null);
    setProtectedRouteCodeInput("");
    setProtectedRouteError("");
    await unlockProtectedAccess();
    navigateRoute(nextRequest.route, nextRequest.panel);
  }

  function closeProtectedRouteDialog() {
    setProtectedRouteRequest(null);
    setProtectedRouteCodeInput("");
    setProtectedRouteError("");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {activePackageId || finishInProgress || startInProgress ? <EmergencyRecordingWakeLock /> : null}
      <View style={styles.homeShell} testID="home-emergency-screen">
        <EmergencyTopBar
          active={Boolean(activePackageId || startInProgress)}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((current) => !current)}
        />

        {menuOpen ? (
          <>
            <Pressable
              accessibilityLabel="Fechar menu"
              onPress={() => setMenuOpen(false)}
              style={styles.menuBackdrop}
            />
            <EmergencySettingsDrawer onNavigate={openRoute} />
          </>
        ) : null}

        <View style={styles.emergencySurface}>
          <BrandBackground active={Boolean(activePackageId || startInProgress)} />
          <EmergencyMediaRecorder
            activePackageId={activePackageId}
            preferences={preferences}
            onMediaAttached={refreshOutboxCount}
            onStopRequestSettled={handleMediaStopRequestSettled}
            stopRequestSerial={stopRecordingRequestSerial}
            onStatusChange={setRecordingStatus}
          />
          <View style={styles.panicStage}>
            <PanicButton
              active={Boolean(activePackageId || startInProgress)}
              label={
                startInProgress
                  ? "Preparando chamado"
                  : activePackageId
                  ? finishInProgress
                    ? "Encerrando gravacao"
                    : "Segurar para encerrar"
                  : "Segurar para acionar"
              }
              holdMs={preferences.inAppHoldMs}
              onTrigger={handlePanicTrigger}
            />
          </View>

          <EmergencyCallDock
            onCallTarget={confirmEmergencyCall}
          />
        </View>

        <BrandedDialog
          actions={[
            {
              label: "Cancelar",
              tone: "muted",
              onPress: closeProtectedRouteDialog
            },
            {
              autoClose: false,
              label: "Liberar",
              onPress: () => {
                void confirmProtectedRouteWithCode();
              }
            }
          ]}
          icon={<LockKeyhole size={18} color={theme.colors.primary} />}
          message="Informe o codigo de seguranca para continuar."
          onClose={closeProtectedRouteDialog}
          title="Codigo de seguranca"
          visible={Boolean(protectedRouteRequest)}
        >
          <TextInput
            accessibilityLabel="Codigo para abrir area protegida"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            maxLength={12}
            onChangeText={setProtectedRouteCodeInput}
            placeholder="Codigo de seguranca"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            style={styles.codeInput}
            value={protectedRouteCodeInput}
          />
          {protectedRouteError ? <Text style={styles.finishError}>{protectedRouteError}</Text> : null}
        </BrandedDialog>

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
          message="Informe o codigo para confirmar o encerramento do chamado."
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
        >
          {dialog?.children}
        </BrandedDialog>
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
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 20
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
  callNumber: {
    color: theme.colors.primary,
    fontSize: 64,
    fontWeight: "900",
    lineHeight: 70,
    textAlign: "center",
    textShadowColor: "rgba(30, 27, 46, 0.28)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 9
  },
  callNumberPanel: {
    alignItems: "center",
    ...theme.buttonSurface,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  callNumberPanelPressed: {
    ...theme.buttonSurfacePressed
  },
  callService: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 21,
    textAlign: "center"
  },
  finishError: {
    color: theme.colors.danger,
    fontSize: theme.typography.small,
    fontWeight: "800",
    lineHeight: 18
  }
});
