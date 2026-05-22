# Memoria - Ada, Hedy e Margaret

Data: 2026-05-03  
Papel: arquitetura mobile React Native/Expo, SOS, Cofre e Android.

## Estado tecnico

- Atualizacao 2026-05-18 higienizacao Android: `adb mdns services` nao encontrou segundo Android; limpeza de regeneraveis liberou espaco de 3.3 GiB para 5.4 GiB.
- Removidos 38 itens regeneraveis Android, 0 falhas, incluindo `android/.gradle`, `android/app/.cxx`, `android/app/build`, `android/build`, duplicatas `* 2.*` e temporarios antigos `/private/tmp/sinalseguro-android-live-20260517*`.
- O APK local foi removido como artefato regeneravel; app `0.1.15` segue instalado no Android fisico. Novo deploy/publicacao exige rebuild Android privado.
- Checkpoint da etapa: `docs/74_CHECKPOINT_HIGIENIZACAO_REGENERAVEIS_ANDROID_2026-05-18.md`.

- Atualizacao 2026-05-18 pre-validacao unilateral Android: com apenas um Android em ADB, o app `0.1.15`/`versionCode 17` abriu via `am start -W` com `Status: ok`, processo ativo e `mFocusedApp` em `br.com.sinalseguro.app/.MainActivity`.
- `mCurrentFocus` permaneceu como `NotificationShade`, entao nao tratar como validacao visual de tela; log filtrado sem `FATAL EXCEPTION`, `AndroidRuntime` ou erro React Native fatal.
- Cameras ficaram sem cliente ativo; inventario saneado do sandbox apontou 26 arquivos, 0 midias claras persistentes, 0 `.nseg` e 0 `.sseg`.
- Checkpoint da etapa: `docs/73_CHECKPOINT_PRE_VALIDACAO_UNILATERAL_ANDROID_2026-05-18.md`.

- Atualizacao 2026-05-18 pre-validacao fisica live-call: repo limpo em `main`, ultimo commit `325571e`, e apenas um Android apareceu no ADB como `device`.
- Android detectado: `br.com.sinalseguro.app` `versionName=0.1.15`, `versionCode=17`; permissoes de camera, microfone, notificacoes e localizacao concedidas; app sem processo ativo no levantamento.
- Espaco local no Mac estava baixo, cerca de 3.3 GiB livres; evitar build Android pesado sem limpeza/necessidade.
- Checkpoint da etapa: `docs/72_CHECKPOINT_PRE_VALIDACAO_FISICA_LIVE_CALL_2026-05-18.md`.

- Atualizacao 2026-05-18 Etapa 1.5: adicionado gate `npm run test:live-call-security` em `scripts/live-call-sensitive-logging.test.ts`.
- O gate bloqueia regressao de logs runtime sensiveis em `useLiveAudioCall.ts`, `liveCallControl.ts` e `liveWebRtcSession.ts`, preservando apenas telemetria saneada `SinalSeguroLiveCall`.
- `npm test` agora inclui `test:live-call-security`; sem mudanca de UX, backend, portal, release, WebRTC runtime ou codigo nativo.
- Checkpoint da etapa: `docs/71_CHECKPOINT_ETAPA_1_5_LIVE_CALL_SECURITY_LOGGING_2026-05-18.md`.

- Atualizacao 2026-05-18 Etapa 1.4: regras puras WebRTC da live-call foram extraidas para `src/features/live-call/liveWebRtcPolicy.ts`.
- `src/services/liveWebRtcSession.ts` continua com efeitos nativos (`getUserMedia`, `RTCPeerConnection`, listeners, SDP/ICE e fechamento de tracks); sem mudanca de telas, UX, backend, portal, release ou runtime nativo.
- Novo gate `npm run test:live-webrtc` cobre modos audio/video, constraints, timeout, captura local, transceivers `recvonly`, estado ICE/conexao e escolha de stream remoto.
- Checkpoint da etapa: `docs/70_CHECKPOINT_ETAPA_1_4_LIVE_WEBRTC_POLICY_2026-05-18.md`.

- Atualizacao 2026-05-18 Etapa 1.3: regras puras de estado/ciclo da live-call foram extraidas para `src/features/live-call/liveCallStatePolicy.ts`.
- `useLiveAudioCall.ts` continua com WebRTC/polling/API/timers/auditoria; sem mudanca de layout, UX, backend, portal, release ou runtime nativo.
- Novo gate `npm run test:live-call-state` cobre estado inicial, chamada ativa, mensagens por papel, conexao/reconexao/falha, aceite de answer e stream remoto renderizado apenas quando a regra permitir.
- Checkpoint da etapa: `docs/69_CHECKPOINT_ETAPA_1_3_LIVE_CALL_STATE_POLICY_2026-05-18.md`.

- Atualizacao 2026-05-18 Etapa 1.2: regras puras da sessao live-call foram extraidas para `src/features/live-call/liveCallSessionPolicy.ts`.
- `useLiveAudioCall.ts` continua orquestrando WebRTC/polling/estado; sem mudanca de UX, backend, portal, release ou runtime nativo.
- Novo gate `npm run test:live-call-session` cobre SDP/ICE payload guards, eventos de auditoria por papel, evidencia local por papel, papel oposto e renderizacao de stream remoto apenas para anjo.
- Checkpoint da etapa: `docs/68_CHECKPOINT_ETAPA_1_2_LIVE_CALL_SESSION_POLICY_2026-05-18.md`.

- Atualizacao 2026-05-17 Etapa 1.1: o cliente API ganhou testes de contrato em `scripts/api-client-contract.test.ts` e `npm test` agora inclui `npm run test:api-client`.
- `SinalSeguroApiCore` recebe `ApiSessionSecretStore` por injecao; a implementacao real fica em `src/services/api/sessionStore.ts` usando `SecureStore` e a chave `api.session.v1`.
- `logout` nao tenta refresh quando a API retorna `401`; a sessao local e limpa no `finally`.
- Erros de API agora saneiam `Authorization`, access/refresh/id token, convite, segredo, senha, envelope cifrado, payload P2P, SDP e ICE candidate antes de popular `ApiRequestError.details`.
- Build Android debug bundled validado em `arm64-v8a`; APK local SHA-256 `a6c5fd8cb4947498c9b79087b699970df18edbde1e7f6ae36e7c25934404c69a`.
- Checkpoint da etapa: `docs/67_CHECKPOINT_ETAPA_1_1_TESTES_API_CLIENT_2026-05-17.md`.

- Atualizacao 2026-05-17: Etapa 1 da refatoracao mobile concluiu a separacao de `src/services/apiClient.ts` por dominios, mantendo a fachada publica compativel em `@/services/apiClient`.
- Novos modulos de API: `src/services/api/contracts.ts`, `core.ts`, `authClient.ts`, `devicesClient.ts`, `profilesClient.ts`, `contactsClient.ts`, `emergencyClient.ts`, `releasesClient.ts` e `utils.ts`.
- `SinalSeguroApiClient` continua expondo os mesmos metodos publicos e delega para clientes de dominio; nao alterar imports consumidores antes de nova etapa aprovada.
- `scripts/smoke-test.mjs` agora concatena os modulos de API para preservar o gate que antes lia apenas `apiClient.ts`.
- Build Android debug bundled desta etapa passou apos remover apenas duplicatas regeneraveis `* 2.*` em `android/app/build/intermediates`.
- Checkpoint da etapa: `docs/66_CHECKPOINT_ETAPA_1_API_CLIENT_DOMINIOS_2026-05-17.md`.

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

## Atualizacao tecnica - 2026-05-16 - recebimento de chamada e registro do anjo

- Tela `Alertas recebidos` passa a autoaceitar chamado SOS ativo recebido pelo anjo e criar registro local seguro em background.
- A tela do anjo dispara notificacao local de alta prioridade quando detecta chamado ativo recebido; push real com app fechado segue subfase futura de backend/FCM/Expo Push.
- Depois do registro local, o anjo inicia automaticamente o modo de acompanhamento ao vivo e fica aguardando a oferta WebRTC da pessoa protegida.
- A Home da pessoa protegida tenta iniciar automaticamente a videochamada quando o backend informa que o anjo aceitou; `Acompanhar ao vivo` fica como fallback manual.
- Atualizacao 2026-05-17: a Home tambem tenta sincronizar o pacote SOS ativo com a EC2 a cada 5 segundos enquanto nao houver `liveRemoteSessionId`, corrigindo o caso de SOS local sem sessao remota para o anjo receber.
- Validacao fisica 2026-05-17 em dois Androids: sessao `3b717e39-dfd8-459c-bc15-4176f1128463` ficou `active/accepted`, anjo abriu `Alertas recebidos`, chamada exibiu `Anjo na chamada`/`Atendendo como anjo` e depois encerrou como `finished/ended` na EC2.
- Sinalizacao P2P validada nessa sessao: `offer`/`ice` owner->angel e `answer`/`ice` angel->owner, com `senderDeviceId` e `recipientDeviceId` em ambos os sentidos.
- Hardening 2026-05-17: a Home limpa `liveRemoteSessionId` e estado WebRTC local quando nao existe SOS ativo; o card `Chamada com anjo` so aparece com SOS ativo relacionado.
- APK instalado no hardening visual: SHA-256 `475a462efeceead71baab0de7551e05aa8f8dacce895bd9e0c47528f7b334335`; validacao visual mostrou Home limpa sem card residual e EC2 com `0` sessoes ativas.
- Correcao 2026-05-17: chamada SOS agora preserva `remoteStream`/`remoteStreamUrl` no estado do anjo, evitando que a etapa posterior de aceite sobrescreva a midia recebida por `ontrack`.
- Validacao fisica 2026-05-17: owner USB transmitiu video/audio do SOS; anjo Wi-Fi exibiu o stream remoto com rotulo `Pessoa protegida`; logs confirmaram `remote_stream_track audio=1 video=1`, `VideoTrackAdapter` e audio `fine`.
- APK local instalado nessa validacao: SHA-256 `32cd04e6ba9859cfd9df23234911d8e44f66dadd2261c2c75bbf01c13aa40a40`, `versionName=0.1.8`, `versionCode=10`, `primaryCpuAbi=armeabi-v7a`; usar apenas para teste fisico local, release publica deve incluir `arm64-v8a`.
- EC2 apos validacao: sessao `9228ecac-1bb6-473d-ac95-4b4eeec9935c` encerrada como `finished/ended` e `0` sessoes ativas.
- Historico local `Chamadas registradas` usa `secureJsonStore` via `src/features/live-call/liveCallHistory.ts` e politica pura em `liveCallHistoryPolicy.ts`.
- Registro atual salva metadados operacionais locais: pessoa protegida, ocorrencia, snapshot textual, datas, duracao, status e regra de compartilhamento.
- Audio/video bruto da chamada WebRTC ainda nao e gravado como arquivo local; isso exige subfase nativa propria com consentimento, retencao, criptografia, exclusao, cadeia de custodia e validacao fisica.
- Validacoes aprovadas ate o checkpoint atual: `typecheck`, `smoke-test`, `lint`, `npm test`, `test:live-call-history`, build debug bundled e instalacao fisica em dois Androids.
- APK instalado na retomada: SHA-256 `253ca236b1e9f78d3d747d0caca18e475fdce937dd86dd5be8ae49e7b1062c49`, `versionName=0.1.8`, `versionCode=10`; output local removido depois por limpeza de regeneraveis.
- Checkpoint: `docs/57_CHECKPOINT_F4_3_RECEBIMENTO_CHAMADA_REGISTRO_2026-05-16.md`.

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

## Atualizacao tecnica - 2026-05-13 - Frente 1.3 iniciada

- Criado modulo puro `src/features/profiles/profilePolicy.ts` com regras testaveis para adulto, menor protegido, responsavel com menor e responsavel sem menor.
- Criado `src/features/profiles/profileStore.ts` usando `secureJsonStore` para persistir o perfil ativo local sem dados sensiveis.
- Criada tela `app/perfis.tsx` e rota `/perfis`; menu da Home passou a expor `Perfis`.
- `app/contatos.tsx` agora consulta `canCreateTrustedContactInvitation` antes de criar convite.
- `app/convite.tsx` agora consulta `canAcceptAngelInvitation` antes de aceitar convite como anjo.
- `scripts/profile-policy.test.ts` entrou no `npm test`; `scripts/smoke-test.mjs` passou a proteger esses gates.
- Gates aprovados: `test:profiles`, `typecheck`, `lint`, `smoke-test`, `npm test`, `private:android:readiness` condicionado e `git diff --check`.
- Esta fatia nao altera SOS, Cofre, Player, motor nativo, API real, P2P, upload, localizacao ao vivo ou iOS.

