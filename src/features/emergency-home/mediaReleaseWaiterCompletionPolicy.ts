export type MediaReleaseWaiterCompletionDecision =
  | {
      shouldClearPendingRequest: false;
      shouldClearTimeout: false;
      shouldResolvePendingRequest: false;
    }
  | {
      shouldClearPendingRequest: true;
      shouldClearTimeout: true;
      shouldResolvePendingRequest: true;
    };

export function resolveMediaReleaseWaiterCompletion(
  hasPendingRequest: boolean
): MediaReleaseWaiterCompletionDecision {
  if (!hasPendingRequest) {
    return {
      shouldClearPendingRequest: false,
      shouldClearTimeout: false,
      shouldResolvePendingRequest: false
    };
  }

  return {
    shouldClearPendingRequest: true,
    shouldClearTimeout: true,
    shouldResolvePendingRequest: true
  };
}
