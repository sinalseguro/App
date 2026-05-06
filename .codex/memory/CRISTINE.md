# Memoria - Cristine

Data inicial: 2026-05-02  
Funcao: gerente AI mobile do SinalSeguro App  
Supervisao: Zé

## Missao

Cristine coordena o desenvolvimento mobile Android/iOS, mantendo plano, cronograma, backlog, timeline, handoffs, riscos, status de sprints e memoria de continuidade.

## Responsabilidades

- Quebrar o plano em tarefas executaveis.
- Garantir que Android e iOS compartilhem o mesmo UX/UI/IX.
- Coordenar Ada, Katherine, Margaret, Hedy, Ritchie, Norman, Tarcila, Schneier, Doneda, Myers, Kim, Knuth, ESCRIBA/Freire e Marty.
- Manter `docs/03_TIMELINE.md` atualizado a cada checkpoint.
- Bloquear escopo que viole LGPD, seguranca, lojas ou regras do projeto.
- Registrar pendencias sem incluir dados sensiveis.

## Protocolo de retomada apos interrupcao

Quando a sessao for retomada apos limite de uso, troca de agente, interrupcao de build ou pausa longa:

1. Ler `AGENTS.md`, `.codex/AGENTS.md`, `.codex/memory/CRISTINE.md`, `docs/03_TIMELINE.md` e o documento especifico da demanda.
2. Rodar `git status --short` no repo `apps/mobile` antes de editar qualquer arquivo.
3. Presumir que alteracoes nao reconhecidas pertencem a outro agente ou ao usuario; nao reverter, nao reformatar e nao sobrescrever sem pedido explicito.
4. Comparar o pedido atual com memoria/timeline para evitar refazer trabalho ja registrado.
5. Antes de builds longos, instalacoes fisicas, publicacoes ou validacoes demoradas, salvar checkpoint minimo em memoria/timeline quando houver estado novo consolidado.
6. Manter lista viva de pendencias, artefatos, hashes, dispositivo/ADB usado, gates executados e bloqueios.
7. Validar e so entao publicar; registrar separadamente o que foi aprovado, o que ficou bloqueado e o que ficou para homologacao.
8. Separar sempre build publico, APK privado de homologacao, fase futura, dependencia juridica, dependencia de convenio e dependencia de infraestrutura.

## Decisoes ativas

- Stack: React Native + Expo Dev Client/EAS.
- Android minimo: 7+.
- iOS minimo: 15.1+.
- Arquitetura: API-first.
- P2P: futuro/best-effort.
- Midia: homologacao controlada.
- Rede social: fase futura.
- Distribuicao: QR codes apontam para `/baixar/android` e `/baixar/ios`.
- GitHub Releases: canal tecnico previsto para APK Android assinado.
- iOS: TestFlight/App Store, sem IPA publico nesta fase.
- Gate privado vigente: `npm run private:android:readiness`.
- Gate publico: `npm run release:android:readiness` deve bloquear enquanto este workspace contiver instrumentacao privada de midia.

## Proximo checkpoint

Etapa ativa: midia privada criptografada por chunks, adaptador de playback seguro por range e validacao manual do APK privado Android com midia local.

Estado ativo em 2026-05-05:

- Ada foi nomeada gerente operacional desta tarefa de midia, sob coordenacao de Ze;
- Schneier e Myers revisaram o risco atual: MP4 claro em sandbox, hash em Base64 para arquivos grandes e player abrindo URI direta;
- `EncryptedVideoStore` passou a preservar videos novos em chunks cifrados com chave unica por video;
- algoritmo implementado: XChaCha20-Poly1305 com chave de 32 bytes, nonce unico por chunk e AEAD autenticado;
- manifesto cifrado/autenticado registra chunks, offsets, tamanhos, hashes, nonces, tags, codec, duracao pendente, thumbnail segura pendente e envelopes futuros;
- `EncryptedVideoDataSource` fornece leitura por range para seek, replay e reproducao parcial sem descriptografar o video inteiro;
- o player interno nao abre ciphertext como URI de video; reproducao segura de assets cifrados depende do proximo bloco: adaptador nativo ou servidor HTTP local loopback com suporte a `Range`;
- testes unitarios cobrem chunk, seek, replay, corrupcao e chave invalida;
- documento de continuidade: `docs/30_MIDIA_CRIPTOGRAFADA_CHUNKS.md`.
- Ritchie assumiu a frente tecnica do plano remoto EC2/P2P/conveniados, sob coordenacao de Ze;
- `RemoteSharingPlan` foi criado para modelar a EC2 como coordenadora de login, dispositivos, chaves publicas, envelopes de chave, sinalizacao P2P e auditoria;
- `EmergencyDeliveryPlan.remoteSharing` registra video, audio e localizacao em tempo real como canais futuros criptografados ponta a ponta, liberados somente durante emergencia ativa;
- conveniados permanecem fase futura separada, exigindo contrato, RBAC, MFA, retencao, auditoria e RIPD/DPIA;
- documento de continuidade: `docs/31_ARQUITETURA_COMPARTILHAMENTO_TEMPO_REAL.md`.
- em 2026-05-05, Roberto bifurcou backend/mobile/CRM para a sessao `019df9a8-1894-7002-b7f8-199eaaf3f118`; este chat deve continuar focado apenas na interface de midia;
- interface de midia refinada com rotulos centralizados em `mediaInterfacePresentation`, badges de protecao no Cofre e estados claros no Player;
- browser local validado em `http://localhost:8081/arquivos?painel=cofre` e `http://localhost:8081/arquivos?painel=player`;
- correção web pequena: `Linking.openSettings()` passa a ter fallback em navegador para nao bloquear validacao visual.

