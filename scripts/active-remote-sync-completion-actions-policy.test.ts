import assert from "node:assert/strict";

import {
  resolveActiveRemoteSyncFailureActions,
  resolveActiveRemoteSyncFinallyActions,
  resolveActiveRemoteSyncPackageActions,
  resolveActiveRemoteSyncResultActions
} from "../src/features/emergency-home/activeRemoteSyncCompletionActionsPolicy";

assert.deepEqual(
  resolveActiveRemoteSyncPackageActions({
    activePackage: { id: "pkg-1" },
    activePackageId: "pkg-1",
    cancelled: true
  }),
  {
    reason: "cancelled",
    shouldSyncPackage: false
  }
);

assert.deepEqual(
  resolveActiveRemoteSyncPackageActions({
    activePackage: null,
    activePackageId: "pkg-1",
    cancelled: false
  }),
  {
    reason: "missing_package",
    shouldSyncPackage: false
  }
);

assert.deepEqual(
  resolveActiveRemoteSyncPackageActions({
    activePackage: { id: "pkg-2" },
    activePackageId: "pkg-1",
    cancelled: false
  }),
  {
    reason: "package_changed",
    shouldSyncPackage: false
  }
);

const packageToSync = { id: "pkg-1", localOnly: true };
assert.deepEqual(
  resolveActiveRemoteSyncPackageActions({
    activePackage: packageToSync,
    activePackageId: "pkg-1",
    cancelled: false
  }),
  {
    packageToSync,
    shouldSyncPackage: true
  }
);

assert.deepEqual(resolveActiveRemoteSyncResultActions({ cancelled: true, hasSyncState: true }), {
  reason: "cancelled",
  shouldApplySyncState: false
});

assert.deepEqual(resolveActiveRemoteSyncResultActions({ cancelled: false, hasSyncState: false }), {
  reason: "missing_sync_state",
  shouldApplySyncState: false
});

assert.deepEqual(resolveActiveRemoteSyncResultActions({ cancelled: false, hasSyncState: true }), {
  shouldApplySyncState: true
});

assert.deepEqual(
  resolveActiveRemoteSyncFailureActions({
    activePackageId: "pkg-1",
    cancelled: true,
    platform: "android",
    source: "retry"
  }),
  {
    shouldApply: false
  }
);

assert.deepEqual(
  resolveActiveRemoteSyncFailureActions({
    activePackageId: "pkg-1",
    cancelled: false,
    platform: "android",
    source: "retry"
  }),
  {
    log: {
      event: "emergency_active_remote_sync_error",
      payload: {
        packageId: "pkg-1",
        platform: "android",
        source: "retry"
      }
    },
    recordingStatus: "SOS local ativo. Tentando avisar seus anjos pela internet.",
    shouldApply: true
  }
);

assert.deepEqual(resolveActiveRemoteSyncFinallyActions(), {
  shouldClearInFlight: true
});

console.log("active-remote-sync-completion-actions-policy ok");
