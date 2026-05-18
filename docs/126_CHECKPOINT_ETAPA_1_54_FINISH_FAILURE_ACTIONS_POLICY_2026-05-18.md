# Checkpoint - Etapa 1.54 finish failure actions policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao de falha controlada no encerramento do SOS, sem alterar log real, backend, recorder, WebRTC, cofre, storage, layout ou textos de usuario.

## Alteracoes

- Criado `src/features/emergency-home/finishFailureActionsPolicy.ts`.
- Criado gate focado `scripts/finish-failure-actions-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveFinishFailureActions()` no `catch` do encerramento.
- A policy centraliza:
  - evento de log `emergency_finish_package_error`;
  - payload saneado com `platform`;
  - status local `finish_failed`;
  - progresso final de erro.
- Os efeitos reais continuam em `app/index.tsx`: `appendMediaOperationalLog()`, `setRecordingStatus()` e `showFinishProgress()`.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:finish-failure-actions`.

## Validacoes

- `npm run test:finish-failure-actions`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

ADB confirmou o Android `23129RA5FL` via Wi-Fi, mas nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Executar a bateria completa e, se aprovada, seguir depois com mais duas fatias pequenas no encerramento remoto/final, mantendo sem build Android enquanto for refatoracao pura.
