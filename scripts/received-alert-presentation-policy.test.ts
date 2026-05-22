import assert from "node:assert/strict";

import {
  buildReceivedAlertCardPresentation,
  buildReceivedAlertIncomingCallPresentation,
  receivedAlertPhaseLabel,
  receivedCallArchiveStatusLabel,
  sortReceivedEmergencyAlerts
} from "../src/features/live-call/receivedAlertPresentationPolicy";
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

const queuedSession = emergencySession();
const acceptedSession = emergencySession({ current_recipient_status: "accepted" });
const seenSession = emergencySession({ current_recipient_status: "seen" });
const declinedSession = emergencySession({ current_recipient_status: "declined" });
const endedSession = emergencySession({
  current_recipient_status: "ended",
  finished_at: "2026-05-22T10:04:00.000Z",
  phase: "ended",
  status: "ended"
});

assert.equal(receivedAlertPhaseLabel(queuedSession), "Pedido de ajuda");
assert.equal(receivedAlertPhaseLabel(acceptedSession, "accepted"), "Você está atendendo como anjo");
assert.equal(receivedAlertPhaseLabel(queuedSession, undefined, true), "Você está atendendo como anjo");
assert.equal(receivedAlertPhaseLabel(seenSession, "seen"), "Visualizado");
assert.equal(receivedAlertPhaseLabel(declinedSession, "declined"), "Você recusou");
assert.equal(receivedAlertPhaseLabel(endedSession, "ended"), "Encerrado");
assert.equal(receivedAlertPhaseLabel(emergencySession({ phase: "accepted" })), "Atendimento em andamento");

assert.deepEqual(
  sortReceivedEmergencyAlerts([
    emergencySession({ id: "old-active", started_at: "2026-05-22T10:00:00.000Z" }),
    emergencySession({ id: "ended-newer", phase: "ended", started_at: "2026-05-22T10:05:00.000Z", status: "ended" }),
    emergencySession({ id: "new-active", started_at: "2026-05-22T10:03:00.000Z" })
  ]).map((session) => session.id),
  ["new-active", "old-active", "ended-newer"]
);

assert.deepEqual(
  buildReceivedAlertCardPresentation({
    hasAccepted: false,
    recipientStatus: "queued",
    session: queuedSession
  }),
  {
    body: "Toque em Atender para entrar como anjo. Você só fala quando entrar.",
    canEnterCall: false,
    canReceiveCall: true,
    isActive: true,
    primaryActionLabel: "Atender agora",
    statusLabel: "Pedido de ajuda",
    title: "Você é anjo de Maria Protegida"
  }
);

assert.deepEqual(
  buildReceivedAlertCardPresentation({
    hasAccepted: true,
    recipientStatus: "accepted",
    session: acceptedSession
  }),
  {
    body: "Você já está atendendo. Acompanhe enquanto o pedido estiver ativo.",
    canEnterCall: true,
    canReceiveCall: true,
    isActive: true,
    primaryActionLabel: "Atendendo",
    statusLabel: "Você está atendendo como anjo",
    title: "Você é anjo de Maria Protegida"
  }
);

assert.equal(
  buildReceivedAlertCardPresentation({
    hasAccepted: false,
    recipientStatus: "declined",
    session: declinedSession
  }).canReceiveCall,
  false
);

assert.deepEqual(
  buildReceivedAlertCardPresentation({
    hasAccepted: false,
    recipientStatus: "ended",
    session: endedSession
  }),
  {
    body: "Este pedido foi encerrado. O registro fica apenas para consulta.",
    canEnterCall: false,
    canReceiveCall: false,
    isActive: false,
    primaryActionLabel: "Encerrado",
    statusLabel: "Encerrado",
    title: "Você é anjo de Maria Protegida"
  }
);

assert.deepEqual(
  buildReceivedAlertIncomingCallPresentation({
    hasAccepted: false,
    session: emergencySession({ owner_display_name: undefined })
  }),
  {
    actionAccessibilityLabel: "Atender como anjo",
    actionLabel: "Atender como anjo",
    text: "Pessoa protegida pediu ajuda.",
    title: "Atender como anjo"
  }
);

assert.deepEqual(
  buildReceivedAlertIncomingCallPresentation({
    hasAccepted: true,
    session: acceptedSession
  }),
  {
    actionAccessibilityLabel: "Entrar na chamada",
    actionLabel: "Entrar na chamada",
    text: "Entre na chamada se puder acompanhar agora.",
    title: "Você é o anjo"
  }
);

assert.equal(receivedCallArchiveStatusLabel("connected"), "ao vivo conectado");
assert.equal(receivedCallArchiveStatusLabel("ended"), "finalizado");
assert.equal(receivedCallArchiveStatusLabel("failed"), "chamada indisponível");
assert.equal(receivedCallArchiveStatusLabel("recording"), "registro ativo");

console.log("Received alert presentation policy test aprovado.");