Estado ativo em 2026-05-04:

- UX/IX do SOS em refinamento com efeito de bolha, anel de pressao mais visivel dentro da circunferencia e feedback magenta/rosa;
- Home sem microcopy redundante e drawer enxuto por acoes iconograficas;
- drawer da Home e do Cofre separa `Cofre`, `Anjos`, `Player` e `Configuracoes`;
- Cofre local em grade vertical, com acoes por icones, exclusao confirmada, tombstone/auditoria local e bloqueio de exclusao de chamado ativo;
- Player privado/homologacao compacto, com video local preservado, progresso real quando houver midia e metadados essenciais;
- codigo de seguranca para encerramento segue local, opcional, salvo como hash e sem codigo universal padrao;
- midia privada permanece restrita a homologacao controlada; build publico continua sem camera/microfone, streaming, upload, P2P, compartilhamento externo ou integracao oficial;
- script/gate privado de APK Android permanece separado do gate publico;
- Android fisico de referencia recente: `23129RA5FL`, ADB Wi-Fi `192.168.0.4:5555`;
- proxima validacao manual no aparelho deve confirmar: SOS inicia camera, encerramento preserva video, Cofre lista pacote e Player reproduz midia local;
- pendencias tecnicas: hash incremental/binario para videos longos, cota/retencao local, homologacao juridica/seguranca para transmissao, backend, anjos reais, chaves, retencao e exportacao.

Estado ativo em 2026-05-03:

- APK privado com midia local instalado no Android `192.168.0.4:5555`;
- hash vigente `b6993cf4056d9926e582e9579621f4e32f468fc83e1cc66185678652b51df22f`;
- abertura fria revalidada sem crash fatal;
- topo revisado por Tarcila para usar o simbolo `sinalseguro-symbol.png` como logomarca sem texto, mantendo `SinalSeguro` como texto responsivo de interface;
- feedback ativo do SOS sem animacao verde, usando apenas a paleta magenta/rosa da identidade;
- proxima validacao depende de toque manual no aparelho: SOS inicia camera, encerramento preserva video, Cofre lista pacote e Player reproduz midia local.

Estado em 2026-05-02:

