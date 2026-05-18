import assert from "node:assert/strict";

import { resolveFinishMissingPackageActions } from "../src/features/emergency-home/finishMissingPackagePolicy";

assert.deepEqual(
  resolveFinishMissingPackageActions({
    stopSerialPresent: false
  }),
  {
    finishProgress: {
      detail: "Nao havia chamado ativo para encerrar.",
      progress: 100,
      status: "warning",
      title: "Chamado nao encontrado"
    },
    recordingStatus: "Nenhum chamado ativo encontrado.",
    shouldShowMissingPackageProgress: true
  }
);

assert.deepEqual(
  resolveFinishMissingPackageActions({
    stopSerialPresent: true
  }),
  {
    finishProgress: undefined,
    recordingStatus: "Nenhum chamado ativo encontrado.",
    shouldShowMissingPackageProgress: false
  }
);

console.log("finish-missing-package-policy ok");
