import assert from "node:assert/strict";

import { resolveMediaHandoffPolicy } from "../src/features/emergency-home/mediaHandoffPolicy";

assert.deepEqual(
  resolveMediaHandoffPolicy({
    activePackageId: null,
    captureStopLocked: false,
    isWebPlatform: false,
    requestLocalVideoOnSos: true
  }),
  {
    reason: "missing_active_package",
    shouldPrepare: false
  }
);

assert.deepEqual(
  resolveMediaHandoffPolicy({
    activePackageId: "pkg-1",
    captureStopLocked: true,
    isWebPlatform: false,
    requestLocalVideoOnSos: true
  }),
  {
    reason: "capture_stop_locked",
    shouldPrepare: false
  }
);

assert.deepEqual(
  resolveMediaHandoffPolicy({
    activePackageId: "pkg-1",
    captureStopLocked: false,
    isWebPlatform: true,
    requestLocalVideoOnSos: true
  }),
  {
    reason: "web_platform",
    shouldPrepare: false
  }
);

assert.deepEqual(
  resolveMediaHandoffPolicy({
    activePackageId: "pkg-1",
    captureStopLocked: false,
    isWebPlatform: false,
    requestLocalVideoOnSos: false
  }),
  {
    reason: "local_capture_not_requested",
    shouldPrepare: false
  }
);

assert.deepEqual(
  resolveMediaHandoffPolicy({
    activePackageId: "pkg-1",
    captureStopLocked: false,
    isWebPlatform: false,
    requestLocalVideoOnSos: true
  }),
  {
    complete: {
      auditMarker: "owner_media_handoff_complete",
      connectionState: "connecting",
      localEvidenceStatus: "metadata_only",
      liveEvidenceStatus: "transmitting"
    },
    packageId: "pkg-1",
    shouldPrepare: true,
    start: {
      auditMarker: "owner_media_handoff_start",
      connectionState: "connecting",
      localEvidenceStatus: "recording",
      liveEvidenceStatus: "recording",
      recordingStatus: "Anjo entrou. Preparando transmissao ao vivo."
    }
  }
);

console.log("media-handoff-policy ok");
