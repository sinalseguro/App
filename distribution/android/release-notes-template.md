# SinalSeguro Android - Release interna

Versao: `0.1.0-internal.1`
Data: `YYYY-MM-DD`
Responsavel: Kim
Gerencia: Cristine
Revisoes: Myers, Schneier, Doneda, Tarcila

## Escopo

- Build interno para homologacao controlada.
- App shell, rotas principais, QR e documentacao de distribuicao.
- Alerta apenas simulado.
- Sem dados reais, sem midia real, sem localizacao transmitida e sem acionamento de orgaos publicos.

## Validacoes obrigatorias

- `npm run assets:qr`
- `npm run release:android:readiness`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm audit --omit=dev --audit-level=high`

## Artefatos

| Arquivo | SHA-256 |
|---|---|
| `sinalseguro-android.apk` | `PREENCHER_APOS_BUILD` |

## Limites

- Instalador interno, nao producao publica.
- Uso somente por equipe e participantes autorizados.
- Nao substitui 190, 180 ou servicos oficiais.
- Revogar ou substituir imediatamente se houver exposicao indevida.
