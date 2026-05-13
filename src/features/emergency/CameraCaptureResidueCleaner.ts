const cameraCacheDirectoryName = "Camera";
const defaultStaleResidueAgeMs = 2 * 60 * 1000;
const plaintextCameraVideoExtensions = [".mp4", ".mov", ".m4v"];

declare const require: (moduleName: string) => any;

export type CaptureResidueFileInfo = {
  exists: boolean;
  isDirectory?: boolean | null;
  modificationTime?: number | null;
  size?: number | null;
};

export type CaptureResidueFileSystemAdapter = {
  cacheDirectory: string | null | undefined;
  delete: (uri: string) => Promise<void>;
  getInfo: (uri: string) => Promise<CaptureResidueFileInfo>;
  readDirectory: (uri: string) => Promise<string[]>;
};

export type CaptureResidueCleanupOptions = {
  nowMs?: number;
  sourceOnly?: boolean;
  sourceUri?: string;
  staleBeforeMs?: number;
};

export type CaptureResidueCleanupResult = {
  deletedUris: string[];
  inspectedDirectoryUri: string | null;
};

export type RecoverableCameraResidue = {
  uri: string;
  modificationTimeMs: number | null;
  sizeBytes: number | null;
};

export type CaptureResidueRecoveryOptions = {
  maxCandidates?: number;
  maxTotalSizeBytes?: number;
  modifiedAfterMs?: number;
};

export class CameraCaptureResidueCleaner {
  private readonly fileSystem: CaptureResidueFileSystemAdapter;

  constructor(fileSystem: CaptureResidueFileSystemAdapter = defaultCaptureResidueFileSystemAdapter()) {
    this.fileSystem = fileSystem;
  }

  async cleanupAfterSuccessfulPreservation({
    nowMs = Date.now(),
    sourceOnly = false,
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
      if (!isSafeCameraEntryName(entryName)) continue;
      if (!isPlaintextCameraVideoFile(entryName)) continue;

      const candidateUri = `${cameraDirectoryUri}${entryName}`;
      const isPreservedSource = normalizedSourceUri === normalizeUri(candidateUri);
      if (!isPreservedSource && sourceOnly) continue;
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

  async findRecoverableCameraVideos({
    maxCandidates = 4,
    maxTotalSizeBytes = 512 * 1024 * 1024,
    modifiedAfterMs = 0
  }: CaptureResidueRecoveryOptions = {}): Promise<RecoverableCameraResidue[]> {
    const cacheDirectory = this.fileSystem.cacheDirectory;
    if (!cacheDirectory) return [];

    const cameraDirectoryUri = `${ensureTrailingSlash(cacheDirectory)}${cameraCacheDirectoryName}/`;
    let entries: string[];
    try {
      entries = await this.fileSystem.readDirectory(cameraDirectoryUri);
    } catch {
      return [];
    }

    const candidates: RecoverableCameraResidue[] = [];
    for (const entryName of entries) {
      if (!isSafeCameraEntryName(entryName)) continue;
      if (!isPlaintextCameraVideoFile(entryName)) continue;

      const candidateUri = `${cameraDirectoryUri}${entryName}`;
      const info: CaptureResidueFileInfo = await this.fileSystem
        .getInfo(candidateUri)
        .catch(() => ({ exists: false }));
      if (!info.exists) continue;
      if (info.isDirectory) continue;

      const modifiedAtMs = normalizeModificationTimeMs(info.modificationTime);
      if (modifiedAtMs === null || modifiedAtMs < modifiedAfterMs) continue;

      const sizeBytes = typeof info.size === "number" && info.size > 0 ? info.size : null;
      if (sizeBytes === null) continue;

      candidates.push({
        uri: candidateUri,
        modificationTimeMs: modifiedAtMs,
        sizeBytes
      });
    }

    let selectedTotalBytes = 0;
    const selectedCandidates: RecoverableCameraResidue[] = [];
    for (const candidate of candidates
      .sort((left, right) => {
        const leftModified = left.modificationTimeMs ?? 0;
        const rightModified = right.modificationTimeMs ?? 0;
        if (leftModified !== rightModified) return rightModified - leftModified;
        return (right.sizeBytes ?? 0) - (left.sizeBytes ?? 0);
      })
    ) {
      const sizeBytes = candidate.sizeBytes ?? 0;
      if (selectedCandidates.length >= maxCandidates) break;
      if (selectedTotalBytes + sizeBytes > maxTotalSizeBytes) continue;

      selectedTotalBytes += sizeBytes;
      selectedCandidates.push(candidate);
    }

    return selectedCandidates;
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

function isSafeCameraEntryName(fileName: string) {
  return (
    fileName.length > 0 &&
    fileName !== "." &&
    fileName !== ".." &&
    !fileName.includes("/") &&
    !fileName.includes("\\") &&
    !fileName.includes("..")
  );
}

function isPlaintextCameraVideoFile(fileName: string) {
  const normalizedName = fileName.toLowerCase();
  return plaintextCameraVideoExtensions.some((extension) => normalizedName.endsWith(extension));
}
