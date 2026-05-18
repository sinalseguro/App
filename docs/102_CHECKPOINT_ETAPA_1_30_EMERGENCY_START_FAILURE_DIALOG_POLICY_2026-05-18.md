# Checkpoint - Etapa 1.30 emergency start failure dialog policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a apresentacao do modal de falha ao iniciar chamado da Home/SOS, sem alterar captura local, fallback telefonico, estado do chamado, logs saneados, backend, storage, WebRTC, gravacao ou layout.

## Alteracoes

- Criado `src/features/emergency-home/emergencyStartFailureDialogPolicy.ts`.
- Criado gate focado `scripts/emergency-start-failure-dialog-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveEmergencyStartFailureDialogPresentation()` para titulo, mensagem e label de confirmacao.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:emergency-start-failure-dialog`.

## Validacoes

- `npm run test:emergency-start-failure-dialog`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura de apresentacao. ADB confirmou um Android USB e um Redmi via Wi-Fi/mDNS duplicado no inicio da rodada; validacao fisica/performance continua reservada para mudancas operacionais.

## Proxima recomendacao

Manter o padrao de duas fatias por rodada e continuar removendo apresentacoes/decisoes puras da Home/SOS antes de qualquer nova mudanca operacional. A proxima validacao Android fisica deve ocorrer quando houver alteracao em camera, WebRTC, gravacao, chamada, backend ou UX nativa.
