# Checkpoint Pre-validacao Unilateral Android

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Cristine, Eliane, Katia e Lucena
Status: pre-validacao unilateral concluida; live-call fim a fim segue bloqueada ate haver dois Androids.

## Objetivo

Executar a validacao possivel com o unico Android disponivel, sem alterar codigo, build, backend, portal ou release, e sem declarar aprovacao fim a fim da chamada ao vivo.

## Contexto

- Repositorio limpo e sincronizado antes da rodada.
- Apenas um Android apareceu em `adb devices -l` como `device`.
- Espaco local no Mac segue baixo, cerca de 3.3 GiB livres; nenhum build Android pesado foi iniciado.
- Gate `npm run test:live-call-security` passou antes da validacao ADB.

## Android detectado

- Pacote instalado: `br.com.sinalseguro.app`.
- `versionName=0.1.15`.
- `versionCode=17`.
- `lastUpdateTime=2026-05-17 19:20:32`.
- Permissoes concedidas:
  - camera;
  - microfone;
  - notificacoes;
  - localizacao fina/aproximada.

## Execucao ADB

- Activity resolvida: `br.com.sinalseguro.app/.MainActivity`.
- Abertura via `am start -W`: `Status: ok`.
- Primeira abertura mediu `WaitTime: 3134`.
- Processo ativo apos abertura: confirmado por `pidof`.
- `mFocusedApp` apontou para `br.com.sinalseguro.app/.MainActivity`.
- `mCurrentFocus` permaneceu como `NotificationShade`; por isso esta rodada nao deve ser tratada como validacao visual de tela.

## Log filtrado

Filtro usado apenas para sinais de erro/telemetria:

- `SinalSeguroLiveCall`;
- `ReactNativeJS`;
- `AndroidRuntime`;
- `FATAL EXCEPTION`;
- `Exception`;
- `Error`.

Resultado:

- sem `FATAL EXCEPTION`;
- sem `AndroidRuntime`;
- sem erro React Native fatal no recorte;
- apareceu apenas uma linha Android nao bloqueante de `ActivityThread` sobre metodo ausente de heap/GC.

## Camera e inventario local

- `dumpsys media.camera` indicou todos os dispositivos de camera fechados, sem cliente ativo.
- Inventario local saneado via `run-as`:
  - total de arquivos no sandbox: `26`;
  - midias claras persistentes (`.mp4/.mov/.m4v/.3gp/.avi/.webm/.m4a/.wav`): `0`;
  - `.nseg`: `0`;
  - `.sseg`: `0`.

## Decisao

Esta rodada aprova apenas a disponibilidade basica do app instalado em um Android e a ausencia de sinais imediatos de crash/vazamento no recorte filtrado.

Nao aprova:

- chamada ao vivo fim a fim;
- transmissao owner -> anjo;
- recepcao do anjo;
- autoaceite;
- handoff de midia;
- encerramento completo do SOS ao vivo;
- auditoria de sessao entre dois dispositivos.

## Proxima acao

Disponibilizar o segundo Android e repetir o gate fisico completo de SOS ao vivo. Sem dois dispositivos, manter a frente como preparada e bloqueada para validacao operacional fim a fim.
