# Checkpoint - Etapas 1.143 e 1.144 - Status e secao de historico de Alertas recebidos

Data: 2026-05-22

## Escopo

Rodada de refatoracao presentational em `app/alerta.tsx`, mantendo duas fatias pequenas por vez.

- Etapa 1.143: extrair a barra de status/refresh para `ReceivedAlertsStatusBar`.
- Etapa 1.144: extrair a secao de historico/local archive para `ReceivedCallArchiveSection`.

## Alteracoes

- `app/alerta.tsx`
  - adiciona `ReceivedAlertsStatusBar` como componente local de apresentacao;
  - adiciona `ReceivedCallArchiveSection` como componente local de apresentacao;
  - mantem `refreshAlerts()`, `refreshing`, `status`, `setSelectedArchiveRecord()` e `shareArchiveRecord()` no `AlertScreen`;
  - preserva os cards locais ja extraidos na rodada anterior.
- `scripts/smoke-test.mjs`
  - passa a exigir `ReceivedAlertsStatusBar`, `ReceivedCallArchiveSection`, `setSelectedArchiveRecord`, `buildLiveCallShareText` e o label de acessibilidade de atualizar alertas.

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
- `refreshAlerts()`, `setRefreshing`, `setStatus` e `setAlerts`;
- estado React.

Os novos componentes recebem props e callbacks. Eles nao importam nem executam API, Share, WebRTC, storage, notificacao, refs ou estado proprio de dominio.

## QA e seguranca

- Mudanca restrita a apresentacao local da tela `Alertas recebidos`.
- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- `buildLiveCallShareText(record)` continua sendo a fonte do texto compartilhado no dialog e no Share.
- `buildReceivedCallArchiveCardPresentation(record)` continua sendo a fonte dos labels de historico local.
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

- `npm run typecheck` nao emitiu erro, mas ficou sem saida e 0% CPU por mais de 1 minuto; foi encerrado para nao deixar processo pendurado.
- `npm run private:android:readiness` manteve a pendencia local ja conhecida: Node 20.16.0 abaixo do requisito de release publica, aceitavel para build privado debug.
- Sem build/instalacao Android porque a fatia e presentational e nao altera runtime fisico, UX nativa, camera, microfone, gravacao, WebRTC real ou portal.

## Proxima recomendacao

Continuar com duas fatias pequenas para finalizar a limpeza principal de `app/alerta.tsx`:

- Etapa 1.145: extrair helper local para renderizar a lista de alertas recebidos, mantendo o calculo de policy e handlers reais na tela.
- Etapa 1.146: revisar se a tela ja atingiu ponto de parada seguro ou se vale mover tipos/componentes presentational para modulo proprio, somente se houver beneficio claro e sem ampliar escopo.
