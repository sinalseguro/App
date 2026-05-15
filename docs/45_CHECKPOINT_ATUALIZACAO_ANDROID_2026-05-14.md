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
- instalacao via USB/ADB: aprovada manualmente no Android
- abertura do link de download no navegador do aparelho: aprovada manualmente
- visual do painel de atualização no Android fisico: aprovado manualmente
- validacao fisica complementar em 2026-05-14 21:53 no Android `23129RA5FL`: app instalado `versionName=0.1.1`, `versionCode=3`, tela `Anjos de confianca` com perfil `Adulto protegido`, convite permitido, 2 convites registrados e atualizacao finalizada com `Anjos atualizados.`
- convites visualizados no aparelho: 1 convite validado pela API e 1 pre-convite local, ambos marcados como `COMPARTILHADO`, sem exposicao de evidencia, localizacao ou dado sensivel na tela de convite.
- API publica `https://api.sinalseguro.com.br/api/health` e readiness `https://api.sinalseguro.com.br/api/health/ready`: `ok`, com banco `ok`.
- logcat saneado do acionamento `Atualizar`: sem `AndroidRuntime`, `ReactNativeJS Error`, `FATAL EXCEPTION`, ANR ou crash do processo SinalSeguro.
- runner local Django pelo venv do repositorio ficou preso na fase de importacao/preparo, sem saida util; nao foi usado como gate nesta rodada porque o checkpoint anterior ja tinha testes focados aprovados com venv temporaria em `/tmp`.
- deep link direto para `sinalseguro://contatos` sem sessao visivel manteve o app no gate `Preparar acesso`, confirmando que o acesso direto respeita login, consentimentos e permissoes.
- login Google no Android fisico concluiu com a conta do dispositivo; apos retorno ao app, `Criar convite` passou de `Local` para `API`, mantendo `Perfil: Adulto protegido`, `Estado: Aguardando aceite`, `Convites: 2 item` e `Anjos atualizados.`

## API e banco

- app Django novo: `app_releases`
- endpoint: `GET /api/app-releases/current?platform=android&version=0.1.1&version_code=3`
- autenticacao: JWT obrigatorio pelo app
- auditoria: evento saneado `app_release_check`
- seed da migration inicial aponta para o arquivo fixo `sinalseguro_android.apk` e hash final acima

## Observacao

O fluxo iPhone/iOS permanece fora desta entrega e segue como pos-MVP.
Na validacao ADB desta retomada apareceu apenas um Android conectado; a validacao entre dois aparelhos fisicos segue dependente de o segundo dispositivo voltar a aparecer como `device`.

## Complemento 2026-05-15 - Convite web/app e portal publicado

Status: codigo, build, API e portal publicados; validacao fisica em aparelho ficou bloqueada pela ausencia de device ADB nesta retomada.

Implementado:

- convites novos usam `https://www.sinalseguro.com.br/convite#convite=<codigo>` para reduzir exposicao do codigo em caminho, referrer e logs;
- API publica `POST /api/invitations/status` retorna apenas disponibilidade minima, sem expor expiração, contato ou metadados;
- revogacao de contato invalida convites pendentes ligados ao contato;
- app captura convite pendente antes do gate de login/permissoes e salva localmente com armazenamento cifrado temporario;
- app limpa o convite pendente depois de aceite bem-sucedido;
- Android recebeu App Links para `https://www.sinalseguro.com.br/convite`;
- portal recebeu pagina publica `/convite`, `assetlinks.json`, redirecionamento legado `/convite/<codigo>` e release Android sincronizada.

Artefato Android:

- caminho local: `distribution/android/out/sinalseguro-android.apk`;
- portal: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk?v=0.1.1-20260515`;
- SHA-256: `dbfe42edce5f8ad9197aa105ea45bd9113b74bfb6f2f5e2a14dd9586946f8fff`;
- tamanho servido em producao: `267167830` bytes.
- release portal final: `/var/www/sinalseguro/releases/20260515T124519Z`;
- JS publico do portal: `/assets/js/portal-interactions-2026-05-15-convite.js`.

Validacoes:

- mobile: `npm run typecheck`, `npm run lint`, `npm test` e `npm run build:android:private` aprovados;
- backend: `py_compile` dos arquivos alterados, `manage.py check`, `migrate` e `collectstatic` aprovados na EC2;
- portal: `npm run validate` aprovado em build isolado em `/tmp`;
- producao: `/convite` HTTP 200, `/convite/teste-saneado` HTTP 302 para `/convite#convite=teste-saneado`, `installers.json`, `checksums.txt`, `assetlinks.json`, APK HTTP 200 e API publica de status de convite HTTP 200;
- Nginx: `nginx -t` aprovado e hash de `/etc/nginx/sites-available/cereusia.conf` preservado.
- download sem app instalado: o portal preserva o convite na sessao do navegador e mostra retorno ao convite em `/baixar`/`/baixar/android`, para a pessoa instalar e abrir novamente o convite no app sem expor o codigo em link estatico.

Bloqueio fisico:

- `adb devices -l` nao listou aparelho;
- `adb mdns services` chegou a anunciar `192.168.0.5:37391`, mas `adb connect` recebeu `Connection refused`;
- envio real por WhatsApp/SMS nao foi executado nesta retomada porque nao havia controle ADB confiavel do smartphone;
- proximo gate fisico: reconectar ADB, instalar a APK acima, abrir um link `/convite#convite=<codigo>` no aparelho, validar captura do convite antes/depois de login e aceitar o vinculo em segundo aparelho.

## Retomada 2026-05-15 - Convite por SMS e backend

Status: validacao parcial, com bloqueio operacional no SMS e no segundo Android.

Executado:

