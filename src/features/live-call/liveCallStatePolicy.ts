import type { MediaStream } from "react-native-webrtc";

import type { LiveAudioRole, LiveAudioStatus } from "./liveCallSessionPolicy";

export type LiveAudioCallState = {
  callSessionId?: string;
  localStreamUrl?: string | null;
  message: string;
  participantName?: string;
  remoteSessionId?: string;
  remoteStream?: MediaStream;
  remoteStreamUrl?: string;
  role?: LiveAudioRole;
  status: LiveAudioStatus;
};

export const idleLiveAudioCallState: LiveAudioCallState = {
  message: "Chamada com anjo disponivel apos aceite.",
  status: "idle"
};

export function isLiveAudioActive(current: LiveAudioCallState) {
  return (
    current.status === "waiting" ||
    current.status === "connecting" ||
    current.status === "connected" ||
    Boolean(current.remoteStream)
  );
}

export function liveConnectedMessage(role?: LiveAudioRole, participantName?: string) {
  if (role === "owner") return "Transmitindo seu SOS para o anjo.";
  if (participantName) return `Você está acompanhando ${participantName}.`;
  return "Você está acompanhando como anjo.";
}

export function liveAudioConnectedState(current: LiveAudioCallState): LiveAudioCallState {
  return {
    ...current,
    message: liveConnectedMessage(current.role, current.participantName),
    status: "connected"
  };
}

export function liveAudioConnectingState(current: LiveAudioCallState): LiveAudioCallState {
  return {
    ...current,
    status: current.status === "connected" || current.status === "reconnecting" ? current.status : "connecting"
  };
}

export function liveAudioReconnectingState(current: LiveAudioCallState): LiveAudioCallState {
  if (current.status === "ended" || current.status === "idle" || current.status === "failed") return current;
  return {
    ...current,
    message: "Tentando restabelecer a chamada. O pedido continua ativo.",
    status: "reconnecting"
  };
}

export function liveAudioFailedState(current: LiveAudioCallState): LiveAudioCallState {
  return {
    ...current,
    message: "Chamada não entrou. O pedido continua ativo.",
    status: "failed"
  };
}

export function liveAudioPollingFailureState(current: LiveAudioCallState): LiveAudioCallState {
  return {
    ...current,
    message: current.status === "connected" ? current.message : "Nao foi possivel atualizar a videochamada agora.",
    status: current.status === "connected" ? "connected" : "failed"
  };
}

export function liveAudioRemoteStreamState(
  current: LiveAudioCallState,
  input: {
    remoteStream: MediaStream;
    remoteStreamUrl?: string;
    renderRemoteStream: boolean;
    role?: LiveAudioRole;
  }
): LiveAudioCallState {
  return {
    ...current,
    message: liveConnectedMessage(input.role, current.participantName),
    remoteStream: input.renderRemoteStream ? input.remoteStream : current.remoteStream,
    remoteStreamUrl: input.renderRemoteStream ? input.remoteStreamUrl : current.remoteStreamUrl,
    status: "connected"
  };
}

export function liveAudioOwnerAnswerAcceptedState(current: LiveAudioCallState): LiveAudioCallState {
  return {
    ...current,
    message:
      current.status === "connected" || current.remoteStream
        ? "Anjo na chamada. Seu SOS continua ativo."
        : current.participantName
          ? `${current.participantName} entrou. Conectando chamada.`
          : "Anjo entrou. Conectando chamada.",
    status: current.status === "connected" || current.remoteStream ? "connected" : "connecting"
  };
}

export function liveAudioAngelAnswerSentState(
  current: LiveAudioCallState,
  input: {
    participantName?: string | null;
    remoteSessionId: string;
  }
): LiveAudioCallState {
  const participantName = input.participantName ?? undefined;
  return {
    ...current,
    message:
      current.remoteStream || current.remoteStreamUrl
        ? `Você está acompanhando ${input.participantName ?? "pessoa protegida"}.`
        : `Entrando como anjo de ${input.participantName ?? "pessoa protegida"}.`,
    participantName,
    remoteSessionId: input.remoteSessionId,
    role: "angel",
    status: current.remoteStream || current.remoteStreamUrl ? "connected" : "connecting"
  };
}
