import assert from "node:assert/strict";

import { resolveLiveCallWaitingDialogPresentation } from "../src/features/emergency-home/liveCallWaitingDialogPolicy";

assert.deepEqual(resolveLiveCallWaitingDialogPresentation(), {
  confirmLabel: "Entendi",
  message: "Quando um anjo entrar no pedido, você poderá chamar por aqui.",
  title: "Aguardando anjo"
});

console.log("live-call-waiting-dialog-policy ok");
