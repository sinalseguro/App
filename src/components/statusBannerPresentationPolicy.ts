export type StatusBannerTone = "secure" | "warning" | "danger";

export type StatusBannerColorName = "secure" | "warning" | "danger";

export type StatusBannerTextFit = {
  adjustsFontSizeToFit: true;
  maxFontSizeMultiplier: number;
  minimumFontScale: number;
  numberOfLines: number;
};

export type StatusBannerPresentation = {
  borderColorToken: StatusBannerColorName;
  textTextFit: StatusBannerTextFit;
  titleTextFit: StatusBannerTextFit;
};

export const statusBannerTitleTextFit: StatusBannerTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.82,
  numberOfLines: 2
};

export const statusBannerBodyTextFit: StatusBannerTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.84,
  numberOfLines: 5
};

export const statusBannerTonePresentation: Record<StatusBannerTone, StatusBannerPresentation> = {
  danger: {
    borderColorToken: "danger",
    textTextFit: statusBannerBodyTextFit,
    titleTextFit: statusBannerTitleTextFit
  },
  secure: {
    borderColorToken: "secure",
    textTextFit: statusBannerBodyTextFit,
    titleTextFit: statusBannerTitleTextFit
  },
  warning: {
    borderColorToken: "warning",
    textTextFit: statusBannerBodyTextFit,
    titleTextFit: statusBannerTitleTextFit
  }
};

export function buildStatusBannerPresentation(tone: StatusBannerTone): StatusBannerPresentation {
  return statusBannerTonePresentation[tone];
}
