# Checkpoint Etapa 1.4 - Politica pura WebRTC live-call

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Cristine, Eliane, Katia e Lucena
Status: etapa concluida localmente, sem alteracao de UX, backend, portal ou release publica.

## Objetivo

Continuar a refatoracao incremental da chamada ao vivo com uma fatia pequena, testavel e sem mudanca de comportamento: separar regras puras de WebRTC do servico que executa efeitos nativos.

## Implementacao

- Criado `src/features/live-call/liveWebRtcPolicy.ts`.
- Movidos para politica pura:
  - tipos de modo de audio/video;
  - constraints de video emergencial;
  - timeout de abertura de camera/microfone;
  - normalizacao de modo de audio e video;
  - decisao de captura local;
  - decisao de transceivers `recvonly`;
  - mapeamento de estado nativo ICE/conexao para estado interno;
  - selecao de stream remoto priorizando stream com video.
- `src/services/liveWebRtcSession.ts` continua responsavel por side effects nativos: `getUserMedia`, `RTCPeerConnection`, listeners, SDP/ICE e fechamento de tracks.
- Criado `scripts/live-webrtc-policy.test.ts`.
- `package.json` ganhou `npm run test:live-webrtc` e incluiu esse gate em `npm test`.
- `scripts/smoke-test.mjs` passou a reconhecer `liveWebRtcPolicy.ts` como fonte das regras puras WebRTC.

## Contratos Preservados

- Sem alteracao em telas, botoes, textos visuais, `app/index.tsx`, `app/alerta.tsx`, backend, portal ou release.
- Owner continua abrindo audio/video `sendrecv` com camera traseira para transmitir o SOS.
- Anjo continua entrando com audio/video `recvonly` para acompanhar a pessoa protegida.
- Stream remoto continua priorizando stream com video e caindo para stream com qualquer track quando necessario.
- Estados nativos `completed` e `checking` continuam normalizados para `connected` e `connecting`.
- EC2/API segue como plano de controle, sinalizacao e auditoria; audio/video bruto permanece fora do backend.

## Gate de Seguranca

- A refatoracao moveu apenas regras puras, sem novo storage, API, permissao, endpoint, payload persistido ou log runtime.
- Nenhum token, `Authorization`, `encrypted_key`, SDP, ICE candidate, payload P2P, URI de midia, caminho local sensivel ou dado pessoal foi adicionado a logs.
- O teste novo usa streams falsos em memoria e nao abre camera, microfone, WebRTC real, backend ou arquivo local.

## Validacoes

- `npm run test:live-webrtc`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.

## Limites

- Sem build Android nesta fatia, porque a alteracao e TypeScript puro e nao toca UI visual, backend, portal, release, codigo nativo ou assets.
- Sem validacao fisica Android nesta fatia, porque a camada operacional de WebRTC nao mudou de contrato.
- Nao foram tocados autoaceite, handoff de midia, encerramento SOS, gravacao local, backend de sinalizacao ou portal.

## Proxima Recomendacao

Antes de tocar nas telas, fazer no maximo mais uma revisao pequena de contratos de sinalizacao/auditoria ja testados. Apos isso, a proxima etapa relevante deve voltar para validacao fisica Android quando houver qualquer mudanca em camera, WebRTC runtime, autoaceite, handoff de midia ou encerramento do SOS.
