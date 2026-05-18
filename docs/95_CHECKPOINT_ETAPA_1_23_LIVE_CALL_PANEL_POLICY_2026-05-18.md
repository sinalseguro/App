# Checkpoint - Etapa 1.23 live call panel policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao de exibicao e entrada do painel de chamada ao vivo da Home/SOS, sem alterar runtime WebRTC, camera, gravacao, backend, API ou UX visual.

## Alteracoes

- Criado `src/features/emergency-home/liveCallPanelPolicy.ts`.
- Criado gate focado `scripts/live-call-panel-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveLiveCallPanelPolicy()` para decidir:
  - renderizacao do painel;
  - ocultacao da faixa de status;
  - afastamento do recorder para nao sobrepor o painel;
  - bloqueio do botao primario quando falta sessao remota, ha encerramento ou midia pendente.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:live-call-panel`.

## Validacoes

- `npm run test:live-call-panel`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou log runtime novo.

## Decisao

Nao houve build Android nesta fatia porque a mudanca e uma policy pura e nao altera renderizacao nativa, WebRTC, camera, gravacao, storage ou backend.
