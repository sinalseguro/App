import type { SecurityCodeVerificationResult } from "@/security/protectedAccess";

export type FinishCodeConfirmationDecision =
  | {
      action: "finish_now";
    }
  | {
      action: "show_error";
      errorMessage: string;
    };

export function resolveFinishCodeConfirmationDecision(input: {
  requireSecurityCode: boolean;
  verification?: SecurityCodeVerificationResult;
}): FinishCodeConfirmationDecision {
  if (!input.requireSecurityCode) {
    return { action: "finish_now" };
  }

  if (!input.verification) {
    return {
      action: "show_error",
      errorMessage: "Codigo de seguranca nao verificado. O chamado continua ativo."
    };
  }

  if (!input.verification.ok) {
    return {
      action: "show_error",
      errorMessage: `${input.verification.message} O chamado continua ativo.`
    };
  }

  return { action: "finish_now" };
}
