import type { EmergencyPackage, LocalMediaAsset } from "./types";

export const legacyPlaintextMediaDirectory = "sinalseguro-media";
const defaultStaleResidueAgeMs = 2 * 60 * 1000;

declare const require: (moduleName: string) => any;

export type PlaintextResidueFileInfo = {
  exists: boolean;
  modificationTime?: number | null;
  size?: number | null;
};

export type PlaintextResidueFileSystemAdapter = {
  delete: (uri: string) => Promise<void>;
  getInfo: (uri: string) => Promise<PlaintextResidueFileInfo>;
  readDirectory: (uri: string) => Promise<string[]>;
};

export type PlaintextMediaResidueCleanupOptions = {
  nowMs?: number;
  referencedUris?: Iterable<string>;
  staleBeforeMs?: number;
};

export type PlaintextMediaResidueCleanupResult = {
  blockedReferencedCount: number;
  deletedCount: number;
  inspectedDirectory: boolean;
};

export type PlaintextMediaStorageMaintenanceResult = PlaintextMediaResidueCleanupResult & {
  migratedReferencedCount: number;
  migrationBlockedCount: number;
};

export class PlaintextMediaResidueCleaner {
  private readonly fileSystem: PlaintextResidueFileSystemAdapter;
  private readonly legacyDirectoryUri: string;

  constructor(
    fileSystem: PlaintextResidueFileSystemAdapter = defaultPlaintextResidueFileSystemAdapter(),
    legacyDirectoryUri = defaultLegacyPlaintextMediaDirectoryUri()
  ) {
    this.fileSystem = fileSystem;
    this.legacyDirectoryUri = legacyDirectoryUri;
  }

  async cleanupUnreferencedLegacyVideos({
    nowMs = Date.now(),
    referencedUris = [],
    staleBeforeMs = nowMs - defaultStaleResidueAgeMs
  }: PlaintextMediaResidueCleanupOptions = {}): Promise<PlaintextMediaResidueCleanupResult> {
    if (!this.legacyDirectoryUri) {
      return { blockedReferencedCount: 0, deletedCount: 0, inspectedDirectory: false };
    }

    let entries: string[];
    try {
      entries = await this.fileSystem.readDirectory(this.legacyDirectoryUri);
    } catch {
      return { blockedReferencedCount: 0, deletedCount: 0, inspectedDirectory: true };
    }

    const protectedUris = new Set([...referencedUris].map(normalizeUri));
    let blockedReferencedCount = 0;
    let deletedCount = 0;

    for (const entryName of entries) {
      if (!entryName.toLowerCase().endsWith(".mp4")) continue;

      const candidateUri = `${ensureTrailingSlash(this.legacyDirectoryUri)}${entryName}`;
      if (protectedUris.has(normalizeUri(candidateUri))) {
        blockedReferencedCount += 1;
        continue;
      }

      const info: PlaintextResidueFileInfo = await this.fileSystem
        .getInfo(candidateUri)
        .catch(() => ({ exists: false }));
      if (!info.exists) continue;

      const modifiedAtMs = normalizeModificationTimeMs(info.modificationTime);
      if (modifiedAtMs !== null && modifiedAtMs >= staleBeforeMs) continue;

      await this.fileSystem.delete(candidateUri);
      deletedCount += 1;
    }

    return { blockedReferencedCount, deletedCount, inspectedDirectory: true };
  }
}

