import type { ApiEmergencySession } from "@/services/apiClient";
import type { LiveCallArchiveRecord } from "@/features/live-call/liveCallHistoryPolicy";
import type { LiveAudioCallState } from "@/features/live-call/liveCallStatePolicy";
import { currentEmergencyRecipientStatus } from "@/features/live-call/liveCallRolePolicy";

export type ReceivedAlertRealtimeStartDecision = {
  canStart: boolean;
  otherSessionActive: boolean;
  sameSessionActive: boolean;
};

export type ReceivedAlertArchiveSyncDecision = {
  endedAt?: string;
  hasAccepted: boolean;
  isActive: boolean;
  recipientStatus?: string | null;
  shouldCreateArchive: boolean;
  shouldEndArchive: boolean;
  shouldStartRealtimeAfterCreate: boolean;
  shouldStartRealtimeForExistingRecord: boolean;
};

export type ReceivedAlertArchiveStatusUpdateDecision = {
  archiveId?: string;
  connectedAt?: string;
  failedSessionId?: string;
  nextArchivedCallStatus?: string;
  shouldClearActiveArchive: boolean;
  shouldClearAutoRealtimeSession: boolean;
  shouldUpdateArchive: boolean;
  status?: LiveCallArchiveRecord["status"];
};

export function isReceivedAlertLiveCallStatusActive(status: LiveAudioCallState["status"]) {
  return status === "waiting" || status === "connecting" || status === "connected";
}

export function buildReceivedAlertRealtimeStartDecision({
  currentCallState,
  sessionId
}: {
  currentCallState: LiveAudioCallState;
  sessionId: string;
}): ReceivedAlertRealtimeStartDecision {
  const sameSessionActive =
    currentCallState.remoteSessionId === sessionId &&
    isReceivedAlertLiveCallStatusActive(currentCallState.status);
  const otherSessionActive =
    Boolean(currentCallState.remoteSessionId) &&
    currentCallState.remoteSessionId !== sessionId &&
    currentCallState.status !== "ended" &&
    currentCallState.status !== "failed";

  return {
    canStart: !sameSessionActive && !otherSessionActive,
    otherSessionActive,
    sameSessionActive
  };
}

export function buildReceivedAlertArchiveSyncDecision({
  archivedSessionIds,
  autoRealtimeSessionIds,
  existingRecord,
  locallyAcceptedSessionIds,
  session
}: {
  archivedSessionIds: ReadonlySet<string>;
  autoRealtimeSessionIds: ReadonlySet<string>;
  existingRecord?: LiveCallArchiveRecord;
  locallyAcceptedSessionIds: ReadonlySet<string>;
  session: ApiEmergencySession;
}): ReceivedAlertArchiveSyncDecision {
  const recipientStatus = currentEmergencyRecipientStatus(session);
  const hasAccepted = recipientStatus === "accepted" || locallyAcceptedSessionIds.has(session.id);
  const isActive = session.status === "active" && session.phase !== "ended";
  const autoRealtimeInProgress = autoRealtimeSessionIds.has(session.id);
  const shouldCreateArchive =
    hasAccepted &&
    isActive &&
    !existingRecord &&
    !archivedSessionIds.has(session.id);
  const shouldEndArchive = Boolean(existingRecord && !isActive && existingRecord.status !== "ended");

  return {
    endedAt: shouldEndArchive ? session.finished_at ?? session.updated_at ?? undefined : undefined,
    hasAccepted,
    isActive,
    recipientStatus,
    shouldCreateArchive,
    shouldEndArchive,
    shouldStartRealtimeAfterCreate: shouldCreateArchive && !autoRealtimeInProgress,
    shouldStartRealtimeForExistingRecord: hasAccepted && isActive && Boolean(existingRecord) && !autoRealtimeInProgress
  };
}

export function buildReceivedAlertArchiveStatusUpdateDecision({
  activeArchiveId,
  currentCallState,
  lastArchivedCallStatus,
  now
}: {
  activeArchiveId?: string | null;
  currentCallState: LiveAudioCallState;
  lastArchivedCallStatus?: string | null;
  now: string;
}): ReceivedAlertArchiveStatusUpdateDecision {
  const emptyDecision: ReceivedAlertArchiveStatusUpdateDecision = {
    shouldClearActiveArchive: false,
    shouldClearAutoRealtimeSession: false,
    shouldUpdateArchive: false
  };

  if (!activeArchiveId || currentCallState.role !== "angel") return emptyDecision;
  if (lastArchivedCallStatus === currentCallState.status) return emptyDecision;

  if (currentCallState.status === "connected") {
    return {
      archiveId: activeArchiveId,
      connectedAt: now,
      nextArchivedCallStatus: currentCallState.status,
      shouldClearActiveArchive: false,
      shouldClearAutoRealtimeSession: false,
      shouldUpdateArchive: true,
      status: "connected"
    };
  }

  if (currentCallState.status === "failed") {
    return {
      archiveId: activeArchiveId,
      failedSessionId: currentCallState.remoteSessionId,
      nextArchivedCallStatus: currentCallState.status,
      shouldClearActiveArchive: true,
      shouldClearAutoRealtimeSession: Boolean(currentCallState.remoteSessionId),
      shouldUpdateArchive: true,
      status: "failed"
    };
  }

  return {
    ...emptyDecision,
    nextArchivedCallStatus: currentCallState.status
  };
}
