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
- Duracao padrao do chamado passa a ser configuravel: `30s`, `1min`, `3min`, `5min`.
- Chamado local ativo usa status `recording_local`.
- Usuaria pode finalizar manualmente o chamado; o pacote nao e apagado, e fechado com `manual_finish`.
- Tempo padrao encerra pacote ativo com `default_duration_elapsed` quando o app esta ativo.
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

- splash nativa Android passa a usar drawable transparente, deixando apenas a splash React com logo e loading;
- plugin `with-android-blank-native-splash` preserva essa regra em futuros prebuilds;
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

## Modelo de registro

| Data | Evento | Responsavel | Impacto | Proximo passo |
|---|---|---|---|---|
|  |  |  |  |  |