export async function runPlaintextMediaStorageMaintenance(): Promise<PlaintextMediaStorageMaintenanceResult> {
  const { EncryptedVideoStore } = require("./EncryptedVideoStore");
  const { createMediaDiagnosticRun } = require("./MediaDiagnostics");
  const { listEmergencyPackages } = require("./emergencyOutbox");
  const { replaceLocalMediaAsset } = require("./emergencyRecorder");
  const fileSystem = require("expo-file-system/legacy");
  const packages = await listEmergencyPackages();
  const encryptedStore = new EncryptedVideoStore();
  const remainingReferencedPlaintextUris = new Set<string>();
  let migratedReferencedCount = 0;
  let migrationBlockedCount = 0;

  for (const packageRecord of packages) {
    for (const asset of listLegacyPlaintextAssets(packageRecord)) {
      const sourceInfo = await fileSystem.getInfoAsync(asset.uri).catch(() => ({ exists: false, size: null }));
      if (!sourceInfo.exists || !("size" in sourceInfo) || !sourceInfo.size) continue;

      let migratedAsset: LocalMediaAsset | null = null;
      try {
        migratedAsset = await encryptedStore.preserveEncryptedVideoAsset({
          packageId: packageRecord.id,
          sourceUri: asset.uri,
          cameraMode: asset.cameraMode,
          requestedCameraMode: asset.requestedCameraMode,
          startedAt: asset.recordedAt,
          completedAt: asset.completedAt,
          cleanupPlaintextSource: false,
          diagnosticRunId: createMediaDiagnosticRun("legacy_plaintext_migration")
        });
        if (!migratedAsset) {
          throw new Error("Falha ao criar envelope criptografado para midia clara legada.");
        }

        const replacedPackage = await replaceLocalMediaAsset(packageRecord.id, asset.id, migratedAsset);
        if (!replacedPackage) {
          throw new Error("Falha ao trocar video claro legado por envelope criptografado.");
        }

        const confirmedMigratedAsset = migratedAsset;
        migratedReferencedCount += 1;

        const plaintextCleanup = await encryptedStore
          .deletePlaintextAfterVerifiedPreservation(asset.uri)
          .catch(() => null);
        if (plaintextCleanup) {
          const finalizedAsset: LocalMediaAsset = {
            ...confirmedMigratedAsset,
            encryptedVideo: confirmedMigratedAsset.encryptedVideo
              ? {
                  ...confirmedMigratedAsset.encryptedVideo,
                  plaintextCleanup
                }
              : confirmedMigratedAsset.encryptedVideo
          };
          await replaceLocalMediaAsset(packageRecord.id, confirmedMigratedAsset.id, finalizedAsset).catch(() => undefined);
        }
      } catch {
        if (migratedAsset) {
          await encryptedStore.deleteEncryptedAsset(migratedAsset).catch(() => undefined);
        }
        remainingReferencedPlaintextUris.add(asset.uri);
        migrationBlockedCount += 1;
      }
    }
  }

  const cleanupResult = await new PlaintextMediaResidueCleaner().cleanupUnreferencedLegacyVideos({
    referencedUris: remainingReferencedPlaintextUris
  });

  return {
    ...cleanupResult,
    migratedReferencedCount,
    migrationBlockedCount
  };
}

function listLegacyPlaintextAssets(packageRecord: EmergencyPackage) {
  if (packageRecord.media.status !== "recorded_local") return [];

  const legacyDirectoryUri = normalizeUri(defaultLegacyPlaintextMediaDirectoryUri());
  return packageRecord.media.assets.filter(
    (asset) =>
      asset.storage === "app_private_sandbox" &&
      asset.encryptionStatus === "local_sandbox_pending_backend_envelope" &&
      normalizeUri(asset.uri).startsWith(legacyDirectoryUri) &&
      asset.uri.toLowerCase().endsWith(".mp4")
  );
}

function defaultPlaintextResidueFileSystemAdapter(): PlaintextResidueFileSystemAdapter {
  const fileSystem = require("expo-file-system/legacy");

  return {
    delete: (uri) => fileSystem.deleteAsync(uri, { idempotent: true }),
    getInfo: (uri) => fileSystem.getInfoAsync(uri),
    readDirectory: (uri) => fileSystem.readDirectoryAsync(uri)
  };
}

function defaultLegacyPlaintextMediaDirectoryUri() {
  const fileSystem = require("expo-file-system/legacy");
  return `${fileSystem.documentDirectory ?? ""}${legacyPlaintextMediaDirectory}/`;
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
