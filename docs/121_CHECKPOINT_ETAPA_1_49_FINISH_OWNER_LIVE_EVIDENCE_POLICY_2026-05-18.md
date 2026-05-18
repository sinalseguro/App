# Checkpoint - Etapa 1.49 finish owner live evidence policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a montagem da atualizacao final de evidencia local do owner no encerramento do SOS, sem alterar persistencia real, backend, recorder, WebRTC, cofre, auditoria, storage ou layout.

## Alteracoes

- Criado `src/features/emergency-home/finishOwnerLiveEvidencePolicy.ts`.
- Criado gate focado `scripts/finish-owner-live-evidence-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveFinishOwnerLiveEvidenceUpdate()` antes de `updateOwnerLiveEvidence()`.
- A policy centraliza:
  - `endedAt`;
  - `localEvidenceStatus`;
  - `packageId`;
  - `status` derivado do mesmo estado local final.
- Os efeitos reais continuam em `app/index.tsx`: chamada assíncrona para `updateOwnerLiveCallEvidenceRecord()` e fallback seguro quando nao ha sessao remota.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:finish-owner-live-evidence`.

## Validacoes

- `npm run test:finish-owner-live-evidence`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

ADB confirmou os Androids conectados no inicio da rodada, mas nao houve build, instalacao ou perfil Android porque a mudanca e uma policy pura. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Fechar a segunda fatia da rodada extraindo o marcador final de auditoria owner, mantendo `recordOwnerLiveAuditMarker()` e obtencao de device id em `app/index.tsx`.
