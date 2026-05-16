# Checkpoint Android 0.1.5 - Convites validados no backend

Data: 2026-05-16
Coordenacao: Ze
Especialistas considerados: Katia, Fabio, Doneda, Cristine, Eliane, Lina e Tarcila

## Objetivo

Corrigir o fluxo em que um convite recebido aparecia como invalido no aparelho do anjo, mas a interface ainda deixava a jornada ambigua para o usuario.

## Causa identificada

O link compartilhado podia carregar um token local/antigo que nao existia como convite disponivel no backend de producao. Nessa condicao, o servidor respondia corretamente que o convite estava indisponivel, mas o app ainda precisava bloquear o aceite de forma mais clara e impedir novos compartilhamentos sem sessao autenticada.

## Implementado

- `createLocalInvitation` agora exige sessao Google/API e so libera compartilhamento apos criar convite no backend.
- A tela `Convite recebido` valida o token em `POST /api/invitations/status` antes de permitir aceite.
- Convites indisponiveis limpam o token pendente local e desativam `Aceitar como anjo`.
- A interface passa a mostrar `Convite indisponivel` e `Aceite bloqueado` quando o link nao esta disponivel no servidor.
- A tela `Anjos de confianca` fecha o modal de compartilhamento quando a sessao expira e orienta o usuario a entrar com Google antes de criar convite seguro.
- App sincronizado para Android `0.1.5`, `versionCode 7`.

## Artefato

- APK local: `android/app/build/outputs/apk/debug/app-debug.apk`
- APK de distribuicao local: `distribution/android/out/sinalseguro-android.apk`
- Nome publico no portal: `sinalseguro_android.apk`
- Link direto versionado: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk?v=0.1.5-20260516`
- SHA-256: `4518789cbcc844f5f8ff87dcd13009f00f7ffbc252d5cea01e2ec50855b239a2`

## Validacoes locais

- `npm run lint`: aprovado
- `npm run typecheck`: aprovado
- `npm test`: aprovado
- `npm run private:android:readiness`: aprovado para build privado, mantendo a pendencia conhecida de Node local 20 em vez de Node 22 para release publico
- `npm run build:android:debug:bundled`: aprovado
- `aapt dump badging`: `versionCode='7'`, `versionName='0.1.5'`, `targetSdkVersion='36'`

## Validacao fisica Android

Dispositivos conectados:

- `0123456789ABCDEF`: instalado `versionName=0.1.5`, `versionCode=7`
- `23129RA5FL`: instalado `versionName=0.1.5`, `versionCode=7`

Teste executado:

- abertura de link de convite inexistente no backend;
- confirmacao visual de `Convite indisponivel`;
- confirmacao visual de `Aceite bloqueado`;
- botao `Aceitar como anjo` permaneceu desativado.

Evidencias:

- `docs/evidencias/android/2026-05-16-convite-backend-015/android-012-convite-indisponivel.png`
- `docs/evidencias/android/2026-05-16-convite-backend-015/android-231-convite-indisponivel.png`

## Pendencia de aceite real

O teste visual do erro anexado foi concluido nos dois aparelhos. O aceite real entre dois usuarios deve ser repetido com novo convite criado na `0.1.5`, apos login Google valido nos dois Androids, para confirmar a propagacao final do vinculo em `Meus anjos` e `Sou anjo de`.

Passos manuais:

1. No aparelho que convida, entrar com Google e abrir `Anjos`.
2. Criar novo convite; o app so deve compartilhar se o backend criar o token.
3. No aparelho anjo, abrir o link, entrar com a propria conta Google se necessario e aceitar.
4. No aparelho anjo, conferir `Sou anjo de`.
5. No aparelho que convidou, abrir `Anjos` ou tocar em atualizar e conferir `Meus anjos`.

## Publicacao

- API publicada com migration `app_releases.0006_update_android_release_20260516_v015`.
- Portal publicado em `/var/www/sinalseguro/releases/20260516T034600Z`.
- `GET /api/app-releases/current?platform=android&version_code=6` retorna `0.1.5`, `versionCode 7` e SHA-256 esperado.
- `https://www.sinalseguro.com.br/downloads/installers.json` retorna manifesto `0.1.5`.
- APK baixado do portal conferido com SHA-256 `4518789cbcc844f5f8ff87dcd13009f00f7ffbc252d5cea01e2ec50855b239a2`.
- `sinalseguro-api` e `cereusia-crm` ativos; `nginx -t` aprovado; `/etc/nginx/sites-available/cereusia.conf` preservado.
