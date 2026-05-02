# 10 - Distribuicao e Instalaveis

Responsavel operacional: Kim  
Gerencia mobile: Cristine  
Aprovacao visual: Tarcila  
Revisao de seguranca: Schneier  
Revisao juridica/LGPD: Doneda

## Canais publicos

| Plataforma | URL publica | QR code | Status |
|---|---|---|---|
| Android | `https://www.sinalseguro.com.br/baixar/android` | `assets/qr/sinalseguro-android.svg` | APK publicado para homologacao controlada |
| iOS | `https://www.sinalseguro.com.br/baixar/ios` | `assets/qr/sinalseguro-ios.svg` | Pendente de TestFlight/App Store |

## GitHub

O repositorio publico do app e `https://github.com/sinalseguro/App`.

Quando houver permissao de escrita e build assinado, os artefatos devem ser publicados em GitHub Releases:

- `sinalseguro-android.apk`: instalador interno Android para homologacao controlada;
- `sinalseguro-android.aab`: pacote para Google Play, quando existir conta e trilha interna;
- `checksums.txt`: hashes SHA-256 dos artefatos;
- `release-notes.md`: notas de release sem dados sensiveis.

Artefato Android atual:

- tag publicada: `android-v0.1.0-internal.2`;
- GitHub Release: `https://github.com/sinalseguro/App/releases/tag/android-v0.1.0-internal.2`;
- arquivo: `sinalseguro-android.apk`;
- SHA-256: `dbad294407038cac954fd3154bac6c4ea9dbb30b4e79164f58807e83f0d358cb`;
- notas versionadas: `distribution/android/release-notes-0.1.0-internal.2.md`;
- checksum versionado: `distribution/android/checksums-0.1.0-internal.2.txt`.

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
