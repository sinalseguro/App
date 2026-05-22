# Checkpoint - Etapas 1.123 e 1.124 Settings Sharing/Video Policy

Data: 2026-05-22

## Escopo

Refatoracao pura da tela `Configuracoes`, mantendo a rodada em duas fatias pequenas e sem alterar layout, textos publicos, botoes, modais, permissao real, codigo de seguranca, login, API, storage, SOS, chamada ao vivo, release ou build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido no diff e ausencia de material sensivel.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.123 - painel de compartilhamento

- `buildSettingsSharingPanelState()` centraliza o resumo do anjo convidado e os modelos puros das acoes do painel `Compartilhamento`.
- A policy preserva os bloqueios publicos de atalho de anjo e 190 pelo anjo ate gestao, aceite e contrato futuros.
- `app/configuracoes.tsx` continua responsavel por executar `toggleCall190OnSos()`, `toggleStreamScope()` e `toggleReceiverEncryptedSave()`.

## Etapa 1.124 - painel de video

- `buildSettingsVideoPanelState()` centraliza os modelos puros das acoes do painel `Video local`.
- A policy preserva os labels de video local, autorizacao de camera/microfone e selecao de camera frontal/traseira/duas cameras.
- `app/configuracoes.tsx` continua responsavel por executar permissao real de camera/microfone, alternar video local e atualizar camera real.

## Validacoes

- `npm run test:settings-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado; smoke ajustado para validar os textos contratuais agora centralizados na policy.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e com 0% CPU; processo encerrado para nao ficar pendurado, comportamento ja conhecido nesta frente.

## Decisao

- Sem build Android nesta rodada por ser policy pura sem runtime nativo, sem mudanca visual e sem alteracao operacional de API/permissoes/storage/video.
- Proxima rodada recomendada: continuar em `Configuracoes` com mais duas fatias pequenas, priorizando a apresentacao pura do painel de atualizacao e a reducao controlada do bloco de login.
