# 13 - Etapa 1: Android Instalavel

Data de inicio: 2026-05-02
Supervisao: Ze
Gerencia mobile: Cristine
Responsavel operacional: Kim
Especialistas acionados: Ada, Margaret, Myers, Schneier, Doneda, Tarcila, Knuth e ESCRIBA/Freire

## Objetivo

Fechar o primeiro ciclo real de distribuicao Android:

1. preparar ambiente e assinatura sem segredos no Git;
2. gerar APK interno assinado;
3. calcular hash SHA-256;
4. publicar em GitHub Releases do `sinalseguro/App`;
5. validar instalacao por QR code no portal;
6. registrar evidencias saneadas e memoria de continuidade.

## Escopo desta etapa

Entra:

- Android interno para homologacao controlada;
- app shell com alerta simulado, sem envio real;
- release notes saneadas;
- checksum SHA-256;
- pagina `/baixar/android` como canal publico estavel;
- testes de instalacao e abertura do app;
- documentacao de continuidade.

Nao entra:

- Play Store publica;
- dados reais de vitimas, anjos, alertas ou localizacao;
- midia real;
- permissao de camera ou microfone;
- outbox prometida como resiliente antes da persistencia criptografada;
- TestFlight/iOS;
- acionamento oficial de orgaos publicos;
- qualquer chave, senha, keystore ou credencial versionada.

## Responsaveis

| Frente | Agente | Entrega |
|---|---|---|
| Coordenacao | Cristine | Status, timeline, handoff, memoria |
| Build e release | Kim | APK assinado, GitHub Release, hashes |
| Expo/Android | Ada/Margaret | Compatibilidade SDK, config Android, build |
| Segurança | Schneier | Segredos fora do Git, permissoes, logs |
| LGPD | Doneda | Limites de homologacao e ausencia de dados reais |
| QA | Myers | Instalação, abertura, rotas, regressao minima |
| Visual | Tarcila | Nome/logo/QR/release visual |
| Documentacao | Knuth/ESCRIBA | Runbook e evidencias saneadas |

## Plano de execucao

### 1. Prontidao

- Instalar Node 22.13+.
- Instalar dependencias com `npm ci --ignore-scripts`.
- Rodar `npm run release:android:readiness`.
- Resolver bloqueios de Git, EAS e escopo.
- Resolver Android SDK/Java somente se a equipe escolher build local.
- Rodar `npm run doctor` quando EAS/Expo estiver autenticado.

Estado tecnico exigido:

- `preview.android.buildType = apk`;
- `production.android.buildType = app-bundle`;
- `expo-build-properties` define Android `minSdkVersion 24`, `targetSdkVersion 36` e iOS `deploymentTarget 15.1`;
- Nova Arquitetura React Native fica ativa porque o Expo Router/Reanimated exige esse modo no SDK atual;
- build local pode limitar ABIs a `armeabi-v7a,arm64-v8a` para reduzir uso de disco e focar celulares reais;
- `android.permissions` sem `CAMERA` e `RECORD_AUDIO`;
- `android.blockedPermissions` remove camera, microfone, overlay e armazenamento legado do primeiro APK;
- nenhum `console.log` em fluxo de alerta;
- nenhum `.env`, keystore, certificado ou instalador real versionado.

Estado de execucao em 2026-05-02:

- Android SDK local preparado com plataforma `android-36`;
- keystore de upload criada fora do repositorio, com senhas no Keychain;
- APK release assinado gerado localmente;
- APK final local: `distribution/android/out/sinalseguro-android.apk` (ignorado pelo Git);
- SHA-256: `a920c116adff07f9121281c1cd3d086daeee969dd014741658d24dd128c280f5`;
- release notes e checksum saneados versionados em `distribution/android/`;
- GitHub Release publicada em `https://github.com/sinalseguro/App/releases/tag/android-v0.1.0-internal.1`.

### 2. Assinatura

- Criar ou localizar keystore em cofre local fora do Git.
- Declarar apenas variaveis de ambiente locais:
  - `SINAL_APP_ANDROID_KEYSTORE_PATH`;
  - `SINAL_APP_ANDROID_KEY_ALIAS`;
  - senha da keystore em cofre/variavel local nao versionada.
- Nunca salvar senha em README, docs, scripts, `.env` versionado ou historico Git.

### 3. Build

Preferencia operacional:

- usar EAS Build se login/credenciais EAS estiverem prontos;
- usar build local apenas se Android SDK, Gradle, Java e assinatura estiverem completos.
- usar `preview` para APK interno;
- usar `production` apenas para AAB de Google Play quando houver conta, trilha e aprovacao.

Comandos de validacao antes do build:

```bash
npm run assets:qr
npm run release:android:readiness
npm run typecheck
npm run lint
npm test
npm audit --omit=dev --audit-level=high
```

Comando de build interno:

```bash
npm run build:android:preview
```

### 4. Publicacao

- Renomear o APK final aprovado para `sinalseguro-android.apk`.
- Gerar `checksums.txt` com SHA-256.
- Criar GitHub Release `android-v0.1.0-internal.1`.
- Anexar APK, checksums e release notes.
- Validar download pelo portal e QR.
- Se o repositorio GitHub for publico, tratar o link como publico; nao chamar de restrito sem controle real de acesso.

### 5. Evidencia e memoria

- Registrar hash, URL da release e status em `docs/03_TIMELINE.md`.
- Atualizar `distribution/installers.json` se o link mudar.
- Atualizar portal somente depois de release real publicada.
- Registrar relatorio de QA em documento saneado, sem dados reais.

## Criterios de pronto

- `npm run release:android:readiness` sem bloqueios.
- Pendencias condicionais documentadas, como SDK local ou assinatura externa.
- APK assinado e instalavel.
- SHA-256 publicado.
- GitHub Release acessivel.
- Portal `/baixar/android` aponta para destino correto.
- Android nao solicita camera/microfone nesta etapa.
- Release notes informam "alerta simulado" e "nao substitui 190/180".
- Myers validou instalacao e abertura.
- Schneier validou ausencia de segredos no Git e nos artefatos publicos.
- Doneda validou que o release e interno/homologacao e sem dados reais.
- Cristine atualizou timeline e memoria.

## Bloqueios atuais conhecidos

- EAS remoto segue nao autenticado; o build atual foi local.
- O artefato `distribution/android/out/sinalseguro-android.apk` nao e versionado e deve ser anexado a GitHub Releases.
- Node shell deve permanecer em `22.13+` para validacoes e builds.
- Outbox atual ainda nao deve ser vendida como garantia offline ate persistencia criptografada.
- Producao publica segue bloqueada ate QA, privacidade, backend homologado e trilha de loja.

## Parecer consolidado dos especialistas

- Kim: GitHub Releases e o canal operacional para o APK interno; publicar somente com hash e release notes saneadas.
- Ada/Margaret: Expo managed continua adequado; `preview` precisa gerar APK e `production` deve ficar reservado a AAB.
- Schneier/Doneda/Myers: liberar apenas shell tecnico com alerta simulado; bloquear midia, dado real, camera, microfone, overlay, armazenamento legado e qualquer promessa de emergencia oficial.

## Continuidade

Se a execucao for interrompida, retomar nesta ordem:

1. ler `.codex/memory/CRISTINE.md`;
2. ler este documento;
3. rodar `npm run release:android:readiness`;
4. resolver o primeiro bloqueio listado;
5. atualizar `docs/03_TIMELINE.md` antes de commitar.
