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

function getWebSessionStorage() {
  if (typeof sessionStorage === "undefined") {
    return null;
  }

  return sessionStorage;
}

export async function saveSecret(key: string, value: string) {
  if (!canUseNativeSecureStore()) {
    const storage = getWebSessionStorage();
    if (storage) {
      storage.setItem(webSecretKey(key), value);
    } else {
      webMemorySecrets.set(webSecretKey(key), value);
    }
    return;
  }

  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY
  });
}

export async function readSecret(key: string) {
  if (!canUseNativeSecureStore()) {
    const storage = getWebSessionStorage();
    return storage?.getItem(webSecretKey(key)) ?? webMemorySecrets.get(webSecretKey(key)) ?? null;
  }

  return SecureStore.getItemAsync(key);
}

export async function deleteSecret(key: string) {
  if (!canUseNativeSecureStore()) {
    const storage = getWebSessionStorage();
    storage?.removeItem(webSecretKey(key));
    webMemorySecrets.delete(webSecretKey(key));
    return;
  }

  await SecureStore.deleteItemAsync(key);
}
