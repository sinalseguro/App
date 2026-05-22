export type AppLaunchPresentation = {
  brandName: string;
  progressAccessibilityLabel: string;
  progressDurationMs: number;
  progressFinalValue: number;
  progressInitialValue: number;
  progressInputRange: [number, number];
  progressOutputRange: [string, string];
};

export const appLaunchPresentation: AppLaunchPresentation = {
  brandName: "SinalSeguro",
  progressAccessibilityLabel: "Carregando SinalSeguro",
  progressDurationMs: 900,
  progressFinalValue: 1,
  progressInitialValue: 0.18,
  progressInputRange: [0, 1],
  progressOutputRange: ["18%", "100%"]
};

export function resolveAppLaunchPresentation(): AppLaunchPresentation {
  return appLaunchPresentation;
}
