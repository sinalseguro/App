import { EncryptedVideoThumbnailManifest, encryptedVideoThumbnailAad } from "./EncryptedVideoManifest";
import { sha256Hex, VideoCryptoService } from "./VideoCryptoService";
import { base64ToBytes, bytesToBase64 } from "./videoByteEncoding";

const defaultThumbnailTimeMs = 500;
const defaultThumbnailQuality = 0.42;
const encryptedThumbnailFileName = "thumbnail.sseg";

declare const require: (moduleName: string) => any;

type ThumbnailResult = {
  height: number;
  uri: string;
  width: number;
};

export type SecureThumbnailFileInfo = {
  exists: boolean;
  size?: number | null;
};

export type SecureThumbnailFileSystemAdapter = {
  delete: (uri: string) => Promise<void>;
  getInfo: (uri: string) => Promise<SecureThumbnailFileInfo>;
  readBase64File: (uri: string) => Promise<string>;
  writeBase64: (uri: string, value: string) => Promise<void>;
};

export type VideoThumbnailGenerator = (
  sourceUri: string,
  options: { quality: number; time: number }
) => Promise<ThumbnailResult>;

export type SecureVideoThumbnailInput = {
  assetId: string;
  capturedAtMs?: number;
  generatedAt?: string;
  packageId: string;
  sourceUri: string;
  storageDirectoryUri: string;
  videoKey: Uint8Array;
};

export class SecureVideoThumbnailStore {
  private readonly cryptoService: VideoCryptoService;
  private readonly fileSystem: SecureThumbnailFileSystemAdapter;
  private readonly thumbnailGenerator: VideoThumbnailGenerator;

  constructor(
    cryptoService = new VideoCryptoService(),
    fileSystem: SecureThumbnailFileSystemAdapter,
    thumbnailGenerator: VideoThumbnailGenerator = defaultVideoThumbnailGenerator
  ) {
    this.cryptoService = cryptoService;
    this.fileSystem = fileSystem;
    this.thumbnailGenerator = thumbnailGenerator;
  }

  async deriveEncryptAndDeletePlainThumbnail({
    assetId,
    capturedAtMs = defaultThumbnailTimeMs,
    generatedAt = new Date().toISOString(),
    packageId,
    sourceUri,
    storageDirectoryUri,
    videoKey
  }: SecureVideoThumbnailInput): Promise<EncryptedVideoThumbnailManifest> {
    const encryptedThumbnailUri = `${storageDirectoryUri}${encryptedThumbnailFileName}`;
    let plaintextThumbnailUri: string | null = null;

    try {
      const thumbnail = await this.thumbnailGenerator(sourceUri, {
        quality: defaultThumbnailQuality,
        time: capturedAtMs
      });
      plaintextThumbnailUri = thumbnail.uri;

      const thumbnailInfo = await this.fileSystem.getInfo(thumbnail.uri);
      if (!thumbnailInfo.exists || !thumbnailInfo.size || thumbnailInfo.size <= 0) {
        throw new Error("Thumbnail temporaria indisponivel.");
      }

      const plaintextBytes = base64ToBytes(await this.fileSystem.readBase64File(thumbnail.uri));
      if (plaintextBytes.length === 0) {
        throw new Error("Thumbnail temporaria vazia.");
      }

      const encrypted = this.cryptoService.encryptChunk(
        videoKey,
        plaintextBytes,
        encryptedVideoThumbnailAad(assetId, packageId)
      );
      await this.fileSystem.writeBase64(encryptedThumbnailUri, bytesToBase64(encrypted.sealedBytes));

      return {
        status: "encrypted_image_v1",
        capturedAtMs,
        ciphertextSha256: sha256Hex(encrypted.sealedBytes),
        ciphertextSizeBytes: encrypted.ciphertextBytes.length,
        generatedAt,
        height: thumbnail.height,
        mimeType: "image/jpeg",
        nonce: encrypted.nonce,
        plaintextSha256: sha256Hex(plaintextBytes),
        plaintextSizeBytes: plaintextBytes.length,
        sealedSizeBytes: encrypted.sealedBytes.length,
        tag: encrypted.tag,
        thumbnailUri: encryptedThumbnailUri,
        width: thumbnail.width
      };
    } catch {
      await this.fileSystem.delete(encryptedThumbnailUri).catch(() => undefined);
      return {
        status: "pending_secure_derivation",
        reason: "Thumbnail segura pendente: modulo nativo indisponivel ou video ainda indisponivel."
      };
    } finally {
      if (plaintextThumbnailUri) {
        await this.fileSystem.delete(plaintextThumbnailUri).catch(() => undefined);
      }
    }
  }
}

async function defaultVideoThumbnailGenerator(sourceUri: string, options: { quality: number; time: number }) {
  const videoThumbnails = require("expo-video-thumbnails");
  return videoThumbnails.getThumbnailAsync(sourceUri, options) as Promise<ThumbnailResult>;
}
