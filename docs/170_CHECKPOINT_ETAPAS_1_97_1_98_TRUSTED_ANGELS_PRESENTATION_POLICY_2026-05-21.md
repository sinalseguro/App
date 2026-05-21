# Checkpoint - Etapas 1.97 e 1.98 Trusted Angels Presentation Policy

Data: 2026-05-21

## Escopo

Refatoracao pura da tela `Anjos de confianca`, sem alterar layout, textos, fluxo de aceite, backend, storage, WebRTC, SOS, release ou build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: revisao dirigida para manter ausencia de segredos, logs sensiveis e trafego novo.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.97 - apresentacao de convites

- Extraidas regras puras de data curta, descricao, detalhe e normalizacao visual de convites para `src/features/invitations/trustedAngelsPresentationPolicy.ts`.
- `app/contatos.tsx` continua responsavel pela tela, estado React, sincronizacao, compartilhamento e revogacao real.
- Novo gate `npm run test:trusted-angels-presentation` cobre convites locais antigos, convites validados, expirados, aceitos e pendentes.

## Etapa 1.98 - apresentacao de vinculos de anjos

- Extraidas regras puras de status, nomes, detalhes, descricoes, resumos e banner principal de vinculos aceitos.
- Mantida a mesma mensagem para quem tem anjos, para quem e anjo de outra pessoa, para convite compartilhado e para estado sem login.
- O modulo novo usa imports `type-only` para evitar dependencia runtime desnecessaria.

## Validacoes

- `npm run test:trusted-angels-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.

## Decisao

- Sem build Android nesta rodada, conforme pausa solicitada para deixar o build para depois.
- Sem validacao fisica, porque a mudanca e policy pura de apresentacao e nao toca chamada, camera, gravacao, backend real, storage seguro ou UX nativa.
- Proxima rodada recomendada: continuar com fatias puras pequenas em `app/contatos.tsx`, priorizando merge/listagem de convites e vinculos, ou retomar build fisico se o ambiente Android estiver pronto.
