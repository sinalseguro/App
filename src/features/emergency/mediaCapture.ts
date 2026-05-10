import * as FileSystem from "expo-file-system/legacy";
import { LocalVideoCameraMode } from "./emergencyPreferences";
import { EncryptedVideoStore } from "./EncryptedVideoStore";
import { appendMediaOperationalLog } from "./MediaOperationalLog";
import { cleanupNativeMediaResidues } from "./SinalSeguroMediaEngine";
import { attachLocalMediaAsset } from "./emergencyRecorder";
import { LocalMediaAsset, MediaCaptureCompatibilityProfile } from "./types";

type PreserveLocalVideoInput = {
  packageId: string;
  sourceUri: string;
  cameraMode: Exclude<LocalVideoCameraMode, "both">;
  requestedCameraMode?: LocalVideoCameraMode;
  startedAt: string;
  completedAt?: string;
  chunkSizeBytes?: number;
  captureProfile?: MediaCaptureCompatibilityProfile;
  diagnosticRunId?: string;
  verificationMode?: "full" | "bounded";
};

export function canPreserveLocalMedia() {
  return Boolean(FileSystem.documentDirectory);
}

export async function preserveLocalVideoAsset({
  packageId,
  sourceUri,
  cameraMode,
  requestedCameraMode,
  startedAt,
  completedAt = new Date().toISOString(),
  chunkSizeBytes,
  captureProfile,
  verificationMode,
  diagnosticRunId
}: PreserveLocalVideoInput) {
  if (!canPreserveLocalMedia()) {
    appendMediaOperationalLog("preserve_filesystem_unavailable");
    throw new Error("Sistema de arquivos privado indisponivel para midia local.");
  }

  const encryptedStore = new EncryptedVideoStore();
  let encryptedAsset: LocalMediaAsset | null = null;

  try {
    appendMediaOperationalLog("preserve_local_video_start", {
      actualCameraMode: cameraMode,
      requestedCameraMode: requestedCameraMode ?? cameraMode
    });
    encryptedAsset = await encryptedStore.preserveEncryptedVideoAsset({
      packageId,
      sourceUri,
      cameraMode,
      requestedCameraMode,
      startedAt,
      completedAt,
      chunkSizeBytes,
      captureProfile,
      verificationMode,
      diagnosticRunId
    });

    const attachedPackage = await attachLocalMediaAsset(packageId, encryptedAsset);
    if (!attachedPackage) {
      throw new Error("Falha ao indexar video local no cofre.");
    }

    appendMediaOperationalLog("preserve_local_video_attached", {
      actualCameraMode: cameraMode,
      chunkCount: encryptedAsset.encryptedVideo?.chunkCount ?? 0,
      sizeBytes: encryptedAsset.sizeBytes
    });
    const cleanupSummary = await cleanupNativeMediaResidues();
    appendMediaOperationalLog("native_engine_cleanup", {
      deletedBytes: cleanupSummary.deletedBytes,
      deletedFiles: cleanupSummary.deletedFiles,
      nativeStatus: cleanupSummary.status
    });
    return encryptedAsset;
  } catch (error) {
    appendMediaOperationalLog("preserve_local_video_error", {
      actualCameraMode: cameraMode,
      encryptedAssetCreated: Boolean(encryptedAsset)
    }, error);
    if (encryptedAsset) {
      await encryptedStore.deleteEncryptedAsset(encryptedAsset).catch(() => undefined);
    }
    throw error;
  }
}

export async function deleteLocalMediaAssets(assets: LocalMediaAsset[]) {
  const encryptedStore = new EncryptedVideoStore();
  await Promise.all(assets.map((asset) => encryptedStore.deleteEncryptedAsset(asset)));
}
