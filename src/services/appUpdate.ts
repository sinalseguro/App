import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Linking, Platform } from "react-native";

import { ApiAppRelease, ApiRequestError, apiClient, apiConfig } from "@/services/apiClient";

const DAILY_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
const UPDATE_STATE_KEY = "sinalseguro.app-update.state.v1";
const APPROVED_HOST = "www.sinalseguro.com.br";
const ANDROID_DOWNLOAD_PATH = "/downloads/private/android/sinalseguro_android.apk";
const ANDROID_PORTAL_PATH = "/baixar/android";
const CHECKSUM_PATH = "/downloads/private/checksums.txt";
const ANDROID_PORTAL_URL = `https://${APPROVED_HOST}${ANDROID_PORTAL_PATH}`;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;

export type AppUpdateStatus = "available" | "current" | "unavailable" | "unsupported";

export type AppUpdateState = {
  checkedAt: string;
  checksumUrl?: string;
  currentVersion: string;
  currentVersionCode?: number;
  downloadUrl?: string;
  latestVersion?: string;
  latestVersionCode?: number;
  message: string;
  portalUrl?: string;
  sha256?: string;
  status: AppUpdateStatus;
  updatedAt?: string;
};

function getCurrentVersion() {
  return Constants.expoConfig?.version ?? Constants.manifest2?.extra?.expoClient?.version ?? "0.0.0";
}

function getCurrentVersionCode() {
  const versionCode = Constants.expoConfig?.android?.versionCode;
  return typeof versionCode === "number" ? versionCode : undefined;
}

export function isAppUpdateStateForCurrentApp(state: AppUpdateState) {
  const currentVersion = getCurrentVersion();
  const currentVersionCode = getCurrentVersionCode();

  if (state.currentVersion !== currentVersion) return false;
  if (typeof currentVersionCode === "number" && state.currentVersionCode !== currentVersionCode) return false;

  return true;
}

function compareVersionSegments(current: string, latest: string) {
  const currentSegments = current.split(".").map((segment) => Number.parseInt(segment, 10) || 0);
  const latestSegments = latest.split(".").map((segment) => Number.parseInt(segment, 10) || 0);
  const maxLength = Math.max(currentSegments.length, latestSegments.length);

  for (let index = 0; index < maxLength; index += 1) {
    const currentValue = currentSegments[index] ?? 0;
    const latestValue = latestSegments[index] ?? 0;
    if (latestValue > currentValue) return 1;
    if (latestValue < currentValue) return -1;
  }

  return 0;
}

function approvedUrl(value: string, allowedPaths: string[]) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.hostname !== APPROVED_HOST || !allowedPaths.includes(url.pathname)) {
    throw new Error("URL de atualizacao fora do canal oficial SinalSeguro.");
  }

  return url.toString();
}

function normalizeRelease(release: ApiAppRelease) {
  if (release.platform !== "android") {
    throw new Error("Release recebida nao pertence ao canal Android.");
  }
  if (release.status !== "available") {
    throw new Error("Release Android pausada no servidor.");
  }
  if (!SHA256_PATTERN.test(release.sha256)) {
    throw new Error("Checksum da release Android invalido.");
  }

  return {
    ...release,
    checksumUrl: release.checksumUrl ? approvedUrl(release.checksumUrl, [CHECKSUM_PATH]) : undefined,
    downloadUrl: approvedUrl(release.downloadUrl, [ANDROID_DOWNLOAD_PATH]),
    portalUrl: approvedUrl(release.portalUrl, [ANDROID_PORTAL_PATH])
  };
}

function isUpdateAvailable(release: ApiAppRelease) {
  const currentVersionCode = getCurrentVersionCode();
  if (typeof currentVersionCode === "number") {
    return release.versionCode > currentVersionCode;
  }

  return compareVersionSegments(getCurrentVersion(), release.latestVersion) > 0;
}

