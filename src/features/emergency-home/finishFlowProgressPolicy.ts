export type FinishFlowProgressStatus = "background" | "error" | "running" | "warning";

export type FinishFlowProgress = {
  detail: string;
  progress: number;
  status: FinishFlowProgressStatus;
  title: string;
};

export type FinishFlowMediaStopStatus = "attached" | "empty" | "error" | "idle";

export function resolveMediaProtectionInProgress(currentProgress: number): FinishFlowProgress {
  return {
    detail: "A camera ja foi encerrada. O app ainda esta criptografando e anexando a midia no cofre local.",
    progress: Math.max(currentProgress, 58),
    status: "running",
    title: "Protegendo video"
  };
}

export function resolveFinishRequestedProgress(): FinishFlowProgress {
  return {
    detail: "Interrompendo a gravacao local e salvando o pacote.",
    progress: 12,
    status: "running",
    title: "Encerrando chamado"
  };
}

export function resolveFinishMediaStopSignaledProgress(): FinishFlowProgress {
  return {
    detail: "Camera sinalizada. O chamado saiu do modo ativo enquanto a midia continua protegendo.",
    progress: 24,
    status: "running",
    title: "Encerrando gravacao"
  };
}

export function resolveFinishMediaStopSettledProgress(status: FinishFlowMediaStopStatus): FinishFlowProgress {
  return {
    detail:
      status === "attached"
        ? "Midia criptografada. A finalizacao do pacote pode seguir em segundo plano."
        : "Camera liberada. Confirmando se o pacote ja recebeu midia preservada.",
    progress: status === "attached" ? 72 : 48,
    status: status === "attached" ? "background" : "running",
    title: status === "attached" ? "Midia protegida" : "Conferindo cofre"
  };
}

export function resolveFinishMissingPackageProgress(): FinishFlowProgress {
  return {
    detail: "Nao havia chamado ativo para encerrar.",
    progress: 100,
    status: "warning",
    title: "Chamado nao encontrado"
  };
}

export function resolveFinishRemoteSyncProgress(): FinishFlowProgress {
  return {
    detail: "Confirmando o encerramento seguro com a central.",
    progress: 86,
    status: "running",
    title: "Sincronizando chamado"
  };
}

export function resolveFinishFailedProgress(): FinishFlowProgress {
  return {
    detail: "Nao foi possivel finalizar o pacote local. Tente novamente pelo botao seguro.",
    progress: 100,
    status: "error",
    title: "Falha no encerramento"
  };
}
