# Checkpoint - Etapa 1.35 emergency call hero policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a apresentacao de acessibilidade do numero emergencial exibido no modal de chamada, sem alterar discagem, lista de numeros oficiais, componente visual, navegacao, permissao, backend, WebRTC, camera ou gravacao.

## Alteracoes

- Criado `src/features/emergency-home/emergencyCallHeroPolicy.ts`.
- Criado gate focado `scripts/emergency-call-hero-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveEmergencyCallHeroPresentation()` para `accessibilityHint` e `accessibilityLabel` do `CallNumberHero`.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:emergency-call-hero`.

## Validacoes

- `npm run test:emergency-call-hero`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura de apresentacao/acessibilidade. Validacao fisica/performance continua reservada para mudancas operacionais.
