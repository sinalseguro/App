# Memoria - Ada, Hedy e Margaret

Data: 2026-05-03  
Papel: arquitetura mobile React Native/Expo, SOS, Cofre e Android.

## Estado tecnico

- `AppTopBar`, `BrandedDialog` e `ResourceTile` sao componentes compartilhados.
- Home SOS permanece fixa e sem `SafeScreen`.
- Cofre local foi convertido para tela fixa por icones.
- `SafeScreen` ficou para paginas informativas/configuracoes.
- `PanicButton` usa pressao longa para acionar e encerrar.
- Singleton/idempotencia de chamado ativo permanece em `emergencyRecorder`.
- Build privado de midia local usa `EmergencyMediaRecorder` com `expo-camera` para gravar video/audio no sandbox do app.
- APK privado atualizado foi gerado por `npm run build:android:private`.
- Encerramento de chamado ativo pelo Cofre agora passa por `BrandedDialog` e respeita `finishSafety.requireCode`.
- `BrandedDialog` tem `ScrollView` interno para modais com player/cofre em telas menores.
- `EmergencySettingsDrawer` evita `Pressable` dentro de `Pressable`; `Modo atual` e ajuda sao controles separados.
- O gate privado vigente e `private:android:readiness`; o gate publico `release:android:readiness` deve bloquear enquanto o workspace contem instrumentacao privada de midia (`expo-camera`/`expo-video`).

## Pendencias tecnicas

- Repetir a matriz da Frente 1.2 no iPhone fisico antes de fechar midia critica.
- Evoluir adaptadores de outbox/API somente quando a frente de backend/anjos for aberta.
- Nao colocar blobs de midia no `SecureStore`; midia local deve permanecer em arquivo do sandbox do app com hash e criptografia por envelope.

## Atualizacao tecnica - 2026-05-11 - Frente 1.2 Android validado

- Android `recordAsync` deixou de receber `maxDuration` automatico; o stop explicito evita `ERROR_DURATION_LIMIT_REACHED` sem URI no CameraX e impede pacotes sem midia quando a camera excede o limite.
- `SinalSeguroMediaEngineModule.kt` Android prepara playback nativo com AES-256-GCM em blocos usando `cipher.update` e `doFinal`, sem `CipherInputStream`; o MP4 claro existe apenas como temporario em cache privado/no-backup durante o player.
- `EvidencePlayerCard` normaliza offset inicial da timeline e isola chamadas do `expo-video` com wrappers seguros para `play`, `pause`, `replace`, `seek`, `currentTime` e `duration`.
- Smoke test cobre a rota Android sem `maxDuration`, a ausencia de `CipherInputStream` e a regra de player nativo/loopback legado.
- APK final Android: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `b4c8eb4aad7fb7c886bf5f726f179be633e03751a5eb9ae9b79c3ee061ada0f3`.
- Android fisico validou SOS 60s, 3min e ciclo longo; inventario final saneado teve 0 midias claras persistentes, 17 `.nseg` e 375 `.sseg`.
- iOS segue pendente: nao aprovar midia longa nem fechar Frente 1.2 ate repetir a matriz no iPhone fisico.

## Atualizacao tecnica - 2026-05-13 - MVP Android primeiro

- Roberto decidiu que iPhone/iOS nao deve mais bloquear a conclusao do MVP.
- Foco tecnico imediato: Android 100% funcional para liberar as proximas frentes.
- iOS fica pos-MVP, com os achados preservados e sem novas tentativas de build/debug/validacao fisica nesta etapa.
- Entrave iOS atual: cofre ja apresenta o pacote de 1min38 como `1 video`, mas o player nativo unificado falha no preparo com `assetCount: 8` e `playback_prepare_error`.
- Hipotese tecnica iOS preservada: merge de multiplos MP4 curtos via AVFoundation precisa frente propria de export normalizado/validacao de segmentos.
- Android deve ser regenerado/rebuildado quando necessario; `android/` foi removido como regeneravel para liberar espaco.
- Acao posterior executada: rebuild Android privado, instalacao fisica e ciclos SOS/cofre/player/inventario saneado foram validados antes da aprovacao de Roberto.

