# 03 - Timeline Mobile

Responsavel: Cristine  
Supervisao: Ze

## 2026-05-02 - Checkpoint inicial

Status: publicado no GitHub; aguardando instaladores assinados.

Decisoes:

- App criado em `apps/mobile`.
- Stack React Native + Expo Dev Client/EAS.
- Android 7+ e iOS 15.1+.
- Cristine criada como gerente AI mobile.
- Documentacao, memoria e estrutura inicial versionadas.
- OpenAPI inicial copiada para `docs/api/openapi.yaml`.
- Commit local inicial criado em `main`.
- Remote configurado como `https://github.com/sinalseguro/App.git`.
- Push para o remoto resolvido com a chave SSH `id_ed25519_github_sinalseguro` e alias local `github-sinalseguro-admin`.
- Tarcila aprovou o uso operacional da logo ja aplicada nos portais para o README do app.
- QR codes Android/iOS gerados em `assets/qr/`.
- Manifesto de instaladores criado em `distribution/installers.json`.
- Documentacao de distribuicao e lifecycle adicionada.

Entregas esperadas no fechamento:

- Git inicial em `main`.
- Remote `https://github.com/sinalseguro/App.git`.
- App shell com rotas principais.
- Design tokens e componentes obrigatorios.
- Sem segredos, dados reais ou arquivos sensiveis.

Validacoes executadas:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado com checagem local contra padroes sensiveis.
- `npm test`: aprovado com smoke test.
- `npm run assets:qr`: aprovado.
- `npm audit --omit=dev --audit-level=high`: sem vulnerabilidades altas/criticas; permanecem moderadas transitivas da cadeia Expo que exigem correcao upstream ou `--force` com quebra de SDK.

Proximo passo operacional:

- Gerar APK Android assinado e publicar em GitHub Releases quando a permissao estiver resolvida.
- Preparar TestFlight/App Store para iOS com conta Apple e documentos de privacidade.

## 2026-05-03 - Refino de identidade, modais, Cofre fixo e splash aprovada

Status: implementado e validado no Browser Use; APK debug reconstruido; instalacao Android pendente por ausencia de dispositivo no ADB.

Especialistas acionados:

- Tarcila/Norman: identidade visual, topo com logo, splash, SOS 3D discreto, modais e Cofre iconografico.
- Ada/Hedy/Margaret: arquitetura React Native, tela fixa, componentes reutilizaveis e APK debug.
- Schneier/Doneda/Myers: bloqueio de midia real, permissoes, cofre, confirmacoes e gates.

Decisoes:

- Splash nativa passa a usar `assets/brand/sinalseguro-splash-approved.png`.
- Topos internos usam `AppTopBar` com logo, contexto, voltar e menu.
- Fluxos criticos deixam de usar `Alert.alert` e passam a usar `BrandedDialog`.
- Cofre local vira tela fixa por icones e abre Player/Cofre em modal.
- Dados tecnicos do Cofre ficam no menu sanduiche.
- Pagina `Como funciona` criada para explicar fluxo, privacidade e limites.
- Preferencia de camera frontal/traseira/ambas foi preparada somente como homologacao; build publico segue sem `CAMERA` e `RECORD_AUDIO`.

Evidencias:

- `docs/assets/mobile/2026-05-03-home-sos.png`;
- `docs/assets/mobile/2026-05-03-home-menu.png`;
- `docs/assets/mobile/2026-05-03-cofre-fixo.png`;
- `docs/assets/mobile/2026-05-03-cofre-player-modal.png`;
- `docs/assets/mobile/2026-05-03-funcionamento.png`;
- relatorio: `docs/22_REFINO_IDENTIDADE_MODAL_COFRE_SPLASH.md`;
- especificacao viva: `docs/23_ESPECIFICACAO_DESENVOLVIMENTO_APP.md`.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.

## 2026-05-03 - Ajuste prioritario do anel SOS e cameras

Status: implementado, build privado gerado e instalado no Android.

Especialistas acionados:

- Tarcila/Norman: anel de progresso dentro da circunferencia visual do botao SOS.
- Ada/Hedy: configuracao frontal/traseira/duas cameras com fallback tecnico.
- Myers: gates locais, instalacao e cold start no Android.
- Cristine/Knuth: memoria viva e documentacao.

Decisoes:

- O progresso do gesto usa camada SVG recortada pela propria circunferencia do botao, sem anel externo.
- O acionamento permanece em sentido horario; o encerramento usa sentido anti-horario.
- A opcao `Duas cameras` tenta captura dupla no build privado; se a plataforma bloquear, tenta frontal e depois traseira antes de seguir sem video.
- O card `Midia` em Configuracoes mostra a camera selecionada.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm test`: aprovado.
- `npm run lint`: aprovado.
- `npm run build:android:private`: aprovado.
- APK instalado no Android `192.168.0.4:5555`: `Success`.
- Cold start: `TotalTime: 3442`, sem erro fatal filtrado.
- Browser simulator aberto em `http://localhost:8081/`.
- `npm run private:android:readiness`: aprovado como build privado condicionado.
- `npm run build:android:private`: `BUILD SUCCESSFUL`.
- `adb install -r`: `Success` no Android `23129RA5FL` via `192.168.0.4:5555`.
- Cold start Android apos ajuste do topo: `Status: ok`, `LaunchState: COLD`, `TotalTime: 6026`.
- Logcat filtrado sem falhas fatais.

Artefatos:

- APK privado: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256: `b6993cf4056d9926e582e9579621f4e32f468fc83e1cc66185678652b51df22f`.
- Evidencia Android do topo com simbolo sem texto: `docs/assets/mobile/2026-05-03-android-topo-simbolo.png`.
- Browser Use em `http://localhost:8081/`: aprovado.
- `./gradlew assembleDebug`: aprovado.

Android:

