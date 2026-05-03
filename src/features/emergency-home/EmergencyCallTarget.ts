export type EmergencyCallIcon = "police" | "fire" | "samu";

export class EmergencyCallTarget {
  constructor(
    readonly label: string,
    readonly description: string,
    readonly number: string,
    readonly icon: EmergencyCallIcon
  ) {}

  get callUri() {
    return `tel:${this.number}`;
  }
}

export const emergencyCallTargets = [
  new EmergencyCallTarget("Policia 190", "Policia Militar", "190", "police"),
  new EmergencyCallTarget("Bombeiros", "Corpo de Bombeiros", "193", "fire"),
  new EmergencyCallTarget("SAMU", "SAMU", "192", "samu")
] as const;
