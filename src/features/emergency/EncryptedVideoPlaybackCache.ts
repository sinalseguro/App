import { EncryptedVideoDataSource } from "./EncryptedVideoDataSource";
import type { VideoFileSystemAdapter } from "./EncryptedVideoStore";
import { EncryptedVideoManifest } from "./EncryptedVideoManifest";
import { LocalMediaAsset } from "./types";
import { base64ToBytes } from "./videoByteEncoding";

const playerCacheDirectoryName = "sinalseguro-player-cache";
const playbackYieldEveryChunks = 4;

declare const require: (moduleName: string) => any;

export type PreparePlayableUriOptions = {
  abortSignal?: AbortSignal;
  onProgress?: (progress: { completedChunks: number; totalChunks: number }) => void;
};

type VideoPlaybackStore = {
  getFileSystem: () => VideoFileSystemAdapter;
  readManifest: (asset: LocalMediaAsset) => Promise<EncryptedVideoManifest>;
};

type VideoPlaybackDataSource = Pick<EncryptedVideoDataSource, "readChunk">;

type PlaybackCacheWritableHandle = {
  close: () => void;
  writeBytes: (bytes: Uint8Array) => void;
};

type PlaybackCacheWritableFile = {
  readonly exists: boolean;
  readonly uri: string;
  create: (options?: { overwrite?: boolean }) => void;
  delete: () => void;
  open: () => PlaybackCacheWritableHandle;
};

export type PlaybackCacheFileSystem = {
  clearAll?: () => Promise<void> | void;
  ensureCacheDirectory: () => void;
  getPlayableFile: (assetId: string) => PlaybackCacheWritableFile;
};

export class EncryptedVideoPlaybackCache {
  private readonly dataSource: VideoPlaybackDataSource;
  private readonly fileSystem: PlaybackCacheFileSystem;
  private readonly keyReader: (keyRef: string) => Promise<Uint8Array>;
  private readonly store: VideoPlaybackStore;

  constructor(
    store: VideoPlaybackStore = defaultVideoPlaybackStore(),
    dataSource: VideoPlaybackDataSource = new EncryptedVideoDataSource(),
    fileSystem: PlaybackCacheFileSystem = defaultPlaybackCacheFileSystem(),
    keyReader = defaultVideoKeyReader
  ) {
    this.store = store;
    this.dataSource = dataSource;
    this.fileSystem = fileSystem;
    this.keyReader = keyReader;
  }

  async preparePlayableUri(asset: LocalMediaAsset, options: PreparePlayableUriOptions = {}) {
    if (!asset.encryptedVideo) {
      return asset.uri;
    }

    throwIfAborted(options.abortSignal);
    const manifest = await this.store.readManifest(asset);
    throwIfAborted(options.abortSignal);
    const key = await this.keyReader(asset.encryptedVideo.keyRef);
    throwIfAborted(options.abortSignal);
    this.fileSystem.ensureCacheDirectory();

    const playableFile = this.fileSystem.getPlayableFile(asset.id);
    if (playableFile.exists) {
      playableFile.delete();
    }
    playableFile.create({ overwrite: true });

    const handle = playableFile.open();
    const progressStep = Math.max(1, Math.floor(manifest.chunkCount / 20));
    try {
      for (const chunk of manifest.chunks) {
        throwIfAborted(options.abortSignal);
        const plaintextChunk = await this.dataSource.readChunk(key, manifest, chunk.index, async (chunkManifest) =>
          base64ToBytes(await this.store.getFileSystem().readBase64File(chunkManifest.chunkUri))
        , {
          verifyPlaintextHash: false
        }
        );
        throwIfAborted(options.abortSignal);
        handle.writeBytes(plaintextChunk);
        const completedChunks = chunk.index + 1;
        if (completedChunks % progressStep === 0 || completedChunks === manifest.chunkCount) {
          options.onProgress?.({
            completedChunks,
            totalChunks: manifest.chunkCount
          });
        }
        if (completedChunks % playbackYieldEveryChunks === 0) {
          await yieldToRuntime();
        }
      }
    } catch (error) {
      playableFile.delete();
      throw error;
    } finally {
      handle.close();
    }

    return playableFile.uri;
  }

  deletePlayableUri(assetId: string) {
    const playableFile = this.fileSystem.getPlayableFile(assetId);
    if (playableFile.exists) {
      playableFile.delete();
    }
  }

  async clearAll() {
    await this.fileSystem.clearAll?.();
  }
}

function defaultVideoPlaybackStore(): VideoPlaybackStore {
  const { EncryptedVideoStore } = require("./EncryptedVideoStore");
  return new EncryptedVideoStore();
}

async function defaultVideoKeyReader(keyRef: string) {
  const { readVideoKey } = require("./EncryptedVideoStore");
  return readVideoKey(keyRef);
}

function defaultPlaybackCacheFileSystem(): PlaybackCacheFileSystem {
  return {
    clearAll: async () => {
      const legacyFileSystem = require("expo-file-system/legacy");
      const cacheDirectory = legacyFileSystem.cacheDirectory;
      if (cacheDirectory) {
        await legacyFileSystem.deleteAsync(`${cacheDirectory}${playerCacheDirectoryName}/`, {
          idempotent: true
        });
      }
    },
    ensureCacheDirectory: () => {
      const { Directory, Paths } = require("expo-file-system");
      new Directory(Paths.cache, playerCacheDirectoryName).create({ idempotent: true, intermediates: true });
    },
    getPlayableFile: (assetId) => {
      const { Directory, File, Paths } = require("expo-file-system");
      return new File(new Directory(Paths.cache, playerCacheDirectoryName), `${assetId}.mp4`);
    }
  };
}

function throwIfAborted(abortSignal?: AbortSignal) {
  if (abortSignal?.aborted) {
    throw new Error("Preparacao do video cancelada.");
  }
}

function yieldToRuntime() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}
