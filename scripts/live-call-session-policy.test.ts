import assert from "node:assert/strict";

import {
  isIcePayload,
  isSdpPayload,
  liveAuditEvent,
  liveEvidenceStatusForRole,
  oppositeLiveSignalRole,
  shouldRenderRemoteStream
} from "../src/features/live-call/liveCallSessionPolicy";
import type { LiveSignalPayload } from "../src/services/liveCallControl";

const ownerOffer: LiveSignalPayload = {
  callSessionId: "call-1",
  recipientDeviceId: "angel-device",
  recipientRole: "angel",
  sdp: "v=0\r\nm=video 9 UDP/TLS/RTP/SAVPF 96",
  senderDeviceId: "owner-device",
  senderRole: "owner"
};

const angelIce: LiveSignalPayload = {
  callSessionId: "call-1",
  candidate: "candidate:1 1 udp 2122260223 192.0.2.10 54400 typ host",
  recipientDeviceId: "owner-device",
  recipientRole: "owner",
  senderDeviceId: "angel-device",
  senderRole: "angel"
};

assert.equal(isSdpPayload(ownerOffer), true);
assert.equal(isIcePayload(ownerOffer), false);
assert.equal(isIcePayload(angelIce), true);
assert.equal(isSdpPayload(angelIce), false);

assert.equal(liveAuditEvent("connected", "owner"), "owner_live_connected");
assert.equal(liveAuditEvent("connected", "angel"), "angel_live_connected");
assert.equal(liveAuditEvent("reconnecting", "owner"), "owner_live_reconnecting");
assert.equal(liveAuditEvent("reconnecting", "angel"), "angel_live_reconnecting");
assert.equal(liveAuditEvent("reconnected", "owner"), "owner_live_reconnected");
assert.equal(liveAuditEvent("reconnected", "angel"), "angel_live_reconnected");
assert.equal(liveAuditEvent("reconnect_failed", "owner"), "owner_live_reconnect_failed");
assert.equal(liveAuditEvent("reconnect_failed", "angel"), "angel_live_reconnect_failed");
assert.equal(liveAuditEvent("failed", "owner"), "owner_live_failed");
assert.equal(liveAuditEvent("failed", "angel"), "angel_live_failed");
assert.equal(liveAuditEvent("ended", "owner"), "owner_live_ended");
assert.equal(liveAuditEvent("ended", "angel"), "angel_live_ended");

assert.equal(liveEvidenceStatusForRole("owner"), "metadata_only");
assert.equal(liveEvidenceStatusForRole("angel"), "not_applicable");
assert.equal(oppositeLiveSignalRole("owner"), "angel");
assert.equal(oppositeLiveSignalRole("angel"), "owner");
assert.equal(shouldRenderRemoteStream("owner"), false);
assert.equal(shouldRenderRemoteStream("angel"), true);

console.log("Live call session policy test aprovado.");
