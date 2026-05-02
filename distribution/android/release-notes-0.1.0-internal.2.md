# SinalSeguro Android v0.1.0 interno 2

Data: 2026-05-02

## Escopo

- Segundo APK Android assinado para homologacao tecnica controlada.
- Validacao visual coordenada por Tarcila para nome, logo, icone, splash e tela inicial.
- App shell React Native/Expo com navegacao, design system inicial e fluxo de alerta simulado.
- Android 7+ (`minSdkVersion 24`) e `targetSdkVersion 36`.
- Instalador ARM para celulares reais: `armeabi-v7a` e `arm64-v8a`.

## Ajustes desta release

- Icone do app e adaptive icon Android registrados em `app.json`.
- Splash interno configurado com logo SinalSeguro e fundo institucional.
- Tela inicial passou a usar lockup com simbolo aprovado, nome `SinalSeguro` e assinatura `Rede de Protecao e Amparo`.
- Botao de panico simulado passou a usar o token `colors.panic = #C2185B`, corrigindo contraste.
- Sombra do design system corrigida para usar `shadowOpacity`, sem reduzir a opacidade do botao.

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

## Evidencia tecnica

- Instalacao validada em Android fisico via ADB Wi-Fi.
- Pacote instalado: `br.com.sinalseguro.app`.
- Versao instalada: `versionCode=2`, `versionName=0.1.0`.
- Assinatura APK Scheme v2: valida.
- Label de aplicacao: `SinalSeguro`.
- Captura saneada local: `/tmp/sinalseguro-android-qa/home-v2.png`.

## Integridade

```text
SHA-256  dbad294407038cac954fd3154bac6c4ea9dbb30b4e79164f58807e83f0d358cb  sinalseguro-android.apk
```
