export type BrandBackgroundTraceConfig = {
  delay: number;
  driftX: number;
  driftY: number;
  duration: number;
  left: number;
  size: number;
  top: number;
};

export type BrandBackgroundInterpolation = {
  inputRange: number[];
  outputRange: number[];
};

export type BrandBackgroundPresentation = {
  activeHaloOpacity: BrandBackgroundInterpolation;
  activeHaloScale: BrandBackgroundInterpolation;
  particleConfigs: BrandBackgroundTraceConfig[];
  particleOpacity: BrandBackgroundInterpolation;
  particleResetDuration: number;
  particleScale: BrandBackgroundInterpolation;
  particleTranslation: {
    inputRange: number[];
  };
  watermarkOpacity: BrandBackgroundInterpolation;
  watermarkPulse: {
    duration: number;
    endValue: number;
    startValue: number;
  };
  watermarkScale: BrandBackgroundInterpolation;
};

export const brandBackgroundParticleConfigs: BrandBackgroundTraceConfig[] = [
  { delay: 0, duration: 5200, left: 12, top: 20, driftX: 14, driftY: -28, size: 10 },
  { delay: 360, duration: 6400, left: 74, top: 22, driftX: -16, driftY: 24, size: 8 },
  { delay: 720, duration: 5900, left: 28, top: 68, driftX: 20, driftY: -22, size: 7 },
  { delay: 1080, duration: 7200, left: 82, top: 66, driftX: -24, driftY: -26, size: 9 },
  { delay: 1440, duration: 6600, left: 50, top: 16, driftX: -12, driftY: 30, size: 6 },
  { delay: 1800, duration: 6100, left: 18, top: 84, driftX: 26, driftY: -16, size: 5 },
  { delay: 2160, duration: 7600, left: 66, top: 82, driftX: -22, driftY: -24, size: 7 },
  { delay: 2520, duration: 6800, left: 42, top: 54, driftX: 13, driftY: -34, size: 6 },
  { delay: 2880, duration: 7000, left: 8, top: 52, driftX: 26, driftY: 18, size: 6 },
  { delay: 3240, duration: 7400, left: 90, top: 42, driftX: -28, driftY: 20, size: 7 },
  { delay: 3600, duration: 6200, left: 34, top: 32, driftX: 18, driftY: 24, size: 4 },
  { delay: 3960, duration: 7800, left: 58, top: 72, driftX: -18, driftY: -30, size: 5 }
];

const brandBackgroundBasePresentation = {
  activeHaloOpacity: {
    inputRange: [0, 1],
    outputRange: [0.1, 0.28]
  },
  activeHaloScale: {
    inputRange: [0, 1],
    outputRange: [0.94, 1.04]
  },
  particleConfigs: brandBackgroundParticleConfigs,
  particleOpacity: {
    inputRange: [0, 0.25, 0.75, 1],
    outputRange: [0.08, 0.34, 0.22, 0.08]
  },
  particleResetDuration: 1,
  particleScale: {
    inputRange: [0, 0.5, 1],
    outputRange: [0.72, 1.08, 0.84]
  },
  particleTranslation: {
    inputRange: [0, 1]
  },
  watermarkPulse: {
    duration: 5200,
    endValue: 1,
    startValue: 0
  }
};

export const inactiveBrandBackgroundPresentation: BrandBackgroundPresentation = {
  ...brandBackgroundBasePresentation,
  watermarkOpacity: {
    inputRange: [0, 1],
    outputRange: [0.08, 0.12]
  },
  watermarkScale: {
    inputRange: [0, 1],
    outputRange: [1.04, 1.08]
  }
};

export const activeBrandBackgroundPresentation: BrandBackgroundPresentation = {
  ...brandBackgroundBasePresentation,
  watermarkOpacity: {
    inputRange: [0, 1],
    outputRange: [0.1, 0.14]
  },
  watermarkScale: {
    inputRange: [0, 1],
    outputRange: [1.05, 1.09]
  }
};

export function resolveBrandBackgroundPresentation(active: boolean): BrandBackgroundPresentation {
  return active ? activeBrandBackgroundPresentation : inactiveBrandBackgroundPresentation;
}
