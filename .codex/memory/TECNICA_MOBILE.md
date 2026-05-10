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

- Validar manualmente no Android fisico o gesto SOS completo com camera em ambiente controlado.
- Evoluir adaptadores de outbox/API quando backend estiver pronto.
- Nao colocar blobs de midia no `SecureStore`; midia local deve permanecer em arquivo do sandbox do app com hash e criptografia por envelope na etapa de backend.

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
