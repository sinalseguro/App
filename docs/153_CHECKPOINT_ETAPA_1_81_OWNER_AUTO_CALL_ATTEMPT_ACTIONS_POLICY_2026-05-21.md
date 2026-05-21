# Checkpoint - Etapa 1.81 owner auto call attempt actions policy

Data: 2026-05-21

## Status

Refatoracao pura implementada e validada.

## Escopo

Consolidar em policy pura as acoes da tentativa de autochamada owner apos aceite de anjo, mantendo timers, refs e chamada real no componente.

## Alteracoes

- Criado `src/features/emergency-home/ownerAutoCallAttemptActionsPolicy.ts`.
- Criada funcao `resolveOwnerAutoCallAttemptActions()`.
- `app/index.tsx` passou a usar a policy no efeito de autochamada owner.
- O componente continua responsavel por:
  - ler `liveAudioCallStateRef`;
  - consultar `ownerAutoCallStartedSessionIdsRef`;
  - atualizar `ownerAutoCallInFlightRef`;
  - aplicar `setRecordingStatus()`;
  - registrar `appendMediaOperationalLog()`;
  - chamar `listAcceptedLiveRecipients()`.
- Criado `scripts/owner-auto-call-attempt-actions-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:owner-auto-call-attempt-actions`: aprovado.
- `npm run test:owner-auto-call-result-actions`: aprovado.
- `npm run test:owner-auto-call`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida do Node 20.16.0.
- `git diff --check` dirigido aos arquivos alterados: aprovado.
- Lint dirigido aos arquivos alterados: aprovado.
- Varredura dirigida do diff: sem token, `Authorization`, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.
- `npm run lint`: travou sem CPU em duas tentativas e foi encerrado para nao deixar processo pendurado.
- `npm run typecheck`: sem erro emitido, mas travou sem CPU e foi encerrado para nao deixar processo pendurado.

## Seguranca e privacidade

- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- A policy nao chama API, nao inicia WebRTC e nao altera estado React; apenas declara status, log saneado e decisao de marcar tentativa em andamento.
- O log da tentativa contem apenas plataforma e `remoteSessionId`, sem SDP/ICE, token, chave, path local ou conteudo de midia.

## Android fisico

Sem build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica continua reservada para mudancas operacionais em chamada, camera, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Fechar junto com a Etapa 1.82, pois ambas reduzem a complexidade da autochamada owner sem alterar comportamento operacional.
