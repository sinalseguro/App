# 07 - Arquitetura

Responsaveis: Ada, Ritchie, Hedy, Katherine, Margaret e Kim

## Visao

O app e API-first. O alerta usa API, outbox local e retries. P2P fica como pesquisa futura/best-effort.

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

## API

Contrato inicial: `docs/api/openapi.yaml`.

Dominios:

- `auth`
- `devices`
- `trusted_contacts`
- `invitations`
- `consents`
- `alerts`
- `delivery_attempts`
- `media_assets`
- `audit_events`

## Regras

- Sem dado sensivel em logs.
- Sem token em URL.
- Idempotencia em alertas.
- Convite opaco e de uso unico.
- Midia apenas homologacao.
