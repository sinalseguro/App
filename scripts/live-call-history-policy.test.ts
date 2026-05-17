import assert from "node:assert/strict";

import {
  buildLiveCallShareText,
  buildReceivedCallArchive,
  formatLiveCallDuration,
  updateLiveCallArchive
} from "../src/features/live-call/liveCallHistoryPolicy";
import {
  buildOwnerLiveCallEvidence,
  updateOwnerLiveCallEvidence
} from "../src/features/live-call/liveCallOperationalEvidencePolicy";

const baseRecord = buildReceivedCallArchive(
  {
    id: "occurrence-123",
    ownerDisplayName: "Maria Protegida",
    protectedSubjectId: "protected-1",
    startedAt: "2026-05-16T10:00:00.000Z"
  },
  { now: "2026-05-16T10:01:00.000Z" }
);

assert.equal(baseRecord.id, "received-live-call-occurrence-123");
assert.equal(baseRecord.remoteSessionId, "occurrence-123");
assert.equal(baseRecord.protectedDisplayName, "Maria Protegida");
assert.equal(baseRecord.status, "recording");
assert.equal(baseRecord.startedAt, "2026-05-16T10:01:00.000Z");
assert.deepEqual(baseRecord.legal.allowedTargets, ["autoridade", "usuario_protegido"]);
assert.equal(baseRecord.legal.shareAllowed, true);
assert.match(baseRecord.legal.shareRestriction, /autoridade competente/);
assert.match(baseRecord.snapshot.mediaSummary, /backend nao recebe audio\/video/);

const connectedRecord = updateLiveCallArchive(baseRecord, {
  connectedAt: "2026-05-16T10:02:00.000Z",
  now: "2026-05-16T10:02:00.000Z",
  status: "connected"
});

assert.equal(connectedRecord.status, "connected");
assert.equal(connectedRecord.durationSeconds, 60);

const endedRecord = updateLiveCallArchive(connectedRecord, {
  endedAt: "2026-05-16T10:06:40.000Z",
  now: "2026-05-16T10:06:40.000Z",
  status: "ended"
});

assert.equal(endedRecord.status, "ended");
assert.equal(endedRecord.durationSeconds, 340);
assert.equal(formatLiveCallDuration(endedRecord.durationSeconds), "5min 40s");

const shareText = buildLiveCallShareText(endedRecord);
assert.match(shareText, /Registro SinalSeguro de chamada recebida/);
assert.match(shareText, /Pessoa protegida: Maria Protegida/);
assert.match(shareText, /Ocorrencia: occurrence-123/);
assert.match(shareText, /Compartilhe somente/);

const ownerEvidence = buildOwnerLiveCallEvidence(
  {
    packageId: "package-123",
    remoteSessionId: "occurrence-456",
    startedAt: "2026-05-16T10:00:00.000Z"
  },
  { now: "2026-05-16T10:00:00.000Z" }
);

assert.equal(ownerEvidence.id, "owner-live-call-occurrence-456");
assert.equal(ownerEvidence.role, "owner");
assert.equal(ownerEvidence.localEvidenceStatus, "recording");
assert.match(ownerEvidence.snapshot.backendSummary, /sem audio\/video bruto/);

const transmittingEvidence = updateOwnerLiveCallEvidence(ownerEvidence, {
  connectedAt: "2026-05-16T10:01:00.000Z",
  localEvidenceStatus: "metadata_only",
  now: "2026-05-16T10:01:00.000Z",
  status: "transmitting"
});

assert.equal(transmittingEvidence.status, "transmitting");
assert.equal(transmittingEvidence.durationSeconds, 60);

const closedEvidence = updateOwnerLiveCallEvidence(transmittingEvidence, {
  endedAt: "2026-05-16T10:03:30.000Z",
  localEvidenceStatus: "protected",
  now: "2026-05-16T10:03:30.000Z",
  status: "protected"
});

assert.equal(closedEvidence.status, "protected");
assert.equal(closedEvidence.localEvidenceStatus, "protected");
assert.equal(closedEvidence.durationSeconds, 210);

console.log("Live call history policy test aprovado.");
