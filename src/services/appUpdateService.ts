import { checkForAppUpdate } from "@/services/appUpdate";

export type AppUpdateCheck = {
  status: "api_disabled" | "current" | "update_available" | "unsupported" | "unavailable";
  currentVersion: string;
  currentVersionCode?: number;
  latestVersion?: string;
  latestVersionCode?: number;
  message: string;
  downloadUrl?: string;
};

export async function checkAppUpdate(): Promise<AppUpdateCheck> {
  const state = await checkForAppUpdate({ force: true });

  if (state.status === "available") {
    return {
      currentVersion: state.currentVersion,
      currentVersionCode: state.currentVersionCode,
      downloadUrl: state.portalUrl ?? state.downloadUrl,
      latestVersion: state.latestVersion,
      latestVersionCode: state.latestVersionCode,
      message: state.message,
      status: "update_available"
    };
  }

  return {
    currentVersion: state.currentVersion,
    currentVersionCode: state.currentVersionCode,
    downloadUrl: state.portalUrl,
    latestVersion: state.latestVersion,
    latestVersionCode: state.latestVersionCode,
    message: state.message,
    status: state.status
  };
}
