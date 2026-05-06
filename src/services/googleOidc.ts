import { Platform } from "react-native";

const googleOidcWebClientId = process.env.EXPO_PUBLIC_GOOGLE_OIDC_WEB_CLIENT_ID?.trim() ?? "";
const googleOidcIosClientId = process.env.EXPO_PUBLIC_GOOGLE_OIDC_IOS_CLIENT_ID?.trim() ?? "";
const googleOidcAndroidClientId = process.env.EXPO_PUBLIC_GOOGLE_OIDC_ANDROID_CLIENT_ID?.trim() ?? "";

function currentGoogleClientId() {
  if (Platform.OS === "ios") return googleOidcIosClientId;
  if (Platform.OS === "android") return googleOidcAndroidClientId;
  return googleOidcWebClientId;
}

export function getGoogleOidcAuthRequestConfig() {
  return {
    androidClientId: googleOidcAndroidClientId,
    iosClientId: googleOidcIosClientId,
    language: "pt-BR",
    scopes: ["openid", "profile", "email"],
    selectAccount: true,
    webClientId: googleOidcWebClientId
  };
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
