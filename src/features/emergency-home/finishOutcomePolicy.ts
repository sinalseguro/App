export type FinishOutcomeStopResultStatus = "attached" | "empty" | "error" | "idle";

export type FinishOutcomeLocalEvidenceStatus = "protected" | "metadata_only" | "failed";

export type FinishOutcomeAuditMarker =
  | "local_evidence_protected"
  | "local_evidence_metadata_only"
  | "local_evidence_failed";

export type FinishOutcomeProgressStatus = "done" | "warning";

export type FinishOutcomeProgress = {
  detail: string;
  progress: 100;
  status: FinishOutcomeProgressStatus;
  title: string;
};

export type FinishOutcomeDiagnosticReason = "camera_no_file_returned";

export type FinishOutcomeDecision = {
  auditMarker: FinishOutcomeAuditMarker;
  diagnosticReason?: FinishOutcomeDiagnosticReason;
  finishProgress: FinishOutcomeProgress;
  localEvidenceStatus: FinishOutcomeLocalEvidenceStatus;
  recordingStatus: string;
};

export type FinishOutcomePolicyInput = {
  attachedAssetsAfterFinish: number;
  liveVideoAttached: boolean;
  mediaWasHandedToLiveCall: boolean;
  remoteFinishFailed: boolean;
  stopResultStatus?: FinishOutcomeStopResultStatus;
  stopSerialPresent: boolean;
};

export function resolveFinishOutcomePolicy(input: FinishOutcomePolicyInput): FinishOutcomeDecision {
  const {
    attachedAssetsAfterFinish,
    liveVideoAttached,
    mediaWasHandedToLiveCall,
    remoteFinishFailed,
    stopResultStatus,
    stopSerialPresent
  } = input;

  if (attachedAssetsAfterFinish > 0 || liveVideoAttached) {
    return {
      auditMarker: "local_evidence_protected",
      finishProgress: {
        detail: remoteFinishFailed
          ? "Video protegido neste aparelho. A confirmacao com a central continuara em nova tentativa."
          : stopSerialPresent
            ? "Video protegido, camera liberada e pacote local finalizado."
            : "Video protegido e anexado ao cofre local.",
        progress: 100,
        status: remoteFinishFailed ? "warning" : "done",
        title: remoteFinishFailed ? "Confirmacao pendente" : "Video protegido"
      },
      localEvidenceStatus: "protected",
      recordingStatus: remoteFinishFailed
        ? "Video protegido localmente. Confirmacao central pendente."
        : "Chamado encerrado. Video preservado no cofre local."
    };
  }

  if (mediaWasHandedToLiveCall) {
    return {
      auditMarker: "local_evidence_failed",
      diagnosticReason: "camera_no_file_returned",
      finishProgress: {
        detail: "O anjo acompanhou a chamada, mas o video local nao foi anexado ao cofre deste aparelho.",
        progress: 100,
        status: "warning",
        title: "Video local pendente"
      },
      localEvidenceStatus: "failed",
      recordingStatus: "Chamado encerrado. A transmissao ocorreu, mas o video local precisa de nova verificacao."
    };
  }

  if (stopSerialPresent && stopResultStatus === "attached") {
    return {
      auditMarker: "local_evidence_protected",
      finishProgress: {
        detail: "A midia foi protegida pela camera, mas o cofre ainda nao refletiu o anexo. Revise o item local.",
        progress: 100,
        status: "warning",
        title: "Verificacao pendente"
      },
      localEvidenceStatus: "protected",
      recordingStatus: "Chamado encerrado. Video local preservado, mas ainda sem reflexo final no cofre."
    };
  }

  if (stopSerialPresent) {
    return {
      auditMarker: "local_evidence_metadata_only",
      diagnosticReason: "camera_no_file_returned",
      finishProgress: {
        detail: "A camera foi liberada, mas nao devolveu arquivo de video para este pacote.",
        progress: 100,
        status: "warning",
        title: "Chamado salvo sem video"
      },
      localEvidenceStatus: "metadata_only",
      recordingStatus: "Chamado encerrado. Pacote local salvo sem gravacao de video."
    };
  }

  return {
    auditMarker: "local_evidence_protected",
    finishProgress: {
      detail: "Pacote encerrado e preservado no cofre local.",
      progress: 100,
      status: "done",
      title: "Chamado encerrado"
    },
    localEvidenceStatus: "protected",
    recordingStatus: "Chamado encerrado. Pacote local salvo sem gravacao de video."
  };
}
