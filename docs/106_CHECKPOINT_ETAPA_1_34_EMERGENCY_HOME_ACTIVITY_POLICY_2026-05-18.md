# Checkpoint - Etapa 1.34 emergency home activity policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao de atividade visual e wake lock emergencial da Home/SOS, sem alterar estado React, camera, gravacao, WebRTC, backend, storage, renderizacao de componentes ou layout.

## Alteracoes

- Criado `src/features/emergency-home/emergencyHomeActivityPolicy.ts`.
- Criado gate focado `scripts/emergency-home-activity-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveEmergencyHomeActivityPresentation()` para:
  - manter tela acordada durante operacao emergencial;
  - marcar estado visual ativo da Home;
  - decidir faixa ativa/inativa de status.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:emergency-home-activity`.

## Validacoes

- `npm run test:emergency-home-activity`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura com a mesma logica booleana ja existente. Validacao fisica/performance continua reservada para mudancas operacionais em WebRTC, camera, chamada, gravacao, backend ou UX nativa.

## Proxima recomendacao

Encerrar esta rodada automatizada de dois blocos e seguir depois com nova rodada de duas fatias, priorizando extracoes puras restantes da Home/SOS. Antes de tocar runtime operacional, fazer build/instalacao e validacao fisica nos Androids conectados.
