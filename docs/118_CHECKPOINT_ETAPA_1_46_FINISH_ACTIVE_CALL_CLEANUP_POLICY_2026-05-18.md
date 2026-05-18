# Checkpoint - Etapa 1.46 finish active call cleanup policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao de limpeza final do encerramento do SOS ativo, sem alterar refs, estado React, fluxo de midia, cofre local, WebRTC, backend, storage ou layout.

## Alteracoes

- Criado `src/features/emergency-home/finishActiveCallCleanupPolicy.ts`.
- Criado gate focado `scripts/finish-active-call-cleanup-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveFinishActiveCallCleanup()` no `finally` de `handleFinishActiveCall()`.
- A policy centraliza:
  - quando limpar `mediaStopPurposeRef` para a finalidade `finish`;
  - liberacao do bloqueio de captura;
  - limpeza do estado de midia pendente;
  - liberacao do encerramento em progresso.
- Os efeitos reais continuam em `app/index.tsx`: mutacao de ref e chamadas `setCaptureStopLocked()`, `setMediaStopPendingState()` e `setFinishInProgress()`.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:finish-active-call-cleanup`.

## Validacoes

- `npm run test:finish-active-call-cleanup`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura de encerramento. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Manter duas fatias por rodada. A proxima dupla recomendada deve continuar removendo regras puras pequenas de `app/index.tsx`, com build fisico apenas se houver mudanca operacional.
