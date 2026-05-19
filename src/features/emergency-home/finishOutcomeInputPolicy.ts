import type { FinishOutcomePolicyInput, FinishOutcomeStopResultStatus } from "./finishOutcomePolicy";
import type { FinishPackageResultDecision } from "./finishPackageResultPolicy";

export type FinishOutcomeInputDecision = FinishOutcomePolicyInput;

export function resolveFinishOutcomeInput(input: {
  finishPackageResult: Pick<FinishPackageResultDecision, "attachedAssetsAfterFinish" | "liveVideoAttached">;
  mediaWasHandedToLiveCall: boolean;
  remoteFinishFailed: boolean;
  stopResultStatus?: FinishOutcomeStopResultStatus;
  stopSerialPresent: boolean;
}): FinishOutcomeInputDecision {
  return {
    attachedAssetsAfterFinish: input.finishPackageResult.attachedAssetsAfterFinish,
    liveVideoAttached: input.finishPackageResult.liveVideoAttached,
    mediaWasHandedToLiveCall: input.mediaWasHandedToLiveCall,
    remoteFinishFailed: input.remoteFinishFailed,
    stopResultStatus: input.stopResultStatus,
    stopSerialPresent: input.stopSerialPresent
  };
}
