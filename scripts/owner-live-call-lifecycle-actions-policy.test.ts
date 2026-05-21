import assert from "node:assert/strict";

import { resolveOwnerLiveCallLifecycleActions } from "../src/features/emergency-home/ownerLiveCallLifecycleActionsPolicy";
import type { OwnerLiveCallLifecycleDecision } from "../src/features/emergency-home/ownerLiveEvidencePolicy";

assert.deepEqual(
  resolveOwnerLiveCallLifecycleActions({
    decision: {
      reason: "not_owner",
      shouldApply: false
    },
    timestamp: "2026-05-21T08:00:00.000Z"
  }),
  {
    shouldApply: false
  }
);

assert.deepEqual(
  resolveOwnerLiveCallLifecycleActions({
    decision: {
      clearStartedSession: false,
      evidenceUpdate: {
        localEvidenceStatus: "recording",
        packageId: "pkg-1",
        status: "recording",
        timestampField: "connectedAt"
      },
      remoteSessionId: "remote-1",
      shouldApply: true,
      shouldStopLiveVideoEvidence: false
    } satisfies OwnerLiveCallLifecycleDecision,
    timestamp: "2026-05-21T08:00:00.000Z"
  }),
  {
    clearStartedSessionId: undefined,
    evidenceUpdate: {
      connectedAt: "2026-05-21T08:00:00.000Z",
      localEvidenceStatus: "recording",
      packageId: "pkg-1",
      status: "recording"
    },
    remoteSessionId: "remote-1",
    shouldApply: true,
    shouldClearStartedSession: false,
    shouldStopLiveVideoEvidence: false,
    stopLiveVideoEvidenceReason: undefined
  }
);

assert.deepEqual(
  resolveOwnerLiveCallLifecycleActions({
    decision: {
      clearStartedSession: true,
      evidenceUpdate: {
        localEvidenceStatus: "failed",
        packageId: "pkg-1",
        status: "failed",
        timestampField: "endedAt"
      },
      remoteSessionId: "remote-1",
      shouldApply: true,
      shouldStopLiveVideoEvidence: true
    } satisfies OwnerLiveCallLifecycleDecision,
    timestamp: "2026-05-21T08:00:00.000Z"
  }),
  {
    clearStartedSessionId: "remote-1",
    evidenceUpdate: {
      endedAt: "2026-05-21T08:00:00.000Z",
      localEvidenceStatus: "failed",
      packageId: "pkg-1",
      status: "failed"
    },
    remoteSessionId: "remote-1",
    shouldApply: true,
    shouldClearStartedSession: true,
    shouldStopLiveVideoEvidence: true,
    stopLiveVideoEvidenceReason: "call_finished"
  }
);

console.log("owner-live-call-lifecycle-actions-policy ok");
