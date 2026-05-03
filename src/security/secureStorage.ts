import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const webSecretPrefix = "sinalseguro.web-secure-fallback.";
const webMemorySecrets = new Map<string, string>();

function canUseNativeSecureStore() {
  return Platform.OS !== "web" && typeof SecureStore.setItemAsync === "function";
}

function webSecretKey(key: string) {
  return `${webSecretPrefix}${key}`;
}

export async function saveSecret(key: string, value: string) {
  if (!canUseNativeSecureStore()) {
    webMemorySecrets.set(webSecretKey(key), value);
    return;
  }

  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY
  });
}

export async function readSecret(key: string) {
  if (!canUseNativeSecureStore()) {
    return webMemorySecrets.get(webSecretKey(key)) ?? null;
  }

  return SecureStore.getItemAsync(key);
}

export async function deleteSecret(key: string) {
  if (!canUseNativeSecureStore()) {
    webMemorySecrets.delete(webSecretKey(key));
    return;
  }

  await SecureStore.deleteItemAsync(key);
}
