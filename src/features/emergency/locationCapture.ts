import * as Location from "expo-location";
import { LocationSnapshot } from "./types";

export type LocationPermissionReadiness = {
  foreground: Location.PermissionStatus;
  background: Location.PermissionStatus;
  servicesEnabled: boolean;
  backgroundAvailable: boolean;
  backgroundBlockedReason?: string;
};

export async function getLocationPermissionReadiness(): Promise<LocationPermissionReadiness> {
  const [foreground, servicesEnabled, backgroundAvailable] = await Promise.all([
    Location.getForegroundPermissionsAsync(),
    Location.hasServicesEnabledAsync(),
    Location.isBackgroundLocationAvailableAsync()
  ]);
  let background = Location.PermissionStatus.DENIED;
  let backgroundBlockedReason: string | undefined;

  try {
    const backgroundPermission = await Location.getBackgroundPermissionsAsync();
    background = backgroundPermission.status;
  } catch {
    backgroundBlockedReason = "background_location_not_declared_public_build";
  }

  return {
    foreground: foreground.status,
    background,
    servicesEnabled,
    backgroundAvailable,
    backgroundBlockedReason
  };
}

export async function prepareForegroundLocationPermission() {
  const currentPermission = await Location.getForegroundPermissionsAsync();
  if (currentPermission.status === "granted") return currentPermission;

  return Location.requestForegroundPermissionsAsync();
}

export async function captureForegroundLocation(): Promise<LocationSnapshot> {
  const capturedAt = new Date().toISOString();

  try {
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      return {
        status: "services_disabled",
        capturedAt,
        reason: "Servico de localizacao desativado no dispositivo."
      };
    }

    const permission = await prepareForegroundLocationPermission();
    if (permission.status !== "granted") {
      return {
        status: "permission_denied",
        capturedAt,
        reason: "Permissao de localizacao nao concedida."
      };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });

    return {
      status: "captured",
      capturedAt: new Date(position.timestamp).toISOString(),
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracyMeters: position.coords.accuracy ?? 0,
      altitudeMeters: position.coords.altitude,
      headingDegrees: position.coords.heading,
      speedMetersPerSecond: position.coords.speed
    };
  } catch (error) {
    return {
      status: "error",
      capturedAt,
      reason: error instanceof Error ? error.message : "Falha desconhecida ao capturar localizacao."
    };
  }
}
