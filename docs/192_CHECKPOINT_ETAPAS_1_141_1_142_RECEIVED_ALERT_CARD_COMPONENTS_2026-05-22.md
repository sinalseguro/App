# Checkpoint - Etapas 1.141 e 1.142 - Componentes locais de Alertas recebidos

Data: 2026-05-22

## Escopo

Rodada de refatoracao presentational em `app/alerta.tsx`, mantendo duas fatias pequenas por vez.

- Etapa 1.141: extrair o card de alerta recebido para `ReceivedAlertCardView`.
- Etapa 1.142: extrair o card de historico/local archive para `ReceivedCallArchiveCardView`.

## Alteracoes

- `app/alerta.tsx`
  - adiciona `ReceivedAlertCardView` como componente local de apresentacao do pedido recebido;
  - adiciona `ReceivedCallArchiveCardView` como componente local de apresentacao do registro local;
  - reduz o JSX inline do `AlertScreen`;
  - mantem no `AlertScreen` os calculos de estado/policy, handlers reais e efeitos.
- `scripts/smoke-test.mjs`
  - passa a exigir os dois novos helpers locais como anchors de arquitetura.

## Limites preservados

`AlertScreen` continua responsavel por:

- API/listagem/resposta real de pedido;
- autoaceite e notificacao;
- aceite + arquivo local;
- WebRTC e chamada em tempo real;
- refs mutaveis de concorrencia;
- stop/reset de chamada;
- `Share.share()`;
- `setSelectedArchiveRecord()`;
- estado React.

Os novos componentes recebem dados e callbacks ja montados pela tela. Eles nao acessam API, storage, WebRTC, refs, Share nativo, notificacao ou estado proprio de dominio.

## QA e seguranca

- Mudanca restrita a apresentacao local da tela `Alertas recebidos`.
- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- `buildLiveCallShareText(record)` continua sendo a fonte do texto compartilhado no dialog e no Share.
- O bloqueio de uma chamada ativa por vez continua vindo de `buildReceivedAlertActionState()` e `buildReceivedAlertRealtimeStartDecision()`.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados: nomes de arquivos/anchors existentes no smoke e `apiClient`.

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

- `npm run typecheck` nao emitiu erro, mas ficou sem saida e praticamente ocioso por mais de 1 minuto; foi encerrado para nao deixar processo pendurado.
- `npm run private:android:readiness` manteve a pendencia local ja conhecida: Node 20.16.0 abaixo do requisito de release publica, aceitavel para build privado debug.
- Sem build/instalacao Android porque a fatia e presentational e nao altera runtime fisico, UX nativa, camera, microfone, gravacao, WebRTC real ou portal.

## Proxima recomendacao

Continuar com duas fatias pequenas para encerrar a organizacao principal de `app/alerta.tsx`:

- Etapa 1.143: extrair helper/componente local do status bar de alertas recebidos, mantendo `refreshAlerts()` e `refreshing` na tela.
- Etapa 1.144: extrair helper/componente local da secao de historico, mantendo lista, selecao e Share no `AlertScreen`.
