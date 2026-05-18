import type { MediaStopRequestResult } from "@/features/emergency/EmergencyMediaRecorder";

export type MediaStopSettlementLogDecision = {
  logEvent: "emergency_media_stop_settled";
  logPayload: {
    attachedAssets: number;
    platform: string;
    status: MediaStopRequestResult["status"];
  };
};

export type PendingMediaStopRequestSettlementDecision = {
  shouldResolvePendingRequest: boolean;
};

export function resolveMediaStopSettlementLog(input: {
  platform: string;
  result: MediaStopRequestResult;
}): MediaStopSettlementLogDecision {
  return {
    logEvent: "emergency_media_stop_settled",
    logPayload: {
      attachedAssets: input.result.attachedAssets,
      platform: input.platform,
      status: input.result.status
    }
  };
}

export function resolvePendingMediaStopRequestSettlement(input: {
  pendingSerial?: number | null;
  serial: number;
}): PendingMediaStopRequestSettlementDecision {
  return {
    shouldResolvePendingRequest: input.pendingSerial === input.serial
  };
}
