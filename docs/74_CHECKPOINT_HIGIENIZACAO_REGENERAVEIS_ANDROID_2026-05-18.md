# Checkpoint Higienizacao de Regeneraveis Android

Data: 2026-05-18
Coordenacao: Ze
Status: limpeza operacional concluida; sem alteracao de codigo do app, backend, portal ou release.

## Objetivo

Liberar espaco local para a proxima rodada Android sem iniciar build pesado, sem publicar release e sem declarar validacao fim a fim da live-call.

## Estado antes

- ADB continuou listando apenas um Android como `device`.
- `adb mdns services` nao encontrou novos servicos ADB Wi-Fi.
- Espaco local no Mac: cerca de 3.3 GiB livres.
- `android/app/build` ocupava cerca de 1.1 GiB.
- O app `0.1.15` ja estava instalado no Android detectado.

## Limpeza aplicada

Comando operacional:

```bash
../../scripts/higienizar-reciclaveis-android.sh --select all --apply
```

Resultado:

- itens removidos: `38`;
- falhas: `0`;
- espaco estimado selecionado: `2.2 GiB`;
- espaco disponivel antes: `3.3 GiB`;
- espaco disponivel depois: `5.4 GiB`;
- variacao real disponivel: `2.0 GiB`.

Principais regeneraveis removidos:

- `android/.gradle`;
- `android/app/.cxx`;
- `android/app/build`;
- `android/build`;
- duplicatas `* 2.*` em intermediarios Android de dependencias;
- temporarios antigos em `/private/tmp/sinalseguro-android-live-20260517*`.

## Correcao operacional do script

O dry-run pos-limpeza revelou falha no script raiz quando nao havia mais itens:

```text
SIZES_KB[@]: unbound variable
```

Foi aplicado ajuste pequeno em `scripts/higienizar-reciclaveis-mobile.sh` para calcular totais somente quando houver itens/selecionados. O script raiz fica fora do Git do app mobile, mas a decisao fica registrada neste checkpoint.

Validacoes do script:

- `bash -n ../../scripts/higienizar-reciclaveis-mobile.sh`: aprovado;
- `bash -n ../../scripts/higienizar-reciclaveis-android.sh`: aprovado;
- dry-run pos-limpeza: aprovado, retornando `nenhum reciclavel encontrado`.

## Impacto

- O APK local em `android/app/build/outputs/apk/debug/app-debug.apk` foi removido como artefato regeneravel.
- O app validado permanece instalado no Android fisico.
- Para reinstalar, publicar nova release ou atualizar via ADB/portal, sera necessario rebuild Android privado.
- Como ainda ha apenas um Android disponivel, a validacao live-call fim a fim continua bloqueada.

## Proxima acao

Disponibilizar o segundo Android para executar o gate fisico completo de SOS ao vivo. Quando for necessario buildar novamente, iniciar com pelo menos o espaco atual liberado e preferir build privado controlado.
