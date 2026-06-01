import assert from "node:assert/strict";

import { defaultEmergencyPreferences } from "../src/features/emergency/emergencyPreferences";
import {
  resolveSosControllerFinishStart,
  resolveSosControllerFinishMediaStopRequest,
  resolveSosControllerFinishMediaStopResult,
  resolveSosControllerFinishMediaStopSignaled,
  resolveSosControllerTrigger
} from "../src/features/emergency-home/sosControllerPolicy";

const acceptedPreferences = {
  ...defaultEmergencyPreferences,
  legalConsent: {
    ...defaultEmergencyPreferences.legalConsent,
    emergencyDataSharingAccepted: true,
    privacyAccepted: true,
    termsAccepted: true
  }
};

assert.deepEqual(
  resolveSosControllerTrigger({
    activePackageId: null,
    currentFinishProgress: 0,
    mediaStopPending: false,
    platform: "android",
    preferences: acceptedPreferences,
    startInProgress: true
  }),
  {
    action: "ignore_start_in_progress"
  }
);

assert.deepEqual(
  resolveSosControllerTrigger({
    activePackageId: "pkg-1",
    currentFinishProgress: 70,
    mediaStopPending: true,
    platform: "android",
    preferences: acceptedPreferences,
    startInProgress: false
  }),
  {
    action: "show_media_protection_progress",
    finishProgress: {
      detail: "A camera ja foi encerrada. O app ainda esta criptografando e anexando a midia no cofre local.",
      progress: 70,
      status: "running",
      title: "Protegendo video"
    },
    recordingStatus: "Protecao do video local em andamento. O cofre sera atualizado automaticamente."
  }
);

assert.deepEqual(
  resolveSosControllerTrigger({
    activePackageId: "pkg-1",
    currentFinishProgress: 0,
    mediaStopPending: false,
    platform: "android",
    preferences: acceptedPreferences,
    startInProgress: false
  }),
  {
    action: "finish_active_call"
  }
);

assert.deepEqual(
  resolveSosControllerTrigger({
    activePackageId: null,
    currentFinishProgress: 0,
    mediaStopPending: false,
    platform: "android",
    preferences: defaultEmergencyPreferences,
    startInProgress: false
  }),
  {
    action: "request_recording_consent"
  }
);

assert.deepEqual(
  resolveSosControllerTrigger({
    activePackageId: null,
    currentFinishProgress: 0,
    mediaStopPending: false,
    platform: "ios",
    preferences: {
      ...acceptedPreferences,
      defaultDurationSeconds: 300,
      localVideoCapture: {
        ...acceptedPreferences.localVideoCapture,
        cameraMode: "front"
      }
    },
    startInProgress: false
  }),
  {
    action: "start_emergency_package",
    startRuntimeActions: {
      logEvent: "emergency_start_requested",
      logPayload: {
        defaultDurationSeconds: 300,
        localVideoEnabled: true,
        platform: "ios",
        requestedCameraMode: "front"
      },
      recordingStatus: "Pedindo ajuda...",
      shouldClearLiveRemoteSession: true,
      shouldClearOwnerAutoCallState: true,
      shouldMarkStartInProgress: true,
      shouldResetLiveAudioCall: true
    }
  }
);

assert.deepEqual(
  resolveSosControllerFinishStart({
    activePackageId: null,
    captureStopLocked: false,
    finishInProgress: false,
    finishInProgressRef: false,
    liveAudioRemoteSessionId: null,
    liveRemoteSessionId: null,
    ownerLiveVideoRecordingActive: false,
    ownerLiveVideoStartRequestActive: false,
    platform: "android"
  }),
  {
    shouldStart: false,
    startDecision: {
      reason: "missing_active_package",
      shouldStart: false
    }
  }
);

assert.deepEqual(
  resolveSosControllerFinishStart({
    activePackageId: "pkg-1",
    captureStopLocked: true,
    finishInProgress: false,
    finishInProgressRef: false,
    liveAudioRemoteSessionId: "session-audio",
    liveRemoteSessionId: "session-remote",
    ownerLiveVideoRecordingActive: false,
    ownerLiveVideoStartRequestActive: false,
    platform: "android"
  }),
  {
    mediaWasHandedToLiveCall: true,
    packageId: "pkg-1",
    remoteSessionIdToFinish: "session-audio",
    runtimeStateActions: {
      finishProgress: {
        detail: "Interrompendo a gravacao local e salvando o pacote.",
        progress: 12,
        status: "running",
        title: "Encerrando chamado"
      },
      log: {
        event: "emergency_finish_button_pressed",
        payload: {
          platform: "android"
        }
      },
      ownerAutoCallSessionIdToClear: "session-audio",
      recordingStatus: "Encerrando chamado seguro...",
      shouldClearLiveRemoteSession: true,
      shouldMarkFinishInProgress: true,
      shouldResetLiveAudioCall: true,
      shouldStopOwnerLiveVideoEvidence: true,
      stopOwnerLiveVideoEvidenceReason: "finish"
    },
    shouldStart: true,
    startDecision: {
      mediaWasHandedToLiveCall: true,
      packageId: "pkg-1",
      remoteSessionIdToFinish: "session-audio",
      shouldStart: true
    }
  }
);

assert.deepEqual(
  resolveSosControllerFinishMediaStopRequest({
    mediaWasHandedToLiveCall: true
  }),
  {
    mediaStopPurpose: "finish",
    requestActions: {
      shouldSignalMediaRecorderStop: false
    }
  }
);

assert.deepEqual(
  resolveSosControllerFinishMediaStopRequest({
    mediaWasHandedToLiveCall: false
  }),
  {
    mediaStopPurpose: "finish",
    requestActions: {
      shouldSignalMediaRecorderStop: true
    }
  }
);

assert.deepEqual(
  resolveSosControllerFinishMediaStopSignaled({
    packageId: "pkg-1",
    stopSerial: null
  }),
  {
    shouldApply: false
  }
);

assert.deepEqual(
  resolveSosControllerFinishMediaStopSignaled({
    packageId: "pkg-1",
    stopSerial: 7
  }),
  {
    shouldApply: true,
    startActions: {
      finishProgress: {
        detail: "Camera sinalizada. O chamado saiu do modo ativo enquanto a midia continua protegendo.",
        progress: 24,
        status: "running",
        title: "Encerrando gravacao"
      },
      mediaRecorderPackageId: "pkg-1",
      nextActivePackageId: null,
      shouldLockCaptureStop: true,
      shouldSetMediaStopPending: true
    },
    stopSerial: 7
  }
);

assert.deepEqual(
  resolveSosControllerFinishMediaStopResult({
    attachedAssets: 2,
    platform: "android",
    status: "attached"
  }),
  {
    finishProgress: {
      detail: "Midia criptografada. A finalizacao do pacote pode seguir em segundo plano.",
      progress: 72,
      status: "background",
      title: "Midia protegida"
    },
    logEvent: "emergency_media_stop_progress_result",
    logPayload: {
      attachedAssets: 2,
      platform: "android",
      status: "attached"
    },
    shouldClearMediaStopPending: true
  }
);

console.log("sos-controller-policy ok");
