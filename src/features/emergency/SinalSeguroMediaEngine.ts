import * as FileSystem from "expo-file-system/legacy";
import { NativeModules, Platform } from "react-native";
import { readSecret } from "@/security/secureStorage";
import { appendMediaOperationalLog } from "./MediaOperationalLog";
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

export type NativeOpenEncryptedAssetsInput = {
  packageId: string;
  assetSetId: string;
  assets: NativeOpenEncryptedAssetInput[];
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
  openEncryptedAssets(input: NativeOpenEncryptedAssetsInput): Promise<NativePlaybackHandle>;
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
    typeof module.openEncryptedAssets === "function" &&
    typeof module.closePlaybackHandle === "function" &&
    typeof module.cleanupMediaResidues === "function"
  );
}

export function isNativeEncryptedPlaybackAsset(asset?: LocalMediaAsset | null) {
  return (
    asset?.encryptedVideo?.storageEngine === "native_segmented_v1" &&
    asset.encryptedVideo.playbackAdapter === "native_encrypted_source" &&
    asset.encryptedVideo.nativePlayback?.engine === "SinalSeguroMediaEngine" &&
    Boolean(asset.encryptedVideo.nativePlayback.sourceUri)
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

  return module.openEncryptedAsset(await buildNativeOpenEncryptedAssetInput(asset));
}

export async function openNativeEncryptedAssets(assets: LocalMediaAsset[], packageId?: string) {
  const module = getReadyNativeMediaEngine();
  const playableAssets = assets.filter(isNativeEncryptedPlaybackAsset);
  if (!module || playableAssets.length !== assets.length || playableAssets.length === 0) {
    return null;
  }

  const nativeInputs = await Promise.all(playableAssets.map(buildNativeOpenEncryptedAssetInput));
  const playbackPackageId = packageId ?? nativeInputs[0]?.packageId;
  const inputPackageIds = new Set(nativeInputs.map((input) => input.packageId).filter(Boolean));
  if (!playbackPackageId || inputPackageIds.size !== 1 || !inputPackageIds.has(playbackPackageId)) {
    throw new Error("native_playback_package_unavailable");
  }

  return module.openEncryptedAssets({
    packageId: playbackPackageId,
    assetSetId: `${playbackPackageId}:${nativeInputs.map((input) => input.assetId).join("|")}`,
    assets: nativeInputs
  });
}

async function buildNativeOpenEncryptedAssetInput(asset: LocalMediaAsset): Promise<NativeOpenEncryptedAssetInput> {
  if (!isNativeEncryptedPlaybackAsset(asset) || !asset.encryptedVideo) {
    throw new Error("native_playback_asset_unavailable");
  }

  const keyBase64 = await readSecret(asset.encryptedVideo.keyRef);
  const persistedSourceUri = asset.encryptedVideo.nativePlayback?.sourceUri ?? asset.uri;
  const sourceUri = resolveNativeSegmentSourceUri(persistedSourceUri);
  if (!keyBase64 || !sourceUri) {
    throw new Error("native_playback_key_unavailable");
  }

  return {
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
  };
}

function resolveNativeSegmentSourceUri(sourceUri?: string) {
  if (!sourceUri || Platform.OS !== "ios") return sourceUri;

  const segmentDirectoryMarker = "/sinalseguro-native-media/segments/";
  const markerIndex = sourceUri.indexOf(segmentDirectoryMarker);
  if (markerIndex < 0 || !FileSystem.documentDirectory) return sourceUri;

  const storedFileName = sourceUri
    .slice(markerIndex + segmentDirectoryMarker.length)
    .split(/[?#]/)[0];
  if (!storedFileName || storedFileName.includes("/")) return sourceUri;

  const rebasedSourceUri = `${FileSystem.documentDirectory}sinalseguro-native-media/segments/${storedFileName}`;
  if (rebasedSourceUri !== sourceUri) {
    appendMediaOperationalLog("native_playback_source_uri_rebased", {
      platform: Platform.OS,
      storageEngine: "native_segmented_v1"
    });
  }
  return rebasedSourceUri;
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
