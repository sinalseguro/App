import assert from "node:assert/strict";

import {
  resolveFinishFailedProgress,
  resolveFinishMediaStopSettledProgress,
  resolveFinishMediaStopSignaledProgress,
  resolveFinishMissingPackageProgress,
  resolveFinishRemoteSyncProgress,
  resolveFinishRequestedProgress,
  resolveMediaProtectionInProgress
} from "../src/features/emergency-home/finishFlowProgressPolicy";

assert.deepEqual(resolveMediaProtectionInProgress(20), {
  detail: "A camera ja foi encerrada. O app ainda esta criptografando e anexando a midia no cofre local.",
  progress: 58,
  status: "running",
  title: "Protegendo video"
});

assert.equal(resolveMediaProtectionInProgress(70).progress, 70);

assert.deepEqual(resolveFinishRequestedProgress(), {
  detail: "Interrompendo a gravacao local e salvando o pacote.",
  progress: 12,
  status: "running",
  title: "Encerrando chamado"
});

assert.deepEqual(resolveFinishMediaStopSignaledProgress(), {
  detail: "Camera sinalizada. O chamado saiu do modo ativo enquanto a midia continua protegendo.",
  progress: 24,
  status: "running",
  title: "Encerrando gravacao"
});

assert.deepEqual(resolveFinishMediaStopSettledProgress("attached"), {
  detail: "Midia criptografada. A finalizacao do pacote pode seguir em segundo plano.",
  progress: 72,
  status: "background",
  title: "Midia protegida"
});

assert.deepEqual(resolveFinishMediaStopSettledProgress("empty"), {
  detail: "Camera liberada. Confirmando se o pacote ja recebeu midia preservada.",
  progress: 48,
  status: "running",
  title: "Conferindo cofre"
});

assert.deepEqual(resolveFinishMissingPackageProgress(), {
  detail: "Nao havia chamado ativo para encerrar.",
  progress: 100,
  status: "warning",
  title: "Chamado nao encontrado"
});

assert.deepEqual(resolveFinishRemoteSyncProgress(), {
  detail: "Confirmando o encerramento seguro com a central.",
  progress: 86,
  status: "running",
  title: "Sincronizando chamado"
});

assert.deepEqual(resolveFinishFailedProgress(), {
  detail: "Nao foi possivel finalizar o pacote local. Tente novamente pelo botao seguro.",
  progress: 100,
  status: "error",
  title: "Falha no encerramento"
});

console.log("finish-flow-progress-policy ok");
