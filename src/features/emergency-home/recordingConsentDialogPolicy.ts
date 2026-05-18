export type RecordingConsentDialogPresentation = {
  cancelLabel: string;
  confirmLabel: string;
  message: string;
  title: string;
};

export function resolveRecordingConsentDialogPresentation(): RecordingConsentDialogPresentation {
  return {
    cancelLabel: "Agora nao",
    confirmLabel: "Abrir termos",
    message: "Revise e aceite os termos para permitir gravacao local durante o SOS.",
    title: "Autorizar gravacao"
  };
}
