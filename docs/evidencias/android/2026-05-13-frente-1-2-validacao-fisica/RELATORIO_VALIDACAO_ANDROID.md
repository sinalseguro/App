# Frente 1.2 - Validacao fisica Android - 2026-05-13

Status: aprovado tecnicamente e aprovado manualmente por Roberto. A Frente 1.2 fica formalmente fechada no escopo Android do MVP.

## Ambiente

- Device ADB: `5686add7`.
- Modelo: `23129RA5FL`.
- Android: 15, SDK 35.
- APK instalado: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256: `50fe4c831174899e5728579709ec906470c6c55d4aad1f205c162da1be0444db`.
- Instalacao: `adb install -r` retornou `Success`.

## Ajuste aplicado antes do build final

- O motor nativo Android deixou de aceitar arquivos de entrada em `externalCacheDir` e `getExternalFilesDir`.
- A entrada nativa agora fica restrita a `filesDir`, `cacheDir` e `noBackupFilesDir`.
- O smoke test passou a bloquear regressao que reabra raiz externa como origem de midia.

## Validacoes locais antes da instalacao

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: aprovado com pendencia ambiental conhecida de Node local para release publico.
- `git diff --check`: aprovado.
- `npm run build:android:private`: aprovado.

## Teste fisico executado

- Home abriu sem prompt bloqueante e com SOS legivel.
- Primeiro ciclo: SOS por toque longo, chamada ativa, midia local frontal em modo leve, gravacao finalizada como `Video protegido` em 100%.
- Cofre abriu com o pacote `SOS 13/05/26 11:30`, exibindo `Video 1min 48s` e `1 video`.
- Player seguro abriu o arquivo como item unico, mostrou duracao `1:46` e reproduziu ate pelo menos `0:23`.
- Ciclos curtos pos-rebuild confirmaram reentrada da camera/microfone, retorno `Video protegido` em 100%, botao `Continuar` fechando o modal para Home, cofre com `Video 31s`/`1 video` e player final reproduzindo `0:01 / 0:29`.

## Evidencia visual local

As capturas PNG ficam neste diretorio apenas como evidencia operacional local. Elas nao devem ser publicadas sem revisao porque podem conter contexto visual do aparelho.

- `01-home.png`: Home inicial.
- `03-after-sos-hold-second.png`: chamado ativo com midia local.
- `05-active-65s.png`: chamado ativo apos cerca de 65s.
- `06-after-stop-request.png`: finalizacao com `Video protegido`.
- `08-cofre-screen.png`: cofre com novo pacote protegido.
- `10-player-open.png`: player seguro aberto.
- `11-player-playing.png`: player reproduzindo.
- `15-second-cycle-finished.png`: segundo ciclo finalizado.
- `23-finish-pos-rebuild.png`: finalizacao do rebuild final.
- `24-continuar-fecha-modal-pos-rebuild.png`: `Continuar` retornando para Home.
- `31-final-apk-cofre-saneado.png`: cofre saneado no APK final.
- `34-final-apk-cofre-expanded-double.png`: acoes do pacote no APK final.
- `37-final-apk-player-playing-2.png`: player final reproduzindo.
- `39-final-home-ready.png`: Home pronta para teste manual.

## Logs e residuos

- Logcat bruto foi usado apenas localmente em `/tmp` e nao deve ser versionado.
- Nao foram encontrados `FATAL EXCEPTION`, ANR ou crash nativo do processo SinalSeguro no recorte analisado.
- `dumpsys media.camera` mostrou conexao e desconexao da camera pelo pacote `br.com.sinalseguro.app`; no final, todos os devices estavam sem cliente ativo.
- Inventario saneado final pos-rebuild do sandbox: 418 arquivos, 375 `.sseg`, 22 `.nseg`, 0 arquivos claros com extensao `.mp4`, `.mov`, `.m4v`, `.3gp`, `.avi` ou `.webm`.

## Decisao de gate

O Android privado foi tecnicamente validado e Roberto aprovou manualmente a Frente 1.2 em 2026-05-13.

Decisao:

- Frente 1.2 encerrada para o escopo Android do MVP.
- iPhone/iOS permanece pos-MVP, sem bloquear a sequencia Android.
- Proxima frente recomendada: Frente 1.3 - perfis, familia, maioridade e papeis.
