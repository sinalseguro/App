export type MediaStopPendingStateDecision = {
  mediaStopPending: boolean;
  shouldClearMediaRecorderPackageId: boolean;
};

export function resolveMediaStopPendingState(
  value: boolean,
  options: { clearMediaRecorderPackageIdOnRelease?: boolean } = {}
): MediaStopPendingStateDecision {
  return {
    mediaStopPending: value,
    shouldClearMediaRecorderPackageId: Boolean(options.clearMediaRecorderPackageIdOnRelease && !value)
  };
}
