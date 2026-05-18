import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaStream } from "react-native-webrtc";

import {
  consumeLiveSignal,
  createLiveCallSessionId,
  createLiveSessionEnvelope,
  firstLiveRecipientDevice,
  listAcceptedLiveRecipients,
  listPendingLiveSignalsForSession,
  recordLiveAuditMarker,
  sendLiveSignal,
  type LiveIcePayload
} from "@/services/liveCallControl";
import { LiveWebRtcSession } from "@/services/liveWebRtcSession";
import type { ApiEmergencySession } from "@/services/apiClient";
import { deviceBindingService } from "@/services/deviceBinding";
import {
  canAngelStartRealtime,
  canOwnerStartLiveCallWithRecipient
} from "@/features/live-call/liveCallRolePolicy";
import {
  isIcePayload,
  isSdpPayload,
  liveAuditEvent,
  liveEvidenceStatusForRole,
  oppositeLiveSignalRole,
  shouldRenderRemoteStream,
  type LiveAudioRole
} from "@/features/live-call/liveCallSessionPolicy";
import {
  idleLiveAudioCallState,
  isLiveAudioActive,
  liveAudioAngelAnswerSentState,
  liveAudioConnectedState,
  liveAudioConnectingState,
  liveAudioFailedState,
  liveAudioOwnerAnswerAcceptedState,
  liveAudioPollingFailureState,
  liveAudioReconnectingState,
  liveAudioRemoteStreamState,
  type LiveAudioCallState
} from "@/features/live-call/liveCallStatePolicy";

type LiveAudioRuntime = {
  answerAccepted?: boolean;
  callSessionId?: string;
  connectedAuditSent?: boolean;
  endedAuditSent?: boolean;
  failedAuditSent?: boolean;
  localDeviceId?: string;
  participantName?: string;
  recipientId?: string;
  reconnectFailedAuditSent?: boolean;
  reconnectedAuditSent?: boolean;
  reconnectingAuditSent?: boolean;
  remoteDeviceId?: string;
  remoteSessionId?: string;
  role?: LiveAudioRole;
};

const signalPollingMs = 2500;
const reconnectGraceMs = 14000;

function streamUrlFrom(remoteStream: MediaStream) {
  return remoteStream.toURL?.();
}

