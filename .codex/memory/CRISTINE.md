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

## Proximo checkpoint

Etapa ativa: 1 - Android instalavel.

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
- microcopy do SOS foi reduzido para `Solte` e recebeu largura fixa para evitar truncamento visual em Android;
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
- drawer da engrenagem concentra `Modo atual`, `Cofre e player`, `Anjos`, `Convites`, `Configuracoes` e status de atividade;
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
