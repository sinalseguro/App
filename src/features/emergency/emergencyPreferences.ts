import AsyncStorage from "@react-native-async-storage/async-storage";

const LEGACY_DEFAULT_FINISH_CODE_HASH = "e41d64db5703c6440b5c714d57251a845bc0bd241480b41a4e7fd3e052f85a82";
const DEFAULT_FINISH_CODE_HASH = "";

export type EmergencyDurationSeconds = 0 | 60 | 300 | 900 | 1800 | 3600;
export type LocalVideoCameraMode = "front" | "back" | "both";

export type EmergencyPreferences = {
  schemaVersion: 8;
  defaultDurationSeconds: EmergencyDurationSeconds;
  inAppHoldMs: number;
  locationMode: "ask_when_needed" | "foreground_pre_authorized";
  backgroundAssist: "public_build_blocked" | "homologation_required";
  finishSafety: {
    requireCode: boolean;
    codeHash: string;
  };
  emergencyPhoneCall: {
    call190ShortcutEnabled: boolean;
    call190OnSosEnabled: boolean;
    callTrustedContactOnAlert: boolean;
    allowReceiverCall190: boolean;
  };
  trustedStream: {
    status: "contract_required" | "homologation_blocked";
    requestedMedia: {
      audio: boolean;
      video: boolean;
      locationLive: boolean;
    };
    allowReceiverEncryptedSave: boolean;
    allowReceiverRelayTo190: boolean;
    legalUse: "judicial_or_protective_procedure_only";
  };
  localVideoCapture: {
    status: "enabled_local" | "homologation_required";
    cameraMode: LocalVideoCameraMode;
    requestOnSos: boolean;
    requiresExplicitConsent: true;
  };
  physicalShortcut: {
    kind: "volume_button_long_press";
    holdMs: number;
    status: "research_only";
    limitation: string;
  };
  legalConsent: {
    termsAccepted: boolean;
    privacyAccepted: boolean;
    emergencyDataSharingAccepted: boolean;
    version: string;
    acceptedAt?: string;
  };
};

const PREFERENCES_KEY = "sinalseguro.emergency-preferences.v1";

export const durationOptions: EmergencyDurationSeconds[] = [0, 60, 300, 900, 1800, 3600];

export const defaultEmergencyPreferences: EmergencyPreferences = {
  schemaVersion: 8,
  defaultDurationSeconds: 0,
  inAppHoldMs: 1800,
  locationMode: "ask_when_needed",
  backgroundAssist: "public_build_blocked",
  finishSafety: {
    requireCode: false,
    codeHash: DEFAULT_FINISH_CODE_HASH
  },
  emergencyPhoneCall: {
    call190ShortcutEnabled: true,
    call190OnSosEnabled: false,
    callTrustedContactOnAlert: false,
    allowReceiverCall190: false
  },
  trustedStream: {
    status: "homologation_blocked",
    requestedMedia: {
      audio: false,
      video: false,
      locationLive: false
    },
    allowReceiverEncryptedSave: false,
    allowReceiverRelayTo190: false,
    legalUse: "judicial_or_protective_procedure_only"
  },
  localVideoCapture: {
    status: "enabled_local",
    cameraMode: "both",
    requestOnSos: true,
    requiresExplicitConsent: true
  },
  physicalShortcut: {
    kind: "volume_button_long_press",
    holdMs: 3000,
    status: "research_only",
    limitation: "Botao de volume com tela travada depende de modulo nativo, politicas de loja e comportamento do sistema."
  },
  legalConsent: {
    termsAccepted: false,
    privacyAccepted: false,
    emergencyDataSharingAccepted: false,
    version: "mobile-mvp-2026-05-03",
    acceptedAt: undefined
  }
};

function normalizeDuration(value: unknown): EmergencyDurationSeconds {
  return durationOptions.includes(value as EmergencyDurationSeconds)
    ? (value as EmergencyDurationSeconds)
    : defaultEmergencyPreferences.defaultDurationSeconds;
}

function isStoredSecurityCodeHash(value: unknown) {
  return (
    typeof value === "string" &&
    (/^[a-f0-9]{64}$/i.test(value) || /^v2:[a-f0-9]{16,}:[a-f0-9]{64}$/i.test(value))
  );
}

export function formatDuration(seconds: number) {
  if (seconds === 0) return "Ilimitado";
  if (seconds < 60) return `${seconds}s`;
  return `${Math.round(seconds / 60)}min`;
}

