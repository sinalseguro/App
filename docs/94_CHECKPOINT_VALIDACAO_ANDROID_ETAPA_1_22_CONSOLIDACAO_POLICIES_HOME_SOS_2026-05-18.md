# Checkpoint - Validacao Android da consolidacao das policies Home/SOS

Data: 2026-05-18

## Status

Validacao fisica de consolidacao aprovada para as etapas 1.20 e 1.21, sem alteracao de comportamento do app.

Esta validacao cobre a instalacao e abertura da Home/SOS em dois Androids fisicos apos as refatoracoes puras de:

- confirmacao de encerramento por codigo;
- rota protegida por codigo.

## Especialistas envolvidos

- Kátia: validacao Android fisica, instalacao e abertura do app.
- Eliane: gates de QA, regressao e leitura de evidencias.
- Cristine: varredura de logs e regra de nao versionar evidencias brutas.
- Lina/Tarcila: verificacao visual da Home/SOS dentro do padrao de identidade ja aprovado.

## Artefato instalado

APK local de QA:

- caminho: `android/app/build/outputs/apk/debug/app-debug.apk`;
- pacote: `br.com.sinalseguro.app`;
- `versionName=0.1.15`;
- `versionCode=17`;
- SHA-256: `328de08508081a8d8696241cdacf206edd6bb8c447ffa05abb1de263765e8e63`;
- ABIs: `armeabi-v7a` e `arm64-v8a`.

Observacao: este artefato foi usado para validacao local fisica. Nao altera o canal publico de release sem uma etapa propria de publicacao.

## Dispositivos validados

ADB confirmou dois Androids fisicos distintos:

- `0123456789ABCDEF`: `armeabi-v7a`, `versionName=0.1.15`, `versionCode=17`;
- `5686add7`: `arm64-v8a`, `versionName=0.1.15`, `versionCode=17`.

O Redmi tambem apareceu em transporte Wi-Fi/mDNS duplicado. Para evidencia de dois aparelhos, contar apenas os dois seriais fisicos por USB.

## Resultado visual

A Home/SOS abriu nos dois aparelhos com:

- cabecalho `SinalSeguro`;
- modo `MODO DISCRETO`;
- botao principal `SOS`;
- texto `Segurar para pedir ajuda`;
- estado `Pronto para pedir ajuda`;
- botoes rapidos `Policia`, `Bombeiros` e `SAMU`.

Nao houve sobreposicao visual relevante nos prints finais. O Redmi 64-bit mostrou layout mais alto, mantendo a hierarquia e os botoes dentro da tela.

## Performance observada

Startup:

- `0123456789ABCDEF`: `WaitTime=9374ms`;
- `5686add7`: `WaitTime=2898ms`.

`gfxinfo` em tela estavel:

- `0123456789ABCDEF`: 13.698 frames, 21,27% janky, p50 18ms, p90 23ms, p95 26ms, p99 32ms;
- `5686add7`: 33.532 frames, 0,60% janky, p50 15ms, p90 20ms, p95 21ms, p99 25ms.

Memoria em tela estavel:

- `0123456789ABCDEF`: Java Heap 9.960K, Native Heap 15.396K, Graphics 11.012K, 89 views, 1 activity;
- `5686add7`: Total PSS 252.178K, Java Heap 43.300K, Native Heap 24.868K, Graphics 48.732K, 88 views, 1 activity.

Conclusao de performance: o Android 32-bit continua sendo sentinela de startup e jank. O Redmi 64-bit ficou dentro de comportamento aceitavel para esta tela.

## Logs e seguranca

Varredura dos logs coletados:

- sem `FATAL EXCEPTION`;
- sem `AndroidRuntime`;
- sem ANR;
- sem `TypeError`;
- sem `ReferenceError`;
- sem erro React Native nao tratado.

Avisos conhecidos e nao bloqueantes:

- Firebase default app nao inicializado no build debug local;
- URI scheme duplicado em ambiente Expo/React Native, usando `sinalseguro` como preferido;
- logs de WebRTC inicializando audio device module;
- linha de loader do Android com paths internos do pacote no Redmi.

Por seguranca, os logs e prints brutos desta rodada ficaram fora do Git. A pasta local de evidencias foi adicionada ao `.gitignore`, e este checkpoint registra apenas o resumo saneado.

## Decisao

- A consolidacao pos-etapas 1.20 e 1.21 esta aprovada para seguir com a refatoracao.
- Nao foi executado SOS fim a fim nesta rodada, porque as mudancas validadas sao policies puras sem alteracao de camera, WebRTC, gravacao, backend, UI de chamada ou roteamento de anjo.
- Qualquer proxima alteracao operacional em SOS, camera, WebRTC, renderizacao, gravacao, chamada ou backend deve repetir teste fisico owner -> anjo.

## Proxima recomendacao

Continuar com mais duas fatias pequenas de refatoracao pura em Home/SOS, mantendo o mesmo padrao:

1. extrair a politica de exibicao/entrada do painel de chamada ao vivo, sem mexer no runtime WebRTC;
2. extrair a politica de mensagens de estado do pacote local do SOS, sem alterar captura, gravacao, storage ou API.

Antes de novo build Android, liberar espaco no Mac ou limitar a validacao a gates JS/TS quando a fatia continuar pura.
