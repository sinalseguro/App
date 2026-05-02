# 10 - Distribuicao e Instalaveis

Responsavel operacional: Kim  
Gerencia mobile: Cristine  
Aprovacao visual: Tarcila  
Revisao de seguranca: Schneier  
Revisao juridica/LGPD: Doneda

## Canais publicos

| Plataforma | URL publica | QR code | Status |
|---|---|---|---|
| Android | `https://www.sinalseguro.com.br/baixar/android` | `assets/qr/sinalseguro-android.svg` | Pendente de APK assinado |
| iOS | `https://www.sinalseguro.com.br/baixar/ios` | `assets/qr/sinalseguro-ios.svg` | Pendente de TestFlight/App Store |

## GitHub

O repositorio publico do app e `https://github.com/sinalseguro/App`.

Quando houver permissao de escrita e build assinado, os artefatos devem ser publicados em GitHub Releases:

- `sinalseguro-android.apk`: instalador interno Android para homologacao controlada;
- `sinalseguro-android.aab`: pacote para Google Play, quando existir conta e trilha interna;
- `checksums.txt`: hashes SHA-256 dos artefatos;
- `release-notes.md`: notas de release sem dados sensiveis.

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

## Portal

Os portais publicam paginas estaveis:

- `/baixar`: central de instalacao;
- `/baixar/android`: status e link Android;
- `/baixar/ios`: status e link iOS.

Essas paginas devem continuar publicas mesmo antes dos instaladores finais para que os QR codes nao mudem.

## Bloqueios atuais

- O push para `sinalseguro/App` foi resolvido com a chave SSH dedicada e alias `github-sinalseguro-admin`.
- EAS CLI nao esta instalado globalmente.
- O Android SDK local nao possui plataformas instaladas em `~/Library/Android/sdk/platforms`, entao build local depende de `android-36`; EAS remoto continua sendo o caminho preferencial.
- Build Android assinado depende de perfil/chave fora do Git.
- O primeiro APK deve ser tratado como app shell/alerta simulado, sem coleta real, midia, localizacao real enviada ou promessa publica.
- Distribuicao iOS depende de conta Apple, certificados, provisioning profile e TestFlight/App Store.
- Xcode esta disponivel, mas o app ainda nao possui projeto iOS prebuild nem credenciais Apple versionaveis.

## Criterios de liberacao

- `npm run typecheck`, `npm run lint` e `npm test` aprovados.
- Auditoria sem vulnerabilidade alta/critica conhecida sem tratamento.
- Sem dados sensiveis em logs, URL, push, QR, release notes ou assets.
- APK/AAB/IPA com hash SHA-256 publicado.
- Release revisada por Cristine, Myers, Schneier, Doneda e Tarcila quando houver asset visual.