- APK debug: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256: `481d9aca5dd1cabb36520440f7959c71b542af5619803aadbe5170164b300e70`.
- `adb devices -l`: sem dispositivos conectados; reinstalacao fisica ficou pendente.

Handoff:

- Agentes dos portais devem usar este checkpoint e a sessao `019ddfad-a214-72a3-9b50-ba204e1c9351` para refatorar conteudo publico com foco no app, gratuidade, privacidade, cofre e botao SOS.

Complemento de continuidade:

- Schneier/Doneda/Myers identificaram que o Cofre encerrava chamado ativo por um caminho menos protegido.
- `app/arquivos.tsx` foi ajustado para exigir `BrandedDialog`, confirmacao e codigo local opcional no encerramento pelo Cofre.
- `BrandedDialog` recebeu rolagem interna para telas menores e fonte ampliada.
- `docs/23_ESPECIFICACAO_DESENVOLVIMENTO_APP.md` passou a documentar permissoes transitivas observadas no APK debug.
- Prints de `Cofre fixo` e `Como funciona` foram recapturados com a tela real, nao com splash/loading.
- Registro historico: `EmergencySettingsDrawer` chegou a separar modo e ajuda em botoes irmaos; checkpoint posterior substituiu esse arranjo por um drawer sem metricas/status e apenas com acoes iconograficas.
- Relatorio complementar criado em `docs/24_CONTINUIDADE_COFRE_ENCERRAMENTO_QA.md`.
- Gates aprovados no complemento: `typecheck`, `lint`, `test`, `git diff --check`, `release:android:readiness` com Node 24 e `assembleDebug`.
- `adb devices -l` seguiu sem dispositivo; tentativa de `adb connect 192.168.0.5:5555` retornou `Connection refused`.

## 2026-05-02 - Acesso GitHub resolvido

Status: concluido.

- Chave publica `SHA256:D8EsPR5ldcu1hfb5vUbJFupSLsktofuGVPdr7gXg29A` cadastrada na conta GitHub `sinalseguro` como chave de autenticacao com leitura/escrita.
- Alias local `github-sinalseguro-admin` criado em `~/.ssh/config`.
- `origin` do app atualizado para `git@github-sinalseguro-admin:sinalseguro/App.git`.
- `main` publicado em `sinalseguro/App`.
- `push --dry-run` validado para `sinalseguro/App`, `sinalseguro/portais` e `sinalseguro/empresa`.

## 2026-05-02 - Etapa 1 Android instalavel iniciada

Status: APK assinado publicado em GitHub Releases para homologacao controlada.

Especialistas acionados:

- Kim: release EAS, GitHub Releases, hashes e deploy do portal.
- Ada/Margaret: compatibilidade Expo/Android, `minSdkVersion 24`, `targetSdkVersion 36`, APK preview e AAB futuro.
- Schneier/Doneda/Myers: segredos, permissoes, logs, LGPD, QA e bloqueios de homologacao.

Decisoes:

- Etapa 1 libera somente APK interno tecnico de app shell e alerta simulado.
- `eas.json` passa a declarar `preview.android.buildType = apk` e `production.android.buildType = app-bundle`.
- Camera e microfone ficam fora das permissoes do primeiro instalavel; midia volta apenas em homologacao controlada com RIPD/DPIA.
- Logs de acionamento simulado foram removidos do fluxo de alerta.
- `npm run release:android:readiness` passa a ser o gate operacional antes de qualquer build Android.
- `expo-build-properties` passa a concentrar `minSdkVersion 24`, `targetSdkVersion 36` e `deploymentTarget 15.1`.
- Peers nativos exigidos pelo Expo Doctor foram adicionados: `expo-font`, `react-native-svg` e `react-native-worklets`.
- Nova Arquitetura React Native permanece ativa por exigencia do Expo Router/Reanimated; o build local foi limitado a ABIs ARM para reduzir CMake/NDK.
- Android SDK local foi preparado com `android-36`.
- Keystore de upload foi criada fora do repositorio, com senhas no Keychain.
- APK local assinado gerado em `distribution/android/out/sinalseguro-android.apk`, ignorado pelo Git.
- SHA-256 do APK: `a920c116adff07f9121281c1cd3d086daeee969dd014741658d24dd128c280f5`.
- Release notes e checksum saneados foram versionados em `distribution/android/`.
- GitHub Release publicada: `https://github.com/sinalseguro/App/releases/tag/android-v0.1.0-internal.1`.
- Portal e manifestos foram atualizados para apontar ao APK e checksum.
- Deploy dos portais concluido em `cereus_web:/var/www/sinalseguro/releases/20260502T183150Z`.

Bloqueios atuais:

- ambiente local deve usar Node 22.13+;
- EAS remoto autenticado continua pendente;
- build local deve priorizar ABIs ARM para celulares reais;
- keystore/credencial Android precisa permanecer fora do Git;
- producao publica segue bloqueada ate QA, privacidade, backend homologado e trilha de loja;
- nenhum APK deve ser publicado sem SHA-256, release notes saneadas e revisoes Myers/Schneier/Doneda/Cristine.

Validacoes executadas:

- `npm run doctor`: aprovado, 17/17 checks;
- `npm run release:android:readiness`: aprovado como pronto condicionado, com pendencias de SDK local e assinatura;
- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run assets:qr`: aprovado;
- `npm audit --omit=dev --audit-level=high`: sem vulnerabilidades altas/criticas; permanecem moderadas transitivas da cadeia Expo.

## 2026-05-02 - Validacao visual Tarcila e Android interno 2

Status: APK Android interno 2 publicado em GitHub Releases e validado em aparelho fisico via ADB Wi-Fi.

Especialistas acionados:

- Tarcila: validacao do uso da identidade visual, logo, icone, splash e nome oficial do app.
- Norman/Ada: ajustes de tela inicial, lockup e consistencia visual Android/iOS.
- Myers/Schneier: QA de instalacao, permissao e ausencia de permissao sensivel prematura.

Decisoes:

- Nome oficial permanece `SinalSeguro` em app, README, portal e label Android.
- Icone do app usa o simbolo aprovado em fundo institucional `#1E1B2E`.
- Splash usa logo SinalSeguro e fundo institucional, sem marcas de terceiros.
- Tela inicial usa `BrandLockup` com simbolo, nome e assinatura `Rede de Protecao e Amparo`.
- Botao de panico simulado passa para `colors.panic = #C2185B`.
- Sombra do design system passa a usar `shadowOpacity`, evitando reduzir a opacidade do botao.

