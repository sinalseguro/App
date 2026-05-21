import assert from "node:assert/strict";

import { resolveMediaHandoffStartActions } from "../src/features/emergency-home/mediaHandoffStartActionsPolicy";

assert.deepEqual(
  resolveMediaHandoffStartActions({
    packageId: "pkg-1",
    platform: "android",
    stage: {
      auditMarker: "owner_media_handoff_start",
      connectionState: "connecting",
      localEvidenceStatus: "recording",
      liveEvidenceStatus: "recording",
      recordingStatus: "Anjo entrou. Preparando transmissao ao vivo."
    }
  }),
  {
    auditMarker: {
      event: "owner_media_handoff_start",
      options: {
        connectionState: "connecting",
        localEvidenceStatus: "recording"
      }
    },
    captureStopLocked: true,
    evidenceUpdate: {
      localEvidenceStatus: "recording",
      packageId: "pkg-1",
      status: "recording"
    },
    log: {
      event: "emergency_live_call_media_handoff_start",
      payload: {
        packageId: "pkg-1",
        platform: "android"
      }
    },
    mediaRecorderPackageId: "pkg-1",
    mediaStopPurpose: "live_call_handoff",
    recordingStatus: "Anjo entrou. Preparando transmissao ao vivo."
  }
);

assert.equal(
  resolveMediaHandoffStartActions({
    packageId: "pkg-1",
    platform: "android",
    stage: {
      auditMarker: "owner_media_handoff_start",
      connectionState: "connecting",
      localEvidenceStatus: "recording",
      liveEvidenceStatus: "recording"
    }
  }).recordingStatus,
  undefined
);

console.log("media-handoff-start-actions-policy ok");
