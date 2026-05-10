import { useEffect, useMemo, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Camera, CameraView, type CameraRecordingOptions, type VideoCodec, type VideoQuality } from "expo-camera";
import { theme } from "@/design/theme";
import { EmergencyPreferences } from "./emergencyPreferences";
import { createMediaDiagnosticRun, startMediaDiagnosticEvent, summarizeMediaDiagnostics } from "./MediaDiagnostics";
import { appendMediaOperationalLog } from "./MediaOperationalLog";
import { attachLocalMediaDiagnostics } from "./emergencyRecorder";
import { preserveLocalVideoAsset } from "./mediaCapture";
import type { MediaCaptureCompatibilityProfile, MediaCaptureFailureReason } from "./types";

type MediaPermissionStatus = "idle" | "requesting" | "granted" | "denied";
type ActualCameraMode = "front" | "back";
type CameraReadyByMode = Record<ActualCameraMode, boolean>;
type ActiveCaptureController = {
  attachedAssetCount: number;
  packageId: string;
  startedAtMs: number;
  stopRequested: boolean;
};
export type MediaStopRequestResult = {
  attachedAssets: number;
  status: "attached" | "empty" | "error" | "idle";
};

type EmergencyMediaRecorderProps = {
  activePackageId: string | null;
  preferences: EmergencyPreferences;
  onMediaAttached?: () => void;
  onStopRequestSettled?: (serial: number, result: MediaStopRequestResult) => void;
  stopRequestSerial?: number;
  onStatusChange?: (status: string) => void;
};

const emptyCameraReadyState: CameraReadyByMode = { back: false, front: false };
const mobileSegmentDurationSeconds = 12;
const iosHomologationMaxSegmentsPerCall = 1;
const iosRecordStartWarmupMs = 850;
const iosRecordRetryDelayMs = 700;
const iosRecordRetryMaxAttempts = 2;
const iosEncryptedChunkSizeBytes = 2 * 1024 * 1024;
const iosRecordingVideoCodec: VideoCodec = "avc1";
const recordingVideoQuality: VideoQuality = "480p";
const recordingVideoBitrate = 650_000;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cameraModeLabel(mode: ActualCameraMode) {
  return mode === "front" ? "frontal" : "traseira";
}

function getRuntimeCameraMode(requestedCameraMode: EmergencyPreferences["localVideoCapture"]["cameraMode"]) {
  if (Platform.OS === "android" && requestedCameraMode === "both") {
    return "front";
  }

  return requestedCameraMode;
}

function getCaptureProfilePlatform(): MediaCaptureCompatibilityProfile["platform"] {
  if (Platform.OS === "android" || Platform.OS === "ios" || Platform.OS === "web") return Platform.OS;
  if (Platform.OS === "windows" || Platform.OS === "macos") return Platform.OS;
  return "web";
}

function getCaptureCompatibilityTier({
  actualCameraMode,
  requestedCameraMode,
  runtimeCameraMode
}: {
  actualCameraMode: ActualCameraMode;
  requestedCameraMode: EmergencyPreferences["localVideoCapture"]["cameraMode"];
  runtimeCameraMode: EmergencyPreferences["localVideoCapture"]["cameraMode"];
}): MediaCaptureCompatibilityProfile["compatibilityTier"] {
  if (Platform.OS === "ios") return "ios_h264_low_bitrate_segmented";
  if (Platform.OS === "android" && (requestedCameraMode === "both" || runtimeCameraMode === "both") && actualCameraMode) {
    return requestedCameraMode === runtimeCameraMode ? "android_single_camera_conservative" : "android_single_camera_fallback";
  }
  if (Platform.OS === "android") return "android_single_camera_conservative";
  return "generic_single_camera_conservative";
}

async function getCameraPictureSizes(camera: CameraView) {
  return camera.getAvailablePictureSizesAsync().catch(() => []);
}

async function getCameraLenses(camera: CameraView) {
  return camera.getAvailableLensesAsync().catch(() => []);
}

async function getAvailableVideoCodecs() {
  if (Platform.OS !== "ios") return [];
  return CameraView.getAvailableVideoCodecsAsync().catch(() => []);
}

