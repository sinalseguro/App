export type StatusBannerTone = "secure" | "warning" | "danger";

export type StatusBannerColorName = "secure" | "warning" | "danger";

export type StatusBannerPresentation = {
  borderColorToken: StatusBannerColorName;
};

export const statusBannerTonePresentation: Record<StatusBannerTone, StatusBannerPresentation> = {
  danger: {
    borderColorToken: "danger"
  },
  secure: {
    borderColorToken: "secure"
  },
  warning: {
    borderColorToken: "warning"
  }
};

export function buildStatusBannerPresentation(tone: StatusBannerTone): StatusBannerPresentation {
  return statusBannerTonePresentation[tone];
}
