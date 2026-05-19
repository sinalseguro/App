# Checkpoint - Etapa 1.66 emergency start failure actions policy

Data: 2026-05-19

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair as acoes de falha controlada ao iniciar o SOS, preservando log saneado, status local, limpeza de pacote ativo e dialogo de falha ja existente.

## Alteracoes

- Criado `src/features/emergency-home/emergencyStartFailureActionsPolicy.ts`.
- Criada funcao `resolveEmergencyStartFailureActions()`.
- `app/index.tsx` passou a aplicar flags explicitas para:
  - registrar `emergency_start_error`;
  - limpar `activePackageId`;
  - atualizar status local de falha;
  - exibir o dialogo de falha existente.
- A policy `emergencyStartFailureDialogPolicy.ts` foi preservada e continua testada individualmente.
- Criado `scripts/emergency-start-failure-actions-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:emergency-start-failure-actions`: aprovado.
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

Continuar o plano de refatoracao com novas duplas pequenas somente em regras inline de baixo risco. Mudancas em camera, WebRTC, backend, permissao ou UX real devem incluir validacao fisica proporcional antes de fechar.
