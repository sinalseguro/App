export type BrandLockupPresentation = {
  accessibilityLabel: string;
  accessibilityRole: "image";
  logoResizeMode: "contain";
  logoSize: {
    height: number;
    width: number;
  };
};

export const brandLockupPresentation: BrandLockupPresentation = {
  accessibilityLabel: "SinalSeguro",
  accessibilityRole: "image",
  logoResizeMode: "contain",
  logoSize: {
    height: 72,
    width: 245
  }
};

export function resolveBrandLockupPresentation(): BrandLockupPresentation {
  return brandLockupPresentation;
}
