import type { EmergencyPreferences } from "@/features/emergency/emergencyPreferences";

import { resolveLocalSosPackageStatus } from "./localSosPackageStatusPolicy";

export type EmergencyStartRuntimeActionsDecision = {
  logEvent: "emergency_start_requested";
  logPayload: {
    defaultDurationSeconds: EmergencyPreferences["defaultDurationSeconds"];
    localVideoEnabled: boolean;
    platform: string;
    requestedCameraMode: EmergencyPreferences["localVideoCapture"]["cameraMode"];
  };
  recordingStatus: string;
  shouldClearLiveRemoteSession: true;
  shouldClearOwnerAutoCallState: true;
  shouldMarkStartInProgress: true;
  shouldResetLiveAudioCall: true;
};

export function resolveEmergencyStartRuntimeActions(input: {
  platform: string;
  preferences: EmergencyPreferences;
}): EmergencyStartRuntimeActionsDecision {
  return {
    logEvent: "emergency_start_requested",
    logPayload: {
      defaultDurationSeconds: input.preferences.defaultDurationSeconds,
      localVideoEnabled: input.preferences.localVideoCapture.requestOnSos,
      platform: input.platform,
      requestedCameraMode: input.preferences.localVideoCapture.cameraMode
    },
    recordingStatus: resolveLocalSosPackageStatus({ event: "start_requested" }),
    shouldClearLiveRemoteSession: true,
    shouldClearOwnerAutoCallState: true,
    shouldMarkStartInProgress: true,
    shouldResetLiveAudioCall: true
  };
}
