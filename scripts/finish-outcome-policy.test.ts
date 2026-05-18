import assert from "node:assert/strict";

import { resolveFinishOutcomePolicy } from "../src/features/emergency-home/finishOutcomePolicy";

assert.deepEqual(
  resolveFinishOutcomePolicy({
    attachedAssetsAfterFinish: 1,
    liveVideoAttached: false,
    mediaWasHandedToLiveCall: false,
    remoteFinishFailed: false,
    stopResultStatus: "attached",
    stopSerialPresent: true
  }),
  {
    auditMarker: "local_evidence_protected",
    finishProgress: {
      detail: "Video protegido, camera liberada e pacote local finalizado.",
      progress: 100,
      status: "done",
      title: "Video protegido"
    },
    localEvidenceStatus: "protected",
    recordingStatus: "Chamado encerrado. Video preservado no cofre local."
  }
);

assert.deepEqual(
  resolveFinishOutcomePolicy({
    attachedAssetsAfterFinish: 1,
    liveVideoAttached: false,
    mediaWasHandedToLiveCall: false,
    remoteFinishFailed: true,
    stopSerialPresent: false
  }),
  {
    auditMarker: "local_evidence_protected",
    finishProgress: {
      detail: "Video protegido neste aparelho. A confirmacao com a central continuara em nova tentativa.",
      progress: 100,
      status: "warning",
      title: "Confirmacao pendente"
    },
    localEvidenceStatus: "protected",
    recordingStatus: "Video protegido localmente. Confirmacao central pendente."
  }
);

assert.deepEqual(
  resolveFinishOutcomePolicy({
    attachedAssetsAfterFinish: 0,
    liveVideoAttached: true,
    mediaWasHandedToLiveCall: true,
    remoteFinishFailed: false,
    stopSerialPresent: false
  }),
  {
    auditMarker: "local_evidence_protected",
    finishProgress: {
      detail: "Video protegido e anexado ao cofre local.",
      progress: 100,
      status: "done",
      title: "Video protegido"
    },
    localEvidenceStatus: "protected",
    recordingStatus: "Chamado encerrado. Video preservado no cofre local."
  }
);

assert.deepEqual(
  resolveFinishOutcomePolicy({
    attachedAssetsAfterFinish: 0,
    liveVideoAttached: false,
    mediaWasHandedToLiveCall: true,
    remoteFinishFailed: false,
    stopSerialPresent: false
  }),
  {
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
  }
);

assert.deepEqual(
  resolveFinishOutcomePolicy({
    attachedAssetsAfterFinish: 0,
    liveVideoAttached: false,
    mediaWasHandedToLiveCall: false,
    remoteFinishFailed: false,
    stopResultStatus: "attached",
    stopSerialPresent: true
  }),
  {
    auditMarker: "local_evidence_protected",
    finishProgress: {
      detail: "A midia foi protegida pela camera, mas o cofre ainda nao refletiu o anexo. Revise o item local.",
      progress: 100,
      status: "warning",
      title: "Verificacao pendente"
    },
    localEvidenceStatus: "protected",
    recordingStatus: "Chamado encerrado. Video local preservado, mas ainda sem reflexo final no cofre."
  }
);

assert.deepEqual(
  resolveFinishOutcomePolicy({
    attachedAssetsAfterFinish: 0,
    liveVideoAttached: false,
    mediaWasHandedToLiveCall: false,
    remoteFinishFailed: false,
    stopResultStatus: "empty",
    stopSerialPresent: true
  }),
  {
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
  }
);

assert.deepEqual(
  resolveFinishOutcomePolicy({
    attachedAssetsAfterFinish: 0,
    liveVideoAttached: false,
    mediaWasHandedToLiveCall: false,
    remoteFinishFailed: false,
    stopSerialPresent: false
  }),
  {
    auditMarker: "local_evidence_protected",
    finishProgress: {
      detail: "Pacote encerrado e preservado no cofre local.",
      progress: 100,
      status: "done",
      title: "Chamado encerrado"
    },
    localEvidenceStatus: "protected",
    recordingStatus: "Chamado encerrado. Pacote local salvo sem gravacao de video."
  }
);

console.log("finish-outcome-policy ok");
