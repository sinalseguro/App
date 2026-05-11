import { NativeModules, Platform } from "react-native";
import { readSecret } from "@/security/secureStorage";
import { LocalMediaAsset } from "./types";

export type NativeMediaEngineName = "SinalSeguroMediaEngine";
export type NativeStorageEngine = "native_segmented_v1";
export type NativePlaybackAdapter = "native_encrypted_source";

export type NativeEncryptedSegmentInput = {
  sourceUri: string;
  outputDirectoryUri?: string;
  segmentId: string;
  keyBase64: string;
  aad?: string;
  deleteSource?: boolean;
  packageId?: string;
  emergencySessionId?: string | null;
};

export type EncryptedSegmentSummary = {
  schemaVersion: "sinalseguro.native-media-segment.v1";
  status: "encrypted";
  engine: NativeMediaEngineName;
  storageEngine: NativeStorageEngine;
  segmentId: string;
  segmentUri: string;
  algorithm: "aes-256-gcm";
  nonceBase64: string;
  tagBase64: string;
  plaintextSizeBytes: number;
  encryptedSizeBytes: number;
  plaintextSha256: string;
  ciphertextSha256: string;
  sourceDeleted: boolean;
  completedAt: string;
};

export type NativePlaybackHandle = {
  schemaVersion: "sinalseguro.native-playback-handle.v1";
  status: "opened";
  engine: NativeMediaEngineName;
  adapter: NativePlaybackAdapter;
  handleId: string;
  playableUri: string;
  openedAt: string;
};

export type NativeOpenEncryptedAssetInput = {
  assetId: string;
  packageId: string;
  keyBase64: string;
  nonceBase64: string;
  tagBase64?: string;
  ciphertextSha256?: string;
  aad?: string;
  emergencySessionId?: string | null;
  storageEngine: NativeStorageEngine;
  playbackAdapter: NativePlaybackAdapter;
  sourceUri: string;
};

export type CleanupSummary = {
  schemaVersion: "sinalseguro.native-media-cleanup.v1";
  status: "ok" | "unavailable" | "error";
  engine: NativeMediaEngineName;
  deletedFiles: number;
  deletedBytes: number;
  completedAt: string;
  errorCode?: "native_module_unavailable" | "native_cleanup_failed";
};

type NativeMediaEngineModule = {
  encryptSegment(input: NativeEncryptedSegmentInput): Promise<EncryptedSegmentSummary>;
  openEncryptedAsset(input: NativeOpenEncryptedAssetInput): Promise<NativePlaybackHandle>;
  closePlaybackHandle(handleId: string): Promise<void>;
  cleanupMediaResidues(): Promise<CleanupSummary>;
};

const nativeMediaEngine = NativeModules.SinalSeguroMediaEngine as NativeMediaEngineModule | undefined;

export function isSinalSeguroMediaEngineAvailable() {
  const module = getNativeMediaEngine();
  return (
    (Platform.OS === "android" || Platform.OS === "ios") &&
    typeof module?.encryptSegment === "function" &&
    typeof module.openEncryptedAsset === "function" &&
    typeof module.closePlaybackHandle === "function" &&
    typeof module.cleanupMediaResidues === "function"
  );
}

export function isNativeEncryptedPlaybackAsset(asset?: LocalMediaAsset | null) {
  return (
    asset?.encryptedVideo?.storageEngine === "native_segmented_v1" &&
    asset.encryptedVideo.playbackAdapter === "native_encrypted_source" &&
    asset.encryptedVideo.nativePlayback?.engine === "SinalSeguroMediaEngine"
  );
}

export async function encryptSegmentWithNativeMediaEngine(input: NativeEncryptedSegmentInput) {
  const module = getReadyNativeMediaEngine();
  if (!module) {
    throw new Error("native_media_engine_unavailable");
  }

  return module.encryptSegment(input);
}

export async function openNativeEncryptedAsset(asset: LocalMediaAsset) {
  const module = getReadyNativeMediaEngine();
  if (!isNativeEncryptedPlaybackAsset(asset) || !asset.encryptedVideo || !module) {
    return null;
  }

  const keyBase64 = await readSecret(asset.encryptedVideo.keyRef);
  const sourceUri = asset.encryptedVideo.nativePlayback?.sourceUri ?? asset.uri;
  if (!keyBase64 || !sourceUri) {
    throw new Error("native_playback_key_unavailable");
  }

  return module.openEncryptedAsset({
    assetId: asset.id,
    packageId: asset.encryptedVideo.packageId,
    keyBase64,
    nonceBase64: asset.encryptedVideo.manifestNonce,
    tagBase64: asset.encryptedVideo.manifestTag,
    ciphertextSha256: asset.encryptedVideo.manifestSha256,
    aad: JSON.stringify({ assetId: asset.id, packageId: asset.encryptedVideo.packageId }),
    emergencySessionId: asset.encryptedVideo.emergencySessionId ?? null,
    storageEngine: "native_segmented_v1",
    playbackAdapter: "native_encrypted_source",
    sourceUri
  });
}

export async function closeNativePlaybackHandle(handle?: NativePlaybackHandle | null) {
  const module = getReadyNativeMediaEngine();
  if (!handle || !module) return;

  await module.closePlaybackHandle(handle.handleId);
}

export async function cleanupNativeMediaResidues(): Promise<CleanupSummary> {
  const module = getReadyNativeMediaEngine();
  if (!module) {
    return {
      schemaVersion: "sinalseguro.native-media-cleanup.v1",
      status: "unavailable",
      engine: "SinalSeguroMediaEngine",
      deletedFiles: 0,
      deletedBytes: 0,
      completedAt: new Date().toISOString(),
      errorCode: "native_module_unavailable"
    };
  }

  try {
    return await module.cleanupMediaResidues();
  } catch {
    return {
      schemaVersion: "sinalseguro.native-media-cleanup.v1",
      status: "error",
      engine: "SinalSeguroMediaEngine",
      deletedFiles: 0,
      deletedBytes: 0,
      completedAt: new Date().toISOString(),
      errorCode: "native_cleanup_failed"
    };
  }
}

function getNativeMediaEngine() {
  return nativeMediaEngine;
}

function getReadyNativeMediaEngine() {
  return isSinalSeguroMediaEngineAvailable() ? nativeMediaEngine : undefined;
}