## Atualizacao tecnica - 2026-05-13 - Frente 1.3 backend publicado

- Backend `profiles` implementado em `services/api` com `UserProfile`, `ProtectedSubject`, `ResponsibleLink` e `ProfileAuthorization`.
- Rotas publicadas na EC2: `/api/profiles/me`, `/api/protected-subjects/`, `/api/responsible-links/`, `/api/profile-authorizations/`.
- `trusted_contacts` agora tem `protected_subject` nullable em contato/convite e `can_receive_location=False` por default.
- `apiClient.ts` sincroniza perfil com `/profiles/me`; `profileStore.ts` mapeia perfil local para o contrato da API; `invitationService.ts` sincroniza antes de criar convite backend.
- `responsible_with_minor` no mobile fica pendente para convite ate existir protegido, vinculo e autorizacao ativos na API.
- Deploy EC2 via `infra/aws/deploy-api.sh` aplicou `profiles.0001_initial` e `trusted_contacts.0002_profile_subject_and_location_default`.
- Backup EC2 pre-deploy: `/opt/sinalseguro-api/backups/sinalseguro_prod_before_front13_20260513-201501.dump`.
- Validacoes aprovadas: backend `check`, `test`, `spectacular`, `makemigrations --check`; mobile `typecheck`, `lint`, `smoke-test`, `npm test`, `private:android:readiness`, `git diff --check`.

## Atualizacao tecnica - 2026-05-13 - Frente 1.3 Android validada e release portal

- APK Android privado instalado no device fisico modelo `23129RA5FL` com identificador redigido: `distribution/android/out/sinalseguro-android.apk`, SHA-256 `19ad59c4b9c4c47c8316f3a24d354626ee11a3442be910841fcd1e73283cd08b`.
- O build completo multi-ABI falhou por falta de espaco em `:app:mergeDebugNativeLibs`; apos limpeza de regeneraveis/cache, foi gerado APK `arm64-v8a` para o device fisico conectado com `assembleDebug -PsinalBundleDebugJs=true -PreactNativeArchitectures=arm64-v8a`.
- Validacao ADB por deep links confirmou `/perfis`, `/contatos` e `/convite` com bloqueios esperados para perfil nao definido e convite ausente.
- Evidencias saneadas em `docs/evidencias/android/2026-05-13-frente-1-3-release-portal/`.
- Portal publico publicado com Android ativo em `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk`, QR estavel `https://www.sinalseguro.com.br/assets/app/sinalseguro-android-qr.svg`, versao `0.1.0` atualizada em `13/05/2026` e manifesto apenas Android.
- iPhone/iOS segue pos-MVP, sem release ativo no portal publico.
- Checkpoint: `docs/40_CHECKPOINT_FRENTE_1_3_ANDROID_RELEASE_PORTAL_2026-05-13.md`.
- Correcao posterior: APK/AAB/IPA privados nao devem ser versionados no Git; o APK Android fica como artefato local de deploy e publicacao EC2/portal com nome estavel `sinalseguro_android.apk`, enquanto QR estavel, manifesto, checksums, README e scripts permanecem versionados.
- Deploy do portal passa a validar existencia e SHA-256 do APK local antes de publicar a release.
- As telas publicas de download devem esconder termos internos, manter fluxo em ate tres interacoes e preservar QR Android/nome `sinalseguro_android.apk` estaveis entre atualizacoes.

## Atualizacao tecnica - 2026-05-14 - Governo/Business no cronograma do app

- As atualizacoes dos portais Governo/Business e do pacote Governo/PB nao bloqueiam a continuidade da Frente 1.3 Android.
- Android continua como foco do MVP; iPhone/iOS permanece pos-MVP.
- A proxima frente viavel apos a Frente 1.3 continua sendo anjos/convites, porque depende de perfis, vinculos, autorizacoes e consentimentos.
- Integracao com conveniados, orgaos publicos, smart cities e tornozeleira/proximidade fica em frente futura condicionada, nunca no MVP imediato.
- Gate Governo futuro: mesa tecnica, ACT/convênio/contrato, acordo de dados, RIPD/DPIA, homologacao, ePING/OpenAPI, RBAC/MFA, auditoria, protocolo humano de resposta, suporte, observabilidade e orgao competente.
- O app deve preservar contratos auditaveis, minimizacao, consentimentos versionados, logs saneados e feature flags desligadas por padrao para qualquer integracao publica futura.
- Checkpoint versionado: `docs/41_CRONOGRAMA_APP_INTEGRACAO_GOVERNO_2026-05-14.md`.

## Atualizacao tecnica - 2026-05-14 - refinamento UX fonte ampliada Frente 1.3

- Corrigida a causa provavel dos cortes com fonte `1.3`: line-height apertado e tiles reduzindo texto demais.
- Arquivos alterados: `src/components/StatusBanner.tsx`, `src/components/SafeScreen.tsx`, `src/components/ResourceTile.tsx` e `app/perfis.tsx`.
- Ajuste preserva contratos de backend, API, SOS, cofre, player, midia, localizacao, P2P, conveniados e iOS.
- Validacoes locais aprovadas com Node 22 apos restaurar `node_modules`: `typecheck`, `lint`, `test:profiles`, `npm test` e `git diff --check` dos arquivos alterados.
- `adb devices -l` nao listou aparelho no momento; validacao visual fisica com fonte `1.3` fica pendente antes de fechar a Frente 1.3 sem ressalvas.
- Checkpoint versionado: `docs/42_REFINAMENTO_UX_FRENTE_1_3_FONTE_2026-05-14.md`.

## Atualizacao tecnica - 2026-05-14 - APK novo da Frente 1.3 pronto para validacao fisica

- Retomada com especialistas Katia/Tereza, Tarcila/Lina/Eliane e Cristine/Lucena focou no gargalo de build Android e no checkpoint de continuidade.
- Limpeza controlada de reciclaveis Android pelo script versionado removeu somente `android/app/.cxx`, `android/app/build` e `android/build`.
- Build debug bundled Android aprovado com Node 22, `--max-workers=1`, sem paralelo e `arm64-v8a`: `BUILD SUCCESSFUL in 8m 49s`.
- APK atual: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `9497463b801c1fb6dacb5ed978391b07fa473abfdb7b56e895e4b3a75ffe3146`, tamanho `80610429 bytes`.
- `npm run private:android:readiness` aprovado com `0 pendencia(s)`.
- Bloqueio atual: ADB sem aparelho listado; macOS tambem nao mostrou Android/ADB/MTP no USB, e mDNS nao encontrou `_adb-tls-connect._tcp`.
- Nao fechar a Frente 1.3 sem ressalvas ate instalar esse APK no Android fisico e repetir a validacao visual das telas `Perfis e papeis`, `Anjos de confianca` e `Convite recebido` em fonte `1.0` e `1.3`.

## Atualizacao tecnica - 2026-05-14 - Frente 1.3 validada por Ze para teste manual

- Android fisico voltou por ADB; instalacao por USB ficou presa, mas instalacao via Wi-Fi com `adb install --no-streaming -r -d` funcionou.
- Durante a validacao visual, foi removida microcopy interna da UI publica em `app/perfis.tsx`: `Limites da Frente 1.3`/`P2P` virou `Limites de proteção` com linguagem de usuario final.
- Gates apos a microcopy: `typecheck`, `lint`, `test:profiles`, build Android debug bundled incremental e instalacao fisica.
- APK final validado: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `abaf6fc9331e01b121789452dd0bce5f660ae417c85247d10acecac2ad7f41d9`, tamanho `84594580 bytes`.
- Evidencias saneadas: `docs/evidencias/android/2026-05-14-frente-1-3-visual-final/`.
- Fonte `1.0` e `1.3` validadas em `Perfis e papeis`, `Anjos de confianca` e `Convite recebido`; fonte restaurada para `1.0`.
- Crash scan saneado sem `FATAL EXCEPTION`, `Fatal signal`, `ReactNativeJS Error`, `ANR in br.com.sinalseguro.app` ou `Process: br.com.sinalseguro.app`.
- Performance: cold start debug por deep link em `Anjos de confianca`/fonte `1.3` mediu `8.3s` e jank alto; registrar como hardening posterior, nao como bloqueio funcional desta fatia.
- Estado: Ze aprovou tecnicamente a Frente 1.3 Android para teste manual do Roberto; nao declarar fechamento definitivo sem aceite manual do Roberto.

## Atualizacao tecnica - 2026-05-14 - gate de acesso por login e permissoes

