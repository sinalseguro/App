# Checkpoint Android 0.1.13 - SOS ao vivo com video local protegido

Data: 2026-05-17
Coordenacao: Ze
Especialistas: Katia, Fabio, Doneda, Cristine, Tarcila, Lina e Eliane

## Objetivo

Fechar a subfase em que o solicitante transmite audio/video ao anjo autorizado, preserva video local cifrado no proprio aparelho e encerra o estado remoto da ocorrencia na EC2 sem transportar midia bruta pelo backend.

## Implementado nesta etapa

- Modulo nativo Android passou a capturar frames do stream local WebRTC do solicitante e gerar video local temporario.
- O arquivo temporario e preservado no cofre local como `.nseg`, mantendo a midia bruta fora da EC2.
- `SinalSeguroWebRtcAccess` acessa o stream nativo do `react-native-webrtc` para a gravacao local do solicitante.
- Home inicia/paralisa a evidencia local da chamada ao vivo conforme o estado WebRTC.
- Encerramento do SOS agora guarda o `remoteSessionId` antes de limpar o estado local e chama explicitamente a API para finalizar a sessao remota.
- Se a central falhar ao confirmar o encerramento, a UX informa que o video ficou protegido localmente e que a confirmacao central esta pendente.
- Modal final `Video protegido` foi ajustado para o botao `Continuar` fechar corretamente.
- Android sincronizado para `0.1.13`, `versionCode 15`, com canal de update apto a detectar a nova versao.

## Limites preservados

- Audio/video bruto da chamada nao e enviado nem processado nem armazenado na EC2.
- A EC2 segue como plano de controle: identidade, autorizacao, ocorrencia, sinais efemeros, envelopes e auditoria saneada.
- A captura local desta subfase preserva video; captura de audio local no mesmo arquivo ainda fica para subfase nativa posterior.
- TURN/relay, segundo plano real, notificacao de chamada, localizacao ao vivo e app institucional conveniado continuam fora desta fatia.

## Validacoes

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `git diff --check`: aprovado.
- `npm run build:android:debug:bundled`: aprovado.
- `aapt dump badging`: `versionCode='15'`, `versionName='0.1.13'`.
- APK final SHA-256: `7b9c6f110313ade8b4740200edbf77cdbe0e92b5654ecd5aaf42a8d8f08e8bae`.
- Dois Androids fisicos receberam a `0.1.13` por ADB.
- Rodada fisica confirmou:
  - solicitante em `Transmitindo ao anjo`;
  - anjo em `Acompanhando SOS` com video da pessoa protegida;
  - WebRTC conectado nos dois aparelhos;
  - arquivo `.nseg` criado no cofre local do solicitante;
  - modal final `Video protegido` fechando pelo botao `Continuar`;
  - backend apos finish com `active_sessions=0`, `active_live_envelopes=0` e `open_signals=0`.

## Publicacao

- API EC2 publicada com a migration `app_releases.0013_update_android_release_20260517_v0113`.
- Portal publicado em `/var/www/sinalseguro/releases/20260517T205023Z`.
- Rollback anterior preservado em `/var/www/sinalseguro/releases/20260517T183651Z`.
- Endpoint de update retorna `0.1.13`/`versionCode 15` para Android abaixo de `15`.
- `https://www.sinalseguro.com.br/baixar/android` retorna 200.
- `downloads/installers.json` e `checksums.txt` apontam o mesmo SHA-256 do APK.
- Download real de `sinalseguro_android.apk` validou SHA-256 `7b9c6f110313ade8b4740200edbf77cdbe0e92b5654ecd5aaf42a8d8f08e8bae`.
- `sinalseguro-api` e `cereusia-crm` ficaram ativos; `nginx -t` aprovado e `cereusia.conf` preservado.

## Resultado

Subfase de video local protegido do SOS ao vivo aprovada tecnicamente e publicada como release privada Android `0.1.13`, mantendo a arquitetura hibrida: backend como plano de controle e midia no plano P2P/local.

## Proximo gate

Iniciar a proxima subfase: audio local no pacote audiovisual, reconexao/falha controlada e preparacao de notificacao/segundo plano.
