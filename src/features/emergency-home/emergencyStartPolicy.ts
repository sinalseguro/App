import type { EmergencyPreferences } from "@/features/emergency/emergencyPreferences";
import type { LocationSnapshot } from "@/features/emergency/types";

export type EmergencyStartLocationConsentMode = "foreground_pre_authorized" | "foreground_when_triggered";

export type EmergencyStartPackagePolicy = {
  captureLocation: boolean;
  defaultDurationSeconds: EmergencyPreferences["defaultDurationSeconds"];
  kind: "test";
  locationConsentMode: EmergencyStartLocationConsentMode;
};

export type EmergencyStartRequestPolicy = {
  packagePolicy: EmergencyStartPackagePolicy;
  shouldOpenEmergencyPhoneCall: boolean;
};

export type EmergencyStartPresentation = {
  locationCaptured: boolean;
  locationText: string;
  recordingDurationLabel: string;
  recordingStatus: string;
};

function formatRecordingDurationLabel(seconds: number) {
  if (seconds === 0) return "ilimitada";
  if (seconds < 60) return `${seconds}s`;
  return `${Math.round(seconds / 60)}min`;
}

export function resolveEmergencyStartRequestPolicy(input: {
  platformOS: string;
  preferences: EmergencyPreferences;
}): EmergencyStartRequestPolicy {
  return {
    packagePolicy: {
      captureLocation: input.platformOS !== "web",
      defaultDurationSeconds: input.preferences.defaultDurationSeconds,
      kind: "test",
      locationConsentMode:
        input.preferences.locationMode === "foreground_pre_authorized"
          ? "foreground_pre_authorized"
          : "foreground_when_triggered"
    },
    shouldOpenEmergencyPhoneCall:
      input.preferences.emergencyPhoneCall.call190OnSosEnabled && input.platformOS !== "web"
  };
}

export function resolveEmergencyStartPresentation(input: {
  defaultDurationSeconds: number;
  locationStatus: LocationSnapshot["status"];
}): EmergencyStartPresentation {
  const locationCaptured = input.locationStatus === "captured";
  const locationText = locationCaptured ? "Localizacao preservada." : "Localizacao nao registrada.";
  const recordingDurationLabel = formatRecordingDurationLabel(input.defaultDurationSeconds);

  return {
    locationCaptured,
    locationText,
    recordingDurationLabel,
    recordingStatus: `Você pediu ajuda. Gravacao ${recordingDurationLabel}. ${locationText} Arquivo no cofre local.`
  };
}
