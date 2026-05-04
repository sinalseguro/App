import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const webSecretPrefix = "sinalseguro.web-secure-fallback.";
const nativeSecretPrefix = "sinalseguro.secure.";
const webMemorySecrets = new Map<string, string>();
const nativeSecureStoreAllowedKey = /^[A-Za-z0-9._-]+$/;

function canUseNativeSecureStore() {
  return Platform.OS !== "web" && typeof SecureStore.setItemAsync === "function";
}

function webSecretKey(key: string) {
  return `${webSecretPrefix}${key}`;
}

function nativeSecretKey(key: string) {
  const encodedKey = Array.from(key)
    .map((char) => char.charCodeAt(0).toString(16).padStart(4, "0"))
    .join("");

  return `${nativeSecretPrefix}${encodedKey || "empty"}`;
}

export async function saveSecret(key: string, value: string) {
  if (!canUseNativeSecureStore()) {
    webMemorySecrets.set(webSecretKey(key), value);
    return;
  }

  await SecureStore.setItemAsync(nativeSecretKey(key), value, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY
  });
}

export async function readSecret(key: string) {
  if (!canUseNativeSecureStore()) {
    return webMemorySecrets.get(webSecretKey(key)) ?? null;
  }

  const safeKey = nativeSecretKey(key);
  const currentValue = await SecureStore.getItemAsync(safeKey);
  if (currentValue !== null) {
    return currentValue;
  }

  if (!nativeSecureStoreAllowedKey.test(key)) {
    return null;
  }

  const legacyValue = await SecureStore.getItemAsync(key);
  if (legacyValue !== null) {
    await saveSecret(key, legacyValue);
    await SecureStore.deleteItemAsync(key);
  }

  return legacyValue;
}

export async function deleteSecret(key: string) {
  if (!canUseNativeSecureStore()) {
    webMemorySecrets.delete(webSecretKey(key));
    return;
  }

  await SecureStore.deleteItemAsync(nativeSecretKey(key));

  if (nativeSecureStoreAllowedKey.test(key)) {
    await SecureStore.deleteItemAsync(key);
  }
}
