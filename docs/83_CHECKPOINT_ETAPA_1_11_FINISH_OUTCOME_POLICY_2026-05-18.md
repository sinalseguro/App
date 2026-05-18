# Checkpoint Etapa 1.11 - politica pura do resultado final do SOS

Data: 2026-05-18
Escopo: app mobile Android-first, refatoracao interna da Home/SOS.

## Objetivo

Extrair da Home a decisao final do encerramento do chamado SOS sem alterar comportamento, layout, UX, fluxo de camera, WebRTC, backend, storage ou auditoria.

## Implementado

- Criado `src/features/emergency-home/finishOutcomePolicy.ts`.
- A policy recebe fatos ja calculados pelo orquestrador:
  - quantidade de assets anexados ao pacote;
  - presenca de video vivo anexado;
  - handoff de midia para chamada ao vivo;
  - falha de confirmacao remota;
  - presenca de `stopSerial`;
  - status final do stop da camera.
- `app/index.tsx` passou a usar `resolveFinishOutcomePolicy()` e continua responsavel pelos efeitos reais:
  - `updateOwnerLiveEvidence`;
  - `recordOwnerLiveAuditMarker`;
  - `persistFinishNoMediaDiagnostic`;
  - `setRecordingStatus`;
  - `showFinishProgress`.
- Criado `scripts/finish-outcome-policy.test.ts`.
- `package.json` passou a expor `npm run test:finish-outcome` e incluiu o gate em `npm test`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura e o gate dedicado.
- `README.md` atualizado na arquitetura da Home/SOS.

## Casos cobertos

- Video anexado e confirmacao remota OK.
- Video anexado e confirmacao remota pendente.
- Video ao vivo anexado mesmo sem asset refletido no pacote final.
- Handoff para chamada ao vivo sem video local anexado.
- `stopSerial` com `stopResult.status === "attached"` sem reflexo no cofre.
- `stopSerial` sem arquivo de video retornado.
- Encerramento sem `stopSerial` e sem video, preservando pacote local.

## Seguranca e LGPD

- Mudanca restrita a regra pura/teste.
- Nao adiciona endpoint, permissao, rede, storage, payload persistido, log runtime, backend ou portal.
- A policy nao conhece token, SDP/ICE, `Authorization`, `id_token`, `encrypted_key`, URI/path de midia, payload P2P, coordenada ou hash bruto.
- A varredura dirigida encontrou apenas `console.log` em testes locais e referencias de gate ja existentes no smoke test.

## Validacoes

- `npm run test:finish-outcome`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida `node-local-debug` (`Node 20.16.0`; release publico exige `>=22.13.0`).
- `git diff --check`: aprovado.
- `adb devices -l`: dois Androids fisicos detectados; o Redmi aparece tambem por transporte Wi-Fi/mDNS duplicado.

## Decisao

A fatia e considerada segura para commit. Nao houve build Android nem teste fisico porque a alteracao nao muda runtime operacional, camera, WebRTC, renderizacao, backend ou layout; a proxima alteracao operacional sensivel deve repetir validacao fisica Android.

## Proxima recomendacao

Continuar a refatoracao em fatias pequenas na Home/SOS. A proxima fatia recomendada e extrair uma policy pura para reduzir o bloco de preparacao/entrega da midia para chamada ao vivo, mantendo `prepareMediaForOwnerLiveCall`, camera, WebRTC e auditoria no orquestrador.
