import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import { LocalVideoCameraMode } from "./emergencyPreferences";
import { attachLocalMediaAsset } from "./emergencyRecorder";
import { LocalMediaAsset } from "./types";

const MEDIA_DIRECTORY = `${FileSystem.documentDirectory ?? ""}sinalseguro-media/`;

type PreserveLocalVideoInput = {
  packageId: string;
  sourceUri: string;
  cameraMode: LocalVideoCameraMode;
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
  startedAt,
  completedAt = new Date().toISOString()
}: PreserveLocalVideoInput) {
  if (!canPreserveLocalMedia()) {
    throw new Error("Sistema de arquivos privado indisponivel para midia local.");
  }

  await FileSystem.makeDirectoryAsync(MEDIA_DIRECTORY, { intermediates: true });

  const safeTimestamp = completedAt.replace(/[:.]/g, "-");
  const fileName = `${packageId}-${safeTimestamp}.mp4`;
  const destinationUri = `${MEDIA_DIRECTORY}${fileName}`;
  await FileSystem.copyAsync({ from: sourceUri, to: destinationUri });
  if (sourceUri !== destinationUri) {
    await FileSystem.deleteAsync(sourceUri, { idempotent: true }).catch(() => undefined);
  }

  const fileInfo = await FileSystem.getInfoAsync(destinationUri, { md5: true });
  if (!fileInfo.exists) {
    throw new Error("Falha ao preservar video local no sandbox privado.");
  }

  const contentSnapshot = await FileSystem.readAsStringAsync(destinationUri, {
    encoding: FileSystem.EncodingType.Base64
  });
  const sha256 = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    contentSnapshot
  );

  const asset: LocalMediaAsset = {
    id: Crypto.randomUUID(),
    kind: "video",
    uri: destinationUri,
    fileName,
    mimeType: "video/mp4",
    storage: "app_private_sandbox",
    cameraMode,
    sizeBytes: fileInfo.size,
    sha256,
    recordedAt: startedAt,
    completedAt,
    encryptionStatus: "local_sandbox_pending_backend_envelope"
  };

  await attachLocalMediaAsset(packageId, asset);
  return asset;
}

export async function deleteLocalMediaAssets(assets: LocalMediaAsset[]) {
  await Promise.all(
    assets.map((asset) => FileSystem.deleteAsync(asset.uri, { idempotent: true }).catch(() => undefined))
  );
}
