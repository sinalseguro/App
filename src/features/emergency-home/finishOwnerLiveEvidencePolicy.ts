import type { FinishOutcomeLocalEvidenceStatus } from "./finishOutcomePolicy";

export type FinishOwnerLiveEvidenceUpdate = {
  endedAt: string;
  localEvidenceStatus: FinishOutcomeLocalEvidenceStatus;
  packageId: string;
  status: FinishOutcomeLocalEvidenceStatus;
};

export function resolveFinishOwnerLiveEvidenceUpdate(input: {
  endedAt: string;
  localEvidenceStatus: FinishOutcomeLocalEvidenceStatus;
  packageId: string;
}): FinishOwnerLiveEvidenceUpdate {
  return {
    endedAt: input.endedAt,
    localEvidenceStatus: input.localEvidenceStatus,
    packageId: input.packageId,
    status: input.localEvidenceStatus
  };
}
