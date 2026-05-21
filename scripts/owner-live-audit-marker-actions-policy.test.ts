import assert from "node:assert/strict";

import { resolveOwnerLiveAuditMarkerActions } from "../src/features/emergency-home/ownerLiveAuditMarkerActionsPolicy";

assert.deepEqual(
  resolveOwnerLiveAuditMarkerActions({
    event: "local_evidence_failed",
    options: {
      connectionState: "failed",
      localEvidenceStatus: "metadata_only"
    }
  }),
  {
    shouldRecord: false
  }
);

assert.deepEqual(
  resolveOwnerLiveAuditMarkerActions({
    event: "local_evidence_recording",
    options: {
      connectionState: "connected",
      localEvidenceStatus: "recording"
    },
    remoteSessionId: "remote-1"
  }),
  {
    event: "local_evidence_recording",
    options: {
      connectionState: "connected",
      localEvidenceStatus: "recording"
    },
    remoteSessionId: "remote-1",
    shouldRecord: true
  }
);

console.log("owner-live-audit-marker-actions-policy ok");
