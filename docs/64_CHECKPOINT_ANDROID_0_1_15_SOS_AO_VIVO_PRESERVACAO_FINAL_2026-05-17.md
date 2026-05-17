# Checkpoint Android 0.1.15 - SOS ao vivo com preservacao final

Data: 2026-05-17
Coordenacao: Ze
Especialistas: Katia, Fabio, Doneda, Cristine, Lina, Tarcila, Eliane e Lucena

## Objetivo

Corrigir a corrida entre inicio da gravacao do stream WebRTC e encerramento do SOS ao vivo, garantindo que o video transmitido pela pessoa protegida seja preservado no cofre local cifrado antes de concluir a ocorrencia.

## Pesquisa aplicada

- WebRTC separa sinalizacao da midia: a API/EC2 deve trocar offer, answer e ICE, enquanto audio/video trafegam entre pares quando a conexao segura fecha.
- Trickle ICE reduz atraso de conexao porque candidatos sao enviados conforme aparecem.
- No Android, `MediaRecorder` e `MediaMuxer` exigem esperar `stop`/finalizacao antes de usar o arquivo gerado; consumir o arquivo antes disso pode gerar midia ausente, invalida ou incompleta.
- A abordagem funcional para este app e tratar a gravacao do stream ao vivo como uma unica promessa de ciclo: iniciar, aguardar inicio pendente, parar uma vez, preservar, cifrar e so entao liberar a UI.

Referencias consultadas em 2026-05-17:

- `https://webrtc.org/getting-started/peer-connections?hl=en`
- `https://webrtc.github.io/webrtc-org/architecture/`
- `https://developer.android.com/reference/android/media/MediaRecorder`
- `https://developer.android.com/reference/android/media/MediaMuxer`
- `https://react-native-webrtc.github.io/handbook/guides/basic-usage.html`

## Implementado nesta subetapa

- `startOwnerLiveVideoEvidence` passou a reusar inicio pendente para a mesma sessao e pacote.
- `stopOwnerLiveVideoEvidence` passou a aguardar inicio pendente e reusar a promessa de preservacao quando o encerramento e chamado mais de uma vez.
- `handleFinishActiveCall` deixou de parar novamente o gravador da camera quando a midia ja foi entregue ao fluxo WebRTC.
- O modal final diferencia sucesso real, pendencia de preservacao e falha sem esconder diagnostico.
- Android foi sincronizado para `0.1.15`, `versionCode 17`.

## Validacoes executadas

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `git diff --check`: aprovado.
- Build Android debug bundled: aprovado.
- Dois Androids fisicos atualizados por ADB para `0.1.15`.
- Teste fisico: originador transmitiu audio/video; anjo recebeu video remoto; encerramento preservou video no cofre local cifrado.
- API publicada na EC2 com migration `app_releases.0014_update_android_release_20260517_v0115`.
- Portal publicado em `/var/www/sinalseguro/releases/20260517T223450Z`.
- Download real do APK publicado confirmou SHA-256 `a7b90059ce2b976c9af18ca6a43754815e423a6832aa8835305a2a99b0bb6a64`.
- Endpoint `/api/app-releases/current?platform=android&version_code=16` retornou `0.1.15`/`versionCode 17`.
- Limpeza controlada removeu historicos locais de SOS/chamadas dos dois Androids e zerou sessoes, envelopes, sinais P2P e auditoria tecnica de emergencia antes da rodada fisica final.
- Rodada final pos-limpeza confirmou notificacao no anjo, tela `Alertas recebidos`, papel `Voce e o anjo`, video ao vivo da pessoa protegida, encerramento e novo `.nseg` protegido no originador.

## Evidencias

- APK local: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256: `a7b90059ce2b976c9af18ca6a43754815e423a6832aa8835305a2a99b0bb6a64`.
- Screenshots locais da rodada ficam em `/private/tmp/sinalseguro-android-live-20260517/`.
- Screenshots pos-limpeza ficam em `/tmp/sinalseguro-android-live-20260517-post-clean/`.
- No originador, o cofre exibiu novo item protegido com `1 video`.
- No anjo, a chamada apareceu como acompanhamento ao vivo da pessoa protegida.
- Backend pos-validacao final ficou com 1 sessao finalizada, 1 destinatario, 1 envelope, 9 sinais P2P e 34 eventos tecnicos de emergencia referentes apenas a esta rodada controlada.

## Limites preservados

- Midia bruta nao passa pela EC2/API.
- Backend continua como plano de controle, sinalizacao e auditoria saneada.
- Audio local no pacote depende do comportamento do microfone Android durante captura simultanea; se o aparelho bloquear, o video continua protegido.
- Auditoria media esta entregue; cadeia de custodia completa fica para homologacao juridica/institucional.

## Proxima etapa recomendada

Prosseguir com teste manual supervisionado da `0.1.15` nos dois Androids fisicos, observando tempo de recebimento do chamado, clareza da tela do anjo e preservacao do video no cofre local.
