import assert from "node:assert/strict";
import { CameraCaptureResidueCleaner, CaptureResidueFileSystemAdapter } from "../src/features/emergency/CameraCaptureResidueCleaner";
import { EncryptedVideoDataSource } from "../src/features/emergency/EncryptedVideoDataSource";
import { EncryptedVideoPlaybackCache, PlaybackCacheFileSystem } from "../src/features/emergency/EncryptedVideoPlaybackCache";
import { buildStreamingHeaders, parseHttpRequestHeader, parseSingleRange } from "../src/features/emergency/EncryptedVideoRangeHttp";
import { PlaintextMediaResidueCleaner } from "../src/features/emergency/PlaintextMediaResidueCleaner";
import {
  clearMediaDiagnosticEvents,
  createMediaDiagnosticRun,
  listMediaDiagnosticEvents,
  startMediaDiagnosticEvent,
  summarizeMediaDiagnostics
} from "../src/features/emergency/MediaDiagnostics";
import {
  EncryptedVideoChunkManifest,
  EncryptedVideoManifest,
  encryptedVideoThumbnailAad,
  encryptedVideoChunkAad
} from "../src/features/emergency/EncryptedVideoManifest";
import type { VideoFileSystemAdapter } from "../src/features/emergency/EncryptedVideoStore";
import { SecureVideoThumbnailStore } from "../src/features/emergency/SecureVideoThumbnailStore";
import { LocalMediaAsset } from "../src/features/emergency/types";
import {
  encryptedVideoAlgorithm,
  encryptedVideoProtocolVersion,
  sha256Hex,
  VideoCryptoService,
  VideoCryptoRandomSource
} from "../src/features/emergency/VideoCryptoService";
import { bytesToBase64, concatBytes } from "../src/features/emergency/videoByteEncoding";

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

class MemoryPlayableFile {
  exists = false;
  readonly uri: string;
  bytes = new Uint8Array();

  constructor(assetId: string) {
    this.uri = `memory-cache://${assetId}.mp4`;
  }

  create() {
    this.exists = true;
    this.bytes = new Uint8Array();
  }

  delete() {
    this.exists = false;
    this.bytes = new Uint8Array();
  }

  open() {
    return {
      close: () => undefined,
      writeBytes: (nextBytes: Uint8Array) => {
        this.bytes = concatBytes([this.bytes, nextBytes]);
      }
    };
  }
}

class MemoryPlaybackCacheFileSystem implements PlaybackCacheFileSystem {
  files = new Map<string, MemoryPlayableFile>();

  ensureCacheDirectory() {
    return undefined;
  }

  getPlayableFile(assetId: string) {
    const currentFile = this.files.get(assetId);
    if (currentFile) return currentFile;

    const nextFile = new MemoryPlayableFile(assetId);
    this.files.set(assetId, nextFile);
    return nextFile;
  }
}

class MemoryVideoFileSystemAdapter implements VideoFileSystemAdapter {
  readonly deleteCalls: string[] = [];
  readonly directories = new Set<string>();
  readonly failDeleteUris = new Set<string>();
  failWriteIncludes: string | null = null;
  readonly files = new Map<string, Uint8Array>();

  async makeDirectory(uri: string) {
    this.directories.add(uri);
  }

  async readBase64(uri: string, position: number, length: number) {
    const file = this.files.get(uri);
    assert.ok(file, `Arquivo ${uri} precisa existir no filesystem simulado.`);
    return bytesToBase64(file.subarray(position, position + length));
  }

  async writeBase64(uri: string, value: string) {
    if (this.failWriteIncludes && uri.includes(this.failWriteIncludes)) {
      throw new Error("Falha simulada de escrita.");
    }

    this.files.set(uri, Buffer.from(value, "base64"));
  }

  async writeUtf8(uri: string, value: string) {
    this.files.set(uri, new TextEncoder().encode(value));
  }

  async readBase64File(uri: string) {
    const file = this.files.get(uri);
    assert.ok(file, `Arquivo ${uri} precisa existir no filesystem simulado.`);
    return bytesToBase64(file);
  }

  async delete(uri: string) {
    this.deleteCalls.push(uri);
    if (this.failDeleteUris.has(uri)) {
      throw new Error("Falha simulada de exclusao.");
    }

    if (uri.endsWith("/")) {
      for (const fileUri of [...this.files.keys()]) {
        if (fileUri.startsWith(uri)) {
          this.files.delete(fileUri);
        }
      }
      for (const directoryUri of [...this.directories]) {
        if (directoryUri.startsWith(uri)) {
          this.directories.delete(directoryUri);
        }
      }
      return;
    }

    this.files.delete(uri);
  }

  async getInfo(uri: string) {
    const file = this.files.get(uri);
    if (file) {
      return { exists: true, size: file.length };
    }

    return { exists: this.directories.has(uri), size: null };
  }
}

