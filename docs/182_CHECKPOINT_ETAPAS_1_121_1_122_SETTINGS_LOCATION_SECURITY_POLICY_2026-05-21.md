# Checkpoint - Etapas 1.121 e 1.122 Settings Location/Security Policy

Data: 2026-05-21

## Escopo

Refatoracao pura da tela `Configuracoes`, mantendo a rodada em duas fatias pequenas e sem alterar layout, textos publicos, botoes, modais, permissao real, codigo de seguranca, login, API, storage, SOS, chamada ao vivo, release ou build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido no diff e ausencia de material sensivel.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.121 - painel de localizacao

- `buildSettingsLocationPanelState()` centraliza os textos/status puros do painel `Localizacao`.
- A policy preserva o texto do gate de primeiro plano, o texto do gate de segundo plano e a regra que trata segundo plano diferente de `permitido` como `bloqueado`.
- `app/configuracoes.tsx` continua responsavel pela solicitacao real de permissao, leitura do sistema, abertura dos ajustes e persistencia das preferencias.

## Etapa 1.122 - painel de codigo de seguranca

- `buildSettingsSecurityCodePanelState()` centraliza label/status do painel `Codigo de seguranca`.
- A policy preserva os labels publicos de ativar, alterar e desativar codigo.
- `app/configuracoes.tsx` continua responsavel por validacao dos campos, hash do codigo, verificacao do codigo atual, limpeza de acesso protegido e persistencia local.

## Validacoes

- `npm run test:settings-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e com 0% CPU; processo encerrado para nao ficar pendurado, comportamento ja conhecido nesta frente.

## Decisao

- Sem build Android nesta rodada por ser policy pura sem runtime nativo, sem mudanca visual e sem alteracao operacional de API/permissoes/storage/codigo.
- Proxima rodada recomendada: continuar em `Configuracoes` com mais duas fatias pequenas, priorizando a apresentacao pura dos paineis de compartilhamento/video ou atualizacao.
