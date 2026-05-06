import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import { deleteSecret, readSecret, saveSecret } from "@/security/secureStorage";
import { LocalVideoCameraMode } from "./emergencyPreferences";
import {
  EncryptedVideoChunkManifest,
  EncryptedVideoManifest,
  EncryptedVideoThumbnailManifest,
  encryptedVideoChunkAad,
  encryptedVideoManifestAad,
  encryptedVideoThumbnailAad
} from "./EncryptedVideoManifest";
import { CameraCaptureResidueCleaner } from "./CameraCaptureResidueCleaner";
import { SecureVideoThumbnailStore } from "./SecureVideoThumbnailStore";
import { EncryptedVideoEnvelope, LocalMediaAsset } from "./types";
import {
  createSha256,
  encryptedVideoAlgorithm,
  encryptedVideoProtocolVersion,
  sha256Hex,
  stableJson,
  VideoCryptoService
} from "./VideoCryptoService";
import { base64ToBytes, bytesToBase64, bytesToHex, bytesToUtf8, utf8ToBytes } from "./videoByteEncoding";

export const encryptedMediaDirectory = `${FileSystem.documentDirectory ?? ""}sinalseguro-media-encrypted/`;
export const encryptedVideoDefaultChunkSizeBytes = 512 * 1024;
const preserveYieldEveryChunks = 1;

type LocalFileInfo = {
  exists: boolean;
  size?: number | null;
};

type ActualCameraMode = Exclude<LocalVideoCameraMode, "both">;

export type PreserveEncryptedVideoInput = {
  packageId: string;
  sourceUri: string;
  cameraMode: ActualCameraMode;
  requestedCameraMode?: LocalVideoCameraMode;
  startedAt: string;
  completedAt?: string;
  chunkSizeBytes?: number;
};

export type VideoFileSystemAdapter = {
  makeDirectory: (uri: string) => Promise<void>;
  readBase64: (uri: string, position: number, length: number) => Promise<string>;
  writeBase64: (uri: string, value: string) => Promise<void>;
  writeUtf8: (uri: string, value: string) => Promise<void>;
  readBase64File: (uri: string) => Promise<string>;
  delete: (uri: string) => Promise<void>;
  getInfo: (uri: string) => Promise<LocalFileInfo>;
};

export function defaultVideoFileSystemAdapter(): VideoFileSystemAdapter {
  return {
    makeDirectory: (uri) => FileSystem.makeDirectoryAsync(uri, { intermediates: true }),
    readBase64: (uri, position, length) =>
      FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
        position,
        length
      }),
    writeBase64: (uri, value) =>
      FileSystem.writeAsStringAsync(uri, value, {
        encoding: FileSystem.EncodingType.Base64
      }),
    writeUtf8: (uri, value) => FileSystem.writeAsStringAsync(uri, value),
    readBase64File: (uri) =>
      FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
      }),
    delete: (uri) => FileSystem.deleteAsync(uri, { idempotent: true }),
    getInfo: async (uri) => {
      const info = await FileSystem.getInfoAsync(uri);
      return {
        exists: info.exists,
        size: "size" in info && typeof info.size === "number" ? info.size : null
      };
    }
  };
}

export function encryptedVideoKeyRef(assetId: string) {
  return `sinalseguro.encrypted-video-key.${assetId}`;
}

export class EncryptedVideoStore {
  private readonly captureResidueCleaner: CameraCaptureResidueCleaner;
  private readonly cryptoService: VideoCryptoService;
  private readonly fileSystem: VideoFileSystemAdapter;
  private readonly thumbnailStore: SecureVideoThumbnailStore;

  constructor(
    cryptoService = new VideoCryptoService(),
    fileSystem = defaultVideoFileSystemAdapter(),
    thumbnailStore = new SecureVideoThumbnailStore(cryptoService, fileSystem),
    captureResidueCleaner = new CameraCaptureResidueCleaner()
  ) {
    this.captureResidueCleaner = captureResidueCleaner;
    this.cryptoService = cryptoService;
    this.fileSystem = fileSystem;
    this.thumbnailStore = thumbnailStore;
  }

