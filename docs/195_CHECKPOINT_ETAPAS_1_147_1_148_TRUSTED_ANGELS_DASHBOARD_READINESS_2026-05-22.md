# Checkpoint - Etapas 1.147 e 1.148 - Dashboard e prontidao de Anjos

Data: 2026-05-22

## Escopo

Rodada de refatoracao presentational em `app/contatos.tsx`, mantendo duas fatias pequenas por vez.

- Etapa 1.147: extrair a grade visual do dashboard de anjos para `TrustedAngelsDashboardGrid`.
- Etapa 1.148: extrair o conteudo visual do painel de prontidao para `TrustedAngelsReadinessPanelContent`.

## Alteracoes

- `app/contatos.tsx`
  - adiciona `TrustedAngelsDashboardGrid` como componente local de apresentacao;
  - adiciona `renderTrustedAngelsDashboardTileIcon()` como helper visual local;
  - adiciona `TrustedAngelsReadinessPanelContent` como componente local de apresentacao;
  - mantem `handleDashboardTileAction()`, `router.push()`, `refreshAngels()`, `Share.share()`, `apiClient`, `AppState`, cache local e revogacoes reais no `ContactsScreen`.
- `scripts/smoke-test.mjs`
  - passa a exigir os novos componentes locais;
  - passa a falhar se `TrustedAngelsDashboardGrid` tentar assumir API, Share, AppState, storage, convite, revogacao ou device binding.

## Limites preservados

`ContactsScreen` continua responsavel por:

- gate de perfil antes de convite;
- refresh local/remoto com `Promise.allSettled`;
- cache local de vinculos aceitos;
- criacao, compartilhamento e revogacao real de convites;
- revogacao real de vinculos;
- navegacao real;
- estado React e dialogs;
- acesso a API, storage, device binding, `AppState` e `Share.share()`.

Os novos componentes recebem dados prontos e callbacks. Eles nao importam nem executam API, storage, Share, device binding, AppState, refresh, revogacao, criacao de convite ou navegacao.

## QA e seguranca

- Mudanca restrita a apresentacao local da tela `Anjos de confianca`.
- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- Gate de perfil, bloqueio de menor, cache offline de vinculos e texto de convite sem evidencias/midia foram preservados.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada, telefone, nome real novo ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados: imports/handlers ja existentes no `ContactsScreen` e anchors do smoke.

## Validacoes

Aprovadas:

- `npm run test:trusted-angels-dashboard`
- `npm run test:trusted-angels-panel`
- `node scripts/smoke-test.mjs`
- `npm run lint`
- `npm run private:android:readiness`
- `npm test`
- `git diff --check`

Observacao:

- `npm test` tambem executou os gates de `trusted-angels-dialog`, `trusted-angels-action` e `trusted-angels-refresh`.
- `npm run typecheck` nao emitiu erro, mas ficou sem saida e 0% CPU por cerca de 1 minuto; foi encerrado para nao deixar processo pendurado.
- `npm run private:android:readiness` manteve a pendencia local ja conhecida: Node 20.16.0 abaixo do requisito de release publica, aceitavel para build privado debug.
- Sem build/instalacao Android porque a fatia e presentational e nao altera runtime fisico, UX nativa, camera, microfone, gravacao, WebRTC real, storage de midia, cofre ou portal.

## Proxima recomendacao

Continuar em `app/contatos.tsx` com mais duas fatias pequenas:

- extrair componente local para os paineis `Meus anjos` e `Sou anjo`, recebendo `items`, `emptyState` e callback de revogacao;
- extrair componente local para o painel `Convites`, recebendo `sections`, `emptyState` e callback de revogacao.

Manter API, storage, refresh, `setDialog`, Share e navegacao no `ContactsScreen`.
