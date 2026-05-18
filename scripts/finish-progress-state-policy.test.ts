import assert from "node:assert/strict";

import {
  idleFinishProgressState,
  resolveClosedFinishProgressState,
  resolveNextFinishProgressState,
  resolveVaultOpeningFinishProgressState,
  type FinishProgressStateSnapshot
} from "../src/features/emergency-home/finishProgressStatePolicy";

const runningState: FinishProgressStateSnapshot = {
  detail: "Protegendo video.",
  progress: 45,
  status: "running",
  title: "Encerrando chamado",
  visible: true
};

assert.deepEqual(resolveNextFinishProgressState(runningState, { progress: 130, status: "done" }), {
  detail: "Protegendo video.",
  progress: 100,
  status: "done",
  title: "Encerrando chamado",
  visible: true
});

assert.deepEqual(resolveNextFinishProgressState(runningState, { detail: "Aguardando cofre.", progress: -20 }), {
  detail: "Aguardando cofre.",
  progress: 0,
  status: "running",
  title: "Encerrando chamado",
  visible: true
});

assert.equal(resolveClosedFinishProgressState(runningState), runningState);
assert.deepEqual(resolveClosedFinishProgressState({ ...runningState, progress: 100 }), idleFinishProgressState);
assert.deepEqual(resolveClosedFinishProgressState({ ...runningState, status: "warning" }), idleFinishProgressState);
assert.deepEqual(resolveVaultOpeningFinishProgressState(runningState), {
  ...runningState,
  visible: false
});

console.log("finish-progress-state-policy ok");
