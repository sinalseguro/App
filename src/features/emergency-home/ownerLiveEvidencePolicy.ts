import type { LiveAudioRole, LiveAudioStatus } from "@/features/live-call/liveCallSessionPolicy";

export type OwnerLiveVideoEvidenceStartSkipReason =
  | "not_owner"
  | "missing_remote_session"
  | "missing_package"
  | "missing_stream_tag"
  | "inactive_status";

export type OwnerLiveVideoEvidenceStartInput = {
  callSessionId?: string;
  fallbackPackageId?: string | null;
  fallbackRemoteSessionId?: string | null;
  packageId?: string | null;
  remoteSessionId?: string;
  role?: LiveAudioRole;
  status: LiveAudioStatus;
  streamReactTag?: string | null;
};

export type OwnerLiveVideoEvidenceStartDecision =
  | {
      reason: OwnerLiveVideoEvidenceStartSkipReason;
      shouldStart: false;
    }
  | {
      startInput: {
        callSessionId?: string;
        packageId: string;
        remoteSessionId: string;
        streamReactTag: string;
      };
      shouldStart: true;
    };

export type OwnerLiveCallLifecycleSkipReason = "not_owner" | "missing_remote_session" | "status_not_actionable";

export type OwnerLiveCallLifecycleTimestampField = "connectedAt" | "endedAt";

export type OwnerLiveCallLifecycleLocalEvidenceStatus = "recording" | "metadata_only" | "failed";

export type OwnerLiveCallLifecycleStatus = "recording" | "transmitting" | "failed" | "ended";

export type OwnerLiveCallLifecycleInput = {
  activeRecordingRemoteSessionId?: string | null;
  fallbackPackageId?: string | null;
  fallbackRemoteSessionId?: string | null;
  packageId?: string | null;
  remoteSessionId?: string;
  role?: LiveAudioRole;
  status: LiveAudioStatus;
};

export type OwnerLiveCallLifecycleDecision =
  | {
      reason: OwnerLiveCallLifecycleSkipReason;
      shouldApply: false;
    }
  | {
      clearStartedSession: boolean;
      evidenceUpdate: {
        localEvidenceStatus?: OwnerLiveCallLifecycleLocalEvidenceStatus;
        packageId?: string;
        status: OwnerLiveCallLifecycleStatus;
        timestampField: OwnerLiveCallLifecycleTimestampField;
      };
      remoteSessionId: string;
      shouldApply: true;
      shouldStopLiveVideoEvidence: boolean;
    };

export function resolveOwnerLiveVideoEvidenceStart(
  input: OwnerLiveVideoEvidenceStartInput
): OwnerLiveVideoEvidenceStartDecision {
  const remoteSessionId = input.remoteSessionId ?? input.fallbackRemoteSessionId;
  const packageId = input.packageId ?? input.fallbackPackageId;

  if (input.role !== "owner") {
    return { reason: "not_owner", shouldStart: false };
  }

  if (!remoteSessionId) {
    return { reason: "missing_remote_session", shouldStart: false };
  }

  if (!packageId) {
    return { reason: "missing_package", shouldStart: false };
  }

  if (!input.streamReactTag) {
    return { reason: "missing_stream_tag", shouldStart: false };
  }

  if (input.status === "ended" || input.status === "failed") {
    return { reason: "inactive_status", shouldStart: false };
  }

  return {
    shouldStart: true,
    startInput: {
      ...(input.callSessionId ? { callSessionId: input.callSessionId } : {}),
      packageId,
      remoteSessionId,
      streamReactTag: input.streamReactTag
    }
  };
}

export function resolveOwnerLiveCallLifecycle(input: OwnerLiveCallLifecycleInput): OwnerLiveCallLifecycleDecision {
  const remoteSessionId = input.remoteSessionId ?? input.fallbackRemoteSessionId;
  const packageId = input.packageId ?? input.fallbackPackageId ?? undefined;

  if (input.role !== "owner") {
    return { reason: "not_owner", shouldApply: false };
  }

  if (!remoteSessionId) {
    return { reason: "missing_remote_session", shouldApply: false };
  }

  if (input.status === "connected") {
    const hasLiveVideoRecording = input.activeRecordingRemoteSessionId === remoteSessionId;
    return {
      clearStartedSession: false,
      evidenceUpdate: {
        localEvidenceStatus: hasLiveVideoRecording ? "recording" : "metadata_only",
        ...(packageId ? { packageId } : {}),
        status: hasLiveVideoRecording ? "recording" : "transmitting",
        timestampField: "connectedAt"
      },
      remoteSessionId,
      shouldApply: true,
      shouldStopLiveVideoEvidence: false
    };
  }

  if (input.status === "failed") {
    return {
      clearStartedSession: true,
      evidenceUpdate: {
        localEvidenceStatus: "failed",
        ...(packageId ? { packageId } : {}),
        status: "failed",
        timestampField: "endedAt"
      },
      remoteSessionId,
      shouldApply: true,
      shouldStopLiveVideoEvidence: true
    };
  }

  if (input.status === "ended") {
    return {
      clearStartedSession: true,
      evidenceUpdate: {
        ...(packageId ? { packageId } : {}),
        status: "ended",
        timestampField: "endedAt"
      },
      remoteSessionId,
      shouldApply: true,
      shouldStopLiveVideoEvidence: true
    };
  }

  return { reason: "status_not_actionable", shouldApply: false };
}
