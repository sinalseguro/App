import { Platform } from "react-native";
import {
  mediaDevices,
  MediaStream,
  type MediaStreamTrack,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription
} from "react-native-webrtc";

import {
  buildLiveMediaConstraints,
  liveMediaOpenTimeoutMs,
  normalizeLiveAudioMode,
  normalizeLiveVideoMode,
  remoteStreamFromTrackEvent,
  shouldAddRecvOnlyAudioTransceiver,
  shouldAddRecvOnlyVideoTransceiver,
  shouldOpenLocalLiveMedia,
  toLiveConnectionState,
  type LiveAudioMode,
  type LiveConnectionState,
  type LiveVideoFacingMode,
  type LiveVideoMode
} from "@/features/live-call/liveWebRtcPolicy";
import { LiveSignalPayload } from "@/services/liveCallControl";

export type LiveIcePayload = Extract<LiveSignalPayload, { candidate: string }>;
export type LiveSdpPayload = Extract<LiveSignalPayload, { sdp: string }>;

export type LiveWebRtcSessionOptions = {
  audioMode?: LiveAudioMode;
  callSessionId: string;
  onConnectionState?: (state: LiveConnectionState) => void;
  onLocalIceCandidate?: (payload: LiveIcePayload) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  videoFacingMode?: LiveVideoFacingMode;
  videoMode?: LiveVideoMode;
  videoEnabled?: boolean;
};

type PeerEventHandlers = {
  onaddstream?: (event: { stream?: MediaStream }) => void;
};

function assertAndroidOrNative() {
  if (Platform.OS === "web") {
    throw new Error("Videochamada indisponivel no ambiente web.");
  }
}

type PeerWithTransceiver = RTCPeerConnection & {
  addTransceiver?: (trackOrKind: "audio" | "video", init?: { direction: "recvonly" }) => unknown;
};

type PeerWithEventListeners = RTCPeerConnection & {
  addEventListener: (type: "connectionstatechange" | "icecandidate" | "iceconnectionstatechange" | "track", listener: (event: any) => void) => void;
};

function logRemoteStream(source: "addstream" | "track", stream: MediaStream) {
  console.info(
    `[SinalSeguroLiveCall] remote_stream_${source} audio=${stream.getAudioTracks().length} video=${stream.getVideoTracks().length}`
  );
}

function logLocalStream(stream: MediaStream | null) {
  if (!stream) {
    console.info("[SinalSeguroLiveCall] local_stream audio=0 video=0");
    return;
  }

  console.info(
    `[SinalSeguroLiveCall] local_stream audio=${stream.getAudioTracks().length} video=${stream.getVideoTracks().length}`
  );
}

function logPeerState(label: string, value: string) {
  console.info(`[SinalSeguroLiveCall] ${label}=${toLiveConnectionState(value)}`);
}

