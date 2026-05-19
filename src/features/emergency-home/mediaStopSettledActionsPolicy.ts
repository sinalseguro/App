import type { MediaStopRequestResult } from "@/features/emergency/EmergencyMediaRecorder";

import {
  resolveMediaStopSettlementPresentation,
  shouldHandleMediaStopSettlement,
  type MediaStopSettlementPresentation
} from "./mediaProcessingStatusPolicy";
import {
  resolveMediaStopSettlementLog,
  type MediaStopSettlementLogDecision
} from "./mediaStopSettlementRequestPolicy";

export type MediaStopSettledActionsDecision =
  | {
      shouldHandle: false;
    }
  | {
      settlementLog: MediaStopSettlementLogDecision;
      settlementPresentation: MediaStopSettlementPresentation;
      shouldHandle: true;
      shouldResolveMediaReleaseWaiter: true;
    };

export function resolveMediaStopSettledActions(input: {
  expectedSerial: number;
  platform: string;
  result: MediaStopRequestResult;
  serial: number;
}): MediaStopSettledActionsDecision {
  if (
    !shouldHandleMediaStopSettlement({
      expectedSerial: input.expectedSerial,
      serial: input.serial
    })
  ) {
    return {
      shouldHandle: false
    };
  }

  return {
    settlementLog: resolveMediaStopSettlementLog({
      platform: input.platform,
      result: input.result
    }),
    settlementPresentation: resolveMediaStopSettlementPresentation(input.result),
    shouldHandle: true,
    shouldResolveMediaReleaseWaiter: true
  };
}
