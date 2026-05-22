import type { EmergencyCallTarget } from "@/features/emergency-home/EmergencyCallTarget";

export type EmergencyCallDockLabelTextFit = {
  numberOfLines: number;
};

export type EmergencyCallDockTargetPresentation = {
  accessibilityHint: string;
  accessibilityLabel: string;
  accessibilityRole: "button";
  iconSize: number;
  labelTextFit: EmergencyCallDockLabelTextFit;
};

export const emergencyCallDockLabelTextFit: EmergencyCallDockLabelTextFit = {
  numberOfLines: 1
};

export const emergencyCallDockIconSize = 24;

export function buildEmergencyCallDockTargetPresentation(
  target: EmergencyCallTarget
): EmergencyCallDockTargetPresentation {
  return {
    accessibilityHint: `Abre confirmacao para ligar ${target.number}`,
    accessibilityLabel: target.label,
    accessibilityRole: "button",
    iconSize: emergencyCallDockIconSize,
    labelTextFit: emergencyCallDockLabelTextFit
  };
}
