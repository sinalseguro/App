import assert from "node:assert/strict";

import { resolveEmergencyStartCreatedActions } from "../src/features/emergency-home/emergencyStartCreatedActionsPolicy";

assert.deepEqual(
  resolveEmergencyStartCreatedActions({
    localVideoEnabled: true,
    platform: "android",
    presentation: {
      locationCaptured: true,
      locationText: "Localizacao preservada.",
      recordingDurationLabel: "5min",
      recordingStatus: "Você pediu ajuda. Gravacao 5min. Localizacao preservada. Arquivo no cofre local."
    }
  }),
  {
    log: {
      event: "emergency_start_package_created",
      payload: {
        localVideoEnabled: true,
        locationCaptured: true,
        platform: "android"
      }
    },
    recordingStatus: "Você pediu ajuda. Gravacao 5min. Localizacao preservada. Arquivo no cofre local."
  }
);

assert.deepEqual(
  resolveEmergencyStartCreatedActions({
    localVideoEnabled: false,
    platform: "ios",
    presentation: {
      locationCaptured: false,
      locationText: "Localizacao nao registrada.",
      recordingDurationLabel: "ilimitada",
      recordingStatus: "Você pediu ajuda. Gravacao ilimitada. Localizacao nao registrada. Arquivo no cofre local."
    }
  }).log.payload,
  {
    localVideoEnabled: false,
    locationCaptured: false,
    platform: "ios"
  }
);

console.log("emergency-start-created-actions-policy ok");
