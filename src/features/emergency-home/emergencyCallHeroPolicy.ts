import type { EmergencyCallTarget } from "@/features/emergency-home/EmergencyCallTarget";

export type EmergencyCallHeroPresentation = {
  accessibilityHint: string;
  accessibilityLabel: string;
};

export function resolveEmergencyCallHeroPresentation(target: EmergencyCallTarget): EmergencyCallHeroPresentation {
  return {
    accessibilityHint: `Liga para ${target.number}`,
    accessibilityLabel: `${target.number} ${target.description}`
  };
}
