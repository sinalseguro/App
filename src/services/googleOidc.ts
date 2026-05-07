import {
  AccessTokenRequest,
  AuthRequest,
  makeRedirectUri,
  Prompt,
  ResponseType
} from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

import { deleteSecret, readSecret, saveSecret } from "@/security/secureStorage";

const googleOidcWebClientId = process.env.EXPO_PUBLIC_GOOGLE_OIDC_WEB_CLIENT_ID?.trim() ?? "";
const googleOidcIosClientId = process.env.EXPO_PUBLIC_GOOGLE_OIDC_IOS_CLIENT_ID?.trim() ?? "";
const googleOidcAndroidClientId = process.env.EXPO_PUBLIC_GOOGLE_OIDC_ANDROID_CLIENT_ID?.trim() ?? "";
const googleOidcPendingAuthKey = "google.oidc.pending-auth.v1";
const googleOidcLoginStatusKey = "google.oidc.login-status.v1";
const googleOidcScopes = ["openid", "profile", "email"];
const googleOidcPendingTtlMs = 10 * 60 * 1000;

type GoogleOidcPendingAuth = {
  clientId: string;
  codeVerifier: string;
  createdAt: string;
  redirectUri: string;
  scopes: string[];
  state: string;
};

export type GoogleOidcRedirectParams = Record<string, string | string[] | undefined>;

export type GoogleOidcLoginStatus = {
  createdAt: string;
  kind: "error" | "success";
  message: string;
};

export type GoogleOidcAuthorizationResult =
  | {
      params: Record<string, string>;
      type: "success";
    }
  | {
      type: "cancel" | "dismiss" | "locked" | "opened";
    };

let activeGoogleOidcCompletion: Promise<string> | null = null;

export class GoogleOidcAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleOidcAuthError";
  }
}

function currentGoogleClientId() {
  if (Platform.OS === "ios") return googleOidcIosClientId;
  if (Platform.OS === "android") return googleOidcAndroidClientId;
  return googleOidcWebClientId;
}

