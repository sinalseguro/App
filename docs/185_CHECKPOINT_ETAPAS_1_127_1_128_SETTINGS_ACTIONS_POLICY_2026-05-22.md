# Checkpoint - Etapas 1.127 e 1.128 Settings Actions Policy

Data: 2026-05-22

## Escopo

Refatoracao pura da tela `Configuracoes`, mantendo a rodada em duas fatias pequenas e sem alterar layout, textos publicos, botoes, modais, login real, API, storage, atualizacao real, SOS, chamada ao vivo, release ou build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido em login/update, tokens, bootstrap, storage, logs e ausencia de material sensivel.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.127 - acoes do painel de atualizacao

- `buildSettingsUpdatePanelState()` agora retorna tambem a lista tipada de acoes `verify-update` e `download-update`.
- A policy continua sem executar rede, abrir portal, acessar storage ou alterar estado React.
- `app/configuracoes.tsx` continua responsavel por executar `checkForAppUpdate()` e `openAppUpdateDownload()`.
- `handleUpdatePanelAction()` apenas roteia a intencao tipada para os handlers reais ja existentes.

## Etapa 1.128 - acoes do painel de login

- `buildSettingsLoginPanelState()` agora retorna acoes tipadas para validar sessao, sair, entrar por e-mail, testar API, Google e Apple.
- A policy continua sem autenticar, sem acessar token, sem chamar API, sem registrar dispositivo, sem limpar sessao e sem persistir dados.
- `app/configuracoes.tsx` continua responsavel por `refreshApiSession()`, `loginWithEmailPassword()`, `logoutApiSession()`, `loginWithGoogle()`, `loginWithApple()` e `checkApiConnection()`.
- `handleLoginPanelAction()` apenas roteia a intencao tipada para os handlers reais ja existentes.

## Validacoes

- `npm run test:settings-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado; smoke ajustado para validar `handleLoginPanelAction`, `handleUpdatePanelAction` e as chaves tipadas da policy.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e ocioso; processo encerrado para nao ficar pendurado, comportamento ja conhecido nesta frente.

## Decisao

- Sem build Android nesta rodada por ser policy/action routing puro sem runtime nativo, sem mudanca visual e sem alteracao operacional de API/login/update/storage.
- Proxima rodada recomendada: encerrar a passagem por `Configuracoes` com duas fatias pequenas nos paineis restantes onde ainda houver decisao pura repetida, ou passar para a proxima tela mais pesada seguindo o mesmo padrao de policy + teste focado + smoke.
