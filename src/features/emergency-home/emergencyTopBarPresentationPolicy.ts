export type EmergencyTopBarPresentation = {
  contextLabel: string;
  menuIcon: "settings";
  showMenu: boolean;
};

export function resolveEmergencyTopBarPresentation(active: boolean): EmergencyTopBarPresentation {
  return {
    contextLabel: active ? "Você pediu ajuda" : "Modo discreto",
    menuIcon: "settings",
    showMenu: true
  };
}
