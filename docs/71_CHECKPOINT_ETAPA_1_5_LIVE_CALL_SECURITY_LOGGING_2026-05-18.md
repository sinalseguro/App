# Checkpoint Etapa 1.5 - Gate de logs sensiveis live-call

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Cristine, Eliane, Katia e Lucena
Status: etapa concluida localmente, sem alteracao de UX, backend, portal ou release publica.

## Objetivo

Reforcar o gate Codex Security da live-call sem mudar comportamento: impedir regressao futura que registre SDP, ICE, tokens, payloads P2P, URI/path local ou outros dados sensiveis em logs runtime.

## Implementacao

- Criado `scripts/live-call-sensitive-logging.test.ts`.
- Adicionado comando `npm run test:live-call-security`.
- `npm test` passou a executar o novo gate.
- `scripts/smoke-test.mjs` passou a exigir a presenca desse teste.

## Contrato de Seguranca

- `src/features/live-call/useLiveAudioCall.ts` nao deve ter `console` runtime.
- `src/services/liveCallControl.ts` nao deve ter `console` runtime.
- `src/services/liveWebRtcSession.ts` pode registrar somente telemetria saneada `SinalSeguroLiveCall`, hoje limitada a contagem de tracks e estado normalizado de conexao.
- Linhas de console runtime nao podem conter:
  - `Authorization`;
  - access/refresh/id token;
  - `encrypted_key`;
  - SDP;
  - ICE candidate;
  - payload P2P;
  - URI ou `file://`;
  - `DocumentDirectory`;
  - `cacheDirectory`.

## Contratos Preservados

- Sem alteracao em telas, botoes, textos visuais, `app/index.tsx`, `app/alerta.tsx`, backend, portal ou release.
- Sem alteracao em camera, microfone, WebRTC, SDP/ICE, sinalizacao, auditoria ou timers.
- EC2/API segue como plano de controle, sinalizacao e auditoria; audio/video bruto permanece fora do backend.

## Validacoes

- `npm run test:live-call-security`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.

## Limites

- Sem build Android nesta fatia, porque a alteracao e teste/contrato de seguranca TypeScript e nao toca UI visual, backend, portal, release, codigo nativo ou assets.
- Sem validacao fisica Android nesta fatia, porque nao houve mudanca de runtime operacional.

## Proxima Recomendacao

Depois desse gate, evitar novas refatoracoes puras na live-call sem uma necessidade clara. A proxima mudanca relevante em camera, WebRTC runtime, autoaceite, handoff de midia ou encerramento do SOS deve voltar para validacao fisica Android em dois dispositivos.
