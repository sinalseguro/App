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

## Portal

Os portais publicam paginas estaveis:

- `/baixar`: central de instalacao;
- `/baixar/android`: status e link Android;
- `/baixar/ios`: status e link iOS.

Essas paginas devem continuar publicas mesmo antes dos instaladores finais para que os QR codes nao mudem.

## Bloqueios atuais

- O push para `sinalseguro/App` ainda depende de permissao de escrita da chave/usuario no repositorio.
- EAS CLI nao esta instalado globalmente.
- O Android SDK local nao possui plataformas instaladas em `~/Library/Android/sdk/platforms`, entao nao ha build Android local neste checkpoint.
- Build Android assinado depende de perfil/chave fora do Git.
- Distribuicao iOS depende de conta Apple, certificados, provisioning profile e TestFlight/App Store.
- Xcode esta disponivel, mas o app ainda nao possui projeto iOS prebuild nem credenciais Apple versionaveis.

## Criterios de liberacao

- `npm run typecheck`, `npm run lint` e `npm test` aprovados.
- Auditoria sem vulnerabilidade alta/critica conhecida sem tratamento.
- Sem dados sensiveis em logs, URL, push, QR, release notes ou assets.
- APK/AAB/IPA com hash SHA-256 publicado.
- Release revisada por Cristine, Myers, Schneier, Doneda e Tarcila quando houver asset visual.
