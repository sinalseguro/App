export type FinishProgressStateStatus = "background" | "done" | "error" | "idle" | "running" | "warning";

export type FinishProgressStateSnapshot = {
  detail: string;
  progress: number;
  status: FinishProgressStateStatus;
  title: string;
  visible: boolean;
};

export const idleFinishProgressState: FinishProgressStateSnapshot = {
  detail: "",
  progress: 0,
  status: "idle",
  title: "",
  visible: false
};

export function resolveNextFinishProgressState(
  current: FinishProgressStateSnapshot,
  nextState: Partial<FinishProgressStateSnapshot>
): FinishProgressStateSnapshot {
  return {
    ...current,
    ...nextState,
    progress: Math.max(0, Math.min(100, nextState.progress ?? current.progress)),
    visible: true
  };
}

export function resolveClosedFinishProgressState(
  current: FinishProgressStateSnapshot
): FinishProgressStateSnapshot {
  return current.status === "running" && current.progress < 100 ? current : idleFinishProgressState;
}

export function resolveVaultOpeningFinishProgressState(
  current: FinishProgressStateSnapshot
): FinishProgressStateSnapshot {
  return {
    ...current,
    visible: false
  };
}