function getRequiredGoogleClientId() {
  const clientId = currentGoogleClientId();
  if (!clientId) {
    throw new GoogleOidcAuthError("Client ID Google OIDC nao configurado para esta plataforma.");
  }

  return clientId;
}

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function singleParam(params: GoogleOidcRedirectParams, key: string) {
  const value = params[key];
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function parseRedirectParams(url: string) {
  const parsedParams: Record<string, string> = {};

  try {
    const parsedUrl = new URL(url);
    parsedUrl.searchParams.forEach((value, key) => {
      parsedParams[key] = value;
    });
    return parsedParams;
  } catch {
    const queryString = url.split("?")[1]?.split("#")[0] ?? "";
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((value, key) => {
      parsedParams[key] = value;
    });
    return parsedParams;
  }
}

function isFreshPendingAuth(pendingAuth: GoogleOidcPendingAuth) {
  const createdAt = new Date(pendingAuth.createdAt).getTime();
  return Number.isFinite(createdAt) && Date.now() - createdAt <= googleOidcPendingTtlMs;
}

async function readPendingGoogleOidcAuth() {
  const pendingAuth = safeParseJson<GoogleOidcPendingAuth>(await readSecret(googleOidcPendingAuthKey));
  if (!pendingAuth?.state || !pendingAuth.codeVerifier || !pendingAuth.clientId || !pendingAuth.redirectUri) {
    await deleteSecret(googleOidcPendingAuthKey);
    return null;
  }

  if (!isFreshPendingAuth(pendingAuth)) {
    await deleteSecret(googleOidcPendingAuthKey);
    return null;
  }

  return pendingAuth;
}

export function getGoogleOidcRedirectUri() {
  return makeRedirectUri({
    native: "sinalseguro:/oauthredirect"
  });
}

export function getGoogleOidcAuthRequestConfig() {
  return {
    androidClientId: googleOidcAndroidClientId,
    iosClientId: googleOidcIosClientId,
    language: "pt-BR",
    redirectUri: getGoogleOidcRedirectUri(),
    scopes: googleOidcScopes,
    selectAccount: true,
    shouldAutoExchangeCode: true,
    webClientId: googleOidcWebClientId
  };
}

function buildGoogleOidcAuthRequest() {
  return new AuthRequest({
    clientId: getRequiredGoogleClientId(),
    extraParams: {
      hl: "pt-BR"
    },
    prompt: Prompt.SelectAccount,
    redirectUri: getGoogleOidcRedirectUri(),
    responseType: ResponseType.Code,
    scopes: googleOidcScopes,
    usePKCE: true
  });
}

export async function beginGoogleOidcAuthorizationAsync(): Promise<GoogleOidcAuthorizationResult> {
  const request = buildGoogleOidcAuthRequest();
  const authorizationUrl = await request.makeAuthUrlAsync(Google.discovery);

  if (!request.codeVerifier) {
    throw new GoogleOidcAuthError("Nao foi possivel preparar login Google com PKCE.");
  }

  await saveSecret(
    googleOidcPendingAuthKey,
    JSON.stringify({
      clientId: request.clientId,
      codeVerifier: request.codeVerifier,
      createdAt: new Date().toISOString(),
      redirectUri: request.redirectUri,
      scopes: request.scopes ?? googleOidcScopes,
      state: request.state
    } satisfies GoogleOidcPendingAuth)
  );

  const result = await WebBrowser.openAuthSessionAsync(authorizationUrl, request.redirectUri);
  if (result.type !== "success") {
    await deleteSecret(googleOidcPendingAuthKey);
    return { type: result.type };
  }

  return {
    params: parseRedirectParams(result.url),
    type: "success"
  };
}

async function completeGoogleOidcRedirectOnce(params: GoogleOidcRedirectParams) {
  const error = singleParam(params, "error");
  if (error) {
    throw new GoogleOidcAuthError("Google recusou ou cancelou a autenticacao.");
  }

  const code = singleParam(params, "code");
  const state = singleParam(params, "state");
  if (!code || !state) {
    throw new GoogleOidcAuthError("Retorno Google incompleto para autenticacao.");
  }

  const pendingAuth = await readPendingGoogleOidcAuth();
  if (!pendingAuth || pendingAuth.state !== state) {
    throw new GoogleOidcAuthError("Estado do login Google expirado ou invalido.");
  }

  try {
    const tokenResponse = await new AccessTokenRequest({
      clientId: pendingAuth.clientId,
      code,
      extraParams: {
        code_verifier: pendingAuth.codeVerifier
      },
      redirectUri: pendingAuth.redirectUri,
      scopes: pendingAuth.scopes
    }).performAsync(Google.discovery);

    if (!tokenResponse.idToken) {
      throw new GoogleOidcAuthError("Google nao retornou ID token para validacao.");
    }

    return tokenResponse.idToken;
  } finally {
    await deleteSecret(googleOidcPendingAuthKey);
  }
}

export async function completeGoogleOidcRedirect(params: GoogleOidcRedirectParams) {
  if (!activeGoogleOidcCompletion) {
    activeGoogleOidcCompletion = completeGoogleOidcRedirectOnce(params).finally(() => {
      activeGoogleOidcCompletion = null;
    });
  }

  return activeGoogleOidcCompletion;
}

export async function saveGoogleOidcLoginStatus(kind: GoogleOidcLoginStatus["kind"], message: string) {
  await saveSecret(
    googleOidcLoginStatusKey,
    JSON.stringify({
      createdAt: new Date().toISOString(),
      kind,
      message
    } satisfies GoogleOidcLoginStatus)
  );
}

export async function consumeGoogleOidcLoginStatus() {
  const status = safeParseJson<GoogleOidcLoginStatus>(await readSecret(googleOidcLoginStatusKey));
  await deleteSecret(googleOidcLoginStatusKey);

  if (!status?.kind || !status.message) return null;

  const createdAt = new Date(status.createdAt).getTime();
  if (!Number.isFinite(createdAt) || Date.now() - createdAt > googleOidcPendingTtlMs) return null;

  return status;
}

export function getGoogleOidcReadiness() {
  const platformClientId = currentGoogleClientId();
  return {
    androidConfigured: Boolean(googleOidcAndroidClientId),
    currentPlatformConfigured: Boolean(platformClientId),
    iosConfigured: Boolean(googleOidcIosClientId),
    webConfigured: Boolean(googleOidcWebClientId)
  };
}
