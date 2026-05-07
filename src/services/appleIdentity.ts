import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";

const appleSignInEnabled = process.env.EXPO_PUBLIC_APPLE_SIGN_IN_ENABLED?.trim() === "1";

export class AppleIdentityCancelledError extends Error {
  constructor() {
    super("Login Apple cancelado.");
    this.name = "AppleIdentityCancelledError";
  }
}

export type AppleIdentityLogin = {
  displayName?: string;
  identityToken: string;
};

function isCancellation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ERR_REQUEST_CANCELED"
  );
}

export class AppleIdentityService {
  async isAvailable() {
    if (Platform.OS !== "ios" || !appleSignInEnabled) return false;
    return AppleAuthentication.isAvailableAsync();
  }

  async signIn(): Promise<AppleIdentityLogin> {
    if (!(await this.isAvailable())) {
      throw new Error("Login Apple indisponivel neste aparelho.");
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      });
      if (!credential.identityToken) {
        throw new Error("Apple nao retornou token de identidade para validacao.");
      }

      const displayName = credential.fullName
        ? AppleAuthentication.formatFullName(credential.fullName).trim()
        : "";

      return {
        displayName: displayName || undefined,
        identityToken: credential.identityToken
      };
    } catch (error) {
      if (isCancellation(error)) {
        throw new AppleIdentityCancelledError();
      }
      throw error;
    }
  }
}

export const appleIdentityService = new AppleIdentityService();
