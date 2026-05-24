# Checkpoint - Etapas 1.187 e 1.188 - Marca e carregamento

Data: 2026-05-24

## Escopo

Refatoracao presentational de baixo risco nos componentes de marca e carregamento, mantendo assets, animacao, hooks, fluxo de boot e identidade visual existentes.

## Etapas

- Etapa 1.187: `src/components/brandLockupPresentationPolicy.ts` passou a concentrar `logoResizeMode` alem de label, role e dimensoes do logo.
- Etapa 1.188: `src/components/appLaunchPresentationPolicy.ts` passou a concentrar role do progresso, ajustes de texto do nome da marca, `symbolResizeMode` e dimensoes do simbolo.

## Limites preservados

- `BrandLockup` continua responsavel por renderizar o asset aprovado `sinalseguro-logo.png`.
- `AppLaunchScreen` continua responsavel por `Animated`, `useEffect`, `useRef`, interpolacao, asset `sinalseguro-symbol.png`, JSX e estilos.
- Nao houve mudanca em `_layout`, gate de acesso, login, verificacao de versao, tempo de boot real, backend, storage ou publicacao.
- Nao houve mudanca em SOS, PanicButton, WebRTC, cofre/player runtime, portal ou release.

## Validacoes executadas

- `npm run test:brand-components-presentation`
- `node scripts/smoke-test.mjs`
- `npm run typecheck`
- `npm run lint`

Todas aprovadas nesta etapa.

## Observacao de build

Build/instalacao Android nao foram executados porque esta fatia altera apenas policies puras de apresentacao e componentes React sem runtime nativo.
