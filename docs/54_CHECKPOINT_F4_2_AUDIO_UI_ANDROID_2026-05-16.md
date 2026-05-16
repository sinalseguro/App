# Checkpoint - F4.2 Audio com Anjo na UI Android

Data: 2026-05-16
Coordenacao: Ze
Especialistas: Katia, Lina, Tarcila, Eliane, Fabio, Cristine e Doneda

## Status

F4.2 avancou da base tecnica WebRTC para uma primeira UI de homologacao audio-only no Android.

Implementado:

- Home guarda o `remoteSessionId` retornado pelo envio do SOS para EC2;
- Home exibe faixa discreta `Audio com anjo` separada do botao SOS;
- `Alertas recebidos` mostra `Entrar no audio` somente depois que o anjo aceitou acompanhar;
- `useLiveAudioCall` orquestra offer, answer, ICE e encerramento com `LiveWebRtcSession`;
- sinais P2P agora sao filtrados por ocorrencia, tipo e `callSessionId` antes do consumo;
- `live_session` passou a ser envelope de autorizacao efemera da chamada WebRTC, sem exigir chave de midia falsa;
- chamada continua `audio-only` por padrao e sem STUN/TURN externo.

## Limites

- Nao houve release privada nem publicacao no portal.
- Nao houve validacao fisica entre dois Androids nesta fatia.
- Video ao vivo continua bloqueado ate comprovar convivencia com a gravacao local do SOS.
- O backend continua sem receber, decodificar, processar ou armazenar audio/video.
- A UI nao exibe termos tecnicos como WebRTC, SDP, ICE, envelope ou P2P.

## Gates para fechar esta fatia

Executados localmente nesta fatia:

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
- audit sem vulnerabilidades conhecidas;
- build Android debug bundled aprovado.

Backend quando tocar contrato:

```bash
python manage.py check
python manage.py test sinalseguro_api.tests.test_platform_base
python manage.py spectacular --validate --file /tmp/sinalseguro-openapi-f4.yaml
python manage.py makemigrations --check --dry-run
```

Resultado local:

- `manage.py check` aprovado;
- suite `sinalseguro_api.tests.test_platform_base` aprovada;
- OpenAPI validado com aviso preexistente de colisao de enum e 0 erros;
- `makemigrations --check --dry-run` sem mudancas pendentes.

## Proxima validacao fisica

1. instalar build privado em dois Androids autenticados;
2. originador aciona SOS e aguarda roteamento para anjo;
3. anjo abre `Alertas recebidos`, toca `Acompanhar` e depois `Entrar no audio`;
4. originador toca `Conectar anjo`;
5. validar audio, encerramento, logs saneados e preservacao da gravacao local;
6. so depois preparar APK privado, update no app e portal.
