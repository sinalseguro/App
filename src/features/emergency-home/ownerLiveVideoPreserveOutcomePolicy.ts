import type { LocalVideoCameraMode } from "@/features/emergency/emergencyPreferences";
import type { LocalSosPackageStatusInput } from "./localSosPackageStatusPolicy";
import type {
  OwnerLiveAuditMarkerEvent,
  OwnerLiveAuditMarkerOptions
} from "./ownerLiveAuditMarkerPolicy";
import type { OwnerLiveEvidenceUpdateOptions } from "./ownerLiveEvidenceUpdatePolicy";

export type OwnerLiveVideoPreserveReason = "call_finished" | "finish" | "manual_stop" | "replace_recording";

type OwnerLiveVideoPreserveLog =
  | {
      event: "live_video_recording_preserve_start";
      payload: {
        audioCaptured: boolean;
        frameCount: number;
        platform: string;
        reason: OwnerLiveVideoPreserveReason;
        remoteSessionId: string;
        sizeBytes: number;
      };
    }
  | {
      event: "live_video_recording_preserve_success";
      payload: {
        assetCreated: boolean;
        audioCaptured: boolean;
        platform: string;
        reason: OwnerLiveVideoPreserveReason;
        remoteSessionId: string;
      };
    }
  | {
      event: "live_video_recording_preserve_error";
      payload: {
        platform: string;
        reason: OwnerLiveVideoPreserveReason;
        remoteSessionId: string;
      };
    };

export type OwnerLiveVideoPreserveAssetInput = {
  cameraMode: "back";
  completedAt: string;
  packageId: string;
  requestedCameraMode: LocalVideoCameraMode;
  sourceUri: string;
  startedAt: string;
  verificationMode: "bounded";
};

export type OwnerLiveVideoPreserveStoppedActions =
  | {
      shouldPreserve: false;
    }
  | {
      audioCaptured: boolean;
      completedAt: string;
      preserveAssetInput: OwnerLiveVideoPreserveAssetInput;
      preserveStartLog: Extract<OwnerLiveVideoPreserveLog, { event: "live_video_recording_preserve_start" }>;
      shouldPreserve: true;
    };

export type OwnerLiveVideoPreserveCompletionActions = {
  auditMarker: {
    event: OwnerLiveAuditMarkerEvent;
    options: OwnerLiveAuditMarkerOptions;
  };
  evidenceUpdate: OwnerLiveEvidenceUpdateOptions;
  recordingStatusInput: LocalSosPackageStatusInput;
  successLog: Extract<OwnerLiveVideoPreserveLog, { event: "live_video_recording_preserve_success" }>;
};

export type OwnerLiveVideoPreserveErrorActions = {
  auditMarker: {
    event: OwnerLiveAuditMarkerEvent;
    options: OwnerLiveAuditMarkerOptions;
  };
  evidenceUpdate: OwnerLiveEvidenceUpdateOptions;
  errorLog: Extract<OwnerLiveVideoPreserveLog, { event: "live_video_recording_preserve_error" }>;
};

function isTerminalPreserveReason(reason: OwnerLiveVideoPreserveReason) {
  return reason === "finish" || reason === "call_finished";
}

export function resolveOwnerLiveVideoPreserveStoppedActions(input: {
  audioCaptured?: boolean;
  completedAt?: string;
  frameCount?: number;
  packageId: string;
  platform: string;
  reason: OwnerLiveVideoPreserveReason;
  remoteSessionId: string;
  requestedCameraMode: LocalVideoCameraMode;
  sizeBytes?: number;
  sourceUri?: string | null;
  startedAt?: string;
}): OwnerLiveVideoPreserveStoppedActions {
  if (!input.sourceUri || !input.startedAt || !input.completedAt) {
    return {
      shouldPreserve: false
    };
  }

  const audioCaptured = Boolean(input.audioCaptured);
  const frameCount = input.frameCount ?? 0;
  const sizeBytes = input.sizeBytes ?? 0;

  return {
    audioCaptured,
    completedAt: input.completedAt,
    preserveAssetInput: {
      cameraMode: "back",
      completedAt: input.completedAt,
      packageId: input.packageId,
      requestedCameraMode: input.requestedCameraMode,
      sourceUri: input.sourceUri,
      startedAt: input.startedAt,
      verificationMode: "bounded"
    },
    preserveStartLog: {
      event: "live_video_recording_preserve_start",
      payload: {
        audioCaptured,
        frameCount,
        platform: input.platform,
        reason: input.reason,
        remoteSessionId: input.remoteSessionId,
        sizeBytes
      }
    },
    shouldPreserve: true
  };
}

export function resolveOwnerLiveVideoPreserveCompletionActions(input: {
  assetCreated: boolean;
  audioCaptured: boolean;
  completedAt: string;
  packageId: string;
  platform: string;
  reason: OwnerLiveVideoPreserveReason;
  remoteSessionId: string;
}): OwnerLiveVideoPreserveCompletionActions {
  const terminalReason = isTerminalPreserveReason(input.reason);

  return {
    auditMarker: {
      event: "local_evidence_protected",
      options: {
        connectionState: terminalReason ? "ended" : "connected",
        localEvidenceStatus: "protected"
      }
    },
    evidenceUpdate: {
      endedAt: terminalReason ? input.completedAt : undefined,
      localEvidenceStatus: "protected",
      packageId: input.packageId,
      status: terminalReason ? "protected" : "transmitting"
    },
    recordingStatusInput: {
      audioCaptured: input.audioCaptured,
      event: "live_call_recording_preserved"
    },
    successLog: {
      event: "live_video_recording_preserve_success",
      payload: {
        assetCreated: input.assetCreated,
        audioCaptured: input.audioCaptured,
        platform: input.platform,
        reason: input.reason,
        remoteSessionId: input.remoteSessionId
      }
    }
  };
}

export function resolveOwnerLiveVideoPreserveErrorActions(input: {
  packageId: string;
  platform: string;
  reason: OwnerLiveVideoPreserveReason;
  remoteSessionId: string;
}): OwnerLiveVideoPreserveErrorActions {
  return {
    auditMarker: {
      event: "local_evidence_failed",
      options: {
        connectionState: "failed",
        localEvidenceStatus: "failed"
      }
    },
    errorLog: {
      event: "live_video_recording_preserve_error",
      payload: {
        platform: input.platform,
        reason: input.reason,
        remoteSessionId: input.remoteSessionId
      }
    },
    evidenceUpdate: {
      localEvidenceStatus: "failed",
      packageId: input.packageId,
      status: "failed"
    }
  };
}
