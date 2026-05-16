# Checkpoint - F4.2 WebRTC Android em Primeiro Plano

Data: 2026-05-16
Coordenacao: Ze
Especialistas: Katia, Lina, Tarcila, Eliane, Cristine, Fabio e Lucena

## Status

F4.2 foi iniciada no app Android, ainda sem liberar interface publica de chamada e sem gerar release privada.

Implementado:

- dependencia nativa `react-native-webrtc@124.0.7`;
- runtime isolado `LiveWebRtcSession` para obter camera/microfone, criar offer/answer, receber answer, adicionar ICE e fechar tracks;
- padrao inicial audio-only no runtime, reduzindo risco de disputa com a gravacao local do SOS;
- configuracao inicial sem STUN/TURN externo por padrao, para evitar dependencia/custo/telemetria externa antes de aprovacao;
- camada de controle `liveCallControl` mantida para enviar/listar/consumir sinais pela API sem registrar SDP/ICE em logs;
- override seguro de `postcss` para eliminar vulnerabilidades conhecidas apontadas pelo `npm audit`.

## Limites deste checkpoint

- Nenhum botao novo foi exposto ao usuario final.
- Nenhuma chamada fisica entre dois Androids foi validada ainda.
- Nenhuma release foi publicada no portal.
- Localizacao, conveniados, iOS, TURN/relay e midia remota continuam fora desta fatia.
- O backend continua sendo plano de controle; audio/video nao devem passar pela API.
- Chamada com video ao vivo continua bloqueada ate validacao fisica de convivencia com a gravacao local.

## Validacoes executadas

```bash
npm run typecheck
npm run lint
npm test -- --runInBand
npm audit --omit=dev
npm run build:android:debug:bundled
```

Resultado:

- typecheck aprovado;
- lint local aprovado;
- testes mobile aprovados;
- audit sem vulnerabilidades conhecidas apos override;
- build Android debug bundled aprovado com autolinking de `react-native-webrtc`.

## Proximo passo

Integrar o runtime a UI e ao fluxo:

1. originador SOS detecta anjo aceito e prepara chamada audio-only;
2. anjo em `Alertas recebidos` aceita acompanhar e entra na chamada;
3. offer/answer/ICE trafegam pela EC2 somente como sinalizacao efemera;
4. dois Androids fisicos validam audio, encerramento, consumo de sinais e logs saneados;
5. video ao vivo so entra em fatia posterior, se nao conflitar com a captura local.
