# Checkpoint - Etapa 1.41 media release waiter policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao do waiter de liberacao da midia para chamada ao vivo, sem alterar timers reais, promises, refs, logs operacionais, camera, gravacao, WebRTC, backend, storage ou layout.

## Alteracoes

- Criado `src/features/emergency-home/mediaReleaseWaiterPolicy.ts`.
- Criado gate focado `scripts/media-release-waiter-policy.test.ts`.
- `app/index.tsx` passou a usar:
  - `resolveMediaReleaseWaiterStart()`;
  - `resolveMediaReleaseTimeout()`.
- Os efeitos reais continuam em `app/index.tsx`: `setTimeout`, limpeza de pending request, resolve de promise e `appendMediaOperationalLog()`.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:media-release-waiter`.

## Validacoes

- `npm run test:media-release-waiter`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

ADB confirmou os Androids conectados no inicio da rodada, mas nao houve build, instalacao ou perfil Android porque a mudanca e uma policy pura. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Continuar com a segunda fatia da rodada: extrair a decisao do waiter de parada do recorder, mantendo timers, refs, promise e logs reais na Home/SOS.
