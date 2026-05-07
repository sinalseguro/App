# 33 - Chaves reais por dispositivo

Data: 2026-05-07
Coordenacao: Ze e Cristine
Especialistas: Ada, Ritchie, Schneier, Doneda e Myers

## Objetivo

Substituir o vinculo/hash provisorio por um par de chaves real por dispositivo. A chave privada fica somente no aparelho, guardada no `SecureStore` nativo com `AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY`; a API recebe apenas chave publica, metadados saneados e prova de posse assinada.

## Decisoes tecnicas

- Algoritmo de assinatura: `ed25519-v1`.
- Formato da chave publica: `sseg-device-public-key-v1:ed25519:<base64url-raw-32>`.
- Hash publico de referencia: SHA-256 da string completa da chave publica.
- Prova de posse: assinatura Ed25519 de payload canonico com `purpose`, plataforma, versao do app, rotulo saneado, chave publica, nonce e horario de assinatura.
- Registro inicial usa `purpose=device.register`.
- Rotacao usa `purpose=device.rotate`.
- O hash legado pode ser enviado como `replaces_public_key_sha256` somente para migrar o mesmo dispositivo ja autenticado.

## API

- `POST /api/devices/` exige `public_key`, `key_algorithm=ed25519-v1` e `key_proof`.
- `POST /api/devices/{id}/rotate-key/` troca a chave publica apos prova com a nova chave.
- `POST /api/devices/{id}/mark-lost/` revoga o dispositivo por perda de aparelho.
- `POST /api/devices/{id}/revoke/` aceita motivo saneado de revogacao.

## Limites e seguranca

- A chave privada nao e enviada a API, documentacao, logs ou auditoria.
- A API nao retorna `public_key`, `push_token` nem `key_proof`.
- Logs e auditoria usam apenas metadados saneados, como plataforma e motivo de revogacao.
- Logout revoga a sessao e marca o dispositivo como revogado, mas nao apaga evidencias locais.
- Perda de aparelho revoga o dispositivo server-side; recuperacao de acesso deve passar por nova autenticacao e novo par de chaves.

## Validacoes

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado, incluindo teste de prova Ed25519.
- Backend: `manage.py check` aprovado.
- Backend: `manage.py test sinalseguro_api.tests.test_platform_base` aprovado com rejeicao de assinatura invalida, rotacao, perda e migracao de hash legado.
- Deploy API: aprovado.
- Producao: migration `devices.0002_device_key_algorithm_device_key_registered_at_and_more` aplicada.
- Producao: `sinalseguro-api` ativo, `cereusia-crm` ativo, `nginx -t` aprovado e `cereusia.conf` intacto.
- API publica: `health=ok`, readiness `database=ok` e schema expondo `rotate-key`, `mark-lost`, `key_proof` e `ed25519-v1`.

## Homologacao fisica pos-deploy

Android concluido em 2026-05-07:

- APK privado recompilado, instalado no Android fisico e aberto sem crash;
- `Configuracoes > Login` confirmou sessao conectada, API configurada e dispositivo autenticado registrado;
- `Testar API` no app fisico retornou `API SinalSeguro online: ok.`;
- `Validar sessao` executou bootstrap autenticado e retornou `Sessao SinalSeguro validada. Dispositivo registrado e consentimentos sincronizados.`;
- consulta saneada na API de producao confirmou dispositivo Android ativo com `key_algorithm=ed25519-v1`, chave publica presente, hash publico presente e `key_registered_at` preenchido;
- varredura de logcat do processo nao encontrou padroes de e-mail, Bearer, ID token, refresh token, chave privada ou `key_proof`.

iOS fica para validacao posterior, conforme decisao operacional do usuario.

## Fora de escopo nesta frente

- Anjos reais.
- Chamada audio/video.
- Midia remota.
- Localizacao em tempo real.
- Conveniados ou orgaos publicos.
