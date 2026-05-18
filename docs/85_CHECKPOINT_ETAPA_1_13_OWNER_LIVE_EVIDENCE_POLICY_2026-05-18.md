# Checkpoint Etapa 1.13 - politica pura de inicio da evidencia local do solicitante

Data: 2026-05-18
Escopo: app mobile Android-first, refatoracao interna da Home/SOS.

## Objetivo

Extrair da Home a decisao de quando iniciar a evidencia local da chamada ao vivo no aparelho solicitante, sem alterar comportamento, UX, layout, camera, WebRTC, backend, storage, auditoria ou logs operacionais.

## Implementado

- Criado `src/features/emergency-home/ownerLiveEvidencePolicy.ts`.
- A policy decide se `startOwnerLiveVideoEvidence()` deve ser acionado:
  - bloqueia quando o papel da chamada nao e `owner`;
  - bloqueia quando falta sessao remota;
  - bloqueia quando falta pacote local;
  - bloqueia quando falta stream local;
  - bloqueia quando o status da chamada ja esta `ended` ou `failed`;
  - permite quando ha owner, pacote, sessao, stream e status ativo.
- `app/index.tsx` continua responsavel por chamar `startOwnerLiveVideoEvidence()` e por todos os efeitos reais de camera, gravacao, WebRTC, evidencia, auditoria e logs.
- Criado `scripts/owner-live-evidence-policy.test.ts`.
- `package.json` passou a expor `npm run test:owner-live-evidence` e incluiu o gate em `npm test`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura e o gate dedicado.
- `README.md` atualizado na arquitetura da Home/SOS.

## Casos cobertos

- Papel `angel` nao inicia evidencia local do solicitante.
- Owner sem sessao remota nao inicia.
- Owner sem pacote local nao inicia.
- Owner sem stream local nao inicia.
- Chamada encerrada/falhada nao inicia.
- Owner conectado com dados atuais usa pacote/sessao atuais.
- Owner conectando com fallback usa pacote/sessao de fallback e preserva `callSessionId`.

## Seguranca e LGPD

- Mudanca restrita a regra pura/teste.
- Nao adiciona endpoint, permissao, rede, storage, payload persistido, log runtime, backend ou portal.
- A policy nao conhece token, SDP/ICE, `Authorization`, `id_token`, `encrypted_key`, URI/path de midia, payload P2P, coordenada ou hash bruto.
- A varredura dirigida encontrou apenas `console.log` em testes locais e referencias de gate ja existentes no smoke test.

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

Apos commit desta etapa, continuar a extrair regras puras de efeitos da Home/SOS ou executar validacao fisica Android se a proxima mudanca tocar camera, WebRTC, renderizacao ou fluxo de usuario.
