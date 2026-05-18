import assert from "node:assert/strict";

import { resolveFinishOwnerLiveEvidenceUpdate } from "../src/features/emergency-home/finishOwnerLiveEvidencePolicy";

assert.deepEqual(
  resolveFinishOwnerLiveEvidenceUpdate({
    endedAt: "2026-05-18T10:00:00.000Z",
    localEvidenceStatus: "protected",
    packageId: "pkg-1"
  }),
  {
    endedAt: "2026-05-18T10:00:00.000Z",
    localEvidenceStatus: "protected",
    packageId: "pkg-1",
    status: "protected"
  }
);

assert.deepEqual(
  resolveFinishOwnerLiveEvidenceUpdate({
    endedAt: "2026-05-18T10:01:00.000Z",
    localEvidenceStatus: "metadata_only",
    packageId: "pkg-2"
  }),
  {
    endedAt: "2026-05-18T10:01:00.000Z",
    localEvidenceStatus: "metadata_only",
    packageId: "pkg-2",
    status: "metadata_only"
  }
);

assert.deepEqual(
  resolveFinishOwnerLiveEvidenceUpdate({
    endedAt: "2026-05-18T10:02:00.000Z",
    localEvidenceStatus: "failed",
    packageId: "pkg-3"
  }),
  {
    endedAt: "2026-05-18T10:02:00.000Z",
    localEvidenceStatus: "failed",
    packageId: "pkg-3",
    status: "failed"
  }
);

console.log("finish-owner-live-evidence-policy ok");
