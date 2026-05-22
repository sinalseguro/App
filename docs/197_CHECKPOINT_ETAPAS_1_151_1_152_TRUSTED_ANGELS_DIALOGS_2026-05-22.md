# Checkpoint - Etapas 1.151 e 1.152 - Dialogs visuais de Anjos

Data: 2026-05-22

## Escopo

Rodada de refatoracao presentational em `app/contatos.tsx`, mantendo duas fatias pequenas por vez.

- Etapa 1.151: extrair os dialogs visuais de convite e bloqueio de perfil para `TrustedAngelsInviteDialog` e `TrustedAngelsProfileBlockDialog`.
- Etapa 1.152: extrair os dialogs visuais de confirmacao de revogacao para `TrustedAngelsRevokeInvitationDialog` e `TrustedAngelsRevokeContactDialog`.

## Alteracoes

- `app/contatos.tsx`
  - adiciona `TrustedAngelsInviteDialog` para renderizar o formulario do convite;
  - adiciona `TrustedAngelsProfileBlockDialog` para orientar configuracao de perfil antes do convite;
  - adiciona `TrustedAngelsRevokeInvitationDialog` para confirmacao visual de revogacao de convite;
  - adiciona `TrustedAngelsRevokeContactDialog` para confirmacao visual de revogacao de vinculo;
  - mantem `shareInvitation()`, `revokeInvitation()`, `revokeContact()`, `router.push("/perfis")` e `setDialog()` no `ContactsScreen`.
- `scripts/smoke-test.mjs`
  - passa a exigir os novos componentes locais;
  - passa a falhar se os novos dialogs assumirem API, Share nativo, AppState, storage, device binding, refresh, roteamento direto, criacao de convite, revogacao real ou `setDialog()`.

## Limites preservados

`ContactsScreen` continua responsavel por:

- gate de perfil antes de convite;
- criacao local/backend e compartilhamento real do convite;
- revogacao local/backend de convite;
- revogacao backend/cache de contato aceito;
- navegacao real para `/perfis`;
- `setDialog()`, `setPanel()`, estado React e handlers;
- acesso a API, storage, device binding, `AppState` e `Share.share()`.

Os novos dialogs recebem textos, labels, valores e callbacks. Eles nao importam nem executam API, storage, Share, device binding, AppState, refresh, roteamento direto, criacao de convite, revogacao real ou `setDialog()`.

## QA e seguranca

- Mudanca restrita a apresentacao local da tela `Anjos de confianca`.
- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- Contratos preservados: convite segue com `maxLength={60}`, mensagem publica de minimizacao de dados, bloqueio de perfil antes de convidar, `autoClose: false` nas acoes reais e `tone: "danger"` nas revogacoes.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada, telefone, nome real novo ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados: imports/handlers ja existentes no `ContactsScreen` e anchors do smoke.

## Validacoes

Aprovadas:

- `npm run test:trusted-angels-dialog`
- `npm run test:trusted-angels-action`
- `npm run test:trusted-angels-panel`
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

Fazer uma microtriagem antes da proxima rodada. O alvo preferencial segue sendo um ajuste local de baixo risco em `app/contatos.tsx` somente se houver ganho claro; caso contrario, migrar para uma area menos sensivel que SOS, cofre, player, WebRTC e midia nativa, mantendo duas fatias por vez.
