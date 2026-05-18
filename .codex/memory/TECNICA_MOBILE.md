# Memoria - Ada, Hedy e Margaret

Data: 2026-05-03  
Papel: arquitetura mobile React Native/Expo, SOS, Cofre e Android.

## Estado tecnico

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
