import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { theme } from "@/design/theme";
import { EmergencyPreferences } from "./emergencyPreferences";
import { preserveLocalVideoAsset } from "./mediaCapture";

type MediaPermissionStatus = "idle" | "requesting" | "granted" | "denied";

type EmergencyMediaRecorderProps = {
  activePackageId: string | null;
  preferences: EmergencyPreferences;
  onMediaAttached?: () => void;
  onStatusChange?: (status: string) => void;
};

export function EmergencyMediaRecorder({
  activePackageId,
  preferences,
  onMediaAttached,
  onStatusChange
}: EmergencyMediaRecorderProps) {
  const cameraRef = useRef<CameraView | null>(null);
  const recordingRef = useRef(false);
  const startedAtRef = useRef<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [mediaPermissionStatus, setMediaPermissionStatus] = useState<MediaPermissionStatus>("idle");

  const mediaEnabled = Boolean(activePackageId && preferences.localVideoCapture.requestOnSos);
  const requestedCameraMode = preferences.localVideoCapture.cameraMode;
  const facing = requestedCameraMode === "back" ? "back" : "front";

  useEffect(() => {
    if (!mediaEnabled || Platform.OS === "web") {
      setCameraReady(false);
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
        onStatusChange?.("Chamado ativo sem video: camera ou microfone nao autorizados neste dispositivo.");
        return;
      }

      setMediaPermissionStatus("granted");
    }

    void prepareMediaPermissions();

    return () => {
      cancelled = true;
    };
  }, [mediaEnabled, onStatusChange]);

  useEffect(() => {
    if (
      !mediaEnabled ||
      !activePackageId ||
      Platform.OS === "web" ||
      mediaPermissionStatus !== "granted" ||
      !cameraReady ||
      recordingRef.current
    ) {
      return;
    }

    let ignoreStatusUpdates = false;

    async function startRecording() {
      const currentPackageId = activePackageId;
      if (!currentPackageId) return;

      if (!cameraRef.current) {
        return;
      }

      recordingRef.current = true;
      const startedAt = new Date().toISOString();
      startedAtRef.current = startedAt;
      onStatusChange?.(
        requestedCameraMode === "both"
          ? "Modo ambas solicitado. Este build privado grava a camera frontal neste acionamento; captura dupla exige modulo nativo homologado."
          : "Gravacao local de video e audio iniciada no sandbox privado do app."
      );

      try {
        const maxDuration =
          preferences.defaultDurationSeconds > 0 ? { maxDuration: preferences.defaultDurationSeconds } : undefined;
        const result = await cameraRef.current?.recordAsync(maxDuration);
        const completedAt = new Date().toISOString();

        if (result?.uri) {
          const asset = await preserveLocalVideoAsset({
            packageId: currentPackageId,
            sourceUri: result.uri,
            cameraMode: facing,
            requestedCameraMode,
            startedAt,
            completedAt
          });
          if (!ignoreStatusUpdates) {
            onStatusChange?.(`Video local ${asset.fileName} preservado. Abra o cofre para revisar no player.`);
          }
          onMediaAttached?.();
        }
      } catch {
        if (!ignoreStatusUpdates) {
          onStatusChange?.("Gravacao local interrompida. O pacote segue preservado com metadados e localizacao.");
        }
      } finally {
        recordingRef.current = false;
        startedAtRef.current = null;
      }
    }

    void startRecording();

    return () => {
      ignoreStatusUpdates = true;
      if (recordingRef.current) {
        void cameraRef.current?.stopRecording();
      }
    };
  }, [
    activePackageId,
    cameraReady,
    facing,
    mediaEnabled,
    mediaPermissionStatus,
    onMediaAttached,
    onStatusChange,
    preferences.defaultDurationSeconds,
    requestedCameraMode
  ]);

  if (!mediaEnabled || Platform.OS === "web" || mediaPermissionStatus !== "granted") return null;

  return (
    <View pointerEvents="none" style={styles.captureHost}>
      <CameraView
        ref={cameraRef}
        active={mediaEnabled}
        facing={facing}
        mode="video"
        mute={false}
        onCameraReady={() => setCameraReady(true)}
        style={styles.cameraPreview}
      />
      <Text style={styles.captureLabel}>midia local</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraPreview: {
    borderRadius: 8,
    height: 42,
    opacity: 0.16,
    position: "absolute",
    right: 6,
    top: 6,
    width: 54
  },
  captureHost: {
    alignItems: "center",
    backgroundColor: "rgba(30, 27, 46, 0.72)",
    borderColor: "rgba(255, 88, 153, 0.45)",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    bottom: 94,
    height: 54,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.sm,
    position: "absolute",
    right: theme.spacing.lg,
    width: 118,
    zIndex: 8
  },
  captureLabel: {
    color: theme.colors.textOnDark,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  }
});
