import { Platform } from "react-native";
import { z } from "zod";
import { apiConfig } from "@/services/apiClient";

const APP_VERSION = "0.1.0";

const AppReleaseSchema = z.object({
  latestVersion: z.string(),
  minimumSupportedVersion: z.string().optional(),
  downloadUrl: z.string().url().optional(),
  releaseNotes: z.string().optional()
});

export type AppUpdateCheck = {
  status: "api_disabled" | "current" | "update_available" | "unsupported" | "unavailable";
  currentVersion: string;
  latestVersion?: string;
  message: string;
  downloadUrl?: string;
};

function compareVersions(left: string, right: string) {
  const leftParts = left.split(".").map((part) => Number(part) || 0);
  const rightParts = right.split(".").map((part) => Number(part) || 0);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftValue = leftParts[index] ?? 0;
    const rightValue = rightParts[index] ?? 0;
    if (leftValue > rightValue) return 1;
    if (leftValue < rightValue) return -1;
  }

  return 0;
}

export async function checkAppUpdate(): Promise<AppUpdateCheck> {
  if (!apiConfig.apiEnabled || !apiConfig.apiBaseUrl) {
    return {
      currentVersion: APP_VERSION,
      message:
        "A checagem de atualizacao sera feita pelo servico SinalSeguro quando a conta do app estiver conectada.",
      status: "api_disabled"
    };
  }

  try {
    const platform = Platform.OS === "ios" ? "ios" : "android";
    const response = await fetch(
      `${apiConfig.apiBaseUrl}/app/releases/latest?platform=${platform}&version=${APP_VERSION}`
    );

    if (!response.ok) {
      throw new Error("Resposta de atualizacao indisponivel");
    }

    const release = AppReleaseSchema.parse(await response.json());
    const minimumSupportedVersion = release.minimumSupportedVersion ?? APP_VERSION;

    if (compareVersions(APP_VERSION, minimumSupportedVersion) < 0) {
      return {
        currentVersion: APP_VERSION,
        downloadUrl: release.downloadUrl,
        latestVersion: release.latestVersion,
        message:
          "Esta versao precisa ser atualizada antes de usar novos recursos conectados.",
        status: "unsupported"
      };
    }

    if (compareVersions(APP_VERSION, release.latestVersion) < 0) {
      return {
        currentVersion: APP_VERSION,
        downloadUrl: release.downloadUrl,
        latestVersion: release.latestVersion,
        message: release.releaseNotes ?? "Existe uma nova versao disponivel para instalacao.",
        status: "update_available"
      };
    }

    return {
      currentVersion: APP_VERSION,
      latestVersion: release.latestVersion,
      message: "Esta instalacao esta na versao mais recente informada pelo SinalSeguro.",
      status: "current"
    };
  } catch {
    return {
      currentVersion: APP_VERSION,
      message: "Nao foi possivel consultar atualizacoes agora. Tente novamente quando estiver conectado.",
      status: "unavailable"
    };
  }
}
