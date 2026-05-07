import { getEmergencyPreferences } from "@/features/emergency/emergencyPreferences";
import { ApiRequestError, ApiSession, apiClient } from "@/services/apiClient";
import { DeviceBootstrapResult, deviceBindingService } from "@/services/deviceBinding";
import { completeGoogleOidcRedirect, GoogleOidcRedirectParams } from "@/services/googleOidc";
import { Platform } from "react-native";

const googleSignInWebClientId = process.env.EXPO_PUBLIC_GOOGLE_OIDC_WEB_CLIENT_ID?.trim() ?? "";
const googleSignInIosClientId = process.env.EXPO_PUBLIC_GOOGLE_OIDC_IOS_CLIENT_ID?.trim() ?? "";
const googleSignInScopes = ["openid", "profile", "email"];

export type GoogleSignInCompletion = {
  bootstrap: DeviceBootstrapResult;
  notice: string;
  session: ApiSession;
};

let activeGoogleSignInCompletion: Promise<GoogleSignInCompletion> | null = null;
let nativeGoogleSignInConfigured = false;
let nativeGoogleSignInModulePromise: Promise<typeof import("@react-native-google-signin/google-signin")> | null = null;

export class GoogleNativeSignInError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleNativeSignInError";
  }
}

async function getNativeGoogleSignInModule() {
  if (!nativeGoogleSignInModulePromise) {
    nativeGoogleSignInModulePromise = import("@react-native-google-signin/google-signin");
  }

  return nativeGoogleSignInModulePromise;
}

async function configureNativeGoogleSignIn() {
  if (nativeGoogleSignInConfigured) return getNativeGoogleSignInModule();

  if (!googleSignInWebClientId) {
    throw new GoogleNativeSignInError("Google Sign-In exige EXPO_PUBLIC_GOOGLE_OIDC_WEB_CLIENT_ID local.");
  }

  if (Platform.OS === "ios" && !googleSignInIosClientId) {
    throw new GoogleNativeSignInError("Google no iPhone exige EXPO_PUBLIC_GOOGLE_OIDC_IOS_CLIENT_ID local.");
  }

  const googleSignIn = await getNativeGoogleSignInModule();
  googleSignIn.GoogleSignin.configure({
    forceCodeForRefreshToken: false,
    iosClientId: googleSignInIosClientId || undefined,
    offlineAccess: false,
    scopes: googleSignInScopes,
    webClientId: googleSignInWebClientId
  });
  nativeGoogleSignInConfigured = true;

  return googleSignIn;
}

function getNativeGoogleErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return "Nao foi possivel entrar com Google agora.";

  if (!("code" in error) || typeof error.code !== "string") {
    return error.message || "Nao foi possivel entrar com Google agora.";
  }

  if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
    return "Google Play Services indisponivel ou desatualizado neste aparelho.";
  }

  if (error.code === "IN_PROGRESS") {
    return "Login Google ja esta em andamento neste aparelho.";
  }

  if (error.code === "DEVELOPER_ERROR") {
    return "Google Sign-In recusou este app. Conferir identificador do pacote, assinatura instalada e Client IDs liberados no Google Cloud.";
  }

  return error.message || "Nao foi possivel entrar com Google agora.";
}

export function buildGoogleSignInNotice(prefix: string, bootstrap: DeviceBootstrapResult) {
  if (bootstrap.consentStatus === "recorded") {
    return `${prefix} Dispositivo registrado e consentimentos sincronizados.`;
  }
  if (bootstrap.consentStatus === "partial") {
    return `${prefix} Dispositivo registrado; alguns consentimentos aguardam a API atualizada.`;
  }
  return `${prefix} Dispositivo registrado.`;
}

export function getNativeGoogleSignInReadiness() {
  const currentPlatformConfigured =
    Platform.OS === "ios"
      ? Boolean(googleSignInWebClientId && googleSignInIosClientId)
      : Boolean(googleSignInWebClientId);

  return {
    currentPlatformConfigured,
    iosClientConfigured: Boolean(googleSignInIosClientId),
    webClientConfigured: Boolean(googleSignInWebClientId)
  };
}

async function completeGoogleSignInWithIdToken(idToken: string, prefix: string): Promise<GoogleSignInCompletion> {
  const deviceContext = await deviceBindingService.getLoginDeviceContext();
  const session = await apiClient.loginWithGoogleIdToken(idToken, deviceContext);
  const preferences = await getEmergencyPreferences();
  const bootstrap = await deviceBindingService.completeAuthenticatedBootstrap(preferences);

  return {
    bootstrap,
    notice: buildGoogleSignInNotice(prefix, bootstrap),
    session
  };
}

export async function beginNativeGoogleSignInAsync() {
  try {
    const googleSignIn = await configureNativeGoogleSignIn();
    await googleSignIn.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await googleSignIn.GoogleSignin.signIn();

    if (!googleSignIn.isSuccessResponse(response)) {
      throw new GoogleNativeSignInError("Login Google cancelado.");
    }

    if (!response.data.idToken) {
      throw new GoogleNativeSignInError("Google nao retornou ID token; conferir Web Client ID do tipo Web.");
    }

    return completeGoogleSignInWithIdToken(response.data.idToken, "Conta Google conectada ao SinalSeguro.");
  } catch (error) {
    if (error instanceof GoogleNativeSignInError) throw error;
    if (error instanceof ApiRequestError) throw error;
    throw new GoogleNativeSignInError(getNativeGoogleErrorMessage(error));
  }
}

export async function signOutNativeGoogleIfAvailable() {
  try {
    const googleSignIn = await configureNativeGoogleSignIn();
    await googleSignIn.GoogleSignin.signOut();
  } catch {
    // Logout do SinalSeguro nao deve ficar preso em cache local do provedor.
  }
}

async function completeGoogleSignInFromRedirectOnce(params: GoogleOidcRedirectParams): Promise<GoogleSignInCompletion> {
  const googleJwt = await completeGoogleOidcRedirect(params);
  return completeGoogleSignInWithIdToken(googleJwt, "Conta Google conectada ao SinalSeguro.");
}

export async function completeGoogleSignInFromRedirect(params: GoogleOidcRedirectParams) {
  if (!activeGoogleSignInCompletion) {
    activeGoogleSignInCompletion = completeGoogleSignInFromRedirectOnce(params).finally(() => {
      activeGoogleSignInCompletion = null;
    });
  }

  return activeGoogleSignInCompletion;
}
