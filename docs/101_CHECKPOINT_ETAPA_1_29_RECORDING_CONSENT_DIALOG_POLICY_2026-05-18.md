# Checkpoint - Etapa 1.29 recording consent dialog policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a apresentacao do modal de consentimento de gravacao da Home/SOS, sem alterar LGPD, termos, navegacao real para configuracoes, permissao de camera/microfone, backend, storage, WebRTC, gravacao ou layout.

## Alteracoes

- Criado `src/features/emergency-home/recordingConsentDialogPolicy.ts`.
- Criado gate focado `scripts/recording-consent-dialog-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveRecordingConsentDialogPresentation()` para titulo, mensagem e labels do modal.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:recording-consent-dialog`.

## Validacoes

- `npm run test:recording-consent-dialog`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura de apresentacao. ADB confirmou um Android USB e um Redmi via Wi-Fi/mDNS duplicado no inicio da rodada; validacao fisica/performance continua reservada para mudancas operacionais.
