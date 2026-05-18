# Checkpoint - Etapa 1.47 finish remote sync policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao de selecao do estado remoto final do encerramento do SOS e o log de falha da finalizacao remota, sem alterar chamadas reais a API, fila local, WebRTC, recorder, cofre, storage, auditoria ou layout.

## Alteracoes

- Criado `src/features/emergency-home/finishRemoteSyncPolicy.ts`.
- Criado gate focado `scripts/finish-remote-sync-policy.test.ts`.
- `app/index.tsx` passou a usar:
  - `shouldRetryRemoteFinishAfterDirect()`;
  - `resolveRemoteFinishStateAfterDirect()`;
  - `resolveRemoteFinishStateFromSync()`;
  - `resolveRemoteFinishFailureLog()`.
- Os efeitos reais continuam em `app/index.tsx`: `finishRemoteEmergencySessionForPackage()`, `syncPendingEmergencyPackagesWithApi()` e `appendMediaOperationalLog()`.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:finish-remote-sync`.

## Validacoes

- `npm run test:finish-remote-sync`: aprovado.
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

Fechar a segunda fatia da rodada extraindo o resumo do pacote finalizado, mantendo o outcome e os efeitos reais em `app/index.tsx`.
