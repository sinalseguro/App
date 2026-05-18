export type LiveConnectionState = "closed" | "connected" | "connecting" | "disconnected" | "failed" | "new";
export type LiveAudioMode = "recvonly" | "sendrecv";
export type LiveVideoFacingMode = "environment" | "user";
export type LiveVideoMode = "disabled" | "recvonly" | "sendrecv";

type TrackCollection = {
  getTracks: () => readonly unknown[];
  getVideoTracks: () => readonly unknown[];
};

export const emergencyVideoConstraints = {
  frameRate: { ideal: 12, max: 15 },
  height: { ideal: 360, max: 360 },
  width: { ideal: 640, max: 640 }
};

export const liveMediaOpenTimeoutMs = 12000;

export function normalizeLiveAudioMode(audioMode?: LiveAudioMode): LiveAudioMode {
  return audioMode ?? "sendrecv";
}

export function normalizeLiveVideoMode(videoMode?: LiveVideoMode, videoEnabled?: boolean): LiveVideoMode {
  return videoMode ?? (videoEnabled ? "sendrecv" : "disabled");
}

export function shouldCaptureLiveAudio(audioMode: LiveAudioMode) {
  return audioMode === "sendrecv";
}

export function shouldCaptureLiveVideo(videoMode: LiveVideoMode) {
  return videoMode === "sendrecv";
}

export function shouldOpenLocalLiveMedia(audioMode: LiveAudioMode, videoMode: LiveVideoMode) {
  return shouldCaptureLiveAudio(audioMode) || shouldCaptureLiveVideo(videoMode);
}

export function shouldAddRecvOnlyAudioTransceiver(audioMode: LiveAudioMode) {
  return audioMode === "recvonly";
}

export function shouldAddRecvOnlyVideoTransceiver(videoMode: LiveVideoMode) {
  return videoMode === "recvonly";
}

export function buildLiveMediaConstraints(
  audioMode: LiveAudioMode,
  videoMode: LiveVideoMode,
  videoFacingMode: LiveVideoFacingMode
): {
  audio: boolean;
  video:
    | false
    | {
        facingMode: LiveVideoFacingMode;
        frameRate: typeof emergencyVideoConstraints.frameRate;
        height: typeof emergencyVideoConstraints.height;
        width: typeof emergencyVideoConstraints.width;
      };
} {
  return {
    audio: shouldCaptureLiveAudio(audioMode),
    video: shouldCaptureLiveVideo(videoMode)
      ? {
          facingMode: videoFacingMode,
          ...emergencyVideoConstraints
        }
      : false
  };
}

export function toLiveConnectionState(value: string): LiveConnectionState {
  if (value === "connected") return "connected";
  if (value === "completed") return "connected";
  if (value === "checking") return "connecting";
  if (value === "connecting") return "connecting";
  if (value === "disconnected") return "disconnected";
  if (value === "failed") return "failed";
  if (value === "closed") return "closed";
  return "new";
}

export function remoteStreamFromTrackEvent<TStream extends TrackCollection, TTrack>(
  event: { streams?: TStream[]; track?: TTrack | null },
  createStreamFromTrack: (track: TTrack) => TStream
) {
  const streams = event.streams ?? [];
  const streamWithVideo = streams.find((stream) => stream.getVideoTracks().length > 0);
  if (streamWithVideo) return streamWithVideo;

  const streamWithAnyTrack = streams.find((stream) => stream.getTracks().length > 0);
  if (streamWithAnyTrack) return streamWithAnyTrack;

  return event.track ? createStreamFromTrack(event.track) : null;
}
