# 08 - Seguranca E LGPD

Responsaveis: Schneier e Doneda

## Dados de atencao

- Identificacao minima.
- Dispositivo.
- Anjos.
- Convites.
- Consentimentos.
- Localizacao pontual.
- Eventos de alerta.
- Midia homologada.

## Controles

- Consentimento versionado.
- Finalidade clara.
- Retencao definida.
- Criptografia em transito e repouso.
- Outbox criptografada.
- Logs saneados.
- RBAC e MFA no backend/admin.
- Plano de incidente.

## Bloqueios

- Dados reais sem base legal e documentacao.
- Gravacao oculta.
- Localizacao continua por padrao.
- Conteudo sensivel em push.
- Compartilhamento com orgaos sem convenio.
- Menores sem analise ECA Digital/LGPD.

## Revisoes obrigatorias

- Threat model antes de alerta real.
- RIPD/DPIA antes de midia real.
- Politica de retencao antes de upload.
- Termos e privacidade antes de participantes reais.

## Auditoria de dependencias

Checkpoint 2026-05-02:

- `npm audit --omit=dev --audit-level=high` nao encontrou vulnerabilidades altas ou criticas.
- Vulnerabilidades moderadas transitivas permanecem na cadeia Expo; `npm audit fix --force` indicou mudanca quebravel de SDK, portanto a correcao deve ser avaliada por Ada, Kim e Schneier antes de alterar a stack.
