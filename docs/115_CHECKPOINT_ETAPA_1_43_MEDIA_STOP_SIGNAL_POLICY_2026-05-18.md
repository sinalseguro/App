# Checkpoint - Etapa 1.43 media stop signal policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao de sinalizacao de parada do recorder, sem alterar refs, estado React, log real, camera, gravacao, cofre local, WebRTC, backend, storage ou layout.

## Alteracoes

- Criado `src/features/emergency-home/mediaStopSignalPolicy.ts`.
- Criado gate focado `scripts/media-stop-signal-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveMediaStopSignal()` em `signalMediaRecorderStop()`.
- Os efeitos reais continuam em `app/index.tsx`: incremento da ref, `appendMediaOperationalLog()`, `setStopRecordingRequestSerial()` e retorno do serial.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:media-stop-signal`.

## Validacoes

- `npm run test:media-stop-signal`: aprovado.
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

Continuar com a segunda fatia da rodada: extrair a decisao de settlement da pending request do stop, mantendo `clearTimeout`, ref e `resolve()` reais na Home/SOS.
