# Checkpoint - Etapas 1.117 e 1.118 Settings Presentation Policy

Data: 2026-05-21

## Escopo

Refatoracao pura da tela `Configuracoes`, iniciando a migracao segura apos a subarea `Anjos de confianca`. Esta rodada preserva layout, textos publicos, botoes, login, API, permissoes reais, storage, SOS, chamada ao vivo, release e build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido no diff e ausencia de material sensivel.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.117 - status e labels de configuracoes

- Criada `settingsPresentationPolicy`.
- Extraidos `resolveSettingsPermissionStatus()`, `formatSettingsCameraModeLabel()` e `formatSettingsTrustedContactStatus()`.
- A tela continua responsavel por chamadas reais de permissao, camera, microfone, localizacao e persistencia de preferencias.

## Etapa 1.118 - paineis, termos e ajuda

- Extraidos `SettingsPanel`, `settingsPanelTitles`, `settingsLegalConsentItems` e `buildSettingsPanelHelp()`.
- O resumo de termos e privacidade continua visivel antes do aceite local.
- O smoke foi atualizado para validar a nova fonte dos textos de termos sem perder a garantia de UX.

## Validacoes

- `npm run test:settings-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e sem CPU; processo encerrado para nao ficar pendurado, comportamento ja conhecido nesta frente.

## Decisao

- Sem build Android nesta rodada por ser policy pura sem runtime nativo, sem mudanca visual e sem alteracao operacional de API/permissoes/storage.
- Proxima rodada recomendada: continuar em `Configuracoes` com mais duas fatias pequenas, priorizando modelo dos cards principais ou decisions de atualizacao/login somente se puderem ficar puras.
