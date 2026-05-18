export type ProtectedRouteDialogPresentation = {
  cancelLabel: string;
  confirmLabel: string;
  inputAccessibilityLabel: string;
  inputPlaceholder: string;
  message: string;
  title: string;
};

export function resolveProtectedRouteDialogPresentation(): ProtectedRouteDialogPresentation {
  return {
    cancelLabel: "Cancelar",
    confirmLabel: "Liberar",
    inputAccessibilityLabel: "Codigo para abrir area protegida",
    inputPlaceholder: "Codigo de seguranca",
    message: "Informe o codigo de seguranca para continuar.",
    title: "Codigo de seguranca"
  };
}
