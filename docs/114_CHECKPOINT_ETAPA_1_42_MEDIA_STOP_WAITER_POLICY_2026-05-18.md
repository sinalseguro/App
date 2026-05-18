# Checkpoint - Etapa 1.42 media stop waiter policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao do waiter de parada do recorder, sem alterar timers reais, promises, refs, parada de camera, preservacao de midia, cofre local, WebRTC, backend, storage ou layout.

## Alteracoes

- Criado `src/features/emergency-home/mediaStopWaiterPolicy.ts`.
- Criado gate focado `scripts/media-stop-waiter-policy.test.ts`.
- `app/index.tsx` passou a usar:
  - `resolveMediaStopWaiterStart()`;
  - `resolveMediaStopTimeout()`.
- Os efeitos reais continuam em `app/index.tsx`: `setTimeout`, limpeza de pending request, resolve de promise e `appendMediaOperationalLog()`.
- O smoke foi ajustado para exigir o evento de timeout na policy e manter a ordem `await waitForMediaRecorderStop(stopSerial)` antes de `finishEmergencyPackage(packageId)`.
- `package.json` recebeu `npm run test:media-stop-waiter`.

## Validacoes

- `npm run test:media-stop-waiter`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura de decisao do waiter. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Manter o ritmo de duas fatias por rodada. A proxima dupla recomendada deve continuar reduzindo regras pequenas de `app/index.tsx`; qualquer mudanca que toque camera/recorder/WebRTC/backend deve voltar a exigir build e validacao fisica.
