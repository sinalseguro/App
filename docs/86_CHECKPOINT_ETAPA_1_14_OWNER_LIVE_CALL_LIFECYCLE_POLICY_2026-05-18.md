# Checkpoint Etapa 1.14 - politica pura do ciclo da chamada owner

Data: 2026-05-18
Escopo: app mobile Android-first, refatoracao interna da Home/SOS.

## Objetivo

Extrair da Home a decisao do ciclo `connected`, `failed` e `ended` da chamada ao vivo do solicitante, sem alterar comportamento, UX, layout, camera, WebRTC, backend, storage, auditoria ou logs operacionais.

## Implementado

- Ampliado `src/features/emergency-home/ownerLiveEvidencePolicy.ts` com `resolveOwnerLiveCallLifecycle()`.
- A policy decide:
  - se o evento deve ser ignorado por nao ser `owner`;
  - se falta sessao remota;
  - se o status nao exige acao;
  - como registrar evidencia quando a chamada conecta;
  - como registrar falha;
  - como registrar encerramento.
- `app/index.tsx` continua responsavel pelos efeitos reais:
  - limpar `ownerAutoCallStartedSessionIdsRef`;
  - chamar `stopOwnerLiveVideoEvidence("call_finished")`;
  - gerar timestamp local;
  - chamar `updateOwnerLiveEvidence()`.
- `scripts/owner-live-evidence-policy.test.ts` passou a cobrir a nova decisao.
- `scripts/smoke-test.mjs` passou a exigir a policy pura de lifecycle owner.

## Casos cobertos

- Papel diferente de `owner` nao aplica ciclo owner.
- Owner sem sessao remota nao aplica.
- Status nao acionavel nao aplica.
- `connected` com gravacao local ativa registra `recording`.
- `connected` sem gravacao local ativa registra `metadata_only`/`transmitting`.
- `failed` limpa tentativa, solicita parada da evidencia e registra falha.
- `ended` limpa tentativa, solicita parada da evidencia e registra encerramento.

## Seguranca e LGPD

- Mudanca restrita a regra pura/teste.
- Nao adiciona endpoint, permissao, rede, storage, payload persistido, log runtime, backend ou portal.
- A policy nao conhece token, SDP/ICE, `Authorization`, `id_token`, `encrypted_key`, URI/path de midia, payload P2P, coordenada ou hash bruto.
- A varredura dirigida deve continuar aceitando apenas `console.log` em testes/gates locais.

## Validacoes

- `npm run test:owner-live-evidence`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida `node-local-debug` (`Node 20.16.0`; release publico exige `>=22.13.0`).
- `git diff --check`: aprovado.
- `adb devices -l`: um Android fisico visivel no momento final (`0123456789ABCDEF`); sem validacao fisica porque a fatia nao altera runtime operacional.

## Decisao

A fatia e segura por ser refatoracao pura e por preservar todos os efeitos no orquestrador. Nao houve build Android nem teste fisico porque nao houve alteracao de runtime operacional, camera, WebRTC, renderizacao ou backend.

## Proxima recomendacao

Apos commit desta etapa, revisar se a Home/SOS ainda possui outro bloco de regra pura pequeno. Se a proxima mudanca tocar fluxo real de chamada, camera, renderizacao ou UX, repetir build e validacao fisica Android.
