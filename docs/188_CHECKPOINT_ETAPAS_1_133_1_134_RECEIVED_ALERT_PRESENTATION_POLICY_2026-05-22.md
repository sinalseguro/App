# Checkpoint - Etapas 1.133 e 1.134 - Alertas recebidos

Data: 2026-05-22

Status: refatoracao pura implementada e validada.

## Escopo

Continuacao da refatoracao incremental em duas fatias, sem alterar UX/IX, fluxo de chamada, backend, WebRTC, notificacao, gravacao, storage ou autorizacoes.

## Executado

- Etapa 1.133: extraida `receivedAlertPresentationPolicy` para centralizar helpers puros da tela `Alertas recebidos`: data, ordenacao de pedidos, label de fase e label de status do arquivo local.
- Etapa 1.134: extraida a apresentacao pura do card de pedido recebido e do bloco de chamada recebida: titulo, corpo, status, labels, acessibilidade e gates visuais derivados.
- `app/alerta.tsx` continua responsavel pelos efeitos reais: listar sessoes recebidas, aceitar/recusar/visualizar pedido, iniciar chamada em tempo real, notificar entrada, arquivar registro local, compartilhar registro e sincronizar estados.
- `scripts/smoke-test.mjs` foi sincronizado para validar os textos contratuais na nova policy sem enfraquecer os checks de API, aceite do anjo e tempo real.

## Seguranca e LGPD

- A policy nova nao executa rede, API, storage, permissao, notificacao, WebRTC, camera, microfone, Share nativo ou logs.
- `locallyAcceptedSessionIds` continua apenas como estado local/otimista; nao virou fonte de autoridade.
- O bloqueio de pedido recusado/encerrado foi preservado: `declined` nao permite entrada e sessoes encerradas ficam apenas para consulta.
- O limite de uma chamada ativa por vez continua na tela, com `hasOtherCallSession` preservado fora da policy.
- Nenhum payload sensivel, token, chave, coordenada, midia bruta ou sinalizacao tecnica nova foi introduzido.

## Validacoes

- `npm run test:received-alert-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado com a pendencia local ja conhecida de Node 20.16.0 para release publica.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e ocioso por mais de 1 minuto; encerrado para nao deixar processo pendurado, mantendo o comportamento conhecido do projeto.

## Decisao

Sem build Android nesta rodada porque a mudanca e uma refatoracao pura de policy/apresentacao e nao altera runtime nativo, chamada real, renderizacao WebRTC, camera, gravacao, Share nativo real ou loop de midia.

## Proxima recomendacao

Continuar em duas fatias pequenas ainda em `app/alerta.tsx`, priorizando extrair uma policy pura para decisoes de sincronizacao/arquivo local somente depois de mapear cuidadosamente os efeitos para nao duplicar aceite, notificacao, arquivamento ou inicio de WebRTC.
