import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
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
import { resolveFinishOutcomePolicy } from "@/features/emergency-home/finishOutcomePolicy";
import { resolveMediaHandoffPolicy } from "@/features/emergency-home/mediaHandoffPolicy";
import {
  resolveMediaProcessingPresentation,
  shouldResolveMediaReleaseWaiter
} from "@/features/emergency-home/mediaProcessingStatusPolicy";
import { ownerAutoCallAttemptMessage, ownerAutoCallRecipientStatus, shouldAttemptOwnerAutoCall } from "@/features/emergency-home/ownerAutoCallPolicy";
import { resolveOwnerLiveVideoEvidenceStart } from "@/features/emergency-home/ownerLiveEvidencePolicy";
import { panicButtonLabel, resolvePanicTriggerDecision } from "@/features/emergency-home/panicTriggerPolicy";
import { activeRemoteSyncRetryMessage, resolveActiveRemoteSyncStatus } from "@/features/emergency-home/remoteSyncStatusPolicy";
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
import {
  type EmergencyRemoteSyncState,
  finishRemoteEmergencySessionForPackage,
  listEmergencyRemoteSyncStates,
  queueEmergencyPackageForRemoteSync,
  syncEmergencyPackageWithApi,
  syncPendingEmergencyPackagesWithApi
} from "@/features/emergency/emergencySyncQueue";
import type { MediaCaptureFailureReason, MediaProcessingState } from "@/features/emergency/types";
import {
  defaultEmergencyPreferences,
  EmergencyPreferences,
  formatDuration,
  getEmergencyPreferences
} from "@/features/emergency/emergencyPreferences";
import { LiveAudioCallPanel } from "@/features/live-call/LiveAudioCallPanel";
import {
  beginOwnerLiveCallEvidence,
  updateOwnerLiveCallEvidenceRecord,
  type OwnerLocalEvidenceStatus,
  type OwnerLiveEvidenceStatus
} from "@/features/live-call/liveCallOperationalEvidence";
import {
  startOwnerLiveVideoRecording,
  stopOwnerLiveVideoRecording,
  type OwnerLiveVideoRecording
} from "@/features/live-call/liveCallLocalRecorder";
import { useLiveAudioCall } from "@/features/live-call/useLiveAudioCall";
import { listAcceptedOwnerRelationshipsForDelivery } from "@/features/invitations/trustedRelationshipStore";
import { isProtectedAccessUnlocked, unlockProtectedAccess, verifySecurityCodeStatus } from "@/security/protectedAccess";
import { deviceBindingService } from "@/services/deviceBinding";
import { listAcceptedLiveRecipients, recordLiveAuditMarker } from "@/services/liveCallControl";

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

type PendingMediaReleaseRequest = {
  resolve: () => void;
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

type PreservedLiveVideoAsset = Awaited<ReturnType<typeof preserveLocalVideoAsset>>;

type OwnerLiveVideoStartRequest = {
  packageId: string;
  promise: Promise<OwnerLiveVideoRecording | null>;
  remoteSessionId: string;
};

const mediaStopWaitTimeoutMs = 30000;
const mediaReleaseForLiveCallWaitTimeoutMs = 12000;
const ownerLiveCallAutoStartDelayMs = 1800;
const ownerLiveCallAutoRetryMs = 5000;
const activeRemoteSyncRetryMs = 5000;
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
      <View style={styles.finishProgressBackdrop}>
        <Pressable
          accessible={false}
          onPress={closeIfAllowed}
          style={styles.finishProgressBackdropPressArea}
        />
        <View style={styles.finishProgressPanel}>
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
        </View>
      </View>
    </Modal>
  );
}

