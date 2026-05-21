# Checkpoint - Etapa 1.75 owner live video start request policy

Data: 2026-05-20

## Status

Refatoracao pura implementada e validada.

## Escopo

Consolidar em policy pura a decisao inicial de reutilizar gravacao owner ativa, reutilizar inicio pendente, substituir gravacao ativa ou iniciar uma nova gravacao de video ao vivo.

## Alteracoes

- Criado `src/features/emergency-home/ownerLiveVideoStartRequestPolicy.ts`.
- Criada funcao `resolveOwnerLiveVideoStartRequest()`.
- `app/index.tsx` passou a usar a policy em `startOwnerLiveVideoEvidence()`.
- O componente continua responsavel por:
  - retornar a gravacao ativa quando aplicavel;
  - retornar a promise de inicio pendente quando aplicavel;
  - chamar `stopOwnerLiveVideoEvidence("replace_recording")` quando precisa substituir a gravacao;
  - iniciar a nova gravacao real.
- Criado `scripts/owner-live-video-start-request-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:owner-live-video-start-request`: aprovado.
- `npm run test:owner-live-evidence`: aprovado.
- `npm run test:owner-live-evidence-update`: aprovado.
- `npm run test:owner-live-audit-marker-actions`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida do Node 20.16.0.
- `npm run typecheck`: sem erro emitido, mas travou sem CPU e foi encerrado para nao deixar processo pendurado.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, `Authorization`, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Seguranca e privacidade

- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- A policy nao toca camera, recorder, WebRTC, storage local, auditoria ou backend; apenas retorna a decisao operacional para o componente executar.
- A decisao preserva o bloqueio de duplicidade por `remoteSessionId` e `packageId`.

## Android fisico

Sem build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Fechar junto com a Etapa 1.76, pois ambas isolam decisoes do inicio de evidencia owner antes de qualquer mudanca operacional em video ao vivo.
