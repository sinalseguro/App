# Checkpoint - Etapa 1.77 owner live video preserve request policy

Data: 2026-05-20

## Status

Refatoracao pura implementada e validada.

## Escopo

Consolidar em policy pura a decisao de parada/preservacao da evidencia de video owner: reutilizar promise de preservacao, aguardar inicio pendente, ignorar por ausencia de gravacao, ignorar por preservacao em andamento ou iniciar preservacao.

## Alteracoes

- Criado `src/features/emergency-home/ownerLiveVideoPreserveRequestPolicy.ts`.
- Criada funcao `resolveOwnerLiveVideoPreserveRequest()`.
- `app/index.tsx` passou a usar a policy em `stopOwnerLiveVideoEvidence()`.
- O componente continua responsavel por:
  - retornar a promise real de preservacao quando existente;
  - aguardar a promise real de inicio pendente;
  - limpar `ownerLiveVideoRecordingRef.current`;
  - controlar `ownerLiveVideoPreserveInFlightRef`;
  - criar e armazenar a promise real de preservacao.
- Criado `scripts/owner-live-video-preserve-request-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:owner-live-video-preserve-request`: aprovado.
- `npm run test:owner-live-video-preserve-outcome`: aprovado.
- `npm run test:owner-live-video-start-request`: aprovado.
- `npm run test:owner-live-video-start-outcome`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida do Node 20.16.0.
- `npm run typecheck`: sem erro emitido, mas travou sem CPU e foi encerrado para nao deixar processo pendurado.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, `Authorization`, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Seguranca e privacidade

- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- A policy nao para gravacao, nao preserva arquivo e nao toca storage local; apenas decide se o componente deve prosseguir.
- A ordem preserva o comportamento existente: promise de preservacao existente tem prioridade; sem gravacao ativa, o inicio pendente e aguardado antes de decidir se preserva.

## Android fisico

Sem build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Fechar junto com a Etapa 1.78, pois ambas isolam o bloco de preservacao do video owner sem alterar o motor nativo ou o cofre local.