## Atualizacao tecnica - 2026-05-13 - Android validado para aceite manual

- APK Android privado final: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `50fe4c831174899e5728579709ec906470c6c55d4aad1f205c162da1be0444db`.
- Device fisico validado: `23129RA5FL`, Android 15 / SDK 35.
- Hardening aplicado no motor nativo Android: entrada aceita somente em `filesDir`, `cacheDir` e `noBackupFilesDir`; nao reabrir `externalCacheDir` nem `getExternalFilesDir` sem nova decisao de seguranca.
- `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness`, `npm run build:android:private` e `git diff --check` passaram.
- Primeiro ciclo fisico: SOS, midia frontal leve, encerramento, cofre com `Video 1min 48s`, `1 video`, player unificado reproduzindo `0:23 / 1:46`.
- Ciclos curtos pos-rebuild confirmaram reuso de camera/microfone, finalizacao `Video protegido` 100%, fechamento correto do modal por `Continuar`, cofre com `Video 31s`/`1 video` e player final iniciando reproducao `0:01 / 0:29`.
- Inventario final saneado pos-rebuild: 418 arquivos, 375 `.sseg`, 22 `.nseg`, 0 midias claras persistentes `.mp4/.mov/.m4v/.3gp/.avi/.webm`.
- Estado posterior: Roberto executou e aprovou o teste manual; Frente 1.2 Android fechada para o MVP.

## Atualizacao tecnica - 2026-05-13 - pausa e higienizacao Android

- Roberto pausou a continuidade Android para atuar em demanda paralela do portal web governo/business. Nao executar nada de portal nesta frente.
- Higienizacao Android aplicada via `../../scripts/higienizar-reciclaveis-android.sh --select all --apply`.
- Removidos apenas reciclaveis Android listados pelo script: `.expo`, `android/.gradle`, `android/app/.cxx`, `android/app/build` e `android/build`.
- Espaco: 4.1 GiB livres antes, 6.6 GiB depois no relatorio do script, variacao real de 2.5 GiB; conferencia final posterior indicou 6.3 GiB livres e dry-run posterior nao encontrou reciclaveis Android.
- O APK local validado foi removido junto com `android/app/build`; o app instalado no Android fisico permanece como base para teste manual. Se precisar reinstalar, rebuild Android privado sera necessario.
- Checkpoint detalhado: `docs/35_CHECKPOINT_PAUSA_FRENTE_1_2_HIGIENIZACAO_ANDROID_2026-05-13.md`.

## Atualizacao tecnica - 2026-05-13 - Frente 1.2 Android aprovada por Roberto

- Roberto validou fisicamente as atualizacoes da Frente 1.2 no app e aprovou.
- Estado: Frente 1.2 fechada para escopo Android do MVP; iOS segue pos-MVP.
- Fechamento documentado em `docs/36_FECHAMENTO_FRENTE_1_2_ANDROID_2026-05-13.md`.
- Proxima frente recomendada: Frente 1.3 - perfis, familia, maioridade e papeis, antes de anjos/P2P/conveniados.

## Atualizacao tecnica - 2026-05-04

- `EmergencySettingsDrawer` recebe navegacao por painel: `Cofre` envia `/arquivos?painel=cofre` e `Player` envia `/arquivos?painel=player`.
- `app/arquivos.tsx` interpreta `painel` por `useLocalSearchParams` e abre o modal correspondente sem criar telas duplicadas.
- `BrandedDialog` usa backdrop pressionavel para fechar ao tocar fora; conteudo interno impede propagacao.
- `LocalEvidenceRail` abandonou a trilha horizontal e passou a usar grade vertical com acoes iconograficas por pacote.
- `PanicButton` mantem o anel SVG dentro da circunferencia do botao, com sentido horario para acionar e anti-horario para encerrar.

## Atualizacao tecnica - 2026-05-05 - checkpoint de pausa

