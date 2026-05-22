# Checkpoint - Etapas 1.157 e 1.158 - Cabecalho e Dialog de Convites de Anjos

Data: 2026-05-22

## Escopo

Rodada SS de refatoracao presentational em `app/contatos.tsx`, mantendo duas fatias pequenas por vez.

- Etapa 1.157: extrair o cabecalho/menu da tela para `TrustedAngelsHeaderMenu`.
- Etapa 1.158: extrair o dialog `Convites` para `TrustedAngelsInvitationsDialog`.

## Alteracoes

- `app/contatos.tsx`
  - adiciona `TrustedAngelsHeaderMenu` para encapsular `AppTopBar`, backdrop e `EmergencySettingsDrawer`;
  - adiciona `TrustedAngelsInvitationsDialog` para encapsular o dialog visual de convites;
  - mantem `openMenuRoute`, `setMenuOpen`, navegacao real, `setPanel`, `setDialog`, revogacao real, refresh, API, AppState, Share e estado React no `ContactsScreen`.
- `scripts/smoke-test.mjs`
  - passa a exigir `TrustedAngelsHeaderMenu` e `TrustedAngelsInvitationsDialog`;
  - passa a falhar se esses wrappers assumirem API, Share nativo, AppState, storage, device binding, refresh, navegacao real, criacao/revogacao real, `setDialog()`, `setPanel()` ou `setMenuOpen()`.

## Limites preservados

`ContactsScreen` continua responsavel por:

- estado, refs, ciclo de vida, `useFocusEffect`, intervalo de refresh e `AppState`;
- gate de perfil antes de convite;
- refresh local/remoto com API e cache;
- `Share.share`, device binding, criacao de convite e revogacoes reais;
- `router.push`, `openMenuRoute`, `handleDashboardTileAction`, `setDialog()`, `setPanel()`, `setMenuOpen()` e estado React.

Os novos wrappers recebem callbacks injetados e estado visual pronto. Eles nao executam API, storage, Share, device binding, AppState, refresh, navegacao real, criacao de convite, revogacao real ou setters de estado.

## QA e seguranca

- Mudanca restrita a apresentacao local da tela `Anjos de confianca`.
- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- Contratos preservados: navegacao continua resolvida por `openMenuRoute`; revogacao de convite continua passando por `setDialog({ invitation, kind: "revoke_invitation" })`.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada, telefone, nome real novo ou conteudo de midia.
- Revisao Cristine/Eliane confirmou que as duas fatias estao seguras e recomendou parar a tela de Anjos por enquanto: a tela ja esta bem fatiada em apresentacao, e novas extracoes como `TrustedAngelsScreenBody` ou `TrustedAngelsDialogStack` teriam ganho baixo e aumentariam prop drilling/fragilidade do smoke.

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

Parar a refatoracao presentational de `app/contatos.tsx` neste ponto. A proxima rodada deve migrar para outra area de baixo risco ou, se Roberto preferir voltar a funcionalidades, aguardar uma mudanca operacional clara para justificar build Android e validacao fisica.
