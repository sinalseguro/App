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
- GitHub Release Android interno 2 sera publicada em `https://github.com/sinalseguro/App/releases/tag/android-v0.1.0-internal.2`;
- APK interno 2 foi instalado e aberto em Android fisico via ADB Wi-Fi, com `versionCode=2`;
- portal e manifestos apontam ao APK/checksum para homologacao controlada;
- alerta permanece simulado ate outbox criptografada, API e revisoes de seguranca/QA.

Proximas acoes:

1. Publicar `android-v0.1.0-internal.2` em GitHub Releases.
2. Atualizar portal para o APK interno 2 e executar deploy.
3. Commitar e publicar os repos App, portais e empresa.
4. Preparar TestFlight/App Store para iOS.
5. Conectar mock de API ao contrato OpenAPI.
6. Evoluir Fase 1 com componentes compartilhados revisados por Norman/Tarcila.
7. Manter `origin` usando `github-sinalseguro-admin` para pushes do repo App.
