import { deleteSecret, readSecret, saveSecret } from "@/security/secureStorage";
import { API_SESSION_SECRET_KEY, ApiSessionSecretStore } from "@/services/api/core";

export const secureSessionStore: ApiSessionSecretStore = {
  delete: () => deleteSecret(API_SESSION_SECRET_KEY),
  read: () => readSecret(API_SESSION_SECRET_KEY),
  save: (value) => saveSecret(API_SESSION_SECRET_KEY, value)
};
