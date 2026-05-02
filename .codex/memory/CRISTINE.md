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

Proximas acoes:

1. Rodar validacoes finais e publicar checkpoint Git com hardening + relatorio Android.
2. Gerar novo APK assinado interno incorporando o plugin de hardening e publicar como release interna 3, se Roberto aprovar.
3. Preparar TestFlight/App Store para iOS.
4. Conectar mock de API ao contrato OpenAPI.
5. Implementar adaptador de envio real apenas depois de auth, consentimento, retencao e revisao Schneier/Doneda.
6. Evoluir Fase 1 com componentes compartilhados revisados por Norman/Tarcila.
7. Manter `origin` usando `github-sinalseguro-admin` para pushes do repo App.
