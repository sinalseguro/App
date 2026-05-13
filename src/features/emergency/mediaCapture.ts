import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import { deleteSecret, saveSecret } from "@/security/secureStorage";
import { CameraCaptureResidueCleaner } from "./CameraCaptureResidueCleaner";
import { LocalVideoCameraMode } from "./emergencyPreferences";
import { EncryptedVideoStore, encryptedVideoKeyRef } from "./EncryptedVideoStore";
import {
  createMediaDiagnosticRun,
  startMediaDiagnosticEvent,
  summarizeMediaDiagnostics
} from "./MediaDiagnostics";
import { appendMediaOperationalLog } from "./MediaOperationalLog";
import {
  cleanupNativeMediaResidues,
  encryptSegmentWithNativeMediaEngine,
  isSinalSeguroMediaEngineAvailable
} from "./SinalSeguroMediaEngine";
import { attachLocalMediaAsset } from "./emergencyRecorder";
import { LocalMediaAsset, MediaCaptureCompatibilityProfile } from "./types";
import { nativeEncryptedVideoAlgorithm } from "./VideoCryptoService";
import { bytesToBase64 } from "./videoByteEncoding";

type PreserveLocalVideoInput = {
  packageId: string;
  sourceUri: string;
  cameraMode: Exclude<LocalVideoCameraMode, "both">;
  requestedCameraMode?: LocalVideoCameraMode;
  startedAt: string;
  completedAt?: string;
  chunkSizeBytes?: number;
  cleanupResidueSourceOnly?: boolean;
  captureProfile?: MediaCaptureCompatibilityProfile;
  diagnosticRunId?: string;
  verificationMode?: "full" | "bounded";
};

export function canPreserveLocalMedia() {
  return Boolean(FileSystem.documentDirectory);
}

function nativeSegmentAad(assetId: string, packageId: string) {
  return JSON.stringify({ assetId, packageId });
}

async function preserveWithNativeEngine({
  packageId,
  sourceUri,
  cameraMode,
  requestedCameraMode,
  startedAt,
  completedAt = new Date().toISOString(),
  cleanupResidueSourceOnly = false,
  captureProfile,
  diagnosticRunId = createMediaDiagnosticRun("native-preserve")
}: PreserveLocalVideoInput): Promise<LocalMediaAsset> {
  const assetId = Crypto.randomUUID();
  const keyRef = encryptedVideoKeyRef(assetId);
  const safeTimestamp = completedAt.replace(/[:.]/g, "-");
  const fileName = `${packageId}-${cameraMode}-${safeTimestamp}.mp4`;
  const keyBase64 = bytesToBase64(Crypto.getRandomBytes(32));
  const totalTimer = startMediaDiagnosticEvent(diagnosticRunId, "native_engine_segment_total");
  const encryptTimer = startMediaDiagnosticEvent(diagnosticRunId, "native_engine_encrypt_segment");

  await saveSecret(keyRef, keyBase64);
  appendMediaOperationalLog("native_engine_preserve_start", {
    actualCameraMode: cameraMode,
    processingState: "encrypting",
    storageEngine: "native_segmented_v1"
  });

  try {
    const segmentSummary = await encryptSegmentWithNativeMediaEngine({
      sourceUri,
      segmentId: assetId,
      keyBase64,
      aad: nativeSegmentAad(assetId, packageId),
      deleteSource: true,
      packageId,
      emergencySessionId: null
    });
    const captureResidueCleanup = await new CameraCaptureResidueCleaner()
      .cleanupAfterSuccessfulPreservation({ sourceOnly: cleanupResidueSourceOnly, sourceUri })
      .catch(() => ({ deletedUris: [], inspectedDirectoryUri: null }));
    const normalizedSourceUri = normalizeMediaUri(sourceUri);
    const sourceDeletedByResidueCleanup = captureResidueCleanup.deletedUris.some(
      (deletedUri) => normalizeMediaUri(deletedUri) === normalizedSourceUri
    );
    const sourceDeleted = segmentSummary.sourceDeleted || sourceDeletedByResidueCleanup;
    encryptTimer.finish("ok", {
      encryptedSizeBytes: segmentSummary.encryptedSizeBytes,
      plaintextSizeBytes: segmentSummary.plaintextSizeBytes,
      sourceDeleted
    });
    totalTimer.finish("ok", {
      encryptedSizeBytes: segmentSummary.encryptedSizeBytes,
      plaintextSizeBytes: segmentSummary.plaintextSizeBytes,
      sourceDeleted
    });
    appendMediaOperationalLog("native_engine_preserve_success", {
      actualCameraMode: cameraMode,
      captureResidueDeletedFiles: captureResidueCleanup.deletedUris.length,
      encryptedSizeBytes: segmentSummary.encryptedSizeBytes,
      plaintextSizeBytes: segmentSummary.plaintextSizeBytes,
      processingState: sourceDeleted ? "cleanup" : "error",
      sourceDeleted
    });

    return {
      id: assetId,
      kind: "video",
      uri: segmentSummary.segmentUri,
      fileName,
      mimeType: "video/mp4",
      storage: "app_private_native_segments",
      cameraMode,
      requestedCameraMode,
      sizeBytes: segmentSummary.plaintextSizeBytes,
      sha256: segmentSummary.plaintextSha256,
      hashMode: "content_sha256",
      recordedAt: startedAt,
      completedAt,
      captureProfile,
      encryptionStatus: "encrypted_native_segmented_v1",
      encryptedVideo: {
        protocolVersion: "sinalseguro.encrypted-video.v1",
        algorithm: nativeEncryptedVideoAlgorithm,
        packageId,
        keyId: keyRef,
        keyRef,
        emergencySessionId: null,
        envelopeScope: "media_asset",
        storageEngine: "native_segmented_v1",
        manifestUri: segmentSummary.segmentUri,
        manifestNonce: segmentSummary.nonceBase64,
        manifestTag: segmentSummary.tagBase64,
        manifestSha256: segmentSummary.ciphertextSha256,
        storageDirectoryUri: segmentSummary.segmentUri,
        chunkSizeBytes: segmentSummary.plaintextSizeBytes,
        chunkCount: 1,
        plaintextSizeBytes: segmentSummary.plaintextSizeBytes,
        encryptedSizeBytes: segmentSummary.encryptedSizeBytes,
        codec: "video/mp4",
        durationMs: null,
        plaintextCleanup: {
          attemptedAt: segmentSummary.completedAt,
          status: sourceDeleted ? "deleted" : "cleanup_pending"
        },
        captureProfile,
        diagnostics: summarizeMediaDiagnostics(diagnosticRunId),
        recipientKeyEnvelopes: [],
        playbackAdapter: "native_encrypted_source",
        nativePlayback: {
          engine: "SinalSeguroMediaEngine",
          sourceUri: segmentSummary.segmentUri,
          temporaryCleartextPolicy: "cache_no_backup_delete_on_close"
        },
        processingState: "attached"
      }
    };
  } catch (error) {
    encryptTimer.finish("error", undefined, error);
    totalTimer.finish("error", undefined, error);
    await deleteSecret(keyRef).catch(() => undefined);
    appendMediaOperationalLog("native_engine_preserve_error", {
      actualCameraMode: cameraMode,
      processingState: "error"
    }, error);
    throw error;
  }
}

