import type { LiveAuditMarkerEvent, RecordLiveAuditMarkerInput } from "@/services/apiClient";
import type { LiveIcePayload, LiveSdpPayload, LiveSignalPayload, LiveSignalRole } from "@/services/liveCallControl";

export type LiveAudioRole = LiveSignalRole;
export type LiveAudioStatus = "connected" | "connecting" | "ended" | "failed" | "idle" | "reconnecting" | "waiting";
export type LiveAuditEventKind = "connected" | "ended" | "failed" | "reconnect_failed" | "reconnected" | "reconnecting";

const auditEventByKindAndRole: Record<LiveAuditEventKind, Record<LiveAudioRole, LiveAuditMarkerEvent>> = {
  connected: {
    angel: "angel_live_connected",
    owner: "owner_live_connected"
  },
  ended: {
    angel: "angel_live_ended",
    owner: "owner_live_ended"
  },
  failed: {
    angel: "angel_live_failed",
    owner: "owner_live_failed"
  },
  reconnect_failed: {
    angel: "angel_live_reconnect_failed",
    owner: "owner_live_reconnect_failed"
  },
  reconnected: {
    angel: "angel_live_reconnected",
    owner: "owner_live_reconnected"
  },
  reconnecting: {
    angel: "angel_live_reconnecting",
    owner: "owner_live_reconnecting"
  }
};

export function isSdpPayload(payload: LiveSignalPayload): payload is LiveSdpPayload {
  return "sdp" in payload && typeof payload.sdp === "string" && Boolean(payload.sdp.trim());
}

export function isIcePayload(payload: LiveSignalPayload): payload is LiveIcePayload {
  return "candidate" in payload && typeof payload.candidate === "string" && Boolean(payload.candidate.trim());
}

export function liveAuditEvent(kind: LiveAuditEventKind, role: LiveAudioRole): LiveAuditMarkerEvent {
  return auditEventByKindAndRole[kind][role];
}

export function liveEvidenceStatusForRole(
  role: LiveAudioRole
): NonNullable<RecordLiveAuditMarkerInput["localEvidenceStatus"]> {
  return role === "owner" ? "metadata_only" : "not_applicable";
}

export function oppositeLiveSignalRole(role: LiveAudioRole): LiveAudioRole {
  return role === "owner" ? "angel" : "owner";
}

export function shouldRenderRemoteStream(role?: LiveAudioRole) {
  return role === "angel";
}
