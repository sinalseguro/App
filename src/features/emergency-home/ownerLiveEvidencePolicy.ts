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
