# Checkpoint - Etapa 1.57 finish remote sync start policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao inicial da sincronizacao remota do encerramento do SOS, sem alterar API, fila local, backend, WebRTC, recorder, cofre, layout ou textos de usuario.

## Alteracoes

- Atualizado `src/features/emergency-home/finishRemoteSyncPolicy.ts`.
- Criada funcao `resolveFinishRemoteSyncStartActions()`.
- `app/index.tsx` passou a usar a decision antes de `queueEmergencyPackageForRemoteSync()` e `showFinishProgress()`.
- A policy centraliza:
  - obrigatoriedade de enfileirar pacote para sync remoto;
  - progresso `Sincronizando chamado`.
- Os efeitos reais continuam em `app/index.tsx`: fila local, apresentacao e chamadas seguintes de API.
- `scripts/finish-remote-sync-policy.test.ts` passou a cobrir a nova decision.
- `scripts/smoke-test.mjs` passou a exigir a decision.

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

Concluir a dupla com a decision do modo remoto direto versus sincronizacao pendente.
