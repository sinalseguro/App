import assert from "node:assert/strict";

import { resolveFinishPackageOutcomeActions } from "../src/features/emergency-home/finishPackageOutcomeActionsPolicy";
import type { LocalMediaAsset, MediaCaptureManifest } from "../src/features/emergency/types";

const mediaAsset: LocalMediaAsset = {
  cameraMode: "back",
  completedAt: "2026-05-18T00:00:10.000Z",
  encryptionStatus: "encrypted_native_segmented_v1",
  fileName: "asset.mp4",
  hashMode: "content_sha256",
  id: "asset-1",
  kind: "video",
  mimeType: "video/mp4",
  recordedAt: "2026-05-18T00:00:00.000Z",
  sha256: "sha256",
  sizeBytes: 10,
  storage: "app_private_native_segments",
  uri: "sinalseguro://asset-1"
};

const recordedMedia: MediaCaptureManifest = {
  assets: [mediaAsset],
  policy: "local",
  recordingMode: "video",
  status: "recorded_local"
};

assert.deepEqual(
  resolveFinishPackageOutcomeActions({
    endedAt: "2026-05-18T00:01:00.000Z",
    liveVideoAttached: false,
    media: recordedMedia,
    mediaWasHandedToLiveCall: false,
    packageId: "pkg-1",
    platform: "android",
    remoteFinishFailed: false,
    stopResultStatus: "attached",
    stopSerialPresent: true
  }),
  {
    finishOutcome: {
      auditMarker: "local_evidence_protected",
      finishProgress: {
        detail: "Video protegido, camera liberada e pacote local finalizado.",
        progress: 100,
        status: "done",
        title: "Video protegido"
      },
      localEvidenceStatus: "protected",
      recordingStatus: "Chamado encerrado. Video preservado no cofre local."
    },
    finishOutcomeInput: {
      attachedAssetsAfterFinish: 1,
      liveVideoAttached: false,
      mediaWasHandedToLiveCall: false,
      remoteFinishFailed: false,
      stopResultStatus: "attached",
      stopSerialPresent: true
    },
    finishPackageResult: {
      attachedAssetsAfterFinish: 1,
      liveVideoAttached: false,
      logEvent: "emergency_finish_package_result",
      logPayload: {
        attachedAssetCount: 1,
        liveVideoAttached: false,
        mediaRecorded: true,
        platform: "android"
      },
      mediaRecorded: true
    },
    ownerCompletionActions: {
      auditMarker: {
        event: "local_evidence_protected",
        options: {
          connectionState: "ended",
          localEvidenceStatus: "protected"
        }
      },
      evidenceUpdate: {
        endedAt: "2026-05-18T00:01:00.000Z",
        localEvidenceStatus: "protected",
        packageId: "pkg-1",
        status: "protected"
      }
    },
    postOutcomeActions: {
      completionActions: {
        finishProgress: {
          detail: "Video protegido, camera liberada e pacote local finalizado.",
          progress: 100,
          status: "done",
          title: "Video protegido"
        },
        recordingStatus: "Chamado encerrado. Video preservado no cofre local.",
        shouldClearFinishCodeInput: true,
        shouldClearFinishError: true,
        shouldCloseFinishConfirmation: true
      },
      noMediaDiagnostic: {
        shouldPersist: false
      }
    }
  }
);

assert.equal(
  resolveFinishPackageOutcomeActions({
    endedAt: "2026-05-18T00:01:00.000Z",
    liveVideoAttached: false,
    media: {
      assets: [],
      policy: "pending",
      recordingMode: "video",
      status: "pending_local_recording"
    },
    mediaWasHandedToLiveCall: true,
    packageId: "pkg-2",
    platform: "android",
    remoteFinishFailed: true,
    stopSerialPresent: false
  }).postOutcomeActions.noMediaDiagnostic.shouldPersist,
  true
);

console.log("finish-package-outcome-actions-policy ok");
