import { EmergencyPackage } from "./types";
import { isUnifiedNativePackageVideo } from "./mediaInterfacePresentation";

function safeDate(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return new Date();
  return date;
}

function formatTime(dateValue: string) {
  return safeDate(dateValue).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDate(dateValue: string) {
  return safeDate(dateValue).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  });
}

function formatFullDate(dateValue: string) {
  return safeDate(dateValue).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function durationMsBetween(startValue?: string, endValue?: string) {
  if (!startValue || !endValue) return null;

  const startedAt = new Date(startValue).getTime();
  const completedAt = new Date(endValue).getTime();
  if (!Number.isFinite(startedAt) || !Number.isFinite(completedAt)) return null;

  return Math.max(0, completedAt - startedAt);
}

export function formatElapsedDuration(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.round(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}min`;
  }

  if (minutes > 0) {
    return `${minutes}min ${String(seconds).padStart(2, "0")}s`;
  }

  return `${seconds}s`;
}

export function getPackageVideoDurationMs(packageRecord: EmergencyPackage) {
  if (packageRecord.media.status !== "recorded_local") return null;

  const durationsByCamera = packageRecord.media.assets.reduce<Record<string, number>>((accumulator, asset) => {
    const duration = durationMsBetween(asset.recordedAt, asset.completedAt);
    if (typeof duration !== "number") return accumulator;

    const cameraKey = asset.cameraMode ?? "unknown";
    accumulator[cameraKey] = (accumulator[cameraKey] ?? 0) + duration;
    return accumulator;
  }, {});

  const trackDurations = Object.values(durationsByCamera);
  if (!trackDurations.length) return null;
  return Math.max(...trackDurations);
}

export function getPackageEventDurationMs(packageRecord: EmergencyPackage) {
  if (typeof packageRecord.capture.elapsedMs === "number") return Math.max(0, packageRecord.capture.elapsedMs);

  const finishedDuration = durationMsBetween(packageRecord.capture.startedAt, packageRecord.capture.completedAt);
  if (typeof finishedDuration === "number") return finishedDuration;

  if (packageRecord.status === "recording_local") {
    return Math.max(0, Date.now() - safeDate(packageRecord.capture.startedAt).getTime());
  }

  return getPackageVideoDurationMs(packageRecord);
}

export function formatPackageDurationLabel(packageRecord: EmergencyPackage) {
  const videoDuration = getPackageVideoDurationMs(packageRecord);
  if (typeof videoDuration === "number") return `Video ${formatElapsedDuration(videoDuration)}`;

  const eventDuration = getPackageEventDurationMs(packageRecord);
  if (typeof eventDuration === "number") return `Evento ${formatElapsedDuration(eventDuration)}`;

  if (packageRecord.capture.plannedDurationSeconds > 0) {
    return `Planejado ${formatElapsedDuration(packageRecord.capture.plannedDurationSeconds * 1000)}`;
  }

  return "Duracao ilimitada";
}

export function formatPackageTitle(packageRecord: EmergencyPackage) {
  return `SOS ${formatDate(packageRecord.createdAt)} ${formatTime(packageRecord.createdAt)}`;
}

export function formatPackageDate(packageRecord: EmergencyPackage) {
  return formatFullDate(packageRecord.createdAt);
}

export function formatPackageSubtitle(packageRecord: EmergencyPackage) {
  if (packageRecord.status === "recording_local") return "Gravando agora";
  if (isUnifiedNativePackageVideo(packageRecord)) return "Video local";
  const assets = packageRecord.media.status === "recorded_local" ? packageRecord.media.assets.length : 0;
  if (assets > 1) return `${assets} videos locais`;
  if (assets === 1) return "Video local";
  return "Registro local";
}

export function getPackageLocationPoint(packageRecord: EmergencyPackage) {
  if (packageRecord.location.status !== "captured") return null;

  return {
    latitude: packageRecord.location.latitude,
    longitude: packageRecord.location.longitude,
    accuracyMeters: packageRecord.location.accuracyMeters,
    capturedAt: packageRecord.location.capturedAt,
    speedMetersPerSecond: packageRecord.location.speedMetersPerSecond ?? null,
    headingDegrees: packageRecord.location.headingDegrees ?? null
  };
}

export function hasPackageLocation(packageRecord: EmergencyPackage) {
  return Boolean(getPackageLocationPoint(packageRecord));
}

export function buildPackageMapLinks(packageRecord: EmergencyPackage) {
  const point = getPackageLocationPoint(packageRecord);
  if (!point) return null;

  const coordinates = `${point.latitude},${point.longitude}`;
  return {
    apple: `http://maps.apple.com/?ll=${coordinates}&q=SinalSeguro`,
    google: `https://www.google.com/maps/search/?api=1&query=${coordinates}`,
    geo: `geo:${coordinates}?q=${coordinates}(SinalSeguro)`
  };
}

export function summarizeLocation(packageRecord: EmergencyPackage) {
  const point = getPackageLocationPoint(packageRecord);
  if (!point) return "Localizacao indisponivel neste registro.";

  return `Local registrado com precisao aproximada de ${Math.round(point.accuracyMeters)}m.`;
}

export function summarizeDelivery(packageRecord: EmergencyPackage) {
  const count = packageRecord.deliveryPlan.trustedContacts.length;
  if (count === 1) return "1 anjo vinculado para compartilhamento autorizado.";
  return `${count} anjos vinculados para compartilhamento autorizado.`;
}

export function summarizeCapture(packageRecord: EmergencyPackage) {
  if (packageRecord.capture.status === "recording") return "Gravacao em andamento.";
  if (packageRecord.media.status === "recorded_local" && packageRecord.media.assets.length > 0) return "Video salvo no cofre.";
  return "Registro salvo no cofre.";
}

export function buildTelemetrySummary(packageRecord: EmergencyPackage) {
  const point = getPackageLocationPoint(packageRecord);
  const items = [`Data e hora: ${formatPackageDate(packageRecord)}`, `Duracao: ${formatPackageDurationLabel(packageRecord)}`];

  if (point) {
    items.push("Localizacao salva neste arquivo.");
    items.push(`Precisao aproximada: ${Math.round(point.accuracyMeters)}m`);
    if (typeof point.speedMetersPerSecond === "number") {
      items.push(`Movimento registrado: ${(point.speedMetersPerSecond * 3.6).toFixed(1)} km/h`);
    }
    if (typeof point.headingDegrees === "number") {
      items.push(`Direcao registrada: ${Math.round(point.headingDegrees)} graus`);
    }
  } else {
    items.push("Localizacao indisponivel neste arquivo.");
  }

  return items;
}

export function summarizePackage(packageRecord: EmergencyPackage) {
  return [
    formatPackageTitle(packageRecord),
    summarizeCapture(packageRecord),
    summarizeLocation(packageRecord),
    summarizeDelivery(packageRecord)
  ].join(" ");
}
