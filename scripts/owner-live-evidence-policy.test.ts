import assert from "node:assert/strict";

import { resolveOwnerLiveVideoEvidenceStart } from "../src/features/emergency-home/ownerLiveEvidencePolicy";

assert.deepEqual(
  resolveOwnerLiveVideoEvidenceStart({
    packageId: "pkg-1",
    remoteSessionId: "session-1",
    role: "angel",
    status: "connected",
    streamReactTag: "stream://owner"
  }),
  {
    reason: "not_owner",
    shouldStart: false
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoEvidenceStart({
    packageId: "pkg-1",
    role: "owner",
    status: "connected",
    streamReactTag: "stream://owner"
  }),
  {
    reason: "missing_remote_session",
    shouldStart: false
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoEvidenceStart({
    fallbackRemoteSessionId: "session-fallback",
    role: "owner",
    status: "connected",
    streamReactTag: "stream://owner"
  }),
  {
    reason: "missing_package",
    shouldStart: false
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoEvidenceStart({
    fallbackPackageId: "pkg-fallback",
    fallbackRemoteSessionId: "session-fallback",
    role: "owner",
    status: "connected"
  }),
  {
    reason: "missing_stream_tag",
    shouldStart: false
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoEvidenceStart({
    fallbackPackageId: "pkg-fallback",
    fallbackRemoteSessionId: "session-fallback",
    role: "owner",
    status: "ended",
    streamReactTag: "stream://owner"
  }),
  {
    reason: "inactive_status",
    shouldStart: false
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoEvidenceStart({
    fallbackPackageId: "pkg-fallback",
    fallbackRemoteSessionId: "session-fallback",
    packageId: "pkg-current",
    remoteSessionId: "session-current",
    role: "owner",
    status: "connected",
    streamReactTag: "stream://owner"
  }),
  {
    shouldStart: true,
    startInput: {
      packageId: "pkg-current",
      remoteSessionId: "session-current",
      streamReactTag: "stream://owner"
    }
  }
);

assert.deepEqual(
  resolveOwnerLiveVideoEvidenceStart({
    callSessionId: "call-1",
    fallbackPackageId: "pkg-fallback",
    fallbackRemoteSessionId: "session-fallback",
    role: "owner",
    status: "connecting",
    streamReactTag: "stream://owner"
  }),
  {
    shouldStart: true,
    startInput: {
      callSessionId: "call-1",
      packageId: "pkg-fallback",
      remoteSessionId: "session-fallback",
      streamReactTag: "stream://owner"
    }
  }
);

console.log("owner-live-evidence-policy ok");
