# Checkpoint Etapa 1.1 - Testes de contrato API e hardening

Data: 2026-05-17
Coordenacao: Ze
Especialistas: Cristine, Eliane, Katia, Fabio e Lucena
Status: etapa concluida localmente, sem alteracao de UX, backend, portal ou release publica.

## Objetivo

Fechar o gate de seguranca/QA aberto apos a separacao do `apiClient` por dominios, adicionando testes de contrato para sessao, refresh, logout, update publico, P2P/envelope e tratamento de erro sem expor dados sensiveis.

## Implementacao

- `src/services/api/core.ts` passou a receber `ApiSessionSecretStore` por injecao.
- `src/services/api/sessionStore.ts` concentra a implementacao real em `SecureStore`, mantendo a chave `api.session.v1`.
- `src/services/apiClient.ts` injeta `secureSessionStore` na fachada publica `SinalSeguroApiClient`.
- `src/services/api/authClient.ts` usa `retryOnUnauthorized: false` no logout para nao renovar access token durante saida.
- `src/services/api/core.ts` saneia `ApiRequestError.details` antes de propagar erro para consumidores.
- `src/services/api/utils.ts` carrega `Platform` por `require` dentro da funcao para permitir teste Node do cliente API sem inicializar `react-native`.
- `scripts/api-client-contract.test.ts` adiciona teste de contrato isolado com store de sessao em memoria e `fetch` controlado.
- `package.json` inclui `npm run test:api-client` dentro de `npm test`.
- `scripts/smoke-test.mjs` cobre todos os modulos do cliente API apos a refatoracao.

## Contratos Preservados

- Fachada publica `@/services/apiClient`.
- Metodos e tipos exportados por `SinalSeguroApiClient`.
- Sessao real no `SecureStore` nativo.
- Update publico sem `Authorization`.
- P2P/envelope somente com sessao autenticada.
- Backend como autoridade para vinculos e estados juridicamente relevantes.
- EC2/API como plano de controle/sinalizacao/auditoria; midia bruta fora do backend.

## Gate de Seguranca

- Nenhum novo `console.` em `src/services/api/`, `src/services/apiClient.ts` ou `src/services/api/sessionStore.ts`.
- `Authorization`, access token, refresh token, `id_token`, token de convite, segredo, senha, `encrypted_key`, payload P2P, SDP e ICE candidate sao redigidos em `ApiRequestError.details`.
- Mensagens de erro continuam uteis para UI, mas nao ecoam valores sensiveis de token ou payload.
- Logout limpa a sessao local mesmo quando a API remota falha ou retorna `401`.
- Refresh invalido limpa sessao local.

## Validacoes

- `npm run test:api-client`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto condicionado pela pendencia ambiental conhecida de Node local.
- Varredura `rg -n "console\\." src/services/api src/services/apiClient.ts src/services/api/sessionStore.ts`: sem ocorrencias.
- Build Android debug bundled `arm64-v8a`: aprovado.
- APK local gerado: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256 do APK local: `a6c5fd8cb4947498c9b79087b699970df18edbde1e7f6ae36e7c25934404c69a`.

## Limites

- Sem alteracao de layout, textos publicos, fluxo SOS/WebRTC, portal, backend ou publicacao de release.
- Sem teste fisico Android nesta fatia, porque a mudanca foi interna ao cliente API/testes.
- Build completo multi-ABI nao foi repetido nesta etapa por limite de espaco local; o recorte `arm64-v8a` passou para validar compilacao Android real.

## Proxima Recomendacao

Seguir a refatoracao incremental para o proximo hotspot somente depois deste checkpoint Git. A ordem recomendada e extrair a logica de SOS/live-call em partes pequenas, mantendo:

- uma fachada compativel para consumidores atuais;
- testes antes/depois da extracao;
- sem mudanca de UX/IX;
- sem mudar contratos backend;
- sem publicar release ate uma fatia funcional estar validada.