class MemoryCaptureResidueFileSystem implements CaptureResidueFileSystemAdapter {
  cacheDirectory = "cache://";
  readonly deletedUris: string[] = [];
  readonly entries = new Map<string, { modificationTime: number; size: number }>();

  async delete(uri: string) {
    this.deletedUris.push(uri);
    this.entries.delete(uri);
  }

  async getInfo(uri: string) {
    const entry = this.entries.get(uri);
    return entry ? { exists: true, modificationTime: entry.modificationTime } : { exists: false };
  }

  async readDirectory(uri: string) {
    return [...this.entries.keys()]
      .filter((entryUri) => entryUri.startsWith(uri))
      .map((entryUri) => entryUri.slice(uri.length));
  }
}

function buildVideoAsset(assetIdOverride = assetId): LocalMediaAsset {
  return {
    id: assetIdOverride,
    kind: "video",
    uri: `memory://${assetIdOverride}`,
    fileName: "test.mp4",
    mimeType: "video/mp4",
    storage: "app_private_encrypted_chunks",
    cameraMode: "front",
    requestedCameraMode: "front",
    sizeBytes: plaintext.length,
    sha256: sha256Hex(plaintext),
    hashMode: "chunked_plaintext_sha256",
    recordedAt: manifest.recordedAt,
    completedAt: manifest.completedAt,
    encryptionStatus: "encrypted_chunked_xchacha20poly1305",
    encryptedVideo: {
      protocolVersion: encryptedVideoProtocolVersion,
      algorithm: encryptedVideoAlgorithm,
      packageId,
      keyRef: `key://${assetIdOverride}`,
      manifestUri: `manifest://${assetIdOverride}`,
      manifestNonce: "unused",
      manifestTag: "unused",
      manifestSha256: "unused",
      storageDirectoryUri: `memory://${assetIdOverride}/`,
      chunkSizeBytes: manifest.chunkSizeBytes,
      chunkCount: manifest.chunkCount,
      plaintextSizeBytes: manifest.plaintextSizeBytes,
      encryptedSizeBytes: manifest.encryptedSizeBytes,
      codec: "video/mp4",
      durationMs: null,
      recipientKeyEnvelopes: [],
      playbackAdapter: "range_data_source_required"
    }
  };
}

function buildPlaybackCache(sealedChunkSource = sealedChunks) {
  const fileSystem: Pick<VideoFileSystemAdapter, "readBase64File"> = {
    readBase64File: async (uri) => {
      const chunkIndex = Number(uri.replace("memory://", ""));
      const sealed = sealedChunkSource.get(chunkIndex);
      assert.ok(sealed, `Chunk ${chunkIndex} precisa existir no armazenamento simulado.`);
      return bytesToBase64(sealed);
    }
  };
  const store = {
    getFileSystem: () => fileSystem as VideoFileSystemAdapter,
    readManifest: async () => manifest
  };
  const cacheFileSystem = new MemoryPlaybackCacheFileSystem();
  const cache = new EncryptedVideoPlaybackCache(store, dataSource, cacheFileSystem, async () => key);
  return { cache, cacheFileSystem };
}

