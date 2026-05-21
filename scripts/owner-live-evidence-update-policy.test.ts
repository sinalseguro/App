import assert from "node:assert/strict";

import { resolveOwnerLiveEvidenceUpdate } from "../src/features/emergency-home/ownerLiveEvidenceUpdatePolicy";

assert.deepEqual(
  resolveOwnerLiveEvidenceUpdate({
    options: {
      packageId: "pkg-1",
      status: "recording"
    }
  }),
  {
    shouldUpdate: false
  }
);

assert.deepEqual(
  resolveOwnerLiveEvidenceUpdate({
    options: {
      endedAt: "2026-05-20T21:00:00.000Z",
      localEvidenceStatus: "protected",
      packageId: "pkg-1",
      status: "ended"
    },
    remoteSessionId: "remote-1"
  }),
  {
    options: {
      endedAt: "2026-05-20T21:00:00.000Z",
      localEvidenceStatus: "protected",
      packageId: "pkg-1",
      status: "ended"
    },
    remoteSessionId: "remote-1",
    shouldUpdate: true
  }
);

console.log("owner-live-evidence-update-policy ok");
