import assert from "node:assert/strict";

import {
  buildReceivedAlertActionState,
  buildReceivedAlertFailureDialog,
  buildReceivedAlertCardPresentation,
  buildReceivedAlertIncomingCallPresentation,
  buildReceivedAlertRefreshFailureStatus,
  buildReceivedAlertRefreshStatus,
  buildReceivedCallArchiveCardPresentation,
  receivedAlertErrorMessage,
  receivedAlertPhaseLabel,
  receivedAlertResponseActionLabel,
  receivedAlertStatusMessage,
  receivedCallArchiveStatusLabel,
  sortReceivedEmergencyAlerts
} from "../src/features/live-call/receivedAlertPresentationPolicy";
import {
  formatLiveCallDate,
  formatLiveCallDuration,
  type LiveCallArchiveRecord
} from "../src/features/live-call/liveCallHistoryPolicy";
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

const idleCallState = {
  message: "Chamada disponivel.",
  status: "idle" as const
};

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

const pendingActionState = buildReceivedAlertActionState({
  currentCallState: idleCallState,
  locallyAcceptedSessionIds: new Set(),
  session: queuedSession
});
assert.equal(pendingActionState.hasAccepted, false);
assert.equal(pendingActionState.primaryActionDisabled, false);
assert.equal(pendingActionState.seenActionDisabled, false);
assert.equal(pendingActionState.incomingCallDisabled, false);
assert.equal(pendingActionState.canShowCallPanel, false);

const acceptedActionState = buildReceivedAlertActionState({
  currentCallState: idleCallState,
  locallyAcceptedSessionIds: new Set(),
  session: acceptedSession
});
assert.equal(acceptedActionState.hasAccepted, true);
assert.equal(acceptedActionState.primaryActionDisabled, true);
assert.equal(acceptedActionState.seenActionDisabled, true);
assert.equal(acceptedActionState.liveCallPanelDisabled, false);

const locallyAcceptedIds = new Set(["session-1"]);
const locallyAcceptedActionState = buildReceivedAlertActionState({
  currentCallState: idleCallState,
  locallyAcceptedSessionIds: locallyAcceptedIds,
  session: queuedSession
});
assert.equal(locallyAcceptedActionState.hasAccepted, true);
assert.deepEqual([...locallyAcceptedIds], ["session-1"]);

const endedActionState = buildReceivedAlertActionState({
  currentCallState: idleCallState,
  locallyAcceptedSessionIds: new Set(),
  session: endedSession
});
assert.equal(endedActionState.primaryActionDisabled, true);
assert.equal(endedActionState.seenActionDisabled, true);
assert.equal(endedActionState.canShowCallPanel, false);

const otherCallActionState = buildReceivedAlertActionState({
  currentCallState: {
    message: "Em chamada.",
    remoteSessionId: "outra-sessao",
    status: "connected"
  },
  locallyAcceptedSessionIds: new Set(),
  session: queuedSession
});
assert.equal(otherCallActionState.hasActiveRealtimeSession, true);
assert.equal(otherCallActionState.hasOtherCallSession, true);
assert.equal(otherCallActionState.incomingCallDisabled, true);
assert.equal(otherCallActionState.liveCallPanelDisabled, true);

const sameCallActionState = buildReceivedAlertActionState({
  currentCallState: {
    message: "Em chamada.",
    remoteSessionId: "session-1",
    status: "connected"
  },
  locallyAcceptedSessionIds: new Set(["session-1"]),
  session: queuedSession
});
assert.equal(sameCallActionState.hasActiveRealtimeSession, true);
assert.equal(sameCallActionState.hasOtherCallSession, false);
assert.equal(sameCallActionState.canShowCallPanel, true);
assert.equal(sameCallActionState.liveCallPanelDisabled, false);

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

