# 29 - API e Anjos: estado real e proxima validacao

Data original: 2026-05-05
Atualizacao de estado real: 2026-05-07
Coordenacao: Ze e Cristine
Base revisada: `docs/00_PLANO_MOBILE.md`, `docs/01_CRONOGRAMA.md`, `docs/02_BACKLOG.md`, `docs/07_ARQUITETURA.md`, `docs/api/openapi.yaml`, `services/api/README.md` e `../../../docs/tecnico/ESTADO_ATUAL_APP_BACKEND_2026-05-07.md`.

## Mudanca de status

Este documento nasceu como plano para iniciar a fase "API e Anjos". Em 2026-05-07, a situacao real mudou: a API Django ja nao e placeholder e a integracao mobile ja existe em base controlada.

O conteudo abaixo substitui a leitura antiga de "proxima fase = construir API do zero". A leitura correta agora e:

- API modular ja implementada/publicada;
- cliente API mobile ja implementado;
- anjos/convites ja usam API quando ha sessao autenticada;
- a Frente 1 foi concluida para login/sessao/dispositivo;
- a proxima frente viavel e `Frente 1.1 - chaves reais por dispositivo`;
- anjos/convites ficam como Frente 2, depois de chaves reais, midia critica e da Frente 1.3 de perfis/familia/maioridade.

## Reorganizacao global - 2026-05-07

Documento canonico: `../../../docs/tecnico/FRENTES_GLOBAIS_APP_BACKEND_MIDIA_ANJOS.md`.

Regras novas:

- pais/responsaveis podem adicionar filhos menores como protegidos;
- filhos menores nao adicionam anjos, conveniados ou terceiros;
- filhos menores nao sao anjos ate maioridade e fluxo proprio;
- adulto pode ser anjo de varios usuarios, mas so atende uma ocorrencia SOS ativa por vez;
- a pessoa protegida pode chamar anjos por audio/video; localizacao e canal separado;
- anjo em segundo plano recebe chamada/alerta e abre camera/microfone apenas apos aceitar;
- modulo atual de midia criptografada por JS/Base64/loopback nao deve ser base final para chamada longa ou conveniados.

Sequencia atual:

1. Frente 1.1 - chaves reais por dispositivo. Status: em execucao na sessao `019e0346-97cd-7153-87ba-730bd455b5db`.
2. Frente 1.2 - midia critica, gravacao, criptografia, player e performance.
3. Frente 1.3 - perfis, familia, maioridade e papeis.
4. Frente 2 - anjos e convites.
5. Frente 3 - ocorrencia SOS e roteamento.
6. Frente 4 - chamada audio/video.
7. Frente 5 - midia operacional e nuvem cifrada.
8. Frente 6 - localizacao em tempo real.
9. Frente 7 - conveniados e orgaos.

## Estado real app/backend

- API publica: `https://api.sinalseguro.com.br/api`.
- Health publico validado: `ok`.
- Readiness publico validado: `database=ok`.
- Backend Django/DRF implementa `accounts`, `devices`, `trusted_contacts`, `invitations`, `consents`, `emergency`, `audit` e `crm`.
- Endpoints ativos incluem `auth/register`, `auth/login`, `auth/google`, `auth/apple`, `auth/refresh`, `auth/logout`, `auth/me`, `devices`, `trusted-contacts`, `invitations`, `consents`, `emergency-sessions`, `key-envelopes`, `p2p-signals`, `audit-events`, `admin` e `crm`.
- App mobile possui `src/services/apiClient.ts` com metodos para autenticacao, sessao, dispositivo, consentimentos, anjos, convites, emergencia, envelopes e sinalizacao.
- Tela de Anjos separa anjos autorizados, convites reais de API e pre-convites locais.
- Convite real exige sessao propria; pre-convite local continua como fallback de baixa conectividade/pre-auth.

## Estado apos Frente 1

O bloqueio da Frente 1 nao era falta de API. Depois da etapa historica de `Custom URI scheme`, o Android passou para Google Sign-In nativo e a Frente 1 foi concluida em Android fisico e iOS logado.

Validado:

1. Login Google real no Android fisico.
2. `POST /api/auth/google`.
3. Emissao de JWT interno.
4. Persistencia segura da sessao no SecureStore.
5. `GET /api/auth/me`.
6. Registro autenticado em `/api/devices/`.
7. Logout com revogacao de refresh token.
8. Sessao unica entre iOS e Android, com bloqueio claro do segundo dispositivo para a mesma conta.

## Proxima validacao obrigatoria

1. Frente 1.1: gerar par de chaves real por dispositivo.
2. Provar posse da chave privada sem expo-la.
3. Assinar operacoes criticas selecionadas.
4. Validar rotacao, revogacao e perda de aparelho.
5. Revalidar convite/aceite/revogacao de anjo somente depois das chaves reais.
9. Criar convite real de anjo com conta autenticada.
10. Aceitar convite com conta/dispositivo proprio do anjo.
11. Revogar anjo e verificar auditoria/estado.

## Proximo bloco tecnico apos login

- Substituir vinculo/hash provisório por par de chaves real do dispositivo.
- Gerar chave privada local sem sair do aparelho.
- Publicar apenas chave publica/hash no backend.
- Implementar assinatura/verificacao, rotacao, revogacao e perda de aparelho.
- Criar envelopes de chave por anjo autorizado.
- Validar `/emergency-sessions/` com idempotency key e reenvio seguro.

## Fora desta validacao

- Convenio ou integracao oficial com orgaos publicos.
- Envio real de midia.
- Streaming ao vivo.
- Localizacao ao vivo.
- P2P como caminho critico.
- Dados reais de vitimas, anjos ou atendimentos.
- Credenciais, tokens, secrets ou configuracoes privadas versionadas.

## Criterios de pronto

- `npm run typecheck`, `npm run lint` e `npm test` aprovados.
- API publica com `health=ok` e readiness `database=ok`.
- Backend local revalidado quando `services/api/.venv` for restaurado.
- Nenhum segredo entra no Git.
- Logs sem tokens, coordenadas, payloads sensiveis, midia ou dados pessoais reais.
- Mobile continua funcionando offline quando a API estiver indisponivel.
- Convite de anjo exige conta propria, aceite, dispositivo e consentimento.
- Documentacao de seguranca/LGPD atualizada antes de qualquer dado real.
