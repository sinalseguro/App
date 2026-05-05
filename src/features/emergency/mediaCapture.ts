import * as FileSystem from "expo-file-system/legacy";
import { LocalVideoCameraMode } from "./emergencyPreferences";
import { EncryptedVideoStore } from "./EncryptedVideoStore";
import { attachLocalMediaAsset } from "./emergencyRecorder";
import { LocalMediaAsset } from "./types";

type PreserveLocalVideoInput = {
  packageId: string;
  sourceUri: string;
  cameraMode: Exclude<LocalVideoCameraMode, "both">;
  requestedCameraMode?: LocalVideoCameraMode;
  startedAt: string;
  completedAt?: string;
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
  completedAt = new Date().toISOString()
}: PreserveLocalVideoInput) {
  if (!canPreserveLocalMedia()) {
    throw new Error("Sistema de arquivos privado indisponivel para midia local.");
  }

  const encryptedStore = new EncryptedVideoStore();
  let encryptedAsset: LocalMediaAsset | null = null;

  try {
    encryptedAsset = await encryptedStore.preserveEncryptedVideoAsset({
      packageId,
      sourceUri,
      cameraMode,
      requestedCameraMode,
      startedAt,
      completedAt
    });

    const attachedPackage = await attachLocalMediaAsset(packageId, encryptedAsset);
    if (!attachedPackage) {
      throw new Error("Falha ao indexar video local no cofre.");
    }

    return encryptedAsset;
  } catch (error) {
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
