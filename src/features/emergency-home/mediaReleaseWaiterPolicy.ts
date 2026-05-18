export type MediaReleaseWaiterStartDecision = {
  shouldResolvePreviousRequest: boolean;
};

export type MediaReleaseTimeoutDecision = {
  logEvent: "emergency_live_call_media_release_timeout";
  logPayload: {
    platform: string;
    timeoutMs: number;
  };
  shouldClearPendingRequest: boolean;
};

export function resolveMediaReleaseWaiterStart(hasPreviousRequest: boolean): MediaReleaseWaiterStartDecision {
  return {
    shouldResolvePreviousRequest: hasPreviousRequest
  };
}

export function resolveMediaReleaseTimeout(input: {
  platform: string;
  timeoutMs: number;
}): MediaReleaseTimeoutDecision {
  return {
    logEvent: "emergency_live_call_media_release_timeout",
    logPayload: {
      platform: input.platform,
      timeoutMs: input.timeoutMs
    },
    shouldClearPendingRequest: true
  };
}
