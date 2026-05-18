# Checkpoint Etapa 1 - apiClient Por Dominios

Data: 2026-05-17
Coordenacao: Ze
Especialistas: Katia, Fabio, Cristine, Eliane e Lucena
Status: etapa concluida localmente, sem alteracao de comportamento esperado.

## Objetivo

Iniciar a refatoracao segura do app mobile separando o `apiClient` por dominios de negocio, sem alterar UX, rotas, contratos publicos, fluxo SOS/WebRTC, backend, portal ou release Android.

## Arquitetura Aplicada

- `src/services/apiClient.ts`: fachada publica compativel com os imports existentes.
- `src/services/api/contracts.ts`: schemas Zod, tipos publicos e inputs da API.
- `src/services/api/core.ts`: base URL, sessao segura, `ApiRequestError`, request comum, refresh unico e limpeza de sessao.
- `src/services/api/authClient.ts`: login, Google, Apple, logout e `/auth/me`.
- `src/services/api/devicesClient.ts`: dispositivos, rotacao/revogacao de chave e consentimentos.
- `src/services/api/profilesClient.ts`: perfil de protecao.
- `src/services/api/contactsClient.ts`: anjos, convites, aceite e relacionamentos.
- `src/services/api/emergencyClient.ts`: sessoes SOS, destinatarios, envelopes, sinalizacao P2P e marcadores de auditoria.
- `src/services/api/releasesClient.ts`: consulta publica de versao disponivel para atualizacao do app.
- `src/services/api/utils.ts`: plataforma, datas e conversao de payloads.

## Contratos Preservados

- `apiClient`, `SinalSeguroApiClient`, `ApiRequestError`, `apiConfig` e `getHealth`.
- Todos os `export type` usados pelo app.
- Todos os metodos publicos ja existentes em `SinalSeguroApiClient`.
- Chave local da sessao: `api.session.v1`.
- Consulta publica de update sem JWT.
- Backend como autoridade para vinculos juridicamente relevantes.
- EC2/API como plano de controle, sinalizacao e auditoria saneada; midia bruta continua fora do backend.

## Gate de Seguranca

Revisao direcionada ao patch confirmou:

- nenhum novo `console` em `src/services/api/` ou `src/services/apiClient.ts`;
- tokens, `Authorization`, `refresh`, `id_token`, token de convite, payload P2P e envelope cifrado permanecem em campos de transporte, sem persistencia nova e sem log novo;
- refresh de token continua com uma unica retentativa;
- falha de refresh continua limpando sessao local;
- logout continua limpando sessao no `finally`;
- erros continuam preservando mensagem util sem imprimir payload sensivel.

## Validacoes

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: aprovado com a pendencia ambiental conhecida de Node local para release publico.
- `git diff --check`: aprovado.
- `npm run build:android:debug:bundled`: aprovado.

Observacao: a primeira tentativa de build Android falhou em `:app:mergeProjectDexDebug` por arquivos duplicados regeneraveis `* 2.*` dentro de `android/app/build/intermediates`. A limpeza removeu somente esses artefatos gerados e a segunda tentativa concluiu com `BUILD SUCCESSFUL`.

## Limites

- Sem teste fisico Android nesta fatia, porque nao houve mudanca de UX, WebRTC, midia ou fluxo operacional.
- Sem publicacao de release.
- Sem deploy backend.
- Sem alteracao de identidade visual.
- Sem alteracao de dados, migracoes ou endpoint.

## Proxima Etapa Recomendada

Antes de seguir para extracoes maiores de SOS/live-call, adicionar testes unitarios focados para `core`, `auth` e `releases`, cobrindo:

- sessao corrompida;
- 401 com refresh valido;
- 401 com refresh invalido;
- logout com falha remota;
- update publico sem sessao;
- erro de API com detalhes de serializer.
