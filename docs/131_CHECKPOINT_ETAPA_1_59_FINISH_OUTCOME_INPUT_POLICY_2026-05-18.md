# Checkpoint - Etapa 1.59 finish outcome input policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a montagem da entrada do resultado final do encerramento do SOS para policy pura, sem alterar o algoritmo de resultado, textos finais, cofre, chamada ao vivo, backend, WebRTC, storage ou layout.

## Alteracoes

- Criado `src/features/emergency-home/finishOutcomeInputPolicy.ts`.
- Criada funcao `resolveFinishOutcomeInput()`.
- `app/index.tsx` passou a montar `FinishOutcomePolicyInput` pela policy antes de chamar `resolveFinishOutcomePolicy()`.
- A policy centraliza:
  - contagem de anexos apos finalizacao;
  - indicador de video ao vivo anexado;
  - handoff de midia para chamada ao vivo;
  - falha de confirmacao remota;
  - status da parada de midia;
  - presenca de `stopSerial`.
- O algoritmo de outcome permanece em `finishOutcomePolicy.ts`.
- Criado `scripts/finish-outcome-input-policy.test.ts`.
- `scripts/smoke-test.mjs` e `package.json` passaram a exigir o novo gate.

## Validacoes

- `npm run test:finish-outcome-input`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

ADB confirmou o Android `23129RA5FL` via Wi-Fi nesta rodada, mas nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Manter o ritmo de duas fatias pequenas por checkpoint. A proxima fatia ja foi executada nesta rodada: conclusao owner do encerramento.