Evidencias:

- APK local: `distribution/android/out/sinalseguro-android.apk` (ignorado pelo Git).
- SHA-256: `dbad294407038cac954fd3154bac6c4ea9dbb30b4e79164f58807e83f0d358cb`.
- Versao instalada no Android fisico: `versionCode=2`, `versionName=0.1.0`.
- Label Android validado: `SinalSeguro`.
- Assinatura APK Scheme v2: valida.
- Permissoes validadas sem `CAMERA`, `RECORD_AUDIO`, `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE` ou `WRITE_EXTERNAL_STORAGE`.
- Captura local saneada: `/tmp/sinalseguro-android-qa/home-v2.png`.

Portal:

- Portal publicado em `cereus_web:/var/www/sinalseguro/releases/20260502T191004Z`.
- Manifesto publico `https://www.sinalseguro.com.br/downloads/installers.json` validado com `android-v0.1.0-internal.2` e SHA-256 correto.
- Paginas `/baixar`, `/baixar/android` e `/baixar/ios` retornaram HTTP 200.

Pendencias:

- Remover ativos visuais duplicados do portal somente com confirmacao explicita de exclusao.

## 2026-05-02 - Convites e pacote local de emergencia

Status: base tecnica implementada para convites, georreferencia pontual e pacote local pronto para API/P2P futuro.

Especialistas acionados:

- Hedy/Ada: funcoes mobile de convite, pacote local, outbox e preparo de entrega.
- Ritchie: alinhamento com contratos `invitations` e `alerts` do OpenAPI.
- Schneier/Doneda: bloqueios de midia real, cofre local, consentimento e ausencia de transmissao.
- Myers: criterios de teste para convite, outbox, localizacao e permissao negada.

Decisoes:

- Convite local gera codigo opaco, expiravel em 7 dias e de uso unico.
- Link publico de convite usa `https://www.sinalseguro.com.br/baixar?convite=<codigo>` para manter QR/link estavel.
- Deep link futuro usa `sinalseguro://convite?convite=<codigo>`.
- Aceite real exige login proprio, consentimento e validacao de API; o app nao permite entrar como outra pessoa.
- Botao de teste grava pacote local com horario, consentimento, localizacao pontual autorizada, manifesto de midia bloqueada e plano de entrega.
- Area `Arquivos locais` permite visualizar pacotes gravados, hash, status de georreferencia, midia bloqueada e plano de envio futuro.
- Pacote local fica em cofre do sistema via `expo-secure-store`, com indice sem dado sensivel em `AsyncStorage`.
- Hash SHA-256 registra integridade do pacote.
- API e P2P ficam como adaptadores pendentes; nenhuma transmissao real ocorre neste checkpoint.
- Camera, microfone e midia real continuam bloqueados no build publico.

Arquivos principais:

- `src/features/invitations/invitationService.ts`;
- `src/features/emergency/emergencyRecorder.ts`;
- `src/features/emergency/emergencyOutbox.ts`;
- `src/features/emergency/locationCapture.ts`;
- `src/features/emergency/packagePresentation.ts`;
- `src/components/EmergencyPackageCard.tsx`;
- `app/arquivos.tsx`;
- `src/storage/secureJsonStore.ts`;
- `docs/14_CONVITES_E_PACOTE_EMERGENCIA.md`.

Proximo passo:

- Validar no Android fisico geracao de convite, permissao de localizacao permitida/negada e persistencia da outbox apos reiniciar o app.
- Conectar envio real somente quando backend, autorizacao, termos, retencao e revisao de seguranca estiverem prontos.

## 2026-05-02 - Validacao Android dos recursos locais

Status: concluido em aparelho Android fisico com ADB Wi-Fi.

Especialistas acionados:

- Cristine: continuidade, checkpoint e registro de memoria.
- Ada/Hedy/Margaret: instalacao Android, fluxo de convite, alerta de teste, outbox e compatibilidade.
- Myers/Schneier: permissoes, logcat, ausencia de midia real, ausencia de transmissao e criterios de bloqueio.
- Doneda: minimizacao de dados e evidencias sem contatos/conversas reais.

Decisoes e ajustes:

- O aparelho foi configurado para ADB Wi-Fi em `192.168.0.5:5555`.
- O APK debug validado tem SHA-256 `a3b04d9e29349319ead70200c75c030d980b6b1b67feb8a5d34ec78c6b6b71b5`.
- Foi identificado e corrigido `SYSTEM_ALERT_WINDOW` em manifest debug gerado pelo Expo.
- Foi criado plugin local `./plugins/with-android-debug-permission-hardening` para preservar essa regra nos proximos prebuilds.
- Evidencias com contatos/conversa do aparelho foram descartadas por privacidade.

Validacoes:

- app abriu sem crash;
- convite local criado e listado como pendente;
- share sheet abriu para envio do convite;
- deep link `sinalseguro://convite?convite=qa123` abriu a tela correta;
- alerta de teste criou pacote local com georreferencia consentida;
- tela `Arquivos locais` exibiu hash, status de entrega, status de midia e plano API/P2P;
- outbox persistiu apos `force-stop` e reabertura;
- negacao oficial de localizacao gerou pacote local com `permission_denied`;
- `aapt` e `dumpsys package` confirmaram ausencia de camera, microfone, overlay e storage legado;
- logcat do processo do app nao mostrou crash, coordenadas, tokens, payloads sensiveis, upload, `/alerts`, WebRTC, camera ou microfone;
- sandbox do app nao possui arquivos de audio, video ou imagem.

