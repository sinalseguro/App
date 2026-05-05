import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import { deleteSecret, readSecret, saveSecret } from "@/security/secureStorage";
import { LocalVideoCameraMode } from "./emergencyPreferences";
import {
  EncryptedVideoChunkManifest,
  EncryptedVideoManifest,
  encryptedVideoChunkAad,
  encryptedVideoManifestAad
} from "./EncryptedVideoManifest";
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
  private readonly cryptoService: VideoCryptoService;
  private readonly fileSystem: VideoFileSystemAdapter;

  constructor(cryptoService = new VideoCryptoService(), fileSystem = defaultVideoFileSystemAdapter()) {
    this.cryptoService = cryptoService;
    this.fileSystem = fileSystem;
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
      }

      const plaintextSha256 = hashDigestHex(plaintextHash);
      const ciphertextSha256 = hashDigestHex(ciphertextHash);
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
        thumbnail: {
          status: "pending_secure_derivation",
          reason: "Thumbnail sera derivado de faixa descriptografada temporaria em adaptador nativo/streaming."
        },
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

      await this.fileSystem.delete(sourceUri);

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
        encryptedVideo
      };
    } catch (error) {
      await this.fileSystem.delete(storageDirectoryUri).catch(() => undefined);
      if (keySaved) {
        await deleteSecret(keyRef).catch(() => undefined);
      }
      await this.fileSystem.delete(sourceUri).catch(() => undefined);
      throw error;
    }
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
