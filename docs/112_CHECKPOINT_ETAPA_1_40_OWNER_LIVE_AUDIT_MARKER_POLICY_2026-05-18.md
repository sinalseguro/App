# Checkpoint - Etapa 1.40 owner live audit marker policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a montagem do payload de auditoria local do solicitante na chamada ao vivo, sem alterar envio real para API, identificacao de dispositivo, WebRTC, midia, cofre local, backend, storage ou layout.

## Alteracoes

- Criado `src/features/emergency-home/ownerLiveAuditMarkerPolicy.ts`.
- Criado gate focado `scripts/owner-live-audit-marker-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveOwnerLiveAuditMarkerInput()` dentro de `recordOwnerLiveAuditMarker()`.
- `recordOwnerLiveAuditMarker()` continua responsavel por obter o device id e chamar `recordLiveAuditMarker()`.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:owner-live-audit-marker`.

## Validacoes

- `npm run test:owner-live-audit-marker`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura de payload local. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Manter o ritmo de duas fatias por rodada. A proxima dupla recomendada deve continuar removendo regras puras pequenas de `app/index.tsx` e evitar tocar no fluxo operacional de chamada/midia enquanto nao houver demanda especifica.
