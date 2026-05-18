import assert from "node:assert/strict";

import {
  resolveInterruptedRecoveryFinishProgress,
  resolveInterruptedResidueRecoveryProgress
} from "../src/features/emergency-home/interruptedRecoveryProgressPolicy";

assert.deepEqual(resolveInterruptedRecoveryFinishProgress(1), {
  detail: "O app recuperou um chamado interrompido sem reabrir a camera.",
  progress: 100,
  status: "done",
  title: "Chamado recuperado"
});

assert.deepEqual(resolveInterruptedRecoveryFinishProgress(0), {
  detail: "O app encontrou um chamado interrompido e salvou a causa tecnica sem reativar camera ou microfone.",
  progress: 100,
  status: "warning",
  title: "Chamado recuperado sem video"
});

assert.deepEqual(resolveInterruptedResidueRecoveryProgress(), {
  detail: "Arquivo temporario privado encontrado. Criptografando antes de atualizar o cofre.",
  progress: 36,
  status: "running",
  title: "Recuperando video"
});

console.log("interrupted-recovery-progress-policy ok");
