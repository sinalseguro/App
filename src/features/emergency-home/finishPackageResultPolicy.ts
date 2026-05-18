import type { MediaCaptureManifest } from "@/features/emergency/types";

export type FinishPackageResultDecision = {
  attachedAssetsAfterFinish: number;
  liveVideoAttached: boolean;
  logEvent: "emergency_finish_package_result";
  logPayload: {
    attachedAssetCount: number;
    liveVideoAttached: boolean;
    mediaRecorded: boolean;
    platform: string;
  };
  mediaRecorded: boolean;
};

export function resolveFinishPackageResult(input: {
  liveVideoAttached: boolean;
  media: MediaCaptureManifest;
  platform: string;
}): FinishPackageResultDecision {
  const mediaRecorded = input.media.status === "recorded_local";
  const attachedAssetsAfterFinish = mediaRecorded ? input.media.assets.length : 0;

  return {
    attachedAssetsAfterFinish,
    liveVideoAttached: input.liveVideoAttached,
    logEvent: "emergency_finish_package_result",
    logPayload: {
      attachedAssetCount: attachedAssetsAfterFinish,
      liveVideoAttached: input.liveVideoAttached,
      mediaRecorded,
      platform: input.platform
    },
    mediaRecorded
  };
}