Evidencias:

- `docs/15_VALIDACAO_ANDROID_RECURSOS_LOCAIS.md`;
- `docs/evidencias/android/2026-05-02-recursos-locais/`.

## 2026-05-02 - Duracao, finalizacao, GPS agil e limites de segundo plano

Status: implementado no app shell; segundo plano e atalho fisico ficam bloqueados para build publico e documentados para homologacao.

Especialistas acionados:

- Ada/Hedy/Margaret/Katherine: limites Android/iOS, Expo Location e arquitetura mobile.
- Norman/Myers: UX de emergencia, estados do chamado, falso positivo e testes.
- Schneier/Doneda: permissoes, LGPD, background location e bloqueios de loja.
- Cristine/Knuth: memoria, timeline e lifecycle.

Decisoes:

- GPS "sem pedir sempre" passa a significar reutilizar permissao foreground ja concedida, nunca burlar o dialogo do sistema.
- Configuracoes ganhou pre-autorizacao de localizacao e leitura de status de permissao.
- Tempo padrao de gravacao passou por evolucao posterior: `Ilimitado`, `1min`, `5min`, `15min`, `30min`, `60min`.
- Chamado local ativo usa status `recording_local`.
- Usuaria pode finalizar manualmente o chamado; o pacote nao e apagado, e fechado com `manual_finish`.
- O chamado ativo nao encerra automaticamente por tempo; encerramento automatico antigo foi removido do fluxo ativo.
- Hash do pacote finalizado e recalculado sem carregar o bloco `integrity` anterior.
- Background location nao entra no build publico; exige homologacao com foreground service/notificacao persistente e revisao Doneda/Schneier.
- Atalho por volume com tela travada fica como pesquisa futura nativa, sem promessa no MVP.
- Startup Android recebeu `SplashScreen.hideAsync()` no layout raiz e foi validado em aparelho fisico.
- Tarcila aprovou splash, icone, adaptive icon atual e lockup para homologacao interna.
- Validacao fisica confirmou configuracao de duracao `30s`, recarregamento de preferencias no foco, chamado ativo, finalizacao manual e pacote em `Arquivos locais`.
- `Configuracoes` passou a tratar ausencia de `ACCESS_BACKGROUND_LOCATION` como bloqueio esperado, sem quebrar a tela.

Documentacao:

- `docs/16_SEGUNDO_PLANO_ATALHO_FISICO_E_DURACAO.md`.
- `docs/12_TARCILA_LOGO_README.md`.

## 2026-05-02 - Botao central, cofre/player, streaming autorizado e 190

Status: UX implementada no app shell; streaming real, player real e compartilhamento externo seguem bloqueados para build publico.

Especialistas acionados:

- Tarcila/Norman: splash, identidade visual, botao circular, atalhos e cofre.
- Ada/Hedy/Ritchie: preferencias de midia, contrato bilateral, player, backend e chaves.
- Schneier/Doneda/Myers: seguranca, LGPD, retencao, auditoria e criterios de bloqueio.

Decisoes:

- splash custom passa a ter simbolo maior, nome `SinalSeguro` abaixo e barra de loading;
- fundo da splash muda para `#120A20` para diferenciar melhor a logo;
- efeitos ornamentais foram removidos da splash;
- Home prioriza botao circular central `SOS`;
- atalhos principais ficam em grade: `Ligar 190`, `Anjos`, `Cofre`, `Config.`;
- botao 190 abre confirmacao e usa `tel:190`, sem promessa de integracao oficial;
- atalho 190 fica ativo por padrao, configuravel pela usuaria e sem acionamento automatico;
- chamada para anjo autorizado entra como preferencia futura, exigindo contato validado, contrato e confirmacao;
- `Arquivos locais` passa a ser tratado como `Cofre local`;
- player visual mostra midia bloqueada, politica de criptografia e acoes futuras;
- configuracoes permitem solicitar escopos futuros de audio, video e localizacao em tempo real, sempre bloqueados como `homologation_blocked`;
- envio backend/P2P deixa de ser marcado como pronto no envelope local enquanto adaptadores reais nao existem;
- compartilhar evidencia por share sheet generico fica bloqueado.

Documentacao:

- `docs/17_STREAMING_COFRE_PLAYER_E_190.md`.

