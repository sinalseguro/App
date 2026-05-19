import {
  resolveEmergencyStartFailureDialogPresentation,
  type EmergencyStartFailureDialogPresentation
} from "./emergencyStartFailureDialogPolicy";
import { resolveLocalSosPackageStatus } from "./localSosPackageStatusPolicy";

export type EmergencyStartFailureActionsDecision = {
  dialogPresentation: EmergencyStartFailureDialogPresentation;
  logEvent: "emergency_start_error";
  logPayload: {
    platform: string;
  };
  recordingStatus: string;
  shouldClearActivePackageId: true;
  shouldShowDialog: true;
};

export function resolveEmergencyStartFailureActions(input: {
  platform: string;
}): EmergencyStartFailureActionsDecision {
  return {
    dialogPresentation: resolveEmergencyStartFailureDialogPresentation(),
    logEvent: "emergency_start_error",
    logPayload: {
      platform: input.platform
    },
    recordingStatus: resolveLocalSosPackageStatus({ event: "start_failed" }),
    shouldClearActivePackageId: true,
    shouldShowDialog: true
  };
}
