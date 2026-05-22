# Checkpoint - Etapas 1.139 e 1.140 - Acoes e historico de Alertas recebidos

Data: 2026-05-22

## Escopo

Rodada de refatoracao pura em `app/alerta.tsx`, mantendo duas fatias pequenas por vez.

- Etapa 1.139: extrair estado puro das acoes por alerta recebido.
- Etapa 1.140: extrair apresentacao pura dos cards de historico/local archive.

## Alteracoes

- `src/features/live-call/receivedAlertPresentationPolicy.ts`
  - adiciona `buildReceivedAlertActionState()` para calcular `recipientStatus`, aceite local/remoto, sessao de painel, chamada ativa em outra sessao e bloqueios visuais;
  - adiciona `buildReceivedCallArchiveCardPresentation()` para montar labels do card de registro local com os formatadores existentes.
- `app/alerta.tsx`
  - passa a consumir o estado puro dos botoes/painel;
  - passa a consumir a apresentacao pura do card de historico;
  - mantem todos os efeitos reais na tela.
- `scripts/received-alert-presentation-policy.test.ts`
  - cobre pedido pendente, aceite remoto, aceite local por `Set`, pedido encerrado, outra chamada ativa, mesma chamada ativa e nao mutacao do `Set`;
  - cobre labels de historico local usando os formatadores existentes.
- `scripts/smoke-test.mjs`
  - passa a exigir os novos helpers como anchors de arquitetura.

## Limites preservados

`app/alerta.tsx` continua responsavel por:

- API e resposta real de pedido;
- autoaceite e notificacao;
- WebRTC e chamada em tempo real;
- storage/arquivo local;
- refs mutaveis de concorrencia;
- reset de chamada;
- `Share.share()`;
- `setSelectedArchiveRecord()`;
- estado React.

O texto compartilhado continua vindo de `buildLiveCallShareText(record)`.

## QA e seguranca

- Mudanca restrita a regra pura/teste de apresentacao e estado visual da tela `Alertas recebidos`.
- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados: nomes de tipos/imports, anchors de smoke e `console.log` final de teste.

## Validacoes

Aprovadas:

- `npm run test:received-alert-presentation`
- `npm run test:received-alert-runtime`
- `node scripts/smoke-test.mjs`
- `npm run lint`
- `npm run private:android:readiness`
- `npm test`
- `git diff --check`

Observacao:

- `npm run typecheck` nao emitiu erro, mas ficou sem saida e 0% CPU por mais de 1 minuto; foi encerrado para nao deixar processo pendurado.
- `npm run private:android:readiness` manteve a pendencia local ja conhecida: Node 20.16.0 abaixo do requisito de release publica, aceitavel para build privado debug.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico, UX nativa, camera, microfone, gravacao, WebRTC real ou portal.

## Proxima recomendacao

Continuar em `app/alerta.tsx` com duas fatias de baixo risco:

- Etapa 1.141: extrair subcomponente/presentational helper do card de alerta recebido, mantendo handlers reais injetados pela tela.
- Etapa 1.142: extrair subcomponente/presentational helper do card de historico local, mantendo `Share` e selecao real na tela.
