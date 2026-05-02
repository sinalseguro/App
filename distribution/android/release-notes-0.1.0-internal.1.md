# SinalSeguro Android v0.1.0 interno 1

Data: 2026-05-02

## Escopo

- Primeiro APK Android assinado para homologacao tecnica controlada.
- App shell React Native/Expo com navegacao, design system inicial e fluxo de alerta simulado.
- Android 7+ (`minSdkVersion 24`) e `targetSdkVersion 36`.
- Instalador ARM para celulares reais: `armeabi-v7a` e `arm64-v8a`.

## Limites obrigatorios

- Nao usar com dados reais de vitimas, anjos, alertas, localizacao ou midia.
- Nao substitui 190, 180, atendimento policial, atendimento medico ou rede publica oficial.
- Nao ha integracao oficial com orgaos publicos nesta versao.
- Nao ha camera, microfone, gravacao, streaming, P2P critico ou coleta real de evidencias.
- O alerta desta versao e simulado e serve apenas para validacao de UX, build, instalacao e arquitetura inicial.

## Seguranca e LGPD

- Nenhum segredo, keystore, senha, token, `.env` ou dado real foi versionado.
- O APK bloqueia permissoes prematuras de camera, microfone, overlay e armazenamento legado.
- O uso em homologacao deve ocorrer apenas com participantes informados e ambiente controlado.

## Integridade

```text
SHA-256  a920c116adff07f9121281c1cd3d086daeee969dd014741658d24dd128c280f5  sinalseguro-android.apk
```
