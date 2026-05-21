export type OwnerLiveVideoPreserveRequestAction =
  | "reuse_preserve_promise"
  | "await_pending_start"
  | "skip_no_recording"
  | "skip_preserve_in_flight"
  | "start_preserve";

export type OwnerLiveVideoPreserveRequestDecision = {
  action: OwnerLiveVideoPreserveRequestAction;
  shouldAwaitPendingStart: boolean;
  shouldReturnPreservePromise: boolean;
  shouldStartPreserve: boolean;
};

export function resolveOwnerLiveVideoPreserveRequest(input: {
  hasActiveRecording: boolean;
  hasPendingStart: boolean;
  preserveInFlight: boolean;
  preservePromiseActive: boolean;
}): OwnerLiveVideoPreserveRequestDecision {
  if (input.preservePromiseActive) {
    return {
      action: "reuse_preserve_promise",
      shouldAwaitPendingStart: false,
      shouldReturnPreservePromise: true,
      shouldStartPreserve: false
    };
  }

  if (!input.hasActiveRecording && input.hasPendingStart) {
    return {
      action: "await_pending_start",
      shouldAwaitPendingStart: true,
      shouldReturnPreservePromise: false,
      shouldStartPreserve: false
    };
  }

  if (!input.hasActiveRecording) {
    return {
      action: "skip_no_recording",
      shouldAwaitPendingStart: false,
      shouldReturnPreservePromise: false,
      shouldStartPreserve: false
    };
  }

  if (input.preserveInFlight) {
    return {
      action: "skip_preserve_in_flight",
      shouldAwaitPendingStart: false,
      shouldReturnPreservePromise: false,
      shouldStartPreserve: false
    };
  }

  return {
    action: "start_preserve",
    shouldAwaitPendingStart: false,
    shouldReturnPreservePromise: false,
    shouldStartPreserve: true
  };
}
