import type { RecordLiveAuditMarkerInput } from "@/services/apiClient";

export type OwnerLiveAuditMarkerEvent = RecordLiveAuditMarkerInput["event"];

export type OwnerLiveAuditMarkerOptions = Pick<
  RecordLiveAuditMarkerInput,
  "connectionState" | "localEvidenceStatus"
>;

export function resolveOwnerLiveAuditMarkerInput(input: {
  deviceId?: string | null;
  event: OwnerLiveAuditMarkerEvent;
  options?: OwnerLiveAuditMarkerOptions;
}): RecordLiveAuditMarkerInput {
  return {
    connectionState: input.options?.connectionState,
    deviceId: input.deviceId,
    event: input.event,
    localEvidenceStatus: input.options?.localEvidenceStatus,
    role: "owner"
  };
}
