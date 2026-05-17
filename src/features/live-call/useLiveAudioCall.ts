import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaStream } from "react-native-webrtc";

import {
  consumeLiveSignal,
  createLiveCallSessionId,
  createLiveSessionEnvelope,
  firstLiveRecipientDevice,
  listAcceptedLiveRecipients,
  listPendingLiveSignalsForSession,
  sendLiveSignal,
  type LiveIcePayload,
  type LiveSdpPayload,
  type LiveSignalPayload
} from "@/services/liveCallControl";
import { LiveWebRtcSession } from "@/services/liveWebRtcSession";
import type { ApiEmergencySession } from "@/services/apiClient";
import { deviceBindingService } from "@/services/deviceBinding";
import {
  canAngelStartRealtime,
  canOwnerStartLiveCallWithRecipient
} from "@/features/live-call/liveCallRolePolicy";

type LiveAudioRole = "angel" | "owner";
type LiveAudioStatus = "connected" | "connecting" | "ended" | "failed" | "idle" | "waiting";

export type LiveAudioCallState = {
  message: string;
  participantName?: string;
  remoteSessionId?: string;
  remoteStream?: MediaStream;
  remoteStreamUrl?: string;
  role?: LiveAudioRole;
  status: LiveAudioStatus;
};

type LiveAudioRuntime = {
  answerAccepted?: boolean;
  callSessionId?: string;
  localDeviceId?: string;
  participantName?: string;
  recipientId?: string;
  remoteDeviceId?: string;
  remoteSessionId?: string;
  role?: LiveAudioRole;
};

const idleLiveAudioCallState: LiveAudioCallState = {
  message: "Chamada com anjo disponivel apos aceite.",
  status: "idle"
};

const signalPollingMs = 2500;

function streamUrlFrom(remoteStream: MediaStream) {
  return remoteStream.toURL?.();
}

function isSdpPayload(payload: LiveSignalPayload): payload is LiveSdpPayload {
  return "sdp" in payload && typeof payload.sdp === "string" && Boolean(payload.sdp.trim());
}

function isIcePayload(payload: LiveSignalPayload): payload is LiveIcePayload {
  return "candidate" in payload && typeof payload.candidate === "string" && Boolean(payload.candidate.trim());
}

