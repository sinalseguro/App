# Checkpoint - Etapas 1.185 e 1.186 - ConsentCard e StatusBanner

Data: 2026-05-24

## Escopo

Refatoracao presentational de baixo risco nos componentes visuais de consentimento e status, mantendo comportamento, textos recebidos por props, consumidores e fluxos existentes.

## Etapas

- Etapa 1.185: `src/components/consentCardPresentationPolicy.ts` passou a concentrar os ajustes de texto do `ConsentCard`.
- Etapa 1.186: `src/components/statusBannerPresentationPolicy.ts` passou a concentrar os ajustes de texto do `StatusBanner`.

## Limites preservados

- `ConsentCard` continua renderizando somente status, titulo e texto recebidos por props.
- `StatusBanner` continua renderizando somente titulo, texto e tom recebido por props.
- Nao houve mudanca em `onboardingSteps`, consumidores de status, perfis, convites, contatos, rotas, backend, storage ou permissoes.
- Nao houve mudanca em SOS, PanicButton, WebRTC, cofre/player runtime, login, gate protegido, portal ou release.

## Validacoes executadas

- `npm run test:onboarding-presentation`
- `npm run test:presentation-components`
- `node scripts/smoke-test.mjs`
- `npm run typecheck`
- `npm run lint`

Todas aprovadas nesta etapa.

## Observacao de build

Build/instalacao Android nao foram executados porque esta fatia altera apenas policies puras de apresentacao e componentes React sem runtime nativo.
