import { Platform } from "react-native";
import {
  mediaDevices,
  MediaStream,
  type MediaStreamTrack,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription
} from "react-native-webrtc";

import { LiveSignalPayload } from "@/services/liveCallControl";

type LiveConnectionState = "closed" | "connected" | "connecting" | "disconnected" | "failed" | "new";
type VideoFacingMode = "environment" | "user";

export type LiveIcePayload = Extract<LiveSignalPayload, { candidate: string }>;
export type LiveSdpPayload = Extract<LiveSignalPayload, { sdp: string }>;

export type LiveWebRtcSessionOptions = {
  audioMode?: "recvonly" | "sendrecv";
  callSessionId: string;
  onConnectionState?: (state: LiveConnectionState) => void;
  onLocalIceCandidate?: (payload: LiveIcePayload) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  videoFacingMode?: VideoFacingMode;
  videoMode?: "disabled" | "recvonly" | "sendrecv";
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

function buildMediaConstraints(audioEnabled: boolean, videoEnabled: boolean, videoFacingMode: VideoFacingMode) {
  return {
    audio: audioEnabled,
    video: videoEnabled
      ? {
          facingMode: videoFacingMode,
          frameRate: { ideal: 24, max: 30 },
          height: { ideal: 720 },
          width: { ideal: 1280 }
        }
      : false
  };
}

function toLiveConnectionState(value: string): LiveConnectionState {
  if (value === "connected") return "connected";
  if (value === "completed") return "connected";
  if (value === "checking") return "connecting";
  if (value === "connecting") return "connecting";
  if (value === "disconnected") return "disconnected";
  if (value === "failed") return "failed";
  if (value === "closed") return "closed";
  return "new";
}

function logRemoteStream(source: "addstream" | "track", stream: MediaStream) {
  console.info(
    `[SinalSeguroLiveCall] remote_stream_${source} audio=${stream.getAudioTracks().length} video=${stream.getVideoTracks().length}`
  );
}

function remoteStreamFromTrackEvent(event: { streams?: MediaStream[]; track?: MediaStreamTrack | null }) {
  const streams = event.streams ?? [];
  const streamWithVideo = streams.find((stream) => stream.getVideoTracks().length > 0);
  if (streamWithVideo) return streamWithVideo;

  const streamWithAnyTrack = streams.find((stream) => stream.getTracks().length > 0);
  if (streamWithAnyTrack) return streamWithAnyTrack;

  return event.track ? new MediaStream([event.track]) : null;
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
    const audioMode = options.audioMode ?? "sendrecv";
    const videoMode = options.videoMode ?? (options.videoEnabled ? "sendrecv" : "disabled");
    const localVideoEnabled = videoMode === "sendrecv";
    const localCaptureEnabled = audioMode === "sendrecv" || localVideoEnabled;
    const localStream = localCaptureEnabled
      ? await mediaDevices.getUserMedia(
          buildMediaConstraints(audioMode === "sendrecv", localVideoEnabled, options.videoFacingMode ?? "environment")
        )
      : null;
    const peer = new RTCPeerConnection({ iceServers: [] });

    localStream?.getTracks().forEach((track) => {
      peer.addTrack(track, localStream);
    });

    if (audioMode === "recvonly" || videoMode === "recvonly") {
      const transceiverPeer = peer as PeerWithTransceiver;
      if (!transceiverPeer.addTransceiver) {
        throw new Error("Videochamada indisponivel neste aparelho.");
      }
      if (audioMode === "recvonly") {
        transceiverPeer.addTransceiver("audio", { direction: "recvonly" });
      }
      if (videoMode === "recvonly") {
        transceiverPeer.addTransceiver("video", { direction: "recvonly" });
      }
    }

    const eventPeer = peer as unknown as PeerEventHandlers;
    const listenerPeer = peer as PeerWithEventListeners;
    listenerPeer.addEventListener("connectionstatechange", () => {
      options.onConnectionState?.(toLiveConnectionState(peer.connectionState));
    });
    listenerPeer.addEventListener("iceconnectionstatechange", () => {
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
      const remoteStream = remoteStreamFromTrackEvent(event);
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
