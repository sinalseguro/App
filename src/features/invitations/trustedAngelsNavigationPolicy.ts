import type { EmergencyHomePanel, EmergencyHomeRoute } from "@/features/emergency-home/routes";

export type TrustedAngelsMenuRouteTarget =
  | {
      kind: "archives-panel";
      params: {
        painel: EmergencyHomePanel;
      };
      pathname: "/arquivos";
    }
  | {
      kind: "route";
      route: EmergencyHomeRoute;
    };

export function resolveTrustedAngelsMenuRouteTarget({
  panelRoute,
  route
}: {
  panelRoute?: EmergencyHomePanel;
  route: EmergencyHomeRoute;
}): TrustedAngelsMenuRouteTarget {
  if (route === "/arquivos" && panelRoute) {
    return {
      kind: "archives-panel",
      params: {
        painel: panelRoute
      },
      pathname: "/arquivos"
    };
  }

  return {
    kind: "route",
    route
  };
}