- ADB continuou listando apenas o Android `23129RA5FL`; o segundo aparelho ainda nao apareceu como `device`.
- API de producao respondeu `health/ready` com `database=ok`.
- Backend real confirmou convites e contatos recentes sem expor dados pessoais: todos os convites recentes permaneciam `pending` e nenhum tinha `accepted_by`.
- Contatos recentes estavam com `can_receive_media=False` e `can_receive_location=False`, preservando o bloqueio de escopos sensiveis nesta etapa.
- Auditoria de convite na EC2 manteve `ip_hash` e `user_agent_hash`, sem metadata sensivel.
- Foi criado convite homologatorio adicional para envio por SMS, com token claro usado apenas no compositor do aparelho e sem registro em docs.
- O Google Messages abriu o rascunho com o convite, mas retornou falha de envio no aparelho; a consulta saneada a `content://sms/sent` nao confirmou SMS enviado com SinalSeguro.
- Temporarios locais com corpo de SMS, telefone ou token foram removidos.

Bloqueios:

- Validacao fim a fim entre dois aparelhos depende do segundo Android aparecer em ADB ou do destinatario abrir o convite recebido por outro canal.
- Envio por SMS precisa ser confirmado manualmente no aparelho, pois a automacao ADB nao conseguiu concluir o disparo no Google Messages.
- Runner local Django pelo venv do repositorio voltou a ficar preso sem saida util; foi encerrado para nao deixar processo pendurado.

Complemento de especialistas:

- Katia/Lina: o app usa o compartilhamento nativo do Android; o SinalSeguro cria o convite seguro, mas a entrega por SMS fica sob responsabilidade do Google Messages e da operadora. Portanto, falha no disparo do SMS nao invalida a criacao do convite na API.
- Eliane/Cristine: a arquitetura de backend confirma token opaco, armazenamento apenas do hash, unicidade, aceite transacional com bloqueio de reuso, impedimento de autoaceite, exigencia de dispositivo ativo com chave publica e bloqueio atual de midia/localizacao para contatos confiaveis.
- O aceite fisico ainda precisa ser validado em dois Androids: aparelho A cria o convite, aparelho B entra com conta propria, registra dispositivo, aceita o convite e uma segunda tentativa com o mesmo link deve falhar.
- Proxima evidencia deve ser saneada: nao registrar telefone, token claro, link completo de convite ou dados pessoais em imagem, log, doc ou memoria.

## Evidencias complementares

- `docs/evidencias/android/2026-05-14-dois-dispositivos-convites/05-convites-modal-api-local-compartilhado.png`
- `docs/evidencias/android/2026-05-14-dois-dispositivos-convites/06-anjos-atualizar-sem-erro.png`
- `docs/evidencias/android/2026-05-14-dois-dispositivos-convites/07-logcat-refresh-redacted.txt`
- `docs/evidencias/android/2026-05-14-dois-dispositivos-convites/08-ui-summary-after-refresh.txt`
- `docs/evidencias/android/2026-05-14-dois-dispositivos-convites/09-deeplink-bloqueado-pelo-login-gate.png`
- `docs/evidencias/android/2026-05-14-dois-dispositivos-convites/10-login-google-concluido-criar-convite-api.png`
- `docs/evidencias/android/2026-05-14-dois-dispositivos-convites/11-logcat-post-login-redacted.txt`
- `docs/evidencias/android/2026-05-14-dois-dispositivos-convites/12-ui-summary-post-login-api.txt`

## Complemento 2026-05-15 - visibilidade de vinculo anjo/protegido

Status: ajuste implementado e publicado no backend; app Android recompilado, instalado no aparelho visivel e validado visualmente ate o ponto anterior ao aceite real.

Implementado:

- `GET /api/trusted-contacts/relationships` lista vinculos aceitos/revogados para os dois lados da relacao;
- `POST /api/invitations/accept` retorna o relacionamento com papel do usuario autenticado;
- a resposta usa nomes publicos de exibicao e nao inclui e-mail bruto, telefone, token claro, chave, evidencia, localizacao ou midia;
- `Anjos de confianca` mostra `Anjos` para quem o usuario autorizou e `Sou anjo` para quem convidou o usuario;
- `Convite recebido` confirma `Voce agora e anjo de ...` depois do aceite e aponta para `Ver meus vinculos`;
- o originador passa a ver o contato aceito no painel `Anjos autorizados`, com nome publico do usuario que aceitou.

Validacoes:

- backend local: testes Django, `check`, `makemigrations --check --dry-run` e schema OpenAPI aprovados;
- mobile local: `typecheck`, `lint`, `npm test` e `git diff --check` aprovados;
- deploy EC2: `sinalseguro-api` reiniciado com sucesso, `cereusia-crm` permaneceu ativo, `nginx -t` aprovado e hash de `cereusia.conf` preservado;
- Android fisico: APK debug `arm64-v8a` instalado, login Google concluiu, tela `Anjos de confianca` mostrou o novo tile `Sou anjo`;
- producao: consulta saneada confirmou que o convite visivel ainda estava `pending`, sem `contact_user`/`accepted_at`.

Bloqueio:

- o aceite entre dois aparelhos ainda nao foi concluido nesta rodada porque somente um Android apareceu por ADB e, depois, a depuracao Wi-Fi/USB caiu;
- SMS/notification acessiveis por ADB nao continham link de convite SinalSeguro;
- como o token claro e de uso unico e nao fica armazenado no backend, o teste fisico deve ser retomado abrindo no aparelho anjo o link originalmente recebido ou gerando novo convite pelo originador.

Evidencias saneadas:

- `docs/evidencias/android/2026-05-15-convite-anjo-relacionamento/01-contatos-sou-anjo-tile.png`
- `docs/evidencias/android/2026-05-15-convite-anjo-relacionamento/02-convites-pendente.png`
