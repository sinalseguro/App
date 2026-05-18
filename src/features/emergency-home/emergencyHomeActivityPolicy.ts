export type EmergencyHomeActivityInput = {
  activePackageId: string | null;
  finishInProgress: boolean;
  mediaStopPending: boolean;
  startInProgress: boolean;
};

export type EmergencyHomeActivityPresentation = {
  activeVisualState: boolean;
  statusBandActive: boolean;
  shouldKeepAwake: boolean;
};

export function resolveEmergencyHomeActivityPresentation(
  input: EmergencyHomeActivityInput
): EmergencyHomeActivityPresentation {
  const activeVisualState = Boolean(input.activePackageId || input.startInProgress);
  return {
    activeVisualState,
    statusBandActive: Boolean(activeVisualState || input.mediaStopPending),
    shouldKeepAwake: Boolean(
      input.activePackageId ||
        input.finishInProgress ||
        input.startInProgress ||
        input.mediaStopPending
    )
  };
}
