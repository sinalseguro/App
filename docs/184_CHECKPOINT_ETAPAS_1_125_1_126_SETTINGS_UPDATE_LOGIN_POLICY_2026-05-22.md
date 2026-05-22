# Checkpoint - Etapas 1.125 e 1.126 Settings Update/Login Policy

Data: 2026-05-22

## Escopo

Refatoracao pura da tela `Configuracoes`, mantendo a rodada em duas fatias pequenas e sem alterar layout, textos publicos, botoes, modais, login real, API, storage, atualizacao real, SOS, chamada ao vivo, release ou build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido no diff e ausencia de material sensivel.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.125 - painel de atualizacao

- `buildSettingsUpdatePanelState()` centraliza labels, estado visual e bloqueios puros do painel `Atualizacao`.
- A policy preserva label da versao instalada, label da versao disponivel, mensagem de consulta, data da ultima verificacao e estado dos botoes de verificar/baixar.
- `app/configuracoes.tsx` continua responsavel por executar `checkForAppUpdate()` e `openAppUpdateDownload()`.

## Etapa 1.126 - painel de login

- `buildSettingsLoginPanelState()` centraliza apresentacao da conta, API, dispositivo, Google, Apple e labels/bloqueios de botoes do painel `Login`.
- A policy preserva os textos publicos de conta desconectada, dispositivo registrado, API habilitada/desabilitada e provedores de login.
- `app/configuracoes.tsx` continua responsavel por login real, logout, bootstrap autenticado, limpeza de sessao, API, Google/Apple e estado React.

## Validacoes

- `npm run test:settings-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado; smoke ajustado para validar textos de login/dispositivo agora centralizados na policy.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e praticamente ocioso; processo encerrado para nao ficar pendurado, comportamento ja conhecido nesta frente.

## Decisao

- Sem build Android nesta rodada por ser policy pura sem runtime nativo, sem mudanca visual e sem alteracao operacional de API/login/update/storage.
- Proxima rodada recomendada: continuar em `Configuracoes` com mais duas fatias pequenas, reduzindo o restante dos handlers de login/update apenas onde houver decisao pura e sem side effects.
