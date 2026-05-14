# Checkpoint - Atualizacao Android via portal e checagem diaria

Data: 2026-05-14
Coordenacao: Ze
Especialistas considerados: Katia, Tereza, Cristine, Eliane, Lina e Tarcila

## Objetivo

Habilitar no app Android a verificacao manual e automatica de nova versao, consultando a API autenticada do SinalSeguro e usando o mesmo download publico publicado no portal da EC2.

## Implementacao

Arquivos alterados:

- `src/services/appUpdate.ts`
- `app/_layout.tsx`
- `app/configuracoes.tsx`
- `app.json`
- `package.json`
- `package-lock.json`
- `android/app/build.gradle`
- `src/services/apiClient.ts`
- `services/api/app_releases/`
- `services/api/sinalseguro_api/api_urls.py`
- `services/api/sinalseguro_api/settings.py`

Comportamento novo:

- o app consulta `GET /api/app-releases/current` com JWT da conta SinalSeguro;
- sem login, o app orienta entrar na conta antes de verificar atualizacoes;
- a verificacao bem-sucedida e reaproveitada por 24 horas antes de nova chamada automatica;
- o painel `Atualizacao` aparece em `Configuracoes`;
- o download publico abre `https://www.sinalseguro.com.br/baixar/android`;
- o nome do instalador permanece fixo em `sinalseguro_android.apk`.
- o link direto do APK usa `?v=0.1.1-20260514` para evitar cache externo antigo sem alterar o QR code.

## Portal sincronizado

Arquivos ajustados:

- `repos/portais/public/downloads/installers.json`
- `repos/portais/public/downloads/private/checksums.txt`
- `repos/portais/public/downloads/android/README.txt`
- `repos/portais/src/content/portals.ts`

Versao publicada:

- versao: `0.1.1`
- versionCode: `3`
- SHA-256: `8cab34dc0838637f7713999b56c8ba28d36fb071f02735a7836beb5cfbb91cc1`

## Validacoes

- `npm run typecheck`: aprovado
- `npm run lint`: aprovado
- `npm test`: aprovado
- `npm run build:android:private`: aprovado
- `aapt dump badging`: aprovado com `versionCode='3'` e `versionName='0.1.1'`
- `manage.py check` com venv temporaria em `/tmp`: aprovado
- `manage.py makemigrations --check --dry-run` com venv temporaria em `/tmp`: aprovado
- testes focados do endpoint autenticado `app-releases/current`: aprovados
- instalacao via USB/ADB: pendente nesta versao final porque nenhum Android foi listado por `adb devices -l` na retomada
- abertura do link de download no navegador do aparelho: pendente de validacao fisica/manual
- visual do painel de atualização no Android fisico: pendente de validacao fisica/manual

## API e banco

- app Django novo: `app_releases`
- endpoint: `GET /api/app-releases/current?platform=android&version=0.1.1&version_code=3`
- autenticacao: JWT obrigatorio pelo app
- auditoria: evento saneado `app_release_check`
- seed da migration inicial aponta para o arquivo fixo `sinalseguro_android.apk` e hash final acima

## Observacao

O fluxo iPhone/iOS permanece fora desta entrega e segue como pos-MVP.
