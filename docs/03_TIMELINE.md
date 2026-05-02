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

## Modelo de registro

| Data | Evento | Responsavel | Impacto | Proximo passo |
|---|---|---|---|---|
|  |  |  |  |  |