- especialistas acionados: Kim, Ada, Margaret, Myers, Schneier, Doneda, Tarcila, Knuth e ESCRIBA/Freire;
- plano operacional versionado em `docs/13_ETAPA_1_ANDROID_INSTALAVEL.md`;
- `eas.json` define `preview` como APK interno e `production` como AAB futuro;
- `expo-build-properties` define Android 7+, target SDK 36 e iOS 15.1+ no schema correto do Expo;
- `expo-doctor` esta limpo em 17/17 checks;
- `npm run release:android:readiness` e o gate obrigatorio antes de build;
- camera/microfone, overlay e armazenamento legado ficam fora do primeiro instalavel;
- Android SDK local foi preparado com `android-36`;
- keystore de upload foi criada fora do repositorio, com senhas no Keychain;
- APK assinado local foi gerado e validado como artefato de homologacao tecnica;
- Android interno 2 incorporou validacao Tarcila de nome, logo, icone, splash e contraste;
- SHA-256 atual do APK: `dbad294407038cac954fd3154bac6c4ea9dbb30b4e79164f58807e83f0d358cb`;
- GitHub Release Android interno 1 foi publicada em `https://github.com/sinalseguro/App/releases/tag/android-v0.1.0-internal.1`;
- GitHub Release Android interno 2 foi publicada em `https://github.com/sinalseguro/App/releases/tag/android-v0.1.0-internal.2`;
- APK interno 2 foi instalado e aberto em Android fisico via ADB Wi-Fi, com `versionCode=2`;
- portal e manifestos apontam ao APK/checksum interno 2 para homologacao controlada;
- deploy dos portais concluido em `cereus_web:/var/www/sinalseguro/releases/20260502T191004Z`;
- funcoes de convite local foram implementadas com codigo opaco, expiracao, share sheet e deep link futuro;
- pacote local de emergencia foi implementado com horario, consentimento, localizacao pontual autorizada, manifesto de midia bloqueada, hash SHA-256 e plano de entrega API/P2P pendente;
- area `Arquivos locais` foi criada para listar pacotes gravados, hash, status de georreferencia, midia bloqueada e plano de envio futuro;
- convites e pacotes pequenos usam cofre local do sistema via `expo-secure-store`, com indice sem dado sensivel em `AsyncStorage`;
- alerta permanece simulado ate outbox criptografada, API e revisoes de seguranca/QA.
- validacao Android fisica dos recursos locais foi concluida em `23129RA5FL`, Android 15, via ADB Wi-Fi `192.168.0.5:5555`;
- APK debug validado: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `a3b04d9e29349319ead70200c75c030d980b6b1b67feb8a5d34ec78c6b6b71b5`;
- convites, deep link, alerta local, georreferencia consentida, negacao de localizacao, arquivos locais e persistencia foram validados;
- Myers/Schneier identificaram `SYSTEM_ALERT_WINDOW` no manifest debug gerado pelo Expo; foi corrigido no APK e criado plugin local de hardening para proximos prebuilds;
- evidencias saneadas ficaram em `docs/evidencias/android/2026-05-02-recursos-locais/`;
- relatorio tecnico ficou em `docs/15_VALIDACAO_ANDROID_RECURSOS_LOCAIS.md`.
- duracao padrao configuravel foi adicionada com opcoes `30s`, `1min`, `3min`, `5min`;
- chamado local ativo agora usa `recording_local` e pode ser finalizado manualmente;
- finalizacao recalcula SHA-256 sem carregar o bloco `integrity` anterior;
- Home e Alerta recarregam preferencias ao ganhar foco, para aplicar imediatamente mudancas de configuracao;
- configuracoes permite pre-autorizar localizacao foreground para evitar novo prompt quando a permissao ja esta concedida;
- configuracoes trata ausencia de `ACCESS_BACKGROUND_LOCATION` como bloqueio esperado no build publico, sem quebrar a tela;
- segundo plano e atalho fisico por volume com tela travada foram documentados como homologacao/pesquisa futura, sem promessa no MVP publico;
- `app/_layout.tsx` chama `SplashScreen.hideAsync()` no mount para evitar retencao extra da tela inicial;
- Tarcila aprovou splash, icone, adaptive icon atual e lockup para homologacao interna;
- validacao Android fisica confirmou duracao `30s`, chamado ativo, finalizacao manual e pacote finalizado em `Arquivos locais`;
- documento `docs/16_SEGUNDO_PLANO_ATALHO_FISICO_E_DURACAO.md` registra limites tecnicos e fontes oficiais.
- splash custom foi redesenhada com simbolo maior, nome `SinalSeguro` abaixo e barra de loading, sem efeitos ornamentais;
- Home agora prioriza botao circular central `SOS`;
- atalhos principais ficam em grade: `Ligar 190`, `Anjos`, `Cofre`, `Config.`;
- `Arquivos locais` passa a ser apresentado como `Cofre local`;
- player visual e politica de evidencias foram adicionados para arquivos gravados/recebidos, com midia real bloqueada no build publico;
- preferencias locais permitem solicitar escopos futuros de audio, video e localizacao em tempo real, mas sempre `homologation_blocked`;
- atalho 190 fica ativo por padrao com confirmacao manual e pode ser desativado em configuracoes;
- chamada para anjo autorizado foi registrada como preferencia futura, sem chamada automatica no build publico;
- envelope local nao marca mais backend/P2P como prontos sem adaptadores reais;
- documento `docs/17_STREAMING_COFRE_PLAYER_E_190.md` registra contrato bilateral, chaves, player, cofre e 190.
- validacao Android fisica confirmou Home com `SOS`, atalho 190 com confirmacao, `Cofre local` com player bloqueado e `Configuracoes` com escopos futuros;
- gates locais aprovados: `typecheck`, `lint`, `test`, `release:android:readiness` pronto condicionado.
- em 2026-05-03, a splash nativa antiga com logo horizontal foi removida; decisao posterior de Tarcila substituiu a transicao vazia por simbolo discreto aprovado;
- pacote finalizado foi alinhado para `recorded_local`, sem promessa de fila/entrega;
- consentimento de compartilhamento foi alinhado para `blocked_until_contract_backend_audit`;
- pre-convites locais nao prometem aceite/revogacao sem backend;
- contatos mock nao entram como anjos autorizados no pacote local;
- delete local registra tombstone/auditoria antes de remover o pacote deste dispositivo;
- Cofre local foi validado com player dedicado, trilha retratil, acoes em raio e compartilhamento bloqueado;
- registro historico: a microcopy do SOS chegou a usar `Solte`; no checkpoint posterior, esse texto auxiliar foi removido da Home para reduzir ruido no acionamento;
- API real ficou bloqueada por flag de ambiente, sem endpoint hardcoded ativo por padrao;
- share sheet do sistema ficou documentado como excecao exclusiva para pre-convite sem evidencia;
- Navegador abriu `http://127.0.0.1:8081` com titulo `SinalSeguro`, mas preview web ficou preto no dev-client; validacao visual oficial segue no Android fisico;
- readiness Android passou com Node 24 e acesso remoto GitHub, restando apenas pendencias esperadas de assinatura e nativo gerado;
- evidencias ficaram em `docs/evidencias/android/2026-05-03-ux-cofre/`;
- relatorio complementar ficou em `docs/18_VALIDACAO_UX_SPLASH_COFRE_ANDROID.md`;
- gates aprovados: `typecheck`, `lint`, `test`, `assembleDebug`, install Android via ADB Wi-Fi.
- apos nova revisao de Roberto em 2026-05-03, Tarcila/Norman orientaram trocar a splash nativa vazia por simbolo discreto aprovado;
- `app/_layout.tsx` passou a proteger `expo-splash-screen` apenas em Android/iOS, destravando o simulador web;
- `react-native-web` foi instalado para permitir preview em navegador;
- Home no navegador foi validada com SOS central e atalhos principais em `http://localhost:8081`;
- `Cofre local` no navegador foi validado com player dedicado e area de revisao local;
- SOS ativo agora muda para `ATIVO`, exibe particulas discretas e usa o mesmo gesto para acionar ou encerrar;
- encerramento seguro ganhou confirmacao e codigo opcional, desativado por padrao, armazenado como hash local;
- `Configuracoes` ganhou area `Seguranca para encerrar`;
- player local ganhou controles de revisar, pausar, reiniciar e linha de progresso;
- exclusao local pelo raio passou a remover o pacote diretamente do cofre local com tombstone, sem depender de `Alert` nativo;
- evidencias browser ficaram em `docs/evidencias/browser/2026-05-03-simulador/`;
- relatorio complementar ficou em `docs/19_REFINO_SPLASH_SOS_PLAYER_BROWSER.md`;
- APK debug foi reconstruido e instalado no Android via ADB Wi-Fi;
- readiness Android passou como pronto condicionado, com pendencias esperadas de assinatura release e diretorio nativo gerado;
- `logcat` confirmou `ReactNativeJS: Running "main"` no Android debug, sem crash fatal;
- captura visual Android ficou bloqueada por overlay MIUI `NotificationShade`/AOD e `ScreenOnProximitySensorGuide`, exigindo desbloqueio/limpeza do overlay para validacao visual fisica;
- gates aprovados nesta revisao: `typecheck`, `lint`, `test`, `web`, `assembleDebug`, `install Android`, `release:android:readiness`.
- apos correcao de rota apontada por Roberto, validacao da Home passou a ser feita explicitamente em `http://localhost:8081/`, nao em `/arquivos`;
- Tarcila/Norman reprovaram a Home anterior por rolagem, texto duplicado, SOS pequeno, menu ausente e atalhos incompletos;
- Home foi refatorada para superficie fixa de emergencia, sem `SafeScreen`/`ScrollView`, com header nativo oculto apenas na rota inicial;
- tela principal agora mostra apenas topo discreto, SOS central responsivo e atalhos oficiais `Policia 190`, `Bombeiros 193` e `SAMU 192`;
- registro historico: o drawer da engrenagem chegou a concentrar `Modo atual`, status e atalhos; no checkpoint posterior, ele foi simplificado para acoes iconograficas essenciais;
- criterios de arquitetura atualizados: componentes de layout/regra ficam em arquivos proprios sob `src/features/emergency-home/`;
- `EmergencyCallTarget` passou a modelar os canais oficiais e URI `tel:`;
- fallback web de `secureStorage` deixou de chamar `expo-secure-store` e usa armazenamento de simulador por sessao/memoria;
- SOS web nao captura localizacao real e erro de persistencia vira falha controlada;
- codigo universal de encerramento deixou de ser padrao valido; ativacao exige novo codigo salvo como hash local;
- Browser Use validou Home fixa e drawer em `http://localhost:8081/`;
- Android fisico recebeu APK debug atualizado via ADB Wi-Fi e validou Home, drawer e SOS ativo com gesto longo;
- evidencias foram salvas em `docs/evidencias/browser/2026-05-03-home-sos-refatorada/` e `docs/evidencias/android/2026-05-03-home-sos-refatorada/`;
- relatorio complementar criado em `docs/20_HOME_SOS_FIXA_MODULAR_ANDROID_BROWSER.md`;
- gates aprovados nesta revisao: `typecheck`, `lint`, `test`, `release:android:readiness`, `git diff --check`, `assembleDebug`, `adb install`, Browser Use e logcat filtrado.
- revisao complementar dos especialistas em 2026-05-03 identificou bloqueios de UX/seguranca antes de novo checkpoint;
- Tarcila/Norman exigiram confirmacao antes de excluir evidencia local e remocao de jargao `backend/P2P` do drawer;
- Ada/Hedy exigiram singleton/idempotencia no servico de SOS e respeito ao atalho 190 configuravel;
- Schneier/Doneda/Myers reforcaram web como simulador volatil, reconciliacao da splash e readiness com Node correto;
- `startEmergencyPackage()` agora impede multiplos chamados `recording_local` por dispositivo;
- `recordEmergencyPackage()` nao finaliza chamado ativo por engano;
- cofre local agora confirma exclusao, bloqueia exclusao de chamado ativo e preserva tombstone local;
- `Policia 190` respeita `call190ShortcutEnabled`; `Bombeiros 193` e `SAMU 192` seguem visiveis;
- fallback web do cofre deixou de usar `sessionStorage` e fica apenas em memoria volatil;
- `docs/18_VALIDACAO_UX_SPLASH_COFRE_ANDROID.md` foi reconciliado com o estado real: splash nativa com simbolo discreto aprovado, sem plugin blank;
- relatorio complementar criado em `docs/21_REVISAO_ESPECIALISTAS_HOME_COFRE_SEGURANCA.md`.
- gates finais aprovados: `typecheck`, `lint`, `test`, `release:android:readiness`, `git diff --check` e `assembleDebug`;
- servidor web respondeu em `http://localhost:8081`;
- ADB nao tinha aparelho conectado no fechamento desta rodada, portanto nao houve reinstalacao fisica adicional.
- em 2026-05-03, a rodada de comentarios do navegador foi aplicada sob supervisao Tarcila/Norman;
- splash nativa foi substituida por `assets/brand/sinalseguro-splash-approved.png`, com simbolo grande, nome e fundo institucional;
- `AppTopBar`, `BrandedDialog` e `ResourceTile` foram criados como componentes compartilhados;
- Home manteve superficie fixa, agora com topo de logo real e drawer com ajuda/opcoes de modo;
- `Alert.alert` foi removido dos fluxos criticos de Home e Cofre;
- SOS ganhou profundidade 3D discreta, estado pressionado e particulas ativas mais altas/lentas;
- Cofre local foi refatorado para tela fixa por icones, com Player e Cofre em modais;
- dados tecnicos do cofre passaram para menu sanduiche;
- pagina `Como funciona` foi criada e ligada ao Cofre;
- configuracoes ganharam preparo de preferencia para video local futuro com camera frontal, traseira ou ambas, sem solicitar permissao real no build publico;
- screenshot set salvo em `docs/assets/mobile/2026-05-03-*.png`;
- relatorio criado em `docs/22_REFINO_IDENTIDADE_MODAL_COFRE_SPLASH.md`;
- especificacao viva criada em `docs/23_ESPECIFICACAO_DESENVOLVIMENTO_APP.md`;
- Browser Use validou Home, menu, modais, Cofre e Funcionamento em `http://localhost:8081`;
- APK debug reconstruido com SHA-256 `481d9aca5dd1cabb36520440f7959c71b542af5619803aadbe5170164b300e70`;
- `release:android:readiness` ficou bloqueado apenas pelo Node local `20.16.0`; exige `>=22.13.0`;
- ADB continuou sem dispositivo visivel apos restart do servidor; instalacao fisica ficou pendente;
- handoff para portais registrado para sessao `019ddfad-a214-72a3-9b50-ba204e1c9351`.
- complemento de continuidade em 2026-05-03 corrigiu o bloqueio P1 apontado por Schneier/Doneda/Myers: o Cofre agora usa confirmacao e codigo local opcional antes de finalizar chamado ativo;
- `BrandedDialog` ganhou rolagem interna para reduzir overflow em aparelhos menores ou fonte ampliada;
- `docs/23_ESPECIFICACAO_DESENVOLVIMENTO_APP.md` documenta permissoes transitivas do APK debug, mantendo camera/microfone/overlay/storage bloqueados;
- prints de `Cofre fixo` e `Como funciona` foram recapturados em `docs/assets/mobile/`;
- registro historico: o drawer da Home chegou a separar modo e ajuda em botoes irmaos; no checkpoint posterior, modo/status foram retirados da Home e mantidos como configuracoes por modal;
- relatorio complementar ficou em `docs/24_CONTINUIDADE_COFRE_ENCERRAMENTO_QA.md`;
- gates aprovados no complemento: `typecheck`, `lint`, `test`, `git diff --check`, `release:android:readiness` com Node 24 e `assembleDebug`;
- ADB continuou sem dispositivo; `adb connect 192.168.0.5:5555` retornou `Connection refused`.

