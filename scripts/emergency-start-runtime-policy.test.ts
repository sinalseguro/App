import assert from "node:assert/strict";

import { defaultEmergencyPreferences } from "../src/features/emergency/emergencyPreferences";
import { resolveEmergencyStartRuntimeActions } from "../src/features/emergency-home/emergencyStartRuntimePolicy";

assert.deepEqual(
  resolveEmergencyStartRuntimeActions({
    platform: "android",
    preferences: {
      ...defaultEmergencyPreferences,
      defaultDurationSeconds: 300,
      localVideoCapture: {
        ...defaultEmergencyPreferences.localVideoCapture,
        cameraMode: "front",
        requestOnSos: true
      }
    }
  }),
  {
    logEvent: "emergency_start_requested",
    logPayload: {
      defaultDurationSeconds: 300,
      localVideoEnabled: true,
      platform: "android",
      requestedCameraMode: "front"
    },
    recordingStatus: "Pedindo ajuda...",
    shouldClearLiveRemoteSession: true,
    shouldClearOwnerAutoCallState: true,
    shouldMarkStartInProgress: true,
    shouldResetLiveAudioCall: true
  }
);

assert.deepEqual(
  resolveEmergencyStartRuntimeActions({
    platform: "ios",
    preferences: {
      ...defaultEmergencyPreferences,
      defaultDurationSeconds: 0,
      localVideoCapture: {
        ...defaultEmergencyPreferences.localVideoCapture,
        cameraMode: "back",
        requestOnSos: false
      }
    }
  }).logPayload,
  {
    defaultDurationSeconds: 0,
    localVideoEnabled: false,
    platform: "ios",
    requestedCameraMode: "back"
  }
);

console.log("emergency-start-runtime-policy ok");
