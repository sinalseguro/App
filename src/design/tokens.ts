export const colors = {
  background: "#F8F4FB",
  backgroundStrong: "#1E1B2E",
  splashBackground: "#120A20",
  surface: "#FFFFFF",
  surfaceMuted: "#F1E8F8",
  primary: "#6A1B9A",
  accent: "#EC407A",
  accentSoft: "#FF80AB",
  panic: "#C2185B",
  secure: "#146C43",
  warning: "#A65F00",
  danger: "#B42318",
  text: "#211A2F",
  textMuted: "#625770",
  textOnDark: "#FFFFFF",
  textOnDarkMuted: "#E7DDF0",
  border: "#DFD3EA"
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
};

export const radius = {
  sm: 6,
  md: 8,
  lg: 14,
  pill: 999
};

export const typography = {
  title: 28,
  subtitle: 16,
  body: 15,
  small: 13,
  button: 16
};

export const shadow = {
  shadowColor: "#1E1B2E",
  shadowOpacity: 0.12,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3
};

export const buttonShadow = {
  boxShadow: "0 4px 10px rgba(18, 10, 32, 0.12)",
  shadowColor: colors.splashBackground,
  shadowOpacity: 0.12,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3
};

export const buttonSurface = {
  backgroundColor: "rgba(236, 64, 122, 0.12)",
  borderColor: "rgba(236, 64, 122, 0.42)",
  borderRadius: radius.md,
  borderWidth: 1
};

export const buttonSurfacePressed = {
  backgroundColor: "rgba(236, 64, 122, 0.18)",
  borderColor: "rgba(236, 64, 122, 0.58)"
};

export const motion = {
  fastMs: 140,
  normalMs: 220,
  holdMs: 1800
};
