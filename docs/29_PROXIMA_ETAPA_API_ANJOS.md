# 29 - Proxima etapa do plano global: API e Anjos

Data: 2026-05-05
Coordenacao: Ze e Cristine
Base revisada: `docs/00_PLANO_MOBILE.md`, `docs/01_CRONOGRAMA.md`, `docs/02_BACKLOG.md`, `docs/07_ARQUITETURA.md`, `docs/api/openapi.yaml` e `services/api/README.md`

## Conclusao da etapa atual antes da virada

A etapa mobile privada deve ser fechada antes de iniciar novo escopo:

1. Validar no browser os ultimos ajustes visuais da Home. Concluido em `http://localhost:8081/`.
2. Gerar novo APK privado, porque houve mudanca de codigo apos o APK instalado. Concluido com SHA-256 `daf5a22d163acc468a9470e1bd2178606f1b547c55bdf824a22eefe5d3f022d1`.
3. Instalar no Android conectado. Concluido via USB no Android `23129RA5FL`.
4. Validar abertura, Home e logs. Concluido; evidencias em `docs/evidencias/android/2026-05-05-apk-privado-final/`.
5. Registrar hash do APK, evidencias, timeline e memoria. Concluido.
6. Commitar e publicar o checkpoint. Pendente apenas se Roberto quiser fechar no remoto agora.

## Proxima fase segundo o plano

O plano global aponta a proxima fase como **API e Anjos**.

Referencias:

- Cronograma: Fase 4, `API e anjos`.
- Backlog: Epico D, itens `D01` a `D04`.
- Arquitetura: app API-first, outbox local com retry, P2P apenas futuro/best-effort.
- OpenAPI: dominios `auth`, `devices`, `trusted_contacts`, `invitations`, `consents`, `alerts`, `app_updates` e auditoria.
- Backend existente: `services/api` e um placeholder Django com `GET /api/health` e `GET /api/health/ready`.

## Escopo recomendado da fase

1. Evoluir `services/api` de placeholder para API Django modular.
2. Criar modelos e endpoints iniciais sem dados reais:
   - autenticacao propria e OIDC preparado;
   - registro de dispositivo;
   - consentimentos versionados;
   - convites opacos, expiraveis e de uso unico;
   - rede de anjos com estados `pendente`, `aceito`, `revogado`;
   - consulta de atualizacao do app.
3. Implementar cliente API mobile em `src/services/` usando o contrato OpenAPI.
4. Substituir mocks de convites/anjos por adaptadores locais que possam operar offline e sincronizar depois.
5. Manter alerta real, upload de midia, streaming e acionamento oficial bloqueados ate revisao juridica, RIPD/DPIA, retencao, RBAC e auditoria.

## Critérios de pronto

- API local sobe com banco isolado e health/readiness.
- Endpoints principais cobertos por testes de contrato e casos de erro.
- Nenhum segredo entra no Git.
- Logs sem tokens, coordenadas, payloads sensiveis, midia ou dados pessoais reais.
- Mobile compila e segue funcionando offline quando a API estiver indisponivel.
- Convite de anjo exige conta propria, aceite e consentimento; nao permite usar uma conta logada do navegador como segredo ou prova de identidade.
- Documentacao de seguranca e LGPD atualizada antes de qualquer dado real.

## Fora desta fase

- Convenio ou integracao oficial com orgaos publicos.
- Envio real de midia.
- Streaming ao vivo.
- P2P como caminho critico.
- Dados reais de vitimas, anjos ou atendimentos.
- Credenciais, tokens, secrets ou configuracoes privadas versionadas.

## Primeira tarefa tecnica da fase

Criar a base modular da API:

1. Apps Django: `accounts`, `devices`, `consents`, `trusted_contacts`, `invitations`, `alerts`, `audit`.
2. Serializacao e validacao alinhadas ao OpenAPI.
3. Testes de `health`, `ready`, criacao de convite, aceite controlado e registro de consentimento.
4. Cliente mobile minimo para `health` e `app_updates`, mantendo fallback local.
