import type { ApiEmergencySession } from "@/services/apiClient";
import type { LiveCallArchiveRecord } from "@/features/live-call/liveCallHistoryPolicy";

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

function buildReceivedAlertBody({ hasAccepted, isActive }: { hasAccepted: boolean; isActive: boolean }) {
  if (!isActive) return "Este pedido foi encerrado. O registro fica apenas para consulta.";
  if (hasAccepted) return "Você já está atendendo. Acompanhe enquanto o pedido estiver ativo.";
  return "Toque em Atender para entrar como anjo. Você só fala quando entrar.";
}

function protectedDisplayName(session: ApiEmergencySession, fallback = "pessoa protegida") {
  return session.owner_display_name ?? fallback;
}
