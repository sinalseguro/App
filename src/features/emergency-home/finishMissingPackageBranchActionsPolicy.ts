import {
  resolveFinishMissingPackageActions,
  type FinishMissingPackageActionsDecision
} from "./finishMissingPackagePolicy";

export type FinishMissingPackageBranchActionsDecision =
  | {
      shouldApply: false;
      shouldReturnAfterApply: false;
    }
  | (FinishMissingPackageActionsDecision & {
      shouldApply: true;
      shouldReturnAfterApply: true;
    });

export function resolveFinishMissingPackageBranchActions(input: {
  resultPresent: boolean;
  stopSerialPresent: boolean;
}): FinishMissingPackageBranchActionsDecision {
  if (input.resultPresent) {
    return {
      shouldApply: false,
      shouldReturnAfterApply: false
    };
  }

  return {
    ...resolveFinishMissingPackageActions({
      stopSerialPresent: input.stopSerialPresent
    }),
    shouldApply: true,
    shouldReturnAfterApply: true
  };
}
