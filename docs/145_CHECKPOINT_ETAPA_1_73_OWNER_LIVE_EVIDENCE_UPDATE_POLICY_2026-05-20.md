# Checkpoint - Etapa 1.73 owner live evidence update policy

Data: 2026-05-20

## Status

Refatoracao pura implementada e validada.

## Escopo

Consolidar em policy pura a decisao de atualizar evidencia local do solicitante durante chamada ao vivo, mantendo o armazenamento seguro real no componente.

## Alteracoes

- Criado `src/features/emergency-home/ownerLiveEvidenceUpdatePolicy.ts`.
- Criada funcao `resolveOwnerLiveEvidenceUpdate()`.
- `app/index.tsx` passou a usar a policy em `updateOwnerLiveEvidence()`.
- O componente continua responsavel por chamar `updateOwnerLiveCallEvidenceRecord()` e tratar a promise.
- Criado `scripts/owner-live-evidence-update-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:owner-live-evidence-update`: aprovado.
- `npm run test:owner-live-evidence`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida do Node 20.16.0.
- `npm run typecheck`: sem erro emitido, mas travou sem CPU e foi encerrado para nao deixar processo pendurado.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, `Authorization`, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Seguranca e privacidade

- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- A policy nao grava evidencia, nao acessa SecureStore e nao chama backend; apenas bloqueia update sem `remoteSessionId`.

## Android fisico

Sem build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Fechar junto com a Etapa 1.74, pois ambas reforcam guardas de evidencia/auditoria owner antes de mexer em blocos mais sensiveis de video.
