# Checkpoint - Etapa 1.45 finish active call start policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a guarda inicial do encerramento do SOS ativo, sem alterar parada real de midia, chamada ao vivo, WebRTC, backend, storage, auditoria, timers ou layout.

## Alteracoes

- Criado `src/features/emergency-home/finishActiveCallStartPolicy.ts`.
- Criado gate focado `scripts/finish-active-call-start-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveFinishActiveCallStart()` em `handleFinishActiveCall()`.
- A policy centraliza:
  - bloqueio quando nao ha pacote ativo;
  - bloqueio quando o encerramento ja esta em progresso;
  - selecao da sessao remota que deve ser finalizada;
  - decisao se a midia ja foi entregue para a chamada ao vivo.
- Os efeitos reais continuam em `app/index.tsx`: parar evidencia ao vivo, resetar chamada, limpar filas de autochamada, atualizar estado visual, log operacional e concluir pacote local/remoto.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:finish-active-call-start`.

## Validacoes

- `npm run test:finish-active-call-start`: aprovado.
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

Fechar a segunda fatia da rodada extraindo a policy de limpeza final do encerramento ativo, mantendo os efeitos reais em `app/index.tsx`.
