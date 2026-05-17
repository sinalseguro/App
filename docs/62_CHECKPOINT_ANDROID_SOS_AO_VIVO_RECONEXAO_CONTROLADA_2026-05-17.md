# Checkpoint Android - SOS ao vivo com reconexao controlada

Data: 2026-05-17
Coordenacao: Ze
Especialistas: Katia, Fabio, Doneda, Cristine, Lina, Tarcila, Eliane e Lucena

## Objetivo

Evitar que uma oscilacao curta de rede transforme imediatamente a chamada SOS ao vivo em falha final. A UX passa a informar tentativa de reconexao e a API registra eventos saneados, mantendo SDP, ICE, tokens, caminhos locais e midia fora da auditoria permanente.

## Implementado nesta subetapa

- O estado da chamada ganhou `reconnecting`.
- Ao receber `disconnected`, o app mostra `Reconectando chamada` e mensagem simples: `Tentando restabelecer a chamada. O pedido continua ativo.`
- O app agenda uma janela curta de recuperacao antes de marcar falha final.
- Se a conexao voltar, o app registra evento saneado de reconexao bem-sucedida.
- Se a conexao nao voltar no prazo ou entrar em `failed`, o app registra falha de reconexao e informa que o pedido continua ativo.
- A API passou a aceitar eventos de auditoria:
  - `owner_live_reconnecting`;
  - `owner_live_reconnected`;
  - `owner_live_reconnect_failed`;
  - `angel_live_reconnecting`;
  - `angel_live_reconnected`;
  - `angel_live_reconnect_failed`.
- A API passou a aceitar `connection_state=reconnecting`.

## Limites preservados

- Esta subetapa nao ativa TURN/relay.
- Esta subetapa nao reinicia ICE nem cria nova offer automaticamente; ela organiza UX e auditoria da recuperacao curta que o WebRTC ja tenta realizar.
- Midia bruta continua fora da EC2/API.
- Auditoria continua saneada e usa hash de `callSessionId`, sem SDP/ICE.

## Validacoes executadas

- `npm run typecheck`: aprovado.
- `git diff --check`: aprovado.
- `services/api ./.venv/bin/python manage.py test sinalseguro_api.tests.test_platform_base.PlatformBaseTests.test_live_audit_marker_records_sanitized_medium_audit_only_for_participants`: aprovado.

## Gates pendentes antes de release

- `npm run lint`.
- `npm test`.
- Build Android bundled completo.
- Backend `manage.py check` e teste focado/full conforme escopo final.
- Teste fisico em dois Androids com oscilacao de rede controlada: chamada deve passar por `Reconectando chamada`, recuperar quando a rede voltar ou exibir falha clara sem encerrar o SOS.

## Proxima subetapa

Preparar notificacao/segundo plano para o anjo sem publicar ainda: revisar permissao, canal Android, linguagem final e limites de acionamento.