export default function HomeScreen() {
  const [outboxCount, setOutboxCount] = useState(0);
  const [activePackageId, setActivePackageId] = useState<string | null>(null);
  const [liveRemoteSessionId, setLiveRemoteSessionId] = useState<string | null>(null);
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
  const [recordingStatus, setRecordingStatus] = useState("Pronto para pedir ajuda.");
  const pendingMediaStopRequestRef = useRef<PendingMediaStopRequest | null>(null);
  const pendingMediaReleaseRequestRef = useRef<PendingMediaReleaseRequest | null>(null);
  const finishInProgressRef = useRef(false);
  const mediaStopPurposeRef = useRef<"finish" | "live_call_handoff" | null>(null);
  const mediaStopPendingRef = useRef(false);
  const activeRemoteSyncInFlightRef = useRef(false);
  const ownerAutoCallInFlightRef = useRef(false);
  const ownerAutoCallPausedSessionIdsRef = useRef<Set<string>>(new Set());
  const ownerAutoCallStartedSessionIdsRef = useRef<Set<string>>(new Set());
  const startupRecoveryCompletedRef = useRef(false);
  const stopRecordingRequestSerialRef = useRef(0);
  const liveAudioCall = useLiveAudioCall();
  const liveAudioCallStatus = liveAudioCall.state.status;
  const liveAudioCallStateRef = useRef(liveAudioCall.state);
  const ownerLiveVideoRecordingRef = useRef<OwnerLiveVideoRecording | null>(null);
  const ownerLiveVideoStartRequestRef = useRef<OwnerLiveVideoStartRequest | null>(null);
  const ownerLiveVideoPreserveInFlightRef = useRef(false);
  const ownerLiveVideoPreservePromiseRef = useRef<Promise<PreservedLiveVideoAsset | null> | null>(null);

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
      const activeRemoteSync = (await listEmergencyRemoteSyncStates().catch(() => [])).find(
        (state) => state.packageId === activePackage.id && state.status === "sent_to_ec2" && Boolean(state.remoteSessionId)
      );
      setLiveRemoteSessionId(activeRemoteSync?.remoteSessionId ?? null);
    } else if (!mediaStopPendingRef.current) {
      setMediaRecorderPackageId(null);
      setLiveRemoteSessionId(null);
    }
    setOutboxCount(await countPendingEmergencyPackages());
  }

  const applyRemoteSyncState = useCallback((
    syncState: EmergencyRemoteSyncState,
    options: { locationText?: string; source: "initial" | "retry" | "resume" }
  ) => {
    appendMediaOperationalLog("emergency_remote_sync_state_applied", {
      platform: Platform.OS,
      recipientCount: syncState.recipientCount,
      remoteSessionCreated: Boolean(syncState.remoteSessionId),
      source: options.source,
      status: syncState.status
    });

    const remoteSyncStatus = resolveActiveRemoteSyncStatus(syncState, {
      locationText: options.locationText
    });

    setLiveRemoteSessionId(remoteSyncStatus.remoteSessionId);
    if (remoteSyncStatus.beginLiveEvidence && remoteSyncStatus.remoteSessionId) {
      void beginOwnerLiveCallEvidence({
        packageId: syncState.packageId,
        remoteSessionId: remoteSyncStatus.remoteSessionId
      }).catch(() => undefined);
    }

    setRecordingStatus(remoteSyncStatus.message);
  }, []);

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

  function setMediaStopPendingFlag(value: boolean) {
    mediaStopPendingRef.current = value;
    setMediaStopPending(value);
  }

  function resolveMediaReleaseWaiter() {
    const waiter = pendingMediaReleaseRequestRef.current;
    if (!waiter) return;

    clearTimeout(waiter.timeout);
    pendingMediaReleaseRequestRef.current = null;
    waiter.resolve();
  }

  function waitForMediaRecorderRelease() {
    const previousRequest = pendingMediaReleaseRequestRef.current;
    if (previousRequest) {
      clearTimeout(previousRequest.timeout);
      previousRequest.resolve();
    }

    return new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        if (pendingMediaReleaseRequestRef.current) {
          pendingMediaReleaseRequestRef.current = null;
        }
        appendMediaOperationalLog("emergency_live_call_media_release_timeout", {
          platform: Platform.OS,
          timeoutMs: mediaReleaseForLiveCallWaitTimeoutMs
        });
        resolve();
      }, mediaReleaseForLiveCallWaitTimeoutMs);

      pendingMediaReleaseRequestRef.current = {
        resolve,
        timeout
      };
    });
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

    if (shouldResolveMediaReleaseWaiter(state)) {
      resolveMediaReleaseWaiter();
    }

    const presentation = resolveMediaProcessingPresentation(state, mediaStopPurposeRef.current);
    if (!presentation) return;

    if (presentation.recordingStatus) {
      setRecordingStatus(presentation.recordingStatus);
    }

    if (presentation.finishProgress) {
      showFinishProgress(presentation.finishProgress);
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

  function updateOwnerLiveEvidence(
    remoteSessionId: string | null | undefined,
    options: {
      connectedAt?: string | null;
      endedAt?: string | null;
      localEvidenceStatus?: OwnerLocalEvidenceStatus;
      packageId?: string;
      status?: OwnerLiveEvidenceStatus;
    }
  ) {
    if (!remoteSessionId) return;
    void updateOwnerLiveCallEvidenceRecord(remoteSessionId, options).catch(() => undefined);
  }

  function recordOwnerLiveAuditMarker(
    remoteSessionId: string | null | undefined,
    event: Parameters<typeof recordLiveAuditMarker>[1]["event"],
    options?: {
      connectionState?: Parameters<typeof recordLiveAuditMarker>[1]["connectionState"];
      localEvidenceStatus?: Parameters<typeof recordLiveAuditMarker>[1]["localEvidenceStatus"];
    }
  ) {
    if (!remoteSessionId) return;
    void deviceBindingService.getRegisteredApiDeviceId().then((deviceId) =>
      recordLiveAuditMarker(remoteSessionId, {
        connectionState: options?.connectionState,
        deviceId,
        event,
        localEvidenceStatus: options?.localEvidenceStatus,
        role: "owner"
      })
    ).catch(() => undefined);
  }

  async function startOwnerLiveVideoEvidence(input: {
    callSessionId?: string;
    packageId: string;
    remoteSessionId: string;
    streamReactTag: string;
  }) {
    const activeRecording = ownerLiveVideoRecordingRef.current;
    if (activeRecording?.remoteSessionId === input.remoteSessionId) return activeRecording;
    const activeStartRequest = ownerLiveVideoStartRequestRef.current;
    if (
      activeStartRequest?.remoteSessionId === input.remoteSessionId &&
      activeStartRequest.packageId === input.packageId
    ) {
      return activeStartRequest.promise;
    }
    if (activeRecording) {
      await stopOwnerLiveVideoEvidence("replace_recording");
    }

    let startPromise!: Promise<OwnerLiveVideoRecording | null>;
    startPromise = (async () => {
      try {
        const recording = await startOwnerLiveVideoRecording(input);
        if (!recording) {
          updateOwnerLiveEvidence(input.remoteSessionId, {
            localEvidenceStatus: "metadata_only",
            packageId: input.packageId,
            status: "transmitting"
          });
          return null;
        }
        ownerLiveVideoRecordingRef.current = recording;
        updateOwnerLiveEvidence(input.remoteSessionId, {
          localEvidenceStatus: "recording",
          packageId: input.packageId,
          status: "recording"
        });
        recordOwnerLiveAuditMarker(input.remoteSessionId, "local_evidence_recording", {
          connectionState: "connected",
          localEvidenceStatus: "recording"
        });
        setRecordingStatus("Chamada em andamento com seu anjo. Gravando neste aparelho.");
        return recording;
      } catch (error) {
        appendMediaOperationalLog("live_video_recording_start_error", {
          platform: Platform.OS,
          remoteSessionId: input.remoteSessionId
        }, error);
        updateOwnerLiveEvidence(input.remoteSessionId, {
          localEvidenceStatus: "metadata_only",
          packageId: input.packageId,
          status: "transmitting"
        });
        return null;
      } finally {
        if (ownerLiveVideoStartRequestRef.current?.promise === startPromise) {
          ownerLiveVideoStartRequestRef.current = null;
        }
      }
    })();

    ownerLiveVideoStartRequestRef.current = {
      packageId: input.packageId,
      promise: startPromise,
      remoteSessionId: input.remoteSessionId
    };
    return startPromise;
  }

  async function stopOwnerLiveVideoEvidence(reason: "call_finished" | "finish" | "manual_stop" | "replace_recording") {
    if (ownerLiveVideoPreservePromiseRef.current) return ownerLiveVideoPreservePromiseRef.current;

    const pendingStart = ownerLiveVideoStartRequestRef.current;
    let recording = ownerLiveVideoRecordingRef.current;
    if (!recording && pendingStart) {
      recording = await pendingStart.promise;
    }
    if (!recording || ownerLiveVideoPreserveInFlightRef.current) return null;

    const recordingToPreserve = recording;
    ownerLiveVideoRecordingRef.current = null;
    ownerLiveVideoPreserveInFlightRef.current = true;
    let preservePromise!: Promise<PreservedLiveVideoAsset | null>;
    preservePromise = (async () => {
      try {
        const result = await stopOwnerLiveVideoRecording(recordingToPreserve);
        if (!result?.sourceUri) return null;

        appendMediaOperationalLog("live_video_recording_preserve_start", {
          audioCaptured: result.audioCaptured,
          frameCount: result.frameCount,
          platform: Platform.OS,
          reason,
          remoteSessionId: recordingToPreserve.remoteSessionId,
          sizeBytes: result.sizeBytes
        });
        const attachedAsset = await preserveLocalVideoAsset({
          packageId: recordingToPreserve.packageId,
          sourceUri: result.sourceUri,
          cameraMode: "back",
          requestedCameraMode: preferences.localVideoCapture.cameraMode,
          startedAt: result.startedAt,
          completedAt: result.completedAt,
          verificationMode: "bounded"
        });
        updateOwnerLiveEvidence(recordingToPreserve.remoteSessionId, {
          endedAt: reason === "finish" || reason === "call_finished" ? result.completedAt : undefined,
          localEvidenceStatus: "protected",
          packageId: recordingToPreserve.packageId,
          status: reason === "finish" || reason === "call_finished" ? "protected" : "transmitting"
        });
        recordOwnerLiveAuditMarker(recordingToPreserve.remoteSessionId, "local_evidence_protected", {
          connectionState: reason === "finish" || reason === "call_finished" ? "ended" : "connected",
          localEvidenceStatus: "protected"
        });
        setRecordingStatus(
          result.audioCaptured
            ? "Chamada salva no cofre deste aparelho."
            : "Video da chamada salvo no cofre deste aparelho."
        );
        appendMediaOperationalLog("live_video_recording_preserve_success", {
          assetCreated: Boolean(attachedAsset),
          audioCaptured: result.audioCaptured,
          platform: Platform.OS,
          reason,
          remoteSessionId: recordingToPreserve.remoteSessionId
        });
        return attachedAsset;
      } catch (error) {
        appendMediaOperationalLog("live_video_recording_preserve_error", {
          platform: Platform.OS,
          reason,
          remoteSessionId: recordingToPreserve.remoteSessionId
        }, error);
        updateOwnerLiveEvidence(recordingToPreserve.remoteSessionId, {
          localEvidenceStatus: "failed",
          packageId: recordingToPreserve.packageId,
          status: "failed"
        });
        recordOwnerLiveAuditMarker(recordingToPreserve.remoteSessionId, "local_evidence_failed", {
          connectionState: "failed",
          localEvidenceStatus: "failed"
        });
        return null;
      } finally {
        ownerLiveVideoPreserveInFlightRef.current = false;
        if (ownerLiveVideoPreservePromiseRef.current === preservePromise) {
          ownerLiveVideoPreservePromiseRef.current = null;
        }
      }
    })();
    ownerLiveVideoPreservePromiseRef.current = preservePromise;
    return preservePromise;
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

  const prepareMediaForOwnerLiveCall = useCallback(async () => {
    const mediaHandoff = resolveMediaHandoffPolicy({
      activePackageId,
      captureStopLocked,
      isWebPlatform: Platform.OS === "web",
      requestLocalVideoOnSos: preferences.localVideoCapture.requestOnSos
    });
    if (!mediaHandoff.shouldPrepare) {
      return;
    }

    const packageId = mediaHandoff.packageId;
    const startPresentation = mediaHandoff.start;
    const completePresentation = mediaHandoff.complete;
    mediaStopPurposeRef.current = "live_call_handoff";
    if (startPresentation.recordingStatus) {
      setRecordingStatus(startPresentation.recordingStatus);
    }
    updateOwnerLiveEvidence(liveRemoteSessionId, {
      localEvidenceStatus: startPresentation.localEvidenceStatus,
      packageId,
      status: startPresentation.liveEvidenceStatus
    });
    recordOwnerLiveAuditMarker(liveRemoteSessionId, startPresentation.auditMarker, {
      connectionState: startPresentation.connectionState,
      localEvidenceStatus: startPresentation.localEvidenceStatus
    });
    appendMediaOperationalLog("emergency_live_call_media_handoff_start", {
      packageId,
      platform: Platform.OS
    });

    const stopSerial = signalMediaRecorderStop();
    setCaptureStopLocked(true);
    setMediaRecorderPackageId(packageId);

    if (!stopSerial) {
      mediaStopPurposeRef.current = null;
      return;
    }

    setMediaStopPendingFlag(true);
    try {
      await waitForMediaRecorderRelease();
      updateOwnerLiveEvidence(liveRemoteSessionId, {
        localEvidenceStatus: completePresentation.localEvidenceStatus,
        packageId,
        status: completePresentation.liveEvidenceStatus
      });
      recordOwnerLiveAuditMarker(liveRemoteSessionId, completePresentation.auditMarker, {
        connectionState: completePresentation.connectionState,
        localEvidenceStatus: completePresentation.localEvidenceStatus
      });
      appendMediaOperationalLog("emergency_live_call_media_handoff_camera_released", {
        packageId,
        platform: Platform.OS,
        stopRequestSerial: stopSerial
      });
    } finally {
      setMediaStopPendingFlag(false);
      setMediaRecorderPackageId(packageId);
      mediaStopPurposeRef.current = null;
    }
  }, [activePackageId, captureStopLocked, liveRemoteSessionId, preferences.localVideoCapture.requestOnSos]);

  function handleStartOwnerLiveAudio() {
    if (!liveRemoteSessionId) {
      setDialog({
        title: "Aguardando anjo",
        message: "Quando um anjo entrar no pedido, você poderá chamar por aqui.",
        icon: <PhoneCall size={18} color={theme.colors.primary} />,
        actions: [{ label: "Entendi" }]
      });
      return;
    }

    void prepareMediaForOwnerLiveCall().then(() => liveAudioCall.startOwnerAudioCall(liveRemoteSessionId));
  }

  function handleStopOwnerLiveAudio() {
    if (liveRemoteSessionId) {
      ownerAutoCallPausedSessionIdsRef.current.add(liveRemoteSessionId);
    }
    void stopOwnerLiveVideoEvidence("manual_stop").finally(() => {
      liveAudioCall.stopLiveAudioCall();
    });
  }

  useEffect(() => {
    liveAudioCallStateRef.current = liveAudioCall.state;
  }, [liveAudioCall.state]);

  useEffect(() => {
    const startDecision = resolveOwnerLiveVideoEvidenceStart({
      callSessionId: liveAudioCall.state.callSessionId,
      fallbackPackageId: mediaRecorderPackageId,
      fallbackRemoteSessionId: liveRemoteSessionId,
      packageId: activePackageId,
      remoteSessionId: liveAudioCall.state.remoteSessionId,
      role: liveAudioCall.state.role,
      status: liveAudioCall.state.status,
      streamReactTag: liveAudioCall.state.localStreamUrl
    });
    if (!startDecision.shouldStart) {
      return;
    }

    void startOwnerLiveVideoEvidence(startDecision.startInput);
  }, [
    activePackageId,
    liveAudioCall.state.callSessionId,
    liveAudioCall.state.localStreamUrl,
    liveAudioCall.state.remoteSessionId,
    liveAudioCall.state.role,
    liveAudioCall.state.status,
    liveRemoteSessionId,
    mediaRecorderPackageId
  ]);

  useEffect(() => {
    if (liveAudioCall.state.role !== "owner") return;
    const remoteSessionId = liveAudioCall.state.remoteSessionId ?? liveRemoteSessionId;
    if (!remoteSessionId) return;

    if (liveAudioCall.state.status === "connected") {
      const hasLiveVideoRecording = ownerLiveVideoRecordingRef.current?.remoteSessionId === remoteSessionId;
      updateOwnerLiveEvidence(remoteSessionId, {
        connectedAt: new Date().toISOString(),
        localEvidenceStatus: hasLiveVideoRecording ? "recording" : "metadata_only",
        packageId: activePackageId ?? mediaRecorderPackageId ?? undefined,
        status: hasLiveVideoRecording ? "recording" : "transmitting"
      });
    }

    if (liveAudioCall.state.status === "failed") {
      ownerAutoCallStartedSessionIdsRef.current.delete(remoteSessionId);
      void stopOwnerLiveVideoEvidence("call_finished");
      updateOwnerLiveEvidence(remoteSessionId, {
        endedAt: new Date().toISOString(),
        localEvidenceStatus: "failed",
        packageId: activePackageId ?? mediaRecorderPackageId ?? undefined,
        status: "failed"
      });
    }

    if (liveAudioCall.state.status === "ended") {
      ownerAutoCallStartedSessionIdsRef.current.delete(remoteSessionId);
      void stopOwnerLiveVideoEvidence("call_finished");
      updateOwnerLiveEvidence(remoteSessionId, {
        endedAt: new Date().toISOString(),
        packageId: activePackageId ?? mediaRecorderPackageId ?? undefined,
        status: "ended"
      });
    }
  }, [
    activePackageId,
    liveAudioCall.state.remoteSessionId,
    liveAudioCall.state.role,
    liveAudioCall.state.status,
    liveRemoteSessionId,
    mediaRecorderPackageId
  ]);

  useEffect(() => {
    if (activePackageId || startInProgress || mediaStopPending || finishInProgress) return;
    if (!liveRemoteSessionId && liveAudioCallStatus === "idle") return;

    ownerAutoCallPausedSessionIdsRef.current.clear();
    ownerAutoCallStartedSessionIdsRef.current.clear();
    setLiveRemoteSessionId(null);
    if (liveAudioCallStatus === "idle") {
      liveAudioCall.resetLiveAudioCall();
    } else {
      liveAudioCall.stopLiveAudioCall();
    }
  }, [
    activePackageId,
    finishInProgress,
    liveAudioCall.resetLiveAudioCall,
    liveAudioCallStatus,
    liveRemoteSessionId,
    mediaStopPending,
    startInProgress
  ]);

  useEffect(() => {
    if (!activePackageId || liveRemoteSessionId || mediaStopPending || finishInProgress) return undefined;

    let cancelled = false;

    const attemptActiveRemoteSync = (source: "retry" | "resume") => {
      if (cancelled || activeRemoteSyncInFlightRef.current || liveRemoteSessionId) return;

      activeRemoteSyncInFlightRef.current = true;
      appendMediaOperationalLog("emergency_active_remote_sync_attempt", {
        packageId: activePackageId,
        platform: Platform.OS,
        source
      });
      void getActiveEmergencyPackage()
        .then((activePackage) => {
          if (cancelled || !activePackage || activePackage.id !== activePackageId) return null;
          return syncEmergencyPackageWithApi(activePackage);
        })
        .then((syncState) => {
          if (cancelled || !syncState) return;
          applyRemoteSyncState(syncState, { source });
        })
        .catch((error) => {
          if (cancelled) return;
          appendMediaOperationalLog("emergency_active_remote_sync_error", {
            packageId: activePackageId,
            platform: Platform.OS,
            source
          }, error);
          setRecordingStatus(activeRemoteSyncRetryMessage());
        })
        .finally(() => {
          activeRemoteSyncInFlightRef.current = false;
        });
    };

    attemptActiveRemoteSync("resume");
    const retryAttempt = setInterval(() => attemptActiveRemoteSync("retry"), activeRemoteSyncRetryMs);

    return () => {
      cancelled = true;
      clearInterval(retryAttempt);
    };
  }, [activePackageId, applyRemoteSyncState, finishInProgress, liveRemoteSessionId, mediaStopPending]);

  useEffect(() => {
    if (!activePackageId || !liveRemoteSessionId || mediaStopPending || finishInProgress) return undefined;
    if (ownerAutoCallPausedSessionIdsRef.current.has(liveRemoteSessionId)) return undefined;

    let cancelled = false;

    const attemptStartOwnerLiveCall = () => {
      const currentCallState = liveAudioCallStateRef.current;
      const alreadyStarted = ownerAutoCallStartedSessionIdsRef.current.has(liveRemoteSessionId);
      if (
        !shouldAttemptOwnerAutoCall({
          alreadyStarted,
          cancelled,
          currentRemoteSessionId: currentCallState.remoteSessionId,
          currentStatus: currentCallState.status,
          inFlight: ownerAutoCallInFlightRef.current,
          liveRemoteSessionId,
          paused: false
        })
      ) {
        return;
      }

      ownerAutoCallInFlightRef.current = true;
      setRecordingStatus(ownerAutoCallAttemptMessage());
      appendMediaOperationalLog("emergency_live_call_auto_start_attempt", {
        platform: Platform.OS,
        remoteSessionId: liveRemoteSessionId
      });
      void listAcceptedLiveRecipients(liveRemoteSessionId)
        .then((recipients) => {
          const recipientStatus = ownerAutoCallRecipientStatus(recipients.length);
          setRecordingStatus(recipientStatus.message);
          if (!recipientStatus.shouldStartCall) {
            return;
          }
          return prepareMediaForOwnerLiveCall().then(async () => {
            const started = await liveAudioCall.startOwnerAudioCall(liveRemoteSessionId);
            if (started) {
              ownerAutoCallStartedSessionIdsRef.current.add(liveRemoteSessionId);
            }
            return started;
          });
        })
        .catch((error) => {
          appendMediaOperationalLog("emergency_live_call_auto_start_error", {
            platform: Platform.OS,
            remoteSessionId: liveRemoteSessionId
          }, error);
        })
        .finally(() => {
          ownerAutoCallInFlightRef.current = false;
        });
    };

    const firstAttempt = setTimeout(attemptStartOwnerLiveCall, ownerLiveCallAutoStartDelayMs);
    const retryAttempt = setInterval(attemptStartOwnerLiveCall, ownerLiveCallAutoRetryMs);

    return () => {
      cancelled = true;
      clearTimeout(firstAttempt);
      clearInterval(retryAttempt);
    };
  }, [
    activePackageId,
    finishInProgress,
    liveRemoteSessionId,
    mediaStopPending,
    liveAudioCall.startOwnerAudioCall,
    prepareMediaForOwnerLiveCall
  ]);

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
        await syncPendingEmergencyPackagesWithApi().catch(() => undefined);
        await refreshOutboxCount();
      }

      void prepareScreen();
    }, [])
  );

  async function handlePanicTrigger() {
    setMenuOpen(false);

    const panicDecision = resolvePanicTriggerDecision({
      activePackageId,
      mediaStopPending: mediaStopPendingRef.current,
      preferences,
      startInProgress
    });

    switch (panicDecision) {
      case "ignore_start_in_progress":
        return;
      case "show_media_protection_progress":
        showFinishProgress({
          detail: "A camera ja foi encerrada. O app ainda esta criptografando e anexando a midia no cofre local.",
          progress: Math.max(finishProgress.progress, 58),
          status: "running",
          title: "Protegendo video"
        });
        setRecordingStatus("Protecao do video local em andamento. O cofre sera atualizado automaticamente.");
        return;
      case "finish_active_call":
        requestFinishActiveCall();
        return;
      case "request_recording_consent":
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
      case "start_emergency_package":
        break;
    }

    setRecordingStatus("Pedindo ajuda...");
    liveAudioCall.resetLiveAudioCall();
    setLiveRemoteSessionId(null);
    ownerAutoCallPausedSessionIdsRef.current.clear();
    ownerAutoCallStartedSessionIdsRef.current.clear();
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
        trustedContactIds: (await listAcceptedOwnerRelationshipsForDelivery()).slice(0, 1).map((relationship) => relationship.id),
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
      void syncEmergencyPackageWithApi(result.packageRecord)
        .then((syncState) => {
          appendMediaOperationalLog("emergency_remote_sync_start_result", {
            platform: Platform.OS,
            recipientCount: syncState.recipientCount,
            remoteSessionCreated: Boolean(syncState.remoteSessionId),
            status: syncState.status
          });
          applyRemoteSyncState(syncState, { locationText, source: "initial" });
        })
        .catch((error) => {
          appendMediaOperationalLog("emergency_remote_sync_start_error", {
            platform: Platform.OS
          }, error);
        });

      const recordingDurationLabel =
        preferences.defaultDurationSeconds === 0 ? "ilimitada" : formatDuration(preferences.defaultDurationSeconds);
      setRecordingStatus(
        `Você pediu ajuda. Gravacao ${recordingDurationLabel}. ${locationText} Arquivo no cofre local.`
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
    const remoteSessionIdToFinish = liveAudioCall.state.remoteSessionId ?? liveRemoteSessionId;
    const mediaWasHandedToLiveCall = captureStopLocked || Boolean(ownerLiveVideoRecordingRef.current) || Boolean(ownerLiveVideoStartRequestRef.current);
    const liveVideoAttachedAsset = await stopOwnerLiveVideoEvidence("finish");
    liveAudioCall.resetLiveAudioCall();
    if (remoteSessionIdToFinish) {
      ownerAutoCallPausedSessionIdsRef.current.delete(remoteSessionIdToFinish);
      ownerAutoCallStartedSessionIdsRef.current.delete(remoteSessionIdToFinish);
    }
    setLiveRemoteSessionId(null);
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
      mediaStopPurposeRef.current = "finish";
      const stopSerial = mediaWasHandedToLiveCall ? null : signalMediaRecorderStop();
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
              ? "Midia criptografada. A finalizacao do pacote pode seguir em segundo plano."
              : "Camera liberada. Confirmando se o pacote ja recebeu midia preservada.",
          progress: stopResult.status === "attached" ? 72 : 48,
          status: stopResult.status === "attached" ? "background" : "running",
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

      await queueEmergencyPackageForRemoteSync(result.packageRecord);
      showFinishProgress({
        detail: "Confirmando o encerramento seguro com a central.",
        progress: 86,
        status: "running",
        title: "Sincronizando chamado"
      });
      let remoteFinishState: EmergencyRemoteSyncState | undefined;
      if (remoteSessionIdToFinish) {
        const directFinishState = await finishRemoteEmergencySessionForPackage(
          result.packageRecord,
          remoteSessionIdToFinish
        );
        if (directFinishState.remoteFinishStatus === "finished") {
          remoteFinishState = directFinishState;
        } else {
          const retryStates = await syncPendingEmergencyPackagesWithApi();
          remoteFinishState =
            retryStates.find((state) => state.packageId === packageId) ?? directFinishState;
        }
      } else {
        const syncStates = await syncPendingEmergencyPackagesWithApi();
        remoteFinishState = syncStates.find((state) => state.packageId === packageId);
      }
      if (remoteFinishState?.remoteFinishStatus === "failed") {
        appendMediaOperationalLog("emergency_remote_finish_sync_error", {
          packageId,
          platform: Platform.OS,
          remoteFinishReason: remoteFinishState.remoteFinishReason,
          remoteSessionId: remoteSessionIdToFinish ?? remoteFinishState.remoteSessionId
        });
      }
      const remoteFinishFailed = remoteFinishState?.remoteFinishStatus === "failed";

      const attachedAssetsAfterFinish =
        result.packageRecord.media.status === "recorded_local" ? result.packageRecord.media.assets.length : 0;
      appendMediaOperationalLog("emergency_finish_package_result", {
        attachedAssetCount: attachedAssetsAfterFinish,
        liveVideoAttached: Boolean(liveVideoAttachedAsset),
        mediaRecorded: result.packageRecord.media.status === "recorded_local",
        platform: Platform.OS
      });
      const finishOutcome = resolveFinishOutcomePolicy({
        attachedAssetsAfterFinish,
        liveVideoAttached: Boolean(liveVideoAttachedAsset),
        mediaWasHandedToLiveCall,
        remoteFinishFailed,
        stopResultStatus: stopResult?.status,
        stopSerialPresent: Boolean(stopSerial)
      });
      updateOwnerLiveEvidence(remoteSessionIdToFinish, {
        endedAt: new Date().toISOString(),
        localEvidenceStatus: finishOutcome.localEvidenceStatus,
        packageId,
        status: finishOutcome.localEvidenceStatus
      });
      recordOwnerLiveAuditMarker(remoteSessionIdToFinish, finishOutcome.auditMarker, {
        connectionState: "ended",
        localEvidenceStatus: finishOutcome.localEvidenceStatus
      });
      setRecordingStatus(finishOutcome.recordingStatus);
      if (finishOutcome.diagnosticReason) {
        await persistFinishNoMediaDiagnostic(packageId, finishOutcome.diagnosticReason);
      }
      showFinishProgress(finishOutcome.finishProgress);
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
      if (mediaStopPurposeRef.current === "finish") {
        mediaStopPurposeRef.current = null;
      }
      setCaptureStopLocked(false);
      setMediaStopPendingState(false);
      finishInProgressRef.current = false;
      setFinishInProgress(false);
    }
  }

  function handleMediaStopRequestSettled(serial: number, result: MediaStopRequestResult) {
    if (serial <= 0 || serial !== stopRecordingRequestSerialRef.current) return;

    resolveMediaReleaseWaiter();
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

  const liveCallPanelVisible = Boolean(activePackageId && (liveRemoteSessionId || liveAudioCallStatus !== "idle"));

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
            avoidLiveAudioPanel={liveCallPanelVisible}
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
              label={panicButtonLabel({ activePackageId, finishInProgress, mediaStopPending, startInProgress })}
              holdMs={preferences.inAppHoldMs}
              onTrigger={handlePanicTrigger}
            />
            {!liveCallPanelVisible ? (
              <View
                accessibilityLiveRegion="polite"
                accessibilityRole="text"
                style={[
                  styles.statusBand,
                  activePackageId || startInProgress || mediaStopPending
                    ? styles.statusBandActive
                    : styles.statusBandIdle
                ]}
              >
                <Text numberOfLines={3} style={styles.statusBandText}>
                  {recordingStatus}
                </Text>
              </View>
            ) : null}
          </View>

          {liveCallPanelVisible ? (
            <LiveAudioCallPanel
              actionLabel="Chamar anjo"
              disabled={!activePackageId || !liveRemoteSessionId || mediaStopPending || finishInProgress}
              onPrimaryAction={handleStartOwnerLiveAudio}
              onStop={handleStopOwnerLiveAudio}
              state={liveAudioCall.state}
            />
          ) : null}

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
    gap: theme.spacing.md,
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
  finishProgressBackdropPressArea: {
    ...StyleSheet.absoluteFillObject
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
    zIndex: 1,
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
  },
  statusBand: {
    alignItems: "center",
    alignSelf: "stretch",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  statusBandActive: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderColor: theme.colors.primary
  },
  statusBandIdle: {
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderColor: theme.colors.border
  },
  statusBandText: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontWeight: "900",
    lineHeight: 19,
    textAlign: "center"
  }
});
