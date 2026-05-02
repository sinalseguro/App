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
- Camera e microfone no primeiro instalavel Android/iOS.
- Conteudo sensivel em push.
- Compartilhamento com orgaos sem convenio.
- Menores sem analise ECA Digital/LGPD.

## Revisoes obrigatorias

- Threat model antes de alerta real.
- RIPD/DPIA antes de midia real.
- Politica de retencao antes de upload.
- Termos e privacidade antes de participantes reais.

## Decisao Etapa 1 Android

Checkpoint 2026-05-02:

- primeiro APK deve ser app shell tecnico com alerta simulado;
- permissoes de camera e microfone ficam removidas ate homologacao com midia;
- nenhum dado real de vitima, anjo, localizacao, alerta ou midia entra no release;
- release notes devem dizer explicitamente que nao ha envio real nem substituicao de 190/180;
- logs de alerta devem permanecer saneados e sem dado pessoal.

## Auditoria de dependencias

Checkpoint 2026-05-02:

- `npm audit --omit=dev --audit-level=high` nao encontrou vulnerabilidades altas ou criticas.
- Vulnerabilidades moderadas transitivas permanecem na cadeia Expo; `npm audit fix --force` indicou mudanca quebravel de SDK, portanto a correcao deve ser avaliada por Ada, Kim e Schneier antes de alterar a stack.
- Em 2026-05-02, o mesmo resultado permaneceu apos inclusao de peers Expo e `expo-build-properties`.
