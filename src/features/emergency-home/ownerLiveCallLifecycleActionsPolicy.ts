import type { OwnerLiveEvidenceUpdateOptions } from "./ownerLiveEvidenceUpdatePolicy";
import type { OwnerLiveCallLifecycleDecision } from "./ownerLiveEvidencePolicy";

export type OwnerLiveCallLifecycleActions =
  | {
      shouldApply: false;
    }
  | {
      clearStartedSessionId?: string;
      evidenceUpdate: OwnerLiveEvidenceUpdateOptions;
      remoteSessionId: string;
      shouldApply: true;
      shouldClearStartedSession: boolean;
      shouldStopLiveVideoEvidence: boolean;
      stopLiveVideoEvidenceReason?: "call_finished";
    };

export function resolveOwnerLiveCallLifecycleActions(input: {
  decision: OwnerLiveCallLifecycleDecision;
  timestamp: string;
}): OwnerLiveCallLifecycleActions {
  if (!input.decision.shouldApply) {
    return {
      shouldApply: false
    };
  }

  const timestampUpdate =
    input.decision.evidenceUpdate.timestampField === "connectedAt"
      ? { connectedAt: input.timestamp }
      : { endedAt: input.timestamp };

  return {
    clearStartedSessionId: input.decision.clearStartedSession ? input.decision.remoteSessionId : undefined,
    evidenceUpdate: {
      ...timestampUpdate,
      localEvidenceStatus: input.decision.evidenceUpdate.localEvidenceStatus,
      packageId: input.decision.evidenceUpdate.packageId,
      status: input.decision.evidenceUpdate.status
    },
    remoteSessionId: input.decision.remoteSessionId,
    shouldApply: true,
    shouldClearStartedSession: input.decision.clearStartedSession,
    shouldStopLiveVideoEvidence: input.decision.shouldStopLiveVideoEvidence,
    stopLiveVideoEvidenceReason: input.decision.shouldStopLiveVideoEvidence ? "call_finished" : undefined
  };
}
