import assert from "node:assert/strict";

import { defaultEmergencyPreferences } from "../src/features/emergency/emergencyPreferences";
import {
  resolveEmergencyStartPresentation,
  resolveEmergencyStartRequestPolicy
} from "../src/features/emergency-home/emergencyStartPolicy";

assert.deepEqual(
  resolveEmergencyStartRequestPolicy({
    platformOS: "android",
    preferences: {
      ...defaultEmergencyPreferences,
      defaultDurationSeconds: 300,
      emergencyPhoneCall: {
        ...defaultEmergencyPreferences.emergencyPhoneCall,
        call190OnSosEnabled: true
      },
      locationMode: "foreground_pre_authorized"
    }
  }),
  {
    packagePolicy: {
      captureLocation: true,
      defaultDurationSeconds: 300,
      kind: "test",
      locationConsentMode: "foreground_pre_authorized"
    },
    shouldOpenEmergencyPhoneCall: true
  }
);

assert.deepEqual(
  resolveEmergencyStartRequestPolicy({
    platformOS: "web",
    preferences: {
      ...defaultEmergencyPreferences,
      emergencyPhoneCall: {
        ...defaultEmergencyPreferences.emergencyPhoneCall,
        call190OnSosEnabled: true
      },
      locationMode: "ask_when_needed"
    }
  }),
  {
    packagePolicy: {
      captureLocation: false,
      defaultDurationSeconds: 0,
      kind: "test",
      locationConsentMode: "foreground_when_triggered"
    },
    shouldOpenEmergencyPhoneCall: false
  }
);

assert.deepEqual(
  resolveEmergencyStartPresentation({
    defaultDurationSeconds: 0,
    locationStatus: "captured"
  }),
  {
    locationCaptured: true,
    locationText: "Localizacao preservada.",
    recordingDurationLabel: "ilimitada",
    recordingStatus: "Você pediu ajuda. Gravacao ilimitada. Localizacao preservada. Arquivo no cofre local."
  }
);

assert.deepEqual(
  resolveEmergencyStartPresentation({
    defaultDurationSeconds: 60,
    locationStatus: "permission_denied"
  }),
  {
    locationCaptured: false,
    locationText: "Localizacao nao registrada.",
    recordingDurationLabel: "1min",
    recordingStatus: "Você pediu ajuda. Gravacao 1min. Localizacao nao registrada. Arquivo no cofre local."
  }
);

console.log("emergency-start-policy ok");
