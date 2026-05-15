# Checkpoint - Android 0.1.2, update no app e portal

Data: 2026-05-15
Coordenacao: Ze
Especialistas considerados: Katia, Fabio, Demi, Tereza, Eliane, Cristine, Lina, Tarcila e Lucena

## Objetivo

Preparar a atualizacao Android apos os ajustes de acesso offline, vinculos de anjos e fila local de SOS, mantendo o canal publico simples para usuarios finais e permitindo que o app detecte nova versao pelo painel de atualizacao.

## Implementado

- App Android sincronizado para `0.1.2` com `versionCode 4`.
- Fallback visual da tela de configuracoes atualizado para a nova versao.
- APK privado debug bundled gerado com JavaScript embutido.
- APK copiado para o artefato local `distribution/android/out/sinalseguro-android.apk`.
- Portal preparado com o nome publico estavel `sinalseguro_android.apk`.
- Manifesto/checksum do portal atualizados para a versao `0.1.2`.
- Backend de release preparado para publicar `versionCode 4` no endpoint autenticado `GET /api/app-releases/current`.

## Artefato

- APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Versao: `0.1.2`
- VersionCode: `4`
- SHA-256: `1ee74e9dd3675a150f3a1264abf99437c494f268d0f63cde9a9bd6b1fb182539`
- Link publico estavel: `https://www.sinalseguro.com.br/baixar/android`
- Link direto versionado: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk?v=0.1.2-20260515`

## Validacoes

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: aprovado.
- Build Android debug bundled `arm64-v8a`: aprovado.
- `aapt dump badging`: `versionCode='4'`, `versionName='0.1.2'`, `targetSdkVersion='36'`.
- Backend local: `manage.py check`, 35 testes e `makemigrations --check --dry-run` aprovados.
- Portal local: `npm run validate` aprovado.
- API EC2: migration `app_releases.0003_update_android_release_20260515_v012` aplicada, `sinalseguro-api=active`, `cereusia-crm=active`, health/ready ok e `cereusia.conf` preservado.
- Portal EC2: publicado em `/var/www/sinalseguro/releases/20260515T220003Z`.
- Producao: `/baixar/android`, `installers.json`, `checksums.txt` e o APK publicado retornaram o SHA-256 esperado.
- Registro de release em producao: `0.1.2|4|1ee74e9dd3675a150f3a1264abf99437c494f268d0f63cde9a9bd6b1fb182539`.

## Limite fisico registrado

O Android fisico `23129RA5FL` voltou a responder comandos curtos por ADB e foi confirmado ainda em `versionName=0.1.1`, `versionCode=3`. No entanto, o transporte USB travou em todas as tentativas de transferencia grande do APK:

- `adb install --no-streaming -r`;
- `adb install -r`;
- `adb push` do APK inteiro;
- `adb tcpip 5555`;
- envio em partes para reconstruir o APK no aparelho.

Por esse motivo, a instalacao automatizada e a validacao visual local no Android ficam pendentes de novo cabo/transporte estavel ou instalacao manual pelo portal. O canal de update do app foi viabilizado pela publicacao de `versionCode 4` no backend e pela pagina publica Android.

## Regras preservadas

- Nome publico do APK permanece `sinalseguro_android.apk`.
- QR permanece apontando para `/baixar/android`.
- Textos publicos evitam termos internos e mantem linguagem para usuario final.
- iPhone/iOS segue pos-MVP, sem release ativo.
- APK/AAB/IPA privados nao entram no Git.
