# Checkpoint Etapa 1.12 - politica pura de handoff de midia ao vivo

Data: 2026-05-18
Escopo: app mobile Android-first, refatoracao interna da Home/SOS.

## Objetivo

Reduzir a regra inline da Home que decide se a midia local deve ser preparada para chamada ao vivo com anjo, sem alterar comportamento, UX, layout, camera, WebRTC, backend, storage, auditoria ou logs operacionais.

## Implementado

- Criado `src/features/emergency-home/mediaHandoffPolicy.ts`.
- A policy decide quando a preparacao de midia deve ser bloqueada:
  - sem pacote ativo;
  - camera/stop ja bloqueado;
  - plataforma web;
  - captura local nao solicitada nas preferencias.
- A policy tambem concentra a apresentacao pura dos dois marcos operacionais:
  - inicio do handoff (`owner_media_handoff_start`, `recording`);
  - conclusao do handoff (`owner_media_handoff_complete`, `metadata_only`/`transmitting`).
- `app/index.tsx` continua responsavel por todos os efeitos reais:
  - `signalMediaRecorderStop`;
  - `waitForMediaRecorderRelease`;
  - `setCaptureStopLocked`;
  - `setMediaRecorderPackageId`;
  - `setMediaStopPendingFlag`;
  - `updateOwnerLiveEvidence`;
  - `recordOwnerLiveAuditMarker`;
  - `appendMediaOperationalLog`.
- Criado `scripts/media-handoff-policy.test.ts`.
- `package.json` passou a expor `npm run test:media-handoff` e incluiu o gate em `npm test`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura e o gate dedicado.
- `README.md` atualizado na arquitetura da Home/SOS.

## Casos cobertos

- Sem pacote ativo: bloqueia preparacao.
- Stop/captura ja bloqueados: bloqueia preparacao.
- Plataforma web: bloqueia preparacao.
- Captura local desativada nas preferencias: bloqueia preparacao.
- Android/iOS com pacote ativo, captura livre e preferencia ativa: permite preparacao com marcadores preservados.

## Seguranca e LGPD

- Mudanca restrita a regra pura/teste.
- Nao adiciona endpoint, permissao, rede, storage, payload persistido, log runtime, backend ou portal.
- A policy nao conhece token, SDP/ICE, `Authorization`, `id_token`, `encrypted_key`, URI/path de midia, payload P2P, coordenada ou hash bruto.
- A varredura dirigida encontrou apenas `console.log` em testes locais e referencias de gate ja existentes no smoke test.

## Validacoes

- `npm run test:media-handoff`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida `node-local-debug` (`Node 20.16.0`; release publico exige `>=22.13.0`).
- `git diff --check`: aprovado.
- `adb devices -l`: dois Androids fisicos detectados; o Redmi aparece tambem por transporte Wi-Fi/mDNS duplicado.

## Decisao

A fatia e segura por ser refatoracao pura e por preservar todos os efeitos no orquestrador. Nao houve build Android nem teste fisico porque nao houve alteracao de runtime operacional, camera, WebRTC, renderizacao ou backend.

## Proxima recomendacao

Apos commit desta etapa, continuar em fatia pequena sobre outro bloco puro da Home/SOS ou executar validacao fisica Android se a proxima mudanca tocar camera, WebRTC, chamada ao vivo, renderizacao ou fluxo de usuario.
