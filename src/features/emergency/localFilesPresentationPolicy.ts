export type LocalFilesDialog = "player" | "cofre" | null;

export type LocalFilesResourceIconKey = "archive" | "book" | "play" | "refresh";

export type LocalFilesResourceTileId = "app-updates" | "how-it-works" | "player" | "vault";

export type LocalFilesResourceTile = {
  description: string;
  iconKey: LocalFilesResourceIconKey;
  id: LocalFilesResourceTileId;
  label: string;
};

export type LocalFilesMaintenanceInput = {
  activePackageDetected: boolean;
  blockedReferencedCount?: number;
  deletedCount?: number;
  maintenanceAvailable: boolean;
  migratedReferencedCount?: number;
  migrationBlockedCount?: number;
};

export const localFilesScreenCopy = {
  activePackageStatus: "Chamado ativo detectado. Volte ao SOS para finalizar a recuperacao.",
  deleteActiveBlockedMessage: "Finalize o chamado antes de excluir o arquivo.",
  deleteActiveBlockedTitle: "Finalize o chamado antes",
  deleteConfirmMessage: "O arquivo sera removido apenas deste dispositivo. Esta acao nao pode ser desfeita.",
  deleteConfirmTitle: "Excluir arquivo local?",
  deleteFailureTitle: "Exclusao nao concluida",
  deleteSuccessStatus: "Arquivo removido deste dispositivo.",
  emptyStatus: "Nenhum arquivo local neste dispositivo.",
  finishActiveHelpMessage:
    "Encerrar finaliza apenas o chamado ativo. Os arquivos ja salvos continuam no cofre local, a menos que voce exclua depois.",
  finishActiveHelpTitle: "Encerrar chamado",
  finishActiveMessageNoCode: "O pacote sera encerrado e preservado no cofre local. Nenhuma evidencia sera apagada.",
  finishActiveMessageWithCode:
    "Informe o codigo de encerramento configurado para impedir que outra pessoa finalize o chamado sem autorizacao.",
  finishActiveTitle: "Encerrar chamado ativo?",
  finishMissingStatus: "Nenhum chamado ativo encontrado para finalizar.",
  finishSuccessStatus: "Chamado finalizado e preservado no cofre local.",
  initialStatus: "Carregando arquivos locais...",
  loadedStatus: "Arquivos carregados.",
  mapExternalLocationWarning: "Ao abrir um mapa externo, a localizacao exata deste registro sera enviada ao app ou servico escolhido.",
  mapMissingMessage: "Este arquivo nao possui localizacao preservada para abrir no mapa.",
  mapMissingTitle: "Sem localizacao",
  mapUnavailableMessage: "Nao foi possivel abrir o aplicativo de mapa neste dispositivo.",
  mapUnavailableTitle: "Mapa indisponivel",
  playerHelpMessage:
    "O player mostra a midia do arquivo selecionado e seus dados principais. Quando ainda nao houver video, abra o cofre e escolha outro item.",
  playerHelpTitle: "Player seguro",
  refreshStatus: "Consultando atualizacoes no servico SinalSeguro...",
  selectedStatus: "Arquivo selecionado.",
  shareBlockedMessage: "O compartilhamento protegido sera liberado apenas para pessoas autorizadas dentro do SinalSeguro.",
  shareBlockedTitle: "Compartilhar pelo app",
  vaultHelpMessage:
    "O cofre guarda arquivos deste aparelho. Toque em um item para visualizar, abrir mapa, compartilhar pelo app quando liberado ou excluir localmente.",
  vaultHelpTitle: "Cofre local",
  verifyingResiduesStatus: "Verificando residuos de midia local..."
} as const;

export const localFilesResourceTiles: readonly LocalFilesResourceTile[] = [
  {
    description: "Rever",
    iconKey: "play",
    id: "player",
    label: "Player"
  },
  {
    description: "Arquivos",
    iconKey: "archive",
    id: "vault",
    label: "Cofre"
  },
  {
    description: "Privacidade",
    iconKey: "book",
    id: "how-it-works",
    label: "Funcionamento"
  },
  {
    description: "Atualizacoes",
    iconKey: "refresh",
    id: "app-updates",
    label: "Atualizar app"
  }
] as const;

export function buildLocalFilesTopBarContextLabel(activeDialog: LocalFilesDialog) {
  return activeDialog === "player" ? "Player seguro" : "Cofre local";
}

export function buildLocalFilesRefreshStatus(recordCount: number, nextStatus?: string) {
  if (nextStatus) return nextStatus;
  return recordCount > 0 ? localFilesScreenCopy.loadedStatus : localFilesScreenCopy.emptyStatus;
}

export function buildLocalFilesMaintenanceStatus(input: LocalFilesMaintenanceInput) {
  if (input.activePackageDetected) {
    return "Volte ao SOS para recuperar o chamado ativo antes da limpeza.";
  }

  if (!input.maintenanceAvailable) {
    return "Arquivos carregados. Nao foi possivel concluir a verificacao de residuos.";
  }

  if ((input.migrationBlockedCount ?? 0) > 0 || (input.blockedReferencedCount ?? 0) > 0) {
    return "Arquivos carregados. Ha midia clara legada referenciada que exige nova tentativa de migracao.";
  }

  if ((input.migratedReferencedCount ?? 0) > 0 || (input.deletedCount ?? 0) > 0) {
    return "Arquivos carregados. Midia legada foi protegida ou removida.";
  }

  return undefined;
}

export function buildLocalFilesUpdateDialogMessage({
  currentVersionLabel,
  latestVersionLabel,
  message
}: {
  currentVersionLabel: string;
  latestVersionLabel?: string | null;
  message: string;
}) {
  if (latestVersionLabel) {
    return `${message}\n\nInstalada: ${currentVersionLabel}\nDisponivel: ${latestVersionLabel}`;
  }

  return `${message}\n\nInstalada: ${currentVersionLabel}`;
}

export function buildLocalFilesMapDialogMessage(summaryItems: string[]) {
  return `${summaryItems.join("\n")}\n\n${localFilesScreenCopy.mapExternalLocationWarning}`;
}
