import type { ProtectedRouteCodeDecision } from "./protectedRouteCodePolicy";
import {
  resolveProtectedRouteAcceptedFormPatch,
  resolveProtectedRouteErrorFormPatch,
  type ProtectedRouteFormPatch,
  type ProtectedRouteFormTarget
} from "./protectedRouteFormPolicy";

export type ProtectedRouteUnlockActions =
  | {
      formPatch?: undefined;
      navigationTarget?: undefined;
      shouldUnlockProtectedAccess: false;
    }
  | {
      formPatch: ProtectedRouteFormPatch;
      navigationTarget?: undefined;
      shouldUnlockProtectedAccess: false;
    }
  | {
      formPatch: ProtectedRouteFormPatch;
      navigationTarget: ProtectedRouteFormTarget;
      shouldUnlockProtectedAccess: true;
    };

export function resolveProtectedRouteUnlockActions(input: {
  decision: ProtectedRouteCodeDecision;
  request?: ProtectedRouteFormTarget | null;
}): ProtectedRouteUnlockActions {
  if (input.decision.action === "ignore_missing_request") {
    return {
      shouldUnlockProtectedAccess: false
    };
  }

  if (input.decision.action === "show_error") {
    return {
      formPatch: resolveProtectedRouteErrorFormPatch(input.decision.errorMessage),
      shouldUnlockProtectedAccess: false
    };
  }

  if (!input.request) {
    return {
      shouldUnlockProtectedAccess: false
    };
  }

  return {
    formPatch: resolveProtectedRouteAcceptedFormPatch(),
    navigationTarget: input.request,
    shouldUnlockProtectedAccess: true
  };
}
