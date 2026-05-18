export type ProtectedRouteAccessDecision = "navigate" | "request_security_code";

export type ProtectedRouteAccessDecisionInput = {
  protectedAccessUnlocked: boolean;
  requireSecurityCode: boolean;
};

export function resolveProtectedRouteAccessDecision(
  input: ProtectedRouteAccessDecisionInput
): ProtectedRouteAccessDecision {
  if (input.requireSecurityCode && !input.protectedAccessUnlocked) return "request_security_code";
  return "navigate";
}
