# Checkpoint - Etapa 1.61 finish runtime start policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao das acoes iniciais de runtime no encerramento ativo do SOS, sem alterar gravacao, chamada ao vivo, WebRTC, backend, cofre, UX ou layout.

## Alteracoes

- Criado `src/features/emergency-home/finishActiveCallRuntimeStartPolicy.ts`.
- Criada funcao `resolveFinishActiveCallRuntimeStartActions()`.
- `app/index.tsx` passou a obter da policy:
  - progresso inicial `Encerrando chamado`;
  - status `Encerrando chamado seguro...`;
  - evento saneado `emergency_finish_button_pressed`;
  - decisao de limpar sessao de autochamada quando existe sessao remota;
  - flags para reset da chamada ao vivo, limpeza de sessao remota e marcacao de encerramento em andamento.
- Os efeitos reais continuam em `app/index.tsx`: parar evidencia de video ao vivo, resetar chamada, limpar refs, atualizar estados React e registrar log operacional.
- Criado `scripts/finish-active-call-runtime-start-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:finish-active-call-runtime-start`: aprovado.
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

Prosseguir com a segunda fatia da dupla: agrupar as acoes pos-outcome final sem alterar os efeitos reais.
