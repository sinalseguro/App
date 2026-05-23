export type EmergencySettingsDrawerIconKey = "alert" | "angels" | "archive" | "player" | "profile" | "settings";
export type EmergencySettingsDrawerActionKey = "alerts" | "angels" | "player" | "profiles" | "settings" | "vault";

export type EmergencySettingsDrawerAction = {
  iconKey: EmergencySettingsDrawerIconKey;
  key: EmergencySettingsDrawerActionKey;
  label: string;
};

export type EmergencySettingsDrawerPresentation = {
  actionAccessibilityRole: "button";
  actions: EmergencySettingsDrawerAction[];
  drawerTestID: "home-settings-drawer";
  iconSize: number;
  labelTextFit: {
    maxFontSizeMultiplier: number;
    numberOfLines: number;
  };
};

export const emergencySettingsDrawerActions: EmergencySettingsDrawerAction[] = [
  { iconKey: "archive", key: "vault", label: "Cofre" },
  { iconKey: "angels", key: "angels", label: "Anjos" },
  { iconKey: "alert", key: "alerts", label: "Alertas" },
  { iconKey: "profile", key: "profiles", label: "Perfis" },
  { iconKey: "player", key: "player", label: "Player" },
  { iconKey: "settings", key: "settings", label: "Configuracoes" }
];

export const emergencySettingsDrawerIconSize = 18;

export const emergencySettingsDrawerLabelTextFit = {
  maxFontSizeMultiplier: 1.2,
  numberOfLines: 1
};

export function resolveEmergencySettingsDrawerPresentation(): EmergencySettingsDrawerPresentation {
  return {
    actionAccessibilityRole: "button",
    actions: emergencySettingsDrawerActions,
    drawerTestID: "home-settings-drawer",
    iconSize: emergencySettingsDrawerIconSize,
    labelTextFit: emergencySettingsDrawerLabelTextFit
  };
}
