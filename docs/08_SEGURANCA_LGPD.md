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
- Cofre local do sistema para convites e pacotes pequenos de emergencia.
- Hash SHA-256 para integridade de pacote local.
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
- permissoes transitivas de overlay (`SYSTEM_ALERT_WINDOW`) e armazenamento legado ficam bloqueadas no primeiro APK;
- nenhum dado real de vitima, anjo, localizacao, alerta ou midia entra no release;
- release notes devem dizer explicitamente que nao ha envio real nem substituicao de 190/180;
- logs de alerta devem permanecer saneados e sem dado pessoal.

## Auditoria de dependencias

Checkpoint 2026-05-02:

- `npm audit --omit=dev --audit-level=high` nao encontrou vulnerabilidades altas ou criticas.
- Vulnerabilidades moderadas transitivas permanecem na cadeia Expo; `npm audit fix --force` indicou mudanca quebravel de SDK, portanto a correcao deve ser avaliada por Ada, Kim e Schneier antes de alterar a stack.
- Em 2026-05-02, o mesmo resultado permaneceu apos inclusao de peers Expo e `expo-build-properties`.

## Convites e pacote de emergencia local

Checkpoint 2026-05-02:

- convites locais geram codigo opaco, expiravel e de uso unico;
- aceite real exige conta propria, consentimento e validacao pela API;
- alerta de teste grava pacote local com horario, consentimento, localizacao pontual autorizada, manifesto de midia bloqueada e plano de entrega;
- pacote local fica no cofre do sistema enquanto backend/P2P nao estiverem prontos;
- o app nao grava midia real, nao transmite dados e nao aciona terceiros neste checkpoint;
- localizacao negada ou indisponivel nao impede a gravacao do pacote, mas fica registrada como status explicito.
