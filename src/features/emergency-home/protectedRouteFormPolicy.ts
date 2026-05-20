import type { EmergencyHomePanel, EmergencyHomeRoute } from "./routes";

export type ProtectedRouteFormTarget = {
  panel?: EmergencyHomePanel;
  route: EmergencyHomeRoute;
};

export type ProtectedRouteFormPatch = {
  menuOpen?: boolean;
  protectedRouteCodeInput?: string;
  protectedRouteError?: string;
  protectedRouteRequest?: ProtectedRouteFormTarget | null;
};

function clearedProtectedRouteFormPatch(): ProtectedRouteFormPatch {
  return {
    protectedRouteCodeInput: "",
    protectedRouteError: "",
    protectedRouteRequest: null
  };
}

export function resolveProtectedRouteRequestFormPatch(input: ProtectedRouteFormTarget): ProtectedRouteFormPatch {
  return {
    menuOpen: false,
    protectedRouteCodeInput: "",
    protectedRouteError: "",
    protectedRouteRequest: input.panel === undefined ? { route: input.route } : { panel: input.panel, route: input.route }
  };
}

export function resolveProtectedRouteAcceptedFormPatch(): ProtectedRouteFormPatch {
  return clearedProtectedRouteFormPatch();
}

export function resolveProtectedRouteClosedFormPatch(): ProtectedRouteFormPatch {
  return clearedProtectedRouteFormPatch();
}

export function resolveProtectedRouteErrorFormPatch(errorMessage: string): ProtectedRouteFormPatch {
  return {
    protectedRouteError: errorMessage
  };
}
