# 10 - Distribuicao e Instalaveis

Responsavel operacional: Kim  
Gerencia mobile: Cristine  
Aprovacao visual: Tarcila  
Revisao de seguranca: Schneier  
Revisao juridica/LGPD: Doneda

## Estado real em 2026-05-07

- Release publico tecnico Android atual permanece `android-v0.1.0-internal.2`, SHA-256 `dbad294407038cac954fd3154bac6c4ea9dbb30b4e79164f58807e83f0d358cb`.
- APK privado local mais recente apos correcao de redirect OAuth Android: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `e975046c54c756af14feba64fe40b83877252bb96bca0d97f2d334624218801b`.
- O APK privado local mais recente nao foi publicado em GitHub Releases e nao deve ser divulgado como artefato publico.
- API publica validada com `health=ok` e readiness `database=ok`.
- Bloqueio Android historico de `Custom URI scheme` foi superado pelo fluxo Google Sign-In nativo; auth privado ja foi validado fisicamente.
- iOS segue pendente de TestFlight/App Store e Apple Developer Program/capability para distribuicao publica; a validacao fisica privada de login ja foi concluida.
- Gates locais desta atualizacao documental: `npm run typecheck`, `npm run lint` e `npm test` aprovados.

## Atualizacao real em 2026-05-14

- APK privado Android novo gerado em `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `8cab34dc0838637f7713999b56c8ba28d36fb071f02735a7836beb5cfbb91cc1`.
- O app passou a consultar `GET /api/app-releases/current` com JWT da conta SinalSeguro e usa a pagina estavel `https://www.sinalseguro.com.br/baixar/android` como ponto publico de download.
- O nome público continua fixo em `sinalseguro_android.apk`.
- O link direto pode incluir `?v=0.1.1-20260514` para forcar atualização de cache mantendo o mesmo arquivo e o mesmo QR do portal.
- A versão publicada foi sincronizada para `0.1.1` com `versionCode 3`.
- A instalacao via USB/ADB desta versao final foi aprovada manualmente no Android.
- O botao `Baixar versao Android` abre a pagina publica estavel pelo codigo validado; a confirmacao visual no aparelho foi aprovada manualmente.
- Retomada fisica em 2026-05-14 confirmou no Android `23129RA5FL` o pacote instalado `versionName=0.1.1`, `versionCode=3`, a API publica com `health=ok` e readiness `database=ok`, o gate de login bloqueando deep link direto sem sessao visivel, login Google concluido e o fluxo `Anjos de confianca` em modo API sem crash no logcat saneado.
- iPhone/iOS permanece pos-MVP e nao faz parte deste fluxo.

## Atualizacao real em 2026-05-16 - Android 0.1.5

- APK privado Android `0.1.5` gerado em `android/app/build/outputs/apk/debug/app-debug.apk`, `versionCode 7`, SHA-256 `4518789cbcc844f5f8ff87dcd13009f00f7ffbc252d5cea01e2ec50855b239a2`.
- O link direto publicado usa `?v=0.1.5-20260516` para atualizar cache mantendo o arquivo e QR estaveis.
- A versao bloqueia criacao e aceite de convite que nao esteja validado no backend.
- Validacao fisica nos dois Androids conectados confirmou `0.1.5` instalado e link invalido exibindo `Convite indisponivel`, `Aceite bloqueado` e botao `Aceitar como anjo` desativado.
- Roberto validou os testes fisicos manuais em 2026-05-16, aprovando a continuidade apos o fluxo de convite/aceite.
- API e portal publicados: release EC2 `/var/www/sinalseguro/releases/20260516T034600Z`, manifesto `0.1.5`, APK baixado com SHA-256 correto e health/ready aprovados.

## Atualizacao real em 2026-05-16 - Android 0.1.4

- APK privado Android `0.1.4` gerado em `android/app/build/outputs/apk/debug/app-debug.apk`, `versionCode 6`, SHA-256 `93b06f022aac21ddf296eeaa34fc126ed353341c0cda7ebee311203d7ed05139`.
- O link direto publicado usa `?v=0.1.4-20260516` para atualizar cache mantendo o arquivo e QR estaveis.
- A versao melhora a sincronizacao de anjos aceitos, deixa o originador ver `Meus anjos` e mantem o recebedor em `Sou anjo de`.

## Atualizacao real em 2026-05-15

