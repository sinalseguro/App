const cameraCacheDirectoryName = "Camera";
const defaultStaleResidueAgeMs = 2 * 60 * 1000;

declare const require: (moduleName: string) => any;

export type CaptureResidueFileInfo = {
  exists: boolean;
  modificationTime?: number | null;
};

export type CaptureResidueFileSystemAdapter = {
  cacheDirectory: string | null | undefined;
  delete: (uri: string) => Promise<void>;
  getInfo: (uri: string) => Promise<CaptureResidueFileInfo>;
  readDirectory: (uri: string) => Promise<string[]>;
};

export type CaptureResidueCleanupOptions = {
  nowMs?: number;
  sourceUri?: string;
  staleBeforeMs?: number;
};

export type CaptureResidueCleanupResult = {
  deletedUris: string[];
  inspectedDirectoryUri: string | null;
};

export class CameraCaptureResidueCleaner {
  private readonly fileSystem: CaptureResidueFileSystemAdapter;

  constructor(fileSystem: CaptureResidueFileSystemAdapter = defaultCaptureResidueFileSystemAdapter()) {
    this.fileSystem = fileSystem;
  }

  async cleanupAfterSuccessfulPreservation({
    nowMs = Date.now(),
    sourceUri,
    staleBeforeMs = nowMs - defaultStaleResidueAgeMs
  }: CaptureResidueCleanupOptions = {}): Promise<CaptureResidueCleanupResult> {
    const cacheDirectory = this.fileSystem.cacheDirectory;
    if (!cacheDirectory) {
      return { deletedUris: [], inspectedDirectoryUri: null };
    }

    const cameraDirectoryUri = `${ensureTrailingSlash(cacheDirectory)}${cameraCacheDirectoryName}/`;
    let entries: string[];
    try {
      entries = await this.fileSystem.readDirectory(cameraDirectoryUri);
    } catch {
      return { deletedUris: [], inspectedDirectoryUri: cameraDirectoryUri };
    }

    const normalizedSourceUri = sourceUri ? normalizeUri(sourceUri) : null;
    const deletedUris: string[] = [];

    for (const entryName of entries) {
      if (!entryName.toLowerCase().endsWith(".mp4")) continue;

      const candidateUri = `${cameraDirectoryUri}${entryName}`;
      const isPreservedSource = normalizedSourceUri === normalizeUri(candidateUri);
      if (!isPreservedSource) {
        const info: CaptureResidueFileInfo = await this.fileSystem
          .getInfo(candidateUri)
          .catch(() => ({ exists: false }));
        if (!info.exists) continue;

        const modifiedAtMs = normalizeModificationTimeMs(info.modificationTime);
        if (modifiedAtMs === null || modifiedAtMs >= staleBeforeMs) continue;
      }

      await this.fileSystem.delete(candidateUri);
      deletedUris.push(candidateUri);
    }

    return { deletedUris, inspectedDirectoryUri: cameraDirectoryUri };
  }
}

function defaultCaptureResidueFileSystemAdapter(): CaptureResidueFileSystemAdapter {
  const fileSystem = require("expo-file-system/legacy");

  return {
    cacheDirectory: fileSystem.cacheDirectory,
    delete: (uri) => fileSystem.deleteAsync(uri, { idempotent: true }),
    getInfo: (uri) => fileSystem.getInfoAsync(uri),
    readDirectory: (uri) => fileSystem.readDirectoryAsync(uri)
  };
}

function ensureTrailingSlash(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

function normalizeModificationTimeMs(value?: number | null) {
  if (!value || value <= 0) return null;

  return value < 10_000_000_000 ? value * 1000 : value;
}

function normalizeUri(value: string) {
  return value.replace(/\/+$/, "");
}
