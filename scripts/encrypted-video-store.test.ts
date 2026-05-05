import assert from "node:assert/strict";
import { EncryptedVideoDataSource } from "../src/features/emergency/EncryptedVideoDataSource";
import {
  EncryptedVideoChunkManifest,
  EncryptedVideoManifest,
  encryptedVideoChunkAad
} from "../src/features/emergency/EncryptedVideoManifest";
import {
  encryptedVideoAlgorithm,
  encryptedVideoProtocolVersion,
  sha256Hex,
  VideoCryptoService,
  VideoCryptoRandomSource
} from "../src/features/emergency/VideoCryptoService";
import { concatBytes } from "../src/features/emergency/videoByteEncoding";

class DeterministicRandomSource implements VideoCryptoRandomSource {
  private cursor = 1;

  getRandomBytes(byteCount: number) {
    const bytes = new Uint8Array(byteCount);
    for (let index = 0; index < byteCount; index += 1) {
      bytes[index] = (this.cursor + index) % 251;
    }
    this.cursor += byteCount;
    return bytes;
  }
}

const cryptoService = new VideoCryptoService(new DeterministicRandomSource());
const dataSource = new EncryptedVideoDataSource(cryptoService);
const key = cryptoService.generateVideoKey();
const assetId = "asset-test";
const packageId = "package-test";
const plaintext = new Uint8Array(2200);

for (let index = 0; index < plaintext.length; index += 1) {
  plaintext[index] = (index * 17 + 23) % 251;
}

const chunkSizeBytes = 512;
const sealedChunks = new Map<number, Uint8Array>();
const chunks: EncryptedVideoChunkManifest[] = [];

for (let offset = 0; offset < plaintext.length; offset += chunkSizeBytes) {
  const chunkPlaintext = plaintext.subarray(offset, Math.min(offset + chunkSizeBytes, plaintext.length));
  const chunkBase = {
    index: chunks.length,
    plaintextOffset: offset,
    plaintextSizeBytes: chunkPlaintext.length
  };
  const encrypted = cryptoService.encryptChunk(key, chunkPlaintext, encryptedVideoChunkAad(assetId, chunkBase));

  sealedChunks.set(chunkBase.index, encrypted.sealedBytes);
  chunks.push({
    ...chunkBase,
    chunkUri: `memory://${chunkBase.index}`,
    sealedSizeBytes: encrypted.sealedBytes.length,
    ciphertextSizeBytes: encrypted.ciphertextBytes.length,
    nonce: encrypted.nonce,
    tag: encrypted.tag,
    plaintextSha256: sha256Hex(chunkPlaintext),
    ciphertextSha256: sha256Hex(encrypted.sealedBytes)
  });
}

const manifest: EncryptedVideoManifest = {
  protocolVersion: encryptedVideoProtocolVersion,
  algorithm: encryptedVideoAlgorithm,
  assetId,
  packageId,
  sourceFileName: "test.mp4",
  mimeType: "video/mp4",
  codec: "video/mp4",
  durationMs: null,
  chunkSizeBytes,
  chunkCount: chunks.length,
  plaintextSizeBytes: plaintext.length,
  encryptedSizeBytes: [...sealedChunks.values()].reduce((total, value) => total + value.length, 0),
  plaintextSha256: sha256Hex(plaintext),
  ciphertextSha256: sha256Hex(concatBytes([...sealedChunks.values()])),
  recordedAt: "2026-05-05T00:00:00.000Z",
  completedAt: "2026-05-05T00:00:03.000Z",
  cameraMode: "front",
  requestedCameraMode: "front",
  thumbnail: {
    status: "pending_secure_derivation",
    reason: "Teste unitario nao gera thumbnail real."
  },
  recipientKeyEnvelopes: [],
  chunks
};

const readSealedChunk = async (chunk: EncryptedVideoChunkManifest) => {
  const sealed = sealedChunks.get(chunk.index);
  assert.ok(sealed, `Chunk ${chunk.index} precisa existir no armazenamento simulado.`);
  return sealed;
};

async function run() {
  const firstChunk = await dataSource.readChunk(key, manifest, 0, readSealedChunk);
  assert.deepEqual(firstChunk, plaintext.subarray(0, chunkSizeBytes));

  const partialRange = await dataSource.readRange({
    key,
    manifest,
    start: 400,
    length: 1000,
    readSealedChunk
  });
  assert.deepEqual(partialRange, plaintext.subarray(400, 1400));

  const replayRange = await dataSource.readRange({
    key,
    manifest,
    start: 400,
    length: 1000,
    readSealedChunk
  });
  assert.deepEqual(replayRange, partialRange);

  const seekRange = await dataSource.readRange({
    key,
    manifest,
    start: 1799,
    length: 230,
    readSealedChunk
  });
  assert.deepEqual(seekRange, plaintext.subarray(1799, 2029));

  const corruptedSealedChunks = new Map(sealedChunks);
  const corruptedChunk = new Uint8Array(corruptedSealedChunks.get(1)!);
  corruptedChunk[3] ^= 0xff;
  corruptedSealedChunks.set(1, corruptedChunk);

  await assert.rejects(
    () =>
      dataSource.readRange({
        key,
        manifest,
        start: 520,
        length: 16,
        readSealedChunk: async (chunk) => corruptedSealedChunks.get(chunk.index)!
      }),
    /corrompido|autenticacao|integridade/
  );

  const wrongKey = cryptoService.generateVideoKey();
  await assert.rejects(
    () => dataSource.readChunk(wrongKey, manifest, 0, readSealedChunk),
    /autenticacao/
  );

  console.log("Testes de video criptografado em chunks aprovados.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
