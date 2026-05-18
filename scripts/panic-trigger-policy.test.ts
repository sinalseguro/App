import assert from "node:assert/strict";

import { defaultEmergencyPreferences } from "../src/features/emergency/emergencyPreferences";
import {
  panicButtonLabel,
  resolvePanicTriggerDecision,
  shouldRequestRecordingConsent
} from "../src/features/emergency-home/panicTriggerPolicy";

const acceptedPreferences = {
  ...defaultEmergencyPreferences,
  legalConsent: {
    ...defaultEmergencyPreferences.legalConsent,
    emergencyDataSharingAccepted: true,
    privacyAccepted: true,
    termsAccepted: true
  }
};

assert.equal(shouldRequestRecordingConsent(defaultEmergencyPreferences), true);
assert.equal(shouldRequestRecordingConsent(acceptedPreferences), false);
assert.equal(
  shouldRequestRecordingConsent({
    ...defaultEmergencyPreferences,
    localVideoCapture: {
      ...defaultEmergencyPreferences.localVideoCapture,
      requestOnSos: false
    }
  }),
  false
);

assert.equal(
  resolvePanicTriggerDecision({
    activePackageId: null,
    mediaStopPending: false,
    preferences: acceptedPreferences,
    startInProgress: true
  }),
  "ignore_start_in_progress"
);

assert.equal(
  resolvePanicTriggerDecision({
    activePackageId: "pkg-1",
    mediaStopPending: true,
    preferences: acceptedPreferences,
    startInProgress: false
  }),
  "show_media_protection_progress"
);

assert.equal(
  resolvePanicTriggerDecision({
    activePackageId: "pkg-1",
    mediaStopPending: false,
    preferences: acceptedPreferences,
    startInProgress: false
  }),
  "finish_active_call"
);

assert.equal(
  resolvePanicTriggerDecision({
    activePackageId: null,
    mediaStopPending: false,
    preferences: defaultEmergencyPreferences,
    startInProgress: false
  }),
  "request_recording_consent"
);

assert.equal(
  resolvePanicTriggerDecision({
    activePackageId: null,
    mediaStopPending: false,
    preferences: acceptedPreferences,
    startInProgress: false
  }),
  "start_emergency_package"
);

assert.equal(
  panicButtonLabel({
    activePackageId: null,
    finishInProgress: false,
    mediaStopPending: false,
    startInProgress: true
  }),
  "Preparando chamado"
);
assert.equal(
  panicButtonLabel({
    activePackageId: "pkg-1",
    finishInProgress: false,
    mediaStopPending: false,
    startInProgress: false
  }),
  "Segurar para encerrar SOS"
);
assert.equal(
  panicButtonLabel({
    activePackageId: "pkg-1",
    finishInProgress: true,
    mediaStopPending: true,
    startInProgress: false
  }),
  "Encerrando gravacao"
);
assert.equal(
  panicButtonLabel({
    activePackageId: null,
    finishInProgress: false,
    mediaStopPending: true,
    startInProgress: false
  }),
  "Protegendo video"
);

console.log("panic-trigger-policy ok");
