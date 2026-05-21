import type { EmergencyStartPresentation } from "./emergencyStartPolicy";

export type EmergencyStartCreatedActions = {
  log: {
    event: "emergency_start_package_created";
    payload: {
      localVideoEnabled: boolean;
      locationCaptured: boolean;
      platform: string;
    };
  };
  recordingStatus: string;
};

export function resolveEmergencyStartCreatedActions(input: {
  localVideoEnabled: boolean;
  platform: string;
  presentation: EmergencyStartPresentation;
}): EmergencyStartCreatedActions {
  return {
    log: {
      event: "emergency_start_package_created",
      payload: {
        localVideoEnabled: input.localVideoEnabled,
        locationCaptured: input.presentation.locationCaptured,
        platform: input.platform
      }
    },
    recordingStatus: input.presentation.recordingStatus
  };
}