export function useLiveAudioCall() {
  const [state, setState] = useState<LiveAudioCallState>(idleLiveAudioCallState);
  const peerRef = useRef<LiveWebRtcSession | null>(null);
  const runtimeRef = useRef<LiveAudioRuntime>({});
  const stateRef = useRef<LiveAudioCallState>(idleLiveAudioCallState);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollInFlightRef = useRef(false);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const clearReconnectTimer = useCallback(() => {
    if (!reconnectTimerRef.current) return;
    clearTimeout(reconnectTimerRef.current);
    reconnectTimerRef.current = null;
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
      isLiveAudioActive(current)
    );
  }, []);

  const sendIceCandidate = useCallback((payload: LiveIcePayload) => {
    const runtime = runtimeRef.current;
    if (!runtime.remoteSessionId || !runtime.recipientId || !runtime.role) return;
    void sendLiveSignal({
      payload: {
        ...payload,
        recipientDeviceId: runtime.remoteDeviceId ?? null,
        recipientRole: oppositeLiveSignalRole(runtime.role),
        senderDeviceId: runtime.localDeviceId ?? null,
        senderRole: runtime.role
      },
      recipientId: runtime.recipientId,
      remoteSessionId: runtime.remoteSessionId,
      signalType: "ice"
    }).catch(() => undefined);
  }, []);

  const recordCurrentLiveAuditMarker = useCallback(
    (
      event: Parameters<typeof recordLiveAuditMarker>[1]["event"],
      options?: {
        connectionState?: Parameters<typeof recordLiveAuditMarker>[1]["connectionState"];
        localEvidenceStatus?: Parameters<typeof recordLiveAuditMarker>[1]["localEvidenceStatus"];
      }
    ) => {
      const runtime = runtimeRef.current;
      if (!runtime.remoteSessionId || !runtime.role) return;
      void recordLiveAuditMarker(runtime.remoteSessionId, {
        callSessionId: runtime.callSessionId,
        connectionState: options?.connectionState,
        deviceId: runtime.localDeviceId ?? null,
        event,
        localEvidenceStatus: options?.localEvidenceStatus ?? "not_applicable",
        role: runtime.role
      }).catch(() => undefined);
    },
    []
  );

  const markReconnectFailed = useCallback(() => {
    const runtime = runtimeRef.current;
    if (!runtime.remoteSessionId || !runtime.role || runtime.reconnectFailedAuditSent) return;
    runtimeRef.current = { ...runtime, failedAuditSent: true, reconnectFailedAuditSent: true };
    recordCurrentLiveAuditMarker(liveAuditEvent("reconnect_failed", runtime.role), {
      connectionState: "failed",
      localEvidenceStatus: liveEvidenceStatusForRole(runtime.role)
    });
    setLiveAudioState((current) => ({
      ...current,
      message: "Nao foi possivel restabelecer a chamada. O pedido continua ativo.",
      status: "failed"
    }));
  }, [recordCurrentLiveAuditMarker, setLiveAudioState]);

  const scheduleReconnectFailure = useCallback(() => {
    clearReconnectTimer();
    reconnectTimerRef.current = setTimeout(() => {
      if (stateRef.current.status !== "reconnecting") return;
      markReconnectFailed();
    }, reconnectGraceMs);
  }, [clearReconnectTimer, markReconnectFailed]);

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
          const runtime = runtimeRef.current;
          if (connectionState === "connected") {
            clearReconnectTimer();
            if (runtime.role && runtime.reconnectingAuditSent && !runtime.reconnectedAuditSent) {
              runtimeRef.current = { ...runtime, reconnectedAuditSent: true };
              recordCurrentLiveAuditMarker(liveAuditEvent("reconnected", runtime.role), {
                connectionState: "connected",
                localEvidenceStatus: liveEvidenceStatusForRole(runtime.role)
              });
            }
            if (runtime.role && !runtime.connectedAuditSent) {
              runtimeRef.current = { ...runtimeRef.current, connectedAuditSent: true };
              recordCurrentLiveAuditMarker(liveAuditEvent("connected", runtime.role), {
                connectionState: "connected",
                localEvidenceStatus: liveEvidenceStatusForRole(runtime.role)
              });
            }
            setLiveAudioState((current) => ({
              ...liveAudioConnectedState(current)
            }));
          }
          if (connectionState === "connecting") {
            setLiveAudioState(liveAudioConnectingState);
          }
          if (connectionState === "disconnected") {
            if (runtime.remoteSessionId && runtime.role && !runtime.reconnectingAuditSent) {
              runtimeRef.current = { ...runtime, reconnectingAuditSent: true };
              recordCurrentLiveAuditMarker(liveAuditEvent("reconnecting", runtime.role), {
                connectionState: "reconnecting",
                localEvidenceStatus: liveEvidenceStatusForRole(runtime.role)
              });
            }
            setLiveAudioState(liveAudioReconnectingState);
            scheduleReconnectFailure();
          }
          if (connectionState === "failed") {
            clearReconnectTimer();
            if (runtime.reconnectingAuditSent) {
              markReconnectFailed();
              return;
            }
            if (runtime.role && !runtime.failedAuditSent) {
              runtimeRef.current = { ...runtimeRef.current, failedAuditSent: true };
              recordCurrentLiveAuditMarker(liveAuditEvent("failed", runtime.role), {
                connectionState: "failed",
                localEvidenceStatus: liveEvidenceStatusForRole(runtime.role)
              });
            }
            setLiveAudioState(liveAudioFailedState);
          }
        },
        onLocalIceCandidate: sendIceCandidate,
        onRemoteStream: (remoteStream) => {
          const role = runtimeRef.current.role ?? stateRef.current.role;
          const shouldRenderRemoteStreamForRole = shouldRenderRemoteStream(role);
          const remoteStreamUrl = streamUrlFrom(remoteStream);
          setLiveAudioState((current) =>
            liveAudioRemoteStreamState(current, {
              remoteStream,
              remoteStreamUrl,
              renderRemoteStream: shouldRenderRemoteStreamForRole,
              role
            })
          );
        },
        videoFacingMode: options?.videoFacingMode,
        videoMode: options?.videoMode ?? "disabled"
      }),
    [clearReconnectTimer, markReconnectFailed, recordCurrentLiveAuditMarker, scheduleReconnectFailure, sendIceCandidate, setLiveAudioState]
  );

  const stopLiveAudioCall = useCallback(() => {
    const runtime = runtimeRef.current;
    if (runtime.remoteSessionId && runtime.role && !runtime.endedAuditSent) {
      recordCurrentLiveAuditMarker(liveAuditEvent("ended", runtime.role), {
        connectionState: "ended",
        localEvidenceStatus: liveEvidenceStatusForRole(runtime.role)
      });
    }
    clearReconnectTimer();
    stopPolling();
    closePeer();
    runtimeRef.current = {};
    setLiveAudioState({
      message: "Chamada encerrada. O pedido continua protegido.",
      status: "ended"
    });
  }, [clearReconnectTimer, closePeer, recordCurrentLiveAuditMarker, setLiveAudioState, stopPolling]);

  const resetLiveAudioCall = useCallback(() => {
    clearReconnectTimer();
    stopPolling();
    closePeer();
    runtimeRef.current = {};
    setLiveAudioState(idleLiveAudioCallState);
  }, [clearReconnectTimer, closePeer, setLiveAudioState, stopPolling]);

  const startPolling = useCallback(
    (handler: () => Promise<void>) => {
      stopPolling();
      const run = () => {
        if (pollInFlightRef.current) return;
        pollInFlightRef.current = true;
        void handler()
          .catch(() => {
            setLiveAudioState(liveAudioPollingFailureState);
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
      recordCurrentLiveAuditMarker("owner_live_answer_accepted", {
        connectionState: "connecting",
        localEvidenceStatus: "metadata_only"
      });
      setLiveAudioState(liveAudioOwnerAnswerAcceptedState);
    }

    if (!runtimeRef.current.answerAccepted) return;

    for (const signal of signals) {
      const payload = signal.payload;
      if (signal.signal_type === "ice" && isIcePayload(payload)) {
        await peer.addIcePayload(payload);
        await consumeLiveSignal(signal.id);
      }
    }
  }, [recordCurrentLiveAuditMarker, setLiveAudioState]);

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
        return true;
      }

      stopPolling();
      clearReconnectTimer();
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
        return false;
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
        const localStreamUrl = peer.getLocalStreamUrl();
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
        recordCurrentLiveAuditMarker("owner_live_offer_sent", {
          connectionState: "waiting",
          localEvidenceStatus: "metadata_only"
        });
        setLiveAudioState({
          callSessionId,
          localStreamUrl,
          message: `Transmitindo assim que ${recipient.recipient_display_name} entrar como anjo.`,
          participantName: recipient.recipient_display_name,
          remoteSessionId,
          role: "owner",
          status: "waiting"
        });
        startPolling(processOwnerSignals);
        return true;
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
        return false;
      }
    },
    [clearReconnectTimer, closePeer, createPeer, hasActiveCallForSession, processOwnerSignals, setLiveAudioState, startPolling, stopPolling]
  );

  const startAngelAudioCall = useCallback(
    async (session: ApiEmergencySession) => {
      if (hasActiveCallForSession(session.id)) {
        return;
      }

      stopPolling();
      clearReconnectTimer();
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
        recordCurrentLiveAuditMarker("angel_live_offer_received", {
          connectionState: "connecting",
          localEvidenceStatus: "not_applicable"
        });
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
        recordCurrentLiveAuditMarker("angel_live_answer_sent", {
          connectionState: "connecting",
          localEvidenceStatus: "not_applicable"
        });
        await consumeLiveSignal(offerSignal.id);
        setLiveAudioState((current) =>
          liveAudioAngelAnswerSentState(current, {
            participantName: session.owner_display_name,
            remoteSessionId: session.id
          })
        );
        await processAngelIceSignals();
      });
    },
    [clearReconnectTimer, closePeer, createPeer, hasActiveCallForSession, processAngelIceSignals, setLiveAudioState, startPolling, stopPolling]
  );

  useEffect(
    () => () => {
      clearReconnectTimer();
      stopPolling();
      closePeer();
      runtimeRef.current = {};
    },
    [clearReconnectTimer, closePeer, stopPolling]
  );

  return {
    resetLiveAudioCall,
    startAngelAudioCall,
    startOwnerAudioCall,
    state,
    stopLiveAudioCall
  };
}
