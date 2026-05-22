# Checkpoint - Etapas 1.175 e 1.176 - Action components presentation policy

Data: 2026-05-22

## Escopo

Rodada SS de refatoracao presentational em componentes de acao, mantendo duas fatias pequenas por vez.

Esta rodada nao altera layout publico, fluxo de login, SOS real, WebRTC, cofre, player, convites, API, storage, permissoes, backend, portal, release ou build Android.

## Executado

- Etapa 1.175: extraida `src/components/buttonIconPresentationPolicy.ts` para concentrar role de acessibilidade, estado desabilitado, tamanho do icone e ajuste de texto do `ButtonIcon`.
- Etapa 1.176: extraida `src/features/emergency-home/emergencyCallDockPresentationPolicy.ts` para concentrar label/hint de acessibilidade, role, tamanho do icone e ajuste de texto dos botoes de chamada do `EmergencyCallDock`.
- `ButtonIcon` continua responsavel por renderizar `Pressable`, icone recebido, texto, pressed/disabled style e callbacks injetados.
- `EmergencyCallDock` continua responsavel por renderizar icones Lucide, mapear `emergencyCallTargets` e chamar `onCallTarget(target)`.
- `scripts/smoke-test.mjs` recebeu guardrails para garantir que as policies de acao permanecam puras, sem efeitos reais, storage, API, Share, roteamento, `Linking.openURL`, icones Lucide ou animacao.
- `scripts/action-components-presentation-policy.test.ts` valida os contratos visuais e de acessibilidade dos dois componentes.

## Gates de seguranca e QA

- Cristine: mudanca restrita a apresentacao/acessibilidade; sem novo dado sensivel, endpoint, permissao, storage, segredo, backend, portal ou release.
- Eliane: teste focado, smoke, typecheck e lint garantem que a extracao nao levou efeitos reais para policies.
- Lina/Tarcila: identidade visual preservada; botao, icone, label, comportamento pressionado/desabilitado e textos de chamada mantidos.

## Validacoes

- `npm run test:action-components-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `git diff --check`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado, mantendo apenas a pendencia local conhecida de Node `20.16.0` para release publico.
- `npm test`: aprovado.

## Observacoes

- Sem build ou instalacao Android porque a fatia e presentational e nao altera runtime nativo.
- Alvos sensiveis continuam fora desta rodada: `AppTopBar`, `BrandedDialog`, `_layout`, `app/index.tsx`, SOS/WebRTC, cofre, backend e publicacao.

## Proxima recomendacao

Antes da proxima dupla, fazer nova microtriagem. O especialista auxiliar recomendou considerar `BrandBackground` e `InviteCard` como proximos alvos visuais, desde que o worktree esteja limpo e sem tocar em `Animated`, `useEffect`, `require(...)`, JSX/Lucide, `theme.colors`, fluxo real, backend ou publicacao dentro das policies.
