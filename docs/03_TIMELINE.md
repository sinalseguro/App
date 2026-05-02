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

Status: plano e prontidao versionados; build assinado ainda pendente.

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

Bloqueios atuais:

- ambiente local deve usar Node 22.13+;
- Android SDK `android-36` e Java 17 sao obrigatorios apenas para build local;
- EAS remoto autenticado e o caminho preferencial;
- keystore/credencial Android precisa ficar fora do Git;
- nenhum APK deve ser publicado sem SHA-256, release notes saneadas e revisoes Myers/Schneier/Doneda/Cristine.

Validacoes executadas:

- `npm run doctor`: aprovado, 17/17 checks;
- `npm run release:android:readiness`: aprovado como pronto condicionado, com pendencias de SDK local e assinatura;
- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run assets:qr`: aprovado;
- `npm audit --omit=dev --audit-level=high`: sem vulnerabilidades altas/criticas; permanecem moderadas transitivas da cadeia Expo.

## Modelo de registro

| Data | Evento | Responsavel | Impacto | Proximo passo |
|---|---|---|---|---|
|  |  |  |  |  |
