import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { theme } from "@/design/theme";
import { EmergencyPreferences } from "./emergencyPreferences";
import { preserveLocalVideoAsset } from "./mediaCapture";

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

  const mediaEnabled = Boolean(activePackageId && preferences.localVideoCapture.requestOnSos);
  const facing = preferences.localVideoCapture.cameraMode === "back" ? "back" : "front";

  useEffect(() => {
    if (!mediaEnabled || !activePackageId || Platform.OS === "web" || !cameraReady || recordingRef.current) {
      return;
    }

    let ignoreStatusUpdates = false;

    async function startRecording() {
      const currentPackageId = activePackageId;
      if (!currentPackageId) return;
      const currentCameraPermission = await Camera.getCameraPermissionsAsync();
      const cameraAuthorization = currentCameraPermission.granted
        ? currentCameraPermission
        : await Camera.requestCameraPermissionsAsync();
      const currentMicrophonePermission = await Camera.getMicrophonePermissionsAsync();
      const microphoneAuthorization = currentMicrophonePermission.granted
        ? currentMicrophonePermission
        : await Camera.requestMicrophonePermissionsAsync();

      if (!cameraAuthorization.granted || !microphoneAuthorization.granted) {
        onStatusChange?.("Chamado ativo sem video: camera ou microfone nao autorizados neste dispositivo.");
        return;
      }

      recordingRef.current = true;
      const startedAt = new Date().toISOString();
      startedAtRef.current = startedAt;
      onStatusChange?.("Gravacao local de video e audio iniciada no sandbox privado do app.");

      try {
        const maxDuration =
          preferences.defaultDurationSeconds > 0 ? { maxDuration: preferences.defaultDurationSeconds } : undefined;
        const result = await cameraRef.current?.recordAsync(maxDuration);
        const completedAt = new Date().toISOString();

        if (result?.uri) {
          const asset = await preserveLocalVideoAsset({
            packageId: currentPackageId,
            sourceUri: result.uri,
            cameraMode: preferences.localVideoCapture.cameraMode,
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
    mediaEnabled,
    onMediaAttached,
    onStatusChange,
    preferences.defaultDurationSeconds,
    preferences.localVideoCapture.cameraMode
  ]);

  if (!mediaEnabled || Platform.OS === "web") return null;

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
    height: 2,
    opacity: 0.02,
    position: "absolute",
    right: 0,
    top: 0,
    width: 2
  },
  captureHost: {
    alignItems: "center",
    backgroundColor: "rgba(30, 27, 46, 0.72)",
    borderColor: "rgba(255, 88, 153, 0.45)",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    bottom: 94,
    height: 28,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.sm,
    position: "absolute",
    right: theme.spacing.lg,
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
