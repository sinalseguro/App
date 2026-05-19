export type MediaStopPendingRequestCompletionDecision = {
  shouldClearPendingRequest: boolean;
  shouldClearTimeout: boolean;
  shouldResolvePendingRequest: boolean;
};

export function resolveMediaStopPendingRequestCompletion(input: {
  hasPendingRequest: boolean;
  pendingSerial?: number | null;
  serial: number;
}): MediaStopPendingRequestCompletionDecision {
  const shouldResolvePendingRequest = input.hasPendingRequest && input.pendingSerial === input.serial;

  return {
    shouldClearPendingRequest: shouldResolvePendingRequest,
    shouldClearTimeout: shouldResolvePendingRequest,
    shouldResolvePendingRequest
  };
}
