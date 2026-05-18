export type LiveCallWaitingDialogPresentation = {
  confirmLabel: string;
  message: string;
  title: string;
};

export function resolveLiveCallWaitingDialogPresentation(): LiveCallWaitingDialogPresentation {
  return {
    confirmLabel: "Entendi",
    message: "Quando um anjo entrar no pedido, você poderá chamar por aqui.",
    title: "Aguardando anjo"
  };
}
