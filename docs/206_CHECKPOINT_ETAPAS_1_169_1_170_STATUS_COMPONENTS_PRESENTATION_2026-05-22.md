# Checkpoint - Etapas 1.169 e 1.170 - Status components presentation

Data: 2026-05-22

## Status

Refatoracao presentational implementada, validada e pronta para continuidade.

## Escopo executado

- Etapa 1.169: extraida `src/components/permissionGatePresentationPolicy.ts` para concentrar labels de status do `PermissionGate`.
- Etapa 1.170: extraida `src/components/inviteCardPresentationPolicy.ts` para concentrar labels, tons e chaves de icone do `InviteCard`.
- `PermissionGate` continua apenas renderizando titulo, texto e status ja resolvido pela policy.
- `InviteCard` continua apenas renderizando card, callback injetado e icone visual conforme status resolvido pela policy.

## Limites preservados

- Sem alteracao de layout, navegacao, permissao real, localizacao, convite real, aceite, revogacao, autenticacao, SOS, WebRTC, cofre, player, backend, portal ou release.
- Sem novo storage, endpoint, permissao, coleta, persistencia, log sensivel, token, chave, telefone, coordenada, path local ou conteudo de midia.
- As telas consumidoras continuam responsaveis pelos efeitos reais: `app/configuracoes.tsx` por permissoes reais e `app/contatos.tsx` por convites/vinculos/revogacoes.

## Gates adicionados

- `scripts/status-components-presentation-policy.test.ts` valida labels, tons, chaves de icone e ausencia de acoplamento com React Native, tema, icones, API, storage, Share ou roteamento nas policies.
- `scripts/smoke-test.mjs` agora exige as duas policies e bloqueia regressao para efeitos reais ou dependencias visuais dentro das policies puras.
- `package.json` inclui `test:status-components-presentation` na suite principal.

## Validacoes

- `npm run test:status-components-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado; pendencia local conhecida de Node 20.16.0 versus requisito publico >=22.13.0.
- `git diff --check`: aprovado.

## Decisao

Sem build/instalacao Android nesta rodada porque a alteracao e puramente presentational e nao altera runtime nativo, permissoes reais, chamada real, camera, microfone, cofre, player ou fluxo de midia.

## Proxima recomendacao

Continuar a refatoracao em duas fatias pequenas, priorizando outra superficie isolada. Antes de tocar `AppTopBar`, `_layout`, `configuracoes`, `contatos`, SOS/WebRTC ou cofre real, fazer nova avaliacao de risco e ganho.
