import { EmergencyPackage } from "./types";

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

export function formatPackageTitle(packageRecord: EmergencyPackage) {
  return `SOS ${formatDate(packageRecord.createdAt)} ${formatTime(packageRecord.createdAt)}`;
}

export function formatPackageDate(packageRecord: EmergencyPackage) {
  return formatFullDate(packageRecord.createdAt);
}

export function formatPackageSubtitle(packageRecord: EmergencyPackage) {
  if (packageRecord.status === "recording_local") return "Gravando agora";
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
  const items = [`Data: ${formatPackageDate(packageRecord)}`];

  if (point) {
    items.push(`Local: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`);
    items.push(`Precisao: ${Math.round(point.accuracyMeters)}m`);
    if (typeof point.speedMetersPerSecond === "number") {
      items.push(`Velocidade: ${(point.speedMetersPerSecond * 3.6).toFixed(1)} km/h`);
    }
    if (typeof point.headingDegrees === "number") {
      items.push(`Direcao: ${Math.round(point.headingDegrees)} graus`);
    }
  } else {
    items.push("Local: indisponivel");
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
