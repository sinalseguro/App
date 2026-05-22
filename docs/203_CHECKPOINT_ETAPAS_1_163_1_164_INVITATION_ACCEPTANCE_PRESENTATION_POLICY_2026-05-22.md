# Checkpoint - Etapas 1.163 e 1.164 - Policy visual de aceite de convite

Data: 2026-05-22

## Escopo

Refatoracao presentational da tela `Convite recebido`, sem alterar aceite real, token, backend, cache local, navegacao, login, perfil, LGPD ou fluxo UX.

## Executado

- Etapa 1.163: criada `src/features/invitations/invitationAcceptancePresentationPolicy.ts`.
- Etapa 1.164: adicionados `scripts/invitation-acceptance-presentation-policy.test.ts`, script `test:invitation-acceptance-presentation` e anchors no `scripts/smoke-test.mjs`.
- `app/convite.tsx` passou a consumir a policy para:
  - titulo/subtitulo publicos;
  - status inicial;
  - titulo do banner do convite;
  - aviso de limite de seguranca;
  - banner de aceite confirmado;
  - labels e habilitacao visual dos botoes;
  - visibilidade dos botoes `Configurar perfil` e `Ver meus vínculos`.

## Limites preservados

- A tela continua responsavel por `useFocusEffect`, `Linking.useURL`, parametros de rota, estado React, `router.push`, validacao de token, aceite no backend, cache do vinculo e limpeza do token pendente.
- O fluxo real ainda revalida o token no backend antes de aceitar, chama `acceptBackendInvitation`, grava o relacionamento aceito no cache local e limpa o convite pendente.
- A policy nao importa API, storage, Expo, React, router, tema visual, Share, device binding nem componentes.
- Nenhum dado pessoal novo, coordenada, telefone, token claro, path local, payload P2P, SDP, ICE ou conteudo de midia foi introduzido.

## Validacoes

- `npm run test:invitation-acceptance-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado; manteve apenas a pendencia local conhecida de Node 20.16.0 para release publico.
- `npm test`: aprovado.

## Decisao

Nao houve build Android nem instalacao fisica nesta rodada porque a mudanca e presentational e nao altera runtime nativo, midia, WebRTC, permissao, camera, microfone, cofre, player, API ou portal.

## Proxima recomendacao

Parar `app/convite.tsx` neste ponto. A proxima rodada deve avaliar outra tela pequena de baixo risco, com preferencia por policy/apresentacao pura. Evitar tocar `app/index.tsx`, midia, WebRTC, cofre ou API sem necessidade funcional clara.
