import AsyncStorage from "@react-native-async-storage/async-storage";

export type EmergencyDurationSeconds = 30 | 60 | 180 | 300;

export type EmergencyPreferences = {
  schemaVersion: 2;
  defaultDurationSeconds: EmergencyDurationSeconds;
  inAppHoldMs: number;
  locationMode: "ask_when_needed" | "foreground_pre_authorized";
  backgroundAssist: "public_build_blocked" | "homologation_required";
  emergencyPhoneCall: {
    call190ShortcutEnabled: boolean;
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
  physicalShortcut: {
    kind: "volume_button_long_press";
    holdMs: number;
    status: "research_only";
    limitation: string;
  };
};

const PREFERENCES_KEY = "sinalseguro.emergency-preferences.v1";

export const durationOptions: EmergencyDurationSeconds[] = [30, 60, 180, 300];

export const defaultEmergencyPreferences: EmergencyPreferences = {
  schemaVersion: 2,
  defaultDurationSeconds: 60,
  inAppHoldMs: 1800,
  locationMode: "ask_when_needed",
  backgroundAssist: "public_build_blocked",
  emergencyPhoneCall: {
    call190ShortcutEnabled: true,
    callTrustedContactOnAlert: false,
    allowReceiverCall190: true
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
  physicalShortcut: {
    kind: "volume_button_long_press",
    holdMs: 3000,
    status: "research_only",
    limitation: "Botao de volume com tela travada depende de modulo nativo, politicas de loja e comportamento do sistema."
  }
};

function normalizeDuration(value: unknown): EmergencyDurationSeconds {
  return durationOptions.includes(value as EmergencyDurationSeconds)
    ? (value as EmergencyDurationSeconds)
    : defaultEmergencyPreferences.defaultDurationSeconds;
}

export function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.round(seconds / 60)}min`;
}

export async function getEmergencyPreferences(): Promise<EmergencyPreferences> {
  const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
  if (!raw) return defaultEmergencyPreferences;

  try {
    const parsed = JSON.parse(raw) as Partial<EmergencyPreferences>;
    const phoneCallPreferences = {
      ...defaultEmergencyPreferences.emergencyPhoneCall,
      ...parsed.emergencyPhoneCall,
      call190ShortcutEnabled:
        parsed.schemaVersion === 2
          ? parsed.emergencyPhoneCall?.call190ShortcutEnabled ?? defaultEmergencyPreferences.emergencyPhoneCall.call190ShortcutEnabled
          : true
    };

    return {
      ...defaultEmergencyPreferences,
      ...parsed,
      schemaVersion: 2,
      defaultDurationSeconds: normalizeDuration(parsed.defaultDurationSeconds),
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
      physicalShortcut: {
        ...defaultEmergencyPreferences.physicalShortcut,
        ...parsed.physicalShortcut,
        status: "research_only"
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
