# Checkpoint - Etapas 1.137 e 1.138 - Feedback de Alertas recebidos

Data: 2026-05-22

## Escopo

Rodada de refatoracao pura em `app/alerta.tsx`, mantendo o padrao de duas fatias pequenas por vez.

- Etapa 1.137: extrair mensagens/status puros de atualizacao, aceite/recusa/visualizacao e entrada/saida da chamada recebida para `receivedAlertPresentationPolicy`.
- Etapa 1.138: extrair dialogs puros de falha e fallback de erro para pedidos, arquivo local e tempo real.

## Alteracoes

- `src/features/live-call/receivedAlertPresentationPolicy.ts`
  - adiciona builders puros de status de refresh e falha de refresh;
  - adiciona label tipado para resposta ao pedido recebido;
  - adiciona mensagens tipadas para estados de atendimento;
  - adiciona builder puro de dialog de falha por tipo de operacao;
  - adiciona helper puro de fallback para mensagens de erro.
- `app/alerta.tsx`
  - passa a consumir os builders puros para `setStatus()` e `setDialog()`;
  - preserva todos os efeitos reais na tela.
- `scripts/received-alert-presentation-policy.test.ts`
  - cobre os novos contratos de status, labels e dialogs.

## Limites preservados

`app/alerta.tsx` continua responsavel por:

- API e resposta real de pedido;
- autoaceite e notificacao;
- WebRTC e chamada em tempo real;
- storage/arquivo local;
- refs mutaveis de concorrencia;
- reset de chamada;
- Share nativo;
- estado React.

Nao foram movidos efeitos reais para policy.

## QA e seguranca

- Mudanca restrita a regra pura/teste de feedback visual da tela `Alertas recebidos`.
- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada ou conteudo de midia.
- Inspecao sensivel nos arquivos tocados retornou apenas falsos positivos esperados: nomes de tipos/imports e `console.log` final de teste.

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

- `npm run typecheck` nao emitiu erro, mas ficou sem saida e quase ocioso por mais de 1 minuto; foi encerrado para nao deixar processo pendurado.
- `npm run private:android:readiness` manteve a pendencia local ja conhecida: Node 20.16.0 abaixo do requisito de release publica, aceitavel para build privado debug.
- Sem build/instalacao Android porque a fatia e pura e nao altera runtime fisico, UX nativa, camera, microfone, gravacao, WebRTC real ou portal.

## Proxima recomendacao

Continuar em `app/alerta.tsx` com duas fatias de baixo risco:

- Etapa 1.139: extrair estado puro de acoes por alerta recebido (`hasAccepted`, `recipientStatus`, painel de chamada e bloqueios visuais).
- Etapa 1.140: extrair apresentacao pura dos cards de historico/local archive, sem mover `Share`, storage, WebRTC ou handlers reais.
