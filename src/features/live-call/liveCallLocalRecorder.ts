import { Platform } from "react-native";
import { randomUUID } from "expo-crypto";

import {
  isLiveVideoRecordingAvailable,
  startNativeLiveVideoRecording,
  stopNativeLiveVideoRecording,
  type LiveVideoRecordingStart,
  type LiveVideoRecordingStop
} from "@/features/emergency/SinalSeguroMediaEngine";
import { appendMediaOperationalLog } from "@/features/emergency/MediaOperationalLog";

export type OwnerLiveVideoRecording = LiveVideoRecordingStart & {
  callSessionId?: string;
  packageId: string;
  remoteSessionId: string;
  streamReactTag: string;
};

export async function startOwnerLiveVideoRecording(input: {
  callSessionId?: string;
  packageId: string;
  remoteSessionId: string;
  streamReactTag: string;
}): Promise<OwnerLiveVideoRecording | null> {
  if (Platform.OS !== "android" || !isLiveVideoRecordingAvailable()) {
    appendMediaOperationalLog("live_video_recording_unavailable", {
      platform: Platform.OS
    });
    return null;
  }

  const recordingId = `owner-live-${input.remoteSessionId}-${randomUUID()}`;
  appendMediaOperationalLog("live_video_recording_start", {
    platform: Platform.OS,
    remoteSessionId: input.remoteSessionId
  });
  const recording = await startNativeLiveVideoRecording({
    recordingId,
    streamReactTag: input.streamReactTag
  });

  return {
    ...recording,
    callSessionId: input.callSessionId,
    packageId: input.packageId,
    remoteSessionId: input.remoteSessionId,
    streamReactTag: input.streamReactTag
  };
}

export async function stopOwnerLiveVideoRecording(
  recording: OwnerLiveVideoRecording
): Promise<LiveVideoRecordingStop | null> {
  if (Platform.OS !== "android" || !isLiveVideoRecordingAvailable()) {
    return null;
  }

  appendMediaOperationalLog("live_video_recording_stop", {
    platform: Platform.OS,
    remoteSessionId: recording.remoteSessionId
  });
  const result = await stopNativeLiveVideoRecording(recording.recordingId);
  appendMediaOperationalLog("live_video_recording_stopped", {
    audioCaptured: result.audioCaptured,
    frameCount: result.frameCount,
    platform: Platform.OS,
    remoteSessionId: recording.remoteSessionId,
    sizeBytes: result.sizeBytes
  });
  return result;
}