  async preserveEncryptedVideoAsset({
    packageId,
    sourceUri,
    cameraMode,
    requestedCameraMode,
    startedAt,
    completedAt = new Date().toISOString(),
    chunkSizeBytes = encryptedVideoDefaultChunkSizeBytes
  }: PreserveEncryptedVideoInput): Promise<LocalMediaAsset> {
    const sourceInfo = await this.fileSystem.getInfo(sourceUri);
    if (!sourceInfo.exists || !sourceInfo.size || sourceInfo.size <= 0) {
      throw new Error("Arquivo de video local incompleto ou indisponivel.");
    }
    const sourceSizeBytes = sourceInfo.size;

    const assetId = Crypto.randomUUID();
    const safeTimestamp = completedAt.replace(/[:.]/g, "-");
    const sourceFileName = `${packageId}-${cameraMode}-${safeTimestamp}.mp4`;
    const storageDirectoryUri = `${encryptedMediaDirectory}${assetId}/`;
    const chunksDirectoryUri = `${storageDirectoryUri}chunks/`;
    const manifestUri = `${storageDirectoryUri}manifest.sseg`;
    const keyRef = encryptedVideoKeyRef(assetId);
    const videoKey = this.cryptoService.generateVideoKey();
    const plaintextHash = cryptoHash();
    const ciphertextHash = cryptoHash();
    const chunks: EncryptedVideoChunkManifest[] = [];
    let encryptedSizeBytes = 0;
    let offset = 0;
    let keySaved = false;

    try {
      await this.fileSystem.makeDirectory(storageDirectoryUri);
      await this.fileSystem.makeDirectory(chunksDirectoryUri);
      await saveSecret(keyRef, bytesToBase64(videoKey));
      keySaved = true;

      while (offset < sourceSizeBytes) {
        const nextLength = Math.min(chunkSizeBytes, sourceSizeBytes - offset);
        const plaintextBytes = base64ToBytes(await this.fileSystem.readBase64(sourceUri, offset, nextLength));
        if (plaintextBytes.length === 0) {
          throw new Error("Leitura de chunk vazia durante preservacao criptografada.");
        }

        const chunkIndex = chunks.length;
        const chunkBase = {
          index: chunkIndex,
          plaintextOffset: offset,
          plaintextSizeBytes: plaintextBytes.length
        };
        const encrypted = this.cryptoService.encryptChunk(videoKey, plaintextBytes, encryptedVideoChunkAad(assetId, chunkBase));
        const chunkUri = `${chunksDirectoryUri}${String(chunkIndex).padStart(6, "0")}.sseg`;

        await this.fileSystem.writeBase64(chunkUri, bytesToBase64(encrypted.sealedBytes));
        plaintextHash.update(plaintextBytes);
        ciphertextHash.update(encrypted.sealedBytes);
        encryptedSizeBytes += encrypted.sealedBytes.length;
        chunks.push({
          ...chunkBase,
          chunkUri,
          sealedSizeBytes: encrypted.sealedBytes.length,
          ciphertextSizeBytes: encrypted.ciphertextBytes.length,
          nonce: encrypted.nonce,
          tag: encrypted.tag,
          plaintextSha256: sha256Hex(plaintextBytes),
          ciphertextSha256: sha256Hex(encrypted.sealedBytes)
        });
        offset += plaintextBytes.length;
        if (chunks.length % preserveYieldEveryChunks === 0) {
          await yieldToRuntime();
        }
      }

      const plaintextSha256 = hashDigestHex(plaintextHash);
      const ciphertextSha256 = hashDigestHex(ciphertextHash);
      const thumbnail = await this.thumbnailStore.deriveEncryptAndDeletePlainThumbnail({
        assetId,
        packageId,
        sourceUri,
        storageDirectoryUri,
        videoKey
      });
      const manifest: EncryptedVideoManifest = {
        protocolVersion: encryptedVideoProtocolVersion,
        algorithm: encryptedVideoAlgorithm,
        assetId,
        packageId,
        sourceFileName,
        mimeType: "video/mp4",
        codec: "video/mp4",
        durationMs: null,
        chunkSizeBytes,
        chunkCount: chunks.length,
        plaintextSizeBytes: sourceSizeBytes,
        encryptedSizeBytes,
        plaintextSha256,
        ciphertextSha256,
        recordedAt: startedAt,
        completedAt,
        cameraMode,
        requestedCameraMode,
        thumbnail,
        recipientKeyEnvelopes: [],
        chunks
      };
      const manifestPlaintextBytes = utf8ToBytes(stableJson(manifest));
      const encryptedManifest = this.cryptoService.encryptManifest(
        videoKey,
        manifestPlaintextBytes,
        encryptedVideoManifestAad(assetId, packageId)
      );

      await this.fileSystem.writeBase64(manifestUri, bytesToBase64(encryptedManifest.sealedBytes));
      const encryptedVideo: EncryptedVideoEnvelope = {
        protocolVersion: encryptedVideoProtocolVersion,
        algorithm: encryptedVideoAlgorithm,
        packageId,
        keyRef,
        manifestUri,
        manifestNonce: encryptedManifest.nonce,
        manifestTag: encryptedManifest.tag,
        manifestSha256: sha256Hex(encryptedManifest.sealedBytes),
        storageDirectoryUri,
        chunkSizeBytes,
        chunkCount: chunks.length,
        plaintextSizeBytes: sourceSizeBytes,
        encryptedSizeBytes,
        codec: "video/mp4",
        durationMs: null,
        recipientKeyEnvelopes: [],
        playbackAdapter: "range_data_source_required"
      };

      await this.verifyPreservedEncryptedVideo({ encryptedVideo, manifest, videoKey });
      const plaintextCleanup = await this.deletePlaintextAfterVerifiedPreservation(sourceUri);

      return {
        id: assetId,
        kind: "video",
        uri: storageDirectoryUri,
        fileName: sourceFileName,
        mimeType: "video/mp4",
        storage: "app_private_encrypted_chunks",
        cameraMode,
        requestedCameraMode,
        sizeBytes: sourceSizeBytes,
        sha256: plaintextSha256,
        hashMode: "chunked_plaintext_sha256",
        recordedAt: startedAt,
        completedAt,
        encryptionStatus: "encrypted_chunked_xchacha20poly1305",
        encryptedVideo: {
          ...encryptedVideo,
          plaintextCleanup
        }
      };
    } catch (error) {
      await this.fileSystem.delete(storageDirectoryUri).catch(() => undefined);
      if (keySaved) {
        await deleteSecret(keyRef).catch(() => undefined);
      }
      throw error;
    }
  }

