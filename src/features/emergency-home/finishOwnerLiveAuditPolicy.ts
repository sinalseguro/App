import type { FinishOutcomeAuditMarker, FinishOutcomeLocalEvidenceStatus } from "./finishOutcomePolicy";

export type FinishOwnerLiveAuditMarker = {
  event: FinishOutcomeAuditMarker;
  options: {
    connectionState: "ended";
    localEvidenceStatus: FinishOutcomeLocalEvidenceStatus;
  };
};

export function resolveFinishOwnerLiveAuditMarker(input: {
  auditMarker: FinishOutcomeAuditMarker;
  localEvidenceStatus: FinishOutcomeLocalEvidenceStatus;
}): FinishOwnerLiveAuditMarker {
  return {
    event: input.auditMarker,
    options: {
      connectionState: "ended",
      localEvidenceStatus: input.localEvidenceStatus
    }
  };
}
