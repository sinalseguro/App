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

Proximas acoes:

1. Rodar validacoes e revalidar Android fisico com novo layout central, splash custom e cofre.
2. Gerar novo APK assinado interno incorporando hardening, duracao, finalizacao, splash custom, cofre e botao central, publicando como release interna 3 se Roberto aprovar.
3. Atualizar portal/manifestos para release interna 3 apos APK assinado.
4. Revalidar Android fisico sem Metro usando APK assinado.
5. Preparar TestFlight/App Store para iOS.
6. Conectar mock de API ao contrato OpenAPI.
7. Implementar adaptador de envio real apenas depois de auth, consentimento, retencao e revisao Schneier/Doneda.
8. Evoluir Fase 1 com componentes compartilhados revisados por Norman/Tarcila.
9. Manter `origin` usando `github-sinalseguro-admin` para pushes do repo App.
