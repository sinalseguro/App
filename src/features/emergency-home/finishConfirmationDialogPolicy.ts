export type FinishConfirmationDialogPresentation = {
  cancelLabel: string;
  confirmLabel: string;
  inputAccessibilityLabel: string;
  inputPlaceholder: string;
  message: string;
  title: string;
};

export function resolveFinishConfirmationDialogPresentation(): FinishConfirmationDialogPresentation {
  return {
    cancelLabel: "Manter ativo",
    confirmLabel: "Encerrar chamado",
    inputAccessibilityLabel: "Codigo para encerrar chamado",
    inputPlaceholder: "Codigo de encerramento",
    message: "Informe o codigo para confirmar o encerramento do chamado.",
    title: "Confirmar encerramento"
  };
}
