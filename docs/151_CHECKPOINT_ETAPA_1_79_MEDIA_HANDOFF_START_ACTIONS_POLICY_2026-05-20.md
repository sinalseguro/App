# Checkpoint - Etapa 1.79 media handoff start actions policy

Data: 2026-05-20

## Status

Refatoracao pura implementada e validada.

## Escopo

Consolidar em policy pura as acoes de inicio da preparacao de midia para chamada owner, logo apos a decisao de handoff permitir a preparacao.

## Alteracoes

- Criado `src/features/emergency-home/mediaHandoffStartActionsPolicy.ts`.
- Criada funcao `resolveMediaHandoffStartActions()`.
- `app/index.tsx` passou a usar a policy em `prepareMediaForOwnerLiveCall()`.
- O componente continua responsavel por:
  - marcar `mediaStopPurposeRef.current`;
  - aplicar `setRecordingStatus()`;
  - chamar `updateOwnerLiveEvidence()`;
  - chamar `recordOwnerLiveAuditMarker()`;
  - chamar `appendMediaOperationalLog()`;
  - sinalizar a parada real do recorder.
- Criado `scripts/media-handoff-start-actions-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:media-handoff-start-actions`: aprovado.
- `npm run test:media-handoff-release-actions`: aprovado.
- `npm run test:media-handoff`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida do Node 20.16.0.
- `npm run typecheck`: sem erro emitido, mas travou sem CPU e foi encerrado para nao deixar processo pendurado.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, `Authorization`, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Seguranca e privacidade

- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- A policy nao para recorder, nao toca camera, nao chama backend e nao altera estado React; apenas declara acoes derivadas para o componente aplicar.
- O log de inicio do handoff segue saneado com pacote e plataforma, sem path local, midia, SDP/ICE, chave ou token.

## Android fisico

Sem build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Fechar junto com a Etapa 1.80, pois ambas reduzem o bloco de preparacao de midia owner sem mexer no motor de gravacao ou no fluxo P2P.
