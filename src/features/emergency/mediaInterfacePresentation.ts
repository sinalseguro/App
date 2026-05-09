import { EmergencyPackage, LocalMediaAsset } from "./types";

function formatBytes(sizeBytes: number) {
  if (sizeBytes <= 0) return "0 KB";
  const megabytes = sizeBytes / (1024 * 1024);
  if (megabytes >= 1) return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1)} MB`;
  return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
}

export function getCameraLabel(asset?: LocalMediaAsset) {
  if (!asset) return "Sem camera";
  return asset.cameraMode === "front" ? "Camera frontal" : "Camera traseira";
}

export function getAssetSizeLabel(asset?: LocalMediaAsset) {
  if (!asset) return "Sem arquivo";
  return formatBytes(asset.sizeBytes);
}

export function isEncryptedVideoAsset(asset?: LocalMediaAsset) {
  return (
    asset?.encryptionStatus === "encrypted_chunked_xchacha20poly1305" ||
    asset?.encryptionStatus === "encrypted_native_segmented_v1"
  );
}

export function getAssetProtectionLabel(asset?: LocalMediaAsset) {
  if (!asset) return "Sem midia";
  return isEncryptedVideoAsset(asset) ? "Protegido" : "Local";
}

export function getAssetPlaybackLabel(asset?: LocalMediaAsset) {
  if (!asset) return "Sem video local";
  if (asset.encryptedVideo?.playbackAdapter === "native_encrypted_source") return "Player seguro nativo";
  return isEncryptedVideoAsset(asset) ? "Player seguro pendente" : "Reproduzir";
}

export function getAssetStorageLabel(asset?: LocalMediaAsset) {
  if (!asset) return "Sem armazenamento";
  if (isEncryptedVideoAsset(asset)) {
    const chunks = asset.encryptedVideo?.chunkCount ?? 0;
    if (asset.encryptedVideo?.storageEngine === "native_segmented_v1") {
      return chunks > 0 ? `${chunks} segmentos protegidos` : "Segmentos protegidos";
    }
    return chunks > 0 ? `${chunks} partes protegidas` : "Protegido por partes";
  }
  return "Arquivo local";
}

export function getPackageMediaProtectionLabel(packageRecord?: EmergencyPackage) {
  if (!packageRecord || packageRecord.media.status !== "recorded_local" || !packageRecord.media.assets.length) {
    return "Sem midia";
  }

  const encryptedCount = packageRecord.media.assets.filter(isEncryptedVideoAsset).length;
  if (encryptedCount === packageRecord.media.assets.length) return "Protegido";
  if (encryptedCount > 0) return "Parcialmente protegido";
  return "Local";
}

export function getPackageMediaDiagnosticLabel(packageRecord?: EmergencyPackage) {
  const reason =
    packageRecord?.media.status === "pending_local_recording" || packageRecord?.media.status === "recorded_local"
      ? packageRecord.media.diagnostic?.reason
      : undefined;

  switch (reason) {
    case "camera_mount_error":
      return "Camera local nao iniciou";
    case "camera_no_file_returned":
      return "Camera nao retornou arquivo de video";
    case "camera_output_not_ready":
      return "Camera ainda estava inicializando";
    case "camera_recording_error":
      return "Gravacao de video interrompida pela camera";
    case "media_permissions_denied":
      return "Camera ou microfone sem permissao";
    default:
      return null;
  }
}

export function getPackageMediaCountLabel(packageRecord?: EmergencyPackage) {
  if (!packageRecord || packageRecord.media.status !== "recorded_local") return "Sem video";
  const count = packageRecord.media.assets.length;
  if (count === 1) return "1 video";
  return `${count} videos`;
}
