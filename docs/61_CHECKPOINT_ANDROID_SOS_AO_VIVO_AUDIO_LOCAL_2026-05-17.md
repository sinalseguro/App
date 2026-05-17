# Checkpoint Android - SOS ao vivo com audio local no pacote

Data: 2026-05-17
Coordenacao: Ze
Especialistas: Katia, Fabio, Doneda, Cristine, Lina, Tarcila, Eliane e Lucena

## Objetivo

Avancar a subfase posterior a `0.1.13`: preservar audio local junto ao video da chamada SOS ao vivo no pacote local cifrado do solicitante, mantendo audio/video bruto fora da EC2.

## Implementado nesta subetapa

- `SinalSeguroLiveVideoRecorder` passou a capturar audio local Android em AAC por `MediaRecorder` enquanto grava os frames do stream WebRTC local.
- O gravador gera temporariamente video H.264 e audio AAC separados, muxa os dois em um MP4 final e entrega esse arquivo ao fluxo ja existente de protecao `.nseg`.
- O resultado so marca `audioCaptured=true` quando `MediaExtractor` confirma trilha de audio no arquivo final.
- Se o Android bloquear microfone duplicado, falhar no stop do audio ou falhar no mux, o fluxo cai para video-only, preservando o comportamento aprovado na `0.1.13`.
- A limpeza dos arquivos temporarios foi ajustada para nao apagar o `.m4a` depois que o `MediaRecorder` ja iniciou.
- A ponte nativa gerada em `android/app/src/main/java/...` foi sincronizada pelo plugin `with-sinalseguro-media-engine`.

## Limites preservados

- Esta subetapa grava o microfone local do aparelho solicitante; nao grava o audio remoto do anjo.
- A EC2/API continua como plano de controle, sinalizacao e auditoria saneada, sem midia bruta.
- A trilha de audio ainda precisa de validacao fisica em dois Androids para confirmar `audioCaptured=true`, duracao coerente e ausencia de residuos claros.
- Reconexao, notificacao de chamada e segundo plano seguem para subetapas posteriores.

## Validacoes executadas

- `npm run typecheck`: aprovado.
- `git diff --check`: aprovado.
- `android ./gradlew :app:compileDebugKotlin`: aprovado.

## Gates pendentes antes de release

- Build Android debug bundled completo.
- Teste fisico em dois Androids autenticados: SOS ao vivo, anjo vendo video, encerramento e `.nseg` protegido.
- Conferir em log/resultado local se `audioCaptured=true` quando o aparelho permitir.
- Conferir ausencia de `*-audio.m4a`, `*-video.mp4` e MP4 bruto no cache apos finalizacao e relancamento do app.
- Validar caso de microfone negado ou indisponivel: o app deve preservar video-only e informar falha de audio sem quebrar o SOS.

## Proxima subetapa

Implementar estados saneados de falha/reconexao da chamada ao vivo, com auditoria minima e UX simples, sem alterar o contrato de midia fora da EC2.
