import type { SecurityCodeVerificationResult } from "@/security/protectedAccess";

export type ProtectedRouteCodeDecision =
  | {
      action: "ignore_missing_request";
    }
  | {
      action: "show_error";
      errorMessage: string;
    }
  | {
      action: "unlock_and_navigate";
    };

export function resolveProtectedRouteCodeDecision(input: {
  hasProtectedRouteRequest: boolean;
  verification?: SecurityCodeVerificationResult;
}): ProtectedRouteCodeDecision {
  if (!input.hasProtectedRouteRequest) {
    return { action: "ignore_missing_request" };
  }

  if (!input.verification) {
    return {
      action: "show_error",
      errorMessage: "Codigo de seguranca nao verificado. Area protegida bloqueada."
    };
  }

  if (!input.verification.ok) {
    return {
      action: "show_error",
      errorMessage: `${input.verification.message} Area protegida bloqueada.`
    };
  }

  return { action: "unlock_and_navigate" };
}
