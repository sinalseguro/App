# Checkpoint - Frente 3 SOS e roteamento para anjos

Data: 2026-05-16
Coordenacao: Ze
Especialistas considerados: Katia, Fabio, Doneda, Cristine, Lina, Tarcila, Eliane e Lucena

## Objetivo

Iniciar a Frente 3 sem reabrir a Frente 1.3 como linha principal: transformar o SOS local ja existente em ocorrencia sincronizavel na EC2 e roteada para anjos aceitos, preservando o escopo Android-first do MVP.

## Escopo implementado

- API criou a fase canonica de ocorrencia em `EmergencySession.phase`.
- API adicionou `EmergencyRecipient` para representar o pedido entregue ao anjo autorizado.
- Criacao de `/api/emergency-sessions/` continua idempotente por `idempotency_key`.
- Ao criar ocorrencia, o backend resolve os destinatarios a partir dos anjos aceitos, com `can_receive_alerts=True`, conta propria e dispositivo ativo com chave publica.
- Convites pendentes, anjos revogados, anjos sem dispositivo ativo/chave publica e contatos sem aceite nao viram destinatarios.
- Anjo tem fila autenticada em `/api/emergency-sessions/received/`.
- Anjo pode marcar como visto, aceitar, recusar ou encerrar por `/api/emergency-sessions/{id}/respond/`.
- Se um anjo aceitar uma nova ocorrencia enquanto outra ainda esta aceita, a anterior e encerrada para preservar a regra de uma ocorrencia ativa por anjo.
- Encerramento/cancelamento da ocorrencia pelo originador encerra destinatarios vinculados.
- App Android passou a entender `recipient_count`, `phase`, `recipients` e a tela `Alertas recebidos`.
- Menu da Home ganhou atalho `Alertas`.
- O pacote local continua com outbox cifrada e sincronizacao posterior pela EC2; a autoridade do destinatario permanece no backend.

## Regras preservadas

- Nao foi liberada chamada P2P/audio/video.
- Nao foi liberado envio de midia para anjos.
- Nao foi liberada localizacao ao vivo.
- Nao houve integracao com conveniados/autarquias.
- Status publico e interface nao expõem token, telefone, e-mail bruto, midia, coordenada, payload sensivel ou link completo.
- iPhone/iOS permanece pos-MVP.

## Deploy API

- Backup logico pre-migracao criado na EC2:
  - `/opt/sinalseguro-api/backups/sinalseguro_prod_before_front3_20260516T043702Z.dump`
- Deploy executado por `infra/aws/deploy-api.sh`.
- Migration aplicada em producao:
  - `emergency.0002_add_sos_routing`
- Validacao pos-deploy:
  - `https://api.sinalseguro.com.br/api/health`: `ok`
  - `https://api.sinalseguro.com.br/api/health/ready`: `database=ok`
  - `sinalseguro-api`: `active`
  - `cereusia-crm`: `active`
  - `nginx -t`: aprovado
  - `cereusia.conf` preservado com hash `05a73c767a68612a5deb4e6a12a5ce23709c97f47f6bb3bfa652dc4408607c6c`

## Validacoes

- Backend:
  - `manage.py check`: aprovado
  - `manage.py test sinalseguro_api.tests.test_platform_base`: aprovado, 39 testes
  - `manage.py spectacular --validate`: aprovado, 1 warning conhecido de nome de enum
  - `manage.py makemigrations --check --dry-run`: aprovado
- App:
  - `npm run typecheck`: aprovado
  - `npm run lint`: aprovado
  - `npm test`: aprovado
  - `npm run build:android:debug:bundled`: aprovado
- APK debug bundled:
  - `apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`
  - SHA-256: `073c58443c2a3c9e4bd1db98015301f6751e61ac207788fc3d6a4c7202b9e81a`
  - Tamanho: `208M`

## Validacao fisica

- Android `0123456789ABCDEF`:
  - `adb install -r` aprovado;
  - app abriu sem crash;
  - deep link para `/alerta` foi bloqueado corretamente pelo gate legal/login porque a sessao local nao estava autenticada;
  - evidência visual: `docs/evidencias/android/2026-05-16-frente-3-alertas-012.png`;
  - logcat focado nao mostrou `FATAL EXCEPTION`, `AndroidRuntime` ou erro React Native relevante.
- Android `5686add7`:
  - `adb install -r` ficou preso;
  - repeticao com `adb install -r --no-streaming` tambem ficou presa;
  - processo de instalacao foi encerrado para nao bloquear a frente.

## Publicacao para teste manual

- Release Android privada publicada como `0.1.6`/`versionCode 8`.
- APK publico estavel: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk?v=0.1.6-20260516`
- SHA-256: `0b2fad382ae3f7054c0d1092ec2b2ed9414b4dc0f2c95c75d05f21761241ddf3`.
- API de update publicada com `app_releases.0007_update_android_release_20260516_v016`.
- Portal final: `/var/www/sinalseguro/releases/20260516T120523Z`.
- Incidente operacional: primeira tentativa de deploy do portal falhou por falta de espaco em disco; release parcial e releases antigas nao ativas foram removidas, preservando a release ativa anterior e uma release anterior para rollback.
- Validacao pos-publicacao: manifesto `0.1.6`, endpoint `app-releases/current` retorna `versionCode 8`, APK no servidor com hash esperado, `/baixar/android` HTTP 200, API health/ready ok, `sinalseguro-api` e `cereusia-crm` ativos, `nginx -t` aprovado e `cereusia.conf` preservado.

## Limites atuais

- A tela `Alertas recebidos` ainda precisa de teste visual autenticado em aparelho com login ativo.
- O fluxo completo entre dois Androids ainda precisa de aceite manual: originador aciona SOS, API cria ocorrencia, anjo visualiza em `Alertas`, aceita/recusa e originador confere sincronizacao.
- A release privada do portal ainda nao foi atualizada para esta fatia; o artefato atual e debug de homologacao.

## Proximo passo recomendado

Executar aceite manual supervisionado em dois Androids com login ativo:

1. confirmar que ambos estao na versao com `Alertas`;
2. no originador, acionar e encerrar SOS curto;
3. no anjo, abrir `Alertas`, ver o pedido da pessoa protegida e tocar em `Acompanhar`;
4. confirmar na API que a ocorrencia ficou `phase=accepted` e que o destinatario anterior e encerrado se o anjo aceitar outro pedido.
