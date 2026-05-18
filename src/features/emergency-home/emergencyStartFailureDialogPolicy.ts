export type EmergencyStartFailureDialogPresentation = {
  confirmLabel: string;
  message: string;
  title: string;
};

export function resolveEmergencyStartFailureDialogPresentation(): EmergencyStartFailureDialogPresentation {
  return {
    confirmLabel: "Entendi",
    message:
      "Nao foi possivel salvar o pacote local com seguranca neste dispositivo. Use 190, 193 ou 192 em risco imediato.",
    title: "Chamado nao preservado"
  };
}
