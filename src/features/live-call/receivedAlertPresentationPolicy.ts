import type { ApiEmergencySession } from "@/services/apiClient";
import { currentEmergencyRecipientStatus } from "@/features/live-call/liveCallRolePolicy";
import { isReceivedAlertLiveCallStatusActive } from "@/features/live-call/receivedAlertRuntimePolicy";
import {
  formatLiveCallDate,
  formatLiveCallDuration,
  type LiveCallArchiveRecord
} from "@/features/live-call/liveCallHistoryPolicy";
import type { LiveAudioCallState } from "@/features/live-call/liveCallStatePolicy";

export type ReceivedAlertCardPresentation = {
  body: string;
  canEnterCall: boolean;
  canReceiveCall: boolean;
  isActive: boolean;
  primaryActionLabel: string;
  statusLabel: string;
  title: string;
};

export type ReceivedAlertIncomingCallPresentation = {
  actionAccessibilityLabel: string;
  actionLabel: string;
  text: string;
  title: string;
};

export type ReceivedAlertActionState = {
  canShowCallPanel: boolean;
  hasAccepted: boolean;
  hasActiveRealtimeSession: boolean;
  hasOtherCallSession: boolean;
  incomingCallDisabled: boolean;
  isCallPanelSession: boolean;
  liveCallPanelDisabled: boolean;
  primaryActionDisabled: boolean;
  recipientStatus?: string;
  seenActionDisabled: boolean;
};

export type ReceivedCallArchiveCardPresentation = {
  durationLabel: string;
  protectedDisplayName: string;
  shareRestriction: string;
  snapshotLabel: string;
  startedAtLabel: string;
  statusLabel: string;
};

export type ReceivedAlertResponseAction = "accept" | "decline" | "seen";
export type ReceivedAlertFailureDialogKind = "archive" | "realtime" | "request";

export type ReceivedAlertFailureDialog = {
  actions: {
    label: string;
  }[];
  message: string;
  title: string;
};

export type ReceivedAlertStatusKind = "attending" | "entering-call" | "left-call" | "waiting-call";

export function formatReceivedAlertDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit"
  }).format(new Date(value));
}

export function receivedAlertPhaseLabel(
  session: ApiEmergencySession,
  recipientStatus?: string,
  acceptedByCurrentUser = false
) {
  if (recipientStatus === "ended") return "Encerrado";
  if (session.phase === "ended" || session.status !== "active") return "Encerrado";
  if (acceptedByCurrentUser) return "Você está atendendo como anjo";
  if (recipientStatus === "accepted") return "Você está atendendo como anjo";
  if (recipientStatus === "declined") return "Você recusou";
  if (recipientStatus === "seen") return "Visualizado";
  if (session.phase === "accepted") return "Atendimento em andamento";
  return "Pedido de ajuda";
}

export function sortReceivedEmergencyAlerts(alerts: ApiEmergencySession[]) {
  return [...alerts].sort((left, right) => {
    const leftActive = left.status === "active" && left.phase !== "ended";
    const rightActive = right.status === "active" && right.phase !== "ended";
    if (leftActive !== rightActive) return leftActive ? -1 : 1;
    return new Date(right.started_at).getTime() - new Date(left.started_at).getTime();
  });
}

export function buildReceivedAlertRefreshStatus({
  nextStatus,
  receivedAlertCount
}: {
  nextStatus?: string;
  receivedAlertCount: number;
}) {
  return nextStatus ?? (receivedAlertCount ? "Pedidos atualizados." : "Nenhum pedido recebido agora.");
}

export function buildReceivedAlertRefreshFailureStatus({
  activeLiveCall,
  error
}: {
  activeLiveCall: boolean;
  error: unknown;
}) {
  if (activeLiveCall) return receivedAlertStatusMessage("attending");
  return receivedAlertErrorMessage(error, "Não foi possível atualizar os pedidos.");
}

export function receivedAlertResponseActionLabel(action: ReceivedAlertResponseAction) {
  if (action === "accept") return "aceito";
  if (action === "decline") return "recusado";
  return "visualizado";
}

export function receivedAlertStatusMessage(kind: ReceivedAlertStatusKind) {
  switch (kind) {
    case "attending":
      return "Você está atendendo como anjo.";
    case "entering-call":
      return "Você é o anjo. Entrando na chamada.";
    case "left-call":
      return "Você saiu da chamada. O pedido continua na tela ate o fim.";
    case "waiting-call":
      return "Você é o anjo. Aguardando chamada.";
  }
}

