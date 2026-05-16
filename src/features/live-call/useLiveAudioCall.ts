import { useCallback, useEffect, useRef, useState } from "react";

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

type LiveAudioRole = "angel" | "owner";
type LiveAudioStatus = "connected" | "connecting" | "ended" | "failed" | "idle" | "waiting";

export type LiveAudioCallState = {
  message: string;
  participantName?: string;
  remoteSessionId?: string;
  role?: LiveAudioRole;
  status: LiveAudioStatus;
};

type LiveAudioRuntime = {
  callSessionId?: string;
  participantName?: string;
  recipientId?: string;
  remoteSessionId?: string;
  role?: LiveAudioRole;
};

const idleLiveAudioCallState: LiveAudioCallState = {
  message: "Audio com anjo disponivel apos aceite.",
  status: "idle"
};

const signalPollingMs = 2500;

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
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollInFlightRef = useRef(false);

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

  const sendIceCandidate = useCallback((payload: LiveIcePayload) => {
    const runtime = runtimeRef.current;
    if (!runtime.remoteSessionId || !runtime.recipientId) return;
    void sendLiveSignal({
      payload,
      recipientId: runtime.recipientId,
      remoteSessionId: runtime.remoteSessionId,
      signalType: "ice"
    }).catch(() => undefined);
  }, []);

  const createPeer = useCallback(
    async (callSessionId: string) =>
      LiveWebRtcSession.create({
        callSessionId,
        onConnectionState: (connectionState) => {
          if (connectionState === "connected") {
            setState((current) => ({
              ...current,
              message: current.participantName
                ? `Audio conectado com ${current.participantName}.`
                : "Audio conectado com anjo.",
              status: "connected"
            }));
          }
          if (connectionState === "disconnected" || connectionState === "failed") {
            setState((current) => ({
              ...current,
              message: "Audio indisponivel. O pedido continua ativo.",
              status: "failed"
            }));
          }
        },
        onLocalIceCandidate: sendIceCandidate,
        videoEnabled: false
      }),
    [sendIceCandidate]
  );

  const stopLiveAudioCall = useCallback(() => {
    stopPolling();
    closePeer();
    runtimeRef.current = {};
    setState({
      message: "Audio encerrado. O pedido continua protegido.",
      status: "ended"
    });
  }, [closePeer, stopPolling]);

  const startPolling = useCallback(
    (handler: () => Promise<void>) => {
      stopPolling();
      const run = () => {
        if (pollInFlightRef.current) return;
        pollInFlightRef.current = true;
        void handler()
          .catch(() => {
            setState((current) => ({
              ...current,
              message: "Nao foi possivel atualizar o audio agora.",
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
    [stopPolling]
  );

  const processOwnerSignals = useCallback(async () => {
    const runtime = runtimeRef.current;
    const peer = peerRef.current;
    if (!peer || !runtime.remoteSessionId || !runtime.callSessionId) return;

    const signals = await listPendingLiveSignalsForSession({
      callSessionId: runtime.callSessionId,
      remoteSessionId: runtime.remoteSessionId,
      signalTypes: ["answer", "ice"]
    });

    for (const signal of signals) {
      const payload = signal.payload;
      if (signal.signal_type === "answer" && isSdpPayload(payload)) {
        await peer.acceptAnswerPayload(payload);
        await consumeLiveSignal(signal.id);
      } else if (signal.signal_type === "ice" && isIcePayload(payload)) {
        await peer.addIcePayload(payload);
        await consumeLiveSignal(signal.id);
      }
    }
  }, []);

  const processAngelIceSignals = useCallback(async () => {
    const runtime = runtimeRef.current;
    const peer = peerRef.current;
    if (!peer || !runtime.remoteSessionId || !runtime.callSessionId) return;

    const signals = await listPendingLiveSignalsForSession({
      callSessionId: runtime.callSessionId,
      remoteSessionId: runtime.remoteSessionId,
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
      stopPolling();
      closePeer();
      const callSessionId = createLiveCallSessionId();
      runtimeRef.current = { callSessionId, remoteSessionId, role: "owner" };
      setState({
        message: "Verificando anjos disponiveis para audio.",
        remoteSessionId,
        role: "owner",
        status: "connecting"
      });

      try {
        const [recipient] = await listAcceptedLiveRecipients(remoteSessionId);
        const recipientDevice = recipient ? firstLiveRecipientDevice(recipient) : null;
        if (!recipient || !recipientDevice) {
          throw new Error("Nenhum anjo aceitou acompanhar este pedido ainda.");
        }

        runtimeRef.current = {
          callSessionId,
          participantName: recipient.recipient_display_name,
          recipientId: recipient.recipient,
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
        const peer = await createPeer(callSessionId);
        peerRef.current = peer;
        const offerPayload = await peer.createOfferPayload();
        await sendLiveSignal({
          payload: offerPayload,
          recipientId: recipient.recipient,
          remoteSessionId,
          signalType: "offer"
        });
        setState({
          message: `Aguardando ${recipient.recipient_display_name} entrar no audio.`,
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
        setState({
          message: error instanceof Error ? error.message : "Nao foi possivel iniciar audio com anjo.",
          remoteSessionId,
          role: "owner",
          status: "failed"
        });
      }
    },
    [closePeer, createPeer, processOwnerSignals, startPolling, stopPolling]
  );

  const startAngelAudioCall = useCallback(
    async (session: ApiEmergencySession) => {
      stopPolling();
      closePeer();
      runtimeRef.current = {
        participantName: session.owner_display_name,
        remoteSessionId: session.id,
        role: "angel"
      };
      setState({
        message: `Aguardando audio de ${session.owner_display_name ?? "pessoa protegida"}.`,
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
          remoteSessionId: runtime.remoteSessionId,
          signalTypes: ["offer"]
        });
        const offerPayload = offerSignal?.payload;
        if (!offerSignal || !offerPayload || !isSdpPayload(offerPayload)) return;

        const callSessionId = offerPayload.callSessionId;
        runtimeRef.current = {
          callSessionId,
          participantName: session.owner_display_name,
          recipientId: offerSignal.sender,
          remoteSessionId: session.id,
          role: "angel"
        };
        const peer = await createPeer(callSessionId);
        peerRef.current = peer;
        const answerPayload = await peer.createAnswerPayload(offerPayload);
        await sendLiveSignal({
          payload: answerPayload,
          recipientId: offerSignal.sender,
          remoteSessionId: session.id,
          signalType: "answer"
        });
        await consumeLiveSignal(offerSignal.id);
        setState({
          message: `Conectando audio com ${session.owner_display_name ?? "pessoa protegida"}.`,
          participantName: session.owner_display_name,
          remoteSessionId: session.id,
          role: "angel",
          status: "connecting"
        });
        await processAngelIceSignals();
      });
    },
    [closePeer, createPeer, processAngelIceSignals, startPolling, stopPolling]
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
    startAngelAudioCall,
    startOwnerAudioCall,
    state,
    stopLiveAudioCall
  };
}
