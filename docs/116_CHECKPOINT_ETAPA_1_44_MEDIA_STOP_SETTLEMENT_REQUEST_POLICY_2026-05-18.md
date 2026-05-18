# Checkpoint - Etapa 1.44 media stop settlement request policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao de log e resolucao da pending request quando a parada do recorder assenta, sem alterar timer real, promise, refs, preservacao de midia, cofre local, WebRTC, backend, storage ou layout.

## Alteracoes

- Criado `src/features/emergency-home/mediaStopSettlementRequestPolicy.ts`.
- Criado gate focado `scripts/media-stop-settlement-request-policy.test.ts`.
- `app/index.tsx` passou a usar:
  - `resolveMediaStopSettlementLog()`;
  - `resolvePendingMediaStopRequestSettlement()`.
- Os efeitos reais continuam em `app/index.tsx`: `appendMediaOperationalLog()`, `clearTimeout()`, limpeza de ref e `pendingRequest.resolve(result)`.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:media-stop-settlement-request`.

## Validacoes

- `npm run test:media-stop-settlement-request`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura de decisao/log. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Manter o ritmo de duas fatias por rodada. A proxima dupla recomendada deve continuar em regras puras pequenas de `app/index.tsx`, com build fisico apenas se tocar comportamento operacional.