export function buildReceivedAlertFailureDialog({
  error,
  kind
}: {
  error: unknown;
  kind: ReceivedAlertFailureDialogKind;
}): ReceivedAlertFailureDialog {
  const fallbackByKind: Record<ReceivedAlertFailureDialogKind, { message: string; title: string }> = {
    archive: {
      message: "Não foi possível salvar o registro local agora.",
      title: "Chamada não registrada"
    },
    realtime: {
      message: "Não foi possível abrir a videochamada agora. O registro local permanece salvo.",
      title: "Tempo real indisponível"
    },
    request: {
      message: "Tente novamente quando houver conexão.",
      title: "Pedido não atualizado"
    }
  };
  const feedback = fallbackByKind[kind];

  return {
    actions: [{ label: "Entendi" }],
    message: receivedAlertErrorMessage(error, feedback.message),
    title: feedback.title
  };
}

export function buildReceivedAlertCardPresentation({
  hasAccepted,
  recipientStatus,
  session
}: {
  hasAccepted: boolean;
  recipientStatus?: string;
  session: ApiEmergencySession;
}): ReceivedAlertCardPresentation {
  const isActive = session.status === "active" && session.phase !== "ended";

  return {
    body: buildReceivedAlertBody({ hasAccepted, isActive }),
    canEnterCall: isActive && hasAccepted,
    canReceiveCall: isActive && recipientStatus !== "declined",
    isActive,
    primaryActionLabel: !isActive ? "Encerrado" : hasAccepted ? "Atendendo" : "Atender agora",
    statusLabel: receivedAlertPhaseLabel(session, recipientStatus, hasAccepted),
    title: `Você é anjo de ${protectedDisplayName(session)}`
  };
}

export function buildReceivedAlertActionState({
  currentCallState,
  locallyAcceptedSessionIds,
  session
}: {
  currentCallState: LiveAudioCallState;
  locallyAcceptedSessionIds: ReadonlySet<string>;
  session: ApiEmergencySession;
}): ReceivedAlertActionState {
  const recipientStatus = currentEmergencyRecipientStatus(session);
  const hasAccepted = recipientStatus === "accepted" || locallyAcceptedSessionIds.has(session.id);
  const isActive = session.status === "active" && session.phase !== "ended";
  const isCallPanelSession = currentCallState.remoteSessionId === session.id;
  const hasActiveRealtimeSession =
    Boolean(currentCallState.remoteSessionId) &&
    isReceivedAlertLiveCallStatusActive(currentCallState.status);
  const hasOtherCallSession = hasActiveRealtimeSession && !isCallPanelSession;
  const canShowCallPanel = isActive && isCallPanelSession;

  return {
    canShowCallPanel,
    hasAccepted,
    hasActiveRealtimeSession,
    hasOtherCallSession,
    incomingCallDisabled: hasOtherCallSession,
    isCallPanelSession,
    liveCallPanelDisabled: hasOtherCallSession || !hasAccepted || !isActive,
    primaryActionDisabled: !isActive || hasAccepted,
    recipientStatus,
    seenActionDisabled: !isActive || hasAccepted
  };
}

export function buildReceivedAlertIncomingCallPresentation({
  hasAccepted,
  session
}: {
  hasAccepted: boolean;
  session: ApiEmergencySession;
}): ReceivedAlertIncomingCallPresentation {
  return {
    actionAccessibilityLabel: hasAccepted ? "Entrar na chamada" : "Atender como anjo",
    actionLabel: hasAccepted ? "Entrar na chamada" : "Atender como anjo",
    text: hasAccepted ? "Entre na chamada se puder acompanhar agora." : `${protectedDisplayName(session, "Pessoa protegida")} pediu ajuda.`,
    title: hasAccepted ? "Você é o anjo" : "Atender como anjo"
  };
}

export function receivedCallArchiveStatusLabel(status: LiveCallArchiveRecord["status"]) {
  if (status === "connected") return "ao vivo conectado";
  if (status === "ended") return "finalizado";
  if (status === "failed") return "chamada indisponível";
  return "registro ativo";
}

export function buildReceivedCallArchiveCardPresentation(
  record: LiveCallArchiveRecord
): ReceivedCallArchiveCardPresentation {
  return {
    durationLabel: formatLiveCallDuration(record.durationSeconds),
    protectedDisplayName: record.protectedDisplayName,
    shareRestriction: record.legal.shareRestriction,
    snapshotLabel: record.snapshot.label,
    startedAtLabel: formatLiveCallDate(record.startedAt),
    statusLabel: receivedCallArchiveStatusLabel(record.status)
  };
}

export function receivedAlertErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function buildReceivedAlertBody({ hasAccepted, isActive }: { hasAccepted: boolean; isActive: boolean }) {
  if (!isActive) return "Este pedido foi encerrado. O registro fica apenas para consulta.";
  if (hasAccepted) return "Você já está atendendo. Acompanhe enquanto o pedido estiver ativo.";
  return "Toque em Atender para entrar como anjo. Você só fala quando entrar.";
}

function protectedDisplayName(session: ApiEmergencySession, fallback = "pessoa protegida") {
  return session.owner_display_name ?? fallback;
}
