import assert from "node:assert/strict";

import type { LiveCallArchiveRecord } from "../src/features/live-call/liveCallHistoryPolicy";
import { idleLiveAudioCallState } from "../src/features/live-call/liveCallStatePolicy";
import {
  buildReceivedAlertArchiveStatusUpdateDecision,
  buildReceivedAlertArchiveSyncDecision,
  buildReceivedAlertRealtimeStartDecision,
  isReceivedAlertLiveCallStatusActive
} from "../src/features/live-call/receivedAlertRuntimePolicy";
import type { ApiEmergencySession } from "../src/services/apiClient";

function emergencySession(overrides: Partial<ApiEmergencySession> = {}): ApiEmergencySession {
  return {
    client_alert_id: "client-alert-1",
    created_at: "2026-05-22T10:00:00.000Z",
    current_recipient: "recipient-1",
    current_recipient_status: null,
    device: "device-1",
    finished_at: null,
    id: "session-1",
    idempotency_key: "idempotency-1",
    kind: "sos",
    location_accuracy_meters: null,
    location_status: "unavailable",
    owner_display_name: "Maria Protegida",
    phase: "created",
    protected_subject: "protected-1",
    recipient_count: 1,
    recipients: [],
    started_at: "2026-05-22T10:00:00.000Z",
    status: "active",
    updated_at: "2026-05-22T10:00:00.000Z",
    ...overrides
  };
}

function archiveRecord(overrides: Partial<LiveCallArchiveRecord> = {}): LiveCallArchiveRecord {
  return {
    durationSeconds: 0,
    id: "archive-1",
    legal: {
      allowedTargets: ["autoridade", "usuario_protegido"],
      shareAllowed: true,
      shareRestriction: "Compartilhamento restrito."
    },
    protectedDisplayName: "Maria Protegida",
    protectedSubjectId: "protected-1",
    remoteSessionId: "session-1",
    role: "angel",
    snapshot: {
      capturedAt: "2026-05-22T10:00:00.000Z",
      label: "MP",
      mediaSummary: "Registro local.",
      recipientScope: "Anjo autorizado",
      subtitle: "Pedido recebido"
    },
    startedAt: "2026-05-22T10:00:00.000Z",
    status: "recording",
    updatedAt: "2026-05-22T10:00:00.000Z",
    ...overrides
  };
}

const noSessions = new Set<string>();

assert.equal(isReceivedAlertLiveCallStatusActive("waiting"), true);
assert.equal(isReceivedAlertLiveCallStatusActive("connecting"), true);
assert.equal(isReceivedAlertLiveCallStatusActive("connected"), true);
assert.equal(isReceivedAlertLiveCallStatusActive("reconnecting"), false);
assert.equal(isReceivedAlertLiveCallStatusActive("failed"), false);

assert.deepEqual(
  buildReceivedAlertRealtimeStartDecision({
    currentCallState: {
      ...idleLiveAudioCallState,
      remoteSessionId: "session-1",
      status: "waiting"
    },
    sessionId: "session-1"
  }),
  {
    canStart: false,
    otherSessionActive: false,
    sameSessionActive: true
  }
);

assert.deepEqual(
  buildReceivedAlertRealtimeStartDecision({
    currentCallState: {
      ...idleLiveAudioCallState,
      remoteSessionId: "other-session",
      status: "connected"
    },
    sessionId: "session-1"
  }),
  {
    canStart: false,
    otherSessionActive: true,
    sameSessionActive: false
  }
);

assert.equal(
  buildReceivedAlertRealtimeStartDecision({
    currentCallState: {
      ...idleLiveAudioCallState,
      remoteSessionId: "other-session",
      status: "ended"
    },
    sessionId: "session-1"
  }).canStart,
  true
);

const pendingDecision = buildReceivedAlertArchiveSyncDecision({
  archivedSessionIds: noSessions,
  autoRealtimeSessionIds: noSessions,
  locallyAcceptedSessionIds: noSessions,
  session: emergencySession()
});

assert.equal(pendingDecision.hasAccepted, false);
assert.equal(pendingDecision.isActive, true);
assert.equal(pendingDecision.shouldCreateArchive, false);
assert.equal(pendingDecision.shouldStartRealtimeForExistingRecord, false);

const acceptedWithRecord = buildReceivedAlertArchiveSyncDecision({
  archivedSessionIds: noSessions,
  autoRealtimeSessionIds: noSessions,
  existingRecord: archiveRecord(),
  locallyAcceptedSessionIds: noSessions,
  session: emergencySession({ current_recipient_status: "accepted" })
});

assert.equal(acceptedWithRecord.hasAccepted, true);
assert.equal(acceptedWithRecord.shouldStartRealtimeForExistingRecord, true);
assert.equal(acceptedWithRecord.shouldCreateArchive, false);

