import type { EmergencyHomePanel, EmergencyHomeRoute } from "./routes";

export type EmergencyHomeNavigationTarget =
  | { kind: "plain"; route: EmergencyHomeRoute }
  | { kind: "with_panel"; params: { painel: EmergencyHomePanel }; pathname: "/arquivos" };

export function resolveEmergencyHomeNavigationTarget(
  route: EmergencyHomeRoute,
  panel?: EmergencyHomePanel
): EmergencyHomeNavigationTarget {
  if (route === "/arquivos" && panel) {
    return {
      kind: "with_panel",
      params: { painel: panel },
      pathname: "/arquivos"
    };
  }

  return {
    kind: "plain",
    route
  };
}
