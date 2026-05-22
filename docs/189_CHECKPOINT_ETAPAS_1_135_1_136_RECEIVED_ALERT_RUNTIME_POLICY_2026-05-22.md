# Checkpoint - Etapas 1.135 e 1.136 - Runtime de alertas recebidos

Data: 2026-05-22

Status: refatoracao pura implementada e validada.

## Escopo

Continuacao da refatoracao incremental em duas fatias, mantendo a tela `Alertas recebidos` sem alteracao de UX, backend, WebRTC, notificacao, gravacao, storage seguro ou Share nativo.

## Executado

- Etapa 1.135: criada `receivedAlertRuntimePolicy` para centralizar guardas puros de chamada ativa do anjo, impedindo iniciar a mesma sessao novamente ou entrar em outra sessao quando ja existe chamada ativa.
- Etapa 1.136: extraidas decisoes puras de arquivo local em alertas recebidos: atualizar status do arquivo quando a chamada muda para `connected`/`failed`, iniciar chamada com registro existente, criar registro ausente e marcar registro encerrado.
- O autoaceite, a notificacao, a API, o storage, o reset de chamada e o WebRTC continuam em `app/alerta.tsx`.
- `scripts/smoke-test.mjs` foi sincronizado para validar a nova policy e manter os contratos de API, autoaceite autorizado, notificacao, arquivo local e tempo real na tela.

## Seguranca e QA

- `locallyAcceptedSessionIds` segue como estado local/otimista, sem virar fonte de autoridade.
- O bloqueio de uma chamada ativa por vez foi preservado em policy pura e continua aplicado antes de iniciar WebRTC.
- A policy nao executa API, notificacao, storage, permissao, WebRTC, camera, microfone, Share nativo ou logs.
- Nao foram adicionados logs de token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada ou midia.
- A regra `endedAt = finished_at ?? updated_at ?? now` foi preservada na tela com `endedAt` derivado pela policy quando disponivel.

## Validacoes

- `npm run test:received-alert-runtime`: aprovado.
- `npm run test:received-alert-presentation`: aprovado.
- `npm run test:live-call-history`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado com a pendencia local ja conhecida de Node 20.16.0 para release publica.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e praticamente ocioso por mais de 1 minuto; encerrado para nao deixar processo pendurado.

## Decisao

Sem build Android nesta rodada porque a mudanca e uma refatoracao pura de policy/runtime local e nao altera runtime nativo, chamada real, renderizacao WebRTC, camera, gravacao, Share nativo real ou loop de midia.

## Proxima recomendacao

Continuar em duas fatias pequenas ainda em `app/alerta.tsx`, agora priorizando extrair handlers puros de status/dialog quando houver baixo risco. Evitar mover `acceptAndSaveIncomingCall`, `openRealtimeCall`, notificacao, API e refs mutaveis para fora da tela nesta fase.
