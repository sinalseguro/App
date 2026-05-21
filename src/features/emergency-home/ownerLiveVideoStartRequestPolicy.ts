export type OwnerLiveVideoStartRequestAction =
  | "reuse_active_recording"
  | "reuse_pending_start"
  | "replace_active_recording"
  | "start_new_recording";

export type OwnerLiveVideoStartRequestDecision = {
  action: OwnerLiveVideoStartRequestAction;
  shouldReturnActiveRecording: boolean;
  shouldReturnPendingStart: boolean;
  shouldStartNewRecording: boolean;
  shouldStopActiveRecording: boolean;
};

export function resolveOwnerLiveVideoStartRequest(input: {
  activeRecordingRemoteSessionId?: string | null;
  pendingStartPackageId?: string | null;
  pendingStartRemoteSessionId?: string | null;
  requestPackageId: string;
  requestRemoteSessionId: string;
}): OwnerLiveVideoStartRequestDecision {
  if (input.activeRecordingRemoteSessionId === input.requestRemoteSessionId) {
    return {
      action: "reuse_active_recording",
      shouldReturnActiveRecording: true,
      shouldReturnPendingStart: false,
      shouldStartNewRecording: false,
      shouldStopActiveRecording: false
    };
  }

  if (
    input.pendingStartRemoteSessionId === input.requestRemoteSessionId &&
    input.pendingStartPackageId === input.requestPackageId
  ) {
    return {
      action: "reuse_pending_start",
      shouldReturnActiveRecording: false,
      shouldReturnPendingStart: true,
      shouldStartNewRecording: false,
      shouldStopActiveRecording: false
    };
  }

  if (input.activeRecordingRemoteSessionId) {
    return {
      action: "replace_active_recording",
      shouldReturnActiveRecording: false,
      shouldReturnPendingStart: false,
      shouldStartNewRecording: true,
      shouldStopActiveRecording: true
    };
  }

  return {
    action: "start_new_recording",
    shouldReturnActiveRecording: false,
    shouldReturnPendingStart: false,
    shouldStartNewRecording: true,
    shouldStopActiveRecording: false
  };
}
