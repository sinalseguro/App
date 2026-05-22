# Checkpoint - Etapas 1.119 e 1.120 Settings Dashboard Tile Policy

Data: 2026-05-21

## Escopo

Refatoracao pura da tela `Configuracoes`, mantendo a rodada em duas fatias pequenas e sem alterar layout, textos publicos, botoes, modais, login, API, permissoes reais, storage, SOS, chamada ao vivo, release ou build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido no diff e ausencia de material sensivel.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.119 - modelo dos cards principais

- `buildSettingsDashboardTileRows()` centraliza o modelo dos 8 cards principais de `Configuracoes`.
- A policy retorna `key`, `label`, `description`, `icon` simbolico e `action` de cada card.
- Foram preservadas as quatro linhas atuais: termos/login, permissoes/gravacao, codigo de seguranca/midia e anjos/atualizacao.
- `app/configuracoes.tsx` continua responsavel pela renderizacao real de `ResourceTile` e pelos icones visuais.

## Etapa 1.120 - alvo das acoes dos cards

- `buildSettingsDashboardTileAction()` centraliza o alvo puro de painel para cada card.
- A policy nao executa navegacao, estado React, permissao, login, storage, API ou atualizacao real.
- `app/configuracoes.tsx` continua aplicando `setActivePanel()` e mantendo todos os efeitos reais da tela.

## Validacoes

- `npm run test:settings-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e sem CPU; processo encerrado para nao ficar pendurado, comportamento ja conhecido nesta frente.

## Decisao

- Sem build Android nesta rodada por ser policy pura sem runtime nativo, sem mudanca visual e sem alteracao operacional de API/permissoes/storage.
- Proxima rodada recomendada: continuar em `Configuracoes` com mais duas fatias pequenas, priorizando models puros dos paineis de status/preferencias ou acoes de atualizacao/login quando puderem permanecer sem efeitos.
