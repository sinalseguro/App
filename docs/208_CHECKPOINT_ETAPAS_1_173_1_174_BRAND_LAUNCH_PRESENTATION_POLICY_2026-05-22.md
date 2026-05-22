# Checkpoint - Etapas 1.173 e 1.174 - Brand e launch presentation policy

Data: 2026-05-22

## Escopo

Rodada SS de refatoracao presentational em componentes de marca e carregamento, mantendo duas fatias pequenas por vez.

Esta rodada nao altera layout publico, fluxo de login, SOS, WebRTC, cofre, player, convites, API, storage, permissoes, backend, portal, release ou build Android.

## Executado

- Etapa 1.173: extraida `src/components/appLaunchPresentationPolicy.ts` para concentrar nome da marca, label de acessibilidade e parametros da barra de carregamento do `AppLaunchScreen`.
- Etapa 1.174: extraida `src/components/brandLockupPresentationPolicy.ts` para concentrar label, role de acessibilidade e tamanho do logo do `BrandLockup`.
- `AppLaunchScreen` continua responsavel por `Animated`, asset do simbolo, montagem da tela e renderizacao da barra de carregamento.
- `BrandLockup` continua responsavel por renderizar o asset aprovado da marca.
- `scripts/smoke-test.mjs` recebeu guardrails para garantir que as policies de marca/carregamento permanecam puras, sem efeitos reais, storage, API, Share, roteamento, icones Lucide ou animacao.
- `scripts/brand-components-presentation-policy.test.ts` valida os contratos visuais e de acessibilidade dos dois componentes.

## Gates de seguranca e QA

- Cristine: mudanca restrita a apresentacao e acessibilidade; sem novo dado sensivel, endpoint, permissao, storage, segredo, backend, portal ou release.
- Eliane: teste focado e smoke garantem que a extracao nao levou efeitos reais para policies.
- Lina/Tarcila: identidade visual preservada; nome, logo, asset, dimensoes e barra de carregamento mantidos.

## Validacoes

- `npm run test:brand-components-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado apos ajuste do guardrail de splash para ler a nova policy.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `git diff --check`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado, mantendo apenas a pendencia local conhecida de Node `20.16.0` para release publico.
- `npm test`: aprovado.

## Observacoes

- Sem build ou instalacao Android porque a fatia e presentational e nao altera runtime nativo.
- Alvos sensiveis continuam fora desta rodada: `AppTopBar`, `BrandedDialog`, `_layout`, `app/index.tsx`, SOS, WebRTC, cofre, backend e publicacao.

## Proxima recomendacao

Continuar a refatoracao somente apos nova avaliacao de risco. A proxima rodada deve procurar outra superficie pequena, isolada e visual; qualquer mudanca em runtime de SOS, camera, WebRTC, cofre, player, backend ou publicacao deve ter plano e validacao fisica propria.