export async function getEmergencyPreferences(): Promise<EmergencyPreferences> {
  const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
  if (!raw) return defaultEmergencyPreferences;

  try {
    const parsed = JSON.parse(raw) as Omit<Partial<EmergencyPreferences>, "schemaVersion"> & { schemaVersion?: number };
    const storedSchemaVersion = typeof parsed.schemaVersion === "number" ? parsed.schemaVersion : 0;
    const rawFinishCodeHash =
      typeof parsed.finishSafety?.codeHash === "string" ? parsed.finishSafety.codeHash : "";
    const parsedFinishCodeHash =
      isStoredSecurityCodeHash(rawFinishCodeHash)
        ? rawFinishCodeHash.toLowerCase()
        : defaultEmergencyPreferences.finishSafety.codeHash;
    const normalizedFinishCodeHash =
      parsedFinishCodeHash === LEGACY_DEFAULT_FINISH_CODE_HASH
        ? defaultEmergencyPreferences.finishSafety.codeHash
        : parsedFinishCodeHash;
    const normalizedCall190ShortcutEnabled = true;
    const normalizedCall190OnSosEnabled =
      typeof parsed.emergencyPhoneCall?.call190OnSosEnabled === "boolean"
        ? parsed.emergencyPhoneCall.call190OnSosEnabled
        : defaultEmergencyPreferences.emergencyPhoneCall.call190OnSosEnabled;
    const phoneCallPreferences = {
      ...defaultEmergencyPreferences.emergencyPhoneCall,
      ...parsed.emergencyPhoneCall,
      call190ShortcutEnabled: normalizedCall190ShortcutEnabled,
      call190OnSosEnabled: normalizedCall190OnSosEnabled
    };
    const parsedCameraMode =
      parsed.localVideoCapture?.cameraMode === "front" ||
      parsed.localVideoCapture?.cameraMode === "back" ||
      parsed.localVideoCapture?.cameraMode === "both"
        ? parsed.localVideoCapture.cameraMode
        : undefined;
    const normalizedCameraMode =
      storedSchemaVersion < 6
        ? defaultEmergencyPreferences.localVideoCapture.cameraMode
        : parsedCameraMode ?? defaultEmergencyPreferences.localVideoCapture.cameraMode;

    return {
      ...defaultEmergencyPreferences,
      ...parsed,
      schemaVersion: 8,
      defaultDurationSeconds: normalizeDuration(parsed.defaultDurationSeconds),
      finishSafety: {
        ...defaultEmergencyPreferences.finishSafety,
        ...parsed.finishSafety,
        requireCode: Boolean(parsed.finishSafety?.requireCode && normalizedFinishCodeHash),
        codeHash: normalizedFinishCodeHash
      },
      emergencyPhoneCall: phoneCallPreferences,
      trustedStream: {
        ...defaultEmergencyPreferences.trustedStream,
        ...parsed.trustedStream,
        requestedMedia: {
          ...defaultEmergencyPreferences.trustedStream.requestedMedia,
          ...parsed.trustedStream?.requestedMedia
        },
        status: "homologation_blocked",
        legalUse: "judicial_or_protective_procedure_only"
      },
      localVideoCapture: {
        ...defaultEmergencyPreferences.localVideoCapture,
        ...parsed.localVideoCapture,
        cameraMode: normalizedCameraMode,
        requestOnSos:
          typeof parsed.localVideoCapture?.requestOnSos === "boolean"
            ? parsed.localVideoCapture.requestOnSos
            : defaultEmergencyPreferences.localVideoCapture.requestOnSos,
        status: "enabled_local",
        requiresExplicitConsent: true
      },
      physicalShortcut: {
        ...defaultEmergencyPreferences.physicalShortcut,
        ...parsed.physicalShortcut,
        status: "research_only"
      },
      legalConsent: {
        ...defaultEmergencyPreferences.legalConsent,
        ...parsed.legalConsent,
        termsAccepted: Boolean(parsed.legalConsent?.termsAccepted),
        privacyAccepted: Boolean(parsed.legalConsent?.privacyAccepted),
        emergencyDataSharingAccepted: Boolean(parsed.legalConsent?.emergencyDataSharingAccepted),
        version:
          typeof parsed.legalConsent?.version === "string"
            ? parsed.legalConsent.version
            : defaultEmergencyPreferences.legalConsent.version,
        acceptedAt:
          typeof parsed.legalConsent?.acceptedAt === "string" ? parsed.legalConsent.acceptedAt : undefined
      }
    };
  } catch {
    return defaultEmergencyPreferences;
  }
}

export async function saveEmergencyPreferences(nextPreferences: EmergencyPreferences) {
  await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(nextPreferences));
}

export async function updateEmergencyPreferences(
  updater: (currentPreferences: EmergencyPreferences) => EmergencyPreferences
) {
  const currentPreferences = await getEmergencyPreferences();
  const nextPreferences = updater(currentPreferences);
  await saveEmergencyPreferences(nextPreferences);
  return nextPreferences;
}
