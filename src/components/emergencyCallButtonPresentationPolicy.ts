export type EmergencyCallButtonPresentation = {
  buttonIconSize: number;
  buttonLabel: string;
  cancelLabel: string;
  confirmLabel: string;
  dialogIconSize: number;
  dialogMessage: string;
  dialogTitle: string;
};

export const emergencyCallButtonDialogPresentation = {
  buttonLabel: "Ligar 190",
  cancelLabel: "Cancelar",
  confirmLabel: "Ligar",
  dialogIconSize: 18,
  dialogMessage:
    "O 190 e o canal oficial em risco imediato. O SinalSeguro nao substitui o atendimento publico de emergencia.",
  dialogTitle: "Ligar para 190?"
} as const;

export function resolveEmergencyCallButtonPresentation(compact: boolean): EmergencyCallButtonPresentation {
  return {
    ...emergencyCallButtonDialogPresentation,
    buttonIconSize: compact ? 18 : 20
  };
}
