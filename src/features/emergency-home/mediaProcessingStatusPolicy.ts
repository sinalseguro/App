import type { MediaProcessingState } from "@/features/emergency/types";

export type MediaStopPurpose = "finish" | "live_call_handoff" | null;

export type MediaProcessingFinishProgressStatus = "running" | "background" | "done" | "warning" | "error";

export type MediaProcessingFinishProgress = {
  detail: string;
  progress: number;
  status: MediaProcessingFinishProgressStatus;
  title: string;
};

export type MediaStopSettlementResult = {
  attachedAssets: number;
  status: "attached" | "empty" | "error" | "idle";
};

export type MediaStopSettlementPresentation = {
  recordingStatus?: string;
  shouldRefreshOutbox: boolean;
};

export type MediaProcessingPresentation = {
  finishProgress?: MediaProcessingFinishProgress;
  recordingStatus?: string;
};

const releaseWaiterStates: MediaProcessingState[] = ["camera_released", "attached", "no_media", "error"];

export function shouldResolveMediaReleaseWaiter(state: MediaProcessingState) {
  return releaseWaiterStates.includes(state);
}

export function resolveLiveCallHandoffMediaStatus(state: MediaProcessingState): string | null {
  switch (state) {
    case "stop_requested":
      return "Anjo entrou. Liberando camera e microfone para transmitir.";
    case "camera_released":
      return "Camera liberada. Abrindo video ao vivo para o anjo.";
    case "plaintext_detected":
    case "encrypting":
    case "packaging":
    case "cleanup":
      return "Video local segue protegido. Transmissao ao anjo em preparacao.";
    case "attached":
      return "Video local protegido. Transmissao ao anjo ativa.";
    case "no_media":
      return "Camera liberada para transmissao. O pacote local segue com metadados.";
    case "error":
      return "Camera liberada com alerta local. O pedido continua ativo para o anjo.";
  }
}

export function resolveFinishMediaProcessingPresentation(
  state: MediaProcessingState
): MediaProcessingPresentation | null {
  switch (state) {
    case "stop_requested":
      return {
        finishProgress: {
          detail: "Camera sinalizada para encerrar. Aguarde a liberacao do microfone e da camera.",
          progress: 22,
          status: "running",
          title: "Encerrando gravacao"
        }
      };
    case "camera_released":
      return {
        recordingStatus: "Camera e microfone liberados. Video local segue em protecao.",
        finishProgress: {
          detail: "Camera e microfone foram liberados. A criptografia continua em segundo plano controlado.",
          progress: 42,
          status: "background",
          title: "Camera desligada"
        }
      };
    case "plaintext_detected":
      return {
        finishProgress: {
          detail: "Arquivo temporario localizado. Iniciando empacotamento seguro.",
          progress: 50,
          status: "background",
          title: "Empacotando video"
        }
      };
    case "encrypting":
    case "packaging":
      return {
        finishProgress: {
          detail: "Criptografando o video local antes de anexar ao cofre.",
          progress: 68,
          status: "background",
          title: "Criptografando"
        }
      };
    case "cleanup":
      return {
        finishProgress: {
          detail: "Removendo arquivo temporario claro e conferindo o cofre.",
          progress: 86,
          status: "background",
          title: "Limpando temporarios"
        }
      };
    case "attached":
      return {
        finishProgress: {
          detail: "Midia protegida e cofre atualizado.",
          progress: 100,
          status: "done",
          title: "Video protegido"
        }
      };
    case "no_media":
      return {
        finishProgress: {
          detail: "A camera encerrou sem devolver arquivo. O cofre mostra a causa tecnica saneada.",
          progress: 100,
          status: "warning",
          title: "Chamado salvo sem video"
        }
      };
    case "error":
      return {
        finishProgress: {
          detail: "Falha tecnica saneada durante a preservacao. Revise o cofre antes de novo teste.",
          progress: 100,
          status: "error",
          title: "Falha na midia"
        }
      };
  }
}

export function resolveMediaProcessingPresentation(
  state: MediaProcessingState,
  purpose: MediaStopPurpose
): MediaProcessingPresentation | null {
  if (purpose === "live_call_handoff") {
    const recordingStatus = resolveLiveCallHandoffMediaStatus(state);
    return recordingStatus ? { recordingStatus } : null;
  }

  return resolveFinishMediaProcessingPresentation(state);
}

export function shouldHandleMediaStopSettlement(input: {
  expectedSerial: number;
  serial: number;
}) {
  return input.serial > 0 && input.serial === input.expectedSerial;
}

export function resolveMediaStopSettlementPresentation(
  result: MediaStopSettlementResult
): MediaStopSettlementPresentation {
  const mediaAttached = result.status === "attached" && result.attachedAssets > 0;

  return {
    recordingStatus: mediaAttached ? "Video finalizado e preservado no cofre local." : undefined,
    shouldRefreshOutbox: mediaAttached
  };
}

export function resolveMediaStopSettlementFinishProgress(input: {
  status: MediaProcessingFinishProgressStatus | "idle";
  visible: boolean;
}): (MediaProcessingFinishProgress & { visible: true }) | null {
  if (!input.visible || input.status === "running") return null;

  return {
    detail: "Midia anexada ao cofre local apos a verificacao inicial.",
    progress: 100,
    status: "done",
    title: "Video protegido",
    visible: true
  };
}
