import {
  EncryptedVideoChunkManifest,
  EncryptedVideoManifest,
  encryptedVideoChunkAad
} from "./EncryptedVideoManifest";
import { sha256Hex, VideoCryptoService } from "./VideoCryptoService";
import { concatBytes } from "./videoByteEncoding";

export type EncryptedVideoChunkReader = (chunk: EncryptedVideoChunkManifest) => Promise<Uint8Array>;

export type EncryptedVideoRangeRequest = {
  key: Uint8Array;
  manifest: EncryptedVideoManifest;
  start: number;
  length: number;
  readSealedChunk: EncryptedVideoChunkReader;
};

export class EncryptedVideoDataSource {
  private readonly cryptoService: VideoCryptoService;

  constructor(cryptoService = new VideoCryptoService()) {
    this.cryptoService = cryptoService;
  }

  async readChunk(key: Uint8Array, manifest: EncryptedVideoManifest, chunkIndex: number, readSealedChunk: EncryptedVideoChunkReader) {
    const chunk = manifest.chunks[chunkIndex];
    if (!chunk) {
      throw new Error("Chunk de video fora do manifesto.");
    }

    const sealedBytes = await readSealedChunk(chunk);
    if (sha256Hex(sealedBytes) !== chunk.ciphertextSha256) {
      throw new Error("Chunk de video corrompido antes da descriptografia.");
    }

    const plaintextBytes = this.cryptoService.decryptChunk(
      key,
      sealedBytes,
      chunk.nonce,
      encryptedVideoChunkAad(manifest.assetId, chunk)
    );

    if (sha256Hex(plaintextBytes) !== chunk.plaintextSha256) {
      throw new Error("Chunk de video falhou na verificacao de integridade.");
    }

    return plaintextBytes;
  }

  async readRange({ key, manifest, start, length, readSealedChunk }: EncryptedVideoRangeRequest) {
    if (start < 0 || length < 0) {
      throw new Error("Faixa de video invalida.");
    }

    if (length === 0 || start >= manifest.plaintextSizeBytes) {
      return new Uint8Array();
    }

    const endExclusive = Math.min(start + length, manifest.plaintextSizeBytes);
    const rangeParts: Uint8Array[] = [];

    for (const chunk of manifest.chunks) {
      const chunkStart = chunk.plaintextOffset;
      const chunkEnd = chunk.plaintextOffset + chunk.plaintextSizeBytes;
      if (chunkEnd <= start) continue;
      if (chunkStart >= endExclusive) break;

      const plaintextChunk = await this.readChunk(key, manifest, chunk.index, readSealedChunk);
      const sliceStart = Math.max(0, start - chunkStart);
      const sliceEnd = Math.min(plaintextChunk.length, endExclusive - chunkStart);
      rangeParts.push(plaintextChunk.subarray(sliceStart, sliceEnd));
    }

    return concatBytes(rangeParts);
  }
}
