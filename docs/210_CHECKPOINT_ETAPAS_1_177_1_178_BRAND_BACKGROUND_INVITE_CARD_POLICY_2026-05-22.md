# Checkpoint - Etapas 1.177 e 1.178 - Brand background e InviteCard policy

Data: 2026-05-22

## Escopo

Rodada SS de refatoracao presentational em componentes visuais pequenos, mantendo duas fatias pequenas por vez.

Esta rodada nao altera layout publico estrutural, fluxo de login, SOS real, WebRTC, cofre, player, convites reais, API, storage, permissoes, backend, portal, release ou build Android.

## Executado

- Etapa 1.177: extraida `src/components/brandBackgroundPresentationPolicy.ts` para concentrar dados puros de apresentacao/animação do `BrandBackground`: particulas, delays, duracoes, ranges de opacidade/escala, reset e pulso de watermark.
- Etapa 1.178: expandida `src/components/inviteCardPresentationPolicy.ts` para concentrar `textFit`, tamanho do icone e role de acessibilidade do `InviteCard` clicavel.
- `BrandBackground` continua responsavel por `Animated`, `useEffect`, `useMemo`, `useRef`, asset `require(...)`, `Image`, JSX, `StyleSheet`, tema e interpolations reais.
- `InviteCard` continua responsavel por `toneColor`, `theme.colors`, icones Lucide, `defaultIcon`, `Pressable`, callbacks e JSX.
- A policy do `BrandBackground` usa objetos estaveis para evitar recriar configs/ranges a cada render e reduzir risco de reinicio indevido da animacao.
- `scripts/smoke-test.mjs` recebeu guardrails para garantir que as policies permanecam puras, sem `Animated`, `useEffect`, assets, React Native, tema, storage, API, Share, roteamento ou icones Lucide.

## Gates de seguranca e QA

- Cristine: mudanca restrita a apresentacao/acessibilidade; sem novo dado sensivel, endpoint, permissao, storage, segredo, backend, portal ou release.
- Eliane: testes focados, smoke e typecheck validam que efeitos reais ficaram nos componentes e que as policies seguem puras.
- Lina/Tarcila: identidade visual preservada; particulas, watermark, tons, labels, icones, text-fit e acessibilidade foram mantidos de forma equivalente.

## Validacoes

- `npm run test:brand-components-presentation`: aprovado.
- `npm run test:status-components-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado, mantendo apenas a pendencia local conhecida de Node `20.16.0` para release publico.
- `npm test`: aprovado.
- `git diff --check`: aprovado.

## Observacoes

- Sem build ou instalacao Android porque a fatia e presentational e nao altera runtime nativo.
- Alvos sensiveis continuam fora desta rodada: `AppTopBar`, `BrandedDialog`, `_layout`, `app/index.tsx`, SOS/WebRTC, cofre, backend e publicacao.

## Proxima recomendacao

Para a proxima rodada, fazer nova microtriagem e evitar componentes com runtime real, media, chamada, storage, backend ou publicacao.
