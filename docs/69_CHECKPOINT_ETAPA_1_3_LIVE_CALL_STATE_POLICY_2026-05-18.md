# Checkpoint Etapa 1.3 - Politica pura de estado live-call

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Cristine, Eliane, Katia e Lucena
Status: etapa concluida localmente, sem alteracao de UX, backend, portal ou release publica.

## Objetivo

Continuar a refatoracao incremental no hotspot SOS/live-call com uma fatia pequena, testavel e sem mudanca de comportamento: separar regras previsiveis de estado/ciclo da chamada ao vivo para reduzir o peso de `useLiveAudioCall.ts`.

## Implementacao

- Criado `src/features/live-call/liveCallStatePolicy.ts`.
- Movidos para politica pura:
  - estado inicial da chamada ao vivo;
  - deteccao de chamada ativa;
  - mensagem de conexao por papel;
  - transicoes para conectado, conectando, reconectando, falha e falha de polling;
  - transicao apos aceite do answer pelo solicitante;
  - transicao apos envio do answer pelo anjo;
  - aplicacao do stream remoto conforme decisao ja existente de renderizacao.
- `useLiveAudioCall.ts` continua responsavel por side effects: WebRTC, polling, timers, API, auditoria e fechamento de peer.
- `LiveAudioCallPanel.tsx` passou a importar o tipo `LiveAudioCallState` do modulo de politica.
- Criado `scripts/live-call-state-policy.test.ts`.
- `package.json` ganhou `npm run test:live-call-state` e incluiu esse gate em `npm test`.
- `scripts/smoke-test.mjs` passou a reconhecer `liveCallStatePolicy.ts` como fonte do contrato de estado da live-call.

## Contratos Preservados

- Sem alteracao em layout, botoes, textos visuais, `app/index.tsx`, `app/alerta.tsx`, backend, portal ou release.
- Owner continua transmitindo audio/video para o anjo.
- Anjo continua sendo o papel que visualiza o stream remoto da pessoa protegida.
- O hook continua exigindo dispositivo API registrado antes de sinalizar.
- A ordem do owner continua aplicando `answer` antes de processar ICE do anjo.
- EC2/API segue como plano de controle, sinalizacao e auditoria; audio/video bruto permanece fora do backend.

## Gate de Seguranca

- A refatoracao moveu apenas regras puras, sem novo `console`, log, endpoint, storage, permissao, payload ou persistencia.
- Nenhum token, `Authorization`, `encrypted_key`, SDP, ICE candidate, payload P2P, URI de midia, caminho local sensivel ou dado pessoal foi adicionado a logs.
- O teste novo usa stream falso em memoria e nao abre camera, microfone, WebRTC real, backend ou arquivo local.

## Validacoes

- `npm run test:live-call-state`: aprovado.
- `npm run test:live-call-session`: aprovado.
- `npm run typecheck`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.

## Limites

- Sem build Android nesta fatia, porque a alteracao e TypeScript puro e nao toca UI visual, nativo, assets, backend ou publicacao.
- Sem validacao fisica Android nesta fatia, porque o fluxo operacional e visual nao mudou.
- Nao foram tocados `prepareMediaForOwnerLiveCall`, autoaceite em `app/alerta.tsx`, encerramento do SOS em `app/index.tsx`, WebRTC nativo nem sinalizacao backend.

## Proxima Recomendacao

Prosseguir com uma terceira fatia pequena na live-call somente se ela continuar pura/testavel. Se a proxima etapa tocar `app/index.tsx`, `app/alerta.tsx`, camera, autoaceite, handoff de midia ou encerramento do SOS, voltar a exigir validacao fisica Android via ADB antes de publicar release.
