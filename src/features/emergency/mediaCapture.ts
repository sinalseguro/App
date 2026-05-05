import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import { LocalVideoCameraMode } from "./emergencyPreferences";
import { attachLocalMediaAsset } from "./emergencyRecorder";
import { LocalMediaAsset } from "./types";

const MEDIA_DIRECTORY = `${FileSystem.documentDirectory ?? ""}sinalseguro-media/`;
const MAX_INLINE_MEDIA_HASH_BYTES = 25 * 1024 * 1024;

type LocalFileInfo = {
  md5?: string | null;
  size?: number | null;
};

type MediaDigestMetadata = {
  cameraMode: Exclude<LocalVideoCameraMode, "both">;
  completedAt: string;
  fileName: string;
  md5?: string | null;
  packageId: string;
  requestedCameraMode?: LocalVideoCameraMode;
  sizeBytes: number;
  startedAt: string;
  uri: string;
};

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

async function buildMediaDigest(
  destinationUri: string,
  fileInfo: LocalFileInfo,
  metadata: MediaDigestMetadata
): Promise<Pick<LocalMediaAsset, "hashMode" | "sha256">> {
  if (metadata.sizeBytes > 0 && metadata.sizeBytes <= MAX_INLINE_MEDIA_HASH_BYTES) {
    const contentSnapshot = await FileSystem.readAsStringAsync(destinationUri, {
      encoding: FileSystem.EncodingType.Base64
    });
    const sha256 = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      contentSnapshot
    );

    return {
      hashMode: "content_sha256",
      sha256
    };
  }

  const metadataSnapshot = JSON.stringify({
    ...metadata,
    md5: fileInfo.md5 ?? metadata.md5 ?? null
  });
  const sha256 = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    metadataSnapshot
  );

  return {
    hashMode: "metadata_sha256_pending_streaming",
    sha256
  };
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

  await FileSystem.makeDirectoryAsync(MEDIA_DIRECTORY, { intermediates: true });

  const safeTimestamp = completedAt.replace(/[:.]/g, "-");
  const fileName = `${packageId}-${cameraMode}-${safeTimestamp}.mp4`;
  const destinationUri = `${MEDIA_DIRECTORY}${fileName}`;
  let copiedToPrivateSandbox = false;

  try {
    await FileSystem.copyAsync({ from: sourceUri, to: destinationUri });
    copiedToPrivateSandbox = true;

    const fileInfo = await FileSystem.getInfoAsync(destinationUri, { md5: true });
    if (!fileInfo.exists) {
      throw new Error("Falha ao preservar video local no sandbox privado.");
    }

    const localFileInfo = fileInfo as LocalFileInfo;
    const sizeBytes = typeof localFileInfo.size === "number" ? localFileInfo.size : 0;
    const digest = await buildMediaDigest(destinationUri, localFileInfo, {
      cameraMode,
      completedAt,
      fileName,
      md5: localFileInfo.md5 ?? null,
      packageId,
      requestedCameraMode,
      sizeBytes,
      startedAt,
      uri: destinationUri
    });

    const asset: LocalMediaAsset = {
      id: Crypto.randomUUID(),
      kind: "video",
      uri: destinationUri,
      fileName,
      mimeType: "video/mp4",
      storage: "app_private_sandbox",
      cameraMode,
      requestedCameraMode,
      sizeBytes,
      sha256: digest.sha256,
      hashMode: digest.hashMode,
      recordedAt: startedAt,
      completedAt,
      encryptionStatus: "local_sandbox_pending_backend_envelope"
    };

    const attachedPackage = await attachLocalMediaAsset(packageId, asset);
    if (!attachedPackage) {
      throw new Error("Falha ao indexar video local no cofre.");
    }

    if (sourceUri !== destinationUri) {
      await FileSystem.deleteAsync(sourceUri, { idempotent: true }).catch(() => undefined);
    }

    return asset;
  } catch (error) {
    if (copiedToPrivateSandbox) {
      await FileSystem.deleteAsync(destinationUri, { idempotent: true }).catch(() => undefined);
    }
    if (sourceUri !== destinationUri) {
      await FileSystem.deleteAsync(sourceUri, { idempotent: true }).catch(() => undefined);
    }
    throw error;
  }
}

export async function deleteLocalMediaAssets(assets: LocalMediaAsset[]) {
  await Promise.all(
    assets.map((asset) => FileSystem.deleteAsync(asset.uri, { idempotent: true }).catch(() => undefined))
  );
}
