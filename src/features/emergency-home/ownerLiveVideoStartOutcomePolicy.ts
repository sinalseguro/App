import type { LocalSosPackageStatusInput } from "./localSosPackageStatusPolicy";
import type {
  OwnerLiveAuditMarkerEvent,
  OwnerLiveAuditMarkerOptions
} from "./ownerLiveAuditMarkerPolicy";
import type { OwnerLiveEvidenceUpdateOptions } from "./ownerLiveEvidenceUpdatePolicy";

export type OwnerLiveVideoStartOutcomeKind = "metadata_only" | "recording_started" | "start_error";

export type OwnerLiveVideoStartOutcomeActions = {
  auditMarker?: {
    event: OwnerLiveAuditMarkerEvent;
    options: OwnerLiveAuditMarkerOptions;
  };
  evidenceUpdate: OwnerLiveEvidenceUpdateOptions;
  log?: {
    event: "live_video_recording_start_error";
    payload: {
      platform: string;
      remoteSessionId: string;
    };
  };
  recordingStatusInput?: LocalSosPackageStatusInput;
  shouldStoreActiveRecording: boolean;
};

export function resolveOwnerLiveVideoStartOutcomeActions(input: {
  outcome: OwnerLiveVideoStartOutcomeKind;
  packageId: string;
  platform: string;
  remoteSessionId: string;
}): OwnerLiveVideoStartOutcomeActions {
  if (input.outcome === "recording_started") {
    return {
      auditMarker: {
        event: "local_evidence_recording",
        options: {
          connectionState: "connected",
          localEvidenceStatus: "recording"
        }
      },
      evidenceUpdate: {
        localEvidenceStatus: "recording",
        packageId: input.packageId,
        status: "recording"
      },
      recordingStatusInput: {
        event: "live_call_recording_started"
      },
      shouldStoreActiveRecording: true
    };
  }

  const baseActions: OwnerLiveVideoStartOutcomeActions = {
    evidenceUpdate: {
      localEvidenceStatus: "metadata_only",
      packageId: input.packageId,
      status: "transmitting"
    },
    shouldStoreActiveRecording: false
  };

  if (input.outcome === "start_error") {
    return {
      ...baseActions,
      log: {
        event: "live_video_recording_start_error",
        payload: {
          platform: input.platform,
          remoteSessionId: input.remoteSessionId
        }
      }
    };
  }

  return baseActions;
}