  private async verifyPreservedEncryptedVideo({
    encryptedVideo,
    manifest,
    videoKey
  }: {
    encryptedVideo: EncryptedVideoEnvelope;
    manifest: EncryptedVideoManifest;
    videoKey: Uint8Array;
  }) {
    const storedKey = await readVideoKey(encryptedVideo.keyRef);
    if (bytesToBase64(storedKey) !== bytesToBase64(videoKey)) {
      throw new Error("Chave local do video nao confere apos gravacao segura.");
    }

    const sealedManifest = base64ToBytes(await this.fileSystem.readBase64File(encryptedVideo.manifestUri));
    if (sha256Hex(sealedManifest) !== encryptedVideo.manifestSha256) {
      throw new Error("Manifesto criptografado nao confere apos gravacao segura.");
    }

    const manifestBytes = this.cryptoService.decryptManifest(
      storedKey,
      sealedManifest,
      encryptedVideo.manifestNonce,
      encryptedVideoManifestAad(manifest.assetId, manifest.packageId)
    );
    const reopenedManifest = JSON.parse(bytesToUtf8(manifestBytes)) as EncryptedVideoManifest;
    if (stableJson(reopenedManifest) !== stableJson(manifest)) {
      throw new Error("Manifesto reaberto diverge do manifesto preservado.");
    }

    if (
      manifest.assetId !== encryptedVideo.storageDirectoryUri.split("/").filter(Boolean).at(-1) ||
      manifest.packageId !== encryptedVideo.packageId ||
      manifest.chunkCount !== manifest.chunks.length
    ) {
      throw new Error("Manifesto criptografado possui metadados incoerentes.");
    }

    const plaintextHash = cryptoHash();
    const ciphertextHash = cryptoHash();
    const seenNonces = new Set<string>();
    let expectedOffset = 0;
    let totalPlaintextSizeBytes = 0;
    let totalEncryptedSizeBytes = 0;

    for (const chunk of manifest.chunks) {
      if (
        chunk.index !== seenNonces.size ||
        chunk.plaintextOffset !== expectedOffset ||
        chunk.plaintextSizeBytes <= 0 ||
        seenNonces.has(chunk.nonce)
      ) {
        throw new Error("Manifesto de chunks possui offsets, indices ou nonces incoerentes.");
      }
      seenNonces.add(chunk.nonce);

      const sealedChunk = base64ToBytes(await this.fileSystem.readBase64File(chunk.chunkUri));
      if (sha256Hex(sealedChunk) !== chunk.ciphertextSha256) {
        throw new Error("Chunk criptografado nao confere apos gravacao segura.");
      }

      const plaintextChunk = this.cryptoService.decryptChunk(
        storedKey,
        sealedChunk,
        chunk.nonce,
        encryptedVideoChunkAad(manifest.assetId, chunk)
      );
      if (
        plaintextChunk.length !== chunk.plaintextSizeBytes ||
        sha256Hex(plaintextChunk) !== chunk.plaintextSha256
      ) {
        throw new Error("Chunk descriptografado nao confere apos gravacao segura.");
      }

      plaintextHash.update(plaintextChunk);
      ciphertextHash.update(sealedChunk);
      expectedOffset += plaintextChunk.length;
      totalPlaintextSizeBytes += plaintextChunk.length;
      totalEncryptedSizeBytes += sealedChunk.length;
      if (chunk.index % preserveYieldEveryChunks === 0) {
        await yieldToRuntime();
      }
    }

    if (
      totalPlaintextSizeBytes !== manifest.plaintextSizeBytes ||
      totalEncryptedSizeBytes !== manifest.encryptedSizeBytes ||
      hashDigestHex(plaintextHash) !== manifest.plaintextSha256 ||
      hashDigestHex(ciphertextHash) !== manifest.ciphertextSha256
    ) {
      throw new Error("Hashes agregados do video criptografado nao conferem.");
    }

    await this.verifyEncryptedThumbnail(manifest.thumbnail, manifest, storedKey);
  }

