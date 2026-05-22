# Checkpoint - Etapas 1.115 e 1.116 Trusted Angels Dashboard Tile Policy

Data: 2026-05-21

## Escopo

Refatoracao pura do dashboard da tela `Anjos de confianca`. Esta rodada preserva layout, textos publicos, icones, botoes, backend, storage, Share, revogacao real, SOS, chamada ao vivo, release e build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido no diff e ausencia de material sensivel.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.115 - modelo dos cards do dashboard

- `trustedAngelsDashboardPolicy` passou a expor `buildTrustedAngelsDashboardTileRows()`.
- Os 8 cards principais foram modelados como linhas puras com `key`, `label`, `description`, `icon` e `action`.
- `app/contatos.tsx` continua responsavel por renderizar `ResourceTile` e os icones reais.

## Etapa 1.116 - acoes dos cards do dashboard

- Extraida `buildTrustedAngelsDashboardTileAction()`.
- A policy centraliza os alvos de rota, painel, dialog e refresh.
- O convite continua abrindo `invite` quando permitido e `profile_block` quando bloqueado.
- `app/contatos.tsx` continua responsavel pelos efeitos reais: `router.push`, `setPanel`, `setDialog` e `refreshAngels()`.

## Validacoes

- `npm run test:trusted-angels-dashboard`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e sem CPU; processo encerrado para nao ficar pendurado, comportamento ja conhecido nesta frente.

## Decisao

- Sem build Android nesta rodada por ser policy pura sem runtime nativo, sem mudanca visual e sem alteracao operacional de API/cache/Share.
- A subarea `Anjos de confianca` esta praticamente esgotada para extracoes seguras pequenas. Proxima recomendacao: migrar a refatoracao para outra tela/fluxo com maior retorno.
