# Checkpoint - Etapas 1.113 e 1.114 Trusted Angels Navigation e Dialog Labels

Data: 2026-05-21

## Escopo

Refatoracao pura da tela `Anjos de confianca`, mantendo layout, textos publicos, backend, storage, Share, revogacao real, SOS, chamada ao vivo, release e build Android inalterados.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido no diff e ausencia de material sensivel.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.113 - navegacao do menu

- Criada `trustedAngelsNavigationPolicy`.
- Extraida `resolveTrustedAngelsMenuRouteTarget()` para centralizar a decisao especial de abrir `/arquivos` com parametro de painel.
- `app/contatos.tsx` continua responsavel pelo efeito real de navegacao via `router.push()`.
- Novo gate `npm run test:trusted-angels-navigation` foi adicionado ao `npm test`.

## Etapa 1.114 - labels de acoes dos dialogs

- `trustedAngelsDialogPolicy` passou a expor `buildTrustedAngelsDialogActionLabels()`.
- Centralizados os labels de criar convite, revogar convite e revogar vinculo durante estado ocupado.
- Foram preservados os mesmos textos publicos ja existentes.
- `app/contatos.tsx` continua responsavel por renderizar dialogs e executar handlers reais.

## Validacoes

- `npm run test:trusted-angels-navigation`: aprovado.
- `npm run test:trusted-angels-dialog`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e sem CPU; processo encerrado para nao ficar pendurado, comportamento ja conhecido nesta frente.

## Decisao

- Sem build Android nesta rodada por ser policy pura sem runtime nativo, sem mudanca visual e sem alteracao operacional de API/cache/Share.
- Proxima rodada recomendada: fazer mais uma dupla pequena apenas se houver decisao pura clara em `app/contatos.tsx`; caso contrario, migrar a refatoracao para outra tela/area com maior ganho.
