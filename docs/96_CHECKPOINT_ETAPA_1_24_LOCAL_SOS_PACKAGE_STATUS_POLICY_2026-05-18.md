# Checkpoint - Etapa 1.24 local SOS package status policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair mensagens recorrentes do estado do pacote SOS local da Home/SOS, sem alterar captura, gravacao, cofre local, storage, API, auditoria ou UX visual.

## Alteracoes

- Criado `src/features/emergency-home/localSosPackageStatusPolicy.ts`.
- Criado gate focado `scripts/local-sos-package-status-policy.test.ts`.
- `app/index.tsx` passou a usar:
  - `initialLocalSosPackageStatus`;
  - `resolveLocalSosPackageStatus()`.
- Foram centralizadas mensagens de:
  - pronto para pedir ajuda;
  - recuperacao de chamado interrompido;
  - chamada ao vivo gravando;
  - chamada ao vivo preservada;
  - protecao de video local em andamento;
  - inicio do pedido de ajuda;
  - falha de inicio;
  - encerramento solicitado;
  - chamado nao encontrado;
  - falha de encerramento.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:local-sos-package-status`.

## Validacoes

- `npm run test:local-sos-package-status`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou log runtime novo.

## Decisao

Nao houve build Android nesta fatia porque a mudanca e uma policy pura e nao altera comportamento operacional de SOS, chamada, camera, gravacao, backend ou portal.

## Proxima recomendacao

Continuar a refatoracao com mais duas fatias pequenas e puras, priorizando regras ainda inline em `app/index.tsx` que nao toquem runtime nativo. A proxima alteracao operacional em SOS, WebRTC, camera, gravacao, backend ou UX de chamada deve repetir validacao fisica owner -> anjo.
