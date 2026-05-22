# Checkpoint - Etapas 1.111 e 1.112 Trusted Angels Derived Refresh Policy

Data: 2026-05-21

## Escopo

Refatoracao pura de estados derivados e ciclo de refresh da tela `Anjos de confianca`. Esta rodada nao altera layout, textos publicos, backend, storage, Share, revogacao real, SOS, chamada ao vivo, release ou build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido no diff e ausencia de material sensivel.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.111 - contadores aceitos derivados

- Extraida `buildTrustedAngelsAcceptedCounts()` em `trustedAngelsDashboardPolicy`.
- `app/contatos.tsx` deixou de filtrar localmente os vinculos aceitos para montar o resumo visual.
- O resultado preserva os mesmos textos e contadores dos cards `Meus anjos` e `Sou anjo`.

## Etapa 1.112 - ciclo de refresh por AppState

- Extraida `TRUSTED_ANGELS_REFRESH_INTERVAL_MS` para manter o intervalo de 15 segundos versionado em policy.
- Extraida `shouldRefreshTrustedAngelsOnAppState()` para centralizar a decisao de atualizar apenas quando o app volta para `active`.
- `app/contatos.tsx` continua dono de `setInterval`, `AppState.addEventListener()` e chamada real de refresh.

## Validacoes

- `npm run test:trusted-angels-dashboard`: aprovado.
- `npm run test:trusted-angels-refresh`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e sem CPU; processo encerrado para nao ficar pendurado, comportamento ja conhecido nesta frente.

## Decisao

- Sem build Android nesta rodada por ser policy pura sem runtime nativo, sem mudanca visual e sem alteracao operacional de API/cache/Share.
- Proxima rodada recomendada: avaliar se `app/contatos.tsx` ainda comporta uma ultima extracao pequena; se nao, migrar a refatoracao para outra tela/area com maior ganho.