- Implementacao pausada por pedido do Roberto para liberar espaco em disco.
- Nao rodar build ou instalacao Android ate nova autorizacao de continuidade.
- Ponto de retomada tecnico: revisar `EvidencePlayerCard`, `mediaCapture`, `types`, `LocalEvidenceRail`, `PanicButton`, `packagePresentation`, `contactMocks` e `scripts/smoke-test.mjs`.
- Risco tecnico principal ainda pendente: `mediaCapture` nao deve ler videos longos integralmente em Base64 para calcular hash; precisa limite e fallback de manifesto/hash tecnico ate streaming/chunking real.
- Retomar com validacao leve primeiro: `npm run typecheck`, `npm run lint`, `npm test`, `git diff --check`.

## Atualizacao tecnica - 2026-05-10 - Frente 1.2 checkpoint de interrupcao

- Mudancas ativas desta frente estao em encerramento SOS, recorder de midia, player, cofre/manifesto/envelope, busca de pacote seguro e scripts de build Android.
- `app/index.tsx` usa `FinishProgressDialog`, `mediaRecorderPackageId`, `mediaStopPending` e finalizacao visual imediata do chamado; a camera continua em paralelo para anexo tardio.
- `EmergencyMediaRecorder` usa segmento de 12s, bitrate alvo 650 kbps, qualidade 480p e perfil de compatibilidade por asset; Android tambem foi segmentado para reduzir espera maxima no stop.
- `PanicButton` usa `onLongPress` como fallback nativo e ref de disparo para impedir duplo acionamento.
- `EvidencePlayerCard` atualiza tempo/duracao via estado e polling mais frequente, corrigindo descompasso inicial da timeline.
- `SecureJsonStore.getSecureRecord` e `getEmergencyPackage` permitem operar por ID sem varrer todo o cofre seguro.
- `mediaInterfacePresentation` mostra `Processando` quando o pacote foi finalizado mas a midia ainda esta pendente.
- `app.json` e `prepare-android-bundled-debug.mjs` garantem `supportsPictureInPicture` para reduzir erro nativo ruidoso no player Android.
- Validacoes locais aprovadas antes da interrupcao: `npm run typecheck`, `npm run lint`, `npm test -- --runInBand`, `git diff --check`.
- APK atual para validacao fisica: `distribution/android/out/sinalseguro-android.apk`, SHA-256 `d00beb8f7b551300a1f750ca059ad294f040947d796868176124eb44003df9f4`.
- A correcao final ainda nao foi validada no aparelho; nao avancar arquitetura nem rede de anjos antes do teste fisico Android/iPhone.

## Atualizacao tecnica - 2026-05-10 - rota nativa salva

- `mediaCapture.preserveLocalVideoAsset` virou roteador: usa `SinalSeguroMediaEngine` para ativos novos quando disponivel e conserva o store JS por chunks como fallback legado.
- Contrato de midia foi versionado para `xchacha20poly1305` legado e `aes-256-gcm` nativo, com `processingState`, `storageEngine`, `playbackAdapter` e metadados futuros de envelope por destinatario.
- Android Kotlin deixou de usar leitura integral por `readBytes` e processa cifragem com stream em blocos, hashes incrementais e arquivos restritos ao sandbox privado.
- `openEncryptedAsset` nativo prepara um MP4 temporario reproduzivel em `cache/sinalseguro-native-media/playback` para o `expo-video`; `.nseg` nunca e entregue diretamente como fonte de video.
- `EvidencePlayerCard` diferencia fonte nativa, cache temporario e loopback legado; mostra preparo antes do play, agenda TTL de 10 minutos e limpa handle/cache em fechar, troca, background e timer.
- Home e Arquivos chamam `cleanupNativeMediaResidues()` na entrada para cobrir force stop/relaunch e temporarios nativos orfaos.
- `EmergencyMediaRecorder` emite estados explicitos de processamento para a UX de encerramento e para o cofre.
- `scripts/smoke-test.mjs` foi atualizado para bloquear regressao do caminho nativo, do cache de playback e da regra de loopback como fallback.
- Build Android privado final aprovado e instalado: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `5e664df9a9982569a0ce05e737af01fcc105057d892438e10ffbe07ac1f28afd`.
- Limite tecnico aberto: iOS nativo ainda precisa trocar leitura integral por fluxo segmentado antes de ser aprovado para videos longos.
