import assert from "node:assert/strict";

import { resolveFinishNoMediaDiagnosticRequest } from "../src/features/emergency-home/finishNoMediaDiagnosticPolicy";

assert.deepEqual(
  resolveFinishNoMediaDiagnosticRequest({
    packageId: "pkg-1"
  }),
  {
    shouldPersist: false
  }
);

assert.deepEqual(
  resolveFinishNoMediaDiagnosticRequest({
    diagnosticReason: "camera_no_file_returned",
    packageId: "pkg-2"
  }),
  {
    packageId: "pkg-2",
    reason: "camera_no_file_returned",
    shouldPersist: true
  }
);

console.log("finish-no-media-diagnostic-policy ok");
