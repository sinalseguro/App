# Checkpoint - Android 0.1.3, update publico e sincronizacao de anjos

Data: 2026-05-15  
Responsavel: Ze  
Especialistas: Kátia, Fábio, Cristine, Doneda, Tarcila, Lina, Eliane, Tereza

## Escopo

- Permitir que o app consulte nova versao no servidor sem depender de login previo.
- Evitar que a tela de login/permissoes apareca rapidamente enquanto a sessao local ainda esta sendo carregada.
- Mostrar aviso de atualizacao no app quando houver nova versao Android publicada.
- Sincronizar a tela `Anjos de confianca` ao voltar para ela, para refletir aceite de convite feito em outro aparelho.
- Preservar dados minimos no relacionamento de anjo; quem atua como anjo nao recebe identificador interno de protegido.

## Implementado

- Android elevado para `0.1.3` com `versionCode 5`.
- `GET /api/app-releases/current` ficou publico, auditado sem usuario quando nao houver sessao.
- `apiClient.getCurrentAppRelease()` passou a consultar sem JWT.
- `checkForAppUpdate()` deixou de bloquear a consulta quando nao ha sessao.
- `RootLayout` faz checagem `force` no ciclo de abertura e mostra `BrandedDialog` de atualizacao.
- `AccessGate` mostra tela neutra de carregamento enquanto valida sessao, consentimentos e permissoes.
- `app/configuracoes.tsx` sempre consulta update com `force: true` ao carregar configuracoes.
- `app/contatos.tsx` usa foco de tela para atualizar convites, contatos e relacionamentos.
- `apiClient` preserva mensagens de erro DRF em campos como `token` e `non_field_errors`.
- `TrustedContactRelationshipSerializer` retorna `protected_subject` somente para o dono/originador do vinculo.

## Artefato

- APK local: `android/app/build/outputs/apk/debug/app-debug.apk`
- APK distribuicao: `distribution/android/out/sinalseguro-android.apk`
- APK portal: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk?v=0.1.3-20260515`
- SHA-256: `36f8518b72ff5711ff65893b675db5b47d36ef185aa34bf790a7356e6c3f2ae2`
- `aapt dump badging`: `versionCode='5'`, `versionName='0.1.3'`, `targetSdkVersion='36'`

## Validacoes locais

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run private:android:readiness`: aprovado.
- `npm run build:android:debug:bundled`: aprovado.
- Backend: `manage.py check`, `manage.py test sinalseguro_api.tests.test_platform_base --keepdb`, `makemigrations --check --dry-run`: aprovados.
- Portal: `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run validate`: aprovado.
- `git diff --check`: aprovado nos repos mobile e portais.

## Gate final

- API publicada na EC2 via `infra/aws/deploy-api.sh`; migration `app_releases.0004_update_android_release_20260515_v013` aplicada.
- Portal publicado na EC2 em `/var/www/sinalseguro/releases/20260516T000347Z`, mantendo o nome fixo `sinalseguro_android.apk` e QR estavel em `/baixar/android`.
- Producao validada: manifesto, APK, SHA-256, `/api/health`, `/api/health/ready`, `/baixar/android`, `nginx -t`, `cereusia-crm=active`, `sinalseguro-api=active` e `cereusia.conf` preservado.
- Validacao fisica sem ADB install: o aparelho ainda em `0.1.1`/`versionCode 3` abriu o modal antigo de atualizacao, mas nao concluiu a checagem porque a propria versao `0.1.1` bloqueia update quando nao reconhece sessao local valida antes de chamar a API.
- Decisao operacional: o salto inicial de `0.1.1` para `0.1.3` deve ser feito pelo download oficial do portal. A partir da `0.1.3`, o app consulta update no servidor antes do login visivel e preserva o fluxo pelo portal oficial.
- Apos instalacao manual pelo portal, confirmar `versionName=0.1.3` e `versionCode=5`, login persistente sem flash do gate e lista de anjos sincronizada.