- Roberto solicitou que o app so permita acesso apos login, consentimentos e permissoes concedidas conforme LGPD.
- Implementado `AccessGate` no layout raiz (`app/_layout.tsx` + `src/features/access/AccessGate.tsx`).
- O Stack principal do app fica bloqueado ate existir sessao SinalSeguro com usuario, aceite de termos/privacidade/uso emergencial e permissoes de camera, microfone, localizacao em primeiro plano e notificacoes.
- Login Android usa Google Sign-In nativo e conta Google do aparelho quando `EXPO_PUBLIC_GOOGLE_OIDC_WEB_CLIENT_ID` esta carregado; o build confirmou carregamento de `.env.local`.
- Build privado debug bundled aprovado: APK `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `3f2d4b9ca6ba764979d4515d00712191fbda94dd0b164765e9d4ad9d70635897`, tamanho aproximado `81M`.
- Gates aprovados: `typecheck`, `lint`, `npm test`, `private:android:readiness`, build Android debug bundled e `git diff --check` dos arquivos alterados.
- Validacao fisica posterior concluida via ADB Wi-Fi: instalacao `Success`, gate bloqueou a Home sem login, login Google real liberou o app, relaunch manteve sessao e navegacao por Home, Anjos, Convite e Perfis funcionou.
- Evidencias saneadas: `docs/evidencias/android/2026-05-14-gate-login-permissoes-final/`.
- Crash scan saneado sem `FATAL EXCEPTION`, `Fatal signal`, `ReactNativeJS Error`, `ANR in br.com.sinalseguro.app` ou `Process: br.com.sinalseguro.app`.
- Portal publicado com APK Android privado atualizado em `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk`; QR estavel mantido em `/baixar/android`; release EC2 `/var/www/sinalseguro/releases/20260514T185240Z`.

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
# Atualizacao - 2026-05-15 - relacionamento anjo/protegido

- A tela `Anjos de confianca` agora depende de `apiClient.listTrustedContactRelationships()` para mostrar os dois lados do vinculo.
- Contrato esperado: `relationship_role` vale `owner` para o originador/protegido e `angel` para o recebedor que aceitou; `owner_display_name` e `contact_display_name` sao nomes publicos.
- `acceptBackendInvitation()` retorna o relacionamento aceito; apos sucesso, `app/convite.tsx` limpa o convite pendente e mostra `Voce e anjo`.
- A API nao deve devolver token claro, telefone, e-mail bruto, evidencia, localizacao ou midia nesse contrato.
- O teste fisico real ainda precisa de dois Androids ou do link recebido aberto no aparelho anjo; a ultima consulta em producao mostrou convites pendentes, sem `contact_user`.

# Atualizacao - 2026-05-15 - SOS offline e cache de vinculos

- `apiClient` transforma falha de rede em `ApiRequestError` com `status=0`; `AccessGate` preserva sessao local ja autenticada e so limpa sessao em `401`.
- Relacionamentos aceitos usam cache local criptografado em `src/features/invitations/trustedRelationshipStore.ts`.
- `app/convite.tsx` salva o relacionamento aceito assim que a API confirma o aceite; `app/contatos.tsx` mostra cache local quando a rede falha e busca contatos/convites/relacionamentos com `Promise.allSettled`.
- `app/index.tsx` inclui anjos aceitos no pacote SOS local via `listAcceptedOwnerRelationshipsForDelivery()`.
- `src/features/emergency/emergencySyncQueue.ts` enfileira pacote SOS finalizado e tenta sincronizar a sessao de emergencia com a EC2 quando o app volta ao foco.
- Build Android debug bundled `arm64-v8a` aprovado com APK SHA-256 `b941cc4839639a38fb0df22a20ab6ed11e4662dac85a184ef09ccf393b926def`.

# Atualizacao - 2026-05-16 - Android 0.1.4 anjos

- Android elevado para `versionName=0.1.4` e `versionCode=6`.
- APK debug bundled: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `93b06f022aac21ddf296eeaa34fc126ed353341c0cda7ebee311203d7ed05139`.
- Quem ja e anjo pode criar sua propria rede de anjos se o perfil adulto/responsavel permitir; o papel de anjo nao bloqueia `owner` em outro vinculo.
- `Anjos de confianca` sincroniza no foco, no foreground e a cada 15s, mostra `Meus anjos` e `Sou anjo`, e limpa pendencias locais quando o backend ja retornou aceite/revogacao.
- `Convite recebido > Ver meus vinculos` abre direto o painel `Sou anjo de`.

# Atualizacao - 2026-05-15 - Android 0.1.2

- Android elevado para `versionName=0.1.2` e `versionCode=4` para permitir update no app a partir da versao `0.1.1`.
- APK debug bundled `arm64-v8a`: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `1ee74e9dd3675a150f3a1264abf99437c494f268d0f63cde9a9bd6b1fb182539`.
- `aapt dump badging` confirmou `versionCode='4'`, `versionName='0.1.2'` e `targetSdkVersion='36'`.
- Artefato copiado para `distribution/android/out/sinalseguro-android.apk` e publicado no portal como `sinalseguro_android.apk`.
- ADB no Android fisico respondeu comandos curtos, mas travou em transferencias grandes; instalacao automatizada da `0.1.2` fica pendente.

# Atualizacao - 2026-05-15 - Android 0.1.3 update/anjo

- Android elevado para `versionName=0.1.3` e `versionCode=5`.
- APK debug bundled: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `36f8518b72ff5711ff65893b675db5b47d36ef185aa34bf790a7356e6c3f2ae2`.
- `GET /api/app-releases/current` agora pode ser consultado sem login para permitir aviso de update antes do gate de acesso; download continua restrito ao portal oficial validado no app.
- `RootLayout` mostra modal de update quando houver nova versao; `AccessGate` nao mostra o painel de login durante bootstrap.
- `app/contatos.tsx` sincroniza ao voltar ao foco para refletir aceite de convite em outro dispositivo.
- `TrustedContactRelationshipSerializer` nao envia `protected_subject` ao usuario que atua como anjo.
- Instalacao fisica ficou bloqueada: `adb install` travou e, apos reinicio do servidor ADB, o Android `23129RA5FL` ficou `offline`; nao publicar no portal ate reinstalar e validar.

# Atualizacao - 2026-05-17 - Android 0.1.11 SOS ao vivo

- Android elevado para `versionName=0.1.11` e `versionCode=13`.
- APK debug bundled multi-ABI: SHA-256 `2196c90158d6a521bc6f8f1bf9f78f922ba6dc264394544f512acc9222889145`.
- `emergencyPreferences` migrou o padrao local para camera traseira em `schemaVersion=9`.
- `LiveWebRtcSession` usa perfil 640x360, 12-15 fps, timeout de midia e logs saneados de conexao.
- `startOwnerAudioCall()` retorna booleano para permitir retry real.
- Handoff da camera local para WebRTC foi ampliado para 12s.
- Teste fisico confirmou owner transmitindo e anjo vendo `Pessoa protegida`.
- Release privada publicada no portal/backend: `download_url` com `?v=0.1.11-20260517T121152Z`, arquivo publico `sinalseguro_android.apk` validado com SHA-256 `2196c90158d6a521bc6f8f1bf9f78f922ba6dc264394544f512acc9222889145`.
- Apos a publicacao, historicos locais de teste foram limpos nos dois Androids e a EC2/API ficou sem sessoes/sinais/envelopes pendentes, preservando perfil e vinculos aceitos.
- Pendencia tecnica: gravacao audiovisual local completa da chamada ao vivo ainda requer pipeline unico de captura/gravacao WebRTC; a captura local concorrente pode encerrar sem arquivo quando a camera e entregue ao WebRTC.

# Atualizacao - 2026-05-18 - Android 0.1.15 rebuild unilateral

- `../../scripts/gerar-aplicativo.sh privado --overwrite --install` aprovou typecheck, lint, npm test, build Android privado e readiness privado condicionado.
- APK regenerado em `distribution/android/out/sinalseguro-android.apk`, SHA-256 `b4f58d1d322a890da5dab0e717d0c81ceb4fb897fb91ef96ae34522b2e1c664c`.
- Instalacao ADB confirmou `versionName=0.1.15`, `versionCode=17`, `lastUpdateTime=2026-05-18 07:07:46`.
- Validacao visual unilateral confirmou Home/SOS pronta em um Android; segundo Android continuou ausente no ADB/mdns, entao SOS/anjo fim a fim e publicacao final seguem bloqueados.
- Pos-build limpou novamente `android/.gradle`, `android/app/.cxx`, `android/app/build` e `android/build`, recuperando espaco de cerca de 361 MiB para 2.9 GiB e preservando o APK final.
- Checkpoint: `docs/75_CHECKPOINT_ANDROID_0_1_15_REBUILD_INSTALACAO_UNILATERAL_2026-05-18.md`.

# Atualizacao - 2026-05-18 - gate dois Androids bloqueado

- ADB mostrou duas entradas, mas ambas eram o mesmo Android por USB e Wi-Fi/mDNS: mesmo `serialno`, modelo, `android_id` e IP interno.
- O macOS enumerou apenas um Android/Redmi no USB; apos reiniciar o ADB e limpar a duplicidade, restou um aparelho real.
- App no aparelho visivel: `versionName=0.1.15`, `versionCode=17`, `lastUpdateTime=2026-05-18 07:07:46`.
- Nao executar teste SOS/anjo nem publicar release validada ate haver dois Androids distintos em `adb devices -l`.
- Checkpoint: `docs/76_CHECKPOINT_GATE_DOIS_ANDROIDS_BLOQUEADO_DUPLICIDADE_ADB_2026-05-18.md`.

# Atualizacao - 2026-05-18 - SOS/anjo validado em dois Androids

- Dois Androids distintos ficaram disponiveis em ADB: `0123456789ABCDEF` e `5686add7`; a entrada Wi-Fi/mDNS do Redmi deve continuar sendo tratada como transporte duplicado.
- Ambos confirmaram `versionName=0.1.15` e `versionCode=17`.
- ADB long press em `PanicButton` nao e um mecanismo confiavel de teste para iniciar SOS; `swipe`/`motionevent` nao acionaram o estado visual de pressao, embora taps comuns funcionem.
- O acionamento fisico real validou o fluxo principal: `0123456789ABCDEF` como solicitante transmitindo e `5686add7` como anjo acompanhando video em tempo real.
- O anjo exibiu `Acompanhando SOS` e video remoto com rotulo `Pessoa protegida`; o solicitante exibiu `Transmitindo ao anjo`.
- A chamada foi encerrada e o SOS foi finalizado com `Video protegido 100%`; a Home do solicitante voltou para `SOS` com `Chamado encerrado. Video preservado no cofre local`.
- O anjo manteve registro finalizado com snapshot/duracao em `Alertas recebidos`.
- Proxima etapa tecnica: auditoria media EC2/API para confirmar metadados de sessao/destinatario/sinais/encerramento e ausencia de midia bruta no backend antes de publicar nova release como final.

# Atualizacao - 2026-05-18 - Android 0.1.15 publicado apos auditoria media

- Auditoria EC2/API confirmou `sinalseguro-api` ativo, health `/api/health/ready` OK, sem sessoes ativas, sem envelopes ao vivo ativos, sem sinais validos pendentes e sem arquivos de midia bruta em `/opt/sinalseguro-api/media`.
- Sinais P2P efemeros residuais foram limpos com `cleanup_ephemeral_controls --signal-grace-minutes 0`, preservando auditoria minima de sessoes/envelopes.
- Portal publicado em `/var/www/sinalseguro/releases/20260518T112908Z`.
- APK privado Android mantem nome publico estavel `sinalseguro_android.apk`.
- Endpoint de update e portal apontam `0.1.15` / `versionCode=17`, cache-buster `0.1.15-20260518T112447Z` e SHA-256 `b4f58d1d322a890da5dab0e717d0c81ceb4fb897fb91ef96ae34522b2e1c664c`.
- Download real do APK publicado bateu o SHA-256 esperado.
- Observacao tecnica: dispositivos ja instalados com `versionCode=17` nao devem receber modal de update para a mesma versao; usar aparelho em codigo menor ou nova versao numericamente superior para validar o modal.

# Atualizacao - 2026-05-18 - Etapa 1.6 Home/SOS

- `src/features/emergency-home/panicTriggerPolicy.ts` centraliza a decisao do botao SOS e o rotulo do `PanicButton`.
- `app/index.tsx` continua como orquestrador, mas deixa de conter inline a politica de duplo acionamento, midia pendente, encerramento, consentimento e inicio do SOS.
- Novo gate `npm run test:panic-trigger` cobre as transicoes puras sem abrir camera, WebRTC, API, UI ou backend.
- `npm test` e `scripts/smoke-test.mjs` exigem a politica pura para evitar regressao para regra inline na Home.
- Proxima fatia recomendada: politica pura de mensagens/estado da sincronizacao remota do SOS ativo, sem alterar UX.

# Atualizacao - 2026-05-18 - Etapa 1.7 Home/SOS

- `src/features/emergency-home/remoteSyncStatusPolicy.ts` centraliza mensagens e decisao visual da sincronizacao remota do SOS ativo.
- `app/index.tsx` usa `resolveActiveRemoteSyncStatus()` para atualizar mensagem, `remoteSessionId` e inicio de evidencia de chamada ao vivo sem manter essa regra inline.
- Novo gate `npm run test:remote-sync-status` cobre pluralizacao de anjos, estado aguardando anjo, bloqueio por login e mensagem de retry.
- `npm test` e `scripts/smoke-test.mjs` exigem a politica pura para evitar regressao na Home.
- Proxima fatia recomendada: politica pura de autochamada do solicitante apos aceite do anjo, sem mover WebRTC runtime.

# Atualizacao - 2026-05-18 - Etapa 1.8 Home/SOS

- `src/features/emergency-home/ownerAutoCallPolicy.ts` centraliza a decisao de autochamada do solicitante apos aceite do anjo.
- `app/index.tsx` continua chamando `listAcceptedLiveRecipients()`, `prepareMediaForOwnerLiveCall()` e `liveAudioCall.startOwnerAudioCall()`, mas a regra de tentativa/pausa/ja-iniciado ficou testavel fora da Home.
- Novo gate `npm run test:owner-auto-call` cobre chamada ja ativa, tentativa cancelada, pausada, ja iniciada, em voo, ausencia de sessao e existencia de anjo aceito.
- `npm test` e `scripts/smoke-test.mjs` exigem a politica pura para evitar regressao na Home.
- Proxima mudanca em WebRTC runtime, camera, `app/alerta.tsx`, encerramento do SOS ou midia local deve exigir validacao fisica Android.

# Atualizacao - 2026-05-18 - Etapa 1.9 validacao Android da refatoracao Home/SOS

- Refatoracoes puras das etapas 1.6, 1.7 e 1.8 foram revalidadas por build e instalacao em dois Androids fisicos.
- Build multi-ABI inicial falhou por falta de espaco, nao por erro de codigo; build debug local focado em `armeabi-v7a` passou com `BUILD SUCCESSFUL`.
- O APK local de QA manteve `br.com.sinalseguro.app`, `versionName=0.1.15`, `versionCode=17` e SHA-256 `e6348935dcf864070323e3d16e5a6e0a505d91aee539903422ad87398ad67189`.
- Instalacao via ADB funcionou em `0123456789ABCDEF` e `5686add7`.
- Evidencias visuais preservadas em `docs/evidencias/android/2026-05-18-refatoracao-home-sos-validacao/`.
- Este APK 32-bit e somente evidencia de QA local; release publica exige build adequado multi-ABI, Node compativel com o gate publico e espaco local suficiente.

# Atualizacao - 2026-05-18 - Etapa 1.10 Home/SOS

- `src/features/emergency-home/mediaProcessingStatusPolicy.ts` centraliza mensagens e progresso visual do processamento de midia durante encerramento e handoff para chamada ao vivo.
- `app/index.tsx` continua responsavel pelos side effects, mas deixou de manter inline os textos e percentuais do processamento de midia.
- Novo gate `npm run test:media-processing-status` cobre estados que liberam waiter, mensagens de handoff, titulos/detalhes/progresso/status do modal e estados de erro/sem midia.
- `npm test` e `scripts/smoke-test.mjs` exigem a politica pura para evitar regressao na Home.
- Proxima fatia recomendada: politica pura do resultado final de encerramento do SOS, mantendo efeitos assincronos no orquestrador.

# Atualizacao - 2026-05-18 - Etapa 1.11 Home/SOS

- `src/features/emergency-home/finishOutcomePolicy.ts` centraliza a decisao final do encerramento do SOS: evidencia protegida, confirmacao pendente, video local pendente, verificacao pendente, somente metadados ou pacote encerrado sem video.
- `app/index.tsx` continua responsavel pelos efeitos reais de UI, evidencia local, auditoria, diagnostico saneado e progresso final.
- Novo gate `npm run test:finish-outcome` cobre os principais caminhos sem abrir camera, WebRTC, API, arquivo local ou backend.
- `npm test` e `scripts/smoke-test.mjs` exigem a politica pura para evitar regressao para regra inline na Home.
- Proxima fatia recomendada: reduzir a preparacao/entrega de midia para chamada ao vivo com policy pura, mantendo camera, WebRTC e auditoria no orquestrador.

# Atualizacao - 2026-05-18 - Etapa 1.12 Home/SOS

- `src/features/emergency-home/mediaHandoffPolicy.ts` centraliza a decisao de preparar ou bloquear o handoff de camera/microfone locais para chamada ao vivo.
- `app/index.tsx` continua responsavel por `signalMediaRecorderStop`, espera da liberacao da camera, flags locais, auditoria, logs saneados e WebRTC.
- Novo gate `npm run test:media-handoff` cobre pacote ausente, captura ja bloqueada, plataforma web, captura local desativada e caminho permitido.
- `npm test` e `scripts/smoke-test.mjs` exigem a politica pura para evitar regressao para regra inline na Home.
- Proxima mudanca operacional em camera, WebRTC, renderizacao ou UX de chamada deve repetir validacao fisica Android.

# Atualizacao - 2026-05-18 - Etapa 1.13 Home/SOS

- `src/features/emergency-home/ownerLiveEvidencePolicy.ts` centraliza a decisao de iniciar a evidencia local da videochamada no aparelho solicitante.
- `app/index.tsx` continua responsavel por `startOwnerLiveVideoEvidence()` e por todos os efeitos reais de camera, gravacao, WebRTC, evidencia, auditoria e logs.
- Novo gate `npm run test:owner-live-evidence` cobre papel incorreto, sessao ausente, pacote ausente, stream ausente, status inativo e caminho permitido com dados atuais ou fallback.
- `npm test` e `scripts/smoke-test.mjs` exigem a politica pura para evitar regressao para regra inline na Home.
- Proxima mudanca operacional em camera, WebRTC, renderizacao ou UX de chamada deve repetir validacao fisica Android.

# Atualizacao - 2026-05-18 - Etapa 1.14 Home/SOS

- `src/features/emergency-home/ownerLiveEvidencePolicy.ts` tambem centraliza a decisao do ciclo `connected`/`failed`/`ended` da chamada owner.
- `app/index.tsx` continua responsavel por limpar tentativa de autochamada, parar evidencia local, gerar timestamp e atualizar evidencia.
- `npm run test:owner-live-evidence` cobre agora inicio da evidencia e lifecycle owner no mesmo gate.
- `npm test` e `scripts/smoke-test.mjs` exigem a politica pura para evitar regressao para regra inline na Home.
- Proxima mudanca operacional em camera, WebRTC, renderizacao ou UX de chamada deve repetir validacao fisica Android.

# Atualizacao - 2026-05-18 - Etapa 1.15 validacao Android das policies Home/SOS

- Pos-refatoracao das policies puras ate Etapa 1.14 foi validada em dois Androids fisicos distintos.
- Build multi-ABI estourou espaco no Mac durante `stripDebugDebugSymbols`; solucao operacional segura foi build por ABI.
- Artefatos de QA local:
  - `armeabi-v7a`: SHA-256 `01be88bec3e3bad7e142799dfa176201d557730408a09cf393b34ebb99185538`;
  - `arm64-v8a`: SHA-256 `131d8a96a60590e91811f85696539a5e8a296087e424fcf044c9e145d4b49961`.
- Ambos instalaram como `br.com.sinalseguro.app` `0.1.15`/`versionCode=17`.
- Redmi 64-bit abriu diretamente na Home SOS; Android 32-bit exigiu cerca de 55s para sair do splash/loading, mas chegou na Home SOS.
- Para proximas fatias, manter o Android 32-bit como sentinela de startup/performance; mudancas em runtime de SOS/camera/WebRTC/gravacao exigem teste fisico owner -> anjo.

# Atualizacao - 2026-05-18 - Etapa 1.16 Home/SOS

- `src/features/emergency-home/liveCallCleanupPolicy.ts` centraliza a decisao de limpar estado de chamada ao vivo quando nao ha pacote ativo nem transicao operacional em andamento.
- `app/index.tsx` continua responsavel pelos efeitos reais: limpar refs de autochamada, limpar sessao remota local, resetar chamada idle ou parar chamada ativa/orfa.
- Novo gate `npm run test:live-call-cleanup` cobre pacote ativo, inicio, midia pendente, encerramento, nada a limpar, reset idle e stop de chamada ativa.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline.
- Sem build Android nesta fatia por ser refatoracao pura; proxima mudanca operacional em chamada/camera/WebRTC/gravacao/UX deve repetir validacao fisica.

# Atualizacao - 2026-05-18 - Etapa 1.17 Home/SOS

- `src/features/emergency-home/finishRequestPolicy.ts` centraliza a decisao anterior ao encerramento real: ignorar, abrir confirmacao por codigo ou finalizar direto.
- `app/index.tsx` continua responsavel pelos efeitos reais de limpar formulario, abrir modal e chamar `handleFinishActiveCall()`.
- Novo gate `npm run test:finish-request` cobre ausencia de pacote, encerramento em andamento, ref interno em andamento, confirmacao por codigo e finalizacao direta.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline.
- Sem build Android nesta fatia por ser refatoracao pura; proxima mudanca operacional em chamada/camera/WebRTC/gravacao/UX deve repetir validacao fisica.

# Atualizacao - 2026-05-18 - Etapa 1.18 Home/SOS

- `src/features/emergency-home/emergencyStartPolicy.ts` centraliza a decisao inicial do SOS: pacote local, captura de localizacao, consentimento, atalho telefonico emergencial e mensagem inicial.
- `app/index.tsx` continua responsavel pelos efeitos reais de criar pacote, abrir discador, sincronizar backend, registrar auditoria saneada e atualizar estados.
- Novo gate `npm run test:emergency-start` cobre Android/web, chamada emergencial, localizacao capturada/nao registrada e duracao da gravacao.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline.
- Sem build Android nesta fatia por ser refatoracao pura; proxima mudanca operacional em chamada/camera/WebRTC/gravacao/UX deve repetir validacao fisica.

# Atualizacao - 2026-05-18 - Etapa 1.19 Home/SOS

- `src/features/emergency-home/mediaProcessingStatusPolicy.ts` tambem centraliza a decisao de settlement da parada de midia: serial valido, asset anexado, refresh do outbox, mensagem final e modal `Video protegido`.
- `app/index.tsx` continua responsavel pelos efeitos reais de resolver waiter, registrar auditoria, atualizar outbox/status/modal e concluir promessa pendente do gravador.
- `npm run test:media-processing-status` cobre agora processamento de midia e settlement da parada no mesmo gate.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline.
- Sem build Android nesta fatia por ser refatoracao pura; proxima mudanca operacional em chamada/camera/WebRTC/gravacao/UX deve repetir validacao fisica.

# Atualizacao - 2026-05-18 - Etapa 1.20 Home/SOS

- `src/features/emergency-home/finishCodePolicy.ts` centraliza a decisao da confirmacao de encerramento por codigo: finalizar ou mostrar erro mantendo o chamado ativo.
- `app/index.tsx` continua responsavel por verificar o codigo, atualizar erro e chamar o encerramento real.
- Novo gate `npm run test:finish-code` cobre codigo ausente, incorreto, bloqueado, correto e encerramento sem codigo.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline.
- Sem build Android nesta fatia por ser refatoracao pura; proxima mudanca operacional em chamada/camera/WebRTC/gravacao/UX deve repetir validacao fisica.

# Atualizacao - 2026-05-18 - Etapa 1.21 Home/SOS

- `src/features/emergency-home/protectedRouteCodePolicy.ts` centraliza a decisao de rota protegida por codigo: ignorar ausencia de solicitacao, bloquear com erro ou liberar acesso e navegar.
- `app/index.tsx` continua responsavel por verificar o codigo, limpar campos, desbloquear sessao protegida e navegar.
- Novo gate `npm run test:protected-route-code` cobre ausencia de rota, codigo ausente, incorreto, bloqueado e correto.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline.
- Sem build Android nesta fatia por ser refatoracao pura; proxima mudanca operacional em chamada/camera/WebRTC/gravacao/UX deve repetir validacao fisica.

# Atualizacao - 2026-05-18 - Etapa 1.22 validacao Android da consolidacao Home/SOS

- As etapas 1.20 e 1.21 foram consolidadas em dois Androids fisicos conectados por USB: `0123456789ABCDEF` e `5686add7`.
- APK local de QA `br.com.sinalseguro.app` ficou em `versionName=0.1.15`, `versionCode=17`, SHA-256 `328de08508081a8d8696241cdacf206edd6bb8c447ffa05abb1de263765e8e63`, com ABIs `armeabi-v7a` e `arm64-v8a`.
- A Home/SOS abriu nos dois aparelhos com estado pronto, identidade visual preservada e sem sobreposicao relevante.
- Startup observado: `WaitTime=9374ms` no Android 32-bit e `WaitTime=2898ms` no Redmi 64-bit.
- Performance em tela estavel manteve o Android 32-bit como sentinela: 21,27% janky contra 0,60% no Redmi.
- Proxima recomendacao tecnica: seguir com duas fatias puras da Home/SOS antes de nova mudanca operacional; liberar espaco local antes de outro build pesado.

# Atualizacao - 2026-05-18 - Etapa 1.23 Home/SOS

- `src/features/emergency-home/liveCallPanelPolicy.ts` centraliza a decisao de exibicao/entrada do painel de chamada ao vivo.
- `app/index.tsx` continua responsavel por WebRTC, camera, gravacao, auditoria e callbacks reais; a policy decide renderizacao, faixa de status, afastamento do recorder e bloqueio do botao primario.
- Novo gate `npm run test:live-call-panel` cobre ausencia de pacote, pacote sem chamada, chamada aguardando com sessao remota, bloqueios por encerramento/midia pendente e chamada conectada sem sessao remota.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline.
- Sem build Android nesta fatia por ser refatoracao pura; proxima mudanca operacional em chamada/camera/WebRTC/gravacao/UX deve repetir validacao fisica.

# Atualizacao - 2026-05-18 - Etapa 1.24 Home/SOS

- `src/features/emergency-home/localSosPackageStatusPolicy.ts` centraliza mensagens recorrentes do estado local do pacote SOS.
- `app/index.tsx` continua responsavel pelos efeitos reais de inicio, recuperacao, gravacao ao vivo, preservacao, encerramento e erro.
- Novo gate `npm run test:local-sos-package-status` cobre mensagens de pronto, recuperacao, chamada gravando, chamada preservada, protecao de video, inicio, falha de inicio, encerramento, chamado ausente e falha de encerramento.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para mensagens inline.
- Sem build Android nesta fatia por ser refatoracao pura; proxima mudanca operacional em chamada/camera/WebRTC/gravacao/UX deve repetir validacao fisica.

# Atualizacao - 2026-05-18 - Etapa 1.25 Home/SOS

- `src/features/emergency-home/emergencyCallConfirmationPolicy.ts` centraliza a apresentacao da confirmacao de ligacao emergencial.
- `app/index.tsx` continua responsavel pelo efeito real de `Linking.openURL(target.callUri)`.
- Novo gate `npm run test:emergency-call-confirmation` cobre o modal de ligacao para alvo emergencial.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline.
- Sem build Android nesta fatia por ser refatoracao pura; ADB retornou somente Redmi via Wi-Fi/mDNS nesta rodada.

# Atualizacao - 2026-05-18 - Etapa 1.26 Home/SOS

- `src/features/emergency-home/protectedRouteAccessPolicy.ts` centraliza a decisao inicial de acessar rota protegida ou solicitar codigo.
- `app/index.tsx` continua responsavel por `isProtectedAccessUnlocked()`, `unlockProtectedAccess()` e navegacao real.
- Novo gate `npm run test:protected-route-access` cobre codigo exigido/bloqueado, codigo exigido/desbloqueado e rota sem codigo exigido.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline.
- Sem build Android nesta fatia por ser refatoracao pura; proxima mudanca operacional em chamada/camera/WebRTC/gravacao/UX deve repetir validacao fisica owner -> anjo.

# Atualizacao - 2026-05-18 - Etapa 1.27 Home/SOS

- `src/features/emergency-home/interruptedRecoveryProgressPolicy.ts` centraliza mensagens de progresso da recuperacao de chamado interrompido e de residuo temporario privado.
- `app/index.tsx` continua responsavel pelos efeitos reais de recuperacao, criptografia, cofre local, auditoria e limpeza de flags de captura.
- Novo gate `npm run test:interrupted-recovery-progress` cobre recuperacao com video, recuperacao sem video e progresso de recuperacao de residuo.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para mensagem inline na Home.
- Sem build Android nesta fatia por ser refatoracao pura; ADB confirmou um Android USB e um Redmi Wi-Fi/mDNS duplicado no inicio da rodada.

# Atualizacao - 2026-05-18 - Etapa 1.28 Home/SOS

- `src/features/emergency-home/finishFlowProgressPolicy.ts` centraliza mensagens de progresso do encerramento do chamado.
- `app/index.tsx` continua responsavel pelos efeitos reais de parada de camera, settlement do recorder, anexacao de midia, cofre local, fila de sincronizacao, backend e WebRTC.
- Novo gate `npm run test:finish-flow-progress` cobre protecao de midia em andamento, encerramento solicitado, camera sinalizada, settlement com/sem midia, pacote ausente, sincronizacao remota e falha.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para mensagem inline na Home.
- Sem build Android nesta fatia por ser refatoracao pura; proxima mudanca operacional em chamada/camera/WebRTC/gravacao/UX deve repetir validacao fisica owner -> anjo.

# Atualizacao - 2026-05-18 - Etapa 1.29 Home/SOS

- `src/features/emergency-home/recordingConsentDialogPolicy.ts` centraliza a apresentacao do modal de consentimento de gravacao.
- `app/index.tsx` continua responsavel pelo efeito real de navegar para `/configuracoes` quando o usuario decide abrir os termos.
- Novo gate `npm run test:recording-consent-dialog` cobre titulo, mensagem e labels do modal.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para apresentacao inline na Home.
- Sem build Android nesta fatia por ser refatoracao pura; proxima mudanca operacional em chamada/camera/WebRTC/gravacao/UX deve repetir validacao fisica.

# Atualizacao - 2026-05-18 - Etapa 1.30 Home/SOS

- `src/features/emergency-home/emergencyStartFailureDialogPolicy.ts` centraliza a apresentacao do modal de falha ao iniciar chamado.
- `app/index.tsx` continua responsavel pelos efeitos reais de registrar erro, limpar pacote ativo, status local e iconografia do modal.
- Novo gate `npm run test:emergency-start-failure-dialog` cobre titulo, mensagem e label de confirmacao.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para apresentacao inline na Home.
- Sem build Android nesta fatia por ser refatoracao pura; manter duas fatias por rodada ate a proxima mudanca operacional.

# Atualizacao - 2026-05-18 - Etapa 1.31 Home/SOS

- `src/features/emergency-home/protectedRouteDialogPolicy.ts` centraliza a apresentacao do dialogo de rota protegida.
- `app/index.tsx` continua responsavel pelos efeitos reais de verificacao criptografica, lockout, desbloqueio e navegacao.
- Novo gate `npm run test:protected-route-dialog` cobre titulo, mensagem, labels, placeholder e accessibility label.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para apresentacao inline na Home.
- Sem build Android nesta fatia por ser refatoracao pura.

# Atualizacao - 2026-05-18 - Etapa 1.32 Home/SOS

- `src/features/emergency-home/finishConfirmationDialogPolicy.ts` centraliza a apresentacao do dialogo de encerramento por codigo.
- `app/index.tsx` continua responsavel pelos efeitos reais de verificacao criptografica e encerramento seguro do chamado.
- Novo gate `npm run test:finish-confirmation-dialog` cobre titulo, mensagem, labels, placeholder e accessibility label.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para apresentacao inline na Home.
- Sem build Android nesta fatia por ser refatoracao pura; segundo bloco autorizado pode prosseguir automaticamente se os gates permanecerem verdes.

# Atualizacao - 2026-05-18 - Etapa 1.33 Home/SOS

- `src/features/emergency-home/liveCallWaitingDialogPolicy.ts` centraliza a apresentacao do dialogo de chamada aguardando anjo.
- `app/index.tsx` continua responsavel pelos efeitos reais de preparar midia e iniciar WebRTC quando existe sessao remota.
- Novo gate `npm run test:live-call-waiting-dialog` cobre titulo, mensagem e label de confirmacao.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para apresentacao inline na Home.
- Sem build Android nesta fatia por ser refatoracao pura.

# Atualizacao - 2026-05-18 - Etapa 1.34 Home/SOS

- `src/features/emergency-home/emergencyHomeActivityPolicy.ts` centraliza a decisao de wake lock emergencial, estado visual ativo e faixa de status ativa.
- `app/index.tsx` continua responsavel por renderizar `EmergencyRecordingWakeLock`, `EmergencyTopBar`, `BrandBackground`, `PanicButton` e status band.
- Novo gate `npm run test:emergency-home-activity` cobre repouso, pacote ativo, midia pendente e encerramento em andamento.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para booleanos inline na Home.
- Sem build Android nesta fatia por ser refatoracao pura; proxima mudanca operacional exige validacao fisica/performance proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.35 Home/SOS

- `src/features/emergency-home/emergencyCallHeroPolicy.ts` centraliza a apresentacao de acessibilidade do numero emergencial no modal de chamada.
- `app/index.tsx` continua responsavel por renderizar o `CallNumberHero` e executar `Linking.openURL(target.callUri)`.
- Novo gate `npm run test:emergency-call-hero` cobre hint e label acessivel.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para acessibilidade inline na Home.
- Sem build Android nesta fatia por ser refatoracao pura.

# Atualizacao - 2026-05-18 - Etapa 1.36 Home/SOS

- `src/features/emergency-home/finishProgressDialogPolicy.ts` centraliza a apresentacao do dialogo de progresso do encerramento.
- `app/index.tsx` continua responsavel por renderizar `FinishProgressDialog`, aplicar `theme`, fechar quando permitido e abrir o cofre.
- Novo gate `npm run test:finish-progress-dialog` cobre progresso normalizado, dismiss, icone, tom, texto pendente e labels das acoes.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para apresentacao inline no dialogo.
- Sem build Android nesta fatia por ser refatoracao pura; proxima mudanca operacional exige validacao fisica/performance proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.37 Home/SOS

- `src/features/emergency-home/finishProgressStatePolicy.ts` centraliza estado inicial, merge/clamp de progresso, fechamento e ocultacao ao abrir o cofre.
- `app/index.tsx` continua responsavel pelos efeitos reais de encerramento, cofre local, midia, backend e WebRTC.
- Novo gate `npm run test:finish-progress-state` cobre clamp, preservacao de estado em progresso, reset permitido e ocultacao do modal.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline no estado do modal.
- Sem build Android nesta fatia por ser refatoracao pura.

# Atualizacao - 2026-05-18 - Etapa 1.38 Home/SOS

- `src/features/emergency-home/homeNavigationPolicy.ts` centraliza a decisao de navegacao entre rota simples e `/arquivos` com painel.
- `app/index.tsx` continua responsavel por fechar o menu e executar `router.push()`.
- Novo gate `npm run test:home-navigation` cobre abertura do cofre, rota de arquivos sem painel e rota simples ignorando painel indevido.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para navegacao inline na Home.
- Sem build Android nesta fatia por ser refatoracao pura; manter validacao fisica/performance para qualquer mudanca operacional.

# Atualizacao - 2026-05-18 - Etapa 1.39 Home/SOS

- `src/features/emergency-home/mediaStopPendingPolicy.ts` centraliza a decisao de marcar midia pendente e limpar `mediaRecorderPackageId` somente quando a liberacao real exige.
- `app/index.tsx` continua responsavel por refs, estado React e efeitos reais do fluxo de midia.
- Novo gate `npm run test:media-stop-pending` cobre pendencia ativa, liberacao com limpeza e flag sem limpeza.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline na Home.
- Sem build Android nesta fatia por ser refatoracao pura.

# Atualizacao - 2026-05-18 - Etapa 1.40 Home/SOS

- `src/features/emergency-home/ownerLiveAuditMarkerPolicy.ts` centraliza o payload de auditoria local do solicitante na chamada ao vivo.
- `app/index.tsx` continua responsavel por obter device id e chamar `recordLiveAuditMarker()`.
- Novo gate `npm run test:owner-live-audit-marker` cobre evento com evidencias locais e evento sem status opcional.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para montagem inline do payload owner.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em auditoria/backend deve repetir validacao fisica/API proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.41 Home/SOS

- `src/features/emergency-home/mediaReleaseWaiterPolicy.ts` centraliza a decisao de resolver requisicao anterior e o payload de timeout da liberacao de midia para chamada ao vivo.
- `app/index.tsx` continua responsavel por `setTimeout`, refs, promise e `appendMediaOperationalLog()`.
- Novo gate `npm run test:media-release-waiter` cobre requisicao anterior ausente/presente e timeout de liberacao.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline no waiter.
- Sem build Android nesta fatia por ser refatoracao pura.

# Atualizacao - 2026-05-18 - Etapa 1.42 Home/SOS

- `src/features/emergency-home/mediaStopWaiterPolicy.ts` centraliza resolucao de requisicao anterior, resultado de erro controlado e timeout de parada do recorder.
- `app/index.tsx` continua responsavel por `setTimeout`, refs, promise, log operacional e ordem de parada antes de finalizar pacote.
- Novo gate `npm run test:media-stop-waiter` cobre requisicao anterior, serial divergente e timeout valido.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline no waiter.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional no recorder exige validacao fisica/performance proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.43 Home/SOS

- `src/features/emergency-home/mediaStopSignalPolicy.ts` centraliza a decisao de sinalizar parada do recorder, incrementar serial e preparar o payload de log.
- `app/index.tsx` continua responsavel por refs, `appendMediaOperationalLog()`, `setStopRecordingRequestSerial()` e retorno do serial.
- Novo gate `npm run test:media-stop-signal` cobre Android com video local, plataforma web e video local desativado.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline no signal.
- Sem build Android nesta fatia por ser refatoracao pura.

# Atualizacao - 2026-05-18 - Etapa 1.44 Home/SOS

- `src/features/emergency-home/mediaStopSettlementRequestPolicy.ts` centraliza o payload de settlement e a decisao de resolver pending request por serial.
- `app/index.tsx` continua responsavel por `appendMediaOperationalLog()`, `clearTimeout()`, limpeza de ref e `pendingRequest.resolve(result)`.
- Novo gate `npm run test:media-stop-settlement-request` cobre log de settlement, serial igual, serial diferente e ausencia de pending request.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para regra inline no settlement.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional no recorder exige validacao fisica/performance proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.45 Home/SOS

- `src/features/emergency-home/finishActiveCallStartPolicy.ts` centraliza a guarda inicial do encerramento ativo, a sessao remota a finalizar e a decisao de midia ja entregue a chamada ao vivo.
- `app/index.tsx` continua responsavel por parar evidencia ao vivo, resetar chamada, limpar filas de autochamada, atualizar estado visual, backend, cofre e auditoria.
- Novo gate `npm run test:finish-active-call-start` cobre falta de pacote ativo, encerramento duplicado, prioridade da sessao remota e handoff de midia.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para guarda inline no fechamento do SOS.
- Sem build Android nesta fatia por ser refatoracao pura.

# Atualizacao - 2026-05-18 - Etapa 1.46 Home/SOS

- `src/features/emergency-home/finishActiveCallCleanupPolicy.ts` centraliza a limpeza final do encerramento ativo.
- `app/index.tsx` continua responsavel pelas mutacoes reais de `mediaStopPurposeRef`, `setCaptureStopLocked()`, `setMediaStopPendingState()` e `setFinishInProgress()`.
- Novo gate `npm run test:finish-active-call-cleanup` cobre limpeza da finalidade `finish` e preservacao de outras finalidades de midia.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para limpeza inline no `finally`.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em camera/chamada/WebRTC exige validacao fisica/performance proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.47 Home/SOS

- `src/features/emergency-home/finishRemoteSyncPolicy.ts` centraliza a decisao de retry da finalizacao remota, a escolha do estado remoto final e o payload de falha remota.
- `app/index.tsx` continua responsavel por chamar `finishRemoteEmergencySessionForPackage()`, `syncPendingEmergencyPackagesWithApi()` e `appendMediaOperationalLog()`.
- Novo gate `npm run test:finish-remote-sync` cobre finish direto concluido, retry apos falha, fallback para o estado direto e log de falha.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para selecao remota inline.
- Sem build Android nesta fatia por ser refatoracao pura.

# Atualizacao - 2026-05-18 - Etapa 1.48 Home/SOS

- `src/features/emergency-home/finishPackageResultPolicy.ts` centraliza o resumo do pacote finalizado e o payload de `emergency_finish_package_result`.
- `app/index.tsx` continua responsavel por registrar o log, resolver outcome, atualizar evidencia owner, auditoria e diagnostico.
- Novo gate `npm run test:finish-package-result` cobre midia gravada com anexo e pacote sem midia local anexada.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para resumo inline no encerramento.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em camera/chamada/WebRTC exige validacao fisica/performance proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.49 Home/SOS

- `src/features/emergency-home/finishOwnerLiveEvidencePolicy.ts` centraliza a atualizacao final de evidencia local do owner no encerramento do SOS.
- `app/index.tsx` continua responsavel por chamar `updateOwnerLiveEvidence()` e persistir via storage seguro quando ha sessao remota.
- Novo gate `npm run test:finish-owner-live-evidence` cobre status protegido, metadados e falha.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para objeto inline no update final.
- Sem build Android nesta fatia por ser refatoracao pura.

# Atualizacao - 2026-05-18 - Etapa 1.50 Home/SOS

- `src/features/emergency-home/finishOwnerLiveAuditPolicy.ts` centraliza o marcador final de auditoria owner no encerramento.
- `app/index.tsx` continua responsavel por obter device id registrado e chamar `recordOwnerLiveAuditMarker()`.
- Novo gate `npm run test:finish-owner-live-audit` cobre auditoria protegida, metadados e falha com `connectionState: "ended"`.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para objeto inline de auditoria final.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em auditoria/backend exige validacao fisica/API proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.51 Home/SOS

- `src/features/emergency-home/finishNoMediaDiagnosticPolicy.ts` centraliza a decisao de persistir diagnostico final sem midia.
- `app/index.tsx` continua responsavel por executar `persistFinishNoMediaDiagnostic()` e anexar o diagnostico ao pacote local.
- Novo gate `npm run test:finish-no-media-diagnostic` cobre ausencia de diagnostico e persistencia de `camera_no_file_returned`.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para `if` inline no outcome final.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em recorder/cofre/backend exige validacao fisica/API proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.52 Home/SOS

- `src/features/emergency-home/finishCompletionActionsPolicy.ts` centraliza status final, progresso final e limpeza do formulario de confirmacao apos o outcome.
- `app/index.tsx` continua responsavel por `setRecordingStatus()`, `showFinishProgress()` e setters React.
- Novo gate `npm run test:finish-completion-actions` cobre a decisao de fechar confirmacao, limpar codigo e limpar erro.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para limpeza final inline no encerramento.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em UX nativa/chamada/WebRTC exige validacao fisica/performance proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.53 Home/SOS

- `src/features/emergency-home/finishMissingPackagePolicy.ts` centraliza a resposta quando o pacote ativo nao e encontrado no encerramento.
- `app/index.tsx` continua responsavel por aplicar `setRecordingStatus()` e `showFinishProgress()`.
- Novo gate `npm run test:finish-missing-package` cobre os caminhos com e sem `stopSerial`.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para decisao inline de pacote ausente.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em recorder/cofre/backend exige validacao fisica/API proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.54 Home/SOS

- `src/features/emergency-home/finishFailureActionsPolicy.ts` centraliza log, status e progresso de falha controlada no encerramento.
- `app/index.tsx` continua responsavel por `appendMediaOperationalLog()`, `setRecordingStatus()` e `showFinishProgress()`.
- Novo gate `npm run test:finish-failure-actions` cobre o payload saneado do erro e os textos finais preservados.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para catch inline no encerramento.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em erro/backend/UX nativa exige validacao proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.55 Home/SOS

- `src/features/emergency-home/finishMediaStopStartPolicy.ts` centraliza a decisao inicial apos `stopSerial` no encerramento.
- `app/index.tsx` continua responsavel por `setCaptureStopLocked()`, `setMediaStopPendingState()`, `setActivePackageId()`, `setMediaRecorderPackageId()` e `showFinishProgress()`.
- Novo gate `npm run test:finish-media-stop-start` cobre bloqueio de captura, pending, pacote do recorder e progresso inicial.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para setup inline da parada de midia.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em recorder/camera exige validacao fisica/performance proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.56 Home/SOS

- `src/features/emergency-home/finishMediaStopResultPolicy.ts` centraliza limpeza de pending, payload de `emergency_media_stop_progress_result` e progresso final da parada de midia.
- `app/index.tsx` continua responsavel por `setMediaStopPendingState()`, `appendMediaOperationalLog()` e `showFinishProgress()`.
- Novo gate `npm run test:finish-media-stop-result` cobre midia anexada e caminho sem midia anexada.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para log/progresso inline da parada de midia.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em recorder/camera/log runtime exige validacao proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.57 Home/SOS

- `src/features/emergency-home/finishRemoteSyncPolicy.ts` ganhou `resolveFinishRemoteSyncStartActions()` para centralizar a decision inicial da sync remota final.
- `app/index.tsx` continua responsavel por `queueEmergencyPackageForRemoteSync()` e `showFinishProgress()`.
- `npm run test:finish-remote-sync` cobre a fila remota obrigatoria e progresso final de sincronizacao.
- `scripts/smoke-test.mjs` exige a decision para evitar regressao para regra inline no inicio da sync remota.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em API/backend exige validacao proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.58 Home/SOS

- `src/features/emergency-home/finishRemoteSyncPolicy.ts` ganhou `resolveFinishRemoteSyncMode()` para centralizar modo direto `direct_finish` ou fallback `pending_sync`.
- `app/index.tsx` continua responsavel por `finishRemoteEmergencySessionForPackage()`, `syncPendingEmergencyPackagesWithApi()`, retry e estado remoto final.
- `npm run test:finish-remote-sync` cobre sessao remota valida, `null` e string vazia.
- `scripts/smoke-test.mjs` exige os modos para evitar regressao para selecao inline no encerramento.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em API/backend exige validacao proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.59 Home/SOS

- `src/features/emergency-home/finishOutcomeInputPolicy.ts` centraliza a montagem da entrada para `resolveFinishOutcomePolicy()`.
- `app/index.tsx` continua responsavel por ler o resultado do pacote, estado remoto, `stopResult` e presenca de `stopSerial`.
- Novo gate `npm run test:finish-outcome-input` cobre o mapeamento preservando o campo opcional `stopResultStatus` quando ausente.
- `npm test` e `scripts/smoke-test.mjs` exigem a policy pura para evitar regressao para objeto inline no outcome final.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em recorder/camera/backend exige validacao proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.60 Home/SOS

- `src/features/emergency-home/finishOwnerCompletionPolicy.ts` agrupa a conclusao owner do encerramento com `evidenceUpdate` e `auditMarker`.
- `app/index.tsx` continua responsavel por executar `updateOwnerLiveEvidence()` e `recordOwnerLiveAuditMarker()`.
- As policies especificas `finishOwnerLiveEvidencePolicy.ts` e `finishOwnerLiveAuditPolicy.ts` seguem preservadas e testadas.
- Novo gate `npm run test:finish-owner-completion` cobre caminhos protegido e falho.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em auditoria/backend/UX real exige validacao proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.61 Home/SOS

- `src/features/emergency-home/finishActiveCallRuntimeStartPolicy.ts` centraliza as acoes iniciais de runtime do encerramento ativo.
- `app/index.tsx` continua responsavel por parar evidencia de video ao vivo, resetar chamada, limpar refs de autochamada e aplicar estados React.
- Novo gate `npm run test:finish-active-call-runtime-start` cobre sessao remota presente e ausente.
- `scripts/smoke-test.mjs` exige a nova policy e valida que o progresso inicial saiu da tela para a policy.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em chamada/camera/WebRTC exige validacao proporcional.

# Atualizacao - 2026-05-18 - Etapa 1.62 Home/SOS

- `src/features/emergency-home/finishPostOutcomeActionsPolicy.ts` agrupa `resolveFinishCompletionActions()` e `resolveFinishNoMediaDiagnosticRequest()`.
- `app/index.tsx` continua responsavel por `persistFinishNoMediaDiagnostic()`, `setRecordingStatus()`, `showFinishProgress()` e limpeza do formulario.
- Novo gate `npm run test:finish-post-outcome` cobre caminho com diagnostico e caminho protegido sem diagnostico.
- As policies individuais de diagnostico e completion seguem preservadas e testadas.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em recorder/cofre/backend/UX real exige validacao proporcional.

# Atualizacao - 2026-05-19 - Etapa 1.63 Home/SOS

- `src/features/emergency-home/mediaStopSettledActionsPolicy.ts` centraliza o tratamento do settlement da parada de midia.
- `app/index.tsx` continua responsavel por resolver waiter, registrar log, atualizar outbox/status e aplicar progresso final.
- Novo gate `npm run test:media-stop-settled-actions` cobre serial tratado e serial ignorado.
- `scripts/smoke-test.mjs` exige a nova policy para evitar regressao para regra inline de settlement.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em recorder/camera/WebRTC exige validacao proporcional.

# Atualizacao - 2026-05-19 - Etapa 1.64 Home/SOS

- `src/features/emergency-home/mediaStopPendingRequestCompletionPolicy.ts` centraliza a conclusao do pedido pendente de parada de midia.
- `app/index.tsx` continua responsavel por `clearTimeout()`, limpar `pendingMediaStopRequestRef` e resolver a promise do pedido.
- Novo gate `npm run test:media-stop-pending-request-completion` cobre serial compativel, serial divergente e ausencia de pedido pendente.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em waiter/recorder exige validacao fisica proporcional.

# Atualizacao - 2026-05-19 - Etapa 1.65 Home/SOS

- `src/features/emergency-home/emergencyStartRuntimePolicy.ts` centraliza as acoes iniciais de runtime ao iniciar o SOS.
- `app/index.tsx` continua responsavel por resetar chamada ao vivo, limpar sessao remota/autochamada, marcar inicio em progresso e registrar log.
- Novo gate `npm run test:emergency-start-runtime` cobre payload Android com video local e payload iOS sem video local.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em criacao de pacote/camera/chamada exige validacao proporcional.

# Atualizacao - 2026-05-19 - Etapa 1.66 Home/SOS

- `src/features/emergency-home/emergencyStartFailureActionsPolicy.ts` centraliza a falha controlada ao iniciar o SOS.
- `app/index.tsx` continua responsavel por registrar o erro, limpar pacote ativo, atualizar status e mostrar o modal.
- `emergencyStartFailureDialogPolicy.ts` segue preservada e testada individualmente.
- Novo gate `npm run test:emergency-start-failure-actions` cobre payload saneado, status e dialogo.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em start/backend/UX real exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.67 Home/SOS

- `src/features/emergency-home/finishConfirmationFormPolicy.ts` centraliza patches reutilizaveis do formulario de encerramento do SOS.
- `app/index.tsx` continua responsavel pelos efeitos React via `applyFinishConfirmationFormPatch()`.
- A policy preserva abertura do modal de codigo, encerramento direto sem codigo, limpeza final e exibicao de erro.
- Novo gate `npm run test:finish-confirmation-form` cobre os patches derivados de request e completion.
- `scripts/smoke-test.mjs` agora chama `process.exit(0)` ao final para evitar handle aberto no Node local apos sucesso.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em UX real/camera/chamada exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.68 Home/SOS

- `src/features/emergency-home/protectedRouteFormPolicy.ts` centraliza patches reutilizaveis do formulario de rota protegida por codigo.
- `app/index.tsx` continua responsavel pelos efeitos React via `applyProtectedRouteFormPatch()`, alem de `unlockProtectedAccess()` e navegacao.
- A policy preserva pedido de codigo, erro de validacao, limpeza no aceite e limpeza no fechamento.
- Novo gate `npm run test:protected-route-form` cobre pedido, erro, aceite e fechamento.
- Git local apresentou packs/refs antigos corrompidos; os objetos/refs afetados foram movidos para quarentena local e `git fetch --no-tags origin main` voltou a funcionar.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em permissao, navegacao real ou UX visual exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.69 Home/SOS

- `src/features/emergency-home/finishCodeConfirmationActionsPolicy.ts` centraliza a acao derivada da confirmacao de encerramento por codigo.
- `app/index.tsx` continua responsavel por `verifySecurityCodeStatus()`, aplicar patch React e chamar `handleFinishActiveCall()`.
- Novo gate `npm run test:finish-code-confirmation-actions` cobre erro de codigo e caminho autorizado de encerramento.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em encerramento real/camera/chamada exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.70 Home/SOS

- `src/features/emergency-home/protectedRouteUnlockActionsPolicy.ts` centraliza a acao derivada da confirmacao de rota protegida por codigo.
- `app/index.tsx` continua responsavel por `verifySecurityCodeStatus()`, `unlockProtectedAccess()` e `navigateRoute()`.
- Novo gate `npm run test:protected-route-unlock-actions` cobre pedido ausente, erro e desbloqueio com alvo valido.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em permissao, navegacao real ou UX visual exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.71 Home/SOS

- `src/features/emergency-home/mediaReleaseWaiterCompletionPolicy.ts` centraliza a decisao de concluir o waiter de liberacao de midia antes da chamada ao vivo.
- `app/index.tsx` continua responsavel por `clearTimeout()`, ref pendente e resolucao da promise.
- Novo gate `npm run test:media-release-waiter-completion` cobre ausencia e presenca de request pendente.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em camera/WebRTC/chamada exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.72 Home/SOS

- `src/features/emergency-home/mediaReleaseTimeoutActionsPolicy.ts` centraliza a decisao de timeout do waiter de liberacao de midia antes da chamada ao vivo.
- `app/index.tsx` continua responsavel por `setTimeout()`, ref pendente, `appendMediaOperationalLog()` e resolucao da promise.
- Novo gate `npm run test:media-release-timeout-actions` cobre timeout com e sem request pendente.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em camera/WebRTC/chamada exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.73 Home/SOS

- `src/features/emergency-home/ownerLiveEvidenceUpdatePolicy.ts` centraliza a decisao de update da evidencia local owner apenas com `remoteSessionId` valido.
- `app/index.tsx` continua responsavel por `updateOwnerLiveCallEvidenceRecord()` e pela promise.
- Novo gate `npm run test:owner-live-evidence-update` cobre ausencia de sessao e update permitido.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em storage seguro real/camera/WebRTC exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.74 Home/SOS

- `src/features/emergency-home/ownerLiveAuditMarkerActionsPolicy.ts` centraliza a decisao de registrar marcador de auditoria owner apenas com `remoteSessionId` valido.
- `app/index.tsx` continua responsavel por `deviceBindingService.getRegisteredApiDeviceId()`, `resolveOwnerLiveAuditMarkerInput()` e `recordLiveAuditMarker()`.
- Novo gate `npm run test:owner-live-audit-marker-actions` cobre ausencia de sessao e marcador permitido.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em auditoria/backend real exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.75 Home/SOS

- `src/features/emergency-home/ownerLiveVideoStartRequestPolicy.ts` centraliza a decisao de reutilizar gravacao ativa, reutilizar inicio pendente, substituir gravacao ativa ou iniciar nova gravacao owner.
- `app/index.tsx` continua responsavel por retornar gravacao/promise, chamar `stopOwnerLiveVideoEvidence("replace_recording")` e iniciar a gravacao real.
- Novo gate `npm run test:owner-live-video-start-request` cobre os quatro caminhos de decisao.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em camera, recorder, WebRTC ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.76 Home/SOS

- `src/features/emergency-home/ownerLiveVideoStartOutcomePolicy.ts` centraliza acoes derivadas de metadata-only, gravacao iniciada e erro controlado no inicio do video owner.
- `app/index.tsx` continua responsavel por `startOwnerLiveVideoRecording()`, refs, update de evidencia, marcador de auditoria, status local e log operacional.
- Novo gate `npm run test:owner-live-video-start-outcome` cobre gravacao iniciada, metadata-only e erro.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em camera, recorder, WebRTC ou backend real exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.77 Home/SOS

- `src/features/emergency-home/ownerLiveVideoPreserveRequestPolicy.ts` centraliza a decisao de reutilizar preservacao existente, aguardar inicio pendente, ignorar ausencia/in-flight ou iniciar preservacao owner.
- `app/index.tsx` continua responsavel por promises, refs, await de inicio pendente e controle real de preservacao.
- Novo gate `npm run test:owner-live-video-preserve-request` cobre reutilizacao, aguardo pendente, ausencia, in-flight e inicio de preservacao.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em camera, recorder, WebRTC ou storage real exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.78 Home/SOS

- `src/features/emergency-home/ownerLiveVideoPreserveOutcomePolicy.ts` centraliza acoes derivadas da parada/preservacao do video owner.
- `app/index.tsx` continua responsavel por `stopOwnerLiveVideoRecording()`, `preserveLocalVideoAsset()`, evidencia, auditoria, status e logs reais.
- Novo gate `npm run test:owner-live-video-preserve-outcome` cobre fonte ausente, fonte valida, conclusao protegida e erro.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em motor nativo, storage seguro real ou backend exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.79 Home/SOS

- `src/features/emergency-home/mediaHandoffStartActionsPolicy.ts` centraliza acoes iniciais da preparacao de midia antes da chamada owner.
- `app/index.tsx` continua responsavel por refs, estados React, evidencia, auditoria, log e sinalizacao real de parada do recorder.
- Novo gate `npm run test:media-handoff-start-actions` cobre status, evidencia, auditoria, log e flags derivadas do stage inicial.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em camera, recorder, WebRTC ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-20 - Etapa 1.80 Home/SOS

- `src/features/emergency-home/mediaHandoffReleaseActionsPolicy.ts` centraliza espera, conclusao e limpeza da liberacao de camera/midia antes da chamada owner.
- `app/index.tsx` continua responsavel por `signalMediaRecorderStop()`, `waitForMediaRecorderRelease()`, flags React, evidencia, auditoria e logs.
- Novo gate `npm run test:media-handoff-release-actions` cobre ausencia de serial, espera, conclusao e limpeza.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em camera, recorder, WebRTC ou backend real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.81 Home/SOS

- `src/features/emergency-home/ownerAutoCallAttemptActionsPolicy.ts` centraliza a decisao e as acoes iniciais da tentativa de autochamada owner.
- `app/index.tsx` continua responsavel por timers, refs, status React, log real e `listAcceptedLiveRecipients()`.
- Novo gate `npm run test:owner-auto-call-attempt-actions` cobre bloqueios de tentativa e caminho permitido.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em chamada, WebRTC, camera ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.82 Home/SOS

- `src/features/emergency-home/ownerAutoCallResultActionsPolicy.ts` centraliza status de destinatarios, marcacao de chamada iniciada, erro controlado e limpeza de in-flight.
- `app/index.tsx` continua responsavel por `prepareMediaForOwnerLiveCall()`, `liveAudioCall.startOwnerAudioCall()`, refs e log real.
- Novo gate `npm run test:owner-auto-call-result-actions` cobre sem anjo, com anjo, chamada iniciada/falha, erro e finally.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em chamada, WebRTC, camera ou backend real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.83 Home/SOS

- `src/features/emergency-home/ownerLiveCallLifecycleActionsPolicy.ts` centraliza timestamps, limpeza de sessao iniciada e motivo controlado de parada da evidencia owner.
- `app/index.tsx` continua responsavel por `ownerAutoCallStartedSessionIdsRef`, `stopOwnerLiveVideoEvidence()` e `updateOwnerLiveEvidence()`.
- Novo gate `npm run test:owner-live-call-lifecycle-actions` cobre lifecycle ignorado, conectado e finalizado/falho.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em chamada, recorder, WebRTC, storage ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.84 Home/SOS

- `src/features/emergency-home/liveCallCleanupActionsPolicy.ts` centraliza acoes declarativas de reset/parada e limpeza da chamada ao vivo.
- `app/index.tsx` continua responsavel por limpar refs, aplicar `setLiveRemoteSessionId(null)` e chamar `resetLiveAudioCall()` ou `stopLiveAudioCall()`.
- Novo gate `npm run test:live-call-cleanup-actions` cobre ausencia de cleanup, reset idle e parada de chamada ativa.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em chamada, WebRTC, estado nativo ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.85 Home/SOS

- `src/features/emergency-home/activeRemoteSyncAttemptActionsPolicy.ts` centraliza a decisao de tentar sincronizar o SOS ativo com a API e o log saneado da tentativa.
- `app/index.tsx` continua responsavel por timer de retry, `activeRemoteSyncInFlightRef`, `getActiveEmergencyPackage()` e `syncEmergencyPackageWithApi()`.
- Novo gate `npm run test:active-remote-sync-attempt-actions` cobre cancelamento, pacote ausente, in-flight, sessao remota existente e tentativa permitida.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em API/backend real, chamada, WebRTC ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.86 Home/SOS

- `src/features/emergency-home/activeRemoteSyncCompletionActionsPolicy.ts` centraliza guardas de pacote, aplicacao de resultado, erro controlado e limpeza final da sincronizacao remota ativa.
- `app/index.tsx` continua responsavel por buscar pacote, sincronizar com a API, aplicar estado remoto, atualizar status e limpar `activeRemoteSyncInFlightRef`.
- Novo gate `npm run test:active-remote-sync-completion-actions` cobre pacote cancelado/ausente/alterado, resultado ausente, erro cancelado/aplicavel e finally.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em API/backend real, chamada, WebRTC ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.87 Home/SOS

- `src/features/emergency-home/emergencyStartCreatedActionsPolicy.ts` centraliza log saneado e status inicial apos criacao do pacote SOS.
- `app/index.tsx` continua responsavel por `startEmergencyPackage()`, `refreshOutboxCount()`, abertura telefonica opcional e `setRecordingStatus()`.
- Novo gate `npm run test:emergency-start-created-actions` cobre log/status derivados da apresentacao inicial.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em API/backend real, chamada, camera ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.88 Home/SOS

- `src/features/emergency-home/emergencyStartRemoteSyncActionsPolicy.ts` centraliza log de resultado, opcoes de aplicacao inicial do estado remoto e log de erro da sincronizacao inicial do SOS.
- `app/index.tsx` continua responsavel por `syncEmergencyPackageWithApi()`, `appendMediaOperationalLog()` e `applyRemoteSyncState()`.
- Novo gate `npm run test:emergency-start-remote-sync-actions` cobre resultado com/sem sessao remota e erro controlado.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em API/backend real, chamada, WebRTC ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.89 Home/SOS

- `src/features/emergency-home/finishActiveCallRuntimeStateActionsPolicy.ts` centraliza acoes locais aplicaveis ao inicio runtime do encerramento do chamado ativo.
- `app/index.tsx` continua responsavel por `stopOwnerLiveVideoEvidence()`, reset da chamada, limpeza de refs, estado React, progresso e log real.
- Novo gate `npm run test:finish-active-call-runtime-state-actions` cobre limpeza de sessao owner e motivo `finish` para parada da evidencia.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em chamada, WebRTC, camera, recorder ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.90 Home/SOS

- `src/features/emergency-home/finishMediaStopRequestActionsPolicy.ts` centraliza a decisao de sinalizar parada do recorder e reaproveita `resolveFinishMediaStopStartActions()` quando ha serial.
- `app/index.tsx` continua responsavel por `signalMediaRecorderStop()`, flags React, `waitForMediaRecorderStop()` e resultado real da parada.
- Novo gate `npm run test:finish-media-stop-request-actions` cobre handoff para chamada ao vivo, parada local e serial presente/ausente.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em recorder, camera, storage, chamada ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.91 Home/SOS

- `src/features/emergency-home/finishRemoteSyncRequestActionsPolicy.ts` centraliza o plano inicial da sincronizacao remota final do encerramento.
- `app/index.tsx` continua responsavel por fila remota, chamada direta de encerramento remoto, retry de pendencias, progresso e logs reais.
- Novo gate `npm run test:finish-remote-sync-request-actions` cobre `direct_finish` com sessao remota e `pending_sync` sem sessao.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em API/backend real, chamada, WebRTC ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.92 Home/SOS

- `src/features/emergency-home/finishPackageOutcomeActionsPolicy.ts` consolida resumo do pacote, input/outcome final, evidencia/auditoria owner e acoes posteriores do encerramento.
- `app/index.tsx` continua responsavel por log operacional, update de evidencia, marcador de auditoria, diagnostico sem midia, progresso e formulario.
- Novo gate `npm run test:finish-package-outcome-actions` cobre resultado protegido e caso diagnostico quando a chamada ao vivo nao devolve video local.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em storage seguro real, recorder, chamada, backend ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.93 Home/SOS

- `src/features/emergency-home/finishMissingPackageBranchActionsPolicy.ts` centraliza a decisao de aplicar o branch de pacote ausente no encerramento.
- `app/index.tsx` continua responsavel por status, progresso e retorno controlado do fluxo.
- Novo gate `npm run test:finish-missing-package-branch-actions` cobre resultado presente, pacote ausente sem serial e pacote ausente com serial.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em storage real, recorder ou backend exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.94 Home/SOS

- `src/features/emergency-home/finishFailureCleanupActionsPolicy.ts` centraliza falha runtime e cleanup final do encerramento.
- `app/index.tsx` continua responsavel por log real, status, progresso, refs e estados React.
- Novo gate `npm run test:finish-failure-cleanup-actions` cobre log/status de falha e cleanup final com/sem `mediaStopPurpose`.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em chamada, recorder, storage, backend ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.95 Home/SOS

- `src/features/emergency-home/finishRemoteSyncDirectActionsPolicy.ts` centraliza retry apos encerramento remoto direto e resolucao do estado remoto final.
- `app/index.tsx` continua responsavel por `finishRemoteEmergencySessionForPackage()` e `syncPendingEmergencyPackagesWithApi()`.
- Novo gate `npm run test:finish-remote-sync-direct-actions` cobre tentativa direta finalizada, falha com retry e estado de retry do mesmo pacote.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em API/backend real, chamada ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Etapa 1.96 Home/SOS

- `src/features/emergency-home/finishRemoteSyncCompletionActionsPolicy.ts` centraliza resultado pendente, log de falha remota e flag `remoteFinishFailed`.
- `app/index.tsx` continua responsavel por sincronizacao pendente, log real e resultado local do pacote.
- Novo gate `npm run test:finish-remote-sync-completion-actions` cobre resultado pendente encontrado/ausente e falha remota saneada.
- Sem build Android nesta fatia por ser refatoracao pura; mudanca operacional em API/backend real, chamada ou UX real exige validacao proporcional.

# Atualizacao - 2026-05-21 - Validacao ampla local Home/SOS

- `handleFinishActiveCall` foi revisado apos as fatias 1.81 a 1.96 e ficou majoritariamente como orquestrador de efeitos reais.
- Validacoes locais aprovadas: `smoke-test`, `lint`, `npm test` e `private:android:readiness`.
- `typecheck` continua sem erro emitido, mas preso sem CPU; foi encerrado para nao deixar processo pendurado.
- `adb devices -l` nao listou Android conectado e o espaco livre local observado ficou em aproximadamente 5.3 GiB.
- Proxima etapa tecnica: conectar Android, garantir espaco livre suficiente, executar build privado, instalar e validar fisicamente Home/SOS/encerramento. Build adiado para a proxima retomada.

# Atualizacao - 2026-05-21 - Etapas 1.97 e 1.98 Anjos/Convites

- `src/features/invitations/trustedAngelsPresentationPolicy.ts` centraliza regras puras de apresentacao da tela `Anjos de confianca`.
- Etapa 1.97: data curta, descricao, detalhe e normalizacao visual de convites.
- Etapa 1.98: status, nomes, detalhes, descricoes, resumos e banner principal dos vinculos de anjos.
- `app/contatos.tsx` continua responsavel por estado React, chamadas reais de API/cache, compartilhamento, revogacao e navegacao.
- Novo gate `npm run test:trusted-angels-presentation` foi adicionado ao `npm test`.
- Validacoes aprovadas: `test:trusted-angels-presentation`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build Android nesta rodada por pedido de pausa do build e por ser refatoracao pura sem runtime nativo.

# Atualizacao - 2026-05-21 - Etapas 1.99 e 1.100 Anjos/Convites

- `src/features/invitations/trustedAngelsListPolicy.ts` centraliza merge/listagem da tela `Anjos de confianca`.
- Etapa 1.99: `mergeTrustedAngelInvitations()` consolida convites locais/remotos, oculta convites de contatos ja aceitos/revogados e preserva ordenacao por criacao.
- Etapa 1.100: `buildTrustedAngelRelationshipLists()` e `splitTrustedAngelInvitationSections()` separam vinculos owner/anjo, secoes de convites e contador.
- `app/contatos.tsx` segue como orquestrador de estado React, API/cache, compartilhamento, revogacao e navegacao.
- Novo gate `npm run test:trusted-angels-list` foi adicionado ao `npm test`.
- Validacoes aprovadas: `test:trusted-angels-list`, `test:trusted-angels-presentation`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- `adb devices -l` listou o Android `23129RA5FL` via Wi-Fi/mDNS em duas entradas do mesmo aparelho; nao houve build/instalacao por ser fatia pura.

# Atualizacao - 2026-05-21 - Etapas 1.101 e 1.102 Anjos/Convites

- `src/features/invitations/trustedAngelsActionPolicy.ts` centraliza decisoes puras dos handlers de convite/revogacao.
- Etapa 1.101: `resolveTrustedAngelShareStart()` e `resolveTrustedAngelShareFailure()` cuidam de bloqueio por perfil, label saneado, status inicial, sessao expirada e fechamento de modal.
- Etapa 1.102: `buildTrustedAngelInvitationRevocationPlan()`, `buildTrustedAngelContactRevocationPlan()` e `resolveTrustedAngelActionFailure()` cuidam dos planos/fallbacks de revogacao.
- `app/contatos.tsx` segue responsavel pelos efeitos reais: API, Share, storage local, cache, refresh e estado React.
- Novo gate `npm run test:trusted-angels-action` foi adicionado ao `npm test`.
- Validacoes aprovadas: `test:trusted-angels-action`, `test:trusted-angels-list`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build Android nesta rodada por ser refatoracao pura sem runtime nativo.

# Atualizacao - 2026-05-21 - Etapas 1.103 e 1.104 Anjos/Convites

- `src/features/invitations/trustedAngelsRefreshPolicy.ts` centraliza decisoes puras do refresh da tela `Anjos de confianca`.
- Etapa 1.103: inicio do refresh, busy visivel/silencioso, estado local/cache, estado sem sessao e falha local.
- Etapa 1.104: resultado remoto de contatos/convites/vinculos/cache e painel inicial por parametro.
- `app/contatos.tsx` segue responsavel pelos efeitos reais: API, cache real, storage local, timers, AppState e estado React.
- Novo gate `npm run test:trusted-angels-refresh` foi adicionado ao `npm test`.
- Validacoes aprovadas: `test:trusted-angels-refresh`, `test:trusted-angels-action`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build Android nesta rodada por ser refatoracao pura sem runtime nativo.

# Atualizacao - 2026-05-21 - Etapas 1.105 e 1.106 Anjos/Convites

- `src/features/invitations/trustedAngelsDashboardPolicy.ts` centraliza decisoes puras de resumo visual e prontidao da tela `Anjos de confianca`.
- Etapa 1.105: descricoes dos cards principais de perfil, estado, convite, prontidao, meus anjos, sou anjo, convites e atualizacao.
- Etapa 1.106: labels e flags de prontidao de conta, dispositivo e API.
- `app/contatos.tsx` segue responsavel pelos efeitos reais: renderizacao, navegacao, modais, estado React e handlers.
- Novo gate `npm run test:trusted-angels-dashboard` foi adicionado ao `npm test`.
- Validacoes aprovadas: `test:trusted-angels-dashboard`, `test:trusted-angels-refresh`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build Android nesta rodada por ser refatoracao pura sem runtime nativo.

# Atualizacao - 2026-05-21 - Etapas 1.107 e 1.108 Anjos/Convites

- `src/features/invitations/trustedAngelsDialogPolicy.ts` centraliza decisoes puras de visibilidade de dialogs/paineis e acao visual de convite.
- Etapa 1.107: booleans dos dialogs de convite, bloqueio de perfil, revogacoes e paineis de estado, prontidao, meus anjos, sou anjo e convites.
- Etapa 1.108: regra de acao de revogar convite apenas para status `pendente` ou `compartilhado`, alem da chave visual de card.
- `app/contatos.tsx` segue responsavel pelos efeitos reais: renderizacao, clique, navegacao, estado React e handlers.
- Novo gate `npm run test:trusted-angels-dialog` foi adicionado ao `npm test`.
- Validacoes aprovadas: `test:trusted-angels-dialog`, `test:trusted-angels-dashboard`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build Android nesta rodada por ser refatoracao pura sem runtime nativo.

# Atualizacao - 2026-05-21 - Etapas 1.109 e 1.110 Anjos/Convites

- `src/features/invitations/trustedAngelsPanelPolicy.ts` centraliza modelos puros dos paineis de vinculos e convites.
- Etapa 1.109: itens e estados vazios dos paineis `Meus anjos` e `Sou anjo`.
- Etapa 1.110: secoes de convites validados/locais e estado vazio do painel de convites.
- `app/contatos.tsx` segue responsavel pelos efeitos reais: renderizacao, icones, clique, navegacao, estado React e handlers.
- Novo gate `npm run test:trusted-angels-panel` foi adicionado ao `npm test`.
- Validacoes aprovadas: `test:trusted-angels-panel`, `test:trusted-angels-dialog`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build Android nesta rodada por ser refatoracao pura sem runtime nativo.

# Atualizacao - 2026-05-21 - Etapas 1.111 e 1.112 Anjos/Convites

- `buildTrustedAngelsAcceptedCounts()` em `trustedAngelsDashboardPolicy` centraliza contadores aceitos de `Meus anjos` e `Sou anjo`.
- `TRUSTED_ANGELS_REFRESH_INTERVAL_MS` e `shouldRefreshTrustedAngelsOnAppState()` em `trustedAngelsRefreshPolicy` centralizam o intervalo de 15 segundos e a regra de refresh quando o app volta para `active`.
- `app/contatos.tsx` segue responsavel pelos efeitos reais: timers, AppState, refresh real, renderizacao, navegacao, estado React e handlers.
- Validacoes aprovadas: `test:trusted-angels-dashboard`, `test:trusted-angels-refresh`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build Android nesta rodada por ser refatoracao pura sem runtime nativo.

# Atualizacao - 2026-05-21 - Etapas 1.113 e 1.114 Anjos/Convites

- `trustedAngelsNavigationPolicy` centraliza a decisao pura de navegacao do menu da tela `Anjos de confianca`.
- `resolveTrustedAngelsMenuRouteTarget()` preserva a rota normal e o caso especial de `/arquivos` com parametro de painel.
- `buildTrustedAngelsDialogActionLabels()` em `trustedAngelsDialogPolicy` centraliza labels de criar convite, revogar convite e revogar vinculo durante estado ocupado.
- `app/contatos.tsx` segue responsavel pelos efeitos reais: `router.push`, renderizacao, cliques, modais, Share/API/cache e estado React.
- Novo gate `npm run test:trusted-angels-navigation` cobre a navegacao e esta integrado ao `npm test`.
- Validacoes aprovadas: testes focados, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build Android nesta rodada por ser refatoracao pura sem runtime nativo.

# Atualizacao - 2026-05-21 - Etapas 1.115 e 1.116 Anjos/Convites

- `trustedAngelsDashboardPolicy` agora centraliza tambem o modelo dos cards principais da tela `Anjos de confianca`.
- `buildTrustedAngelsDashboardTileRows()` define as linhas dos 8 cards com labels, descricoes, icones simbolicos e acoes.
- `buildTrustedAngelsDashboardTileAction()` centraliza alvos de rota, painel, dialog e refresh.
- `app/contatos.tsx` segue responsavel pelos efeitos reais: renderizacao de `ResourceTile`, icones, `router.push`, `setPanel`, `setDialog` e `refreshAngels()`.
- Validacoes aprovadas: `test:trusted-angels-dashboard`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`.
- Sem build Android nesta rodada por ser refatoracao pura sem runtime nativo.
