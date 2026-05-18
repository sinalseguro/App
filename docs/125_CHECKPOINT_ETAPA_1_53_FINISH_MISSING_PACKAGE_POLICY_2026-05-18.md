# Checkpoint - Etapa 1.53 finish missing package policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao de pacote ausente no encerramento do SOS, sem alterar recorder, cofre, WebRTC, backend, layout, textos de usuario ou fluxo operacional.

## Alteracoes

- Criado `src/features/emergency-home/finishMissingPackagePolicy.ts`.
- Criado gate focado `scripts/finish-missing-package-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveFinishMissingPackageActions()` quando `finishEmergencyPackage()` nao retorna pacote.
- A policy centraliza:
  - status local `finish_missing_package`;
  - decisao de mostrar ou nao o progresso de pacote ausente;
  - progresso final `Chamado nao encontrado` quando nao havia `stopSerial`.
- Os efeitos reais continuam em `app/index.tsx`: `setRecordingStatus()` e `showFinishProgress()`.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:finish-missing-package`.

## Validacoes

- `npm run test:finish-missing-package`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

ADB confirmou o Android `23129RA5FL` via Wi-Fi, mas nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Concluir a dupla com a policy de falha controlada no `catch` do encerramento.
