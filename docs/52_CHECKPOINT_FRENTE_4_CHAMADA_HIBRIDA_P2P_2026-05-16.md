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

## Checkpoint F4.1 publicado na EC2

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
- envelope `live_session` agora exige expiracao curta;
- encerramento/cancelamento da ocorrencia revoga envelopes ao vivo e consome sinais pendentes;
- Admin nao exibe `encrypted_key` nem `payload`;
- comando `cleanup_ephemeral_controls` remove sinalizacao efemera vencida/consumida e revoga envelopes expirados;
- endpoint `/api/emergency-sessions/{id}/live-recipients/` entrega ao originador apenas anjos aceitos e dispositivos ativos com chave publica necessaria para preparar envelope.

Publicacao EC2:

- migration aplicada: `emergency.0003_keyenvelope_expires_at_and_more`;
- backup pre-deploy: `/opt/sinalseguro-api/backups/f4_1_20260516T183548Z/`;
- validado: `sinalseguro-api`, `cereusia-crm`, `nginx -t`, health/ready publicos, rotas sensiveis protegidas por `401` sem token e `cereusia.conf` preservado.

Cliente Android:

- contrato mobile alinhado para `scope: live_session` e `signal_type: ice`;
- adicionadas funcoes para listar destinatarios ao vivo, enviar/listar/consumir sinais P2P e preparar envelope de chamada;
- a release Android com WebRTC real ainda nao foi gerada nem publicada neste checkpoint.

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

Tambem aprovado nesta retomada:

```bash
.venv/bin/python manage.py check
.venv/bin/python manage.py test sinalseguro_api.tests.test_platform_base
.venv/bin/python manage.py spectacular --validate --file /tmp/sinalseguro-openapi-f4.yaml
git diff --check
npm run typecheck
```

## Regras que permanecem bloqueadas

- iPhone/iOS permanece pos-MVP.
- Localizacao em tempo real permanece frente separada.
- Conveniados/orgao publico permanecem bloqueados ate instrumento formal.
- Midia remota `media_asset` segue bloqueada ate frente propria de midia operacional.
- Nenhum backend de midia, SFU/MCU ou servidor decodificador foi criado.

## Proximo passo

Iniciar F4.2 Android WebRTC em primeiro plano:

1. adicionar dependencia nativa WebRTC compativel com Expo/RN atuais;
2. implementar runtime Android offer/answer/ICE sem logar SDP/candidate;
3. ligar o fluxo ao SOS originador e ao alerta aceito pelo anjo;
4. validar em dois Androids fisicos antes de gerar APK privado.
