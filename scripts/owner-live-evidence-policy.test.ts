import assert from "node:assert/strict";

import {
  resolveOwnerLiveCallLifecycle,
  resolveOwnerLiveVideoEvidenceStart
} from "../src/features/emergency-home/ownerLiveEvidencePolicy";

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

assert.deepEqual(
  resolveOwnerLiveCallLifecycle({
    remoteSessionId: "session-1",
    role: "angel",
    status: "connected"
  }),
  {
    reason: "not_owner",
    shouldApply: false
  }
);

assert.deepEqual(
  resolveOwnerLiveCallLifecycle({
    role: "owner",
    status: "connected"
  }),
  {
    reason: "missing_remote_session",
    shouldApply: false
  }
);

assert.deepEqual(
  resolveOwnerLiveCallLifecycle({
    remoteSessionId: "session-1",
    role: "owner",
    status: "waiting"
  }),
  {
    reason: "status_not_actionable",
    shouldApply: false
  }
);

assert.deepEqual(
  resolveOwnerLiveCallLifecycle({
    activeRecordingRemoteSessionId: "session-1",
    fallbackPackageId: "pkg-fallback",
    fallbackRemoteSessionId: "session-fallback",
    packageId: "pkg-current",
    remoteSessionId: "session-1",
    role: "owner",
    status: "connected"
  }),
  {
    clearStartedSession: false,
    evidenceUpdate: {
      localEvidenceStatus: "recording",
      packageId: "pkg-current",
      status: "recording",
      timestampField: "connectedAt"
    },
    remoteSessionId: "session-1",
    shouldApply: true,
    shouldStopLiveVideoEvidence: false
  }
);

assert.deepEqual(
  resolveOwnerLiveCallLifecycle({
    activeRecordingRemoteSessionId: "other-session",
    fallbackPackageId: "pkg-fallback",
    fallbackRemoteSessionId: "session-fallback",
    role: "owner",
    status: "connected"
  }),
  {
    clearStartedSession: false,
    evidenceUpdate: {
      localEvidenceStatus: "metadata_only",
      packageId: "pkg-fallback",
      status: "transmitting",
      timestampField: "connectedAt"
    },
    remoteSessionId: "session-fallback",
    shouldApply: true,
    shouldStopLiveVideoEvidence: false
  }
);

assert.deepEqual(
  resolveOwnerLiveCallLifecycle({
    fallbackPackageId: "pkg-fallback",
    remoteSessionId: "session-1",
    role: "owner",
    status: "failed"
  }),
  {
    clearStartedSession: true,
    evidenceUpdate: {
      localEvidenceStatus: "failed",
      packageId: "pkg-fallback",
      status: "failed",
      timestampField: "endedAt"
    },
    remoteSessionId: "session-1",
    shouldApply: true,
    shouldStopLiveVideoEvidence: true
  }
);

assert.deepEqual(
  resolveOwnerLiveCallLifecycle({
    remoteSessionId: "session-1",
    role: "owner",
    status: "ended"
  }),
  {
    clearStartedSession: true,
    evidenceUpdate: {
      status: "ended",
      timestampField: "endedAt"
    },
    remoteSessionId: "session-1",
    shouldApply: true,
    shouldStopLiveVideoEvidence: true
  }
);

console.log("owner-live-evidence-policy ok");