Validacoes executadas:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run release:android:readiness`: pronto condicionado, com assinatura externa e diretorio nativo gerado como pendencias esperadas;
- Android fisico `23129RA5FL`: Home com `SOS`, atalho 190 com confirmacao, `Cofre local` com player bloqueado e `Configuracoes` com escopos futuros validados via ADB Wi-Fi.

## 2026-05-03 - Splash sem logo nativa antiga e Cofre com acoes em raio

Status: pronto para validacao simulada no Android conectado, com Metro ativo.

Especialistas acionados:

- Tarcila/Norman/Myers: revisao de splash, Home, player, trilha retratil e menu em raio.
- Schneier/Doneda/Ritchie: revisao de consentimento, convites, estados locais, delete e bloqueio de compartilhamento.
- Ada/Margaret/Myers: rebuild, instalacao e validacao Android via ADB Wi-Fi.

Decisoes:

- splash nativa Android remove a logo horizontal antiga; decisao posterior substituiu o drawable transparente pelo simbolo discreto aprovado;
- nao ha plugin blank ativo no estado vigente; `app.json` define a splash nativa com `sinalseguro-splash-approved.png`;
- pacote finalizado fica em `recorded_local`, sem promessa de fila/entrega;
- `consentSnapshot.sharing` passa a `blocked_until_contract_backend_audit`;
- contatos mock nao entram como autorizados no pacote de emergencia;
- pre-convites locais nao prometem aceite, revogacao ou uso controlado sem backend;
- delete local grava tombstone/auditoria antes de remover do dispositivo;
- player fica em area dedicada e a trilha de arquivos abre acoes em raio no pacote selecionado.

Validacoes executadas:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `./gradlew :app:assembleDebug --console=plain`: aprovado;
- instalacao Android via ADB Wi-Fi: `Success`;
- Metro validado com `packager-status:running`;
- Home, Cofre, player, trilha retratil, acoes em raio e compartilhamento bloqueado validados em Android fisico;
- evidencias salvas em `docs/evidencias/android/2026-05-03-ux-cofre/`;
- relatorio criado em `docs/18_VALIDACAO_UX_SPLASH_COFRE_ANDROID.md`.

## 2026-05-03 - Refino splash, SOS ativo, player local e simulador web

Status: implementado e validado no navegador; aguardando rebuild Android final.

Especialistas acionados:

- Tarcila/Norman: identidade visual, splash nativa com simbolo discreto, SOS ativo e layout do Cofre.
- Ada/Margaret/Kim: Expo web, dependencia `react-native-web`, splash nativa e build Android.
- Hedy: protocolo do botao SOS ativo, encerramento e player local.
- Schneier/Doneda/Myers: codigo de encerramento, hash local, exclusao, logs e criterios de aceite.

Decisoes:

- a splash nativa volta a exibir apenas o simbolo aprovado, evitando tela roxa vazia antes do React;
- a splash React continua com simbolo maior, nome `SinalSeguro` e loading;
- `SplashScreen.preventAutoHideAsync()` fica restrito a Android/iOS para nao bloquear web;
- simulador web passa a funcionar com `react-native-web`;
- SOS ativo exibe estado `ATIVO` e particulas discretas, com ate 8 pontos simultaneos;
- quando existe chamado ativo, o mesmo SOS serve para encerrar com o mesmo gesto de segurar;
- encerramento sem codigo usa confirmacao; encerramento com codigo usa modal proprio do app;
- codigo de encerramento vem desativado por padrao e fica salvo como hash local;
- player local ganhou controles de revisao, progresso e reinicio;
- exclusao local pelo raio deixa de depender de alerta nativo e remove o pacote direto do cofre local com tombstone.

Validacoes executadas:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run web -- --clear`: aprovado apos instalar `react-native-web`;
- Browser Use validou Home e `Cofre local` em `http://localhost:8081`;
- `./gradlew :app:assembleDebug --console=plain`: aprovado;
- `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`: aprovado;
- `npm run release:android:readiness`: pronto condicionado, com pendencias esperadas de assinatura release e diretorio nativo gerado;
- Android debug carregou bundle pelo Metro e `logcat` registrou `ReactNativeJS: Running "main"`;
- captura visual Android ficou bloqueada por overlay MIUI `NotificationShade`/AOD e `ScreenOnProximitySensorGuide`;
- evidencias salvas em `docs/evidencias/browser/2026-05-03-simulador/`;
- relatorio criado em `docs/19_REFINO_SPLASH_SOS_PLAYER_BROWSER.md`.

## 2026-05-03 - Home SOS fixa e modular validada em Browser/Android

Status: implementado, instalado no Android e pronto para validacao visual do usuario.

Especialistas acionados:

- Tarcila/Norman: revisao de identidade visual, home fixa, proporcao do SOS, icones oficiais e menu retratil.
- Ada/Hedy/Margaret: modularizacao mobile, gesto SOS, modelo de chamada oficial e validacao Android.
- Schneier/Doneda: fallback web controlado, codigo de encerramento sem padrao universal e limites de privacidade.
- Myers: gates locais, Browser Use, ADB, screenshot e logcat.

Decisoes:

- Home deixou de usar `SafeScreen` e `ScrollView`;
- header nativo foi removido da rota inicial para evitar duplicidade visual;
- titulo/subtitulo antigos do corpo foram removidos;
- SOS central passou a ocupar area responsiva com `width: "75%"` e `aspectRatio: 1`;
- tela principal fica fixa com apenas SOS e atalhos oficiais `Policia 190`, `Bombeiros 193` e `SAMU 192`;
- cofre/player, anjos, convites, configuracoes e atividade ficam no menu retratil da engrenagem;
- Home foi modularizada em `src/features/emergency-home/`, com componentes e modelo de chamada em arquivos proprios;
- `EmergencyCallTarget` concentra os dados e URI `tel:` dos canais oficiais;
- fallback web nao chama `expo-secure-store` e a simulacao web nao captura localizacao real;
- falha de persistencia do SOS passa a ser controlada, sem marcar chamado ativo se o pacote local nao for preservado;
- codigo universal `1900` deixou de ser padrao valido; ativacao exige novo codigo salvo como hash local.

Validacoes executadas:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run release:android:readiness`: pronto condicionado;
- `git diff --check`: aprovado;
- Browser Use validou explicitamente `http://localhost:8081/`;
- `./gradlew :app:assembleDebug --console=plain`: aprovado;
- `adb -s 192.168.0.5:5555 install -r android/app/build/outputs/apk/debug/app-debug.apk`: aprovado;
- Android fisico validou Home, drawer e SOS ativo por gesto longo;
- `logcat` ficou sem `FATAL`, `AndroidRuntime`, `RedBox`, `Unable to load script` ou `setValueWithKeyAsync`.

Documentacao:

- `docs/20_HOME_SOS_FIXA_MODULAR_ANDROID_BROWSER.md`.

Evidencias:

- `docs/evidencias/browser/2026-05-03-home-sos-refatorada/01-home-sos-fixa.png`;
- `docs/evidencias/android/2026-05-03-home-sos-refatorada/01-home-sos-fixa.png`;
- `docs/evidencias/android/2026-05-03-home-sos-refatorada/02-home-drawer.png`;
- `docs/evidencias/android/2026-05-03-home-sos-refatorada/03-sos-ativo.png`.

## 2026-05-03 - Revisao especialistas Home/Cofre/Seguranca

