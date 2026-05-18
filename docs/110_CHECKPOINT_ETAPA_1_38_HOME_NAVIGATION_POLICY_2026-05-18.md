# Checkpoint - Etapa 1.38 home navigation policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao de navegacao da Home/SOS para rotas simples e abertura do painel do cofre/player, sem alterar o efeito real de navegacao, protecao por codigo, permissao, backend, storage, midia ou layout.

## Alteracoes

- Criado `src/features/emergency-home/homeNavigationPolicy.ts`.
- Criado gate focado `scripts/home-navigation-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveEmergencyHomeNavigationTarget()` em `navigateRoute()`.
- `navigateRoute()` continua responsavel por fechar o menu e executar `router.push()`.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:home-navigation`.

## Validacoes

- `npm run test:home-navigation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

ADB confirmou os Androids conectados no inicio da rodada, mas nao houve build, instalacao ou perfil Android porque a mudanca e uma policy pura de decisao de navegacao. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Manter o ritmo de duas fatias por rodada. A proxima dupla recomendada deve mirar regras puras ainda restantes em `app/index.tsx`, evitando tocar no fluxo operacional de midia/chamada enquanto nao houver necessidade.
