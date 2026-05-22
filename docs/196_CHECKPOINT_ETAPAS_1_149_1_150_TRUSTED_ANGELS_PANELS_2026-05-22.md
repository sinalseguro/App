# Checkpoint - Etapas 1.149 e 1.150 - Paineis de Anjos e Convites

Data: 2026-05-22

## Escopo

Rodada de refatoracao presentational em `app/contatos.tsx`, mantendo duas fatias pequenas por vez.

- Etapa 1.149: extrair os paineis visuais `Meus anjos` e `Sou anjo` para `TrustedAngelsRelationshipPanelContent`.
- Etapa 1.150: extrair o painel visual `Convites` para `TrustedAngelsInvitationPanelContent`.

## Alteracoes

- `app/contatos.tsx`
  - adiciona `TrustedAngelsEmptyStateView` e `renderTrustedAngelsEmptyIcon()`;
  - adiciona `TrustedAngelsRelationshipPanelContent` para listas de vinculos de anjo;
  - adiciona `TrustedAngelsInvitationPanelContent` para secoes de convites;
  - mantem `setDialog()` no `ContactsScreen`, passando apenas callbacks de intencao para os componentes;
  - preserva a revogacao real em `revokeContact()` e `revokeInvitation()`.
- `scripts/smoke-test.mjs`
  - passa a exigir os novos componentes locais;
  - passa a falhar se os novos paineis assumirem API, Share, AppState, storage, device binding, refresh, router, `setDialog`, criacao de convite ou revogacao real.

## Limites preservados

`ContactsScreen` continua responsavel por:

- gate de perfil antes de convite;
- refresh local/remoto com `Promise.allSettled`;
- cache local de vinculos aceitos;
- criacao, compartilhamento e revogacao real de convites;
- revogacao real de vinculos;
- navegacao real;
- `setDialog()`, `setPanel()`, estado React e dialogs;
- acesso a API, storage, device binding, `AppState` e `Share.share()`.

Os novos componentes recebem estado pronto e callbacks. Eles nao importam nem executam API, storage, Share, device binding, AppState, refresh, roteamento, `setDialog`, criacao de convite ou revogacao real.

## QA e seguranca

- Mudanca restrita a apresentacao local da tela `Anjos de confianca`.
- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- Contratos preservados: `Meus anjos` continua oferecendo revogacao somente para contato `accepted`; `Sou anjo` permanece sem acao de revogacao; `Convites` continua permitindo revogacao somente quando `canShowTrustedAngelInvitationRevocationAction()` autoriza.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada, telefone, nome real novo ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados: imports/handlers ja existentes no `ContactsScreen` e anchors do smoke.

## Validacoes

Aprovadas:

- `npm run test:trusted-angels-panel`
- `npm run test:trusted-angels-dialog`
- `npm run test:trusted-angels-action`
- `npm run test:trusted-angels-refresh`
- `node scripts/smoke-test.mjs`
- `npm run lint`
- `npm run typecheck`
- `npm run private:android:readiness`
- `npm test`
- `git diff --check`

Observacoes:

- A primeira execucao dos testes focados no sandbox falhou por `EPERM` no pipe temporario do `tsx` em `/var/folders/...`; os mesmos testes foram rerodados fora do sandbox e passaram.
- `npm run private:android:readiness` manteve a pendencia local ja conhecida: Node 20.16.0 abaixo do requisito de release publica, aceitavel para build privado debug.
- Sem build/instalacao Android porque a fatia e presentational e nao altera runtime fisico, UX nativa, camera, microfone, gravacao, WebRTC real, storage de midia, cofre ou portal.

## Proxima recomendacao

`app/contatos.tsx` ficou substancialmente mais organizado. Antes de tocar areas sensiveis como `app/index.tsx`, cofre, player ou midia nativa, a proxima rodada deve fazer uma microtriagem de risco e escolher entre:

- encerrar `app/contatos.tsx` com pequenos ajustes finais de organizacao local; ou
- migrar para uma area menos sensivel que SOS/midia, mantendo o mesmo padrao de duas fatias.
