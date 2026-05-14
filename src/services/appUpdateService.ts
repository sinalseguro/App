import { checkForAppUpdate } from "@/services/appUpdate";

export type AppUpdateCheck = {
  status: "api_disabled" | "current" | "update_available" | "unsupported" | "unavailable";
  currentVersion: string;
  latestVersion?: string;
  message: string;
  downloadUrl?: string;
};

export async function checkAppUpdate(): Promise<AppUpdateCheck> {
  const state = await checkForAppUpdate({ force: true });

  if (state.status === "available") {
    return {
      currentVersion: state.currentVersion,
      downloadUrl: state.portalUrl ?? state.downloadUrl,
      latestVersion: state.latestVersion,
      message: state.message,
      status: "update_available"
    };
  }

  return {
    currentVersion: state.currentVersion,
    downloadUrl: state.portalUrl,
    latestVersion: state.latestVersion,
    message: state.message,
    status: state.status
  };
}
