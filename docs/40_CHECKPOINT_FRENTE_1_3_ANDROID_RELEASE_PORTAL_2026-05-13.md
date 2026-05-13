# Checkpoint - Frente 1.3 Android e release privado no portal

Data: 2026-05-13  
Coordenacao: Ze  
Especialistas acionados: Katia, Eliane, Demi, Tereza, Tarcila, Lina, Doneda, Cristine

## Objetivo

Retomar a Frente 1.3 com Android fisico conectado, validar visualmente os fluxos de perfis/anjos/convite, publicar o APK privado Android no portal publico e retirar o release iPhone como download ativo.

## Android fisico

- Device ADB: `5686add7`
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
adb -s 5686add7 install -r distribution/android/out/sinalseguro-android.apk
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

- APK no portal: `https://www.sinalseguro.com.br/downloads/private/android/SinalSeguro-privado-0.1.0-20260513.apk`
- Checksums: `https://www.sinalseguro.com.br/downloads/private/checksums.txt`
- Manifesto: `https://www.sinalseguro.com.br/downloads/installers.json`
- QR Android: `https://www.sinalseguro.com.br/assets/app/sinalseguro-android-qr-20260513.svg`
- Release EC2: `/var/www/sinalseguro/releases/20260513T212800Z`

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
