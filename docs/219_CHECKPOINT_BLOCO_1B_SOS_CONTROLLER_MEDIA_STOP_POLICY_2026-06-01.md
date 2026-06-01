# Checkpoint - Bloco 1B - SOS Controller media stop policy

Data: 2026-06-01

## Escopo

Segundo corte do Bloco 1 da refatoracao acelerada do SOS Controller. O objetivo foi trazer a fase pura de parada de midia do encerramento para o controlador, sem mover efeitos reais do recorder, camera, cofre, storage, WebRTC ou backend.

## Executado

- `src/features/emergency-home/sosControllerPolicy.ts` passou a compor a fase de parada de midia do finish.
- Adicionadas as funcoes:
  - `resolveSosControllerFinishMediaStopRequest()`
  - `resolveSosControllerFinishMediaStopSignaled()`
  - `resolveSosControllerFinishMediaStopResult()`
- `app/index.tsx` deixou de chamar diretamente as policies finas de parada de midia no encerramento e passou a chamar o controlador SOS.
- `scripts/sos-controller-policy.test.ts` passou a cobrir os cenarios de midia entregue a chamada ao vivo, necessidade de sinalizar recorder, ausencia de serial, serial valido e resultado com asset anexado.
- `scripts/smoke-test.mjs` foi atualizado para validar que a Home usa o controlador e que o controlador continua ancorado nas policies finas.

## Limites preservados

- `app/index.tsx` continua responsavel por executar `signalMediaRecorderStop()`, `waitForMediaRecorderStop()`, mutacoes de refs/estado React, progresso visual e logs operacionais.
- Nenhuma mudanca foi feita em camera real, WebRTC, storage, cofre local, backend, criptografia, permissoes nativas, API, portais ou release.
- A policy do controlador continua pura: nao executa API, storage, camera, timer, WebRTC, router, chamada telefonica ou mutacao real.

## Validacoes executadas

- `npm run test:sos-controller`
- `npm run test:finish-media-stop-request-actions`
- `npm run test:finish-media-stop-result`
- `node scripts/smoke-test.mjs`
- `npm run typecheck`
- `npm run lint`
- `git diff --check`

Todas aprovadas nesta etapa.

## Observacao de build

Build/instalacao Android nao sao obrigatorios neste corte porque os side effects fisicos de midia nao foram movidos. A proxima mudanca que alterar execucao real de camera, recorder, WebRTC, cofre ou storage deve exigir validacao fisica proporcional.