async function run() {
  clearMediaDiagnosticEvents();
  const diagnosticRunId = createMediaDiagnosticRun("unit");
  const diagnosticTimer = startMediaDiagnosticEvent(diagnosticRunId, "preserve_encrypt_chunks");
  diagnosticTimer.finish("ok", {
    chunkCount: 3,
    keyRef: "secret-key-ref",
    manifestUri: "file:///private/path/manifest.sseg",
    nonce: "secret-nonce",
    platform: "android",
    sourceSizeBytes: 1536,
    url: "http://127.0.0.1:1234/capability/video.mp4"
  });
  const diagnosticEvents = listMediaDiagnosticEvents(diagnosticRunId);
  assert.equal(diagnosticEvents.length, 1);
  assert.equal(diagnosticEvents[0].metrics?.chunkCount, 3);
  assert.equal(diagnosticEvents[0].metrics?.platform, "android");
  assert.equal(diagnosticEvents[0].metrics?.sourceSizeBytes, 1536);
  assert.equal("keyRef" in (diagnosticEvents[0].metrics ?? {}), false);
  assert.equal("manifestUri" in (diagnosticEvents[0].metrics ?? {}), false);
  assert.equal("nonce" in (diagnosticEvents[0].metrics ?? {}), false);
  assert.equal("url" in (diagnosticEvents[0].metrics ?? {}), false);
  assert.equal(summarizeMediaDiagnostics(diagnosticRunId).events.length, 1);

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

  const streamedParts: Uint8Array[] = [];
  const streamedChunkIndexes: number[] = [];
  await dataSource.streamRange({
    key,
    manifest,
    start: 511,
    length: 514,
    readSealedChunk,
    onChunk: (bytes, context) => {
      streamedParts.push(bytes);
      streamedChunkIndexes.push(context.chunkIndex);
    }
  });
  assert.deepEqual(concatBytes(streamedParts), plaintext.subarray(511, 1025));
  assert.deepEqual(streamedChunkIndexes, [0, 1, 2]);

  const emptyStreamedParts: Uint8Array[] = [];
  await dataSource.streamRange({
    key,
    manifest,
    start: plaintext.length,
    length: 99,
    readSealedChunk,
    onChunk: (bytes) => emptyStreamedParts.push(bytes)
  });
  assert.equal(emptyStreamedParts.length, 0);

  assert.deepEqual(parseSingleRange("bytes=0-1023", plaintext.length), {
    endExclusive: 1024,
    length: 1024,
    start: 0,
    status: 206
  });
  assert.deepEqual(parseSingleRange("bytes=100-", plaintext.length), {
    endExclusive: plaintext.length,
    length: plaintext.length - 100,
    start: 100,
    status: 206
  });
  assert.deepEqual(parseSingleRange("bytes=-50", plaintext.length), {
    endExclusive: plaintext.length,
    length: 50,
    start: plaintext.length - 50,
    status: 206
  });
  assert.throws(() => parseSingleRange("bytes=0-1,3-4", plaintext.length), /Multirange/);
  assert.throws(() => parseSingleRange("bytes=99999-100000", plaintext.length), /fora/);

  const request = parseHttpRequestHeader("GET /token/video.mp4 HTTP/1.1\r\nRange: bytes=0-99\r\nHost: 127.0.0.1\r\n\r\n");
  assert.equal(request.method, "GET");
  assert.equal(request.path, "/token/video.mp4");
  assert.equal(request.headers.range, "bytes=0-99");
  assert.match(
    buildStreamingHeaders({
      contentLength: 100,
      contentRange: `bytes 0-99/${plaintext.length}`,
      status: 206
    }),
    /HTTP\/1\.1 206 Partial Content/
  );

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

  const playbackAsset = buildVideoAsset();
  const { cache, cacheFileSystem } = buildPlaybackCache();
  const progressEvents: Array<{ completedChunks: number; totalChunks: number }> = [];
  const playableUri = await cache.preparePlayableUri(playbackAsset, {
    onProgress: (progress) => progressEvents.push(progress)
  });
  const playableFile = cacheFileSystem.getPlayableFile(playbackAsset.id);
  assert.equal(playableUri, playableFile.uri);
  assert.equal(playableFile.exists, true);
  assert.deepEqual(playableFile.bytes, plaintext);
  assert.equal(progressEvents.at(-1)?.completedChunks, manifest.chunkCount);

  const cancelledPlayback = buildPlaybackCache();
  const abortController = new AbortController();
  await assert.rejects(
    () =>
      cancelledPlayback.cache.preparePlayableUri(playbackAsset, {
        abortSignal: abortController.signal,
        onProgress: () => abortController.abort()
      }),
    /cancelada/
  );
  const cancelledFile = cancelledPlayback.cacheFileSystem.getPlayableFile(playbackAsset.id);
  assert.equal(cancelledFile.exists, false);
  assert.equal(cancelledFile.bytes.length, 0);

  const corruptedPlaybackChunks = new Map(sealedChunks);
  const corruptedPlaybackChunk = new Uint8Array(corruptedPlaybackChunks.get(1)!);
  corruptedPlaybackChunk[3] ^= 0xff;
  corruptedPlaybackChunks.set(1, corruptedPlaybackChunk);
  const corruptedPlayback = buildPlaybackCache(corruptedPlaybackChunks);
  await assert.rejects(
    () => corruptedPlayback.cache.preparePlayableUri(playbackAsset),
    /corrompido|autenticacao|integridade/
  );
  const corruptedFile = corruptedPlayback.cacheFileSystem.getPlayableFile(playbackAsset.id);
  assert.equal(corruptedFile.exists, false);

  const thumbnailFileSystem = new MemoryVideoFileSystemAdapter();
  const sourceUri = "memory://cache/Camera/source.mp4";
  const plaintextThumbnailUri = "memory://cache/VideoThumbnails/source.jpg";
  const thumbnailBytes = new Uint8Array([3, 1, 4, 1, 5, 9, 2, 6]);
  thumbnailFileSystem.files.set(sourceUri, plaintext);
  const secureThumbnailStore = new SecureVideoThumbnailStore(
    cryptoService,
    thumbnailFileSystem,
    async () => {
      thumbnailFileSystem.files.set(plaintextThumbnailUri, thumbnailBytes);
      return { height: 90, uri: plaintextThumbnailUri, width: 160 };
    }
  );
  const secureThumbnail = await secureThumbnailStore.deriveEncryptAndDeletePlainThumbnail({
    assetId,
    packageId,
    sourceUri,
    storageDirectoryUri: "memory://encrypted/asset-test/",
    videoKey: key
  });
  assert.equal(thumbnailFileSystem.files.has(plaintextThumbnailUri), false);
  assert.equal(secureThumbnail.status, "encrypted_image_v1");
  if (secureThumbnail.status === "encrypted_image_v1") {
    assert.equal(thumbnailFileSystem.files.has(secureThumbnail.thumbnailUri), true);
    assert.equal(secureThumbnail.plaintextSha256, sha256Hex(thumbnailBytes));
    const sealedThumbnail = thumbnailFileSystem.files.get(secureThumbnail.thumbnailUri)!;
    const reopenedThumbnail = cryptoService.decryptChunk(
      key,
      sealedThumbnail,
      secureThumbnail.nonce,
      encryptedVideoThumbnailAad(assetId, packageId)
    );
    assert.deepEqual(reopenedThumbnail, thumbnailBytes);
  }

  const pendingThumbnailFileSystem = new MemoryVideoFileSystemAdapter();
  const pendingThumbnail = await new SecureVideoThumbnailStore(
    cryptoService,
    pendingThumbnailFileSystem,
    async () => {
      throw new Error("Falha simulada de thumbnail.");
    }
  ).deriveEncryptAndDeletePlainThumbnail({
    assetId,
    packageId,
    sourceUri,
    storageDirectoryUri: "memory://encrypted/asset-test/",
    videoKey: key
  });
  assert.equal(pendingThumbnail.status, "pending_secure_derivation");

  const residueFileSystem = new MemoryCaptureResidueFileSystem();
  residueFileSystem.entries.set("cache://Camera/preserved.mp4", { modificationTime: 1000, size: 10 });
  residueFileSystem.entries.set("cache://Camera/stale.mp4", { modificationTime: 1000, size: 11 });
  residueFileSystem.entries.set("cache://Camera/fresh.mp4", { modificationTime: 1_800_000, size: 12 });
  residueFileSystem.entries.set("cache://Camera/thumbnail.jpg", { modificationTime: 1000, size: 13 });
  residueFileSystem.entries.set("cache://Other/other.mp4", { modificationTime: 1000, size: 14 });
  const residueCleaner = new CameraCaptureResidueCleaner(residueFileSystem);
  const residueResult = await residueCleaner.cleanupAfterSuccessfulPreservation({
    nowMs: 2_000_000,
    sourceUri: "cache://Camera/preserved.mp4",
    staleBeforeMs: 1_500_000
  });
  assert.deepEqual(residueResult.deletedUris.sort(), ["cache://Camera/preserved.mp4", "cache://Camera/stale.mp4"]);
  assert.equal(residueFileSystem.entries.has("cache://Camera/fresh.mp4"), true);
  assert.equal(residueFileSystem.entries.has("cache://Camera/thumbnail.jpg"), true);
  assert.equal(residueFileSystem.entries.has("cache://Other/other.mp4"), true);

  const legacyPlaintextFileSystem = new MemoryCaptureResidueFileSystem();
  legacyPlaintextFileSystem.entries.set("doc://sinalseguro-media/referenced.mp4", { modificationTime: 1000, size: 10 });
  legacyPlaintextFileSystem.entries.set("doc://sinalseguro-media/stale.mp4", { modificationTime: 1000, size: 11 });
  legacyPlaintextFileSystem.entries.set("doc://sinalseguro-media/fresh.mp4", { modificationTime: 1_800_000, size: 12 });
  legacyPlaintextFileSystem.entries.set("doc://sinalseguro-media/note.txt", { modificationTime: 1000, size: 13 });
  const legacyPlaintextCleaner = new PlaintextMediaResidueCleaner(
    legacyPlaintextFileSystem,
    "doc://sinalseguro-media/"
  );
  const legacyPlaintextCleanup = await legacyPlaintextCleaner.cleanupUnreferencedLegacyVideos({
    nowMs: 2_000_000,
    referencedUris: ["doc://sinalseguro-media/referenced.mp4"],
    staleBeforeMs: 1_500_000
  });
  assert.equal(legacyPlaintextCleanup.blockedReferencedCount, 1);
  assert.equal(legacyPlaintextCleanup.deletedCount, 1);
  assert.equal(legacyPlaintextFileSystem.entries.has("doc://sinalseguro-media/referenced.mp4"), true);
  assert.equal(legacyPlaintextFileSystem.entries.has("doc://sinalseguro-media/stale.mp4"), false);
  assert.equal(legacyPlaintextFileSystem.entries.has("doc://sinalseguro-media/fresh.mp4"), true);
  assert.equal(legacyPlaintextFileSystem.entries.has("doc://sinalseguro-media/note.txt"), true);

  console.log("Testes de video criptografado em chunks aprovados.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
