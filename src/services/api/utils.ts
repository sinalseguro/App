import { LoginDeviceContext, LogoutDeviceContext } from "@/services/api/contracts";

declare const require: <T = unknown>(moduleName: string) => T;

export function currentPlatform() {
  const { Platform } = require<{ Platform: { OS: string } }>("react-native");
  if (Platform.OS === "ios") return "ios";
  if (Platform.OS === "android") return "android";
  return "web";
}

export function toApiDateTime(value?: string) {
  return value ?? new Date().toISOString();
}

export function toLoginDevicePayload(deviceContext?: LoginDeviceContext | null) {
  if (!deviceContext) return {};

  return {
    device_app_version: deviceContext.appVersion,
    device_label: deviceContext.deviceLabel,
    device_legacy_public_key_sha256: deviceContext.legacyPublicKeySha256,
    device_platform: deviceContext.platform,
    device_public_key_sha256: deviceContext.publicKeySha256
  };
}

export function toLogoutDevicePayload(deviceContext?: LogoutDeviceContext | null) {
  if (!deviceContext) return {};

  return {
    device_id: deviceContext.deviceId ?? undefined,
    device_public_key_sha256: deviceContext.publicKeySha256 ?? undefined
  };
}