Proximas acoes:

1. Reinstalar APK debug no Android quando `adb devices -l` mostrar o aparelho.
2. Validar splash nativa no Android reinstalado.
3. Validar Home, SOS ativo/encerramento, drawer, Cofre, Player e Funcionamento no Android fisico.
4. Tarcila/Myers aprovarem ou pedirem ajustes finais.
5. Gerar release interna 3 somente apos validacao fisica.
6. Atualizar portal/manifestos para release interna 3 apos APK assinado.
7. Acionar agentes dos portais na sessao `019ddfad-a214-72a3-9b50-ba204e1c9351`.
8. Preparar TestFlight/App Store para iOS.
9. Consolidar `alerts` e `emergency` em uma outbox unica criptografada e idempotente.
10. Conectar mock de API ao contrato OpenAPI.
11. Implementar adaptador de envio real apenas depois de auth, consentimento, retencao e revisao Schneier/Doneda.
12. Manter `origin` usando `github-sinalseguro-admin` para pushes do repo App.

## Memoria viva - 2026-05-03 - Android abriu sem Metro

- Roberto reportou travamento ao abrir no Android.
- Myers/Margaret identificaram que o APK debug anterior dependia do Metro em `localhost:8081`; sem Metro acessivel, o React nao carregava e a splash nativa ficava presa.
- A correcao vigente e usar `npm run build:android:debug:bundled`, que chama `./gradlew assembleDebug -PsinalBundleDebugJs=true`.
- `android/app/build.gradle` deve manter a propriedade `sinalBundleDebugJs` somente para validacao fisica; builds normais de desenvolvimento podem continuar usando Metro.
- `MainApplication.kt` usa `BuildConfig.DEBUG && !BuildConfig.SINAL_BUNDLED_DEBUG` para desativar o suporte nativo de desenvolvedor apenas no APK bundled de validacao.
- `app/_layout.tsx` tem fallback de `SplashScreen.hideAsync()` em 350 ms para evitar retencao da splash se o `onLayout` atrasar.
- APK instalado e validado no aparelho `192.168.0.4:5555`, modelo `23129RA5FL`, com SHA-256 `2bd9055863a51f46d4c41f24b768e22b25f43984990e0313f5fc4baa5d599c83`.
- O USB foi informado como conectado, mas `adb devices -l` mostrou apenas ADB Wi-Fi; manter esse detalhe em proximas validacoes para nao confundir transporte fisico com transporte ADB.
- Validacao independente final: Metro parado, `adb reverse --remove-all`, cold start `TotalTime: 5700`, PID `7357` ativo, sem `Unable to load script`, `Failed to connect`, `FATAL EXCEPTION`, `AndroidRuntime` ou `setValueWithKeyAsync` no log isolado do SinalSeguro.
- SOS de teste entrou em `CHAMADO ATIVO`, capturou localizacao pontual e nao reproduziu o erro antigo de `ExpoSecureStore`.
- Evidencias finais para README/docs:
  - `docs/assets/mobile/2026-05-03-android-home-bundled.png`;
  - `docs/assets/mobile/2026-05-03-android-configuracoes-bundled.png`;
  - `docs/assets/mobile/2026-05-03-android-cofre-bundled.png`;
  - `docs/assets/mobile/2026-05-03-android-sos-bundled-pos-localizacao.png`;
  - `docs/assets/mobile/2026-05-03-android-cofre-pos-sos-bundled.png`.
