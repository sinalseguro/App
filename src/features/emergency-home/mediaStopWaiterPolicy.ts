import type { MediaStopRequestResult } from "@/features/emergency/EmergencyMediaRecorder";

export type MediaStopWaiterStartDecision = {
  previousRequestResult: MediaStopRequestResult;
  shouldResolvePreviousRequest: boolean;
};

export type MediaStopTimeoutDecision =
  | {
      shouldResolve: false;
    }
  | {
      logEvent: "emergency_media_stop_timeout";
      logPayload: {
        platform: string;
        timeoutMs: number;
      };
      result: MediaStopRequestResult;
      shouldClearPendingRequest: boolean;
      shouldResolve: true;
    };

const errorMediaStopResult: MediaStopRequestResult = {
  attachedAssets: 0,
  status: "error"
};

export function resolveMediaStopWaiterStart(hasPreviousRequest: boolean): MediaStopWaiterStartDecision {
  return {
    previousRequestResult: errorMediaStopResult,
    shouldResolvePreviousRequest: hasPreviousRequest
  };
}

export function resolveMediaStopTimeout(input: {
  currentSerial?: number | null;
  platform: string;
  serial: number;
  timeoutMs: number;
}): MediaStopTimeoutDecision {
  if (input.currentSerial !== input.serial) {
    return { shouldResolve: false };
  }

  return {
    logEvent: "emergency_media_stop_timeout",
    logPayload: {
      platform: input.platform,
      timeoutMs: input.timeoutMs
    },
    result: errorMediaStopResult,
    shouldClearPendingRequest: true,
    shouldResolve: true
  };
}
