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
import { resolveEmergencyCallHeroPresentation } from "@/features/emergency-home/emergencyCallHeroPolicy";
import { EmergencySettingsDrawer } from "@/features/emergency-home/EmergencySettingsDrawer";
import { EmergencyTopBar } from "@/features/emergency-home/EmergencyTopBar";
import {
  resolveEmergencyStartPresentation,
  resolveEmergencyStartRequestPolicy
} from "@/features/emergency-home/emergencyStartPolicy";
import { resolveEmergencyCallConfirmation } from "@/features/emergency-home/emergencyCallConfirmationPolicy";
import { resolveEmergencyHomeActivityPresentation } from "@/features/emergency-home/emergencyHomeActivityPolicy";
import { resolveEmergencyStartCreatedActions } from "@/features/emergency-home/emergencyStartCreatedActionsPolicy";
import { resolveEmergencyStartFailureActions } from "@/features/emergency-home/emergencyStartFailureActionsPolicy";
import {
  resolveEmergencyStartRemoteSyncErrorActions,
  resolveEmergencyStartRemoteSyncResultActions
} from "@/features/emergency-home/emergencyStartRemoteSyncActionsPolicy";
import { resolveEmergencyStartRuntimeActions } from "@/features/emergency-home/emergencyStartRuntimePolicy";
import { resolveFinishActiveCallCleanup } from "@/features/emergency-home/finishActiveCallCleanupPolicy";
import { resolveFinishActiveCallRuntimeStartActions } from "@/features/emergency-home/finishActiveCallRuntimeStartPolicy";
import { resolveFinishActiveCallStart } from "@/features/emergency-home/finishActiveCallStartPolicy";
import {
  resolveFinishRemoteSyncProgress,
  resolveMediaProtectionInProgress
} from "@/features/emergency-home/finishFlowProgressPolicy";
import { resolveFinishCodeConfirmationActions } from "@/features/emergency-home/finishCodeConfirmationActionsPolicy";
import { resolveFinishCodeConfirmationDecision } from "@/features/emergency-home/finishCodePolicy";
import {
  resolveFinishCompletionConfirmationFormPatch,
  resolveFinishRequestConfirmationFormPatch,
  shouldFinishImmediatelyAfterRequest,
  type FinishConfirmationFormPatch
} from "@/features/emergency-home/finishConfirmationFormPolicy";
import { resolveFinishConfirmationDialogPresentation } from "@/features/emergency-home/finishConfirmationDialogPolicy";
import { resolveFinishFailureActions } from "@/features/emergency-home/finishFailureActionsPolicy";
import { resolveFinishMediaStopResultActions } from "@/features/emergency-home/finishMediaStopResultPolicy";
import { resolveFinishMediaStopStartActions } from "@/features/emergency-home/finishMediaStopStartPolicy";
import { resolveFinishMissingPackageActions } from "@/features/emergency-home/finishMissingPackagePolicy";
import { resolveFinishOutcomeInput } from "@/features/emergency-home/finishOutcomeInputPolicy";
import { resolveFinishOutcomePolicy } from "@/features/emergency-home/finishOutcomePolicy";
import { resolveFinishOwnerCompletionActions } from "@/features/emergency-home/finishOwnerCompletionPolicy";
import { resolveFinishPackageResult } from "@/features/emergency-home/finishPackageResultPolicy";
import { resolveFinishPostOutcomeActions } from "@/features/emergency-home/finishPostOutcomeActionsPolicy";
import { resolveFinishProgressDialogPresentation } from "@/features/emergency-home/finishProgressDialogPolicy";
import {
  resolveFinishRemoteSyncMode,
  resolveFinishRemoteSyncStartActions,
  resolveRemoteFinishFailureLog,
  resolveRemoteFinishStateAfterDirect,
  resolveRemoteFinishStateFromSync,
  shouldRetryRemoteFinishAfterDirect
} from "@/features/emergency-home/finishRemoteSyncPolicy";
import { resolveFinishRequestDecision } from "@/features/emergency-home/finishRequestPolicy";
import {
  idleFinishProgressState,
  resolveClosedFinishProgressState,
  resolveNextFinishProgressState,
  resolveVaultOpeningFinishProgressState,
  type FinishProgressStateSnapshot
} from "@/features/emergency-home/finishProgressStatePolicy";
import { resolveEmergencyHomeNavigationTarget } from "@/features/emergency-home/homeNavigationPolicy";
import { resolveLiveCallCleanupActions } from "@/features/emergency-home/liveCallCleanupActionsPolicy";
import { resolveLiveCallCleanupDecision } from "@/features/emergency-home/liveCallCleanupPolicy";
import { resolveLiveCallPanelPolicy } from "@/features/emergency-home/liveCallPanelPolicy";
import {
  initialLocalSosPackageStatus,
  resolveLocalSosPackageStatus
} from "@/features/emergency-home/localSosPackageStatusPolicy";
import {
  resolveInterruptedRecoveryFinishProgress,
  resolveInterruptedResidueRecoveryProgress
} from "@/features/emergency-home/interruptedRecoveryProgressPolicy";
import { resolveMediaHandoffPolicy } from "@/features/emergency-home/mediaHandoffPolicy";
import {
  resolveMediaHandoffReleaseCleanupActions,
  resolveMediaHandoffReleaseCompletionActions,
  resolveMediaHandoffReleaseWaitActions
} from "@/features/emergency-home/mediaHandoffReleaseActionsPolicy";
import { resolveMediaHandoffStartActions } from "@/features/emergency-home/mediaHandoffStartActionsPolicy";
import {
  resolveMediaProcessingPresentation,
  resolveMediaStopSettlementFinishProgress,
  shouldResolveMediaReleaseWaiter
} from "@/features/emergency-home/mediaProcessingStatusPolicy";
import {
  resolveMediaReleaseWaiterStart
} from "@/features/emergency-home/mediaReleaseWaiterPolicy";
import { resolveMediaReleaseTimeoutActions } from "@/features/emergency-home/mediaReleaseTimeoutActionsPolicy";
import { resolveMediaReleaseWaiterCompletion } from "@/features/emergency-home/mediaReleaseWaiterCompletionPolicy";
import { resolveMediaStopPendingState } from "@/features/emergency-home/mediaStopPendingPolicy";
import {
  resolveMediaStopTimeout,
  resolveMediaStopWaiterStart
} from "@/features/emergency-home/mediaStopWaiterPolicy";
import { resolveMediaStopSignal } from "@/features/emergency-home/mediaStopSignalPolicy";
import { resolveMediaStopPendingRequestCompletion } from "@/features/emergency-home/mediaStopPendingRequestCompletionPolicy";
import { resolveMediaStopSettledActions } from "@/features/emergency-home/mediaStopSettledActionsPolicy";
import { resolveOwnerAutoCallAttemptActions } from "@/features/emergency-home/ownerAutoCallAttemptActionsPolicy";
import {
  resolveOwnerAutoCallErrorActions,
  resolveOwnerAutoCallFinallyActions,
  resolveOwnerAutoCallRecipientActions,
  resolveOwnerAutoCallStartResultActions
} from "@/features/emergency-home/ownerAutoCallResultActionsPolicy";
import { resolveOwnerLiveAuditMarkerActions } from "@/features/emergency-home/ownerLiveAuditMarkerActionsPolicy";
import {
  resolveOwnerLiveAuditMarkerInput,
  type OwnerLiveAuditMarkerEvent,
  type OwnerLiveAuditMarkerOptions
} from "@/features/emergency-home/ownerLiveAuditMarkerPolicy";
import {
  resolveOwnerLiveEvidenceUpdate,
  type OwnerLiveEvidenceUpdateOptions
} from "@/features/emergency-home/ownerLiveEvidenceUpdatePolicy";
import {
  resolveOwnerLiveCallLifecycle,
  resolveOwnerLiveVideoEvidenceStart
} from "@/features/emergency-home/ownerLiveEvidencePolicy";
import { resolveOwnerLiveCallLifecycleActions } from "@/features/emergency-home/ownerLiveCallLifecycleActionsPolicy";
import {
  resolveOwnerLiveVideoPreserveCompletionActions,
  resolveOwnerLiveVideoPreserveErrorActions,
  resolveOwnerLiveVideoPreserveStoppedActions,
  type OwnerLiveVideoPreserveReason
} from "@/features/emergency-home/ownerLiveVideoPreserveOutcomePolicy";
import { resolveOwnerLiveVideoPreserveRequest } from "@/features/emergency-home/ownerLiveVideoPreserveRequestPolicy";
import { resolveOwnerLiveVideoStartOutcomeActions } from "@/features/emergency-home/ownerLiveVideoStartOutcomePolicy";
import { resolveOwnerLiveVideoStartRequest } from "@/features/emergency-home/ownerLiveVideoStartRequestPolicy";
import { resolveLiveCallWaitingDialogPresentation } from "@/features/emergency-home/liveCallWaitingDialogPolicy";
import { panicButtonLabel, resolvePanicTriggerDecision } from "@/features/emergency-home/panicTriggerPolicy";
import { resolveProtectedRouteAccessDecision } from "@/features/emergency-home/protectedRouteAccessPolicy";
import { resolveProtectedRouteCodeDecision } from "@/features/emergency-home/protectedRouteCodePolicy";
import { resolveProtectedRouteDialogPresentation } from "@/features/emergency-home/protectedRouteDialogPolicy";
import {
  resolveProtectedRouteClosedFormPatch,
  resolveProtectedRouteRequestFormPatch,
  type ProtectedRouteFormPatch
} from "@/features/emergency-home/protectedRouteFormPolicy";
import { resolveProtectedRouteUnlockActions } from "@/features/emergency-home/protectedRouteUnlockActionsPolicy";
import { resolveRecordingConsentDialogPresentation } from "@/features/emergency-home/recordingConsentDialogPolicy";
import { resolveActiveRemoteSyncStatus } from "@/features/emergency-home/remoteSyncStatusPolicy";
import { resolveActiveRemoteSyncAttemptActions, type ActiveRemoteSyncAttemptSource } from "@/features/emergency-home/activeRemoteSyncAttemptActionsPolicy";
import {
  resolveActiveRemoteSyncFailureActions,
  resolveActiveRemoteSyncFinallyActions,
  resolveActiveRemoteSyncPackageActions,
  resolveActiveRemoteSyncResultActions
} from "@/features/emergency-home/activeRemoteSyncCompletionActionsPolicy";
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
  getEmergencyPreferences
} from "@/features/emergency/emergencyPreferences";
import { LiveAudioCallPanel } from "@/features/live-call/LiveAudioCallPanel";
import {
  beginOwnerLiveCallEvidence,
  updateOwnerLiveCallEvidenceRecord,
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

type FinishProgressState = FinishProgressStateSnapshot;

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
function EmergencyRecordingWakeLock() {
  useKeepAwake("sinalseguro.emergency-recording", { suppressDeactivateWarnings: true });
  return null;
}

function CallNumberHero({ onPress, target }: { onPress: () => void; target: EmergencyCallTarget }) {
  const presentation = resolveEmergencyCallHeroPresentation(target);
  return (
    <Pressable
      accessibilityHint={presentation.accessibilityHint}
      accessibilityLabel={presentation.accessibilityLabel}
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
  const presentation = resolveFinishProgressDialogPresentation({
    progress: state.progress,
    status: state.status
  });
  const accentColor =
    presentation.accentTone === "danger"
      ? theme.colors.danger
      : presentation.accentTone === "warning"
        ? theme.colors.warning
        : theme.colors.secure;
  const icon =
    presentation.iconKind === "video_off" ? (
      <VideoOff size={19} color={accentColor} />
    ) : (
      <ShieldCheck size={19} color={accentColor} />
    );

  function closeIfAllowed() {
    if (presentation.canDismiss) onClose();
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
              <Text style={styles.finishProgressPercent}>{Math.round(presentation.normalizedProgress)}%</Text>
            </View>
          </View>

          <View style={styles.finishProgressTrack}>
            <View style={[styles.finishProgressFill, { backgroundColor: accentColor, width: `${presentation.normalizedProgress}%` }]} />
          </View>

          <Text style={styles.finishProgressDetail}>{state.detail}</Text>

          {presentation.shouldShowPendingRow ? (
            <View style={styles.finishProgressPendingRow}>
              <ActivityIndicator color={theme.colors.primary} size="small" />
              <Text style={styles.finishProgressPendingText}>{presentation.pendingText}</Text>
            </View>
          ) : (
            <View style={styles.finishProgressActions}>
              <Pressable
                accessibilityLabel={presentation.mutedActionAccessibilityLabel}
                accessibilityRole="button"
                onPress={onClose}
                style={({ pressed }) => [styles.finishProgressActionMuted, pressed && styles.finishProgressActionPressed]}
              >
                <Text style={styles.finishProgressActionMutedText}>{presentation.mutedActionLabel}</Text>
              </Pressable>
              <Pressable
                accessibilityLabel={presentation.primaryActionAccessibilityLabel}
                accessibilityRole="button"
                onPress={onOpenVault}
                style={({ pressed }) => [styles.finishProgressActionPrimary, pressed && styles.finishProgressActionPressed]}
              >
                <Text style={styles.finishProgressActionPrimaryText}>{presentation.primaryActionLabel}</Text>
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
  const [recordingStatus, setRecordingStatus] = useState(initialLocalSosPackageStatus);
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
    setRecordingStatus(resolveLocalSosPackageStatus({ attachedAssetCount, event: "interrupted_recovered" }));
    showFinishProgress(resolveInterruptedRecoveryFinishProgress(attachedAssetCount));
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
    showFinishProgress(resolveInterruptedResidueRecoveryProgress());

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
    const target = resolveEmergencyHomeNavigationTarget(route, panel);
    if (target.kind === "with_panel") {
      router.push({ pathname: target.pathname, params: target.params });
      return;
    }
    router.push(target.route);
  }

  function closeFinishProgress() {
    setFinishProgress((current) => resolveClosedFinishProgressState(current));
  }

  function openVaultFromFinishProgress() {
    setFinishProgress((current) => resolveVaultOpeningFinishProgressState(current));
    void openRouteAsync("/arquivos", "cofre");
  }

  function applyFinishConfirmationFormPatch(patch: FinishConfirmationFormPatch) {
    if (patch.finishConfirmationOpen !== undefined) {
      setFinishConfirmationOpen(patch.finishConfirmationOpen);
    }
    if (patch.finishCodeInput !== undefined) {
      setFinishCodeInput(patch.finishCodeInput);
    }
    if (patch.finishError !== undefined) {
      setFinishError(patch.finishError);
    }
  }

  function applyProtectedRouteFormPatch(patch: ProtectedRouteFormPatch) {
    if (patch.menuOpen !== undefined) {
      setMenuOpen(patch.menuOpen);
    }
    if ("protectedRouteRequest" in patch) {
      setProtectedRouteRequest(patch.protectedRouteRequest ?? null);
    }
    if (patch.protectedRouteCodeInput !== undefined) {
      setProtectedRouteCodeInput(patch.protectedRouteCodeInput);
    }
    if (patch.protectedRouteError !== undefined) {
      setProtectedRouteError(patch.protectedRouteError);
    }
  }

  function setMediaStopPendingState(value: boolean) {
    const decision = resolveMediaStopPendingState(value, { clearMediaRecorderPackageIdOnRelease: true });
    mediaStopPendingRef.current = decision.mediaStopPending;
    setMediaStopPending(decision.mediaStopPending);
    if (decision.shouldClearMediaRecorderPackageId) {
      setMediaRecorderPackageId(null);
    }
  }

  function setMediaStopPendingFlag(value: boolean) {
    const decision = resolveMediaStopPendingState(value);
    mediaStopPendingRef.current = decision.mediaStopPending;
    setMediaStopPending(decision.mediaStopPending);
  }

  function resolveMediaReleaseWaiter() {
    const waiter = pendingMediaReleaseRequestRef.current;
    const completionDecision = resolveMediaReleaseWaiterCompletion(Boolean(waiter));
    if (!completionDecision.shouldResolvePendingRequest) return;

    if (waiter && completionDecision.shouldClearTimeout) {
      clearTimeout(waiter.timeout);
    }
    if (completionDecision.shouldClearPendingRequest) {
      pendingMediaReleaseRequestRef.current = null;
    }
    if (waiter) {
      waiter.resolve();
    }
  }

  function waitForMediaRecorderRelease() {
    const previousRequest = pendingMediaReleaseRequestRef.current;
    const startDecision = resolveMediaReleaseWaiterStart(Boolean(previousRequest));
    if (previousRequest && startDecision.shouldResolvePreviousRequest) {
      clearTimeout(previousRequest.timeout);
      previousRequest.resolve();
    }

    return new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        const timeoutDecision = resolveMediaReleaseTimeoutActions({
          hasPendingRequest: Boolean(pendingMediaReleaseRequestRef.current),
          platform: Platform.OS,
          timeoutMs: mediaReleaseForLiveCallWaitTimeoutMs
        });
        if (timeoutDecision.shouldClearPendingRequest) {
          pendingMediaReleaseRequestRef.current = null;
        }
        appendMediaOperationalLog(timeoutDecision.logEvent, timeoutDecision.logPayload);
        if (timeoutDecision.shouldResolvePendingRequest) {
          resolve();
        }
      }, mediaReleaseForLiveCallWaitTimeoutMs);

      pendingMediaReleaseRequestRef.current = {
        resolve,
        timeout
      };
    });
  }

  function showFinishProgress(nextState: Partial<FinishProgressState>) {
    setFinishProgress((current) => resolveNextFinishProgressState(current, nextState));
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
    options: OwnerLiveEvidenceUpdateOptions
  ) {
    const updateDecision = resolveOwnerLiveEvidenceUpdate({ options, remoteSessionId });
    if (!updateDecision.shouldUpdate) return;
    void updateOwnerLiveCallEvidenceRecord(updateDecision.remoteSessionId, updateDecision.options).catch(() => undefined);
  }

  function recordOwnerLiveAuditMarker(
    remoteSessionId: string | null | undefined,
    event: OwnerLiveAuditMarkerEvent,
    options?: OwnerLiveAuditMarkerOptions
  ) {
    const auditMarkerActions = resolveOwnerLiveAuditMarkerActions({ event, options, remoteSessionId });
    if (!auditMarkerActions.shouldRecord) return;
    void deviceBindingService.getRegisteredApiDeviceId().then((deviceId) =>
      recordLiveAuditMarker(
        auditMarkerActions.remoteSessionId,
        resolveOwnerLiveAuditMarkerInput({
          deviceId,
          event: auditMarkerActions.event,
          options: auditMarkerActions.options
        })
      )
    ).catch(() => undefined);
  }

  async function startOwnerLiveVideoEvidence(input: {
    callSessionId?: string;
    packageId: string;
    remoteSessionId: string;
    streamReactTag: string;
  }) {
    const activeRecording = ownerLiveVideoRecordingRef.current;
    const activeStartRequest = ownerLiveVideoStartRequestRef.current;
    const startRequestDecision = resolveOwnerLiveVideoStartRequest({
      activeRecordingRemoteSessionId: activeRecording?.remoteSessionId,
      pendingStartPackageId: activeStartRequest?.packageId,
      pendingStartRemoteSessionId: activeStartRequest?.remoteSessionId,
      requestPackageId: input.packageId,
      requestRemoteSessionId: input.remoteSessionId
    });
    if (activeRecording && startRequestDecision.shouldReturnActiveRecording) return activeRecording;
    if (activeStartRequest && startRequestDecision.shouldReturnPendingStart) {
      return activeStartRequest.promise;
    }
    if (activeRecording && startRequestDecision.shouldStopActiveRecording) {
      await stopOwnerLiveVideoEvidence("replace_recording");
    }

    let startPromise!: Promise<OwnerLiveVideoRecording | null>;
    startPromise = (async () => {
      try {
        const recording = await startOwnerLiveVideoRecording(input);
        const startOutcomeActions = resolveOwnerLiveVideoStartOutcomeActions({
          outcome: recording ? "recording_started" : "metadata_only",
          packageId: input.packageId,
          platform: Platform.OS,
          remoteSessionId: input.remoteSessionId
        });
        if (!recording) {
          updateOwnerLiveEvidence(input.remoteSessionId, startOutcomeActions.evidenceUpdate);
          return null;
        }
        if (startOutcomeActions.shouldStoreActiveRecording) {
          ownerLiveVideoRecordingRef.current = recording;
        }
        updateOwnerLiveEvidence(input.remoteSessionId, startOutcomeActions.evidenceUpdate);
        if (startOutcomeActions.auditMarker) {
          recordOwnerLiveAuditMarker(
            input.remoteSessionId,
            startOutcomeActions.auditMarker.event,
            startOutcomeActions.auditMarker.options
          );
        }
        if (startOutcomeActions.recordingStatusInput) {
          setRecordingStatus(resolveLocalSosPackageStatus(startOutcomeActions.recordingStatusInput));
        }
        return recording;
      } catch (error) {
        const startErrorActions = resolveOwnerLiveVideoStartOutcomeActions({
          outcome: "start_error",
          packageId: input.packageId,
          platform: Platform.OS,
          remoteSessionId: input.remoteSessionId
        });
        if (startErrorActions.log) {
          appendMediaOperationalLog(startErrorActions.log.event, startErrorActions.log.payload, error);
        }
        updateOwnerLiveEvidence(input.remoteSessionId, startErrorActions.evidenceUpdate);
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

  async function stopOwnerLiveVideoEvidence(reason: OwnerLiveVideoPreserveReason) {
    const initialPreserveDecision = resolveOwnerLiveVideoPreserveRequest({
      hasActiveRecording: Boolean(ownerLiveVideoRecordingRef.current),
      hasPendingStart: Boolean(ownerLiveVideoStartRequestRef.current),
      preserveInFlight: ownerLiveVideoPreserveInFlightRef.current,
      preservePromiseActive: Boolean(ownerLiveVideoPreservePromiseRef.current)
    });
    if (initialPreserveDecision.shouldReturnPreservePromise && ownerLiveVideoPreservePromiseRef.current) {
      return ownerLiveVideoPreservePromiseRef.current;
    }

    const pendingStart = ownerLiveVideoStartRequestRef.current;
    let recording = ownerLiveVideoRecordingRef.current;
    if (initialPreserveDecision.shouldAwaitPendingStart && pendingStart) {
      recording = await pendingStart.promise;
    }
    const preserveDecision = resolveOwnerLiveVideoPreserveRequest({
      hasActiveRecording: Boolean(recording),
      hasPendingStart: false,
      preserveInFlight: ownerLiveVideoPreserveInFlightRef.current,
      preservePromiseActive: false
    });
    if (!recording || !preserveDecision.shouldStartPreserve) return null;

    const recordingToPreserve = recording;
    ownerLiveVideoRecordingRef.current = null;
    ownerLiveVideoPreserveInFlightRef.current = true;
    let preservePromise!: Promise<PreservedLiveVideoAsset | null>;
    preservePromise = (async () => {
      try {
        const result = await stopOwnerLiveVideoRecording(recordingToPreserve);
        const stoppedActions = resolveOwnerLiveVideoPreserveStoppedActions({
          audioCaptured: result?.audioCaptured,
          completedAt: result?.completedAt,
          frameCount: result?.frameCount,
          packageId: recordingToPreserve.packageId,
          platform: Platform.OS,
          reason,
          remoteSessionId: recordingToPreserve.remoteSessionId,
          requestedCameraMode: preferences.localVideoCapture.cameraMode,
          sizeBytes: result?.sizeBytes,
          sourceUri: result?.sourceUri,
          startedAt: result?.startedAt
        });
        if (!stoppedActions.shouldPreserve) return null;

        appendMediaOperationalLog(stoppedActions.preserveStartLog.event, stoppedActions.preserveStartLog.payload);
        const attachedAsset = await preserveLocalVideoAsset(stoppedActions.preserveAssetInput);
        const completionActions = resolveOwnerLiveVideoPreserveCompletionActions({
          assetCreated: Boolean(attachedAsset),
          audioCaptured: stoppedActions.audioCaptured,
          completedAt: stoppedActions.completedAt,
          packageId: recordingToPreserve.packageId,
          platform: Platform.OS,
          reason,
          remoteSessionId: recordingToPreserve.remoteSessionId
        });
        updateOwnerLiveEvidence(recordingToPreserve.remoteSessionId, completionActions.evidenceUpdate);
        recordOwnerLiveAuditMarker(
          recordingToPreserve.remoteSessionId,
          completionActions.auditMarker.event,
          completionActions.auditMarker.options
        );
        setRecordingStatus(
          resolveLocalSosPackageStatus(completionActions.recordingStatusInput)
        );
        appendMediaOperationalLog(completionActions.successLog.event, completionActions.successLog.payload);
        return attachedAsset;
      } catch (error) {
        const errorActions = resolveOwnerLiveVideoPreserveErrorActions({
          packageId: recordingToPreserve.packageId,
          platform: Platform.OS,
          reason,
          remoteSessionId: recordingToPreserve.remoteSessionId
        });
        appendMediaOperationalLog(errorActions.errorLog.event, errorActions.errorLog.payload, error);
        updateOwnerLiveEvidence(recordingToPreserve.remoteSessionId, errorActions.evidenceUpdate);
        recordOwnerLiveAuditMarker(
          recordingToPreserve.remoteSessionId,
          errorActions.auditMarker.event,
          errorActions.auditMarker.options
        );
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
    const accessDecision = resolveProtectedRouteAccessDecision({
      protectedAccessUnlocked: await isProtectedAccessUnlocked(),
      requireSecurityCode: preferences.finishSafety.requireCode
    });

    if (accessDecision === "request_security_code") {
      applyProtectedRouteFormPatch(resolveProtectedRouteRequestFormPatch({ route, panel }));
      return;
    }

    navigateRoute(route, panel);
  }

  function confirmEmergencyCall(target: EmergencyCallTarget) {
    const confirmation = resolveEmergencyCallConfirmation(target);
    const callTarget = () => {
      void Linking.openURL(target.callUri);
    };

    setDialog({
      title: confirmation.title,
      message: confirmation.message,
      children: <CallNumberHero target={target} onPress={callTarget} />,
      icon: <PhoneCall size={18} color={theme.colors.primary} />,
      actions: [
        { label: confirmation.cancelLabel, tone: "muted" },
        {
          label: confirmation.confirmLabel,
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
    const startActions = resolveMediaHandoffStartActions({
      packageId,
      platform: Platform.OS,
      stage: mediaHandoff.start
    });
    mediaStopPurposeRef.current = startActions.mediaStopPurpose;
    if (startActions.recordingStatus) {
      setRecordingStatus(startActions.recordingStatus);
    }
    updateOwnerLiveEvidence(liveRemoteSessionId, startActions.evidenceUpdate);
    recordOwnerLiveAuditMarker(liveRemoteSessionId, startActions.auditMarker.event, startActions.auditMarker.options);
    appendMediaOperationalLog(startActions.log.event, startActions.log.payload);

    const stopSerial = signalMediaRecorderStop();
    setCaptureStopLocked(startActions.captureStopLocked);
    setMediaRecorderPackageId(startActions.mediaRecorderPackageId);

    const releaseWaitActions = resolveMediaHandoffReleaseWaitActions({ stopSerial });
    if (!releaseWaitActions.shouldWaitForRelease) {
      mediaStopPurposeRef.current = null;
      return;
    }

    setMediaStopPendingFlag(releaseWaitActions.shouldSetPending);
    try {
      await waitForMediaRecorderRelease();
      const completionActions = resolveMediaHandoffReleaseCompletionActions({
        packageId,
        platform: Platform.OS,
        stage: mediaHandoff.complete,
        stopSerial: releaseWaitActions.stopSerial
      });
      updateOwnerLiveEvidence(liveRemoteSessionId, completionActions.evidenceUpdate);
      recordOwnerLiveAuditMarker(
        liveRemoteSessionId,
        completionActions.auditMarker.event,
        completionActions.auditMarker.options
      );
      appendMediaOperationalLog(completionActions.log.event, completionActions.log.payload);
    } finally {
      const cleanupActions = resolveMediaHandoffReleaseCleanupActions({ packageId });
      setMediaStopPendingFlag(cleanupActions.mediaStopPending);
      setMediaRecorderPackageId(cleanupActions.mediaRecorderPackageId);
      if (cleanupActions.shouldClearPurpose) {
        mediaStopPurposeRef.current = null;
      }
    }
  }, [activePackageId, captureStopLocked, liveRemoteSessionId, preferences.localVideoCapture.requestOnSos]);

  function handleStartOwnerLiveAudio() {
    if (!liveRemoteSessionId) {
      const waitingDialog = resolveLiveCallWaitingDialogPresentation();
      setDialog({
        title: waitingDialog.title,
        message: waitingDialog.message,
        icon: <PhoneCall size={18} color={theme.colors.primary} />,
        actions: [{ label: waitingDialog.confirmLabel }]
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
    const lifecycleDecision = resolveOwnerLiveCallLifecycle({
      activeRecordingRemoteSessionId: ownerLiveVideoRecordingRef.current?.remoteSessionId,
      fallbackPackageId: mediaRecorderPackageId,
      fallbackRemoteSessionId: liveRemoteSessionId,
      packageId: activePackageId,
      remoteSessionId: liveAudioCall.state.remoteSessionId,
      role: liveAudioCall.state.role,
      status: liveAudioCall.state.status
    });
    const lifecycleActions = resolveOwnerLiveCallLifecycleActions({
      decision: lifecycleDecision,
      timestamp: new Date().toISOString()
    });
    if (!lifecycleActions.shouldApply) return;

    if (lifecycleActions.shouldClearStartedSession && lifecycleActions.clearStartedSessionId) {
      ownerAutoCallStartedSessionIdsRef.current.delete(lifecycleActions.clearStartedSessionId);
    }
    if (lifecycleActions.shouldStopLiveVideoEvidence && lifecycleActions.stopLiveVideoEvidenceReason) {
      void stopOwnerLiveVideoEvidence(lifecycleActions.stopLiveVideoEvidenceReason);
    }

    updateOwnerLiveEvidence(lifecycleActions.remoteSessionId, lifecycleActions.evidenceUpdate);
  }, [
    activePackageId,
    liveAudioCall.state.remoteSessionId,
    liveAudioCall.state.role,
    liveAudioCall.state.status,
    liveRemoteSessionId,
    mediaRecorderPackageId
  ]);

  useEffect(() => {
    const cleanupDecision = resolveLiveCallCleanupDecision({
      activePackageId,
      finishInProgress,
      liveAudioCallStatus,
      liveRemoteSessionId,
      mediaStopPending,
      startInProgress
    });
    const cleanupActions = resolveLiveCallCleanupActions(cleanupDecision);
    if (!cleanupActions.shouldApply) return;

    if (cleanupActions.shouldClearAutoCallState) {
      ownerAutoCallPausedSessionIdsRef.current.clear();
      ownerAutoCallStartedSessionIdsRef.current.clear();
    }
    if (cleanupActions.shouldClearLiveRemoteSession) {
      setLiveRemoteSessionId(null);
    }
    if (cleanupActions.liveCallAction === "reset_idle_call_state") {
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

    const attemptActiveRemoteSync = (source: ActiveRemoteSyncAttemptSource) => {
      const attemptActions = resolveActiveRemoteSyncAttemptActions({
        activePackageId,
        cancelled,
        inFlight: activeRemoteSyncInFlightRef.current,
        liveRemoteSessionId,
        platform: Platform.OS,
        source
      });
      if (!attemptActions.shouldAttempt) return;

      activeRemoteSyncInFlightRef.current = attemptActions.shouldSetInFlight;
      appendMediaOperationalLog(attemptActions.log.event, attemptActions.log.payload);
      void getActiveEmergencyPackage()
        .then((activePackage) => {
          const packageActions = resolveActiveRemoteSyncPackageActions({
            activePackage,
            activePackageId,
            cancelled
          });
          if (!packageActions.shouldSyncPackage) return null;
          return syncEmergencyPackageWithApi(packageActions.packageToSync);
        })
        .then((syncState) => {
          const resultActions = resolveActiveRemoteSyncResultActions({
            cancelled,
            hasSyncState: Boolean(syncState)
          });
          if (!resultActions.shouldApplySyncState || !syncState) return;
          applyRemoteSyncState(syncState, { source });
        })
        .catch((error) => {
          const failureActions = resolveActiveRemoteSyncFailureActions({
            activePackageId,
            cancelled,
            platform: Platform.OS,
            source
          });
          if (!failureActions.shouldApply) return;
          appendMediaOperationalLog(failureActions.log.event, failureActions.log.payload, error);
          setRecordingStatus(failureActions.recordingStatus);
        })
        .finally(() => {
          const finallyActions = resolveActiveRemoteSyncFinallyActions();
          if (finallyActions.shouldClearInFlight) {
            activeRemoteSyncInFlightRef.current = false;
          }
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
      const attemptActions = resolveOwnerAutoCallAttemptActions({
        alreadyStarted,
        cancelled,
        currentRemoteSessionId: currentCallState.remoteSessionId,
        currentStatus: currentCallState.status,
        inFlight: ownerAutoCallInFlightRef.current,
        liveRemoteSessionId,
        paused: false,
        platform: Platform.OS
      });
      if (!attemptActions.shouldAttempt) {
        return;
      }

      ownerAutoCallInFlightRef.current = attemptActions.shouldSetInFlight;
      setRecordingStatus(attemptActions.statusMessage);
      appendMediaOperationalLog(attemptActions.log.event, attemptActions.log.payload);
      void listAcceptedLiveRecipients(liveRemoteSessionId)
        .then((recipients) => {
          const recipientActions = resolveOwnerAutoCallRecipientActions({
            recipientCount: recipients.length
          });
          setRecordingStatus(recipientActions.statusMessage);
          if (!recipientActions.shouldPrepareAndStartCall) {
            return;
          }
          return prepareMediaForOwnerLiveCall().then(async () => {
            const started = await liveAudioCall.startOwnerAudioCall(liveRemoteSessionId);
            const startResultActions = resolveOwnerAutoCallStartResultActions({
              remoteSessionId: liveRemoteSessionId,
              started
            });
            if (startResultActions.shouldMarkStarted) {
              ownerAutoCallStartedSessionIdsRef.current.add(startResultActions.remoteSessionId);
            }
            return started;
          });
        })
        .catch((error) => {
          const errorActions = resolveOwnerAutoCallErrorActions({
            platform: Platform.OS,
            remoteSessionId: liveRemoteSessionId
          });
          appendMediaOperationalLog(errorActions.log.event, errorActions.log.payload, error);
        })
        .finally(() => {
          const finallyActions = resolveOwnerAutoCallFinallyActions();
          if (finallyActions.shouldClearInFlight) {
            ownerAutoCallInFlightRef.current = false;
          }
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
        showFinishProgress(resolveMediaProtectionInProgress(finishProgress.progress));
        setRecordingStatus(resolveLocalSosPackageStatus({ event: "media_protection_in_progress" }));
        return;
      case "finish_active_call":
        requestFinishActiveCall();
        return;
      case "request_recording_consent":
        const recordingConsentDialog = resolveRecordingConsentDialogPresentation();
        setDialog({
          title: recordingConsentDialog.title,
          message: recordingConsentDialog.message,
          icon: <LockKeyhole size={18} color={theme.colors.primary} />,
          actions: [
            { label: recordingConsentDialog.cancelLabel, tone: "muted" },
            {
              label: recordingConsentDialog.confirmLabel,
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

    const emergencyStartRuntimeActions = resolveEmergencyStartRuntimeActions({
      platform: Platform.OS,
      preferences
    });
    setRecordingStatus(emergencyStartRuntimeActions.recordingStatus);
    if (emergencyStartRuntimeActions.shouldResetLiveAudioCall) {
      liveAudioCall.resetLiveAudioCall();
    }
    if (emergencyStartRuntimeActions.shouldClearLiveRemoteSession) {
      setLiveRemoteSessionId(null);
    }
    if (emergencyStartRuntimeActions.shouldClearOwnerAutoCallState) {
      ownerAutoCallPausedSessionIdsRef.current.clear();
      ownerAutoCallStartedSessionIdsRef.current.clear();
    }
    if (emergencyStartRuntimeActions.shouldMarkStartInProgress) {
      setStartInProgress(true);
    }
    appendMediaOperationalLog(emergencyStartRuntimeActions.logEvent, emergencyStartRuntimeActions.logPayload);

    try {
      const startRequestPolicy = resolveEmergencyStartRequestPolicy({
        platformOS: Platform.OS,
        preferences
      });
      const result = await startEmergencyPackage({
        kind: startRequestPolicy.packagePolicy.kind,
        trustedContactIds: (await listAcceptedOwnerRelationshipsForDelivery()).slice(0, 1).map((relationship) => relationship.id),
        captureLocation: startRequestPolicy.packagePolicy.captureLocation,
        defaultDurationSeconds: startRequestPolicy.packagePolicy.defaultDurationSeconds,
        locationConsentMode: startRequestPolicy.packagePolicy.locationConsentMode
      });
      await refreshOutboxCount();

      if (startRequestPolicy.shouldOpenEmergencyPhoneCall) {
        void Linking.openURL("tel:190").catch(() => undefined);
      }

      const startPresentation = resolveEmergencyStartPresentation({
        defaultDurationSeconds: preferences.defaultDurationSeconds,
        locationStatus: result.packageRecord.location.status
      });
      const startCreatedActions = resolveEmergencyStartCreatedActions({
        localVideoEnabled: preferences.localVideoCapture.requestOnSos,
        platform: Platform.OS,
        presentation: startPresentation
      });
      appendMediaOperationalLog(startCreatedActions.log.event, startCreatedActions.log.payload);
      void syncEmergencyPackageWithApi(result.packageRecord)
        .then((syncState) => {
          const remoteSyncActions = resolveEmergencyStartRemoteSyncResultActions({
            locationText: startPresentation.locationText,
            platform: Platform.OS,
            syncState
          });
          appendMediaOperationalLog(remoteSyncActions.log.event, remoteSyncActions.log.payload);
          if (remoteSyncActions.shouldApplyRemoteSyncState) {
            applyRemoteSyncState(syncState, remoteSyncActions.applyRemoteSyncStateOptions);
          }
        })
        .catch((error) => {
          const remoteSyncErrorActions = resolveEmergencyStartRemoteSyncErrorActions({
            platform: Platform.OS
          });
          appendMediaOperationalLog(remoteSyncErrorActions.log.event, remoteSyncErrorActions.log.payload, error);
        });

      setRecordingStatus(startCreatedActions.recordingStatus);
    } catch (error) {
      const emergencyStartFailureActions = resolveEmergencyStartFailureActions({
        platform: Platform.OS
      });
      appendMediaOperationalLog(emergencyStartFailureActions.logEvent, emergencyStartFailureActions.logPayload, error);
      if (emergencyStartFailureActions.shouldClearActivePackageId) {
        setActivePackageId(null);
      }
      setRecordingStatus(emergencyStartFailureActions.recordingStatus);
      if (emergencyStartFailureActions.shouldShowDialog) {
        const startFailureDialog = emergencyStartFailureActions.dialogPresentation;
        setDialog({
          title: startFailureDialog.title,
          message: startFailureDialog.message,
          icon: <LockKeyhole size={18} color={theme.colors.danger} />,
          actions: [{ label: startFailureDialog.confirmLabel, tone: "danger" }]
        });
      }
    } finally {
      setStartInProgress(false);
    }
  }

  function requestFinishActiveCall() {
    const finishRequestDecision = resolveFinishRequestDecision({
      activePackageId,
      finishInProgress,
      finishInProgressRef: finishInProgressRef.current,
      requireSecurityCode: preferences.finishSafety.requireCode
    });
    if (!finishRequestDecision.shouldContinue) return;

    applyFinishConfirmationFormPatch(resolveFinishRequestConfirmationFormPatch(finishRequestDecision));

    if (shouldFinishImmediatelyAfterRequest(finishRequestDecision)) {
      void handleFinishActiveCall();
    }
  }

  async function handleFinishActiveCall() {
    const finishStartDecision = resolveFinishActiveCallStart({
      activePackageId,
      captureStopLocked,
      finishInProgress,
      finishInProgressRef: finishInProgressRef.current,
      liveAudioRemoteSessionId: liveAudioCall.state.remoteSessionId,
      liveRemoteSessionId,
      ownerLiveVideoRecordingActive: Boolean(ownerLiveVideoRecordingRef.current),
      ownerLiveVideoStartRequestActive: Boolean(ownerLiveVideoStartRequestRef.current)
    });
    if (!finishStartDecision.shouldStart) return;

    const { mediaWasHandedToLiveCall, packageId, remoteSessionIdToFinish } = finishStartDecision;
    const finishRuntimeStartActions = resolveFinishActiveCallRuntimeStartActions({
      platform: Platform.OS,
      remoteSessionIdToFinish
    });
    const liveVideoAttachedAsset = finishRuntimeStartActions.shouldStopOwnerLiveVideoEvidence
      ? await stopOwnerLiveVideoEvidence("finish")
      : null;
    if (finishRuntimeStartActions.shouldResetLiveAudioCall) {
      liveAudioCall.resetLiveAudioCall();
    }
    if (finishRuntimeStartActions.shouldClearOwnerAutoCallSession && remoteSessionIdToFinish) {
      ownerAutoCallPausedSessionIdsRef.current.delete(remoteSessionIdToFinish);
      ownerAutoCallStartedSessionIdsRef.current.delete(remoteSessionIdToFinish);
    }
    if (finishRuntimeStartActions.shouldClearLiveRemoteSession) {
      setLiveRemoteSessionId(null);
    }
    if (finishRuntimeStartActions.shouldMarkFinishInProgress) {
      finishInProgressRef.current = true;
      setFinishInProgress(true);
    }
    setRecordingStatus(finishRuntimeStartActions.recordingStatus);
    showFinishProgress(finishRuntimeStartActions.finishProgress);
    appendMediaOperationalLog(finishRuntimeStartActions.logEvent, finishRuntimeStartActions.logPayload);

    try {
      mediaStopPurposeRef.current = "finish";
      const stopSerial = mediaWasHandedToLiveCall ? null : signalMediaRecorderStop();
      let stopResult: MediaStopRequestResult | null = null;
      if (stopSerial) {
        const mediaStopStartActions = resolveFinishMediaStopStartActions({
          packageId
        });
        if (mediaStopStartActions.shouldLockCaptureStop) {
          setCaptureStopLocked(true);
        }
        if (mediaStopStartActions.shouldSetMediaStopPending) {
          setMediaStopPendingState(true);
        }
        setActivePackageId(mediaStopStartActions.nextActivePackageId);
        setMediaRecorderPackageId(mediaStopStartActions.mediaRecorderPackageId);
        showFinishProgress(mediaStopStartActions.finishProgress);
        stopResult = await waitForMediaRecorderStop(stopSerial);
        const mediaStopResultActions = resolveFinishMediaStopResultActions({
          attachedAssets: stopResult.attachedAssets,
          platform: Platform.OS,
          status: stopResult.status
        });
        if (mediaStopResultActions.shouldClearMediaStopPending) {
          setMediaStopPendingState(false);
        }
        appendMediaOperationalLog(mediaStopResultActions.logEvent, mediaStopResultActions.logPayload);
        showFinishProgress(mediaStopResultActions.finishProgress);
      }

      const result = await finishEmergencyPackage(packageId, "manual_finish");
      await refreshOutboxCount();

      if (!result) {
        const missingPackageActions = resolveFinishMissingPackageActions({
          stopSerialPresent: Boolean(stopSerial)
        });
        setRecordingStatus(missingPackageActions.recordingStatus);
        if (missingPackageActions.shouldShowMissingPackageProgress && missingPackageActions.finishProgress) {
          showFinishProgress(missingPackageActions.finishProgress);
        }
        return;
      }

      const remoteSyncStartActions = resolveFinishRemoteSyncStartActions();
      if (remoteSyncStartActions.shouldQueueForRemoteSync) {
        await queueEmergencyPackageForRemoteSync(result.packageRecord);
      }
      showFinishProgress(remoteSyncStartActions.finishProgress);
      let remoteFinishState: EmergencyRemoteSyncState | undefined;
      const remoteSyncMode = resolveFinishRemoteSyncMode({
        remoteSessionIdToFinish
      });
      if (remoteSyncMode.mode === "direct_finish") {
        const directFinishState = await finishRemoteEmergencySessionForPackage(
          result.packageRecord,
          remoteSyncMode.remoteSessionId
        );
        const retryStates = shouldRetryRemoteFinishAfterDirect(directFinishState)
          ? await syncPendingEmergencyPackagesWithApi()
          : [];
        remoteFinishState = resolveRemoteFinishStateAfterDirect({
          directFinishState,
          packageId,
          retryStates
        });
      } else {
        const syncStates = await syncPendingEmergencyPackagesWithApi();
        remoteFinishState = resolveRemoteFinishStateFromSync({
          packageId,
          syncStates
        });
      }
      const remoteFinishFailureLog = resolveRemoteFinishFailureLog({
        packageId,
        platform: Platform.OS,
        remoteFinishState,
        remoteSessionIdToFinish
      });
      if (remoteFinishFailureLog.shouldLog) {
        appendMediaOperationalLog(remoteFinishFailureLog.logEvent, remoteFinishFailureLog.logPayload);
      }
      const remoteFinishFailed = remoteFinishFailureLog.remoteFinishFailed;

      const finishPackageResult = resolveFinishPackageResult({
        liveVideoAttached: Boolean(liveVideoAttachedAsset),
        media: result.packageRecord.media,
        platform: Platform.OS
      });
      appendMediaOperationalLog(finishPackageResult.logEvent, finishPackageResult.logPayload);
      const finishOutcomeInput = resolveFinishOutcomeInput({
        finishPackageResult,
        mediaWasHandedToLiveCall,
        remoteFinishFailed,
        stopResultStatus: stopResult?.status,
        stopSerialPresent: Boolean(stopSerial)
      });
      const finishOutcome = resolveFinishOutcomePolicy(finishOutcomeInput);
      const finishOwnerCompletionActions = resolveFinishOwnerCompletionActions({
        endedAt: new Date().toISOString(),
        finishOutcome,
        packageId
      });
      updateOwnerLiveEvidence(remoteSessionIdToFinish, finishOwnerCompletionActions.evidenceUpdate);
      const finishOwnerAuditMarker = finishOwnerCompletionActions.auditMarker;
      recordOwnerLiveAuditMarker(remoteSessionIdToFinish, finishOwnerAuditMarker.event, finishOwnerAuditMarker.options);
      const finishPostOutcomeActions = resolveFinishPostOutcomeActions({
        finishOutcome,
        packageId
      });
      const finishCompletionActions = finishPostOutcomeActions.completionActions;
      const finishNoMediaDiagnostic = finishPostOutcomeActions.noMediaDiagnostic;
      setRecordingStatus(finishCompletionActions.recordingStatus);
      if (finishNoMediaDiagnostic.shouldPersist) {
        await persistFinishNoMediaDiagnostic(finishNoMediaDiagnostic.packageId, finishNoMediaDiagnostic.reason);
      }
      showFinishProgress(finishCompletionActions.finishProgress);
      applyFinishConfirmationFormPatch(resolveFinishCompletionConfirmationFormPatch(finishCompletionActions));
    } catch (error) {
      const finishFailureActions = resolveFinishFailureActions({
        platform: Platform.OS
      });
      appendMediaOperationalLog(finishFailureActions.logEvent, finishFailureActions.logPayload, error);
      setRecordingStatus(finishFailureActions.recordingStatus);
      showFinishProgress(finishFailureActions.finishProgress);
    } finally {
      const finishCleanupDecision = resolveFinishActiveCallCleanup({
        mediaStopPurpose: mediaStopPurposeRef.current
      });
      if (finishCleanupDecision.shouldClearMediaStopPurpose) {
        mediaStopPurposeRef.current = null;
      }
      if (finishCleanupDecision.shouldUnlockCaptureStop) {
        setCaptureStopLocked(false);
      }
      if (finishCleanupDecision.shouldClearMediaStopPending) {
        setMediaStopPendingState(false);
      }
      if (finishCleanupDecision.shouldReleaseFinishInProgress) {
        finishInProgressRef.current = false;
        setFinishInProgress(false);
      }
    }
  }

  function handleMediaStopRequestSettled(serial: number, result: MediaStopRequestResult) {
    const mediaStopSettledActions = resolveMediaStopSettledActions({
      expectedSerial: stopRecordingRequestSerialRef.current,
      platform: Platform.OS,
      result,
      serial
    });
    if (!mediaStopSettledActions.shouldHandle) {
      return;
    }

    if (mediaStopSettledActions.shouldResolveMediaReleaseWaiter) {
      resolveMediaReleaseWaiter();
    }
    const settlementLog = mediaStopSettledActions.settlementLog;
    appendMediaOperationalLog(settlementLog.logEvent, settlementLog.logPayload);

    const settlementPresentation = mediaStopSettledActions.settlementPresentation;
    if (settlementPresentation.shouldRefreshOutbox) {
      void refreshOutboxCount();
      if (settlementPresentation.recordingStatus) {
        setRecordingStatus(settlementPresentation.recordingStatus);
      }
      setFinishProgress((current) =>
        resolveMediaStopSettlementFinishProgress(current) ?? current
      );
    }

    const pendingRequest = pendingMediaStopRequestRef.current;
    const pendingRequestDecision = resolveMediaStopPendingRequestCompletion({
      hasPendingRequest: Boolean(pendingRequest),
      pendingSerial: pendingRequest?.serial,
      serial
    });
    if (pendingRequest && pendingRequestDecision.shouldClearTimeout) {
      clearTimeout(pendingRequest.timeout);
    }
    if (pendingRequestDecision.shouldClearPendingRequest) {
      pendingMediaStopRequestRef.current = null;
    }
    if (pendingRequest && pendingRequestDecision.shouldResolvePendingRequest) {
      pendingRequest.resolve(result);
    }
  }

  function signalMediaRecorderStop() {
    const stopSignal = resolveMediaStopSignal({
      currentSerial: stopRecordingRequestSerialRef.current,
      isWebPlatform: Platform.OS === "web",
      platform: Platform.OS,
      requestLocalVideoOnSos: preferences.localVideoCapture.requestOnSos
    });
    if (!stopSignal.shouldSignal) {
      return null;
    }

    const serial = stopSignal.serial;
    stopRecordingRequestSerialRef.current = serial;
    appendMediaOperationalLog(stopSignal.logEvent, stopSignal.logPayload);
    setStopRecordingRequestSerial(serial);
    return serial;
  }

  function waitForMediaRecorderStop(serial: number) {
    const previousRequest = pendingMediaStopRequestRef.current;
    const startDecision = resolveMediaStopWaiterStart(Boolean(previousRequest));
    if (previousRequest && startDecision.shouldResolvePreviousRequest) {
      clearTimeout(previousRequest.timeout);
      previousRequest.resolve(startDecision.previousRequestResult);
    }

    return new Promise<MediaStopRequestResult>((resolve) => {
      const timeout = setTimeout(() => {
        const timeoutDecision = resolveMediaStopTimeout({
          currentSerial: pendingMediaStopRequestRef.current?.serial,
          platform: Platform.OS,
          serial,
          timeoutMs: mediaStopWaitTimeoutMs
        });
        if (!timeoutDecision.shouldResolve) return;

        if (timeoutDecision.shouldClearPendingRequest) {
          pendingMediaStopRequestRef.current = null;
        }
        appendMediaOperationalLog(timeoutDecision.logEvent, timeoutDecision.logPayload);
        resolve(timeoutDecision.result);
      }, mediaStopWaitTimeoutMs);

      pendingMediaStopRequestRef.current = {
        resolve,
        serial,
        timeout
      };
    });
  }

  async function confirmFinishWithCode() {
    const verification = preferences.finishSafety.requireCode
      ? await verifySecurityCodeStatus(preferences, finishCodeInput)
      : undefined;
    const finishCodeDecision = resolveFinishCodeConfirmationDecision({
      requireSecurityCode: preferences.finishSafety.requireCode,
      verification
    });

    const finishCodeActions = resolveFinishCodeConfirmationActions(finishCodeDecision);
    if (finishCodeActions.formPatch) {
      applyFinishConfirmationFormPatch(finishCodeActions.formPatch);
    }

    if (!finishCodeActions.shouldFinishActiveCall) {
      return;
    }

    void handleFinishActiveCall();
  }

  async function confirmProtectedRouteWithCode() {
    const verification = protectedRouteRequest
      ? await verifySecurityCodeStatus(preferences, protectedRouteCodeInput)
      : undefined;
    const protectedRouteDecision = resolveProtectedRouteCodeDecision({
      hasProtectedRouteRequest: Boolean(protectedRouteRequest),
      verification
    });

    const protectedRouteActions = resolveProtectedRouteUnlockActions({
      decision: protectedRouteDecision,
      request: protectedRouteRequest
    });
    if (protectedRouteActions.formPatch) {
      applyProtectedRouteFormPatch(protectedRouteActions.formPatch);
    }

    if (!protectedRouteActions.shouldUnlockProtectedAccess) return;

    await unlockProtectedAccess();
    navigateRoute(protectedRouteActions.navigationTarget.route, protectedRouteActions.navigationTarget.panel);
  }

  function closeProtectedRouteDialog() {
    applyProtectedRouteFormPatch(resolveProtectedRouteClosedFormPatch());
  }

  const liveCallPanel = resolveLiveCallPanelPolicy({
    activePackageId,
    finishInProgress,
    liveAudioCallStatus,
    liveRemoteSessionId,
    mediaStopPending
  });
  const protectedRouteDialog = resolveProtectedRouteDialogPresentation();
  const finishConfirmationDialog = resolveFinishConfirmationDialogPresentation();
  const emergencyHomeActivity = resolveEmergencyHomeActivityPresentation({
    activePackageId,
    finishInProgress,
    mediaStopPending,
    startInProgress
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {emergencyHomeActivity.shouldKeepAwake ? <EmergencyRecordingWakeLock /> : null}
      <View style={styles.homeShell} testID="home-emergency-screen">
        <EmergencyTopBar
          active={emergencyHomeActivity.activeVisualState}
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
          <BrandBackground active={emergencyHomeActivity.activeVisualState} />
          <EmergencyMediaRecorder
            activePackageId={mediaRecorderPackageId}
            avoidLiveAudioPanel={liveCallPanel.shouldAvoidMediaRecorderPanel}
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
              active={emergencyHomeActivity.activeVisualState}
              label={panicButtonLabel({ activePackageId, finishInProgress, mediaStopPending, startInProgress })}
              holdMs={preferences.inAppHoldMs}
              onTrigger={handlePanicTrigger}
            />
            {liveCallPanel.shouldRenderStatusBand ? (
              <View
                accessibilityLiveRegion="polite"
                accessibilityRole="text"
                style={[
                  styles.statusBand,
                  emergencyHomeActivity.statusBandActive
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

          {liveCallPanel.shouldRenderPanel ? (
            <LiveAudioCallPanel
              actionLabel="Chamar anjo"
              disabled={liveCallPanel.primaryActionDisabled}
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
              label: protectedRouteDialog.cancelLabel,
              tone: "muted",
              onPress: closeProtectedRouteDialog
            },
            {
              autoClose: false,
              label: protectedRouteDialog.confirmLabel,
              onPress: () => {
                void confirmProtectedRouteWithCode();
              }
            }
          ]}
          icon={<LockKeyhole size={18} color={theme.colors.primary} />}
          message={protectedRouteDialog.message}
          onClose={closeProtectedRouteDialog}
          title={protectedRouteDialog.title}
          visible={Boolean(protectedRouteRequest)}
        >
          <TextInput
            accessibilityLabel={protectedRouteDialog.inputAccessibilityLabel}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            maxLength={12}
            onChangeText={setProtectedRouteCodeInput}
            placeholder={protectedRouteDialog.inputPlaceholder}
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
              label: finishConfirmationDialog.cancelLabel,
              tone: "muted",
              onPress: () => setFinishConfirmationOpen(false)
            },
            {
              autoClose: false,
              label: finishConfirmationDialog.confirmLabel,
              tone: "danger",
              onPress: () => {
                void confirmFinishWithCode();
              }
            }
          ]}
          icon={<LockKeyhole size={18} color={theme.colors.primary} />}
          message={finishConfirmationDialog.message}
          onClose={() => setFinishConfirmationOpen(false)}
          title={finishConfirmationDialog.title}
          visible={finishConfirmationOpen}
        >
          <TextInput
            accessibilityLabel={finishConfirmationDialog.inputAccessibilityLabel}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            onChangeText={setFinishCodeInput}
            placeholder={finishConfirmationDialog.inputPlaceholder}
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
