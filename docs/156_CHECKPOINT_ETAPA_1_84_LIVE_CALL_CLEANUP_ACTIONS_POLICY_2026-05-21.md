# Checkpoint - Etapa 1.84 live call cleanup actions policy

Data: 2026-05-21

## Status

Refatoracao pura implementada e validada.

## Escopo

Consolidar em policy pura as acoes de limpeza da chamada ao vivo sem chamado ativo, mantendo limpeza de refs, estado React e parada/reset real da chamada no componente.

## Alteracoes

- Criado `src/features/emergency-home/liveCallCleanupActionsPolicy.ts`.
- Criada funcao `resolveLiveCallCleanupActions()`.
- `app/index.tsx` passou a usar a nova policy depois de `resolveLiveCallCleanupDecision()`.
- O componente continua responsavel por:
  - limpar `ownerAutoCallPausedSessionIdsRef`;
  - limpar `ownerAutoCallStartedSessionIdsRef`;
  - aplicar `setLiveRemoteSessionId(null)`;
  - chamar `liveAudioCall.resetLiveAudioCall()` ou `liveAudioCall.stopLiveAudioCall()`.
- Criado `scripts/live-call-cleanup-actions-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:live-call-cleanup-actions`: aprovado.
- `npm run test:live-call-cleanup`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida do Node 20.16.0.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, `Authorization`, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.
- `npm run typecheck`: sem erro emitido, mas travou sem CPU e foi encerrado para nao deixar processo pendurado.

## Seguranca e privacidade

- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- A policy nao para WebRTC diretamente e nao altera refs; apenas declara se a chamada deve ser resetada ou encerrada.
- A limpeza permanece local ao componente e nao introduz coleta, sincronizacao, midia ou payload novo.

## Android fisico

Sem build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica continua reservada para mudancas operacionais em chamada, camera, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Na proxima rodada, manter duas fatias pequenas no mesmo padrao: extrair apenas policies puras onde ainda houver transformacao inline, ou abrir validacao fisica se a proxima demanda mudar comportamento real da chamada.
