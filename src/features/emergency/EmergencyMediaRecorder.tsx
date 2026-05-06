import { useEffect, useMemo, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { theme } from "@/design/theme";
import { EmergencyPreferences } from "./emergencyPreferences";
import { preserveLocalVideoAsset } from "./mediaCapture";

type MediaPermissionStatus = "idle" | "requesting" | "granted" | "denied";
type ActualCameraMode = "front" | "back";
type CameraReadyByMode = Record<ActualCameraMode, boolean>;

type EmergencyMediaRecorderProps = {
  activePackageId: string | null;
  preferences: EmergencyPreferences;
  onMediaAttached?: () => void;
  stopRequestSerial?: number;
  onStatusChange?: (status: string) => void;
};

const emptyCameraReadyState: CameraReadyByMode = { back: false, front: false };

function cameraModeLabel(mode: ActualCameraMode) {
  return mode === "front" ? "frontal" : "traseira";
}

function getRuntimeCameraMode(requestedCameraMode: EmergencyPreferences["localVideoCapture"]["cameraMode"]) {
  if (Platform.OS === "android" && requestedCameraMode === "both") {
    return "front";
  }

  return requestedCameraMode;
}

export function EmergencyMediaRecorder({
  activePackageId,
  preferences,
  onMediaAttached,
  stopRequestSerial = 0,
  onStatusChange
}: EmergencyMediaRecorderProps) {
  const frontCameraRef = useRef<CameraView | null>(null);
  const backCameraRef = useRef<CameraView | null>(null);
  const recordingRef = useRef(false);
  const onMediaAttachedRef = useRef(onMediaAttached);
  const onStatusChangeRef = useRef(onStatusChange);
  const handledStopRequestSerialRef = useRef(0);
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

  function stopActiveRecording() {
    if (!recordingRef.current) return;

    onStatusChangeRef.current?.("Encerrando gravacao local e preparando arquivo seguro.");
    void frontCameraRef.current?.stopRecording();
    void backCameraRef.current?.stopRecording();
  }

  useEffect(() => {
    onMediaAttachedRef.current = onMediaAttached;
    onStatusChangeRef.current = onStatusChange;
  }, [onMediaAttached, onStatusChange]);

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
        onStatusChangeRef.current?.("Chamado ativo sem video: camera ou microfone nao autorizados neste dispositivo.");
        return;
      }

      setMediaPermissionStatus("granted");
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

      if (availableCameras.length === 0) return;

      recordingRef.current = true;
      const startedAt = new Date().toISOString();
      onStatusChangeRef.current?.(
        requestedCameraMode === "both" && runtimeCameraMode !== "both"
          ? "Gravacao local iniciada em modo leve no Android para evitar travamento."
          : runtimeCameraMode === "both" && availableCameras.length === 2
          ? "Gravacao local iniciada com camera frontal e traseira. O aparelho precisa sustentar captura dupla."
          : `Gravacao local de video e audio iniciada pela camera ${cameraModeLabel(availableCameras[0].mode)}.`
      );

      try {
        const recordingOptions =
          preferences.defaultDurationSeconds > 0 ? { maxDuration: preferences.defaultDurationSeconds } : undefined;
        const recordingResults = await Promise.allSettled(
          availableCameras.map(async ({ camera, mode }) => {
            const result = await camera.recordAsync(recordingOptions);
            const completedAt = new Date().toISOString();
            if (!result?.uri) {
              throw new Error(`Camera ${mode} nao retornou arquivo de video.`);
            }

            return preserveLocalVideoAsset({
              packageId: currentPackageId,
              sourceUri: result.uri,
              cameraMode: mode,
              requestedCameraMode,
              startedAt,
              completedAt
            });
          })
        );
        const attachedAssets = recordingResults.flatMap((result) =>
          result.status === "fulfilled" ? [result.value] : []
        );

        if (attachedAssets.length > 0) {
          const cameraSummary = attachedAssets.map((asset) => cameraModeLabel(asset.cameraMode)).join(" + ");
          const statusMessage =
            requestedCameraMode === "both" && runtimeCameraMode !== "both"
              ? `Captura em modo leve no Android; video ${cameraSummary} preservado no cofre.`
              : runtimeCameraMode === "both" && attachedAssets.length < 2
              ? `Captura dupla limitada pelo aparelho; video ${cameraSummary} preservado no cofre.`
              : `Video local ${cameraSummary} preservado no cofre. Abra o player para revisar.`;
          if (!ignoreStatusUpdates) {
            onStatusChangeRef.current?.(statusMessage);
          }
          onMediaAttachedRef.current?.();
          return;
        }

        if (!ignoreStatusUpdates) {
          onStatusChangeRef.current?.("Nenhum video foi retornado pelas cameras. O pacote segue preservado com metadados.");
        }
      } catch {
        if (!ignoreStatusUpdates) {
          onStatusChangeRef.current?.("Gravacao local interrompida. O pacote segue preservado com metadados e localizacao.");
        }
      } finally {
        recordingRef.current = false;
      }
    }

    void startRecording();

    return () => {
      ignoreStatusUpdates = true;
      if (recordingRef.current) {
        stopActiveRecording();
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
    <View pointerEvents="none" style={styles.captureHost}>
      <View style={styles.previewStack}>
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
              setCameraReadyByMode((current) => ({
                ...current,
                [mode]: true
              }))
            }
            videoBitrate={1_200_000}
            videoQuality="480p"
            style={[styles.cameraPreview, activeCameraModes.length > 1 && styles.cameraPreviewDual]}
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
  }
});