- APK privado Android `0.1.3` gerado em `android/app/build/outputs/apk/debug/app-debug.apk`, `versionCode 5`, SHA-256 `36f8518b72ff5711ff65893b675db5b47d36ef185aa34bf790a7356e6c3f2ae2`.
- O link direto publicado usa `?v=0.1.3-20260515` para atualizar cache mantendo o arquivo e QR estaveis.
- A verificacao de update passa a consultar `GET /api/app-releases/current` sem exigir login, mantendo download apenas no portal oficial.
- O modal de update aparece no layout raiz quando ha versao nova; a validacao de login fica no ciclo de carregamento e nao pisca o gate completo quando a sessao local ja existe.
- A tela `Anjos de confianca` sincroniza ao voltar ao foco para mostrar aceite recente no aparelho que enviou o convite.
- APK privado Android `0.1.2` gerado em `android/app/build/outputs/apk/debug/app-debug.apk`, `versionCode 4`, SHA-256 `1ee74e9dd3675a150f3a1264abf99437c494f268d0f63cde9a9bd6b1fb182539`.
- O link direto publicado usa `?v=0.1.2-20260515` para atualizar cache mantendo o arquivo e QR estaveis.
- A validacao automatizada no Android fisico ficou bloqueada por travamento do transporte ADB em transferencias grandes; o aparelho ainda estava em `0.1.1`/`versionCode 3`.
- Checkpoint anterior `0.1.1` publicou SHA-256 `dbfe42edce5f8ad9197aa105ea45bd9113b74bfb6f2f5e2a14dd9586946f8fff`.
- Portal publico preserva o mesmo arquivo fixo `sinalseguro_android.apk`; novas atualizacoes mudam versao, data e checksum sem trocar QR.
- API de producao deve apontar para a maior `versionCode` disponivel para que o app identifique a atualizacao.
- Fluxo de convite atualizado para `https://www.sinalseguro.com.br/convite#convite=<codigo>`, com pagina publica dedicada, status publico via POST e App Links Android.
- O app armazena convite pendente cifrado durante login, aceite legal e permissoes, limpando o dado local depois do aceite.
- Validacoes automatizadas aprovadas: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build:android:private`, `py_compile` dos arquivos Django alterados, `manage.py check`, `migrate`, `collectstatic`, `npm run validate` dos portais via build em `/tmp`, `git diff --check` dos repos envolvidos antes da documentacao final.
- Validacoes de producao aprovadas: `/convite` HTTP 200, `/convite/<codigo>` HTTP 302 para fragmento, `installers.json`, `checksums.txt`, `assetlinks.json`, APK HTTP 200 com `content-length=267167830`, API publica de status de convite com resposta minima e `cereusia.conf` preservado.
- Validacao fisica desta retomada ficou bloqueada: o Android nao apareceu em `adb devices -l`; a descoberta Wi-Fi anunciou `192.168.0.5:37391`, mas a conexao foi recusada. O teste em aparelho deve ser retomado quando ADB voltar como `device`.

Atualizacao privada iOS em 2026-05-07:

- OAuth iOS privado foi configurado fora do Git para `br.com.sinalseguro.app`; Client ID e URL scheme reais permanecem somente em ambiente seguro local/EC2.
- Build iOS `Release` local para iPhone fisico foi aprovada com Xcode e instalada via `ios-deploy`.
- O `.app` compilado contem a URL scheme Google esperada, mas o valor nao deve ser impresso, registrado ou documentado.
- TestFlight/App Store continuam pendentes; este build instalado e apenas artefato privado de homologacao fisica.
- Login iOS foi validado fisicamente; novas instalacoes/testes manuais exigem iPhone desbloqueado para abertura do app e interacao com Google Sign-In.

Workflow local obrigatorio por pouco espaco:

- Antes de alternar de Android para iOS, parar Gradle quando aplicavel e limpar somente regeneraveis Android: `android/app/build`, `android/build`, `android/.gradle` e temporarios `sinalseguro-android-*`.
- Antes de alternar de iOS para Android, limpar somente regeneraveis iOS: `ios/build`, DerivedData temporario `sinalseguro-ios-deriveddata` e logs temporarios `sinalseguro-ios-*.log`.
- Preservar fonte, locks, `ios/Pods` quando a proxima compilacao iOS ainda for necessaria, `.env.local`, xcconfig temporario ativo e arquivos de configuracao versionados.
- Nunca limpar ou recriar segredos por comando que imprima valores no terminal.
- Scripts versionados globais ficam em `scripts/` na raiz: `prepare-platform-build.mjs` e `patch-ios-pods-path-spaces.mjs`. O app tambem tem `scripts/prepare-ios-secure-build-config.mjs` para gerar xcconfig iOS temporario sem imprimir valores reais. Atalhos no app: `npm run prepare:build:ios`, `npm run prepare:build:android`, `npm run prepare:build:ios:secure-config` e `npm run patch:ios:path-spaces`.

## Canais publicos

| Plataforma | URL publica | QR code | Status |
|---|---|---|---|
| Android | `https://www.sinalseguro.com.br/baixar/android` | `assets/qr/sinalseguro-android.svg` | APK publicado e validado manualmente |
| iOS | `https://www.sinalseguro.com.br/baixar/ios` | `assets/qr/sinalseguro-ios.svg` | Pendente de TestFlight/App Store |

