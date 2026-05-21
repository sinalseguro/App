# Checkpoint - Etapas 1.101 e 1.102 Trusted Angels Action Policy

Data: 2026-05-21

## Escopo

Refatoracao pura dos handlers da tela `Anjos de confianca`, mantendo `app/contatos.tsx` como dono dos efeitos reais. Esta rodada nao altera layout, textos publicos, backend, storage, Share, revogacao real, SOS, chamada ao vivo, release ou build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido no diff e ausencia de material sensivel.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.101 - inicio e falha do compartilhamento de convite

- Criada `src/features/invitations/trustedAngelsActionPolicy.ts`.
- Extraida `resolveTrustedAngelShareStart()` para decidir bloqueio por perfil, label saneado e status inicial.
- Extraida `resolveTrustedAngelShareFailure()` para centralizar sessao expirada, fechamento de modal e mensagem de erro.
- `app/contatos.tsx` continua executando `createLocalInvitation()`, `Share.share()`, `markInvitationShared()` e `refreshAngels()`.

## Etapa 1.102 - planos de revogacao

- Extraida `buildTrustedAngelInvitationRevocationPlan()` para decidir revogacao backend/local do convite.
- Extraida `buildTrustedAngelContactRevocationPlan()` para centralizar ids e status de revogacao de vinculo.
- Extraida `resolveTrustedAngelActionFailure()` para fallback de falhas de revogacao.
- `app/contatos.tsx` continua executando `apiClient.revokeInvitation()`, `revokeLocalInvitation()`, `apiClient.revokeTrustedContact()` e `removeCachedTrustedContactRelationship()`.

## Validacoes

- `npm run test:trusted-angels-action`: aprovado.
- `npm run test:trusted-angels-list`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.

## Decisao

- Sem build Android nesta rodada por ser policy pura sem runtime nativo, sem mudanca visual e sem alteracao operacional de API/Share/revogacao.
- Proxima rodada recomendada: continuar com duas fatias puras em `app/contatos.tsx`, priorizando refresh/sincronizacao de anjos ou abertura de painel/menu, sempre mantendo efeitos reais no componente.