Status: implementado, validado e salvo no checkpoint.

Especialistas acionados:

- Tarcila/Norman: apontaram bloqueio de exclusao destrutiva sem confirmacao e jargao tecnico no drawer.
- Ada/Hedy: apontaram risco de multiplos chamados ativos e atalho 190 configuravel sem efeito na Home.
- Myers/Schneier/Doneda: apontaram necessidade de Node correto no readiness, web apenas simulador, reconciliacao da splash e bloqueios de seguranca.

Decisoes:

- `startEmergencyPackage()` impoe singleton/idempotencia no servico;
- `recordEmergencyPackage()` bloqueia se ja houver chamado ativo;
- `Excluir` no cofre exige confirmacao e fica bloqueado para pacote ativo;
- drawer da Home usa texto operacional, sem `backend/P2P`;
- `Policia 190` respeita `call190ShortcutEnabled`;
- `Bombeiros 193` e `SAMU 192` continuam como canais oficiais manuais;
- fallback web do cofre usa memoria volatil, sem `sessionStorage`;
- docs de splash foram reconciliados: splash nativa usa simbolo discreto aprovado, nao plugin blank.

Documentacao:

- `docs/21_REVISAO_ESPECIALISTAS_HOME_COFRE_SEGURANCA.md`.

Validacoes executadas:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run release:android:readiness`: pronto condicionado;
- `git diff --check`: aprovado;
- `./gradlew :app:assembleDebug --console=plain`: aprovado;
- `curl -fsS http://localhost:8081`: servidor web ativo;
- ADB sem dispositivo conectado nesta rodada.

## 2026-05-03 - Correcao do travamento Android na abertura

Status: implementado, instalado e validado no aparelho fisico.

Especialistas acionados:

- Margaret/Ada: build Android/Expo e dependencia Metro;
- Myers: validacao ADB, logcat e evidencias;
- Tarcila/Norman: continuidade visual da Home, Configuracoes, Cofre e SOS ativo;
- Schneier/Doneda: limites de midia, permissoes e dados sensiveis;
- Cristine/Knuth: memoria, especificacao e documentacao.

Decisoes:

- o APK debug de validacao passa a ter comando dedicado `npm run build:android:debug:bundled`;
- a propriedade Gradle `-PsinalBundleDebugJs=true` embute o JS no APK debug e remove a dependencia de Metro/`localhost:8081`;
- `MainApplication.kt` desliga o suporte nativo de desenvolvedor quando `SINAL_BUNDLED_DEBUG=true`, evitando consulta ao packager no APK de validacao;
- `app/_layout.tsx` ganhou fallback de `SplashScreen.hideAsync()` para evitar retencao da splash nativa;
- o endpoint futuro `/app/releases/latest` foi documentado no OpenAPI para a acao `Atualizar app`;
- Configuracoes registra aceite local de termos, privacidade e compartilhamento emergencial;
- camera/microfone continuam bloqueados no build publico, com preparo de preferencia para homologacao.

## 2026-05-03 - Build privado com midia local

Status: implementado em codigo e preparado para build/validacao Android privada.

Especialistas acionados:

- Tarcila/Norman: revisao visual do header, Home fixa, SOS, Cofre e Configuracoes.
- Ada/Hedy/Margaret: integracao `expo-camera`, gravacao local e APK debug bundled.
- Schneier/Doneda/Myers: permissoes, backup Android, perda de video no encerramento e gate privado.
- Cristine/Knuth: memoria, especificacao e continuidade.

Decisoes:

- O build publico segue sem midia, transmissao, stream, P2P ou compartilhamento externo.
- O build privado de homologacao local habilita `CAMERA` e `RECORD_AUDIO`.
- O SOS inicia pacote `recording_local` e, no Android/iOS, monta `EmergencyMediaRecorder`.
- Ao encerrar o SOS, a camera e parada e o video e copiado para `sinalseguro-media/` no sandbox privado antes de atualizar o Cofre.
- `android:allowBackup` fica `false` no Manifest nativo do build privado.
- Hash SHA-256 do asset de video e calculado a partir do conteudo preservado em base64.
- Tempo configuravel passou a significar tempo de gravacao local: `Ilimitado`, `1min`, `5min`, `15min`, `30min`, `60min`.
- A emergencia/chamado encerra somente por acao manual da usuaria, com confirmacao e codigo local opcional.
- Configuracoes foi compactada para reduzir risco de corte em telas Android menores, mantendo tela fixa e modais.

Arquivos principais:

- `src/features/emergency/EmergencyMediaRecorder.tsx`;
- `src/features/emergency/mediaCapture.ts`;
- `src/components/EvidencePlayerCard.tsx`;
- `scripts/android-private-media-readiness.mjs`;
- `scripts/prepare-android-bundled-debug.mjs`;
- `docs/26_BUILD_PRIVADO_MIDIA_LOCAL.md`.

Validacoes previstas para fechamento:

- `npm run typecheck`;
- `npm run lint`;
- `npm test`;
- `npm run private:android:readiness`;
- `npm run build:android:private`;
- `adb install`;
- cold start Android e logcat filtrado;
- teste manual: SOS inicia gravacao, encerramento preserva video, Cofre abre Player.