## GitHub

O repositorio publico do app e `https://github.com/sinalseguro/App`.

Quando houver permissao de escrita e build assinado, os artefatos devem ser publicados em GitHub Releases:

- `sinalseguro-android.apk`: instalador interno Android para homologacao controlada;
- `sinalseguro-android.aab`: pacote para Google Play, quando existir conta e trilha interna;
- `checksums.txt`: hashes SHA-256 dos artefatos;
- `release-notes.md`: notas de release sem dados sensiveis.

Artefato Android atual publicado no portal:

- arquivo: `sinalseguro_android.apk`;
- URL: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk?v=0.1.2-20260515`;
- SHA-256: `1ee74e9dd3675a150f3a1264abf99437c494f268d0f63cde9a9bd6b1fb182539`;
- notas versionadas: manter alinhado com o checkpoint atual do portal;
- checksum versionado: `public/downloads/private/checksums.txt`.

Historico:

- `android-v0.1.0-internal.1`: primeiro APK assinado do app shell, SHA-256 `a920c116adff07f9121281c1cd3d086daeee969dd014741658d24dd128c280f5`.
- `android-v0.1.0-internal.2`: validacao visual Tarcila com icone, splash, lockup e contraste do botao de panico simulado.

## Perfis EAS

| Perfil | Uso | Artefato |
|---|---|---|
| `preview` | homologacao interna Android | APK assinado por EAS ou credencial controlada |
| `production` | trilha Google Play futura | AAB, somente quando loja/termos/QA estiverem prontos |

Comandos:

```bash
npm run release:android:readiness
npm run build:android:preview
npm run build:android:production
```

O documento operacional da Etapa 1 e `docs/13_ETAPA_1_ANDROID_INSTALAVEL.md`.

No primeiro app shell, a Nova Arquitetura React Native fica ativa porque Expo Router/Reanimated exige esse modo no SDK atual. Para build local em Mac com pouco espaco, o APK pode ser limitado a `armeabi-v7a,arm64-v8a`; EAS remoto continua preferencial para builds completos.

## Portal

Os portais publicam paginas estaveis:

- `/baixar`: central de instalacao;
- `/baixar/android`: status e link Android;
- `/baixar/ios`: status e link iOS.

Essas paginas devem continuar publicas mesmo antes dos instaladores finais para que os QR codes nao mudem.

## Bloqueios atuais

- O push para `sinalseguro/App` foi resolvido com a chave SSH dedicada e alias `github-sinalseguro-admin`.
- O Android SDK local possui `android-36` e permitiu build assinado local.
- A chave de assinatura Android fica fora do Git, em caminho local protegido, com senhas no Keychain.
- GitHub Release Android interno 2 publicada e validada por instalacao/checksum.
- O primeiro APK deve ser tratado como app shell/alerta simulado, sem coleta real, midia, localizacao real enviada ou promessa publica.
- Distribuicao iOS depende de conta Apple, certificados, provisioning profile e TestFlight/App Store.
- Xcode esta disponivel, mas o app ainda nao possui projeto iOS prebuild nem credenciais Apple versionaveis.

## Criterios de liberacao

- `npm run typecheck`, `npm run lint` e `npm test` aprovados.
- Auditoria sem vulnerabilidade alta/critica conhecida sem tratamento.
- Sem dados sensiveis em logs, URL, push, QR, release notes ou assets.
- APK/AAB/IPA com hash SHA-256 publicado.
- Release revisada por Cristine, Myers, Schneier, Doneda e Tarcila quando houver asset visual.
