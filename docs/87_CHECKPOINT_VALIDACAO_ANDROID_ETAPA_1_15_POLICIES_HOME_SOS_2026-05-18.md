# Checkpoint Etapa 1.15 - validacao Android das policies Home/SOS

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Katia, Eliane, Cristine, Lina e Lucena
Status: validacao fisica Android concluida em build debug privado local; sem publicacao de release.

## Objetivo

Validar em dois Androids fisicos as refatoracoes puras acumuladas da Home/SOS ate a Etapa 1.14, com foco em instalacao, abertura, estabilidade visual, crash buffer e evidencia leve de performance.

## Escopo

- Sem alteracao de codigo nesta etapa.
- Sem alteracao de UX, layout, backend, portal, API, permissao, storage, endpoint ou release publica.
- Sem acionamento de SOS nesta rodada para evitar evento real, registro operacional ou trafego backend fora do objetivo de QA da refatoracao.
- Build usado apenas para QA local em aparelhos fisicos.

## Dispositivos

- `0123456789ABCDEF`: Android fisico 32-bit, ABI `armeabi-v7a`.
- `5686add7`: Android fisico Redmi 64-bit, ABI `arm64-v8a`; a entrada Wi-Fi/mDNS duplicada continua sendo tratada apenas como transporte do mesmo aparelho.

## Gates pre-build

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia ambiental conhecida de Node local `20.16.0` para release publica.
- `git status`: limpo antes do build.

## Build e instalacao

- Tentativa multi-ABI inicial falhou por falta de espaco em `:app:stripDebugDebugSymbols`; nao houve evidencia de falha de codigo.
- A validacao seguiu com builds separados por ABI para reduzir pico de espaco:
  - `armeabi-v7a`: `BUILD SUCCESSFUL`, APK `64M`, SHA-256 `01be88bec3e3bad7e142799dfa176201d557730408a09cf393b34ebb99185538`;
  - `arm64-v8a`: `BUILD SUCCESSFUL`, APK `88M`, SHA-256 `131d8a96a60590e91811f85696539a5e8a296087e424fcf044c9e145d4b49961`.
- Instalacao ADB:
  - `0123456789ABCDEF`: `Success`, `versionName=0.1.15`, `versionCode=17`;
  - `5686add7`: `Success`, `versionName=0.1.15`, `versionCode=17`.
- Artefatos locais temporarios: `/tmp/sinalseguro-android-qa-20260518/`.
- APKs, screenshots e logs brutos nao foram versionados.

## Validacao visual

- Redmi 64-bit:
  - abriu diretamente na Home SOS;
  - exibiu `MODO DISCRETO`, botao `SOS`, atalhos `Policia`, `Bombeiros`, `SAMU` e estado `Pronto para pedir ajuda.`;
  - sem sobreposicao visual incoerente no recorte validado.
- Android 32-bit:
  - apos 10s ainda estava no splash/loading;
  - apos cerca de 55s chegou na Home SOS;
  - exibiu o mesmo estado operacional de Home SOS pronta.

## Performance leve

- Redmi 64-bit:
  - processo vivo apos abertura;
  - `gfxinfo`: 1215 frames, 25 janky frames (`2.06%`), p95 `15ms`, p99 `24ms`;
  - `meminfo`: `TOTAL PSS` aproximado `267644 KB`, `Activities=1`, `WebViews=0`.
- Android 32-bit:
  - processo vivo apos abertura;
  - captura inicial: 544 frames, 207 janky frames (`38.05%`), p95 `44ms`, p99 `77ms`;
  - apos estabilizacao: 5174 frames, 1227 janky frames (`23.71%`), p95 `28ms`, p99 `38ms`;
  - `meminfo` apos estabilizacao: `TOTAL` aproximado `137909 KB`, `Activities=1`, `WebViews=0`.
- Interpretacao: a refatoracao nao quebrou abertura nem Home SOS, mas o aparelho 32-bit segue como alvo de risco de performance/startup e deve ser usado como sentinela em proximas mudancas de runtime.

## Logs e seguranca

- Buffer de crash vazio nos dois aparelhos.
- Varredura de severidade nos logs filtrados nao encontrou `FATAL EXCEPTION`, ANR, `TypeError`, `ReferenceError` ou crash React Native.
- A unica ocorrencia sensivel encontrada na varredura foi path interno de instalacao do pacote Android em `logcat`/`meminfo`, por isso logs brutos e meminfo completo ficaram fora do Git.
- Nao foi observado vazamento de `Authorization`, `id_token`, `encrypted_key`, SDP/ICE, chave privada ou payload P2P nos recortes revisados.

## Higienizacao

- Removidos apenas regeneraveis pos-build:
  - `android/app/build`;
  - `android/app/.cxx`;
  - `android/build`;
  - `android/.gradle`;
  - `~/.gradle/caches/8.14.3`.
- Espaco livre no Mac voltou para cerca de `2.7 GiB`.
- Codigo, lockfiles, documentacao, credenciais, bancos locais e estado dos aparelhos nao foram apagados.

## Decisao

As policies puras da Home/SOS ate a Etapa 1.14 permanecem aprovadas para continuidade da refatoracao. A validacao fisica confirmou que os dois Androids abrem a Home SOS sem crash, mantendo `0.1.15`/`versionCode=17`.

## Proxima recomendacao

Continuar a refatoracao em fatias pequenas apenas se a proxima fatia for regra pura. Se a proxima mudanca tocar SOS real, camera, WebRTC, gravacao, notificacao, backend ou UX de chamada, executar teste fisico fim a fim owner -> anjo antes de publicar qualquer release.
