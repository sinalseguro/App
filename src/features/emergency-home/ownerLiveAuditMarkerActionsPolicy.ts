import type {
  OwnerLiveAuditMarkerEvent,
  OwnerLiveAuditMarkerOptions
} from "./ownerLiveAuditMarkerPolicy";

export type OwnerLiveAuditMarkerActionDecision =
  | {
      event?: undefined;
      options?: undefined;
      remoteSessionId?: undefined;
      shouldRecord: false;
    }
  | {
      event: OwnerLiveAuditMarkerEvent;
      options?: OwnerLiveAuditMarkerOptions;
      remoteSessionId: string;
      shouldRecord: true;
    };

export function resolveOwnerLiveAuditMarkerActions(input: {
  event: OwnerLiveAuditMarkerEvent;
  options?: OwnerLiveAuditMarkerOptions;
  remoteSessionId?: string | null;
}): OwnerLiveAuditMarkerActionDecision {
  if (!input.remoteSessionId) {
    return {
      shouldRecord: false
    };
  }

  return {
    event: input.event,
    options: input.options,
    remoteSessionId: input.remoteSessionId,
    shouldRecord: true
  };
}