async function buildCaptureCompatibilityProfile({
  camera,
  mode,
  recordingOptions,
  requestedCameraMode,
  runtimeCameraMode
}: {
  camera: CameraView;
  mode: ActualCameraMode;
  recordingOptions: CameraRecordingOptions | null | undefined;
  requestedCameraMode: EmergencyPreferences["localVideoCapture"]["cameraMode"];
  runtimeCameraMode: EmergencyPreferences["localVideoCapture"]["cameraMode"];
}): Promise<MediaCaptureCompatibilityProfile> {
  const [pictureSizes, lenses, videoCodecs] = await Promise.all([
    getCameraPictureSizes(camera),
    getCameraLenses(camera),
    getAvailableVideoCodecs()
  ]);

  return {
    schemaVersion: "sinalseguro.media-capture-profile.v1",
    platform: getCaptureProfilePlatform(),
    platformVersion: String(Platform.Version),
    requestedCameraMode,
    runtimeCameraMode,
    actualCameraMode: mode,
    compatibilityTier: getCaptureCompatibilityTier({ actualCameraMode: mode, requestedCameraMode, runtimeCameraMode }),
    recordingContainer: "mp4",
    videoCodec: Platform.OS === "ios" ? "h264" : "platform_default_h264_mp4",
    videoQuality: recordingVideoQuality,
    targetVideoBitrate: recordingVideoBitrate,
    segmentDurationSeconds: recordingOptions?.maxDuration ?? null,
    pictureSizeCount: pictureSizes.length,
    pictureSizesSample: pictureSizes.slice(0, 8),
    availableLenses: lenses.slice(0, 8),
    availableVideoCodecs: videoCodecs.slice(0, 8),
    p2pCompatibility: {
      callMediaInterop: "recording_profile_conservative_mp4_h264",
      envelopeScope: "media_asset",
      requiresRecipientKeyEnvelope: true,
      supportsDeferredRecipientEnvelope: true
    }
  };
}

function buildRecordingOptions(
  defaultDurationSeconds: number,
  startedAtMs: number
): CameraRecordingOptions | null | undefined {
  if (defaultDurationSeconds > 0) {
    const elapsedSeconds = (Date.now() - startedAtMs) / 1000;
    const remainingSeconds = Math.ceil(defaultDurationSeconds - elapsedSeconds);
    if (remainingSeconds <= 0) return null;

    const maxDuration = Math.max(1, Math.min(mobileSegmentDurationSeconds, remainingSeconds));
    return Platform.OS === "ios" ? { codec: iosRecordingVideoCodec, maxDuration } : { maxDuration };
  }

  return Platform.OS === "ios"
    ? {
        codec: iosRecordingVideoCodec,
        maxDuration: mobileSegmentDurationSeconds
      }
    : { maxDuration: mobileSegmentDurationSeconds };
}

function shouldContinueSegmentedRecording({
  activeCaptureController,
  ignoreStatusUpdates,
  segmentIndex
}: {
  activeCaptureController: ActiveCaptureController;
  ignoreStatusUpdates: boolean;
  segmentIndex: number;
}) {
  if (activeCaptureController.stopRequested || ignoreStatusUpdates) return false;
  if (Platform.OS === "ios") return segmentIndex < iosHomologationMaxSegmentsPerCall;
  return Platform.OS === "android";
}

function classifyCaptureFailureReason(error: unknown): MediaCaptureFailureReason {
  if (error instanceof Error && error.message === "camera_no_file_returned") {
    return "camera_no_file_returned";
  }

  if (error instanceof Error && /ready|output/i.test(`${error.name} ${error.message}`)) {
    return "camera_output_not_ready";
  }

  if (error instanceof Error && /permission|authori[sz]|denied/i.test(`${error.name} ${error.message}`)) {
    return "media_permissions_denied";
  }

  return "camera_recording_error";
}

function shouldRetryIosRecordAsync(error: unknown, attempt: number, elapsedMs: number) {
  if (Platform.OS !== "ios" || attempt >= iosRecordRetryMaxAttempts) return false;
  if (error instanceof Error && /permission|authori[sz]|denied/i.test(`${error.name} ${error.message}`)) return false;
  return elapsedMs < 1500 || classifyCaptureFailureReason(error) === "camera_output_not_ready";
}

async function persistCaptureDiagnostic(
  packageId: string,
  reason: MediaCaptureFailureReason,
  diagnosticRunId: string
) {
  await attachLocalMediaDiagnostics(packageId, {
    schemaVersion: "sinalseguro.media-capture-diagnostic.v1",
    status: "capture_failed",
    reason,
    recordedAt: new Date().toISOString(),
    diagnostics: summarizeMediaDiagnostics(diagnosticRunId)
  }).catch(() => undefined);
}

