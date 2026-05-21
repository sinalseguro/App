# Checkpoint - Etapas 1.107 e 1.108 Trusted Angels Dialog Policy

Data: 2026-05-21

## Escopo

Refatoracao pura das decisoes de visibilidade de dialogs/paineis e da regra de acao de convite na tela `Anjos de confianca`. Esta rodada nao altera layout, textos publicos, backend, storage, Share, revogacao real, SOS, chamada ao vivo, release ou build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido no diff e ausencia de material sensivel.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.107 - visibilidade de dialogs e paineis

- Criada `src/features/invitations/trustedAngelsDialogPolicy.ts`.
- Extraida `buildTrustedAngelsDialogVisibility()` para centralizar booleans dos dialogs de convite, bloqueio de perfil, revogacoes e paineis de estado, prontidao, meus anjos, sou anjo e convites.
- `app/contatos.tsx` continua controlando estado React, clique, navegacao e handlers reais.

## Etapa 1.108 - acao de convite exibido

- Extraida `canShowTrustedAngelInvitationRevocationAction()` para manter revogacao visivel apenas em convites `pendente` ou `compartilhado`.
- Extraida `buildTrustedAngelInvitationCardKey()` para centralizar a chave visual de convites por origem/sincronizacao.
- Novo gate `npm run test:trusted-angels-dialog` cobre visibilidade, paineis, estados de convite com acao e chave do card.

## Validacoes

- `npm run test:trusted-angels-dialog`: aprovado.
- `npm run test:trusted-angels-dashboard`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e sem CPU; processo encerrado para nao ficar pendurado, comportamento ja conhecido nesta frente.

## Decisao

- Sem build Android nesta rodada por ser policy pura sem runtime nativo, sem mudanca visual e sem alteracao operacional de API/cache/Share.
- Proxima rodada recomendada: continuar com duas fatias puras, priorizando extracao de componentes locais pequenos da tela `Anjos de confianca` apenas se isso nao alterar hierarquia visual nem comportamento.
