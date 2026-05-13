import { ReactNode, useCallback, useRef, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { useKeepAwake } from "expo-keep-awake";
import { ActivityIndicator, Linking, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LockKeyhole, PhoneCall, ShieldCheck, VideoOff } from "lucide-react-native";
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
import { preserveLocalVideoAsset } from "@/features/emergency/mediaCapture";
import {
  attachLocalMediaDiagnostics,
  finishEmergencyPackage,
  getActiveEmergencyPackage,
  startEmergencyPackage
} from "@/features/emergency/emergencyRecorder";
import { createMediaDiagnosticRun, summarizeMediaDiagnostics } from "@/features/emergency/MediaDiagnostics";
import { appendMediaOperationalLog } from "@/features/emergency/MediaOperationalLog";
import { cleanupNativeMediaResidues } from "@/features/emergency/SinalSeguroMediaEngine";
import type { MediaCaptureFailureReason, MediaProcessingState } from "@/features/emergency/types";
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

type FinishProgressStatus = "idle" | "running" | "background" | "done" | "warning" | "error";

type FinishProgressState = {
  detail: string;
  progress: number;
  status: FinishProgressStatus;
  title: string;
  visible: boolean;
};

const mediaStopWaitTimeoutMs = 30000;
const activePackageResidueGraceMs = 10 * 60 * 1000;
const interruptedRecoveryClockSkewMs = 30 * 1000;
const idleFinishProgressState: FinishProgressState = {
  detail: "",
  progress: 0,
  status: "idle",
  title: "",
  visible: false
};

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

function FinishProgressDialog({
  onClose,
  onOpenVault,
  state
}: {
  onClose: () => void;
  onOpenVault: () => void;
  state: FinishProgressState;
}) {
  const canDismiss = state.status !== "running";
  const progress = Math.max(0, Math.min(100, state.progress));
  const accentColor =
    state.status === "error"
      ? theme.colors.danger
      : state.status === "warning"
        ? theme.colors.warning
        : theme.colors.secure;
  const icon =
    state.status === "warning" || state.status === "error" ? (
      <VideoOff size={19} color={accentColor} />
    ) : (
      <ShieldCheck size={19} color={accentColor} />
    );

  function closeIfAllowed() {
    if (canDismiss) onClose();
  }

  return (
    <Modal animationType="fade" onRequestClose={closeIfAllowed} transparent visible={state.visible}>
      <Pressable accessible={false} onPress={closeIfAllowed} style={styles.finishProgressBackdrop}>
        <Pressable accessible={false} onPress={() => undefined} style={styles.finishProgressPanel}>
          <View style={styles.finishProgressHeader}>
            <View style={[styles.finishProgressIcon, { borderColor: accentColor }]}>{icon}</View>
            <View style={styles.finishProgressTitleBlock}>
              <Text style={styles.finishProgressTitle}>{state.title}</Text>
              <Text style={styles.finishProgressPercent}>{Math.round(progress)}%</Text>
            </View>
          </View>

          <View style={styles.finishProgressTrack}>
            <View style={[styles.finishProgressFill, { backgroundColor: accentColor, width: `${progress}%` }]} />
          </View>

          <Text style={styles.finishProgressDetail}>{state.detail}</Text>

          {state.status === "running" ? (
            <View style={styles.finishProgressPendingRow}>
              <ActivityIndicator color={theme.colors.primary} size="small" />
              <Text style={styles.finishProgressPendingText}>Mantendo o pacote local consistente.</Text>
            </View>
          ) : (
            <View style={styles.finishProgressActions}>
              <Pressable
                accessibilityLabel="Continuar na tela inicial"
                accessibilityRole="button"
                onPress={onClose}
                style={({ pressed }) => [styles.finishProgressActionMuted, pressed && styles.finishProgressActionPressed]}
              >
                <Text style={styles.finishProgressActionMutedText}>Continuar</Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Abrir cofre local"
                accessibilityRole="button"
                onPress={onOpenVault}
                style={({ pressed }) => [styles.finishProgressActionPrimary, pressed && styles.finishProgressActionPressed]}
              >
                <Text style={styles.finishProgressActionPrimaryText}>Abrir cofre</Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function HomeScreen() {
  const [outboxCount, setOutboxCount] = useState(0);
  const [activePackageId, setActivePackageId] = useState<string | null>(null);
  const [mediaRecorderPackageId, setMediaRecorderPackageId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<EmergencyPreferences>(defaultEmergencyPreferences);
  const [menuOpen, setMenuOpen] = useState(false);
  const [finishCodeInput, setFinishCodeInput] = useState("");
  const [finishConfirmationOpen, setFinishConfirmationOpen] = useState(false);
  const [finishError, setFinishError] = useState("");
  const [finishInProgress, setFinishInProgress] = useState(false);
  const [finishProgress, setFinishProgress] = useState<FinishProgressState>(idleFinishProgressState);
  const [captureStopLocked, setCaptureStopLocked] = useState(false);
  const [mediaStopPending, setMediaStopPending] = useState(false);
  const [startInProgress, setStartInProgress] = useState(false);
  const [stopRecordingRequestSerial, setStopRecordingRequestSerial] = useState(0);
  const [protectedRouteRequest, setProtectedRouteRequest] = useState<ProtectedRouteRequest | null>(null);
  const [protectedRouteCodeInput, setProtectedRouteCodeInput] = useState("");
  const [protectedRouteError, setProtectedRouteError] = useState("");
  const [dialog, setDialog] = useState<HomeDialog | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("Pronto para iniciar um chamado seguro.");
  const pendingMediaStopRequestRef = useRef<PendingMediaStopRequest | null>(null);
  const finishInProgressRef = useRef(false);
  const mediaStopPendingRef = useRef(false);
  const startupRecoveryCompletedRef = useRef(false);
  const stopRecordingRequestSerialRef = useRef(0);

  async function refreshOutboxCount() {
    const activePackage = await getActiveEmergencyPackage();
    if (Platform.OS !== "web") {
      const nowMs = Date.now();
      const cleanupResult = await new CameraCaptureResidueCleaner()
        .cleanupAfterSuccessfulPreservation(
          activePackage ? { nowMs, staleBeforeMs: nowMs - activePackageResidueGraceMs } : { nowMs }
        )
        .catch(() => null);
      if (cleanupResult) {
        appendMediaOperationalLog("camera_residue_maintenance", {
          activePackagePresent: Boolean(activePackage),
          deletedFiles: cleanupResult.deletedUris.length,
          inspectedDirectory: Boolean(cleanupResult.inspectedDirectoryUri)
        });
      }
    }
    setActivePackageId(activePackage?.id ?? null);
    if (activePackage) {
      setMediaRecorderPackageId(activePackage.id);
    } else if (!mediaStopPendingRef.current) {
      setMediaRecorderPackageId(null);
    }
    setOutboxCount(await countPendingEmergencyPackages());
  }

  async function recoverInterruptedActiveRecordingOnLaunch(currentPreferences = preferences) {
    if (startupRecoveryCompletedRef.current) return;
    startupRecoveryCompletedRef.current = true;

    const interruptedPackage = await getActiveEmergencyPackage();
    if (!interruptedPackage) return;

    appendMediaOperationalLog("emergency_interrupted_active_detected", {
      mediaRecorded: interruptedPackage.media.status === "recorded_local",
      platform: Platform.OS
    });

    const recoveredAssetCount = await recoverInterruptedCameraResidue(
      interruptedPackage.id,
      interruptedPackage.capture.startedAt,
      currentPreferences
    );
    const result = await finishEmergencyPackage(interruptedPackage.id, "interrupted_on_launch");
    const attachedAssetCount =
      result?.packageRecord.media.status === "recorded_local" ? result.packageRecord.media.assets.length : 0;

    if (attachedAssetCount === 0 && recoveredAssetCount === 0) {
      await persistFinishNoMediaDiagnostic(interruptedPackage.id, "camera_recording_error");
    }

    appendMediaOperationalLog("emergency_interrupted_active_recovered", {
      attachedAssetCount,
      recoveredAssetCount,
      platform: Platform.OS
    });

    setActivePackageId(null);
    setMediaRecorderPackageId(null);
    setCaptureStopLocked(false);
    setMediaStopPendingState(false);
    setRecordingStatus(
      attachedAssetCount > 0
        ? "Chamado anterior recuperado. Video preservado no cofre local."
        : "Chamado anterior recuperado sem video preservado. Revise a causa saneada no cofre."
    );
    showFinishProgress({
      detail:
        attachedAssetCount > 0
          ? "O app recuperou um chamado interrompido sem reabrir a camera."
          : "O app encontrou um chamado interrompido e salvou a causa tecnica sem reativar camera ou microfone.",
      progress: 100,
      status: attachedAssetCount > 0 ? "done" : "warning",
      title: attachedAssetCount > 0 ? "Chamado recuperado" : "Chamado recuperado sem video"
    });
  }

  async function recoverInterruptedCameraResidue(
    packageId: string,
    captureStartedAt: string,
    currentPreferences: EmergencyPreferences
  ) {
    if (Platform.OS === "web") return 0;

    const captureStartedAtMs = Date.parse(captureStartedAt);
    const modifiedAfterMs = Number.isFinite(captureStartedAtMs)
      ? Math.max(0, captureStartedAtMs - interruptedRecoveryClockSkewMs)
      : 0;
    const recoverableResidues = await new CameraCaptureResidueCleaner()
      .findRecoverableCameraVideos({
        maxCandidates: 4,
        maxTotalSizeBytes: 512 * 1024 * 1024,
        modifiedAfterMs
      })
      .catch(() => []);
    if (!recoverableResidues.length) return 0;

    const requestedCameraMode = currentPreferences.localVideoCapture.cameraMode;
    const cameraMode = requestedCameraMode === "back" ? "back" : "front";
    appendMediaOperationalLog("emergency_interrupted_media_recovery_start", {
      candidateCount: recoverableResidues.length,
      platform: Platform.OS,
      totalSizeKb: Math.ceil(
        recoverableResidues.reduce((total, residue) => total + (residue.sizeBytes ?? 0), 0) / 1024
      )
    });
    showFinishProgress({
      detail: "Arquivo temporario privado encontrado. Criptografando antes de atualizar o cofre.",
      progress: 36,
      status: "running",
      title: "Recuperando video"
    });

    let recoveredAssetCount = 0;
    let segmentStartedAt = captureStartedAt;
    for (const recoverableResidue of [...recoverableResidues].reverse()) {
      const completedAt = recoverableResidue.modificationTimeMs
        ? new Date(recoverableResidue.modificationTimeMs).toISOString()
        : new Date().toISOString();
      try {
        await preserveLocalVideoAsset({
          packageId,
          sourceUri: recoverableResidue.uri,
          cameraMode,
          cleanupResidueSourceOnly: true,
          requestedCameraMode,
          startedAt: segmentStartedAt,
          completedAt,
          verificationMode: Platform.OS === "ios" ? "bounded" : "full"
        });
        recoveredAssetCount += 1;
        segmentStartedAt = completedAt;
      } catch (error) {
        appendMediaOperationalLog("emergency_interrupted_media_recovery_error", {
          platform: Platform.OS,
          recoveredAssetCount
        }, error);
      }
    }

    appendMediaOperationalLog("emergency_interrupted_media_recovery_success", {
      platform: Platform.OS,
      recoveredAssetCount
    });
    return recoveredAssetCount;
  }

  function navigateRoute(route: EmergencyHomeRoute, panel?: EmergencyHomePanel) {
    setMenuOpen(false);
    if (route === "/arquivos" && panel) {
      router.push({ pathname: "/arquivos", params: { painel: panel } });
      return;
    }
    router.push(route);
  }

  function closeFinishProgress() {
    setFinishProgress((current) =>
      current.status === "running" && current.progress < 100 ? current : idleFinishProgressState
    );
  }

  function openVaultFromFinishProgress() {
    setFinishProgress((current) => ({ ...current, visible: false }));
    void openRouteAsync("/arquivos", "cofre");
  }

  function setMediaStopPendingState(value: boolean) {
    mediaStopPendingRef.current = value;
    setMediaStopPending(value);
    if (!value) {
      setMediaRecorderPackageId(null);
    }
  }

  function showFinishProgress(nextState: Partial<FinishProgressState>) {
    setFinishProgress((current) => ({
      ...current,
      ...nextState,
      progress: Math.max(0, Math.min(100, nextState.progress ?? current.progress)),
      visible: true
    }));
  }

  function handleMediaProcessingStateChange(state: MediaProcessingState) {
    if (!mediaStopPendingRef.current) return;

    switch (state) {
      case "stop_requested":
        showFinishProgress({
          detail: "Camera sinalizada para encerrar. Aguarde a liberacao do microfone e da camera.",
          progress: 22,
          status: "running",
          title: "Encerrando gravacao"
        });
        return;
      case "camera_released":
        setRecordingStatus("Camera e microfone liberados. Video local segue em protecao.");
        showFinishProgress({
          detail: "Camera e microfone foram liberados. A criptografia continua em segundo plano controlado.",
          progress: 42,
          status: "background",
          title: "Camera desligada"
        });
        return;
      case "plaintext_detected":
        showFinishProgress({
          detail: "Arquivo temporario localizado. Iniciando empacotamento seguro.",
          progress: 50,
          status: "background",
          title: "Empacotando video"
        });
        return;
      case "encrypting":
      case "packaging":
        showFinishProgress({
          detail: "Criptografando o video local antes de anexar ao cofre.",
          progress: 68,
          status: "background",
          title: "Criptografando"
        });
        return;
      case "cleanup":
        showFinishProgress({
          detail: "Removendo arquivo temporario claro e conferindo o cofre.",
          progress: 86,
          status: "background",
          title: "Limpando temporarios"
        });
        return;
      case "attached":
        showFinishProgress({
          detail: "Midia protegida e cofre atualizado.",
          progress: 100,
          status: "done",
          title: "Video protegido"
        });
        return;
      case "no_media":
        showFinishProgress({
          detail: "A camera encerrou sem devolver arquivo. O cofre mostra a causa tecnica saneada.",
          progress: 100,
          status: "warning",
          title: "Chamado salvo sem video"
        });
        return;
      case "error":
        showFinishProgress({
          detail: "Falha tecnica saneada durante a preservacao. Revise o cofre antes de novo teste.",
          progress: 100,
          status: "error",
          title: "Falha na midia"
        });
        return;
    }
  }

  async function persistFinishNoMediaDiagnostic(packageId: string, reason: MediaCaptureFailureReason) {
    const diagnosticRunId = createMediaDiagnosticRun("capture-finish");
    await attachLocalMediaDiagnostics(packageId, {
      schemaVersion: "sinalseguro.media-capture-diagnostic.v1",
      status: "capture_failed",
      reason,
      recordedAt: new Date().toISOString(),
      diagnostics: summarizeMediaDiagnostics(diagnosticRunId)
    }).catch(() => undefined);
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
        await recoverInterruptedActiveRecordingOnLaunch(nextPreferences).catch((error) => {
          appendMediaOperationalLog("emergency_interrupted_active_recovery_error", {
            platform: Platform.OS
          }, error);
        });
        await cleanupNativeMediaResidues().catch(() => undefined);
        await refreshOutboxCount();
      }

      void prepareScreen();
    }, [])
  );

  async function handlePanicTrigger() {
    setMenuOpen(false);

    if (startInProgress) return;

    if (mediaStopPendingRef.current) {
      showFinishProgress({
        detail: "A camera ja foi encerrada. O app ainda esta criptografando e anexando a midia no cofre local.",
        progress: Math.max(finishProgress.progress, 58),
        status: "running",
        title: "Protegendo video"
      });
      setRecordingStatus("Protecao do video local em andamento. O cofre sera atualizado automaticamente.");
      return;
    }

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
    finishInProgressRef.current = true;
    setFinishInProgress(true);
    setRecordingStatus("Encerrando chamado seguro...");
    showFinishProgress({
      detail: "Interrompendo a gravacao local e salvando o pacote.",
      progress: 12,
      status: "running",
      title: "Encerrando chamado"
    });
    appendMediaOperationalLog("emergency_finish_button_pressed", {
      platform: Platform.OS
    });

    try {
      const stopSerial = signalMediaRecorderStop();
      let stopResult: MediaStopRequestResult | null = null;
      if (stopSerial) {
        setCaptureStopLocked(true);
        setMediaStopPendingState(true);
        setActivePackageId(null);
        setMediaRecorderPackageId(packageId);
        showFinishProgress({
          detail: "Camera sinalizada. O chamado saiu do modo ativo enquanto a midia continua protegendo.",
          progress: 24,
          status: "running",
          title: "Encerrando gravacao"
        });
        stopResult = await waitForMediaRecorderStop(stopSerial);
        setMediaStopPendingState(false);
        appendMediaOperationalLog("emergency_media_stop_progress_result", {
          attachedAssets: stopResult.attachedAssets,
          platform: Platform.OS,
          status: stopResult.status
        });
        showFinishProgress({
          detail:
            stopResult.status === "attached"
              ? "Midia criptografada. Finalizando o pacote local."
              : "Camera liberada. Confirmando se o pacote ja recebeu midia preservada.",
          progress: stopResult.status === "attached" ? 72 : 48,
          status: "running",
          title: stopResult.status === "attached" ? "Midia protegida" : "Conferindo cofre"
        });
      }

      const result = await finishEmergencyPackage(packageId, "manual_finish");
      await refreshOutboxCount();

      if (!result) {
        setRecordingStatus("Nenhum chamado ativo encontrado.");
        if (!stopSerial) {
          showFinishProgress({
            detail: "Nao havia chamado ativo para encerrar.",
            progress: 100,
            status: "warning",
            title: "Chamado nao encontrado"
          });
        }
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
        showFinishProgress({
          detail: stopSerial
            ? "Video protegido, camera liberada e pacote local finalizado."
            : "Video protegido e anexado ao cofre local.",
          progress: 100,
          status: "done",
          title: "Video protegido"
        });
      } else if (stopSerial && stopResult?.status === "attached") {
        setRecordingStatus("Chamado encerrado. Video local preservado, mas ainda sem reflexo final no cofre.");
        showFinishProgress({
          detail: "A midia foi protegida pela camera, mas o cofre ainda nao refletiu o anexo. Revise o item local.",
          progress: 100,
          status: "warning",
          title: "Verificacao pendente"
        });
      } else {
        setRecordingStatus("Chamado encerrado. Pacote local salvo sem gravacao de video.");
        if (stopSerial) {
          await persistFinishNoMediaDiagnostic(packageId, "camera_no_file_returned");
        }
        showFinishProgress({
          detail: stopSerial
            ? "A camera foi liberada, mas nao devolveu arquivo de video para este pacote."
            : "Pacote encerrado e preservado no cofre local.",
          progress: 100,
          status: stopSerial ? "warning" : "done",
          title: stopSerial ? "Chamado salvo sem video" : "Chamado encerrado"
        });
      }
      setFinishConfirmationOpen(false);
      setFinishCodeInput("");
      setFinishError("");
    } catch (error) {
      appendMediaOperationalLog("emergency_finish_package_error", {
        platform: Platform.OS
      }, error);
      setRecordingStatus("Nao foi possivel encerrar o chamado neste aparelho. Tente novamente pelo botao seguro.");
      showFinishProgress({
        detail: "Nao foi possivel finalizar o pacote local. Tente novamente pelo botao seguro.",
        progress: 100,
        status: "error",
        title: "Falha no encerramento"
      });
    } finally {
      setCaptureStopLocked(false);
      setMediaStopPendingState(false);
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
      setFinishProgress((current) =>
        current.visible && current.status !== "running"
          ? {
              detail: "Midia anexada ao cofre local apos a verificacao inicial.",
              progress: 100,
              status: "done",
              title: "Video protegido",
              visible: true
            }
          : current
      );
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
      {activePackageId || finishInProgress || startInProgress || mediaStopPending ? <EmergencyRecordingWakeLock /> : null}
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
            activePackageId={mediaRecorderPackageId}
            captureStopLocked={captureStopLocked}
            preferences={preferences}
            onMediaAttached={refreshOutboxCount}
            onMediaProcessingStateChange={handleMediaProcessingStateChange}
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
                  : mediaStopPending
                    ? "Protegendo video"
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
        <FinishProgressDialog
          onClose={closeFinishProgress}
          onOpenVault={openVaultFromFinishProgress}
          state={finishProgress}
        />
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
  },
  finishProgressActionMuted: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: theme.spacing.md
  },
  finishProgressActionMutedText: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontWeight: "900"
  },
  finishProgressActionPressed: {
    opacity: 0.86,
    transform: [{ translateY: 1 }]
  },
  finishProgressActionPrimary: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: theme.spacing.md
  },
  finishProgressActionPrimaryText: {
    color: theme.colors.textOnDark,
    fontSize: theme.typography.small,
    fontWeight: "900"
  },
  finishProgressActions: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  finishProgressBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(18, 10, 32, 0.78)",
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.xl
  },
  finishProgressDetail: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 22
  },
  finishProgressFill: {
    borderRadius: theme.radius.pill,
    height: "100%"
  },
  finishProgressHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  finishProgressIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  finishProgressPanel: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    maxWidth: 440,
    padding: theme.spacing.lg,
    width: "100%",
    ...theme.shadow
  },
  finishProgressPendingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  finishProgressPendingText: {
    color: theme.colors.textMuted,
    flex: 1,
    fontSize: theme.typography.small,
    fontWeight: "800",
    lineHeight: 18
  },
  finishProgressPercent: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "right"
  },
  finishProgressTitle: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22
  },
  finishProgressTitleBlock: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  finishProgressTrack: {
    backgroundColor: "rgba(30, 27, 46, 0.14)",
    borderRadius: theme.radius.pill,
    height: 10,
    overflow: "hidden"
  }
});
