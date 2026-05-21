import {
  resolveFinishMediaStopStartActions,
  type FinishMediaStopStartActionsDecision
} from "./finishMediaStopStartPolicy";

export type FinishMediaStopRequestActions =
  | {
      shouldSignalMediaRecorderStop: false;
    }
  | {
      shouldSignalMediaRecorderStop: true;
    };

export type FinishMediaStopSignaledActions =
  | {
      shouldApply: false;
    }
  | {
      shouldApply: true;
      startActions: FinishMediaStopStartActionsDecision;
      stopSerial: number;
    };

export function resolveFinishMediaStopRequestActions(input: {
  mediaWasHandedToLiveCall: boolean;
}): FinishMediaStopRequestActions {
  if (input.mediaWasHandedToLiveCall) {
    return {
      shouldSignalMediaRecorderStop: false
    };
  }

  return {
    shouldSignalMediaRecorderStop: true
  };
}

export function resolveFinishMediaStopSignaledActions(input: {
  packageId: string;
  stopSerial: number | null;
}): FinishMediaStopSignaledActions {
  if (!input.stopSerial) {
    return {
      shouldApply: false
    };
  }

  return {
    shouldApply: true,
    startActions: resolveFinishMediaStopStartActions({
      packageId: input.packageId
    }),
    stopSerial: input.stopSerial
  };
}
