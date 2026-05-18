import type { EmergencyCallTarget } from "./EmergencyCallTarget";

export type EmergencyCallConfirmationPresentation = {
  cancelLabel: string;
  confirmLabel: string;
  message: string;
  title: string;
};

export function resolveEmergencyCallConfirmation(target: EmergencyCallTarget): EmergencyCallConfirmationPresentation {
  return {
    cancelLabel: "Cancelar",
    confirmLabel: "Ligar",
    message: "",
    title: `Ligar para ${target.description}?`
  };
}