  private async verifyEncryptedThumbnail(
    thumbnail: EncryptedVideoThumbnailManifest,
    manifest: EncryptedVideoManifest,
    videoKey: Uint8Array
  ) {
    if (thumbnail.status !== "encrypted_image_v1") return;

    const sealedThumbnail = base64ToBytes(await this.fileSystem.readBase64File(thumbnail.thumbnailUri));
    if (sha256Hex(sealedThumbnail) !== thumbnail.ciphertextSha256) {
      throw new Error("Thumbnail criptografada nao confere apos gravacao segura.");
    }

    const plaintextThumbnail = this.cryptoService.decryptChunk(
      videoKey,
      sealedThumbnail,
      thumbnail.nonce,
      encryptedVideoThumbnailAad(manifest.assetId, manifest.packageId)
    );
    if (
      plaintextThumbnail.length !== thumbnail.plaintextSizeBytes ||
      sha256Hex(plaintextThumbnail) !== thumbnail.plaintextSha256
    ) {
      throw new Error("Thumbnail descriptografada nao confere apos gravacao segura.");
    }
  }

  private async deletePlaintextAfterVerifiedPreservation(sourceUri: string) {
    const attemptedAt = new Date().toISOString();
    let sourceDeleted = false;

    try {
      await this.fileSystem.delete(sourceUri);
      sourceDeleted = true;
    } catch {
      sourceDeleted = false;
    }

    await this.captureResidueCleaner.cleanupAfterSuccessfulPreservation({ sourceUri }).catch(() => undefined);

    if (!sourceDeleted) {
      const sourceInfo = await this.fileSystem.getInfo(sourceUri).catch(() => ({ exists: true }));
      sourceDeleted = !sourceInfo.exists;
    }

    return {
      attemptedAt,
      status: sourceDeleted ? "deleted" : "cleanup_pending"
    } as const;
  }

  async readManifest(asset: LocalMediaAsset) {
    const envelope = asset.encryptedVideo;
    if (!envelope) {
      throw new Error("Asset nao possui manifesto criptografado.");
    }

    const key = await readVideoKey(envelope.keyRef);
    const sealedManifest = base64ToBytes(await this.fileSystem.readBase64File(envelope.manifestUri));
    if (sha256Hex(sealedManifest) !== envelope.manifestSha256) {
      throw new Error("Manifesto criptografado corrompido.");
    }

    const manifestBytes = this.cryptoService.decryptManifest(
      key,
      sealedManifest,
      envelope.manifestNonce,
      encryptedVideoManifestAad(asset.id, envelope.packageId)
    );
    return JSON.parse(bytesToUtf8(manifestBytes)) as EncryptedVideoManifest;
  }

  async deleteEncryptedAsset(asset: LocalMediaAsset) {
    if (asset.encryptedVideo) {
      await this.fileSystem.delete(asset.encryptedVideo.storageDirectoryUri);
      await deleteSecret(asset.encryptedVideo.keyRef);
      return;
    }

    await this.fileSystem.delete(asset.uri);
  }

  getFileSystem() {
    return this.fileSystem;
  }
}

export async function readVideoKey(keyRef: string) {
  const encodedKey = await readSecret(keyRef);
  if (!encodedKey) {
    throw new Error("Chave local do video indisponivel.");
  }
  return base64ToBytes(encodedKey);
}

function cryptoHash() {
  return createSha256();
}

function hashDigestHex(hash: ReturnType<typeof cryptoHash>) {
  return bytesToHex(hash.digest());
}

function yieldToRuntime() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}
