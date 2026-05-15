# Contrato API - vinculos anjo/protegido

Data: 2026-05-15
Escopo: relacao visivel entre pessoa protegida/originadora e anjo que aceitou convite.

## Backend publicado

Arquivos alterados em `services/api`:

- `trusted_contacts/serializers.py`
- `trusted_contacts/views.py`
- `sinalseguro_api/api_urls.py`
- `sinalseguro_api/tests/test_platform_base.py`

Rotas:

- `POST /api/invitations/accept`
- `GET /api/trusted-contacts/relationships`

Contrato de resposta de relacionamento:

- `id`
- `protected_subject`
- `display_label`
- `relationship_role`: `owner` ou `angel`
- `owner_display_name`
- `contact_display_name`
- `status`
- `can_receive_alerts`
- `can_receive_media`
- `can_receive_location`
- `accepted_at`
- `revoked_at`
- `created_at`
- `updated_at`

## Regras de seguranca e privacidade

- O backend nao deve devolver token claro neste contrato.
- O contrato nao deve expor telefone, e-mail bruto, chave, evidencia, midia ou localizacao.
- Nome de exibicao usa `display_name` quando disponivel; fallback de e-mail deve ser mascarado.
- O aceite continua bloqueado para autoaceite, convite expirado/revogado e usuario sem dispositivo ativo com chave publica.
- Midia e localizacao para anjos continuam bloqueadas nesta etapa.

## Evidencia de validacao

- `manage.py test sinalseguro_api.tests`: aprovado.
- `manage.py check`: aprovado.
- `manage.py makemigrations --check --dry-run`: aprovado.
- `spectacular --validate`: aprovado com alerta preexistente de enum.
- Deploy EC2: `sinalseguro-api` ativo, `cereusia-crm` ativo, `nginx -t` aprovado, health/ready ok.

## Limite fisico atual

A consulta saneada em producao confirmou que os convites recentes ainda estavam pendentes, sem `contact_user`/`accepted_at`. O aceite fisico precisa ser retomado no aparelho anjo abrindo o link recebido ou com dois Androids visiveis por ADB.