export function EmergencyMediaRecorder({
  activePackageId,
  preferences,
  onMediaAttached,
  onStopRequestSettled,
  stopRequestSerial = 0,
  onStatusChange
}: EmergencyMediaRecorderProps) {
  const frontCameraRef = useRef<CameraView | null>(null);
  const backCameraRef = useRef<CameraView | null>(null);
  const activeCaptureControllerRef = useRef<ActiveCaptureController | null>(null);
  const recordingRef = useRef(false);
  const onMediaAttachedRef = useRef(onMediaAttached);
  const onStopRequestSettledRef = useRef(onStopRequestSettled);
  const onStatusChangeRef = useRef(onStatusChange);
  const handledStopRequestSerialRef = useRef(0);
  const pendingStopRequestSerialRef = useRef(0);
  const [cameraReadyByMode, setCameraReadyByMode] = useState<CameraReadyByMode>(emptyCameraReadyState);
  const [dualFallbackUnlocked, setDualFallbackUnlocked] = useState(false);
  const [forcedSingleCameraMode, setForcedSingleCameraMode] = useState<ActualCameraMode | null>(null);
  const [mediaPermissionStatus, setMediaPermissionStatus] = useState<MediaPermissionStatus>("idle");

  const mediaEnabled = Boolean(activePackageId && preferences.localVideoCapture.requestOnSos);
  const requestedCameraMode = preferences.localVideoCapture.cameraMode;
  const runtimeCameraMode = getRuntimeCameraMode(requestedCameraMode);
  const activeCameraModes = useMemo<ActualCameraMode[]>(
    () =>
      runtimeCameraMode === "both"
        ? forcedSingleCameraMode
          ? [forcedSingleCameraMode]
          : ["front", "back"]
        : [runtimeCameraMode === "back" ? "back" : "front"],
    [forcedSingleCameraMode, runtimeCameraMode]
  );
  const allRequestedCamerasReady = activeCameraModes.every((mode) => cameraReadyByMode[mode]);
  const anyRequestedCameraReady = activeCameraModes.some((mode) => cameraReadyByMode[mode]);
  const canStartRecording =
    runtimeCameraMode === "both"
      ? allRequestedCamerasReady || (dualFallbackUnlocked && anyRequestedCameraReady)
      : allRequestedCamerasReady;
  const modeLabel =
    requestedCameraMode === "both" && runtimeCameraMode !== "both"
      ? `${cameraModeLabel(activeCameraModes[0])} (modo leve)`
      : runtimeCameraMode === "both" && !forcedSingleCameraMode
      ? "frontal + traseira"
      : `${cameraModeLabel(activeCameraModes[0])}${runtimeCameraMode === "both" ? " (fallback)" : ""}`;

  function stopActiveRecording(announce = true) {
    appendMediaOperationalLog("capture_stop_requested", {
      active: recordingRef.current,
      attachedAssetCount: activeCaptureControllerRef.current?.attachedAssetCount ?? 0,
      platform: Platform.OS,
      requestedCameraMode,
      runtimeCameraMode
    });
    if (!recordingRef.current) return false;

    const activeCaptureController = activeCaptureControllerRef.current;
    if (activeCaptureController) {
      activeCaptureController.stopRequested = true;
    }
    if (announce) {
      onStatusChangeRef.current?.("Encerrando gravacao local e preparando arquivo seguro.");
    }
    void frontCameraRef.current?.stopRecording();
    void backCameraRef.current?.stopRecording();
    if (Platform.OS === "ios" && activeCaptureController && activeCaptureController.attachedAssetCount > 0) {
      settleStopRequest({ attachedAssets: activeCaptureController.attachedAssetCount, status: "attached" });
    }
    return true;
  }

  function settleStopRequest(result: MediaStopRequestResult) {
    const serial = pendingStopRequestSerialRef.current;
    if (serial <= 0) return;

    pendingStopRequestSerialRef.current = 0;
    onStopRequestSettledRef.current?.(serial, result);
  }

  useEffect(() => {
    onMediaAttachedRef.current = onMediaAttached;
    onStopRequestSettledRef.current = onStopRequestSettled;
    onStatusChangeRef.current = onStatusChange;
  }, [onMediaAttached, onStopRequestSettled, onStatusChange]);

  useEffect(() => {
    setCameraReadyByMode(emptyCameraReadyState);
    setDualFallbackUnlocked(false);
    setForcedSingleCameraMode(null);
  }, [activePackageId, runtimeCameraMode]);

  useEffect(() => {
    if (stopRequestSerial <= 0 || handledStopRequestSerialRef.current === stopRequestSerial) {
      return;
    }

    handledStopRequestSerialRef.current = stopRequestSerial;
    if (!recordingRef.current) {
      onStopRequestSettledRef.current?.(stopRequestSerial, { attachedAssets: 0, status: "idle" });
      return;
    }

    pendingStopRequestSerialRef.current = stopRequestSerial;
    stopActiveRecording();
  }, [stopRequestSerial]);

  useEffect(() => {
    if (
      !mediaEnabled ||
      runtimeCameraMode !== "both" ||
      mediaPermissionStatus !== "granted" ||
      forcedSingleCameraMode ||
      allRequestedCamerasReady
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      if (anyRequestedCameraReady) {
        setDualFallbackUnlocked(true);
        return;
      }

      setCameraReadyByMode(emptyCameraReadyState);
      setDualFallbackUnlocked(true);
      setForcedSingleCameraMode("front");
      onStatusChangeRef.current?.("Camera dupla nao ficou pronta; tentando camera frontal como fallback local.");
    }, 1600);
    return () => clearTimeout(timeout);
  }, [
    allRequestedCamerasReady,
    anyRequestedCameraReady,
    forcedSingleCameraMode,
    mediaEnabled,
    mediaPermissionStatus,
    runtimeCameraMode
  ]);

  useEffect(() => {
    if (
      !mediaEnabled ||
      runtimeCameraMode !== "both" ||
      forcedSingleCameraMode !== "front" ||
      mediaPermissionStatus !== "granted" ||
      cameraReadyByMode.front
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      setCameraReadyByMode(emptyCameraReadyState);
      setForcedSingleCameraMode("back");
      onStatusChangeRef.current?.("Fallback frontal nao ficou pronto; tentando camera traseira.");
    }, 2200);
    return () => clearTimeout(timeout);
  }, [
    cameraReadyByMode.front,
    forcedSingleCameraMode,
    mediaEnabled,
    mediaPermissionStatus,
    runtimeCameraMode
  ]);

  useEffect(() => {
    appendMediaOperationalLog("capture_readiness_snapshot", {
      activeCameraCount: activeCameraModes.length,
      anyRequestedCameraReady,
      canStartRecording,
      mediaEnabled,
      mediaPermissionStatus,
      platform: Platform.OS,
      requestedCameraMode,
      runtimeCameraMode
    });
  }, [
    activeCameraModes.length,
    anyRequestedCameraReady,
    canStartRecording,
    mediaEnabled,
    mediaPermissionStatus,
    requestedCameraMode,
    runtimeCameraMode
  ]);

  useEffect(() => {
    if (!mediaEnabled || Platform.OS === "web") {
      setCameraReadyByMode(emptyCameraReadyState);
      setDualFallbackUnlocked(false);
      setForcedSingleCameraMode(null);
      setMediaPermissionStatus("idle");
      return;
    }

    let cancelled = false;

    async function prepareMediaPermissions() {
      setMediaPermissionStatus("requesting");
      appendMediaOperationalLog("capture_permissions_request", {
        platform: Platform.OS,
        requestedCameraMode,
        runtimeCameraMode
      });

      const currentCameraPermission = await Camera.getCameraPermissionsAsync();
      const cameraAuthorization = currentCameraPermission.granted
        ? currentCameraPermission
        : await Camera.requestCameraPermissionsAsync();
      const currentMicrophonePermission = await Camera.getMicrophonePermissionsAsync();
      const microphoneAuthorization = currentMicrophonePermission.granted
        ? currentMicrophonePermission
        : await Camera.requestMicrophonePermissionsAsync();

      if (cancelled) return;

      if (!cameraAuthorization.granted || !microphoneAuthorization.granted) {
        setMediaPermissionStatus("denied");
        appendMediaOperationalLog("capture_permissions_denied", {
          cameraGranted: cameraAuthorization.granted,
          microphoneGranted: microphoneAuthorization.granted,
          platform: Platform.OS
        });
        onStatusChangeRef.current?.("Chamado ativo sem video: camera ou microfone nao autorizados neste dispositivo.");
        return;
      }

      setMediaPermissionStatus("granted");
      appendMediaOperationalLog("capture_permissions_granted", {
        platform: Platform.OS,
        requestedCameraMode,
        runtimeCameraMode
      });
    }

    void prepareMediaPermissions();

    return () => {
      cancelled = true;
    };
  }, [mediaEnabled]);

  useEffect(() => {
    if (
      !mediaEnabled ||
      !activePackageId ||
      Platform.OS === "web" ||
      mediaPermissionStatus !== "granted" ||
      !canStartRecording ||
      recordingRef.current
    ) {
      return;
    }

    let ignoreStatusUpdates = false;

    async function startRecording() {
      const currentPackageId = activePackageId;
      if (!currentPackageId) return;
      appendMediaOperationalLog("capture_start_effect_entered", {
        activeCameraCount: activeCameraModes.length,
        canStartRecording,
        mediaPermissionStatus,
        platform: Platform.OS,
        requestedCameraMode,
        runtimeCameraMode
      });

      const cameraRefs: Record<ActualCameraMode, CameraView | null> = {
        back: backCameraRef.current,
        front: frontCameraRef.current
      };
      const availableCameras = activeCameraModes
        .map((mode) => ({ camera: cameraRefs[mode], mode }))
        .filter(
          (entry): entry is { camera: CameraView; mode: ActualCameraMode } =>
            Boolean(entry.camera) && cameraReadyByMode[entry.mode]
        );

      if (availableCameras.length === 0) {
        const diagnosticRunId = createMediaDiagnosticRun("capture-readiness");
        const readinessTimer = startMediaDiagnosticEvent(diagnosticRunId, "capture_mount");
        readinessTimer.finish(
          "error",
          {
            backReady: cameraReadyByMode.back,
            frontReady: cameraReadyByMode.front,
            requestedCameraMode,
            runtimeCameraMode
          },
          new Error("camera_output_not_ready")
        );
        appendMediaOperationalLog("capture_no_available_camera_ref", {
          backReady: cameraReadyByMode.back,
          frontReady: cameraReadyByMode.front,
          platform: Platform.OS,
          requestedCameraMode,
          runtimeCameraMode
        });
        await persistCaptureDiagnostic(currentPackageId, "camera_output_not_ready", diagnosticRunId);
        return;
      }

      recordingRef.current = true;
      const activeCaptureController: ActiveCaptureController = {
        attachedAssetCount: 0,
        packageId: currentPackageId,
        startedAtMs: Date.now(),
        stopRequested: false
      };
      activeCaptureControllerRef.current = activeCaptureController;
      onStatusChangeRef.current?.(
        requestedCameraMode === "both" && runtimeCameraMode !== "both"
          ? "Gravacao local iniciada em modo leve no Android para evitar travamento."
          : runtimeCameraMode === "both" && availableCameras.length === 2
          ? "Gravacao local iniciada com camera frontal e traseira. O aparelho precisa sustentar captura dupla."
          : `Gravacao local de video e audio iniciada pela camera ${cameraModeLabel(availableCameras[0].mode)}.`
      );

      let attachedAssetCount = 0;
      let stopSettlementStatus: MediaStopRequestResult["status"] = "empty";

      try {
        const recordingResults = await Promise.allSettled(
          availableCameras.map(async ({ camera, mode }) => {
            const attachedAssets = [];
            let segmentIndex = 0;

            do {
              const recordingOptions = buildRecordingOptions(
                preferences.defaultDurationSeconds,
                activeCaptureController.startedAtMs
              );
              if (recordingOptions === null) break;

              const segmentStartedAt = new Date().toISOString();
              const diagnosticRunId = createMediaDiagnosticRun(`capture-${mode}`);
              const captureTimer = startMediaDiagnosticEvent(diagnosticRunId, "capture_recording");
              const captureProfile = await buildCaptureCompatibilityProfile({
                camera,
                mode,
                recordingOptions,
                requestedCameraMode,
                runtimeCameraMode
              });
              const captureMetrics = {
                actualCameraMode: mode,
                availableLensCount: captureProfile.availableLenses.length,
                availableVideoCodecCount: captureProfile.availableVideoCodecs.length,
                compatibilityTier: captureProfile.compatibilityTier,
                fallbackUsed: requestedCameraMode !== mode,
                iosSegmentedRecording: Platform.OS === "ios",
                iosSegmentLimit: Platform.OS === "ios" ? iosHomologationMaxSegmentsPerCall : null,
                pictureSizeCount: captureProfile.pictureSizeCount,
                plannedDurationSeconds: preferences.defaultDurationSeconds,
                requestedCameraMode,
                targetVideoBitrate: recordingVideoBitrate,
                segmentDurationSeconds: recordingOptions?.maxDuration ?? null,
                segmentIndex
              };
              let result;
              if (Platform.OS === "ios" && segmentIndex === 0) {
                appendMediaOperationalLog("capture_record_warmup_start", {
                  actualCameraMode: mode,
                  platform: Platform.OS,
                  warmupMs: iosRecordStartWarmupMs
                });
                await wait(iosRecordStartWarmupMs);
                appendMediaOperationalLog("capture_record_warmup_done", {
                  actualCameraMode: mode,
                  platform: Platform.OS
                });
                if (activeCaptureController.stopRequested || ignoreStatusUpdates) {
                  break;
                }
              }

                try {
                  for (let attempt = 1; attempt <= iosRecordRetryMaxAttempts; attempt += 1) {
                  const attemptStartedAtMs = Date.now();
                  try {
                    appendMediaOperationalLog("capture_record_async_start", {
                      actualCameraMode: mode,
                      attempt,
                      compatibilityTier: captureProfile.compatibilityTier,
                      codec: recordingOptions?.codec ?? "default",
                      iosSegmentedRecording: Platform.OS === "ios",
                      maxDurationSeconds: recordingOptions?.maxDuration ?? null,
                      maxFileSizeBytes: recordingOptions?.maxFileSize ?? null,
                      platform: Platform.OS,
                      requestedCameraMode,
                      recordingStrategy:
                        Platform.OS === "ios" || Platform.OS === "android"
                          ? "h264_480p_low_bitrate_segmented"
                          : "default",
                      segmentIndex,
                      targetVideoBitrate: recordingVideoBitrate,
                      videoQuality: recordingVideoQuality
                    });
                    result = await camera.recordAsync(recordingOptions);
                    if (!result?.uri) {
                      throw new Error("camera_no_file_returned");
                    }
                    break;
                  } catch (recordError) {
                    const elapsedMs = Date.now() - attemptStartedAtMs;
                    if (shouldRetryIosRecordAsync(recordError, attempt, elapsedMs)) {
                      appendMediaOperationalLog(
                        "capture_record_async_retry",
                        {
                          actualCameraMode: mode,
                          attempt,
                          elapsedMs,
                          platform: Platform.OS,
                          reason: classifyCaptureFailureReason(recordError),
                          segmentIndex
                        },
                        recordError
                      );
                      await wait(iosRecordRetryDelayMs);
                      continue;
                    }

                    throw recordError;
                  }
                }
                if (!result?.uri) throw new Error("camera_no_file_returned");

                captureTimer.finish("ok", captureMetrics);
                appendMediaOperationalLog("capture_record_async_result", {
                  actualCameraMode: mode,
                  hasFile: true,
                  platform: Platform.OS,
                  segmentIndex
                });
              } catch (error) {
                captureTimer.finish("error", captureMetrics, error);
                appendMediaOperationalLog(
                  "capture_record_async_error",
                  {
                    actualCameraMode: mode,
                    platform: Platform.OS,
                    reason: classifyCaptureFailureReason(error),
                    segmentIndex
                  },
                  error
                );
                await persistCaptureDiagnostic(
                  currentPackageId,
                  classifyCaptureFailureReason(error),
                  diagnosticRunId
                );
                throw error;
              }
              const completedAt = new Date().toISOString();

              appendMediaOperationalLog("capture_preserve_start", {
                actualCameraMode: mode,
                platform: Platform.OS,
                segmentIndex
              });
              const attachedAsset = await preserveLocalVideoAsset({
                packageId: currentPackageId,
                sourceUri: result.uri,
                cameraMode: mode,
                requestedCameraMode,
                startedAt: segmentStartedAt,
                completedAt,
                chunkSizeBytes: Platform.OS === "ios" ? iosEncryptedChunkSizeBytes : undefined,
                captureProfile,
                diagnosticRunId,
                verificationMode: Platform.OS === "ios" ? "bounded" : "full"
              });
              attachedAssets.push(attachedAsset);
              activeCaptureController.attachedAssetCount += 1;
              appendMediaOperationalLog("capture_preserve_success", {
                actualCameraMode: mode,
                attachedAssetCount: activeCaptureController.attachedAssetCount,
                platform: Platform.OS,
                segmentIndex
              });
              onMediaAttachedRef.current?.();
              if (Platform.OS === "ios" || Platform.OS === "android") {
                if (!ignoreStatusUpdates) {
                  onStatusChangeRef.current?.(
                    `Video local ${cameraModeLabel(mode)} preservado em segmento seguro ${activeCaptureController.attachedAssetCount}.`
                  );
                }
                if (activeCaptureController.stopRequested) {
                  settleStopRequest({ attachedAssets: activeCaptureController.attachedAssetCount, status: "attached" });
                }
              }
              segmentIndex += 1;
              if (
                Platform.OS === "ios" &&
                segmentIndex >= iosHomologationMaxSegmentsPerCall &&
                !activeCaptureController.stopRequested &&
                !ignoreStatusUpdates
              ) {
                appendMediaOperationalLog("capture_ios_segment_limit_reached", {
                  attachedAssetCount: activeCaptureController.attachedAssetCount,
                  maxSegments: iosHomologationMaxSegmentsPerCall,
                  platform: Platform.OS
                });
                onStatusChangeRef.current?.(
                  "Video local iOS preservado em segmento seguro. O chamado segue ativo sem manter a camera em ciclo pesado."
                );
              }
            } while (
              shouldContinueSegmentedRecording({
                activeCaptureController,
                ignoreStatusUpdates,
                segmentIndex
              })
            );

            return attachedAssets;
          })
        );
        const attachedAssets = recordingResults.flatMap((result) =>
          result.status === "fulfilled" ? result.value : []
        );
        const rejectedRecordingCount = recordingResults.filter((result) => result.status === "rejected").length;
        attachedAssetCount = attachedAssets.length;
        stopSettlementStatus = attachedAssets.length > 0 ? "attached" : rejectedRecordingCount > 0 ? "error" : "empty";

        if (attachedAssets.length > 0) {
          appendMediaOperationalLog("capture_complete_with_assets", {
            assetCount: attachedAssets.length,
            platform: Platform.OS,
            rejectedRecordingCount
          });
          const cameraSummary = Array.from(new Set(attachedAssets.map((asset) => cameraModeLabel(asset.cameraMode)))).join(
            " + "
          );
          const statusMessage =
            requestedCameraMode === "both" && runtimeCameraMode !== "both"
              ? `Captura em modo leve no Android; video ${cameraSummary} preservado no cofre.`
            : runtimeCameraMode === "both" && attachedAssets.length < 2
              ? `Captura dupla limitada pelo aparelho; video ${cameraSummary} preservado no cofre.`
              : Platform.OS === "ios" && attachedAssets.length > 1
                ? `Video local ${cameraSummary} preservado em ${attachedAssets.length} segmentos seguros. Abra o player para revisar.`
                : `Video local ${cameraSummary} preservado no cofre. Abra o player para revisar.`;
          if (!ignoreStatusUpdates) {
            onStatusChangeRef.current?.(statusMessage);
          }
          return;
        }

        appendMediaOperationalLog("capture_complete_without_assets", {
          platform: Platform.OS,
          rejectedRecordingCount
        });
        const emptyDiagnosticRunId = createMediaDiagnosticRun("capture-empty");
        const emptyCaptureTimer = startMediaDiagnosticEvent(emptyDiagnosticRunId, "capture_recording");
        emptyCaptureTimer.finish(
          "error",
          {
            rejectedRecordingCount,
            requestedCameraMode,
            runtimeCameraMode
          },
          new Error("camera_no_file_returned")
        );
        await persistCaptureDiagnostic(
          currentPackageId,
          rejectedRecordingCount > 0 ? "camera_recording_error" : "camera_no_file_returned",
          emptyDiagnosticRunId
        );
        if (!ignoreStatusUpdates) {
          onStatusChangeRef.current?.("Nenhum video foi retornado pelas cameras. O pacote segue preservado com metadados.");
        }
      } catch (error) {
        stopSettlementStatus = "error";
        appendMediaOperationalLog("capture_effect_error", {
          platform: Platform.OS,
          requestedCameraMode,
          runtimeCameraMode
        }, error);
        if (attachedAssetCount === 0) {
          const effectDiagnosticRunId = createMediaDiagnosticRun("capture-effect");
          const effectTimer = startMediaDiagnosticEvent(effectDiagnosticRunId, "capture_recording");
          effectTimer.finish(
            "error",
            {
              requestedCameraMode,
              runtimeCameraMode
            },
            error
          );
          await persistCaptureDiagnostic(currentPackageId, "camera_recording_error", effectDiagnosticRunId);
        }
        if (!ignoreStatusUpdates) {
          onStatusChangeRef.current?.("Gravacao local interrompida. O pacote segue preservado com metadados e localizacao.");
        }
      } finally {
        recordingRef.current = false;
        appendMediaOperationalLog("capture_effect_finalized", {
          attachedAssetCount,
          platform: Platform.OS,
          stopSettlementStatus
        });
        if (activeCaptureControllerRef.current === activeCaptureController) {
          activeCaptureControllerRef.current = null;
        }
        settleStopRequest({ attachedAssets: attachedAssetCount, status: stopSettlementStatus });
      }
    }

    void startRecording();

    return () => {
      ignoreStatusUpdates = true;
      appendMediaOperationalLog("capture_component_cleanup", {
        platform: Platform.OS,
        recordingActive: recordingRef.current
      });
      if (activeCaptureControllerRef.current?.packageId === activePackageId) {
        activeCaptureControllerRef.current.stopRequested = true;
      }
      if (recordingRef.current) {
        stopActiveRecording(false);
      }
    };
  }, [
    activeCameraModes,
    activePackageId,
    canStartRecording,
    mediaEnabled,
    mediaPermissionStatus,
    preferences.defaultDurationSeconds,
    requestedCameraMode,
    runtimeCameraMode
  ]);

  if (!mediaEnabled || Platform.OS === "web" || mediaPermissionStatus !== "granted") return null;

  return (
    <View pointerEvents="none" style={[styles.captureHost, Platform.OS === "ios" && styles.captureHostIos]}>
      <View style={[styles.previewStack, Platform.OS === "ios" && styles.previewStackIos]}>
        {activeCameraModes.map((mode) => (
          <CameraView
            key={mode}
            ref={(camera) => {
              if (mode === "front") {
                frontCameraRef.current = camera;
              } else {
                backCameraRef.current = camera;
              }
            }}
            active={mediaEnabled}
            facing={mode}
            mode="video"
            mute={false}
            onCameraReady={() =>
              {
                appendMediaOperationalLog("capture_camera_ready", {
                  actualCameraMode: mode,
                  platform: Platform.OS,
                  requestedCameraMode,
                  targetVideoBitrate: recordingVideoBitrate,
                  videoQuality: recordingVideoQuality
                });
                setCameraReadyByMode((current) => ({
                  ...current,
                  [mode]: true
                }));
              }
            }
            onMountError={() => {
              appendMediaOperationalLog("capture_mount_error", {
                actualCameraMode: mode,
                platform: Platform.OS,
                requestedCameraMode,
                targetVideoBitrate: recordingVideoBitrate,
                videoQuality: recordingVideoQuality
              }, new Error("camera_mount_error"));
              const diagnosticRunId = createMediaDiagnosticRun(`capture-${mode}`);
              const mountTimer = startMediaDiagnosticEvent(diagnosticRunId, "capture_mount");
              mountTimer.finish(
                "error",
                {
                  actualCameraMode: mode,
                  fallbackUsed: requestedCameraMode !== mode,
                  requestedCameraMode
                },
                new Error("camera_mount_error")
              );
              if (activePackageId) {
                void persistCaptureDiagnostic(activePackageId, "camera_mount_error", diagnosticRunId);
              }
              onStatusChangeRef.current?.("Camera local nao iniciou neste aparelho; o pacote seguira com metadados.");
            }}
            videoBitrate={recordingVideoBitrate}
            videoQuality={recordingVideoQuality}
            style={[
              styles.cameraPreview,
              Platform.OS === "ios" && styles.cameraPreviewIos,
              activeCameraModes.length > 1 && styles.cameraPreviewDual
            ]}
          />
        ))}
      </View>
      <Text style={styles.captureLabel}>midia local</Text>
      <Text style={styles.captureSubLabel}>{modeLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraPreview: {
    borderRadius: 7,
    height: 38,
    opacity: 0.16,
    width: 48
  },
  cameraPreviewIos: {
    borderRadius: 9,
    height: 92,
    opacity: 0.72,
    width: 124
  },
  cameraPreviewDual: {
    height: 32,
    width: 42
  },
  captureHost: {
    alignItems: "center",
    backgroundColor: "rgba(30, 27, 46, 0.72)",
    borderColor: "rgba(255, 88, 153, 0.45)",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    bottom: 94,
    height: 62,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.sm,
    position: "absolute",
    right: theme.spacing.lg,
    width: 132,
    zIndex: 8
  },
  captureHostIos: {
    height: 130,
    width: 156
  },
  captureLabel: {
    color: theme.colors.textOnDark,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  captureSubLabel: {
    color: "rgba(255, 255, 255, 0.72)",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 1,
    textTransform: "uppercase"
  },
  previewStack: {
    flexDirection: "row",
    gap: 2,
    position: "absolute",
    right: 6,
    top: 5
  },
  previewStackIos: {
    right: 16,
    top: 8
  }
});
