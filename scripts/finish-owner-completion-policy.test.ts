import assert from "node:assert/strict";

import { resolveFinishOwnerCompletionActions } from "../src/features/emergency-home/finishOwnerCompletionPolicy";

assert.deepEqual(
  resolveFinishOwnerCompletionActions({
    endedAt: "2026-05-18T10:00:00.000Z",
    finishOutcome: {
      auditMarker: "local_evidence_protected",
      localEvidenceStatus: "protected"
    },
    packageId: "pkg-1"
  }),
  {
    auditMarker: {
      event: "local_evidence_protected",
      options: {
        connectionState: "ended",
        localEvidenceStatus: "protected"
      }
    },
    evidenceUpdate: {
      endedAt: "2026-05-18T10:00:00.000Z",
      localEvidenceStatus: "protected",
      packageId: "pkg-1",
      status: "protected"
    }
  }
);

assert.deepEqual(
  resolveFinishOwnerCompletionActions({
    endedAt: "2026-05-18T10:01:00.000Z",
    finishOutcome: {
      auditMarker: "local_evidence_failed",
      localEvidenceStatus: "failed"
    },
    packageId: "pkg-2"
  }),
  {
    auditMarker: {
      event: "local_evidence_failed",
      options: {
        connectionState: "ended",
        localEvidenceStatus: "failed"
      }
    },
    evidenceUpdate: {
      endedAt: "2026-05-18T10:01:00.000Z",
      localEvidenceStatus: "failed",
      packageId: "pkg-2",
      status: "failed"
    }
  }
);

console.log("finish-owner-completion-policy ok");