Validacoes executadas:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run build:android:debug:bundled`: aprovado;
- `adb -s 192.168.0.4:5555 install -r android/app/build/outputs/apk/debug/app-debug.apk`: aprovado;
- app abriu com Metro desligado e `adb reverse --remove-all`;
- cold start Android final: `TotalTime: 5700`;
- `logcat` isolado por PID sem `Unable to load script`, `Failed to connect`, `FATAL EXCEPTION`, `AndroidRuntime` ou `setValueWithKeyAsync`;
- SOS de teste entrou em `CHAMADO ATIVO`, capturou localizacao pontual e nao reproduziu o erro `ExpoSecureStore.default.setValueWithKeyAsync is not a function`.

Artefatos:

- `android/app/build/outputs/apk/debug/app-debug.apk`;
- SHA-256 `2bd9055863a51f46d4c41f24b768e22b25f43984990e0313f5fc4baa5d599c83`;
- `docs/25_CORRECAO_TRAVAMENTO_ANDROID_BUNDLE.md`;
- `docs/assets/mobile/2026-05-03-android-home-bundled.png`;
- `docs/assets/mobile/2026-05-03-android-configuracoes-bundled.png`;
- `docs/assets/mobile/2026-05-03-android-cofre-bundled.png`;
- `docs/assets/mobile/2026-05-03-android-sos-bundled-pos-localizacao.png`.

Observacao:

- Roberto informou USB conectado, mas `adb devices -l` enumerou apenas o transporte Wi-Fi `192.168.0.4:5555`; a instalacao usou o canal ADB ativo.

## 2026-05-03 - APK privado com midia local instalado

Status: build privado gerado, instalado e aberto no Android fisico.

Resultado:

- `npm run build:android:private`: aprovado;
- artefato `android/app/build/outputs/apk/debug/app-debug.apk`;
- tamanho aproximado: 103 MB;
- SHA-256 `056e41d7e1e91aef10c6763bb094bfe27973693c8c163b222c6f4be2952be67b`;
- `adb -s 192.168.0.4:5555 install -r android/app/build/outputs/apk/debug/app-debug.apk`: `Success`;
- permissoes de camera, microfone, localizacao fina/aproximada e notificacoes concedidas via ADB para homologacao privada;
- cold start Android: `Status: ok`, `LaunchState: COLD`, `TotalTime: 4103`;
- logcat filtrado sem crash fatal, erro de bundle Metro, `setValueWithKeyAsync`, `RedBox` ou `Exception`.
- revalidacao final de abertura Android: `TotalTime: 5787`, log `/tmp/sinalseguro-private-media-logcat-final.txt`, sem ocorrencias fatais filtradas.

Gates executados no fechamento:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run private:android:readiness`: pronto condicionado para build privado;
- `npm run release:android:readiness`: bloqueado corretamente para release publico por Node local e instrumentacao privada de midia.

Evidencias:

- `docs/assets/mobile/2026-05-03-android-private-media-home.png`;
- `docs/assets/mobile/2026-05-03-android-private-media-home-final.png`;
- `/tmp/sinalseguro-private-media-logcat.txt`.

Pendencia de validacao manual:

- a injecao de toque por ADB nao acionou os controles nesta rodada;
- Roberto/Myers devem validar manualmente no aparelho: SOS inicia camera, encerramento preserva video, Cofre lista o pacote e Player reproduz o arquivo local.

## Modelo de registro

| Data | Evento | Responsavel | Impacto | Proximo passo |
|---|---|---|---|---|
|  |  |  |  |  |

## 2026-05-03 - Refinos de midia, cofre e topo

Status: implementado e validado em gates locais.

Especialistas acionados:

- Tarcila/Norman: topo com simbolo sem texto e remocao do feedback verde do SOS ativo.
- Ada/Hedy: fluxo de permissao de camera/microfone e registro correto da camera usada.
- Schneier/Myers: bloqueio de exclusao de chamado ativo no servico e preservacao do pacote quando arquivo local nao puder ser removido.
- Cristine/Knuth: memoria e documentacao do checkpoint.

Decisoes:

- O topo usa `sinalseguro-symbol.png` como logomarca sem texto; o nome `SinalSeguro` continua como texto da UI para contraste.
- O SOS ativo nao usa mais halo/glow verde; o feedback visual segue magenta/rosa da identidade visual.
- O anel de progresso foi ajustado para rodar na circunferencia do botao SOS, sem escapar da borda em telas responsivas.
- A gravacao solicita permissao de camera/microfone antes de esperar `CameraView.onCameraReady`.
- `Duas cameras` continua disponivel como preferencia de homologacao; o build privado tenta captura dupla e registra `requestedCameraMode` para auditoria tecnica quando houver fallback.
- O Player usa progresso real do `expo-video` quando ha arquivo local.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.

## 2026-05-03 - Home limpa, player compacto e duas cameras padrao

Status: implementado; validacao final em browser/Android neste checkpoint.

Especialistas acionados:

- Tarcila/Norman: remover ruido visual da Home, padronizar menus e manter identidade visual.
- Ada/Hedy: migrar preferencias para `Duas cameras` como padrao de homologacao.
- Myers/Schneier: registrar riscos de memoria/cota para gravacoes longas antes de uso real.
- Cristine/Knuth: atualizar memoria, especificacao e documentacao de build privado.

Decisoes:

- Home nao exibe mais o texto auxiliar `Solte`.
- Drawer inicial e drawer do Cofre usam o mesmo menu de acoes iconograficas, sem metricas ou textos tecnicos.
- Modais de ligacao destacam `190`, `193` e `192` como numero principal, com sombra e contraste.
- Fundo da Home remove riscos/linhas e usa particulas/circulos sutis.
- `Duas cameras` passa a ser preferencia padrao e migracao das configuracoes antigas.
- Player do Cofre foi compactado para priorizar video, seletor de camera, controles e metadados essenciais.

Pendencias tecnicas registradas:

- Substituir hash de video por rotina incremental/binaria antes de gravacoes longas.
- Definir cota/retencao local para captura ilimitada e dupla.

## 2026-05-03 - Anel SOS mais visivel

Status: implementado; em validacao browser/Android.

Especialistas acionados:

- Tarcila/Norman: revisar contraste do anel sem quebrar a circunferencia do botao.
- Ada/Hedy: manter direcao horaria para acionar e anti-horaria para encerrar.
- Myers: validar que o anel aparece no Android fisico durante pressao longa.

Decisoes:

