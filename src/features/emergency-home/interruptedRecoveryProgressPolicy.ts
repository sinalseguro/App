export type InterruptedRecoveryFinishProgress = {
  detail: string;
  progress: 100;
  status: "done" | "warning";
  title: string;
};

export type InterruptedResidueRecoveryProgress = {
  detail: string;
  progress: 36;
  status: "running";
  title: string;
};

export function resolveInterruptedRecoveryFinishProgress(
  attachedAssetCount: number
): InterruptedRecoveryFinishProgress {
  return {
    detail:
      attachedAssetCount > 0
        ? "O app recuperou um chamado interrompido sem reabrir a camera."
        : "O app encontrou um chamado interrompido e salvou a causa tecnica sem reativar camera ou microfone.",
    progress: 100,
    status: attachedAssetCount > 0 ? "done" : "warning",
    title: attachedAssetCount > 0 ? "Chamado recuperado" : "Chamado recuperado sem video"
  };
}

export function resolveInterruptedResidueRecoveryProgress(): InterruptedResidueRecoveryProgress {
  return {
    detail: "Arquivo temporario privado encontrado. Criptografando antes de atualizar o cofre.",
    progress: 36,
    status: "running",
    title: "Recuperando video"
  };
}
