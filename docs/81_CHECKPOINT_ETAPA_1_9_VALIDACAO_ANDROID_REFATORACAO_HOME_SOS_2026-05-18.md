# Checkpoint Etapa 1.9 - Validacao Android da Refatoracao Home/SOS

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Cristine, Eliane, Katia, Lucena e Cristine/seguranca proporcional via Codex Security
Status: validacao fisica Android concluida em build debug privado local; sem publicacao de release.

## Objetivo

Validar em Android fisico as refatoracoes puras das etapas 1.6, 1.7 e 1.8 antes de tocar novamente em runtime sensivel de SOS, camera, WebRTC, encerramento de chamado ou midia local.

## Escopo

- Sem alteracao de codigo nesta etapa.
- Sem alteracao de UX, backend, portal, API, permissao, storage, endpoint, release publica ou fluxo operacional.
- Build usado apenas para QA local em aparelhos fisicos.

## Higienizacao Controlada

- Espaco inicial no Mac: cerca de 2.5 GiB livres.
- O dry-run do script Android encontrou apenas residuos pequenos do projeto.
- Para viabilizar build, foram removidos regeneraveis tecnicos:
  - residuos Android listados por `scripts/higienizar-reciclaveis-mobile.sh android --apply --select all`;
  - cache de execucao Gradle `~/.gradle/caches/8.14.3`;
  - intermediarios falhos de build apos a primeira tentativa.
- Fonte, documentacao, lockfiles, releases publicadas, credenciais, bancos locais e arquivos pessoais nao foram alterados.

## Build

- Gates automaticos aprovados antes do build:
  - `npm run typecheck`;
  - `npm run lint`;
  - `npm test`;
  - `git diff --check`.
- `npm run private:android:readiness` retornou pronto para build privado condicionado pela pendencia conhecida de Node local `20.16.0`, que bloqueia release publica mas nao build debug privado.
- Primeira tentativa multi-ABI falhou por falta de espaco em `:app:buildCMakeDebug[armeabi-v7a]`; nao houve evidencia de falha de codigo.
- ABI dos aparelhos:
  - `0123456789ABCDEF`: `armeabi-v7a,armeabi`;
  - `5686add7`: `arm64-v8a,armeabi-v7a,armeabi`.
- Segunda tentativa usou `-PreactNativeArchitectures=armeabi-v7a` para gerar um APK comum aos dois aparelhos conectados.
- Resultado: `BUILD SUCCESSFUL`.
- Observacao: este APK 32-bit e valido para QA fisica local, mas nao e artefato de release publica.

## Artefato Local Validado

- Arquivo: `android/app/build/outputs/apk/debug/app-debug.apk`.
- Tamanho: 64 MiB.
- Package: `br.com.sinalseguro.app`.
- `versionName`: `0.1.15`.
- `versionCode`: `17`.
- SHA-256: `e6348935dcf864070323e3d16e5a6e0a505d91aee539903422ad87398ad67189`.

## Instalacao Fisica

- `0123456789ABCDEF`: instalacao via ADB concluida com `Success`.
- `5686add7`: instalacao via ADB concluida com `Success`.
- Ambos resolveram `br.com.sinalseguro.app/.MainActivity`.
- Ambos reportaram `versionName=0.1.15` e `versionCode=17` apos instalacao.

## Validacao Visual

Evidencias preservadas em `docs/evidencias/android/2026-05-18-refatoracao-home-sos-validacao/`.

- `012-home-sos.png`: app abriu na Home SOS em modo discreto, botao SOS visivel e texto `Pronto para pedir ajuda.`.
- `568-login-modal.png`: app abriu o modal de preparacao de acesso com `Entrar com Google`, termos, camera/microfone e localizacao/avisos em estado permitido.

## Logs e Seguranca

- Buffer de crash vazio nos dois aparelhos.
- `FATAL`, `AndroidRuntime` e `Unhandled`: 0 ocorrencias nos logs filtrados por processo.
- Varredura dirigida de logs do processo, apos rechecagem, nao encontrou `Authorization`, `id_token`, `encrypted_key`, SDP/ICE, `file://` ou path sensivel de midia.
- Avisos observados:
  - `Linking found multiple possible URI schemes`, usando `sinalseguro` e ignorando duplicatas do package;
  - `WebViewFactory` sem metodo especifico em um aparelho;
  - spam de `FPS-BOOST: notifyQueue load error` no Redmi, caracteristico do firmware/dispositivo.
- Nenhum desses avisos bloqueou abertura, instalacao ou validacao visual.

## Limites

- Esta etapa nao substitui a validacao fisica completa do fluxo SOS/anjo quando houver nova mudanca em runtime, WebRTC, camera, gravacao, encerramento ou midia local.
- Para release publica, ainda e necessario build multi-ABI adequado, espaco local suficiente e Node local compativel com o gate publico.

## Proxima Recomendacao

Manter a refatoracao pausada em pontos puros ja validados e escolher a proxima fatia com base em risco:

- se o proximo passo tocar SOS runtime/WebRTC/camera/midia, executar uma etapa pequena seguida de teste fisico SOS/anjo em dois aparelhos;
- se o proximo passo for apenas organizacao pura, manter o mesmo padrao de teste dedicado, `typecheck`, `lint`, `npm test`, security diff e checkpoint.
