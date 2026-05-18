import { strict as assert } from "node:assert";
import type { MediaStream } from "react-native-webrtc";

import {
  idleLiveAudioCallState,
  isLiveAudioActive,
  liveAudioAngelAnswerSentState,
  liveAudioConnectedState,
  liveAudioConnectingState,
  liveAudioFailedState,
  liveAudioOwnerAnswerAcceptedState,
  liveAudioPollingFailureState,
  liveAudioReconnectingState,
  liveAudioRemoteStreamState,
  liveConnectedMessage,
  type LiveAudioCallState
} from "../src/features/live-call/liveCallStatePolicy";

const remoteStream = {} as MediaStream;

function state(input: Partial<LiveAudioCallState> = {}): LiveAudioCallState {
  return {
    ...idleLiveAudioCallState,
    ...input
  };
}

assert.equal(idleLiveAudioCallState.status, "idle");
assert.equal(isLiveAudioActive(state({ status: "waiting" })), true);
assert.equal(isLiveAudioActive(state({ status: "connecting" })), true);
assert.equal(isLiveAudioActive(state({ status: "connected" })), true);
assert.equal(isLiveAudioActive(state({ remoteStream, status: "failed" })), true);
assert.equal(isLiveAudioActive(state({ status: "failed" })), false);

assert.equal(liveConnectedMessage("owner", "Ana"), "Transmitindo seu SOS para o anjo.");
assert.equal(liveConnectedMessage("angel", "Ana"), "Você está acompanhando Ana.");
assert.equal(liveConnectedMessage("angel"), "Você está acompanhando como anjo.");

assert.deepEqual(
  liveAudioConnectedState(state({ participantName: "Ana", role: "angel", status: "connecting" })),
  state({
    message: "Você está acompanhando Ana.",
    participantName: "Ana",
    role: "angel",
    status: "connected"
  })
);

assert.equal(liveAudioConnectingState(state({ status: "idle" })).status, "connecting");
assert.equal(liveAudioConnectingState(state({ status: "connected" })).status, "connected");
assert.equal(liveAudioConnectingState(state({ status: "reconnecting" })).status, "reconnecting");

assert.equal(liveAudioReconnectingState(state({ status: "connected" })).status, "reconnecting");
assert.equal(liveAudioReconnectingState(state({ status: "ended" })).status, "ended");
assert.equal(liveAudioReconnectingState(state({ status: "idle" })).status, "idle");
assert.equal(liveAudioReconnectingState(state({ status: "failed" })).status, "failed");

assert.equal(liveAudioFailedState(state({ status: "connecting" })).status, "failed");
assert.equal(liveAudioFailedState(state({ status: "connecting" })).message, "Chamada não entrou. O pedido continua ativo.");

assert.deepEqual(
  liveAudioPollingFailureState(state({ message: "ok", status: "connected" })),
  state({ message: "ok", status: "connected" })
);
assert.equal(liveAudioPollingFailureState(state({ status: "waiting" })).status, "failed");
assert.equal(
  liveAudioPollingFailureState(state({ status: "waiting" })).message,
  "Nao foi possivel atualizar a videochamada agora."
);

const hiddenRemote = liveAudioRemoteStreamState(state({ role: "owner" }), {
  remoteStream,
  remoteStreamUrl: "stream://owner",
  renderRemoteStream: false,
  role: "owner"
});
assert.equal(hiddenRemote.remoteStream, undefined);
assert.equal(hiddenRemote.remoteStreamUrl, undefined);
assert.equal(hiddenRemote.status, "connected");
assert.equal(hiddenRemote.message, "Transmitindo seu SOS para o anjo.");

const visibleRemote = liveAudioRemoteStreamState(state({ participantName: "Ana", role: "angel" }), {
  remoteStream,
  remoteStreamUrl: "stream://angel",
  renderRemoteStream: true,
  role: "angel"
});
assert.equal(visibleRemote.remoteStream, remoteStream);
assert.equal(visibleRemote.remoteStreamUrl, "stream://angel");
assert.equal(visibleRemote.message, "Você está acompanhando Ana.");

assert.deepEqual(
  liveAudioOwnerAnswerAcceptedState(state({ participantName: "Ana", status: "waiting" })),
  state({
    message: "Ana entrou. Conectando chamada.",
    participantName: "Ana",
    status: "connecting"
  })
);
assert.equal(
  liveAudioOwnerAnswerAcceptedState(state({ remoteStream, status: "connected" })).message,
  "Anjo na chamada. Seu SOS continua ativo."
);

assert.deepEqual(
  liveAudioAngelAnswerSentState(state({ status: "waiting" }), {
    participantName: "Maria",
    remoteSessionId: "session-1"
  }),
  state({
    message: "Entrando como anjo de Maria.",
    participantName: "Maria",
    remoteSessionId: "session-1",
    role: "angel",
    status: "connecting"
  })
);
assert.equal(
  liveAudioAngelAnswerSentState(state({ remoteStreamUrl: "stream://angel", status: "connecting" }), {
    participantName: null,
    remoteSessionId: "session-2"
  }).status,
  "connected"
);

console.log("live-call-state-policy ok");
