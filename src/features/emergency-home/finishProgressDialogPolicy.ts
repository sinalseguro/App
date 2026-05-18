export type FinishProgressDialogStatus = "background" | "done" | "error" | "idle" | "running" | "warning";

export type FinishProgressDialogPresentation = {
  accentTone: "danger" | "secure" | "warning";
  canDismiss: boolean;
  iconKind: "shield" | "video_off";
  mutedActionAccessibilityLabel: string;
  mutedActionLabel: string;
  normalizedProgress: number;
  pendingText: string;
  primaryActionAccessibilityLabel: string;
  primaryActionLabel: string;
  shouldShowPendingRow: boolean;
};

export function resolveFinishProgressDialogPresentation(input: {
  progress: number;
  status: FinishProgressDialogStatus;
}): FinishProgressDialogPresentation {
  const isWarningOrError = input.status === "warning" || input.status === "error";
  return {
    accentTone:
      input.status === "error" ? "danger" : input.status === "warning" ? "warning" : "secure",
    canDismiss: input.status !== "running",
    iconKind: isWarningOrError ? "video_off" : "shield",
    mutedActionAccessibilityLabel: "Continuar na tela inicial",
    mutedActionLabel: "Continuar",
    normalizedProgress: Math.max(0, Math.min(100, input.progress)),
    pendingText: "Mantendo o pacote local consistente.",
    primaryActionAccessibilityLabel: "Abrir cofre local",
    primaryActionLabel: "Abrir cofre",
    shouldShowPendingRow: input.status === "running"
  };
}
