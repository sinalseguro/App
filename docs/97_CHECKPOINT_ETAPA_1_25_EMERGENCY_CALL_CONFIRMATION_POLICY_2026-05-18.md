# Checkpoint - Etapa 1.25 emergency call confirmation policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a apresentacao da confirmacao de ligacao emergencial da Home/SOS, sem alterar discagem, botoes, layout, backend, storage, camera, WebRTC ou gravacao.

## Alteracoes

- Criado `src/features/emergency-home/emergencyCallConfirmationPolicy.ts`.
- Criado gate focado `scripts/emergency-call-confirmation-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveEmergencyCallConfirmation()` para titulo, mensagem e labels do modal de ligacao.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:emergency-call-confirmation`.

## Validacoes

- `npm run test:emergency-call-confirmation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou log runtime novo.

## Android fisico

Nao houve build nem teste fisico Android nesta fatia porque a mudanca e uma policy pura de apresentacao. ADB retornou somente o Redmi via Wi-Fi/mDNS no momento desta rodada; teste fisico fim a fim continua exigido apenas para mudancas operacionais em SOS, chamada, camera, WebRTC, gravacao, backend ou UX nativa.