async function getUserMediaWithTimeout(constraints: ReturnType<typeof buildLiveMediaConstraints>) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let timedOut = false;
  const mediaPromise = mediaDevices.getUserMedia(constraints).then((stream) => {
    if (timedOut) {
      stream.getTracks().forEach((track) => track.stop());
      throw new Error("Videochamada demorou para abrir camera e microfone.");
    }
    if (timeout) clearTimeout(timeout);
    return stream;
  });
  const timeoutPromise = new Promise<MediaStream>((_, reject) => {
    timeout = setTimeout(() => {
      timedOut = true;
      reject(new Error("Videochamada demorou para abrir camera e microfone."));
    }, liveMediaOpenTimeoutMs);
  });

  try {
    return await Promise.race([mediaPromise, timeoutPromise]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export class LiveWebRtcSession {
  private closed = false;

  private constructor(
    private readonly callSessionId: string,
    private readonly localStream: MediaStream | null,
    private readonly peer: RTCPeerConnection
  ) {}

  static async create(options: LiveWebRtcSessionOptions) {
    assertAndroidOrNative();
    const audioMode = normalizeLiveAudioMode(options.audioMode);
    const videoMode = normalizeLiveVideoMode(options.videoMode, options.videoEnabled);
    const videoFacingMode = options.videoFacingMode ?? "environment";
    const localStream = shouldOpenLocalLiveMedia(audioMode, videoMode)
      ? await getUserMediaWithTimeout(
          buildLiveMediaConstraints(audioMode, videoMode, videoFacingMode)
        )
      : null;
    logLocalStream(localStream);
    const peer = new RTCPeerConnection({ iceServers: [] });

    localStream?.getTracks().forEach((track) => {
      peer.addTrack(track, localStream);
    });

    if (shouldAddRecvOnlyAudioTransceiver(audioMode) || shouldAddRecvOnlyVideoTransceiver(videoMode)) {
      const transceiverPeer = peer as PeerWithTransceiver;
      if (!transceiverPeer.addTransceiver) {
        throw new Error("Videochamada indisponivel neste aparelho.");
      }
      if (shouldAddRecvOnlyAudioTransceiver(audioMode)) {
        transceiverPeer.addTransceiver("audio", { direction: "recvonly" });
      }
      if (shouldAddRecvOnlyVideoTransceiver(videoMode)) {
        transceiverPeer.addTransceiver("video", { direction: "recvonly" });
      }
    }

    const eventPeer = peer as unknown as PeerEventHandlers;
    const listenerPeer = peer as PeerWithEventListeners;
    listenerPeer.addEventListener("connectionstatechange", () => {
      logPeerState("connection_state", peer.connectionState);
      options.onConnectionState?.(toLiveConnectionState(peer.connectionState));
    });
    listenerPeer.addEventListener("iceconnectionstatechange", () => {
      logPeerState("ice_connection_state", peer.iceConnectionState);
      options.onConnectionState?.(toLiveConnectionState(peer.iceConnectionState));
    });
    listenerPeer.addEventListener("icecandidate", (event) => {
      if (!event.candidate) return;
      const candidate = event.candidate.toJSON();
      if (!candidate.candidate) return;
      options.onLocalIceCandidate?.({
        callSessionId: options.callSessionId,
        candidate: candidate.candidate,
        sdpMLineIndex: candidate.sdpMLineIndex ?? null,
        sdpMid: candidate.sdpMid ?? null
      });
    });
    eventPeer.onaddstream = (event) => {
      if (event.stream) {
        logRemoteStream("addstream", event.stream);
        options.onRemoteStream?.(event.stream);
      }
    };
    listenerPeer.addEventListener("track", (event) => {
      const remoteStream = remoteStreamFromTrackEvent<MediaStream, MediaStreamTrack>(
        event,
        (track) => new MediaStream([track])
      );
      if (remoteStream) {
        logRemoteStream("track", remoteStream);
        options.onRemoteStream?.(remoteStream);
      }
    });

    return new LiveWebRtcSession(options.callSessionId, localStream, peer);
  }

  getLocalStream() {
    return this.localStream;
  }

  getLocalStreamUrl() {
    return this.localStream?.toURL?.() ?? null;
  }

  async createOfferPayload(): Promise<LiveSdpPayload> {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    const sdp = this.peer.localDescription?.sdp ?? offer.sdp;
    return {
      callSessionId: this.callSessionId,
      sdp
    };
  }

  async createAnswerPayload(offerPayload: LiveSdpPayload): Promise<LiveSdpPayload> {
    await this.peer.setRemoteDescription(new RTCSessionDescription({ sdp: offerPayload.sdp, type: "offer" }));
    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(answer);
    const sdp = this.peer.localDescription?.sdp ?? answer.sdp;
    return {
      callSessionId: offerPayload.callSessionId,
      sdp
    };
  }

  async acceptAnswerPayload(answerPayload: LiveSdpPayload) {
    await this.peer.setRemoteDescription(new RTCSessionDescription({ sdp: answerPayload.sdp, type: "answer" }));
  }

  async addIcePayload(candidatePayload: LiveIcePayload) {
    if (candidatePayload.callSessionId !== this.callSessionId) return;
    await this.peer.addIceCandidate(
      new RTCIceCandidate({
        candidate: candidatePayload.candidate,
        sdpMLineIndex: candidatePayload.sdpMLineIndex ?? null,
        sdpMid: candidatePayload.sdpMid ?? null
      })
    );
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    this.localStream?.getTracks().forEach((track) => {
      track.stop();
    });
    this.peer.close();
  }
}