assert.equal(
  buildReceivedAlertArchiveSyncDecision({
    archivedSessionIds: noSessions,
    autoRealtimeSessionIds: new Set(["session-1"]),
    existingRecord: archiveRecord(),
    locallyAcceptedSessionIds: noSessions,
    session: emergencySession({ current_recipient_status: "accepted" })
  }).shouldStartRealtimeForExistingRecord,
  false
);

const acceptedWithoutRecord = buildReceivedAlertArchiveSyncDecision({
  archivedSessionIds: noSessions,
  autoRealtimeSessionIds: noSessions,
  locallyAcceptedSessionIds: noSessions,
  session: emergencySession({ current_recipient_status: "accepted" })
});

assert.equal(acceptedWithoutRecord.shouldCreateArchive, true);
assert.equal(acceptedWithoutRecord.shouldStartRealtimeAfterCreate, true);

assert.equal(
  buildReceivedAlertArchiveSyncDecision({
    archivedSessionIds: new Set(["session-1"]),
    autoRealtimeSessionIds: noSessions,
    locallyAcceptedSessionIds: noSessions,
    session: emergencySession({ current_recipient_status: "accepted" })
  }).shouldCreateArchive,
  false
);

const endedWithRecord = buildReceivedAlertArchiveSyncDecision({
  archivedSessionIds: noSessions,
  autoRealtimeSessionIds: noSessions,
  existingRecord: archiveRecord(),
  locallyAcceptedSessionIds: noSessions,
  session: emergencySession({
    current_recipient_status: "ended",
    finished_at: "2026-05-22T10:05:00.000Z",
    phase: "ended",
    status: "ended"
  })
});

assert.equal(endedWithRecord.shouldEndArchive, true);
assert.equal(endedWithRecord.endedAt, "2026-05-22T10:05:00.000Z");

assert.equal(
  buildReceivedAlertArchiveSyncDecision({
    archivedSessionIds: noSessions,
    autoRealtimeSessionIds: noSessions,
    existingRecord: archiveRecord({ status: "ended" }),
    locallyAcceptedSessionIds: noSessions,
    session: emergencySession({ phase: "ended", status: "ended" })
  }).shouldEndArchive,
  false
);

assert.deepEqual(
  buildReceivedAlertArchiveStatusUpdateDecision({
    activeArchiveId: null,
    currentCallState: { ...idleLiveAudioCallState, role: "angel", status: "connected" },
    lastArchivedCallStatus: "connecting",
    now: "2026-05-22T10:01:00.000Z"
  }),
  {
    shouldClearActiveArchive: false,
    shouldClearAutoRealtimeSession: false,
    shouldUpdateArchive: false
  }
);

assert.equal(
  buildReceivedAlertArchiveStatusUpdateDecision({
    activeArchiveId: "archive-1",
    currentCallState: { ...idleLiveAudioCallState, role: "owner", status: "connected" },
    lastArchivedCallStatus: "connecting",
    now: "2026-05-22T10:01:00.000Z"
  }).shouldUpdateArchive,
  false
);

assert.deepEqual(
  buildReceivedAlertArchiveStatusUpdateDecision({
    activeArchiveId: "archive-1",
    currentCallState: { ...idleLiveAudioCallState, role: "angel", status: "connected" },
    lastArchivedCallStatus: "connecting",
    now: "2026-05-22T10:01:00.000Z"
  }),
  {
    archiveId: "archive-1",
    connectedAt: "2026-05-22T10:01:00.000Z",
    nextArchivedCallStatus: "connected",
    shouldClearActiveArchive: false,
    shouldClearAutoRealtimeSession: false,
    shouldUpdateArchive: true,
    status: "connected"
  }
);

assert.deepEqual(
  buildReceivedAlertArchiveStatusUpdateDecision({
    activeArchiveId: "archive-1",
    currentCallState: {
      ...idleLiveAudioCallState,
      remoteSessionId: "session-1",
      role: "angel",
      status: "failed"
    },
    lastArchivedCallStatus: "connecting",
    now: "2026-05-22T10:01:00.000Z"
  }),
  {
    archiveId: "archive-1",
    failedSessionId: "session-1",
    nextArchivedCallStatus: "failed",
    shouldClearActiveArchive: true,
    shouldClearAutoRealtimeSession: true,
    shouldUpdateArchive: true,
    status: "failed"
  }
);

assert.deepEqual(
  buildReceivedAlertArchiveStatusUpdateDecision({
    activeArchiveId: "archive-1",
    currentCallState: { ...idleLiveAudioCallState, role: "angel", status: "waiting" },
    lastArchivedCallStatus: "connecting",
    now: "2026-05-22T10:01:00.000Z"
  }),
  {
    nextArchivedCallStatus: "waiting",
    shouldClearActiveArchive: false,
    shouldClearAutoRealtimeSession: false,
    shouldUpdateArchive: false
  }
);

console.log("Received alert runtime policy test aprovado.");
