import assert from "node:assert/strict";

import { resolveFinishPackageResult } from "../src/features/emergency-home/finishPackageResultPolicy";
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
  resolveFinishPackageResult({
    liveVideoAttached: true,
    media: recordedMedia,
    platform: "android"
  }),
  {
    attachedAssetsAfterFinish: 1,
    liveVideoAttached: true,
    logEvent: "emergency_finish_package_result",
    logPayload: {
      attachedAssetCount: 1,
      liveVideoAttached: true,
      mediaRecorded: true,
      platform: "android"
    },
    mediaRecorded: true
  }
);

assert.deepEqual(
  resolveFinishPackageResult({
    liveVideoAttached: false,
    media: {
      assets: [],
      policy: "pending",
      recordingMode: "video",
      status: "pending_local_recording"
    },
    platform: "ios"
  }),
  {
    attachedAssetsAfterFinish: 0,
    liveVideoAttached: false,
    logEvent: "emergency_finish_package_result",
    logPayload: {
      attachedAssetCount: 0,
      liveVideoAttached: false,
      mediaRecorded: false,
      platform: "ios"
    },
    mediaRecorded: false
  }
);

console.log("finish-package-result-policy ok");