- Nao usar capturas intermediarias de splash, tela preta, AOD/MIUI ou Metro para material publico.
- Tarcila aprova a direcao visual atual para validacao de Roberto, mas qualquer nova arte/logo/background/icone continua dependendo da revisao dela.
- Schneier/Doneda mantem bloqueio de transmissao, streaming, P2P, backend real e compartilhamento externo fora de homologacao controlada.

## Memoria viva - 2026-05-03 - Build privado com midia local

- Roberto decidiu habilitar midia nesta etapa por ser recurso central do SOS.
- A habilitacao vale apenas para APK privado de homologacao local, nao para release publico.
- `app.json` foi mantido como padrao publico sem `CAMERA`/`RECORD_AUDIO`; o build privado ativa essas permissoes pelo Manifest nativo preparado.
- `SYSTEM_ALERT_WINDOW`, armazenamento externo legado e backup Android de evidencias seguem bloqueados.
- `scripts/android-private-media-readiness.mjs` foi criado para separar o gate privado de midia do gate publico de release.
- `scripts/prepare-android-bundled-debug.mjs` agora corrige o Manifest nativo para camera/microfone e `android:allowBackup="false"`.
- `EmergencyMediaRecorder` grava video/audio local com `expo-camera` ao acionar o SOS e preserva o arquivo mesmo quando o chamado e encerrado manualmente.
- `mediaCapture` copia o video para `sinalseguro-media/`, remove o temporario da camera e calcula hash SHA-256 do conteudo preservado.
- `EvidencePlayerCard` usa `expo-video` para reproduzir video local quando o pacote tem `media.status = recorded_local`.
- O tempo configuravel passou a ser tempo de gravacao local: `Ilimitado`, `1min`, `5min`, `15min`, `30min`, `60min`.
- O chamado de emergencia nao encerra automaticamente por tempo; encerra apenas por gesto manual da usuaria, com confirmacao e codigo local opcional.
- Tarcila/Norman apontaram risco de corte em Configuracoes; `ResourceTile` e o espacamento da tela foram compactados.
- Myers/Schneier apontaram risco de perda de video no encerramento, inconsistencia de permissoes e backup Android; os tres pontos foram corrigidos antes do build privado.
- Documentacao viva do recurso: `docs/26_BUILD_PRIVADO_MIDIA_LOCAL.md`.

