import {
  ownerAutoCallAttemptMessage,
  shouldAttemptOwnerAutoCall,
  type OwnerAutoCallDecisionInput
} from "./ownerAutoCallPolicy";

export type OwnerAutoCallAttemptActions =
  | {
      shouldAttempt: false;
      shouldSetInFlight: false;
    }
  | {
      log: {
        event: "emergency_live_call_auto_start_attempt";
        payload: {
          platform: string;
          remoteSessionId: string;
        };
      };
      shouldAttempt: true;
      shouldSetInFlight: true;
      statusMessage: string;
    };

export function resolveOwnerAutoCallAttemptActions(
  input: OwnerAutoCallDecisionInput & {
    platform: string;
  }
): OwnerAutoCallAttemptActions {
  if (!shouldAttemptOwnerAutoCall(input) || !input.liveRemoteSessionId) {
    return {
      shouldAttempt: false,
      shouldSetInFlight: false
    };
  }

  return {
    log: {
      event: "emergency_live_call_auto_start_attempt",
      payload: {
        platform: input.platform,
        remoteSessionId: input.liveRemoteSessionId
      }
    },
    shouldAttempt: true,
    shouldSetInFlight: true,
    statusMessage: ownerAutoCallAttemptMessage()
  };
}
