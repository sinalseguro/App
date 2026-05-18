# Checkpoint Android 0.1.15 Rebuild e Instalacao Unilateral

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Katia, Eliane, Cristine, Tereza, Tarcila, Lina e Lucena
Status: APK privado recompilado e instalado em um Android fisico; validacao SOS/anjo fim a fim segue bloqueada ate o segundo Android aparecer no ADB.

## Objetivo

Regenerar o APK Android privado depois da higienizacao de reciclaveis, instalar no aparelho fisico disponivel e confirmar que a aplicacao abre sem regressao visual basica.

## Contexto

- Worktree `main` estava limpo e sincronizado antes da rodada.
- Apenas um Android foi detectado em `adb devices -l`.
- `adb mdns services` nao encontrou segundo Android por Wi-Fi.
- Espaco local antes do build: cerca de `5.3 GiB`.
- O APK anterior tinha sido removido como artefato regeneravel durante a limpeza, entao foi necessario recompilar.

## Gates executados

Comando principal:

```bash
../../scripts/gerar-aplicativo.sh privado --overwrite --install
```

Resultados:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado, incluindo testes de criptografia, device keys, perfis, live-call history/session/state, WebRTC, logging sensivel e contrato de API.
- `npm run build:android:private`: aprovado.
- `npm run private:android:readiness`: aprovado como build privado condicionado, com pendencia conhecida de Node local `20.16.0`; a exigencia `>=22.13.0` permanece para release publico.
- Build Gradle: `BUILD SUCCESSFUL`.

## Artefato

- Caminho local: `distribution/android/out/sinalseguro-android.apk`.
- Tamanho: `250M`.
- SHA-256: `b4f58d1d322a890da5dab0e717d0c81ceb4fb897fb91ef96ae34522b2e1c664c`.
- Arquivo de checksum: `distribution/android/out/checksums.txt`.

## Instalacao fisica

- Pacote: `br.com.sinalseguro.app`.
- `versionName=0.1.15`.
- `versionCode=17`.
- `lastUpdateTime=2026-05-18 07:07:46`.
- `adb install -r`: `Success`.

## Validacao visual unilateral

- A primeira captura veio preta porque o aparelho estava em AOD/tela bloqueada.
- A tela foi acordada por ADB e o app abriu em modo discreto.
- Evidencia visual saneada: `docs/evidencias/android/2026-05-18-android-0-1-15-rebuild/home-sos-pronto.png`.
- Resultado visual: Home carregada com identidade SinalSeguro, botao `SOS`, texto `Segurar para pedir ajuda`, status `Pronto para pedir ajuda` e botoes rapidos `Policia`, `Bombeiros` e `SAMU`.

## Logs filtrados

Filtro usado para sinais de falha:

- `br.com.sinalseguro`;
- `SinalSeguro`;
- `ReactNativeJS`;
- `AndroidRuntime`;
- `FATAL EXCEPTION`;
- `Exception`;
- `Error`.

Resultado:

- Sem `FATAL EXCEPTION` no recorte filtrado.
- Sem crash React Native visivel no recorte.
- Linhas `Error` observadas eram ruidos do sistema/MIUI/thermal/process manager, nao falha direta do app no trecho avaliado.

## Higienizacao pos-build

O build consumiu quase todo o espaco local, reduzindo o disco para cerca de `361 MiB`.

Foi executada nova higienizacao de regeneraveis Android:

- `android/.gradle`;
- `android/app/.cxx`;
- `android/app/build`;
- `android/build`.

Resultado:

- 4 itens removidos.
- 0 falhas.
- Espaco estimado removido: `3.2 GiB`.
- Espaco final disponivel: cerca de `2.9 GiB`.
- O APK final em `distribution/android/out/sinalseguro-android.apk` foi preservado.

## Decisao

Esta rodada aprova:

- recompilacao local do APK Android privado;
- instalacao no Android fisico disponivel;
- abertura visual basica da Home/SOS;
- ausencia de crash fatal no recorte filtrado;
- preservacao do artefato local para a proxima validacao.

Esta rodada nao aprova:

- SOS/anjo fim a fim;
- notificacao no anjo;
- transmissao solicitante -> anjo;
- gravacao/recepcao em dois dispositivos;
- publicacao final no portal/backend como release validada.

## Proxima acao

Reconectar o segundo Android no ADB e repetir a validacao fisica completa de SOS ao vivo. Se passar, publicar a release privada no portal/backend usando o nome publico estavel `sinalseguro_android.apk`, atualizar manifest/checksum/canal de atualizacao do app e registrar nova evidencia.