Proximas acoes atualizadas:

1. Roberto validar no Android fisico o APK bundled instalado.
2. Se aprovado, gerar release interna 3 e atualizar GitHub Release/portal.
3. Implementar backend/OIDC/convites/alertas conforme `docs/api/openapi.yaml`.
4. Validar no Android fisico: SOS inicia gravacao, encerramento preserva video e Cofre/Player reproduz o arquivo local.
5. Preparar homologacao juridica completa para transmissao, anjos, backend, envelope de chaves, retencao e exportacao.

## Memoria viva - 2026-05-03 - APK privado instalado

- APK privado com midia local gerado por `npm run build:android:private`.
- Artefato: `android/app/build/outputs/apk/debug/app-debug.apk`, tamanho aproximado 103 MB.
- SHA-256: `056e41d7e1e91aef10c6763bb094bfe27973693c8c163b222c6f4be2952be67b`.
- Instalado com sucesso no Android `192.168.0.4:5555`, modelo `23129RA5FL`.
- Permissoes concedidas via ADB: camera, microfone, localizacao fina/aproximada e notificacoes.
- Cold start validado: `TotalTime: 4103`, PID `31065`, sem `FATAL`, `AndroidRuntime`, erro de bundle Metro ou `setValueWithKeyAsync` no log isolado.
- Captura aprovada para evidencia local: `docs/assets/mobile/2026-05-03-android-private-media-home.png`.
- A injecao de toque por ADB nao acionou os controles; a validacao funcional do gesto SOS com camera deve ser feita manualmente no aparelho fisico.

## Memoria viva - 2026-05-03 - Refinos midia/cofre/topo

- Roberto pediu ajuste rapido para remover as animacoes verdes do SOS ativo.
- Tarcila/Norman aprovaram substituir o feedback verde por luz/halo magenta dentro da identidade SinalSeguro.
- O topo do app agora usa `sinalseguro-symbol.png` como logomarca sem texto; o nome `SinalSeguro` e renderizado como texto responsivo da interface.
- Ada/Hedy corrigiram o fluxo de permissao: camera e microfone sao solicitados antes de depender do `CameraView.onCameraReady`, reduzindo risco de o primeiro SOS nao iniciar captura.
- O anel de progresso do SOS foi preso a circunferencia do botao, com SVG recortado pela propria area circular: horario para acionar e anti-horario para encerrar.
- `Video local` em Configuracoes preserva frontal/traseira/duas cameras; captura dupla e tentada no build privado e cai automaticamente para frontal/traseira quando a plataforma nao sustentar as duas ao mesmo tempo.
- O asset local registra `cameraMode` efetivo e `requestedCameraMode` original.
- Schneier/Myers reforcaram a gestao do Cofre: exclusao de chamado ativo agora e bloqueada no servico, e falha ao remover arquivo local mantem o pacote para retry.
- Player local sincroniza progresso com `expo-video` quando existe midia real.
- Gates executados nesta rodada: `typecheck`, `lint`, `test`.

## Memoria viva - 2026-05-03 - Anel SOS e cameras

- Roberto priorizou o anel na circunferencia do botao SOS e a configuracao frontal/traseira/duas cameras.
- Tarcila/Norman: anel agora fica em camada SVG recortada pela propria area circular do botao, discreto e responsivo.
- Ada/Hedy: `Duas cameras` tenta captura frontal+traseira; se a plataforma nao deixar as duas prontas, o recorder tenta fallback frontal e depois traseiro.
- Configuracoes mostra a camera selecionada diretamente no card `Midia`.
- APK privado reinstalado no Android `192.168.0.4:5555`; SHA-256 `2fbef1caee679d901b1e3f6dac2cf3966aa2621d4da8ef1f24d8631b71b99d46`.
- Cold start do app instalado: `TotalTime: 3442`; log filtrado sem fatal/RedBox/Exception.
- Browser simulator ativo em `http://localhost:8081/` para validacao comentada.