export function useLiveAudioCall() {
  const [state, setState] = useState<LiveAudioCallState>(idleLiveAudioCallState);
  const peerRef = useRef<LiveWebRtcSession | null>(null);
  const runtimeRef = useRef<LiveAudioRuntime>({});
  const stateRef = useRef<LiveAudioCallState>(idleLiveAudioCallState);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollInFlightRef = useRef(false);

  const setLiveAudioState = useCallback((nextState: LiveAudioCallState | ((current: LiveAudioCallState) => LiveAudioCallState)) => {
    setState((current) => {
      const resolved = typeof nextState === "function" ? nextState(current) : nextState;
      stateRef.current = resolved;
      return resolved;
    });
  }, []);

  const stopPolling = useCallback(() => {
    if (!pollTimerRef.current) return;
    clearInterval(pollTimerRef.current);
    pollTimerRef.current = null;
    pollInFlightRef.current = false;
  }, []);

  const closePeer = useCallback(() => {
    peerRef.current?.close();
    peerRef.current = null;
  }, []);

  const hasActiveCallForSession = useCallback((remoteSessionId: string) => {
    const current = stateRef.current;
    return (
      runtimeRef.current.remoteSessionId === remoteSessionId &&
      Boolean(peerRef.current) &&
      (current.status === "waiting" ||
        current.status === "connecting" ||
        current.status === "connected" ||
        Boolean(current.remoteStream))
    );
  }, []);

  const sendIceCandidate = useCallback((payload: LiveIcePayload) => {
    const runtime = runtimeRef.current;
    if (!runtime.remoteSessionId || !runtime.recipientId) return;
    void sendLiveSignal({
      payload: {
        ...payload,
        recipientDeviceId: runtime.remoteDeviceId ?? null,
        recipientRole: runtime.role === "owner" ? "angel" : "owner",
        senderDeviceId: runtime.localDeviceId ?? null,
        senderRole: runtime.role
      },
      recipientId: runtime.recipientId,
      remoteSessionId: runtime.remoteSessionId,
      signalType: "ice"
    }).catch(() => undefined);
  }, []);

  const createPeer = useCallback(
    async (
      callSessionId: string,
      options?: {
        audioMode?: "recvonly" | "sendrecv";
        videoFacingMode?: "environment" | "user";
        videoMode?: "disabled" | "recvonly" | "sendrecv";
      }
    ) =>
      LiveWebRtcSession.create({
        audioMode: options?.audioMode ?? "sendrecv",
        callSessionId,
        onConnectionState: (connectionState) => {
          if (connectionState === "connected") {
            setLiveAudioState((current) => ({
              ...current,
              message:
                current.role === "owner"
                  ? "Transmitindo seu SOS para o anjo."
                  : current.participantName
                    ? `Você está acompanhando ${current.participantName}.`
                    : "Você está acompanhando como anjo.",
              status: "connected"
            }));
          }
          if (connectionState === "connecting") {
            setLiveAudioState((current) => ({
              ...current,
              status: current.status === "connected" ? "connected" : "connecting"
            }));
          }
          if (connectionState === "disconnected" || connectionState === "failed") {
            setLiveAudioState((current) => ({
              ...current,
              message: "Chamada não entrou. O pedido continua ativo.",
              status: "failed"
            }));
          }
        },
        onLocalIceCandidate: sendIceCandidate,
        onRemoteStream: (remoteStream) => {
          const role = runtimeRef.current.role ?? stateRef.current.role;
          const shouldRenderRemoteStream = role === "angel";
          const remoteStreamUrl = streamUrlFrom(remoteStream);
          setLiveAudioState((current) => ({
            ...current,
            message:
              role === "owner"
                ? "Transmitindo seu SOS para o anjo."
                : current.participantName
                  ? `Você está acompanhando ${current.participantName}.`
                  : "Você está acompanhando como anjo.",
            remoteStream: shouldRenderRemoteStream ? remoteStream : current.remoteStream,
            remoteStreamUrl: shouldRenderRemoteStream ? remoteStreamUrl : current.remoteStreamUrl,
            status: "connected"
          }));
        },
        videoFacingMode: options?.videoFacingMode,
        videoMode: options?.videoMode ?? "disabled"
      }),
    [sendIceCandidate, setLiveAudioState]
  );

  const stopLiveAudioCall = useCallback(() => {
    stopPolling();
    closePeer();
    runtimeRef.current = {};
    setLiveAudioState({
      message: "Chamada encerrada. O pedido continua protegido.",
      status: "ended"
    });
  }, [closePeer, setLiveAudioState, stopPolling]);

  const resetLiveAudioCall = useCallback(() => {
    stopPolling();
    closePeer();
    runtimeRef.current = {};
    setLiveAudioState(idleLiveAudioCallState);
  }, [closePeer, setLiveAudioState, stopPolling]);

  const startPolling = useCallback(
    (handler: () => Promise<void>) => {
      stopPolling();
      const run = () => {
        if (pollInFlightRef.current) return;
        pollInFlightRef.current = true;
        void handler()
          .catch(() => {
            setLiveAudioState((current) => ({
              ...current,
              message:
                current.status === "connected"
                  ? current.message
                  : "Nao foi possivel atualizar a videochamada agora.",
              status: current.status === "connected" ? "connected" : "failed"
            }));
          })
          .finally(() => {
            pollInFlightRef.current = false;
          });
      };
      run();
      pollTimerRef.current = setInterval(run, signalPollingMs);
    },
    [setLiveAudioState, stopPolling]
  );

  const processOwnerSignals = useCallback(async () => {
    const runtime = runtimeRef.current;
    const peer = peerRef.current;
    if (!peer || !runtime.remoteSessionId || !runtime.callSessionId) return;

    const signals = await listPendingLiveSignalsForSession({
      callSessionId: runtime.callSessionId,
      recipientDeviceId: runtime.localDeviceId,
      recipientRole: "owner",
      remoteSessionId: runtime.remoteSessionId,
      senderDeviceId: runtime.remoteDeviceId,
      senderId: runtime.recipientId,
      senderRole: "angel",
      signalTypes: ["answer", "ice"]
    });

    const answerSignal = runtime.answerAccepted
      ? null
      : signals.find((signal) => signal.signal_type === "answer" && isSdpPayload(signal.payload));

    if (answerSignal && isSdpPayload(answerSignal.payload)) {
      await peer.acceptAnswerPayload(answerSignal.payload);
      await consumeLiveSignal(answerSignal.id);
      runtimeRef.current = { ...runtimeRef.current, answerAccepted: true };
      setLiveAudioState((current) => ({
        ...current,
        message:
          current.status === "connected" || current.remoteStream
            ? "Anjo na chamada. Seu SOS continua ativo."
            : current.participantName
              ? `${current.participantName} entrou. Conectando chamada.`
              : "Anjo entrou. Conectando chamada.",
        status: current.status === "connected" || current.remoteStream ? "connected" : "connecting"
      }));
    }

    if (!runtimeRef.current.answerAccepted) return;

    for (const signal of signals) {
      const payload = signal.payload;
      if (signal.signal_type === "ice" && isIcePayload(payload)) {
        await peer.addIcePayload(payload);
        await consumeLiveSignal(signal.id);
      }
    }
  }, [setLiveAudioState]);

  const processAngelIceSignals = useCallback(async () => {
    const runtime = runtimeRef.current;
    const peer = peerRef.current;
    if (!peer || !runtime.remoteSessionId || !runtime.callSessionId) return;

    const signals = await listPendingLiveSignalsForSession({
      callSessionId: runtime.callSessionId,
      recipientDeviceId: runtime.localDeviceId,
      recipientRole: "angel",
      remoteSessionId: runtime.remoteSessionId,
      senderDeviceId: runtime.remoteDeviceId,
      senderId: runtime.recipientId,
      senderRole: "owner",
      signalTypes: ["ice"]
    });

    for (const signal of signals) {
      const payload = signal.payload;
      if (!isIcePayload(payload)) continue;
      await peer.addIcePayload(payload);
      await consumeLiveSignal(signal.id);
    }
  }, []);

  const startOwnerAudioCall = useCallback(
    async (remoteSessionId: string) => {
      if (hasActiveCallForSession(remoteSessionId)) {
        setLiveAudioState((current) => ({
          ...current,
          message: current.message || "A chamada com o anjo já está em andamento."
        }));
        return;
      }

      stopPolling();
      closePeer();
      let localDeviceId: string;
      try {
        localDeviceId = await deviceBindingService.requireRegisteredApiDeviceId();
      } catch (error) {
        setLiveAudioState({
          message: error instanceof Error ? error.message : "Dispositivo precisa estar autenticado antes de chamar o anjo.",
          remoteSessionId,
          role: "owner",
          status: "failed"
        });
        return;
      }
      const callSessionId = createLiveCallSessionId();
      runtimeRef.current = { callSessionId, localDeviceId, remoteSessionId, role: "owner" };
      setLiveAudioState({
        message: "Verificando anjo disponivel para a chamada.",
        remoteSessionId,
        role: "owner",
        status: "connecting"
      });

      try {
        const [recipient] = await listAcceptedLiveRecipients(remoteSessionId);
        const recipientDevice = recipient ? firstLiveRecipientDevice(recipient) : null;
        if (!canOwnerStartLiveCallWithRecipient(recipient) || !recipientDevice) {
          throw new Error("Nenhum anjo aceitou acompanhar este pedido ainda.");
        }

        runtimeRef.current = {
          callSessionId,
          localDeviceId,
          participantName: recipient.recipient_display_name,
          recipientId: recipient.recipient,
          remoteDeviceId: recipientDevice.id,
          remoteSessionId,
          role: "owner"
        };
        await createLiveSessionEnvelope({
          emergencySessionId: remoteSessionId,
          keyId: `live-${callSessionId}`,
          publicKeySha256: recipientDevice.public_key_sha256,
          recipientDeviceId: recipientDevice.id,
          recipientId: recipient.recipient
        });
        const peer = await createPeer(callSessionId, {
          audioMode: "sendrecv",
          videoFacingMode: "environment",
          videoMode: "sendrecv"
        });
        peerRef.current = peer;
        const offerPayload = await peer.createOfferPayload();
        await sendLiveSignal({
          payload: {
            ...offerPayload,
            recipientDeviceId: recipientDevice.id,
            recipientRole: "angel",
            senderDeviceId: localDeviceId,
            senderRole: "owner"
          },
          recipientId: recipient.recipient,
          remoteSessionId,
          signalType: "offer"
        });
        setLiveAudioState({
          message: `Transmitindo assim que ${recipient.recipient_display_name} entrar como anjo.`,
          participantName: recipient.recipient_display_name,
          remoteSessionId,
          role: "owner",
          status: "waiting"
        });
        startPolling(processOwnerSignals);
      } catch (error) {
        stopPolling();
        closePeer();
        runtimeRef.current = {};
        setLiveAudioState({
          message: error instanceof Error ? error.message : "Nao foi possivel chamar o anjo.",
          remoteSessionId,
          role: "owner",
          status: "failed"
        });
      }
    },
    [closePeer, createPeer, hasActiveCallForSession, processOwnerSignals, setLiveAudioState, startPolling, stopPolling]
  );

  const startAngelAudioCall = useCallback(
    async (session: ApiEmergencySession) => {
      if (hasActiveCallForSession(session.id)) {
        return;
      }

      stopPolling();
      closePeer();
      if (!canAngelStartRealtime(session)) {
        setLiveAudioState({
          message: "Este pedido ainda nao esta liberado para atendimento como anjo.",
          participantName: session.owner_display_name,
          remoteSessionId: session.id,
          role: "angel",
          status: "failed"
        });
        return;
      }
      let localDeviceId: string;
      try {
        localDeviceId = await deviceBindingService.requireRegisteredApiDeviceId();
      } catch (error) {
        setLiveAudioState({
          message: error instanceof Error ? error.message : "Dispositivo precisa estar autenticado antes de atender como anjo.",
          participantName: session.owner_display_name,
          remoteSessionId: session.id,
          role: "angel",
          status: "failed"
        });
        return;
      }
      runtimeRef.current = {
        localDeviceId,
        participantName: session.owner_display_name,
        remoteSessionId: session.id,
        role: "angel"
      };
      setLiveAudioState({
        message: `${session.owner_display_name ?? "Pessoa protegida"} pediu ajuda.`,
        participantName: session.owner_display_name,
        remoteSessionId: session.id,
        role: "angel",
        status: "waiting"
      });

      startPolling(async () => {
        const runtime = runtimeRef.current;
        if (!runtime.remoteSessionId || runtime.callSessionId) {
          await processAngelIceSignals();
          return;
        }

        const [offerSignal] = await listPendingLiveSignalsForSession({
          recipientDeviceId: localDeviceId,
          recipientRole: "angel",
          remoteSessionId: runtime.remoteSessionId,
          senderRole: "owner",
          signalTypes: ["offer"]
        });
        const offerPayload = offerSignal?.payload;
        if (!offerSignal || !offerPayload || !isSdpPayload(offerPayload)) return;

        const callSessionId = offerPayload.callSessionId;
        runtimeRef.current = {
          callSessionId,
          localDeviceId,
          participantName: session.owner_display_name,
          recipientId: offerSignal.sender,
          remoteDeviceId: offerPayload.senderDeviceId ?? undefined,
          remoteSessionId: session.id,
          role: "angel"
        };
        const peer = await createPeer(callSessionId, { audioMode: "recvonly", videoMode: "recvonly" });
        peerRef.current = peer;
        const answerPayload = await peer.createAnswerPayload(offerPayload);
        await sendLiveSignal({
          payload: {
            ...answerPayload,
            recipientDeviceId: offerPayload.senderDeviceId ?? null,
            recipientRole: "owner",
            senderDeviceId: localDeviceId,
            senderRole: "angel"
          },
          recipientId: offerSignal.sender,
          remoteSessionId: session.id,
          signalType: "answer"
        });
        await consumeLiveSignal(offerSignal.id);
        setLiveAudioState((current) => ({
          ...current,
          message:
            current.remoteStream || current.remoteStreamUrl
              ? `Você está acompanhando ${session.owner_display_name ?? "pessoa protegida"}.`
              : `Entrando como anjo de ${session.owner_display_name ?? "pessoa protegida"}.`,
          participantName: session.owner_display_name,
          remoteSessionId: session.id,
          role: "angel",
          status: current.remoteStream || current.remoteStreamUrl ? "connected" : "connecting"
        }));
        await processAngelIceSignals();
      });
    },
    [closePeer, createPeer, hasActiveCallForSession, processAngelIceSignals, setLiveAudioState, startPolling, stopPolling]
  );

  useEffect(
    () => () => {
      stopPolling();
      closePeer();
      runtimeRef.current = {};
    },
    [closePeer, stopPolling]
  );

  return {
    resetLiveAudioCall,
    startAngelAudioCall,
    startOwnerAudioCall,
    state,
    stopLiveAudioCall
  };
}