function buildState(rawRelease: ApiAppRelease, checkedAt: string): AppUpdateState {
  const release = normalizeRelease(rawRelease);
  const currentVersion = getCurrentVersion();
  const currentVersionCode = getCurrentVersionCode();
  const available = isUpdateAvailable(release);

  return {
    checkedAt,
    checksumUrl: release.checksumUrl,
    currentVersion,
    ...(typeof currentVersionCode === "number" ? { currentVersionCode } : {}),
    downloadUrl: release.downloadUrl,
    latestVersion: release.latestVersion,
    latestVersionCode: release.versionCode,
    message:
      available || release.requiredUpdate
        ? `Atualizacao ${release.latestVersion} disponivel pelo portal oficial SinalSeguro.`
        : `Seu app esta atualizado na versao ${currentVersion}.`,
    portalUrl: release.portalUrl,
    sha256: release.sha256,
    status: available || release.requiredUpdate ? "available" : "current",
    updatedAt: release.updatedAt ?? release.publishedAt
  };
}

async function saveUpdateState(state: AppUpdateState) {
  await AsyncStorage.setItem(UPDATE_STATE_KEY, JSON.stringify(state));
}

export async function getStoredAppUpdateState() {
  const raw = await AsyncStorage.getItem(UPDATE_STATE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AppUpdateState;
  } catch {
    await AsyncStorage.removeItem(UPDATE_STATE_KEY);
    return null;
  }
}

function unavailableState(checkedAt: string, message: string): AppUpdateState {
  return {
    checkedAt,
    currentVersion: getCurrentVersion(),
    ...(typeof getCurrentVersionCode() === "number" ? { currentVersionCode: getCurrentVersionCode() } : {}),
    message,
    portalUrl: ANDROID_PORTAL_URL,
    status: "unavailable"
  };
}

export async function checkForAppUpdate(options: { force?: boolean } = {}) {
  const now = new Date();
  const checkedAt = now.toISOString();

  if (Platform.OS !== "android") {
    const state: AppUpdateState = {
      checkedAt,
      currentVersion: getCurrentVersion(),
      message: "Atualizacao pelo portal esta habilitada apenas no Android nesta etapa.",
      status: "unsupported"
    };
    await saveUpdateState(state);
    return state;
  }

  if (!options.force) {
    const previousState = await getStoredAppUpdateState();
    if (
      previousState &&
      previousState.status !== "unavailable" &&
      isAppUpdateStateForCurrentApp(previousState) &&
      now.getTime() - new Date(previousState.checkedAt).getTime() < DAILY_CHECK_INTERVAL_MS
    ) {
      return previousState;
    }
  }

  if (!apiConfig.apiEnabled || !apiConfig.apiBaseUrl) {
    return unavailableState(
      checkedAt,
      "A verificacao segura de atualizacao sera feita quando a API SinalSeguro estiver habilitada."
    );
  }

  const session = await apiClient.getStoredSession();
  if (!session?.access) {
    return unavailableState(checkedAt, "Entre com sua conta SinalSeguro para verificar atualizacoes com seguranca.");
  }

  try {
    const release = await apiClient.getCurrentAppRelease({
      platform: "android",
      version: getCurrentVersion(),
      versionCode: getCurrentVersionCode()
    });
    const state = buildState(release, checkedAt);
    await saveUpdateState(state);
    return state;
  } catch (error) {
    const message =
      error instanceof ApiRequestError && error.status === 401
        ? "Entre novamente com sua conta SinalSeguro para verificar atualizacoes."
        : "Nao foi possivel verificar atualizacao agora. Tente novamente mais tarde.";
    return unavailableState(checkedAt, message);
  }
}

export async function openAppUpdateDownload(state?: AppUpdateState | null) {
  const portalUrl = state?.portalUrl ?? ANDROID_PORTAL_URL;
  await Linking.openURL(approvedUrl(portalUrl, [ANDROID_PORTAL_PATH]));
}
