# Checkpoint - Etapas 1.155 e 1.156 - Dialogs de Vinculos de Anjos

Data: 2026-05-22

## Escopo

Rodada de refatoracao presentational em `app/contatos.tsx`, mantendo duas fatias pequenas por vez.

- Etapa 1.155: extrair o dialog `Meus anjos autorizados` para `TrustedAngelsOwnerLinksDialog`.
- Etapa 1.156: extrair o dialog `Sou anjo de` para `TrustedAngelsAngelLinksDialog`.

## Alteracoes

- `app/contatos.tsx`
  - adiciona `TrustedAngelsOwnerLinksDialog` para renderizar o dialog de vinculos onde a pessoa protegida ve os anjos autorizados;
  - adiciona `TrustedAngelsAngelLinksDialog` para renderizar o dialog onde o anjo ve quem esta protegendo;
  - reutiliza `TrustedAngelsRelationshipPanelContent` para manter um unico componente visual dos vinculos;
  - mantem `setPanel(null)`, `setDialog(...)`, revogacao real, refresh, API, AppState, Share e estado React no `ContactsScreen`.
- `scripts/smoke-test.mjs`
  - passa a exigir os novos dialogs;
  - passa a falhar se os dialogs de vinculos assumirem API, Share nativo, AppState, device binding, refresh, roteamento, criacao de convite, revogacao real, `setDialog()` ou `setPanel()`.

## Limites preservados

`ContactsScreen` continua responsavel por:

- gate de perfil antes de convite;
- refresh local/remoto com API e cache;
- `AppState`, device binding, Share nativo e navegacao real;
- criacao e revogacao real de convites;
- revogacao real de vinculos;
- `setDialog()`, `setPanel()`, estado React e handlers.

Os novos dialogs recebem estado visual pronto e callbacks injetados. Eles nao importam nem executam API, storage, Share, device binding, AppState, refresh, roteamento, criacao de convite, revogacao real, `setDialog()` ou `setPanel()`.

## QA e seguranca

- Mudanca restrita a apresentacao local da tela `Anjos de confianca`.
- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- Contratos preservados: a pessoa protegida continua podendo iniciar revogacao somente por callback injetado pela tela; o anjo continua apenas visualizando quem protege nesse dialog.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada, telefone, nome real novo ou conteudo de midia.
- Revisao Cristine/Eliane confirmou que a extracao e segura enquanto permanecer puramente apresentacional.

## Validacoes

Aprovadas:

- `node scripts/smoke-test.mjs`
- `npm run test:trusted-angels-panel`
- `npm run test:trusted-angels-dialog`
- `npm run test:trusted-angels-action`
- `npm run lint`
- `npm run typecheck`
- `npm run private:android:readiness`
- `npm test`
- `git diff --check`

Observacoes:

- `npm run private:android:readiness` manteve a pendencia local ja conhecida: Node 20.16.0 abaixo do requisito de release publica, aceitavel para build privado debug.
- Sem build/instalacao Android porque a fatia e presentational e nao altera runtime fisico, UX nativa, camera, microfone, gravacao, WebRTC real, storage de midia, cofre, player ou portal.

## Proxima recomendacao

Antes de mexer em SOS, WebRTC, midia, cofre ou player, fazer uma microtriagem do restante de `app/contatos.tsx` e seguir apenas se houver mais duas fatias presentational claras. Se nao houver ganho seguro, migrar a proxima rodada para outra tela com baixo risco e manter os fluxos operacionais intactos.
