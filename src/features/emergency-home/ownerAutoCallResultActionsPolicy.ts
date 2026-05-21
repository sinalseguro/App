import { ownerAutoCallRecipientStatus } from "./ownerAutoCallPolicy";

export type OwnerAutoCallRecipientActions = {
  shouldPrepareAndStartCall: boolean;
  statusMessage: string;
};

export type OwnerAutoCallStartResultActions =
  | {
      remoteSessionId?: undefined;
      shouldMarkStarted: false;
    }
  | {
      remoteSessionId: string;
      shouldMarkStarted: true;
    };

export type OwnerAutoCallErrorActions = {
  log: {
    event: "emergency_live_call_auto_start_error";
    payload: {
      platform: string;
      remoteSessionId: string;
    };
  };
};

export type OwnerAutoCallFinallyActions = {
  shouldClearInFlight: true;
};

export function resolveOwnerAutoCallRecipientActions(input: {
  recipientCount: number;
}): OwnerAutoCallRecipientActions {
  const recipientStatus = ownerAutoCallRecipientStatus(input.recipientCount);

  return {
    shouldPrepareAndStartCall: recipientStatus.shouldStartCall,
    statusMessage: recipientStatus.message
  };
}

export function resolveOwnerAutoCallStartResultActions(input: {
  remoteSessionId: string;
  started: boolean;
}): OwnerAutoCallStartResultActions {
  if (!input.started) {
    return {
      shouldMarkStarted: false
    };
  }

  return {
    remoteSessionId: input.remoteSessionId,
    shouldMarkStarted: true
  };
}

export function resolveOwnerAutoCallErrorActions(input: {
  platform: string;
  remoteSessionId: string;
}): OwnerAutoCallErrorActions {
  return {
    log: {
      event: "emergency_live_call_auto_start_error",
      payload: {
        platform: input.platform,
        remoteSessionId: input.remoteSessionId
      }
    }
  };
}

export function resolveOwnerAutoCallFinallyActions(): OwnerAutoCallFinallyActions {
  return {
    shouldClearInFlight: true
  };
}
