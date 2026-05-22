# Checkpoint - Etapas 1.145 e 1.146 - Lista de Alertas recebidos e ponto seguro

Data: 2026-05-22

## Escopo

Rodada de refatoracao presentational em `app/alerta.tsx`, mantendo duas fatias pequenas por vez.

- Etapa 1.145: extrair a lista visual de alertas recebidos para `ReceivedAlertsList`.
- Etapa 1.146: extrair o estado vazio para `ReceivedAlertsEmptyState` e registrar ponto de parada seguro da tela.

## Alteracoes

- `app/alerta.tsx`
  - adiciona o tipo local `ReceivedAlertListItem`;
  - monta `receivedAlertItems` no `AlertScreen`, mantendo ali os calculos de policy;
  - adiciona `ReceivedAlertsList` como componente local de apresentacao;
  - adiciona `ReceivedAlertsEmptyState` como componente local de apresentacao;
  - preserva os handlers reais `openRealtimeCall()`, `respondToAlert()` e `stopRealtimeCall()` no `AlertScreen`.
- `scripts/smoke-test.mjs`
  - passa a exigir `ReceivedAlertListItem`, `ReceivedAlertsList`, `ReceivedAlertsListProps` e `ReceivedAlertsEmptyState`;
  - passa a falhar se `ReceivedAlertsList` tentar assumir API, Share, `useEffect`, `useLiveAudioCall`, notificacao, arquivo local, WebRTC ou builders de policy.

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
- refresh, status e estado React;
- calculo de policy para cada item da lista recebida.

`ReceivedAlertsList` e `ReceivedAlertsEmptyState` recebem dados prontos e renderizam interface. Eles nao importam nem executam API, Share, WebRTC, storage, notificacao, refs, efeitos, hooks de chamada ou policies.

## QA e seguranca

- Mudanca restrita a apresentacao local da tela `Alertas recebidos`.
- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- O contrato recomendado por Cristine/Eliane foi preservado: a lista continua burra, e a tela continua dona dos efeitos sensiveis.
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

## Ponto de parada seguro

`app/alerta.tsx` chegou a um ponto seguro para pausa desta frente de refatoracao:

- policies puras principais ja foram extraidas;
- componentes locais principais ja foram isolados;
- o que permanece no `AlertScreen` e justamente orquestracao de efeitos sensiveis.

Nao e recomendado mover mais partes desta tela para arquivos separados agora, salvo necessidade real de reuso ou nova complexidade. Espalhar API, refs, WebRTC, storage, notificacao ou Share aumentaria risco sem ganho proporcional nesta etapa.

## Proxima recomendacao

Encerrar a limpeza principal de `Alertas recebidos` e seguir a refatoracao para a proxima area com duas fatias pequenas, preferindo uma tela/modulo ainda grande mas menos sensivel que WebRTC em tempo real. A recomendacao tecnica e escolher o proximo alvo por impacto de manutencao, mantendo o mesmo gate: refatorar primeiro regras puras, depois componentes presentational, sem alterar comportamento.
