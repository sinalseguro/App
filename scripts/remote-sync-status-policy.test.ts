import assert from "node:assert/strict";

import {
  activeRemoteSyncRetryMessage,
  activeRemoteSyncStatusMessage,
  resolveActiveRemoteSyncStatus
} from "../src/features/emergency-home/remoteSyncStatusPolicy";

assert.equal(activeRemoteSyncRetryMessage(), "SOS local ativo. Tentando avisar seus anjos pela internet.");

assert.equal(
  activeRemoteSyncStatusMessage(
    {
      recipientCount: 1,
      remoteSessionId: "session-1",
      status: "sent_to_ec2"
    },
    { locationText: "Localizacao preservada." }
  ),
  "Você pediu ajuda. Localizacao preservada. Pedido enviado para 1 anjo."
);

assert.equal(
  activeRemoteSyncStatusMessage(
    {
      recipientCount: 2,
      remoteSessionId: "session-1",
      status: "sent_to_ec2"
    },
    { locationText: "Localizacao nao registrada." }
  ),
  "Você pediu ajuda. Localizacao nao registrada. Pedido enviado para 2 anjos."
);

assert.equal(
  activeRemoteSyncStatusMessage({
    recipientCount: 0,
    remoteSessionId: "session-1",
    status: "sent_to_ec2"
  }),
  "Você pediu ajuda. Localizacao preservada. Pedido registrado. Aguardando anjo disponível."
);

assert.equal(
  activeRemoteSyncStatusMessage({
    recipientCount: 1,
    remoteSessionId: undefined,
    status: "blocked_login"
  }),
  "SOS local ativo. Entre com Google para avisar seus anjos quando houver internet."
);

assert.equal(
  activeRemoteSyncStatusMessage({
    recipientCount: 1,
    remoteSessionId: undefined,
    status: "failed"
  }),
  "SOS local ativo. Tentando avisar seus anjos pela internet."
);

assert.deepEqual(
  resolveActiveRemoteSyncStatus({
    recipientCount: 1,
    remoteSessionId: "session-1",
    status: "sent_to_ec2"
  }),
  {
    beginLiveEvidence: true,
    message: "Você pediu ajuda. Localizacao preservada. Pedido enviado para 1 anjo.",
    remoteSessionId: "session-1"
  }
);

assert.deepEqual(
  resolveActiveRemoteSyncStatus({
    recipientCount: 1,
    remoteSessionId: "session-ignored",
    status: "failed"
  }),
  {
    beginLiveEvidence: false,
    message: "SOS local ativo. Tentando avisar seus anjos pela internet.",
    remoteSessionId: null
  }
);

console.log("remote-sync-status-policy ok");
