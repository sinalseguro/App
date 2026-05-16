import { Platform } from "react-native";
import {
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription
} from "react-native-webrtc";

import { LiveSignalPayload } from "@/services/liveCallControl";

type LiveConnectionState = "closed" | "connected" | "connecting" | "disconnected" | "failed" | "new";

export type LiveIcePayload = Extract<LiveSignalPayload, { candidate: string }>;
export type LiveSdpPayload = Extract<LiveSignalPayload, { sdp: string }>;

export type LiveWebRtcSessionOptions = {
  callSessionId: string;
  onConnectionState?: (state: LiveConnectionState) => void;
  onLocalIceCandidate?: (payload: LiveIcePayload) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  videoEnabled?: boolean;
};

type PeerEventHandlers = {
  onconnectionstatechange?: () => void;
  onicecandidate?: (event: { candidate?: { toJSON: () => { candidate?: string; sdpMLineIndex?: number | null; sdpMid?: string | null } } | null }) => void;
  ontrack?: (event: { streams?: MediaStream[] }) => void;
};

function assertAndroidOrNative() {
  if (Platform.OS === "web") {
    throw new Error("Chamada ao vivo indisponivel no ambiente web.");
  }
}

function buildMediaConstraints(videoEnabled: boolean) {
  return {
    audio: true,
    video: videoEnabled
      ? {
          facingMode: "user",
          frameRate: { ideal: 24, max: 30 },
          height: { ideal: 720 },
          width: { ideal: 1280 }
        }
      : false
  };
}

function toLiveConnectionState(value: string): LiveConnectionState {
  if (value === "connected") return "connected";
  if (value === "connecting") return "connecting";
  if (value === "disconnected") return "disconnected";
  if (value === "failed") return "failed";
  if (value === "closed") return "closed";
  return "new";
}

export class LiveWebRtcSession {
  private closed = false;

  private constructor(
    private readonly callSessionId: string,
    private readonly localStream: MediaStream,
    private readonly peer: RTCPeerConnection
  ) {}

  static async create(options: LiveWebRtcSessionOptions) {
    assertAndroidOrNative();
    const localStream = await mediaDevices.getUserMedia(buildMediaConstraints(options.videoEnabled ?? false));
    const peer = new RTCPeerConnection({ iceServers: [] });

    localStream.getTracks().forEach((track) => {
      peer.addTrack(track, localStream);
    });

    const eventPeer = peer as unknown as PeerEventHandlers;
    eventPeer.onconnectionstatechange = () => {
      options.onConnectionState?.(toLiveConnectionState(peer.connectionState));
    };
    eventPeer.onicecandidate = (event) => {
      if (!event.candidate) return;
      const candidate = event.candidate.toJSON();
      if (!candidate.candidate) return;
      options.onLocalIceCandidate?.({
        callSessionId: options.callSessionId,
        candidate: candidate.candidate,
        sdpMLineIndex: candidate.sdpMLineIndex ?? null,
        sdpMid: candidate.sdpMid ?? null
      });
    };
    eventPeer.ontrack = (event) => {
      const streams = event.streams ?? [];
      const [remoteStream] = streams;
      if (remoteStream) {
        options.onRemoteStream?.(remoteStream);
      }
    };

    return new LiveWebRtcSession(options.callSessionId, localStream, peer);
  }

  getLocalStream() {
    return this.localStream;
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
    this.localStream.getTracks().forEach((track) => {
      track.stop();
    });
    this.peer.close();
  }
}
