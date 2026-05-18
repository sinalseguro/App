import assert from "node:assert/strict";

import {
  initialLocalSosPackageStatus,
  resolveLocalSosPackageStatus
} from "../src/features/emergency-home/localSosPackageStatusPolicy";

assert.equal(initialLocalSosPackageStatus, "Pronto para pedir ajuda.");

assert.equal(
  resolveLocalSosPackageStatus({ attachedAssetCount: 1, event: "interrupted_recovered" }),
  "Chamado anterior recuperado. Video preservado no cofre local."
);

assert.equal(
  resolveLocalSosPackageStatus({ attachedAssetCount: 0, event: "interrupted_recovered" }),
  "Chamado anterior recuperado sem video preservado. Revise a causa saneada no cofre."
);

assert.equal(
  resolveLocalSosPackageStatus({ event: "live_call_recording_started" }),
  "Chamada em andamento com seu anjo. Gravando neste aparelho."
);

assert.equal(
  resolveLocalSosPackageStatus({ audioCaptured: true, event: "live_call_recording_preserved" }),
  "Chamada salva no cofre deste aparelho."
);

assert.equal(
  resolveLocalSosPackageStatus({ audioCaptured: false, event: "live_call_recording_preserved" }),
  "Video da chamada salvo no cofre deste aparelho."
);

assert.equal(
  resolveLocalSosPackageStatus({ event: "media_protection_in_progress" }),
  "Protecao do video local em andamento. O cofre sera atualizado automaticamente."
);

assert.equal(resolveLocalSosPackageStatus({ event: "start_requested" }), "Pedindo ajuda...");
assert.equal(
  resolveLocalSosPackageStatus({ event: "start_failed" }),
  "Nao foi possivel iniciar o chamado neste aparelho."
);
assert.equal(resolveLocalSosPackageStatus({ event: "finish_requested" }), "Encerrando chamado seguro...");
assert.equal(resolveLocalSosPackageStatus({ event: "finish_missing_package" }), "Nenhum chamado ativo encontrado.");
assert.equal(
  resolveLocalSosPackageStatus({ event: "finish_failed" }),
  "Nao foi possivel encerrar o chamado neste aparelho. Tente novamente pelo botao seguro."
);

console.log("local-sos-package-status-policy ok");
