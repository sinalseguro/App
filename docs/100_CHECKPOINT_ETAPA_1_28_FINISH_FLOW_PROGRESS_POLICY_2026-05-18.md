# Checkpoint - Etapa 1.28 finish flow progress policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a apresentacao de progresso do encerramento do chamado da Home/SOS, sem alterar a parada real da camera, anexacao de midia, criptografia, cofre local, sincronizacao com backend, WebRTC, storage ou UX aprovada.

## Alteracoes

- Criado `src/features/emergency-home/finishFlowProgressPolicy.ts`.
- Criado gate focado `scripts/finish-flow-progress-policy.test.ts`.
- `app/index.tsx` passou a usar resolvers puros para progresso de protecao da midia, solicitacao de encerramento, camera sinalizada, settlement da parada, pacote ausente, sincronizacao remota e falha de encerramento.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:finish-flow-progress`.

## Validacoes

- `npm run test:finish-flow-progress`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P.

## Android fisico

Nao houve build nem teste fisico Android nesta fatia porque a mudanca e uma policy pura de apresentacao/progresso. ADB confirmou um Android USB e um Redmi via Wi-Fi/mDNS duplicado no inicio da rodada; teste fisico fim a fim continua exigido apenas para mudancas operacionais em SOS, chamada, camera, WebRTC, gravacao, backend ou UX nativa.

## Proxima recomendacao

Continuar com mais duas fatias puras em `app/index.tsx`, priorizando regras de apresentacao/estado ainda inline. Antes de qualquer build ou perfil Android, reconfirmar dois Androids distintos em `adb devices -l` e reservar a validacao fisica para alteracoes de runtime operacional.
