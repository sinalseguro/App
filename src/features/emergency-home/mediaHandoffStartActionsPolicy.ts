import type { MediaHandoffStagePresentation } from "./mediaHandoffPolicy";
import type { OwnerLiveAuditMarkerOptions } from "./ownerLiveAuditMarkerPolicy";
import type { OwnerLiveEvidenceUpdateOptions } from "./ownerLiveEvidenceUpdatePolicy";

export type MediaHandoffStartActions = {
  auditMarker: {
    event: MediaHandoffStagePresentation["auditMarker"];
    options: OwnerLiveAuditMarkerOptions;
  };
  captureStopLocked: true;
  evidenceUpdate: OwnerLiveEvidenceUpdateOptions;
  log: {
    event: "emergency_live_call_media_handoff_start";
    payload: {
      packageId: string;
      platform: string;
    };
  };
  mediaRecorderPackageId: string;
  mediaStopPurpose: "live_call_handoff";
  recordingStatus?: string;
};

export function resolveMediaHandoffStartActions(input: {
  packageId: string;
  platform: string;
  stage: MediaHandoffStagePresentation;
}): MediaHandoffStartActions {
  return {
    auditMarker: {
      event: input.stage.auditMarker,
      options: {
        connectionState: input.stage.connectionState,
        localEvidenceStatus: input.stage.localEvidenceStatus
      }
    },
    captureStopLocked: true,
    evidenceUpdate: {
      localEvidenceStatus: input.stage.localEvidenceStatus,
      packageId: input.packageId,
      status: input.stage.liveEvidenceStatus
    },
    log: {
      event: "emergency_live_call_media_handoff_start",
      payload: {
        packageId: input.packageId,
        platform: input.platform
      }
    },
    mediaRecorderPackageId: input.packageId,
    mediaStopPurpose: "live_call_handoff",
    recordingStatus: input.stage.recordingStatus
  };
}
