import assert from "node:assert/strict";

import { resolveFinishOwnerLiveAuditMarker } from "../src/features/emergency-home/finishOwnerLiveAuditPolicy";

assert.deepEqual(
  resolveFinishOwnerLiveAuditMarker({
    auditMarker: "local_evidence_protected",
    localEvidenceStatus: "protected"
  }),
  {
    event: "local_evidence_protected",
    options: {
      connectionState: "ended",
      localEvidenceStatus: "protected"
    }
  }
);

assert.deepEqual(
  resolveFinishOwnerLiveAuditMarker({
    auditMarker: "local_evidence_metadata_only",
    localEvidenceStatus: "metadata_only"
  }),
  {
    event: "local_evidence_metadata_only",
    options: {
      connectionState: "ended",
      localEvidenceStatus: "metadata_only"
    }
  }
);

assert.deepEqual(
  resolveFinishOwnerLiveAuditMarker({
    auditMarker: "local_evidence_failed",
    localEvidenceStatus: "failed"
  }),
  {
    event: "local_evidence_failed",
    options: {
      connectionState: "ended",
      localEvidenceStatus: "failed"
    }
  }
);

console.log("finish-owner-live-audit-policy ok");
