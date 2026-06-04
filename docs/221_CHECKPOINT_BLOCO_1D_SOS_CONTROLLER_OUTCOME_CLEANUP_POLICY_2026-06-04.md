# Checkpoint - Bloco 1D - SOS Controller outcome e cleanup policy

Data: 2026-06-04

## Escopo

Quarto corte do Bloco 1 da refatoracao acelerada do SOS Controller. O objetivo foi trazer para o controlador a composicao pura das decisoes finais do encerramento: pacote ausente, outcome final, falha controlada e cleanup do fluxo.

## Executado

- `src/features/emergency-home/sosControllerPolicy.ts` passou a compor tambem:
  - `resolveSosControllerFinishMissingPackage()`
  - `resolveSosControllerFinishPackageOutcome()`
  - `resolveSosControllerFinishFailure()`
  - `resolveSosControllerFinishCleanup()`
- `app/index.tsx` deixou de chamar diretamente as policies finas de pacote ausente, outcome, falha e cleanup no encerramento ativo.
- `Home` continua responsavel por executar efeitos reais: `finishEmergencyPackage()`, `refreshOutboxCount()`, logs operacionais, atualizacao de evidencia owner, marcador de auditoria, persistencia de diagnostico sem midia, refs e estado React.
- `scripts/sos-controller-policy.test.ts` passou a cobrir pacote ausente, outcome protegido, marcador owner, ausencia de diagnostico sem midia, falha controlada e cleanup final.
- `scripts/smoke-test.mjs` passou a exigir a Home usando o controlador e o controlador usando as policies finas de outcome/cleanup.

## Limites preservados

- Nenhuma chamada real de API, storage, camera, recorder, WebRTC, cofre, backend, router, timer, fila ou auditoria foi movida para o controlador.
- Nenhuma mudanca foi feita em backend, contratos de API, Nginx, publicacao, cofre, criptografia, camera, WebRTC ou release.
- A policy do controlador continua pura e apenas compoe decisoes ja testaveis.

## Validacoes executadas

- `npm run test:sos-controller`
- `npm run test:finish-package-outcome-actions`
- `npm run test:finish-missing-package-branch-actions`
- `npm run test:finish-failure-cleanup-actions`
- `npm run test:finish-post-outcome`
- `node scripts/smoke-test.mjs`
- `npm run typecheck`
- `npm run lint`
- `git diff --check`

Todas aprovadas nesta etapa.

## Observacao de build

Build/instalacao Android nao sao obrigatorios neste corte porque a subfatia nao moveu runtime fisico nem side effects reais. A proxima mudanca que alterar execucao real de API, camera, recorder, WebRTC, cofre, storage, backend ou publicacao deve exigir gate proporcional.
