export type BrandLockupPresentation = {
  accessibilityLabel: string;
  accessibilityRole: "image";
  logoSize: {
    height: number;
    width: number;
  };
};

export const brandLockupPresentation: BrandLockupPresentation = {
  accessibilityLabel: "SinalSeguro",
  accessibilityRole: "image",
  logoSize: {
    height: 72,
    width: 245
  }
};

export function resolveBrandLockupPresentation(): BrandLockupPresentation {
  return brandLockupPresentation;
}
