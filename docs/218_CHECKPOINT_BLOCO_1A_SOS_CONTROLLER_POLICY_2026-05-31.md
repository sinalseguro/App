# Checkpoint - Bloco 1A - SOS Controller policy

Data: 2026-05-31

## Escopo

Primeiro corte do Bloco 1 da refatoracao acelerada do SOS Controller. O objetivo foi consolidar a decisao pura de entrada do botao SOS e o inicio do encerramento ativo sem mover efeitos reais de camera, WebRTC, storage, cofre, backend ou navegacao.

## Executado

- Criada `src/features/emergency-home/sosControllerPolicy.ts`.
- `resolveSosControllerTrigger()` agora compoe `panicTriggerPolicy`, `finishFlowProgressPolicy`, `localSosPackageStatusPolicy` e `emergencyStartRuntimePolicy`.
- `resolveSosControllerFinishStart()` agora compoe a guarda inicial do encerramento e as acoes de estado runtime do finish.
- `app/index.tsx` passou a chamar o controlador puro para entrada do SOS e inicio do encerramento, mantendo os side effects reais no componente.
- Criado gate dedicado `scripts/sos-controller-policy.test.ts`.
- `package.json` recebeu `test:sos-controller`.
- `scripts/smoke-test.mjs` passou a exigir o novo controlador e seu teste.

## Limites preservados

- `app/index.tsx` continua responsavel por `Linking.openURL`, `router.push`, refs React, estado React, modal, chamada WebRTC, camera, gravacao, cofre local, sincronizacao backend, auditoria e logs operacionais.
- `sosControllerPolicy` nao executa API, storage, camera, WebRTC, navegacao, chamada telefonica, timer ou mutacao real.
- `panicTriggerPolicy`, `emergencyStartRuntimePolicy`, `finishActiveCallStartPolicy` e policies de finish permanecem como contratos menores reutilizados pelo controlador.
- Nao houve mudanca em API, media engine, criptografia, chaves, permissao nativa, backend, portais ou release.

## Validacoes executadas

- `npm run test:sos-controller`
- `npm run test:panic-trigger`
- `npm run test:finish-active-call-runtime-state-actions`
- `npm run test:emergency-start-runtime`
- `npm run test:finish-active-call-start`
- `node scripts/smoke-test.mjs`
- `npm run typecheck`
- `npm run lint`
- `git diff --check`

Todas aprovadas nesta etapa.

## Observacao de build

Build/instalacao Android nao sao obrigatorios neste corte porque o runtime fisico nao foi alterado. O bloco toca o fluxo SOS, entao a proxima fatia que mover side effects de camera/WebRTC/storage deve exigir validacao fisica proporcional.
