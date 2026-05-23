export type SafeScreenPresentationInput = {
  footer?: string;
  showBack?: boolean;
  showBrand?: boolean;
  subtitle?: string;
};

export type SafeScreenTextFit = {
  maxFontSizeMultiplier: number;
};

export type SafeScreenPresentation = {
  shouldRenderBrand: boolean;
  shouldRenderFooter: boolean;
  shouldRenderSubtitle: boolean;
  showBack: boolean;
  subtitleTextFit: SafeScreenTextFit;
  titleTextFit: SafeScreenTextFit;
  footerTextFit: SafeScreenTextFit;
};

export const safeScreenTitleTextFit: SafeScreenTextFit = {
  maxFontSizeMultiplier: 1.2
};

export const safeScreenSubtitleTextFit: SafeScreenTextFit = {
  maxFontSizeMultiplier: 1.2
};

export const safeScreenFooterTextFit: SafeScreenTextFit = {
  maxFontSizeMultiplier: 1.2
};

export function resolveSafeScreenPresentation({
  footer,
  showBack = true,
  showBrand = false,
  subtitle
}: SafeScreenPresentationInput): SafeScreenPresentation {
  return {
    shouldRenderBrand: showBrand,
    shouldRenderFooter: Boolean(footer),
    shouldRenderSubtitle: Boolean(subtitle),
    showBack,
    footerTextFit: safeScreenFooterTextFit,
    subtitleTextFit: safeScreenSubtitleTextFit,
    titleTextFit: safeScreenTitleTextFit
  };
}
