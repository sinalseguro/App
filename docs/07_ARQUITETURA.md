# 07 - Arquitetura

Responsaveis: Ada, Ritchie, Hedy, Katherine, Margaret e Kim

## Visao

O app e API-first. O alerta usa API, outbox local e retries. P2P fica como pesquisa futura/best-effort.

## Estado real em 2026-05-07

- Cliente API real: `src/services/apiClient.ts`, com base padrao `https://api.sinalseguro.com.br/api`.
- API publica validada nesta atualizacao com `health=ok` e readiness `database=ok`.
- Backend Django/DRF modular ja implementa auth, Google/Apple OIDC, devices, trusted_contacts, invitations, consents, emergency_sessions, key_envelopes, p2p_signals, audit, Admin e CRM inicial.
- Frente 1 de identidade social/sessao concluida em Android fisico e iOS logado. Proxima base arquitetural e Frente 1.1: chaves reais por dispositivo, prova de posse, rotacao, revogacao e perda de aparelho.
- Midia local criptografada existe em homologacao; envio remoto de midia, streaming e localizacao ao vivo continuam bloqueados.

## Camadas

- `app/`: rotas Expo Router.
- `src/components/`: componentes reutilizaveis.
- `src/design/`: tokens e tema.
- `src/features/`: dominios de produto.
- `src/services/`: API e integracoes.
- `src/storage/`: persistencia local.
- `src/security/`: armazenamento seguro e criptografia.
- `src/testing/`: checklists e helpers de teste.

## Dados

- React Query para chamadas API.
- Zod para validacao.
- Storage seguro para tokens/chaves.
- Outbox criptografada para alertas pendentes.
- Convites e pacotes locais usam `expo-secure-store` para conteudo sensivel pequeno, com indice sem dado sensivel em `AsyncStorage`.
- Pacote de emergencia registra hash SHA-256, localizacao pontual autorizada e plano de entrega API/P2P futuro.
- Area `Arquivos locais` lista pacotes do cofre local e mostra metadados de envio futuro sem expor coordenadas completas.

## API

Contrato inicial: `docs/api/openapi.yaml`. Estado consolidado do projeto: `../../../docs/tecnico/ESTADO_ATUAL_APP_BACKEND_2026-05-07.md`.

Dominios:

- `auth`
- `devices`
- `trusted_contacts`
- `invitations`
- `consents`
- `emergency_sessions`
- `key_envelopes`
- `p2p_signals`
- `audit_events`

Dominios ainda tratados como contrato/fase posterior para producao publica:

- `alerts` como fanout operacional completo.
- `delivery_attempts`.
- `media_assets` remotos.
- localizacao ao vivo.
- WebRTC/P2P critico.

## Regras

- Sem dado sensivel em logs.
- Sem token em URL.
- Idempotencia em alertas.
- Convite opaco e de uso unico.
- Midia apenas homologacao.
- Midia real permanece bloqueada no build publico; o pacote atual grava manifesto de midia bloqueada e nao captura camera/microfone.
