# Checkpoint - Etapa 1.31 protected route dialog policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a apresentacao do dialogo de codigo para rota protegida da Home/SOS, sem alterar verificacao criptografica, lockout, desbloqueio, navegacao real, storage, backend, permissao, WebRTC, camera ou gravacao.

## Alteracoes

- Criado `src/features/emergency-home/protectedRouteDialogPolicy.ts`.
- Criado gate focado `scripts/protected-route-dialog-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveProtectedRouteDialogPresentation()` para titulo, mensagem, labels, placeholder e accessibility label.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:protected-route-dialog`.

## Validacoes

- `npm run test:protected-route-dialog`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura de apresentacao. ADB confirmou um Android USB e um Redmi via Wi-Fi/mDNS duplicado no inicio da rodada; validacao fisica/performance continua reservada para mudancas operacionais.
