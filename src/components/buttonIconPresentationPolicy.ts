export type ButtonIconLabelTextFit = {
  adjustsFontSizeToFit: boolean;
  maxFontSizeMultiplier: number;
  minimumFontScale: number;
  numberOfLines: number;
};

export type ButtonIconPresentation = {
  accessibilityRole: "button";
  disabled: boolean;
  iconSize: {
    height: number;
    width: number;
  };
  labelTextFit: ButtonIconLabelTextFit;
};

export const buttonIconLabelTextFit: ButtonIconLabelTextFit = {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.82,
  numberOfLines: 1
};

export const buttonIconVisualSize = {
  height: 28,
  width: 28
};

export function buildButtonIconPresentation(disabled: boolean): ButtonIconPresentation {
  return {
    accessibilityRole: "button",
    disabled,
    iconSize: buttonIconVisualSize,
    labelTextFit: buttonIconLabelTextFit
  };
}
