# Checkpoint - Etapas 1.131 e 1.132 Settings Legal/Duration Policy

Data: 2026-05-22

## Escopo

Rodada final curta da tela `Configuracoes`, mantendo duas fatias pequenas e sem alterar layout, textos publicos, botoes, modais, aceite real, persistencia, storage, login, API, permissoes reais, SOS, chamada ao vivo, release ou build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido em consentimento, duracao, ausencia de storage/API/logs na policy e varredura sensivel do diff.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.131 - termos e privacidade

- `buildSettingsLegalPanelState()` centraliza itens de resumo e acao visual do painel `Termos e privacidade`.
- A policy recebe somente `privacyAccepted` e retorna `items` e `actions`.
- `app/configuracoes.tsx` continua responsavel por executar `acceptLegalConsent()`, preservar `version` e registrar `acceptedAt` no efeito real.

## Etapa 1.132 - duracao da gravacao

- `buildSettingsDurationPanelState()` centraliza a lista de acoes de duracao com `durationSeconds`, `label`, `key`, icone simbolico e estilo selecionado.
- A policy usa `formatDuration(duration)` e recebe somente opcoes ja tipadas como `EmergencyDurationSeconds[]`.
- `app/configuracoes.tsx` continua responsavel por persistir via `updateDuration()` e `updatePreferences()`.

## Validacoes

- `npm run test:settings-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado; smoke ajustado para validar `buildSettingsLegalPanelState()`, `handleLegalPanelAction()`, `buildSettingsDurationPanelState()` e `handleDurationPanelAction()`.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e ocioso; processo encerrado para nao ficar pendurado, comportamento ja conhecido nesta frente.

## Decisao

- Sem build Android nesta rodada por ser policy pura sem runtime nativo, sem mudanca visual e sem alteracao operacional de API/login/update/storage/permissoes reais.
- `Configuracoes` fica encerrada como tela principal desta fase da refatoracao: os paineis pesados agora estao cobertos por policy pura, teste focado, smoke e memoria local.
- Proxima recomendacao: avancar para a proxima tela pesada da refatoracao usando o mesmo padrao de duas fatias pequenas.
