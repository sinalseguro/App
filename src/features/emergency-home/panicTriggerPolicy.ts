import type { EmergencyPreferences } from "@/features/emergency/emergencyPreferences";

type PanicTriggerPreferences = Pick<EmergencyPreferences, "legalConsent" | "localVideoCapture">;

export type PanicTriggerDecision =
  | "finish_active_call"
  | "ignore_start_in_progress"
  | "request_recording_consent"
  | "show_media_protection_progress"
  | "start_emergency_package";

export type PanicTriggerDecisionInput = {
  activePackageId: string | null;
  mediaStopPending: boolean;
  preferences: PanicTriggerPreferences;
  startInProgress: boolean;
};

export type PanicButtonLabelInput = {
  activePackageId: string | null;
  finishInProgress: boolean;
  mediaStopPending: boolean;
  startInProgress: boolean;
};

export function shouldRequestRecordingConsent(preferences: PanicTriggerPreferences) {
  return (
    preferences.localVideoCapture.requestOnSos &&
    (!preferences.legalConsent.termsAccepted ||
      !preferences.legalConsent.privacyAccepted ||
      !preferences.legalConsent.emergencyDataSharingAccepted)
  );
}

export function resolvePanicTriggerDecision(input: PanicTriggerDecisionInput): PanicTriggerDecision {
  if (input.startInProgress) return "ignore_start_in_progress";
  if (input.mediaStopPending) return "show_media_protection_progress";
  if (input.activePackageId) return "finish_active_call";
  if (shouldRequestRecordingConsent(input.preferences)) return "request_recording_consent";
  return "start_emergency_package";
}

export function panicButtonLabel(input: PanicButtonLabelInput) {
  if (input.startInProgress) return "Preparando chamado";
  if (input.activePackageId) return input.finishInProgress ? "Encerrando gravacao" : "Segurar para encerrar SOS";
  if (input.mediaStopPending) return "Protegendo video";
  return "Segurar para pedir ajuda";
}
