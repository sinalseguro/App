import type { MediaCaptureManifest } from "@/features/emergency/types";

import {
  resolveFinishOutcomeInput,
  type FinishOutcomeInputDecision
} from "./finishOutcomeInputPolicy";
import {
  resolveFinishOutcomePolicy,
  type FinishOutcomeDecision,
  type FinishOutcomeStopResultStatus
} from "./finishOutcomePolicy";
import {
  resolveFinishOwnerCompletionActions,
  type FinishOwnerCompletionActionsDecision
} from "./finishOwnerCompletionPolicy";
import {
  resolveFinishPackageResult,
  type FinishPackageResultDecision
} from "./finishPackageResultPolicy";
import {
  resolveFinishPostOutcomeActions,
  type FinishPostOutcomeActionsDecision
} from "./finishPostOutcomeActionsPolicy";

export type FinishPackageOutcomeActionsDecision = {
  finishOutcome: FinishOutcomeDecision;
  finishOutcomeInput: FinishOutcomeInputDecision;
  finishPackageResult: FinishPackageResultDecision;
  ownerCompletionActions: FinishOwnerCompletionActionsDecision;
  postOutcomeActions: FinishPostOutcomeActionsDecision;
};

export function resolveFinishPackageOutcomeActions(input: {
  endedAt: string;
  liveVideoAttached: boolean;
  media: MediaCaptureManifest;
  mediaWasHandedToLiveCall: boolean;
  packageId: string;
  platform: string;
  remoteFinishFailed: boolean;
  stopResultStatus?: FinishOutcomeStopResultStatus;
  stopSerialPresent: boolean;
}): FinishPackageOutcomeActionsDecision {
  const finishPackageResult = resolveFinishPackageResult({
    liveVideoAttached: input.liveVideoAttached,
    media: input.media,
    platform: input.platform
  });
  const finishOutcomeInput = resolveFinishOutcomeInput({
    finishPackageResult,
    mediaWasHandedToLiveCall: input.mediaWasHandedToLiveCall,
    remoteFinishFailed: input.remoteFinishFailed,
    stopResultStatus: input.stopResultStatus,
    stopSerialPresent: input.stopSerialPresent
  });
  const finishOutcome = resolveFinishOutcomePolicy(finishOutcomeInput);

  return {
    finishOutcome,
    finishOutcomeInput,
    finishPackageResult,
    ownerCompletionActions: resolveFinishOwnerCompletionActions({
      endedAt: input.endedAt,
      finishOutcome,
      packageId: input.packageId
    }),
    postOutcomeActions: resolveFinishPostOutcomeActions({
      finishOutcome,
      packageId: input.packageId
    })
  };
}
