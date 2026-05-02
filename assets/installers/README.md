# Instaladores

Esta pasta documenta a política de distribuição do SinalSeguro App.

## Android

O instalador Android deve ser publicado como artefato assinado em GitHub Releases:

- `sinalseguro-android.apk` para teste interno controlado;
- `sinalseguro-android.aab` apenas para envio ao Google Play.

Nenhum APK com chave de debug deve ser tratado como produção.

## iOS

O instalador iOS para dispositivos reais deve passar por TestFlight ou App Store.
IPA ad hoc só pode ser usada com conta Apple, perfil de provisionamento e lista de dispositivos autorizados.

## Regra

Não versionar chaves, perfis, certificados, `.env`, tokens, dados reais ou relatos identificáveis.
