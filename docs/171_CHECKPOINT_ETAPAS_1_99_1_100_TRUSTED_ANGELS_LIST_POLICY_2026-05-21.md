# Checkpoint - Etapas 1.99 e 1.100 Trusted Angels List Policy

Data: 2026-05-21

## Escopo

Refatoracao pura da tela `Anjos de confianca`, dando continuidade as etapas 1.97 e 1.98. Esta rodada separou regras de merge/listagem de convites e vinculos sem alterar layout, textos, backend, storage, SOS, chamada ao vivo, release ou build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido no diff e ausencia de material sensivel.
- Eliane: QA local proporcional.
- Katia/Test Android Apps: criterio Android proporcional; ADB foi verificado, mas sem build/instalacao por ser refatoracao pura.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.99 - merge de convites

- Criada `src/features/invitations/trustedAngelsListPolicy.ts`.
- Extraida `mergeTrustedAngelInvitations()` para consolidar convites locais e remotos, esconder convites de contatos ja aceitos/revogados e manter ordenacao por criacao mais recente.
- `invitationFromApi()` passou a aceitar `nowMs` opcional para teste deterministico de expiracao, preservando o default com horario atual.

## Etapa 1.100 - listas de vinculos

- Extraida `buildTrustedAngelRelationshipLists()` para separar `linkedContacts` e `angelLinks` com os mesmos filtros aceitos/revogados ja usados pela tela.
- Extraida `splitTrustedAngelInvitationSections()` para separar convites validados e convites locais antigos, mantendo o contador usado no card.
- `app/contatos.tsx` permanece responsavel por estado React, sincronizacao real, compartilhamento, revogacao e navegacao.

## Validacoes

- `npm run test:trusted-angels-list`: aprovado.
- `npm run test:trusted-angels-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.
- `adb devices -l`: listou o Android `23129RA5FL` via Wi-Fi/mDNS em duas entradas do mesmo aparelho; nao houve instalacao nem interacao fisica.

## Decisao

- Sem build Android nesta rodada, porque a alteracao e policy pura e o build havia sido deixado para retomada posterior.
- Sem validacao visual/fisica, porque nao houve mudanca de layout, componente, fluxo operacional, camera, gravacao, WebRTC, backend real ou armazenamento.
- Proxima rodada recomendada: mais duas fatias puras em `app/contatos.tsx`, priorizando handlers de compartilhamento/revogacao ou refresh de anjos, sempre mantendo efeitos reais no componente.