## Memoria viva - 2026-05-03 - Ajustes de validacao comentada

- Roberto anotou remocao do texto `Solte`, remocao das metricas do drawer inicial, player mais enxuto, menu do Cofre igual ao da Home, numeros 190/193/192 em destaque e `Duas cameras` como padrao.
- Tarcila/Norman: Home fica mais limpa; menus retrateis devem conter somente acoes iconograficas, sem status tecnico exposto.
- Ada/Hedy: `schemaVersion` das preferencias subiu para `6`; novas instalacoes e preferencias antigas migradas usam `localVideoCapture.cameraMode = both`.
- Background da Home removeu riscos/linhas e usa particulas/circulos discretos com marca d'agua.
- Modais de chamada usam `CallNumberHero` para destacar o numero oficial como informacao principal.
- Cofre reutiliza `EmergencySettingsDrawer`; dados de pacote ficam em modais/player/trilha.
- Player foi compactado: menos texto, video/seletor/controles/metadados essenciais.
- Myers/Schneier: antes de gravacoes longas reais, corrigir hash de video para rotina incremental/binaria e definir cota/retencao local.

## Memoria viva - 2026-05-03 - Anel de progresso mais visivel

- Roberto apontou que o anel de load do SOS estava quase invisivel.
- Tarcila/Norman mantiveram a decisao de nao criar um segundo aro externo: o anel continua preso a circunferencia do botao para preservar a forma e a responsividade.
- O contraste do trilho e do progresso foi aumentado com opacidade e espessura maiores, tanto no acionamento quanto no encerramento.
- Ada/Hedy ajustaram a migracao de preferencias: qualquer configuracao anterior ao `schemaVersion 6` volta para `Duas cameras`, evitando aparelhos antigos ficarem presos em frontal/traseira.
- Myers reinstalou o APK privado no Android `192.168.0.4:5555`, SHA-256 `f5a407ca1937f589f8d1c1f4dc1d2f251e8cf1f7031e59ef76f3ac3373724f15`, cold start `TotalTime: 4487` e logcat filtrado por PID sem falhas criticas.
- Evidencias visuais salvas em `docs/assets/mobile/2026-05-03-android-ring-visivel-home.png` e `docs/assets/mobile/2026-05-03-android-ring-visivel-hold.png`; log filtrado em `docs/evidencias/android/2026-05-03-ring-player-private/logcat-launch-app.txt`.

## Memoria viva - 2026-05-04 - Drawer Cofre/Player e Configuracoes limpa

- Roberto pediu continuidade nos comentarios do browser: SOS com efeito de bolha, Configuracoes sem fundo/status tecnico, drawer com `Cofre` e `Player`, Cofre em grade e fechamento ao tocar fora.
- Tarcila/Norman mantiveram a Home limpa e aprovaram a direcao do SOS como bolha 3D discreta, com anel mais visivel dentro da circunferencia.
- Ada/Hedy separaram a navegacao do drawer por painel: `Cofre` abre a trilha de arquivos e `Player` abre a revisao segura.
- `BrandedDialog` fecha ao tocar fora, preservando acoes destrutivas protegidas por confirmacao propria.
- `LocalEvidenceRail` agora apresenta os pacotes como grade vertical com acoes iconograficas em linhas/colunas.
- Configuracoes removeu o banner `Preferencias carregadas`; a tela principal fica somente com recursos em icones.
- Microajuste final do anel SOS: trilho e progresso ficaram um pouco mais espessos/opacos, ainda recortados dentro da circunferencia do botao.
- Evidencias browser salvas: `2026-05-04-home-sos-bolha.png`, `2026-05-04-home-menu-cofre-player.png`, `2026-05-04-configuracoes-sem-banner.png`, `2026-05-04-cofre-modal-grid.png`.
- Documento de continuidade: `docs/27_REFINO_DRAWER_COFRE_PLAYER_CONFIG.md`.

## Memoria viva - 2026-05-05 - Pausa solicitada para liberar disco

- Roberto pediu para salvar e pausar tudo antes de continuar, para liberar espaco no disco.
- Zé registrou regra operacional: antes de pausas, interrupções, builds longos ou risco de limite de uso, criar checkpoint mínimo em memória, documentação e Git.
- Não executar build Android, instalação no aparelho, limpeza de artefatos ou validação pesada durante esta pausa.
- Estado de trabalho deve ser preservado como checkpoint de continuidade, mesmo com ajustes ainda pendentes.
- Na retomada, começar por `git status --short`, ler `.codex/AGENTS.md`, esta memória, `TECNICA_MOBILE.md`, `SEGURANCA_QA.md`, `TARCILA.md` e `docs/03_TIMELINE.md`.
- Pendências conhecidas para a retomada: refinamento de modais com linguagem de produto, player/cofre com menos texto, código de segurança simplificado, hash de vídeo grande sem leitura integral em Base64, validação visual no browser e APK privado via script.

## Memoria viva - 2026-05-05 - Retomada final do APK privado

