import { resolveMediaReleaseTimeout } from "./mediaReleaseWaiterPolicy";

export type MediaReleaseTimeoutActions = ReturnType<typeof resolveMediaReleaseTimeout> & {
  shouldResolvePendingRequest: true;
};

export function resolveMediaReleaseTimeoutActions(input: {
  hasPendingRequest: boolean;
  platform: string;
  timeoutMs: number;
}): MediaReleaseTimeoutActions {
  const timeoutDecision = resolveMediaReleaseTimeout({
    platform: input.platform,
    timeoutMs: input.timeoutMs
  });

  return {
    ...timeoutDecision,
    shouldClearPendingRequest: input.hasPendingRequest && timeoutDecision.shouldClearPendingRequest,
    shouldResolvePendingRequest: true
  };
}
