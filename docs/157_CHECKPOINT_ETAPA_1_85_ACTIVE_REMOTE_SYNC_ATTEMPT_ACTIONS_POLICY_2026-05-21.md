# Checkpoint - Etapa 1.85 active remote sync attempt actions policy

Data: 2026-05-21

## Status

Refatoracao pura implementada e validada.

## Escopo

Consolidar em policy pura a decisao de tentar sincronizar o SOS local ativo com a API, incluindo bloqueios por cancelamento, tentativa em andamento, sessao remota ja conhecida e pacote ausente.

## Alteracoes

- Criado `src/features/emergency-home/activeRemoteSyncAttemptActionsPolicy.ts`.
- Criada funcao `resolveActiveRemoteSyncAttemptActions()`.
- `app/index.tsx` passou a usar a policy no loop de retry/resume da sincronizacao remota ativa.
- O componente continua responsavel por:
  - controlar timer de retry;
  - atualizar `activeRemoteSyncInFlightRef`;
  - chamar `getActiveEmergencyPackage()`;
  - chamar `syncEmergencyPackageWithApi()`;
  - registrar log operacional real.
- Criado `scripts/active-remote-sync-attempt-actions-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:active-remote-sync-attempt-actions`: aprovado.
- `npm run test:remote-sync-status`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida do Node 20.16.0.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, `Authorization`, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.
- `npm run typecheck`: sem erro emitido, mas travou sem CPU e foi encerrado para nao deixar processo pendurado.

## Seguranca e privacidade

- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- A policy nao chama API, nao acessa midia e nao altera refs; apenas declara se a tentativa pode iniciar e qual log saneado deve ser registrado.
- O log contem apenas `packageId`, plataforma e origem `resume`/`retry`; nao inclui token, chave, SDP/ICE, path local ou conteudo de midia.

## Android fisico

Sem build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica continua reservada para mudancas operacionais em chamada, camera, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Fechar junto com a Etapa 1.86, pois ambas reduzem a complexidade do retry de sincronizacao remota ativa sem alterar comportamento operacional.
