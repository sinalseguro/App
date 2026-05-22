# Checkpoint - Etapas 1.171 e 1.172 - Presentation components policy

Data: 2026-05-22

## Status

Refatoracao presentational implementada, validada e pronta para continuidade.

## Escopo executado

- Etapa 1.171: extraida `src/components/statusBannerPresentationPolicy.ts` para concentrar o mapeamento de tom visual do `StatusBanner`.
- Etapa 1.172: extraida `src/components/resourceTilePresentationPolicy.ts` para concentrar os ajustes de texto e a decisao visual de exibir descricao no `ResourceTile`.
- `StatusBanner` continua apenas renderizando titulo, texto e borda lateral conforme tom recebido.
- `ResourceTile` continua apenas renderizando icone, label, descricao opcional e callback injetado.

## Limites preservados

- Sem alteracao de layout, navegacao, callbacks, permissoes reais, convite real, update real, SOS, WebRTC, cofre, player, backend, portal ou release.
- Sem novo storage, endpoint, permissao, coleta, persistencia, log sensivel, token, chave, telefone, coordenada, path local ou conteudo de midia.
- As telas consumidoras continuam responsaveis pelos efeitos reais: `app/contatos.tsx`, `app/configuracoes.tsx`, `app/convite.tsx`, `app/perfis.tsx` e `LocalFilesResourceGrid`.

## Gates adicionados

- `scripts/presentation-components-policy.test.ts` valida tons do `StatusBanner`, parametros de ajuste de texto do `ResourceTile` e ausencia de acoplamento com React Native, tema, icones, API, storage, Share ou roteamento nas policies.
- `scripts/smoke-test.mjs` agora exige as duas policies e bloqueia regressao para efeitos reais ou dependencias visuais dentro das policies puras.
- `package.json` inclui `test:presentation-components` na suite principal.

## Validacoes

- `npm run test:presentation-components`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado; pendencia local conhecida de Node 20.16.0 versus requisito publico >=22.13.0.
- `git diff --check`: aprovado.

## Decisao

Sem build/instalacao Android nesta rodada porque a alteracao e puramente presentational e nao altera runtime nativo, permissoes reais, chamada real, camera, microfone, cofre, player ou fluxo de midia.

## Proxima recomendacao

Continuar a refatoracao em duas fatias pequenas apenas apos nova avaliacao de risco. Nao tocar agora em `AppTopBar`, `BrandedDialog`, `_layout`, `app/index.tsx`, SOS, WebRTC, cofre, backend ou publicacao.
