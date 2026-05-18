import assert from "node:assert/strict";

import type { MediaProcessingState } from "../src/features/emergency/types";
import {
  resolveFinishMediaProcessingPresentation,
  resolveLiveCallHandoffMediaStatus,
  resolveMediaProcessingPresentation,
  resolveMediaStopSettlementFinishProgress,
  resolveMediaStopSettlementPresentation,
  shouldHandleMediaStopSettlement,
  shouldResolveMediaReleaseWaiter
} from "../src/features/emergency-home/mediaProcessingStatusPolicy";

const releaseStates: MediaProcessingState[] = ["camera_released", "attached", "no_media", "error"];
const nonReleaseStates: MediaProcessingState[] = ["stop_requested", "plaintext_detected", "encrypting", "packaging", "cleanup"];

for (const state of releaseStates) {
  assert.equal(shouldResolveMediaReleaseWaiter(state), true, `${state} should resolve media release waiter`);
}

for (const state of nonReleaseStates) {
  assert.equal(shouldResolveMediaReleaseWaiter(state), false, `${state} should not resolve media release waiter`);
}

assert.equal(
  resolveLiveCallHandoffMediaStatus("stop_requested"),
  "Anjo entrou. Liberando camera e microfone para transmitir."
);
assert.equal(
  resolveLiveCallHandoffMediaStatus("camera_released"),
  "Camera liberada. Abrindo video ao vivo para o anjo."
);
assert.equal(
  resolveLiveCallHandoffMediaStatus("encrypting"),
  "Video local segue protegido. Transmissao ao anjo em preparacao."
);
assert.equal(
  resolveLiveCallHandoffMediaStatus("attached"),
  "Video local protegido. Transmissao ao anjo ativa."
);
assert.equal(
  resolveLiveCallHandoffMediaStatus("no_media"),
  "Camera liberada para transmissao. O pacote local segue com metadados."
);
assert.equal(
  resolveLiveCallHandoffMediaStatus("error"),
  "Camera liberada com alerta local. O pedido continua ativo para o anjo."
);

assert.deepEqual(resolveFinishMediaProcessingPresentation("stop_requested"), {
  finishProgress: {
    detail: "Camera sinalizada para encerrar. Aguarde a liberacao do microfone e da camera.",
    progress: 22,
    status: "running",
    title: "Encerrando gravacao"
  }
});

assert.deepEqual(resolveFinishMediaProcessingPresentation("camera_released"), {
  recordingStatus: "Camera e microfone liberados. Video local segue em protecao.",
  finishProgress: {
    detail: "Camera e microfone foram liberados. A criptografia continua em segundo plano controlado.",
    progress: 42,
    status: "background",
    title: "Camera desligada"
  }
});

assert.deepEqual(resolveFinishMediaProcessingPresentation("cleanup"), {
  finishProgress: {
    detail: "Removendo arquivo temporario claro e conferindo o cofre.",
    progress: 86,
    status: "background",
    title: "Limpando temporarios"
  }
});

assert.deepEqual(resolveFinishMediaProcessingPresentation("attached"), {
  finishProgress: {
    detail: "Midia protegida e cofre atualizado.",
    progress: 100,
    status: "done",
    title: "Video protegido"
  }
});

assert.deepEqual(resolveFinishMediaProcessingPresentation("no_media"), {
  finishProgress: {
    detail: "A camera encerrou sem devolver arquivo. O cofre mostra a causa tecnica saneada.",
    progress: 100,
    status: "warning",
    title: "Chamado salvo sem video"
  }
});

assert.deepEqual(resolveMediaProcessingPresentation("attached", "live_call_handoff"), {
  recordingStatus: "Video local protegido. Transmissao ao anjo ativa."
});

assert.deepEqual(resolveMediaProcessingPresentation("error", "finish"), {
  finishProgress: {
    detail: "Falha tecnica saneada durante a preservacao. Revise o cofre antes de novo teste.",
    progress: 100,
    status: "error",
    title: "Falha na midia"
  }
});

assert.equal(shouldHandleMediaStopSettlement({ expectedSerial: 7, serial: 0 }), false);
assert.equal(shouldHandleMediaStopSettlement({ expectedSerial: 7, serial: 6 }), false);
assert.equal(shouldHandleMediaStopSettlement({ expectedSerial: 7, serial: 7 }), true);

assert.deepEqual(resolveMediaStopSettlementPresentation({ attachedAssets: 2, status: "attached" }), {
  recordingStatus: "Video finalizado e preservado no cofre local.",
  shouldRefreshOutbox: true
});

assert.deepEqual(resolveMediaStopSettlementPresentation({ attachedAssets: 0, status: "attached" }), {
  recordingStatus: undefined,
  shouldRefreshOutbox: false
});

assert.deepEqual(resolveMediaStopSettlementPresentation({ attachedAssets: 0, status: "empty" }), {
  recordingStatus: undefined,
  shouldRefreshOutbox: false
});

assert.deepEqual(resolveMediaStopSettlementFinishProgress({ status: "done", visible: true }), {
  detail: "Midia anexada ao cofre local apos a verificacao inicial.",
  progress: 100,
  status: "done",
  title: "Video protegido",
  visible: true
});

assert.equal(resolveMediaStopSettlementFinishProgress({ status: "running", visible: true }), null);
assert.equal(resolveMediaStopSettlementFinishProgress({ status: "done", visible: false }), null);

console.log("media-processing-status-policy ok");
