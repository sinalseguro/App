# Checkpoint - Android 0.1.4 e sincronizacao de anjos

Data: 2026-05-16
Responsavel: Ze
Especialistas: Kátia, Fábio, Cristine, Doneda, Tarcila, Lina, Eliane e Tereza

## Objetivo

- Fazer o originador enxergar no app quando o convite foi aceito em outro aparelho.
- Deixar claro para o recebedor que ele e anjo de uma pessoa especifica.
- Confirmar que um usuario que atua como anjo tambem pode solicitar seus proprios anjos quando seu perfil permite.
- Preservar minimo de dados, auditoria suficiente e interface simples.

## Implementado

- `acceptBackendInvitation()` sincroniza o perfil ativo antes de registrar dispositivo e aceitar o token.
- `TrustedContactSerializer` expõe `contact_display_name` saneado para que o originador tenha fallback visual mesmo se a consulta de relacionamentos falhar.
- Auditoria de `invitation_accept` registra `trusted_contact_id`, `invitation_id`, `owner_id` e `accepted_by_id`, sem token claro, telefone, e-mail bruto, midia ou localizacao.
- `Anjos de confianca` mostra resumo principal na tela, renomeia `Anjos` para `Meus anjos` e mantém `Sou anjo`.
- A tela sincroniza ao abrir, ao voltar para foreground e a cada 15s enquanto estiver aberta.
- Convites locais ligados a contato aceito/revogado deixam de aparecer como pendencia.
- `Ver meus vinculos`, apos aceitar convite, abre diretamente o painel `Sou anjo de`.

## Artefato

- Versao Android: `0.1.4`
- VersionCode: `6`
- APK local: `android/app/build/outputs/apk/debug/app-debug.apk`
- APK distribuicao: `distribution/android/out/sinalseguro-android.apk`
- Link portal: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk?v=0.1.4-20260516`
- SHA-256: `93b06f022aac21ddf296eeaa34fc126ed353341c0cda7ebee311203d7ed05139`

## Validacoes

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: aprovado.
- `npm run build:android:debug:bundled`: aprovado.
- Backend: `manage.py check`, `makemigrations --check --dry-run` e 36 testes em `sinalseguro_api.tests.test_platform_base`: aprovados.
- `aapt dump badging`: `versionCode='6'`, `versionName='0.1.4'`, `targetSdkVersion='36'`.
- API publicada na EC2 e validada em producao: `version=0.1.4`, `version_code=6`, `sha256=93b06f022aac21ddf296eeaa34fc126ed353341c0cda7ebee311203d7ed05139`.
- Portal publicado em `/var/www/sinalseguro/releases/20260516T015828Z`.
- Link `/baixar/android`, manifesto `installers.json`, download do APK e SHA-256 conferidos em producao.
- EC2 validada: `sinalseguro-api=active`, `cereusia-crm=active`, `nginx -t` aprovado, `cereusia.conf` preservado.

## Gates pendentes antes do aceite final do Roberto

- Validar visualmente no Android fisico as telas `Meus anjos`, `Sou anjo de`, `Convites` e `Convite recebido`.
- Confirmar no aparelho originador que o aceite aparece sem reiniciar o app, usando sincronizacao automatica ou botao `Atualizar`.

## Limite operacional atual

- `adb devices -l` nao listou aparelho conectado nesta rodada.
- `adb mdns services` chegou a listar um servico Wi-Fi, mas `adb connect` retornou `Connection refused` e o servico deixou de aparecer em seguida.
- O proximo teste fisico deve instalar/atualizar pelo portal e repetir o aceite de convite entre dois Androids logados para confirmar a sincronizacao visual dos dois lados.
