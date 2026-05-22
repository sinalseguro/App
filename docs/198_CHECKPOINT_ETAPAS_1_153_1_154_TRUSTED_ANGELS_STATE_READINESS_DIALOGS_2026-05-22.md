# Checkpoint - Etapas 1.153 e 1.154 - Dialogs de Estado e Prontidao de Anjos

Data: 2026-05-22

## Escopo

Rodada de refatoracao presentational em `app/contatos.tsx`, mantendo duas fatias pequenas por vez.

- Etapa 1.153: extrair o dialog visual de estado/resumo para `TrustedAngelsStateDialog`.
- Etapa 1.154: extrair o dialog visual de prontidao para `TrustedAngelsReadinessDialog`.

## Alteracoes

- `app/contatos.tsx`
  - adiciona `TrustedAngelsStateDialog` para renderizar o resumo visual baseado em `notice` e `status`;
  - adiciona `TrustedAngelsReadinessDialog` para renderizar o dialog de prontidao com `TrustedAngelsReadinessPanelContent`;
  - mantem `setPanel(null)`, calculo de `notice`, calculo de `readinessState`, refresh, API, AppState, Share e estado React no `ContactsScreen`.
- `scripts/smoke-test.mjs`
  - passa a exigir os novos dialogs;
  - passa a falhar se os dialogs de estado/prontidao assumirem API, Share nativo, AppState, storage, device binding, refresh, roteamento, criacao de convite, revogacao real, `setDialog()` ou `setPanel()`.

## Limites preservados

`ContactsScreen` continua responsavel por:

- gate de perfil antes de convite;
- refresh local/remoto com API e cache;
- `AppState`, device binding, Share nativo e navegacao real;
- criacao e revogacao real de convites;
- revogacao real de vinculos;
- `setDialog()`, `setPanel()`, estado React e handlers.

Os novos dialogs recebem estado visual pronto e callback de fechamento. Eles nao importam nem executam API, storage, Share, device binding, AppState, refresh, roteamento, criacao de convite, revogacao real, `setDialog()` ou `setPanel()`.

## QA e seguranca

- Mudanca restrita a apresentacao local da tela `Anjos de confianca`.
- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- Contratos preservados: titulo dinamico do estado, mensagem de `notice`, resumo por `StatusBanner`, titulo `Prontidão` e acao `Fechar`.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada, telefone, nome real novo ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados: imports/handlers ja existentes no `ContactsScreen` e anchors do smoke.

## Validacoes

Aprovadas:

- `npm run test:trusted-angels-dialog`
- `npm run test:trusted-angels-panel`
- `npm run test:trusted-angels-dashboard`
- `node scripts/smoke-test.mjs`
- `npm run lint`
- `npm run typecheck`
- `npm run private:android:readiness`
- `npm test`
- `git diff --check`

Observacoes:

- `npm run private:android:readiness` manteve a pendencia local ja conhecida: Node 20.16.0 abaixo do requisito de release publica, aceitavel para build privado debug.
- Sem build/instalacao Android porque a fatia e presentational e nao altera runtime fisico, UX nativa, camera, microfone, gravacao, WebRTC real, storage de midia, cofre, player ou portal.

## Proxima recomendacao

A proxima dupla segura, se a microtriagem confirmar ganho real, e extrair os wrappers dos dialogs `Meus anjos autorizados` e `Sou anjo de`, mantendo callbacks e revogacao real no `ContactsScreen`.