const archiveRecord: LiveCallArchiveRecord = {
  durationSeconds: 74,
  id: "archive-1",
  legal: {
    allowedTargets: ["autoridade", "usuario_protegido"],
    shareAllowed: true,
    shareRestriction: "Compartilhe somente com pessoa autorizada."
  },
  protectedDisplayName: "Maria Protegida",
  remoteSessionId: "session-1",
  role: "angel",
  snapshot: {
    capturedAt: "2026-05-22T10:00:00.000Z",
    label: "MP",
    mediaSummary: "Midia segue local.",
    recipientScope: "Anjo autorizado",
    subtitle: "Pedido recebido"
  },
  startedAt: "2026-05-22T10:00:00.000Z",
  status: "connected",
  updatedAt: "2026-05-22T10:01:14.000Z"
};

assert.deepEqual(buildReceivedCallArchiveCardPresentation(archiveRecord), {
  durationLabel: formatLiveCallDuration(archiveRecord.durationSeconds),
  protectedDisplayName: "Maria Protegida",
  shareRestriction: "Compartilhe somente com pessoa autorizada.",
  snapshotLabel: "MP",
  startedAtLabel: formatLiveCallDate(archiveRecord.startedAt),
  statusLabel: "ao vivo conectado"
});
assert.equal(buildReceivedCallArchiveCardPresentation({ ...archiveRecord, status: "ended" }).statusLabel, "finalizado");
assert.equal(
  buildReceivedCallArchiveCardPresentation({ ...archiveRecord, status: "failed" }).statusLabel,
  "chamada indisponível"
);

assert.equal(buildReceivedAlertRefreshStatus({ receivedAlertCount: 1 }), "Pedidos atualizados.");
assert.equal(buildReceivedAlertRefreshStatus({ receivedAlertCount: 0 }), "Nenhum pedido recebido agora.");
assert.equal(
  buildReceivedAlertRefreshStatus({ nextStatus: "Status manual.", receivedAlertCount: 0 }),
  "Status manual."
);
assert.equal(
  buildReceivedAlertRefreshFailureStatus({
    activeLiveCall: true,
    error: new Error("sem rede")
  }),
  "Você está atendendo como anjo."
);
assert.equal(
  buildReceivedAlertRefreshFailureStatus({
    activeLiveCall: false,
    error: new Error("sem rede")
  }),
  "sem rede"
);
assert.equal(receivedAlertResponseActionLabel("accept"), "aceito");
assert.equal(receivedAlertResponseActionLabel("decline"), "recusado");
assert.equal(receivedAlertResponseActionLabel("seen"), "visualizado");
assert.equal(receivedAlertStatusMessage("attending"), "Você está atendendo como anjo.");
assert.equal(receivedAlertStatusMessage("entering-call"), "Você é o anjo. Entrando na chamada.");
assert.equal(receivedAlertStatusMessage("waiting-call"), "Você é o anjo. Aguardando chamada.");
assert.equal(receivedAlertStatusMessage("left-call"), "Você saiu da chamada. O pedido continua na tela ate o fim.");
assert.equal(receivedAlertErrorMessage(new Error("falhou"), "fallback"), "falhou");
assert.equal(receivedAlertErrorMessage("falhou", "fallback"), "fallback");

assert.deepEqual(
  buildReceivedAlertFailureDialog({
    error: new Error("Sem conexão."),
    kind: "request"
  }),
  {
    actions: [{ label: "Entendi" }],
    message: "Sem conexão.",
    title: "Pedido não atualizado"
  }
);

assert.deepEqual(
  buildReceivedAlertFailureDialog({
    error: "erro",
    kind: "archive"
  }),
  {
    actions: [{ label: "Entendi" }],
    message: "Não foi possível salvar o registro local agora.",
    title: "Chamada não registrada"
  }
);

assert.deepEqual(
  buildReceivedAlertFailureDialog({
    error: "erro",
    kind: "realtime"
  }),
  {
    actions: [{ label: "Entendi" }],
    message: "Não foi possível abrir a videochamada agora. O registro local permanece salvo.",
    title: "Tempo real indisponível"
  }
);

console.log("Received alert presentation policy test aprovado.");
