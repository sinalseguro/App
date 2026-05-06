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
  verifyPlaintextHash?: boolean;
};

export type EncryptedVideoRangeStreamRequest = EncryptedVideoRangeRequest & {
  abortSignal?: AbortSignal;
  onChunk: (bytes: Uint8Array, context: { chunkIndex: number; start: number; endExclusive: number }) => Promise<void> | void;
};

export class EncryptedVideoDataSource {
  private readonly cryptoService: VideoCryptoService;

  constructor(cryptoService = new VideoCryptoService()) {
    this.cryptoService = cryptoService;
  }

  async readChunk(
    key: Uint8Array,
    manifest: EncryptedVideoManifest,
    chunkIndex: number,
    readSealedChunk: EncryptedVideoChunkReader,
    options: { verifyPlaintextHash?: boolean } = {}
  ) {
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

    if (options.verifyPlaintextHash !== false && sha256Hex(plaintextBytes) !== chunk.plaintextSha256) {
      throw new Error("Chunk de video falhou na verificacao de integridade.");
    }

    return plaintextBytes;
  }

  async readRange({ key, manifest, start, length, readSealedChunk, verifyPlaintextHash = true }: EncryptedVideoRangeRequest) {
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

      const plaintextChunk = await this.readChunk(key, manifest, chunk.index, readSealedChunk, {
        verifyPlaintextHash
      });
      const sliceStart = Math.max(0, start - chunkStart);
      const sliceEnd = Math.min(plaintextChunk.length, endExclusive - chunkStart);
      rangeParts.push(plaintextChunk.subarray(sliceStart, sliceEnd));
    }

    return concatBytes(rangeParts);
  }

  async streamRange({
    key,
    manifest,
    start,
    length,
    readSealedChunk,
    verifyPlaintextHash = true,
    abortSignal,
    onChunk
  }: EncryptedVideoRangeStreamRequest) {
    if (start < 0 || length < 0) {
      throw new Error("Faixa de video invalida.");
    }

    if (length === 0 || start >= manifest.plaintextSizeBytes) {
      return;
    }

    const endExclusive = Math.min(start + length, manifest.plaintextSizeBytes);

    for (const chunk of manifest.chunks) {
      throwIfAborted(abortSignal);
      const chunkStart = chunk.plaintextOffset;
      const chunkEnd = chunk.plaintextOffset + chunk.plaintextSizeBytes;
      if (chunkEnd <= start) continue;
      if (chunkStart >= endExclusive) break;

      const plaintextChunk = await this.readChunk(key, manifest, chunk.index, readSealedChunk, {
        verifyPlaintextHash
      });
      throwIfAborted(abortSignal);
      const sliceStart = Math.max(0, start - chunkStart);
      const sliceEnd = Math.min(plaintextChunk.length, endExclusive - chunkStart);
      await onChunk(plaintextChunk.subarray(sliceStart, sliceEnd), {
        chunkIndex: chunk.index,
        start: chunkStart + sliceStart,
        endExclusive: chunkStart + sliceEnd
      });
    }
  }
}

function throwIfAborted(abortSignal?: AbortSignal) {
  if (abortSignal?.aborted) {
    throw new Error("Leitura de video cancelada.");
  }
}