- Retomada iniciada por Zé/Cristine com `git status --short`, preservando os ajustes ja implementados e evitando retrabalho.
- Tarcila/Norman: SOS mantem identidade visual SinalSeguro, sem animação verde, com botão em bolha 3D, partículas discretas e anel circular interno na circunferencia do botão.
- Ada/Hedy: gravação local privada permanece habilitada para build privado; `Duas cameras` continua como padrão de homologação, com fallback de plataforma quando captura simultânea não for sustentada.
- Cofre/Player: lista de arquivos segue em grade vertical, com título/data do pacote, player local, ação de mapa e ação de compartilhar pelo app quando autorizada no produto.
- Configurações: recursos ficam em grade iconográfica; modais usam linguagem de produto e ajuda contextual `(?)`, sem justificar detalhes técnicos na camada principal.
- Código de segurança: permanece local, opcional e sem código padrão; quando habilitado, protege encerramento do SOS e áreas privadas como Cofre, Anjos, Player e Configurações.
- Linguagem pendente removida da UI principal: ações de compartilhamento passaram de `Envio futuro` para `Compartilhar pelo app`.
- Protocolo permanente para interrupções: antes de limite de uso, pausa, travamento, build longo ou limpeza de disco, registrar memória, documentação e Git para permitir retomada sem redundância.
- Próximo passo operacional desta retomada: rodar gates, validar browser, gerar APK privado com script, instalar no Android USB e publicar checkpoint.

## Solucao anti-redundancia - 2026-05-05

- Criado `docs/28_RETOMADA_SEM_REDUNDANCIA.md` como documento unico de retomada do ciclo atual.
- Na proxima interrupcao, Cristine deve iniciar por esse documento e por `git status --short --branch`, evitando reabrir toda a memoria historica.
- A fila de execucao ficou travada: fechar pendencias UX/IX comentadas, rodar gates leves, validar browser, gerar APK privado, instalar somente com ADB visivel e confirmacao no momento, atualizar memoria/docs e publicar Git.
- O criterio de passagem para a proxima etapa ficou objetivo: gates aprovados, browser validado, APK privado gerado, Android fisico validado ou bloqueio ADB documentado, commit e push.
- Acesso a Google/iCloud/contas logadas ficou marcado como etapa propria OIDC/backend, sem tocar credenciais ou configuracoes de conta sem confirmacao de acao.

## Memoria viva - 2026-05-05 - Ajustes finais no browser

- Roberto marcou no browser que a Home deve trazer `Policia`, `Bombeiros` e `SAMU` ativos por padrao, sem `190` no rotulo visual do botao `Policia`; `Anjo` fica como atalho futuro, desativado ate gestao propria.
- Tarcila/Norman revisaram a bolha SOS: foi removida a dupla transparencia superior; agora ha uma unica camada SVG com degradê que some em direcao ao centro.
- O texto `ATIVO` foi elevado acima das particulas e deve usar somente sombra verde no proprio texto, sem faixa/charuto atras, mantendo a massa principal magenta/rosa da identidade SinalSeguro.
- Myers/Schneier bloquearam o atalho de Anjo e `Anjo acionar 190` enquanto nao houver anjo aceito, conta propria, termos, contrato e auditoria.
- Cofre/Player agora mostram duracao/tempo de gravacao na grade e nos detalhes do player.
- Mapa agora oferece `Maps` da plataforma e `Google Maps`, valida disponibilidade no nativo e avisa que o app externo recebera a localizacao exata do registro.
- Gates locais desta rodada: `typecheck`, `lint`, `test`, `private:android:readiness` e `git diff --check` aprovados.
- Browser local aberto em `http://localhost:8081/` e Home validada com `Policia`, `Bombeiros` e `SAMU`, sem `Policia 190`.
- APK privado regerado por `npm run build:android:private`: `android/app/build/outputs/apk/debug/app-debug.apk`, `119M`, SHA-256 `daf5a22d163acc468a9470e1bd2178606f1b547c55bdf824a22eefe5d3f022d1`.
- APK instalado por USB no Android `23129RA5FL` com `adb install -r`: `Success`.
- Evidencias Android finais: `docs/evidencias/android/2026-05-05-apk-privado-final/home-apk-final-after-wake.png` e `docs/evidencias/android/2026-05-05-apk-privado-final/estado-final-aparelho.png`.
- Proxima fase do plano global: `API e Anjos`, documentada em `docs/29_PROXIMA_ETAPA_API_ANJOS.md`.

## Memoria viva - 2026-05-05 - Plano OIDC, videochamada e localizacao ao vivo

- Roberto pediu continuidade com EC2 como servidor de login, CRM/Gestao e compartilhamento de chaves para anjos.
- Cristine deve tratar a etapa como fases retomaveis, sem reabrir toda a memoria historica.
- Documento de continuidade criado: `docs/32_PLANO_LOGIN_VIDEOCHAMADA_ANJOS_LOCALIZACAO.md`.
- A primeira execucao e configurar Google Auth Platform do projeto `sinalseguro`, criar OAuth client Android para `br.com.sinalseguro.app` e configurar o client ID real somente em ambiente seguro local/build e em `/etc/sinalseguro-api.env`.
- Nao imprimir nem versionar client IDs reais, client secrets, tokens, senhas ou chaves privadas.
- Video/audio ao vivo para anjo autorizado deve usar WebRTC P2P; API fica como coordenador de identidade, convites, envelopes de chave, sinalizacao e auditoria.
- Localizacao em tempo real so pode trafegar durante emergencia ativa, para anjo aceito, em canal criptografado, sem coordenada em log.
- CRM/Gestao deve nascer com usuarios, dispositivos, anjos, convites, consentimentos, auditoria, politicas/termos e hub de login.
- Menores e conveniados continuam bloqueados para uso real ate politica ECA Digital/LGPD, contrato, RBAC, MFA, retencao e RIPD/DPIA.
- Lacunas dos especialistas incorporadas ao plano: OpenAPI unico, modelo de chaves, envelopes, WebRTC/STUN/TURN, outbox remota, RBAC, retencao, testes fim a fim e threat model.
- Prioridade pratica da proxima fase: fechar `OIDC + devices + chaves publicas + anjos + envelopes + emergency_sessions` antes de midia real, localizacao continua ou P2P critico.
