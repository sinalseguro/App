# Checkpoint - Frente 1.3 Android e release privado no portal

Data: 2026-05-13  
Coordenacao: Ze  
Especialistas acionados: Katia, Eliane, Demi, Tereza, Tarcila, Lina, Doneda, Cristine

## Objetivo

Retomar a Frente 1.3 com Android fisico conectado, validar visualmente os fluxos de perfis/anjos/convite, publicar o APK privado Android no portal publico e retirar o release iPhone como download ativo.

## Android fisico

- Device ADB: identificador redigido
- Modelo: `23129RA5FL`
- Package: `br.com.sinalseguro.app`
- APK publicado/instalado: `distribution/android/out/sinalseguro-android.apk`
- SHA-256: `19ad59c4b9c4c47c8316f3a24d354626ee11a3442be910841fcd1e73283cd08b`

## Build e instalacao

O script privado completo foi iniciado, mas o build Android com todos os ABIs falhou em `:app:mergeDebugNativeLibs` por falta de espaco em disco. Foram removidos apenas regeneraveis de build/cache, preservando codigo-fonte, lockfiles, documentacao e segredos locais.

Para viabilizar o teste fisico imediato, foi gerado APK debug privado para o aparelho conectado com `arm64-v8a`, usando:

```bash
node scripts/prepare-android-bundled-debug.mjs
cd android
./gradlew assembleDebug -PsinalBundleDebugJs=true -PreactNativeArchitectures=arm64-v8a
```

Instalacao fisica:

```bash
adb -s <device> install -r distribution/android/out/sinalseguro-android.apk
```

Resultado: `Success`.

## Validacao visual Android

Evidencias saneadas:

- `docs/evidencias/android/2026-05-13-frente-1-3-release-portal/03-perfis.png`
- `docs/evidencias/android/2026-05-13-frente-1-3-release-portal/04-contatos.png`
- `docs/evidencias/android/2026-05-13-frente-1-3-release-portal/05-convite-sem-token.png`
- sumarios XML correspondentes na mesma pasta
- `docs/evidencias/android/2026-05-13-frente-1-3-release-portal/android-device-validation.txt`

Cobertura validada no aparelho:

- Tela `Perfis e papeis` abre por deep link, com quatro papeis visiveis.
- Perfil nao definido bloqueia a criacao de convite.
- Tela `Anjos de confianca` mostra estado, perfil, convite bloqueado, prontidao, anjos e convites.
- Tela `Convite recebido` sem token mostra convite ausente, limite de seguranca e orientacao para configurar perfil.
- Logcat saneado do recorte nao mostrou `FATAL EXCEPTION`, `AndroidRuntime`, `ReactNativeJS Error`, ANR ou crash do processo SinalSeguro.

## Portal publico

Repositorio: `repos/portais`

Publicacao realizada:

- APK no portal: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk`
- Versao/data exibida no portal: `0.1.0` em `13/05/2026`
- Checksums: `https://www.sinalseguro.com.br/downloads/private/checksums.txt`
- Manifesto: `https://www.sinalseguro.com.br/downloads/installers.json`
- QR Android: `https://www.sinalseguro.com.br/assets/app/sinalseguro-android-qr.svg`
- Release EC2: `/var/www/sinalseguro/releases/20260513T215810Z`

Mudanca publica:

- Android fica disponivel para participantes autorizados.
- iPhone nao tem release ativo no portal.
- Texto publico aprovado: `A versao para iPhone sera disponibilizada posteriormente. No momento, o acesso privado esta disponivel apenas para Android.`

## Gates executados

- Mobile: `npm run typecheck`
- Mobile: `npm run lint`
- Mobile: `npm test`
- Mobile: build Android privado para device fisico
- Mobile: instalacao ADB e validacao visual por screenshots/UI dump/logcat saneado
- Portal: `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run validate`
- Portal: `infra/aws/deploy-portais.sh`
- Pos-deploy: `/baixar`, `/baixar/android`, `/baixar/ios`, `/versoes`, manifesto, QR, APK e checksums retornaram `200`
- Pos-deploy: release iPhone antigo retornou `404`
- EC2: `nginx -t`, `cereusia-crm=active`, `sinalseguro-api=active`
- API: `health=ok`, `ready database=ok`

## Decisoes

- A Frente 1.3 segue Android-first para o MVP.
- iPhone/iOS permanece pos-MVP e nao deve bloquear as proximas frentes.
- A proxima etapa deve partir da Frente 1.3 validada no Android e usar a EC2 real para qualquer interacao backend.

## Correcao de politica de artefato

Depois do primeiro push, o GitHub alertou que o APK privado Android tinha tamanho superior ao recomendado para Git. A politica consolidada para as proximas publicacoes fica:

- APK/AAB/IPA privados nao devem ser versionados no Git;
- o portal versiona apenas codigo, conteudo, QR, manifesto, checksums, documentacao e scripts;
- o APK privado Android deve existir localmente antes do deploy ou ser fornecido por `SINALSEGURO_ANDROID_PRIVATE_APK_SOURCE`;
- a URL publica do artefato Android passa a usar nome estavel `sinalseguro_android.apk`;
- `infra/aws/deploy-portais.sh` valida existencia e SHA-256 antes de publicar a release na EC2;
- a publicacao publica continua somente no portal SinalSeguro.
- as telas publicas de download usam linguagem para usuario final, sem termos internos, com fluxo em ate tres interacoes e QR Android estavel para `/baixar/android`.

O HEAD do portal remove o APK versionado anterior do rastreamento Git e publica o artefato ativo como `public/downloads/private/android/sinalseguro_android.apk` apenas no portal/EC2.

## Validacao visual complementar - Tarcila/Lina/Eliane

Evidencias saneadas complementares:

- `docs/evidencias/android/2026-05-13-frente-1-3-visual-tarcila/`

Cobertura:

- `Perfis e papeis`, `Anjos de confianca` e `Convite recebido`;
- fonte normal e fonte ampliada `1.3`;
- screenshots e sumarios de UI preservados;
- logs brutos, intents e XMLs completos removidos antes do Git para reduzir risco de exposicao;
- fonte do aparelho restaurada para `1.0`;
- crash scan sem padroes fatais;
- fonte `1.3` com ressalva de UX por cortes/overflow em textos longos, pendente de refinamento visual.

Leitura UX/IX:

- botoes principais permanecem legiveis e tocaveis;
- modais/avisos usam linguagem clara e conservadora;
- convite segue bloqueado quando o perfil nao esta configurado;
- nao houve exposicao de email, CPF, telefone, token real, localizacao, midia, relato ou chave nas evidencias preservadas.
