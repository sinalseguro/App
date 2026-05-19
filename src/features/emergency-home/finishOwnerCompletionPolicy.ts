import type { FinishOutcomeDecision } from "./finishOutcomePolicy";
import { resolveFinishOwnerLiveAuditMarker, type FinishOwnerLiveAuditMarker } from "./finishOwnerLiveAuditPolicy";
import {
  resolveFinishOwnerLiveEvidenceUpdate,
  type FinishOwnerLiveEvidenceUpdate
} from "./finishOwnerLiveEvidencePolicy";

export type FinishOwnerCompletionActionsDecision = {
  auditMarker: FinishOwnerLiveAuditMarker;
  evidenceUpdate: FinishOwnerLiveEvidenceUpdate;
};

export function resolveFinishOwnerCompletionActions(input: {
  endedAt: string;
  finishOutcome: Pick<FinishOutcomeDecision, "auditMarker" | "localEvidenceStatus">;
  packageId: string;
}): FinishOwnerCompletionActionsDecision {
  return {
    auditMarker: resolveFinishOwnerLiveAuditMarker({
      auditMarker: input.finishOutcome.auditMarker,
      localEvidenceStatus: input.finishOutcome.localEvidenceStatus
    }),
    evidenceUpdate: resolveFinishOwnerLiveEvidenceUpdate({
      endedAt: input.endedAt,
      localEvidenceStatus: input.finishOutcome.localEvidenceStatus,
      packageId: input.packageId
    })
  };
}
