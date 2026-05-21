import type {
  OwnerLocalEvidenceStatus,
  OwnerLiveEvidenceStatus
} from "@/features/live-call/liveCallOperationalEvidence";

export type OwnerLiveEvidenceUpdateOptions = {
  connectedAt?: string | null;
  endedAt?: string | null;
  localEvidenceStatus?: OwnerLocalEvidenceStatus;
  now?: string;
  packageId?: string;
  status?: OwnerLiveEvidenceStatus;
};

export type OwnerLiveEvidenceUpdateDecision =
  | {
      options?: undefined;
      remoteSessionId?: undefined;
      shouldUpdate: false;
    }
  | {
      options: OwnerLiveEvidenceUpdateOptions;
      remoteSessionId: string;
      shouldUpdate: true;
    };

export function resolveOwnerLiveEvidenceUpdate(input: {
  options: OwnerLiveEvidenceUpdateOptions;
  remoteSessionId?: string | null;
}): OwnerLiveEvidenceUpdateDecision {
  if (!input.remoteSessionId) {
    return {
      shouldUpdate: false
    };
  }

  return {
    options: input.options,
    remoteSessionId: input.remoteSessionId,
    shouldUpdate: true
  };
}
