# Checkpoint - Etapa 1.27 interrupted recovery progress policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a apresentacao de progresso da recuperacao de chamado interrompido da Home/SOS, sem alterar camera, microfone, criptografia, cofre local, backend, WebRTC, storage ou fluxo real de recuperacao.

## Alteracoes

- Criado `src/features/emergency-home/interruptedRecoveryProgressPolicy.ts`.
- Criado gate focado `scripts/interrupted-recovery-progress-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveInterruptedRecoveryFinishProgress()` e `resolveInterruptedResidueRecoveryProgress()` para mensagens de recuperacao.
- `scripts/smoke-test.mjs` passou a exigir a policy e a manter o texto sensivel fora da regra inline da Home.
- `package.json` recebeu `npm run test:interrupted-recovery-progress`.

## Validacoes

- `npm run test:interrupted-recovery-progress`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P.

## Android fisico

Nao houve build nem teste fisico Android nesta fatia porque a mudanca e uma policy pura de apresentacao/progresso. ADB confirmou um Android USB e um Redmi via Wi-Fi/mDNS duplicado no inicio da rodada; teste fisico fim a fim continua exigido apenas para mudancas operacionais em SOS, chamada, camera, WebRTC, gravacao, backend ou UX nativa.
