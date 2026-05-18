export type MediaHandoffSkipReason =
  | "missing_active_package"
  | "capture_stop_locked"
  | "web_platform"
  | "local_capture_not_requested";

export type MediaHandoffLocalEvidenceStatus = "recording" | "metadata_only";

export type MediaHandoffLiveEvidenceStatus = "recording" | "transmitting";

export type MediaHandoffAuditMarker = "owner_media_handoff_start" | "owner_media_handoff_complete";

export type MediaHandoffConnectionState = "connecting";

export type MediaHandoffStagePresentation = {
  auditMarker: MediaHandoffAuditMarker;
  connectionState: MediaHandoffConnectionState;
  localEvidenceStatus: MediaHandoffLocalEvidenceStatus;
  liveEvidenceStatus: MediaHandoffLiveEvidenceStatus;
  recordingStatus?: string;
};

export type MediaHandoffProceedDecision = {
  complete: MediaHandoffStagePresentation;
  packageId: string;
  shouldPrepare: true;
  start: MediaHandoffStagePresentation;
};

export type MediaHandoffSkipDecision = {
  reason: MediaHandoffSkipReason;
  shouldPrepare: false;
};

export type MediaHandoffDecision = MediaHandoffProceedDecision | MediaHandoffSkipDecision;

export type MediaHandoffPolicyInput = {
  activePackageId?: string | null;
  captureStopLocked: boolean;
  isWebPlatform: boolean;
  requestLocalVideoOnSos: boolean;
};

export function resolveMediaHandoffPolicy(input: MediaHandoffPolicyInput): MediaHandoffDecision {
  const { activePackageId, captureStopLocked, isWebPlatform, requestLocalVideoOnSos } = input;

  if (!activePackageId) {
    return { reason: "missing_active_package", shouldPrepare: false };
  }

  if (captureStopLocked) {
    return { reason: "capture_stop_locked", shouldPrepare: false };
  }

  if (isWebPlatform) {
    return { reason: "web_platform", shouldPrepare: false };
  }

  if (!requestLocalVideoOnSos) {
    return { reason: "local_capture_not_requested", shouldPrepare: false };
  }

  return {
    complete: {
      auditMarker: "owner_media_handoff_complete",
      connectionState: "connecting",
      localEvidenceStatus: "metadata_only",
      liveEvidenceStatus: "transmitting"
    },
    packageId: activePackageId,
    shouldPrepare: true,
    start: {
      auditMarker: "owner_media_handoff_start",
      connectionState: "connecting",
      localEvidenceStatus: "recording",
      liveEvidenceStatus: "recording",
      recordingStatus: "Anjo entrou. Preparando transmissao ao vivo."
    }
  };
}
