# Checkpoint - Etapa 1.74 owner live audit marker actions policy

Data: 2026-05-20

## Status

Refatoracao pura implementada e validada.

## Escopo

Consolidar em policy pura a decisao de registrar marcador de auditoria owner, mantendo device binding e envio do marcador no componente.

## Alteracoes

- Criado `src/features/emergency-home/ownerLiveAuditMarkerActionsPolicy.ts`.
- Criada funcao `resolveOwnerLiveAuditMarkerActions()`.
- `app/index.tsx` passou a usar a policy em `recordOwnerLiveAuditMarker()`.
- O componente continua responsavel por:
  - chamar `deviceBindingService.getRegisteredApiDeviceId()`;
  - montar payload por `resolveOwnerLiveAuditMarkerInput()`;
  - chamar `recordLiveAuditMarker()`.
- Criado `scripts/owner-live-audit-marker-actions-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:owner-live-audit-marker-actions`: aprovado.
- `npm run test:owner-live-audit-marker`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida do Node 20.16.0.
- `npm run typecheck`: sem erro emitido, mas travou sem CPU e foi encerrado para nao deixar processo pendurado.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, `Authorization`, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Seguranca e privacidade

- Sem novo storage, endpoint, permissao, rede, payload persistido novo, backend, portal ou release.
- A policy nao busca device id e nao registra auditoria; apenas bloqueia marcador sem `remoteSessionId`.
- Payload de auditoria continua montado por policy ja existente, com `role: "owner"` e campos controlados.

## Android fisico

Sem build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Proxima dupla deve continuar pequena ou, se entrar em `startOwnerLiveVideoEvidence()`, deve ser tratada como fatia mais sensivel com validacao fisica proporcional.
