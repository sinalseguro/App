# Checkpoint - Frente 4 Chamada Hibrida P2P

Data: 2026-05-16  
Coordenacao: Ze  
Especialistas: Katia, Fabio, Doneda, Cristine, Eliane, Lina, Tarcila e Lucena

## Decisao registrada

A proxima frente de implementacao e chamada de emergencia audio/video para anjos autorizados, com arquitetura hibrida:

- EC2/API SinalSeguro coordena identidade, ocorrencia, aceite, envelopes efemeros, sinalizacao e auditoria;
- apos conexao segura WebRTC, audio/video trafegam P2P entre os smartphones;
- backend nao recebe nem armazena midia da chamada;
- TURN/relay e apenas fallback futuro, separado da API e dependente de aprovacao de custo.

## Checkpoint F4.1 implementado localmente

Primeira fatia tecnica implementada localmente no backend:

- `key_envelopes` deixa de ficar bloqueado genericamente apenas para `live_session`;
- `media_asset` remoto continua bloqueado;
- `p2p_signals` deixa de ficar bloqueado genericamente quando existe:
  - ocorrencia SOS ativa;
  - anjo roteado e aceito;
  - dispositivos ativos com chave publica nos dois lados;
  - envelope efemero ativo antes da sinalizacao;
  - expiracao curta;
  - payload limitado a SDP/candidate/campos tecnicos permitidos.
- auditoria de P2P registra tipo, destinatario, ocorrencia e expiracao, sem SDP, ICE candidate ou payload.

## Validacao executada

Testes Django focados executados em `services/api`:

```bash
.venv/bin/python manage.py test \
  sinalseguro_api.tests.test_platform_base.PlatformBaseTests.test_live_key_envelope_and_p2p_require_accepted_emergency_recipient \
  sinalseguro_api.tests.test_platform_base.PlatformBaseTests.test_live_session_key_envelope_allows_only_accepted_angel_device \
  sinalseguro_api.tests.test_platform_base.PlatformBaseTests.test_p2p_signaling_allows_only_owner_and_accepted_angel_after_live_envelope \
  sinalseguro_api.tests.test_platform_base.PlatformBaseTests.test_p2p_signaling_rejects_long_ttl_and_unexpected_payload_fields
```

Resultado: aprovado.

Tambem aprovado:

```bash
.venv/bin/python manage.py check
.venv/bin/python manage.py test sinalseguro_api.tests.test_platform_base
git diff --check
```

## Regras que permanecem bloqueadas

- iPhone/iOS permanece pos-MVP.
- Localizacao em tempo real permanece frente separada.
- Conveniados/orgao publico permanecem bloqueados ate instrumento formal.
- Midia remota `media_asset` segue bloqueada ate frente propria de midia operacional.
- Nenhum backend de midia, SFU/MCU ou servidor decodificador foi criado.

## Proximo passo

Continuar F4.1 ate fechar backend de controle/publicacao:

1. revisar schema/OpenAPI gerado;
2. decidir publicacao EC2 desta fatia antes do app Android consumir;
3. revisar impacto no app Android;
4. iniciar F4.2 com WebRTC Android em primeiro plano somente apos F4.1 publicada ou marcada como ambiente local controlado.
