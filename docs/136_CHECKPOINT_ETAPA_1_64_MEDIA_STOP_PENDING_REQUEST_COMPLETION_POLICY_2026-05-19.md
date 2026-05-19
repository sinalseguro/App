# Checkpoint - Etapa 1.64 media stop pending request completion policy

Data: 2026-05-19

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao de finalizacao do pedido pendente de parada de midia, preservando o comportamento de limpar timeout, limpar referencia pendente e resolver a promise somente quando o serial confere.

## Alteracoes

- Criado `src/features/emergency-home/mediaStopPendingRequestCompletionPolicy.ts`.
- Criada funcao `resolveMediaStopPendingRequestCompletion()`.
- `app/index.tsx` passou a aplicar flags explicitas para:
  - limpar timeout do pedido pendente;
  - limpar `pendingMediaStopRequestRef`;
  - resolver a promise de parada de midia.
- Criado `scripts/media-stop-pending-request-completion-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:media-stop-pending-request-completion`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

ADB confirmou o Android `23129RA5FL` via Wi-Fi nesta rodada, mas nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Iniciar o segundo grupo sequencial com duas fatias pequenas no fluxo de inicio do SOS.
