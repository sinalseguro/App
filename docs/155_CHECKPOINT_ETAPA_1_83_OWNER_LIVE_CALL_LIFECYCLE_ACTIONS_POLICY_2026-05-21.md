# Checkpoint - Etapa 1.83 owner live call lifecycle actions policy

Data: 2026-05-21

## Status

Refatoracao pura implementada e validada.

## Escopo

Consolidar em policy pura as acoes derivadas do ciclo de vida da chamada owner: timestamp da evidencia, limpeza de sessao iniciada e motivo controlado para parar a evidencia de video.

## Alteracoes

- Criado `src/features/emergency-home/ownerLiveCallLifecycleActionsPolicy.ts`.
- Criada funcao `resolveOwnerLiveCallLifecycleActions()`.
- `app/index.tsx` passou a usar a nova policy depois de `resolveOwnerLiveCallLifecycle()`.
- O componente continua responsavel por:
  - atualizar `ownerAutoCallStartedSessionIdsRef`;
  - chamar `stopOwnerLiveVideoEvidence()`;
  - chamar `updateOwnerLiveEvidence()`;
  - manter refs, efeitos React e operacao real de gravacao/evidencia.
- Criado `scripts/owner-live-call-lifecycle-actions-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:owner-live-call-lifecycle-actions`: aprovado.
- `npm run test:owner-live-evidence`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida do Node 20.16.0.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, `Authorization`, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.
- `npm run typecheck`: sem erro emitido, mas travou sem CPU e foi encerrado para nao deixar processo pendurado.

## Seguranca e privacidade

- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- A policy nao para gravacao, nao grava midia e nao chama backend; apenas transforma a decisao de lifecycle em acoes declarativas.
- O motivo de parada fica restrito a `call_finished`, sem incluir path local, token, SDP/ICE ou conteudo de midia.

## Android fisico

Sem build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica continua reservada para mudancas operacionais em chamada, camera, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Fechar junto com a Etapa 1.84, pois ambas reduzem complexidade de lifecycle/cleanup owner sem alterar comportamento operacional.