- O anel continua dentro da circunferencia do SOS, sem aro externo deslocado.
- Trilho e progresso ganharam mais opacidade e espessura, mantendo o efeito discreto.
- Preferencias antigas anteriores ao `schemaVersion 6` migram para `Duas cameras`.
- APK privado reinstalado no Android `192.168.0.4:5555`, SHA-256 `f5a407ca1937f589f8d1c1f4dc1d2f251e8cf1f7031e59ef76f3ac3373724f15`, cold start `TotalTime: 4487`.
- Evidencias salvas em `docs/assets/mobile/2026-05-03-android-ring-visivel-home.png` e `docs/assets/mobile/2026-05-03-android-ring-visivel-hold.png`; log filtrado por PID em `docs/evidencias/android/2026-05-03-ring-player-private/logcat-launch-app.txt`.

## 2026-05-04 - Drawer Cofre/Player, Configuracoes limpa e Cofre em grade

Status: implementado em codigo e documentado para validacao Android.

Especialistas acionados:

- Tarcila/Norman: SOS com efeito de bolha, menu mais objetivo e Configuracoes sem banner tecnico.
- Ada/Hedy: rotas `Cofre` e `Player` separadas por parametro de painel e cofre em grade vertical.
- Myers/Schneier: manter fechamento por toque fora sem perda de dados, bloquear compartilhamento externo e preservar exclusao auditada.
- Cristine/Knuth: memoria, especificacao e evidencia do checkpoint.

Decisoes:

- Drawer da Home e do Cofre passa a mostrar `Cofre`, `Anjos`, `Player` e `Configuracoes`.
- `Cofre` abre a trilha de arquivos; `Player` abre a revisao segura.
- Configuracoes removeu o bloco de status `Preferencias carregadas`.
- Modais e drawer fecham ao tocar fora.
- Cofre local exibe pacotes em grade vertical com acoes iconograficas em linhas/colunas.
- SOS manteve o anel dentro da circunferencia e ganhou mais contraste para o gesto de pressao longa.

Evidencias:

- `docs/assets/mobile/2026-05-04-home-sos-bolha.png`;
- `docs/assets/mobile/2026-05-04-home-menu-cofre-player.png`;
- `docs/assets/mobile/2026-05-04-configuracoes-sem-banner.png`;
- `docs/assets/mobile/2026-05-04-cofre-modal-grid.png`.

Documento do ciclo:

- `docs/27_REFINO_DRAWER_COFRE_PLAYER_CONFIG.md`.

## 2026-05-04 - Continuidade documental apos interrupcao

Status: protocolo documental registrado; sem alteracao de codigo do app nesta rodada.

Responsaveis:

- Cristine/Knuth: continuidade documental e memoria mobile.
- Zé: supervisao de consistencia com a memoria mestre.
- Myers/Schneier: devem ser acionados quando a retomada envolver build, instalacao, permissao, midia, dados, seguranca ou validacao tecnica.

Decisoes de continuidade:

- toda retomada deve ler memoria local e timeline antes de executar nova etapa;
- a primeira checagem deve ser `git status --short` no repo `apps/mobile`;
- alteracoes de outros agentes ou do usuario nao devem ser revertidas;
- a proxima acao deve reaproveitar o que ja esta documentado, evitando redundancia;
- antes de build longo, instalacao Android/iOS, publicacao ou validacao demorada, salvar checkpoint minimo em docs/memoria quando houver estado novo consolidado;
- manter lista de pendencias, artefatos, hashes, aparelho/ADB usado, gates, bloqueios e publicacoes;
- validar antes de publicar e registrar claramente o resultado.

Checkpoint mobile atual:

- SOS segue em refino UX/IX com efeito de bolha, anel de pressao mais visivel e feedback magenta/rosa;
- Home permanece limpa, sem texto auxiliar redundante, com drawer iconografico;
- Cofre e Player foram separados no drawer;
- Cofre local usa grade vertical e acoes por icones;
- codigo de seguranca para encerramento continua local, opcional, com hash e sem codigo universal padrao;
- midia privada continua restrita a homologacao controlada;
- script/gate de APK privado Android continua separado do gate publico;
- instalacao Android e cold start ja foram validados em ciclos recentes no aparelho `23129RA5FL` via ADB Wi-Fi;
- validacao manual pendente: SOS inicia camera, encerramento preserva video, Cofre lista pacote e Player reproduz midia local.

Pendencias para proxima sessao:

1. Verificar `git status --short` antes de tocar qualquer arquivo.
2. Confirmar se o APK privado vigente ainda corresponde ao ultimo hash documentado ou se houve novo build por outro agente.
3. Validar manualmente no Android fisico o fluxo SOS com midia local.
4. Registrar hash, aparelho, logcat, evidencias e resultado de QA.
5. Publicar apenas depois de gates e aceite compatíveis com o risco.

## 2026-05-05 - Checkpoint de pausa para liberar disco

Status: pausado por solicitacao do Roberto; estado preservado para retomada.

Responsaveis:

- Zé/Cristine: salvar memoria, evitar retrabalho e publicar checkpoint.
- Ada/Hedy: retomar ajustes tecnicos sem repetir o que ja esta validado.
- Tarcila/Norman: retomar revisao visual de SOS, modais, Cofre e Player.
- Myers/Schneier: validar antes do proximo APK privado.

Decisoes:

- Quando houver risco de limite de uso, interrupcao, build longo ou pausa para limpeza de disco, salvar memoria e Git antes de continuar.
- Durante a pausa nao executar build, instalacao, limpeza automatica ou validacao pesada.
- A retomada deve comecar por `git status --short` e leitura das memorias locais.

Pendencias de retomada:

1. Finalizar refinamento de modais com linguagem de produto e ajuda em `(?)`.
2. Simplificar fluxo do codigo de seguranca.
3. Ajustar hash de video grande para nao carregar arquivo inteiro em memoria.
4. Validar visualmente no browser `localhost:8081`.
5. Rodar gates leves, gerar APK privado pelo script e instalar no Android quando Roberto liberar espaco.
