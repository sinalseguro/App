import assert from "node:assert/strict";

import { resolveOwnerLiveAuditMarkerInput } from "../src/features/emergency-home/ownerLiveAuditMarkerPolicy";

assert.deepEqual(
  resolveOwnerLiveAuditMarkerInput({
    deviceId: "device-1",
    event: "local_evidence_recording",
    options: {
      connectionState: "connected",
      localEvidenceStatus: "recording"
    }
  }),
  {
    connectionState: "connected",
    deviceId: "device-1",
    event: "local_evidence_recording",
    localEvidenceStatus: "recording",
    role: "owner"
  }
);

assert.deepEqual(
  resolveOwnerLiveAuditMarkerInput({
    deviceId: null,
    event: "local_evidence_failed"
  }),
  {
    connectionState: undefined,
    deviceId: null,
    event: "local_evidence_failed",
    localEvidenceStatus: undefined,
    role: "owner"
  }
);

console.log("owner-live-audit-marker-policy ok");
