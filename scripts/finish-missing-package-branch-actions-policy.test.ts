import assert from "node:assert/strict";

import { resolveFinishMissingPackageBranchActions } from "../src/features/emergency-home/finishMissingPackageBranchActionsPolicy";

assert.deepEqual(
  resolveFinishMissingPackageBranchActions({
    resultPresent: true,
    stopSerialPresent: false
  }),
  {
    shouldApply: false,
    shouldReturnAfterApply: false
  }
);

assert.deepEqual(
  resolveFinishMissingPackageBranchActions({
    resultPresent: false,
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
    shouldApply: true,
    shouldReturnAfterApply: true,
    shouldShowMissingPackageProgress: true
  }
);

assert.deepEqual(
  resolveFinishMissingPackageBranchActions({
    resultPresent: false,
    stopSerialPresent: true
  }),
  {
    finishProgress: undefined,
    recordingStatus: "Nenhum chamado ativo encontrado.",
    shouldApply: true,
    shouldReturnAfterApply: true,
    shouldShowMissingPackageProgress: false
  }
);

console.log("finish-missing-package-branch-actions-policy ok");