async function preserveWithJsStore({
  packageId,
  sourceUri,
  cameraMode,
  requestedCameraMode,
  startedAt,
  completedAt = new Date().toISOString(),
  chunkSizeBytes,
  cleanupResidueSourceOnly = false,
  captureProfile,
  verificationMode,
  diagnosticRunId
}: PreserveLocalVideoInput): Promise<LocalMediaAsset> {
  const encryptedStore = new EncryptedVideoStore();
  return encryptedStore.preserveEncryptedVideoAsset({
    packageId,
    sourceUri,
    cameraMode,
    requestedCameraMode,
    startedAt,
    completedAt,
    chunkSizeBytes,
    cleanupResidueSourceOnly,
    captureProfile,
    verificationMode,
    diagnosticRunId
  });
}

export async function preserveLocalVideoAsset(input: PreserveLocalVideoInput) {
  if (!canPreserveLocalMedia()) {
    appendMediaOperationalLog("preserve_filesystem_unavailable");
    throw new Error("Sistema de arquivos privado indisponivel para midia local.");
  }

  const useNativeEngine = isSinalSeguroMediaEngineAvailable();
  const encryptedStore = new EncryptedVideoStore();
  let encryptedAsset: LocalMediaAsset | null = null;

  try {
    appendMediaOperationalLog("preserve_local_video_start", {
      actualCameraMode: input.cameraMode,
      processingState: "packaging",
      requestedCameraMode: input.requestedCameraMode ?? input.cameraMode,
      storageEngine: useNativeEngine ? "native_segmented_v1" : "js_chunked_v1"
    });
    encryptedAsset = useNativeEngine ? await preserveWithNativeEngine(input) : await preserveWithJsStore(input);

    const attachedPackage = await attachLocalMediaAsset(input.packageId, encryptedAsset);
    if (!attachedPackage) {
      throw new Error("Falha ao indexar video local no cofre.");
    }

    appendMediaOperationalLog("preserve_local_video_attached", {
      actualCameraMode: input.cameraMode,
      chunkCount: encryptedAsset.encryptedVideo?.chunkCount ?? 0,
      processingState: "attached",
      sizeBytes: encryptedAsset.sizeBytes,
      storageEngine: encryptedAsset.encryptedVideo?.storageEngine ?? "js_chunked_v1"
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
      actualCameraMode: input.cameraMode,
      encryptedAssetCreated: Boolean(encryptedAsset),
      processingState: "error",
      storageEngine: useNativeEngine ? "native_segmented_v1" : "js_chunked_v1"
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

function normalizeMediaUri(value: string) {
  return value.replace(/\/+$/, "");
}
