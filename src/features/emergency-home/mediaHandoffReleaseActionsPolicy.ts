import type { MediaHandoffStagePresentation } from "./mediaHandoffPolicy";
import type { OwnerLiveAuditMarkerOptions } from "./ownerLiveAuditMarkerPolicy";
import type { OwnerLiveEvidenceUpdateOptions } from "./ownerLiveEvidenceUpdatePolicy";

export type MediaHandoffReleaseWaitActions =
  | {
      action: "skip_missing_stop_serial";
      shouldClearPurpose: true;
      shouldSetPending: false;
      shouldWaitForRelease: false;
    }
  | {
      action: "wait_for_release";
      shouldClearPurpose: false;
      shouldSetPending: true;
      shouldWaitForRelease: true;
      stopSerial: number;
    };

export type MediaHandoffReleaseCompletionActions = {
  auditMarker: {
    event: MediaHandoffStagePresentation["auditMarker"];
    options: OwnerLiveAuditMarkerOptions;
  };
  evidenceUpdate: OwnerLiveEvidenceUpdateOptions;
  log: {
    event: "emergency_live_call_media_handoff_camera_released";
    payload: {
      packageId: string;
      platform: string;
      stopRequestSerial: number;
    };
  };
};

export type MediaHandoffReleaseCleanupActions = {
  mediaRecorderPackageId: string;
  mediaStopPending: false;
  shouldClearPurpose: true;
};

export function resolveMediaHandoffReleaseWaitActions(input: {
  stopSerial?: number | null;
}): MediaHandoffReleaseWaitActions {
  if (!input.stopSerial) {
    return {
      action: "skip_missing_stop_serial",
      shouldClearPurpose: true,
      shouldSetPending: false,
      shouldWaitForRelease: false
    };
  }

  return {
    action: "wait_for_release",
    shouldClearPurpose: false,
    shouldSetPending: true,
    shouldWaitForRelease: true,
    stopSerial: input.stopSerial
  };
}

export function resolveMediaHandoffReleaseCompletionActions(input: {
  packageId: string;
  platform: string;
  stage: MediaHandoffStagePresentation;
  stopSerial: number;
}): MediaHandoffReleaseCompletionActions {
  return {
    auditMarker: {
      event: input.stage.auditMarker,
      options: {
        connectionState: input.stage.connectionState,
        localEvidenceStatus: input.stage.localEvidenceStatus
      }
    },
    evidenceUpdate: {
      localEvidenceStatus: input.stage.localEvidenceStatus,
      packageId: input.packageId,
      status: input.stage.liveEvidenceStatus
    },
    log: {
      event: "emergency_live_call_media_handoff_camera_released",
      payload: {
        packageId: input.packageId,
        platform: input.platform,
        stopRequestSerial: input.stopSerial
      }
    }
  };
}

export function resolveMediaHandoffReleaseCleanupActions(input: {
  packageId: string;
}): MediaHandoffReleaseCleanupActions {
  return {
    mediaRecorderPackageId: input.packageId,
    mediaStopPending: false,
    shouldClearPurpose: true
  };
}
