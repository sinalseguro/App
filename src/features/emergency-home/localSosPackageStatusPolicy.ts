export const initialLocalSosPackageStatus = "Pronto para pedir ajuda.";

export type LocalSosPackageStatusInput =
  | {
      attachedAssetCount: number;
      event: "interrupted_recovered";
    }
  | {
      event: "finish_failed" | "finish_missing_package" | "finish_requested" | "live_call_recording_started" | "media_protection_in_progress" | "start_failed" | "start_requested";
    }
  | {
      audioCaptured: boolean;
      event: "live_call_recording_preserved";
    };

export function resolveLocalSosPackageStatus(input: LocalSosPackageStatusInput) {
  switch (input.event) {
    case "finish_failed":
      return "Nao foi possivel encerrar o chamado neste aparelho. Tente novamente pelo botao seguro.";
    case "finish_missing_package":
      return "Nenhum chamado ativo encontrado.";
    case "finish_requested":
      return "Encerrando chamado seguro...";
    case "interrupted_recovered":
      return input.attachedAssetCount > 0
        ? "Chamado anterior recuperado. Video preservado no cofre local."
        : "Chamado anterior recuperado sem video preservado. Revise a causa saneada no cofre.";
    case "live_call_recording_preserved":
      return input.audioCaptured
        ? "Chamada salva no cofre deste aparelho."
        : "Video da chamada salvo no cofre deste aparelho.";
    case "live_call_recording_started":
      return "Chamada em andamento com seu anjo. Gravando neste aparelho.";
    case "media_protection_in_progress":
      return "Protecao do video local em andamento. O cofre sera atualizado automaticamente.";
    case "start_failed":
      return "Nao foi possivel iniciar o chamado neste aparelho.";
    case "start_requested":
      return "Pedindo ajuda...";
  }
}
