import * as SecureStore from "expo-secure-store";

export async function saveSecret(key: string, value: string) {
  await SecureStore.setItemAsync(key, value, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY
  });
}

export async function readSecret(key: string) {
  return SecureStore.getItemAsync(key);
}

export async function deleteSecret(key: string) {
  await SecureStore.deleteItemAsync(key);
}
