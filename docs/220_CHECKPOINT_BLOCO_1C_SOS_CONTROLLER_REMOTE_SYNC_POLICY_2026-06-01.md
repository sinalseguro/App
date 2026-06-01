# Checkpoint - Bloco 1C - SOS Controller remote sync policy

Data: 2026-06-01

## Escopo

Terceiro corte do Bloco 1 da refatoracao acelerada do SOS Controller. O objetivo foi trazer a composicao pura da sincronizacao remota do encerramento para o controlador, sem mover chamadas reais de API, fila local, backend, cofre, WebRTC ou storage.

## Executado

- `src/features/emergency-home/sosControllerPolicy.ts` passou a compor a fase de sincronizacao remota do finish.
- Adicionadas as funcoes:
  - `resolveSosControllerFinishRemoteSyncRequest()`
  - `resolveSosControllerFinishRemoteSyncDirectRetry()`
  - `resolveSosControllerFinishRemoteSyncDirectResult()`
  - `resolveSosControllerFinishRemoteSyncPendingResult()`
  - `resolveSosControllerFinishRemoteSyncCompletion()`
- `app/index.tsx` deixou de chamar diretamente as policies finas de sincronizacao remota no encerramento e passou a chamar o controlador SOS.
- `scripts/sos-controller-policy.test.ts` passou a cobrir modo direto, modo pendente, retry apos finish remoto falho, resultado de retry, resultado de sync pendente e log de falha remota.
- `scripts/smoke-test.mjs` foi atualizado para validar que a Home usa o controlador e que o controlador continua ancorado nas policies finas de sync remoto.

## Limites preservados

- `app/index.tsx` continua responsavel por executar `queueEmergencyPackageForRemoteSync()`, `finishRemoteEmergencySessionForPackage()`, `syncPendingEmergencyPackagesWithApi()`, logs operacionais, cofre, storage, WebRTC, estado React e progresso visual.
- Nenhuma mudanca foi feita em backend, contratos de API, Nginx, publicacao, cofre, storage, criptografia, camera, WebRTC ou release.
- A policy do controlador continua pura: nao executa API, storage, camera, WebRTC, timer, router, chamada telefonica, fila real ou mutacao real.

## Validacoes executadas

- `npm run test:sos-controller`
- `npm run test:finish-remote-sync-request-actions`
- `npm run test:finish-remote-sync-direct-actions`
- `npm run test:finish-remote-sync-completion-actions`
- `node scripts/smoke-test.mjs`
- `npm run typecheck`
- `npm run lint`
- `git diff --check`

Todas aprovadas nesta etapa.

## Observacao de build

Build/instalacao Android nao sao obrigatorios neste corte porque as chamadas reais de API/backend e os side effects fisicos nao foram movidos. A proxima mudanca que alterar execucao real de API, camera, recorder, WebRTC, cofre, storage ou backend deve exigir gate proporcional.
