# Checkpoint de pausa - Frente 1.2 Android - 2026-05-13

Status: pausa controlada para Roberto atuar em demanda paralela do portal web no segmento governo/business. Este checkpoint nao executa, altera ou prepara nada do portal.

## Estado antes da pausa

- Frente 1.2 Android aprovada por Ze/QA para teste manual supervisionado de Roberto.
- Android fisico `23129RA5FL` segue com o app instalado.
- APK final validado antes da limpeza: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256 preservado em memoria/documentacao: `50fe4c831174899e5728579709ec906470c6c55d4aad1f205c162da1be0444db`.
- Evidencias locais da validacao Android estao em `docs/evidencias/android/2026-05-13-frente-1-2-validacao-fisica/`.
- iPhone/iOS permanece fora do MVP imediato e nao deve ser reaberto nesta frente.

## Higienizacao executada

Comando:

```bash
./scripts/higienizar-reciclaveis-android.sh --select all --apply
```

Itens removidos pelo script versionado:

- `apps/mobile/.expo`
- `apps/mobile/android/.gradle`
- `apps/mobile/android/app/.cxx`
- `apps/mobile/android/app/build`
- `apps/mobile/android/build`

Relatorio do script:

- itens removidos: 5
- falhas: 0
- espaco estimado selecionado: 3.1 GiB
- espaco disponivel antes: 4.1 GiB
- espaco disponivel depois: 6.6 GiB
- variacao real disponivel: 2.5 GiB

Conferencia pos-limpeza:

- dry-run posterior retornou `nenhum reciclavel encontrado`;
- `df -h /` confirmou 6.6 GiB disponiveis imediatamente apos o script e 6.3 GiB em conferencia final posterior;
- os diretorios reciclaveis listados ficaram ausentes.

## Impacto esperado

- O APK local em `android/app/build/outputs/apk/debug/app-debug.apk` foi removido junto com `android/app/build`, como reciclavel.
- O app instalado no Android fisico nao foi removido.
- Para apenas testar manualmente o app ja instalado, nao e necessario rebuild.
- Para reinstalar ou gerar novo APK, executar novamente o fluxo Android privado a partir do codigo atual.

## Retomada recomendada

1. Confirmar se Roberto concluiu a demanda paralela do portal web.
2. Retomar esta frente somente no escopo Android da Frente 1.2.
3. Se o app ainda estiver instalado, iniciar pelo teste manual supervisionado.
4. Se precisar reinstalar, rodar `npm run prepare:build:android`, `npm run build:android:private` e instalar o APK no Android fisico.
5. Nao fechar a Frente 1.2 ate Roberto aprovar manualmente SOS, cofre, player, reproducao, retorno ao Home e ausencia de falha visivel.
