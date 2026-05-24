export type AppLaunchPresentation = {
  brandName: string;
  brandNameTextFit: {
    adjustsFontSizeToFit: true;
    maxFontSizeMultiplier: number;
    minimumFontScale: number;
    numberOfLines: number;
  };
  progressAccessibilityLabel: string;
  progressAccessibilityRole: "progressbar";
  progressDurationMs: number;
  progressFinalValue: number;
  progressInitialValue: number;
  progressInputRange: [number, number];
  progressOutputRange: [string, string];
  symbolResizeMode: "contain";
  symbolSize: {
    height: number;
    width: number;
  };
};

export const appLaunchPresentation: AppLaunchPresentation = {
  brandName: "SinalSeguro",
  brandNameTextFit: {
    adjustsFontSizeToFit: true,
    maxFontSizeMultiplier: 1.2,
    minimumFontScale: 0.82,
    numberOfLines: 1
  },
  progressAccessibilityLabel: "Carregando SinalSeguro",
  progressAccessibilityRole: "progressbar",
  progressDurationMs: 900,
  progressFinalValue: 1,
  progressInitialValue: 0.18,
  progressInputRange: [0, 1],
  progressOutputRange: ["18%", "100%"],
  symbolResizeMode: "contain",
  symbolSize: {
    height: 132,
    width: 132
  }
};

export function resolveAppLaunchPresentation(): AppLaunchPresentation {
  return appLaunchPresentation;
}
