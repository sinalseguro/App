# Checkpoint - Etapa 1.58 finish remote sync mode policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao de modo da sincronizacao remota final do SOS, separando caminho direto com sessao remota e caminho de sincronizacao pendente, sem alterar chamadas reais de API, retry, backend, WebRTC, cofre ou layout.

## Alteracoes

- Atualizado `src/features/emergency-home/finishRemoteSyncPolicy.ts`.
- Criada funcao `resolveFinishRemoteSyncMode()`.
- `app/index.tsx` passou a usar `mode: "direct_finish"` para finalizar sessao remota especifica e `mode: "pending_sync"` para sincronizar fila pendente.
- A policy centraliza:
  - selecao do caminho direto quando ha `remoteSessionIdToFinish`;
  - fallback para fila pendente quando nao ha sessao remota valida.
- Os efeitos reais continuam em `app/index.tsx`: `finishRemoteEmergencySessionForPackage()`, `syncPendingEmergencyPackagesWithApi()`, retry e resolucao final do estado remoto.
- `scripts/finish-remote-sync-policy.test.ts` passou a cobrir sessao valida, `null` e string vazia.
- `scripts/smoke-test.mjs` passou a exigir os modos `direct_finish` e `pending_sync`.

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

ADB confirmou o Android `23129RA5FL` via Wi-Fi nesta rodada, mas nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Executar bateria completa, readiness privada, `git diff --check`, varredura dirigida e commit. Depois, seguir com mais duas fatias pequenas no bloco de resultado remoto/outcome, se ainda houver regra inline suficiente.
