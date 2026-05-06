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
- Ativacao de servico pago, billing ou upgrade de infraestrutura sem aprovacao explicita, limite de custo e registro em memoria.
- Gravacao oculta.
- Localizacao continua por padrao.
- Camera e microfone no primeiro instalavel Android/iOS.
- Conteudo sensivel em push.
- Compartilhamento com orgaos sem convenio.
- Convites de anjos iniciados por menores.
- Menores sem politica ECA Digital/LGPD, responsavel verificado, consentimento adequado e controles contra abuso.

## Revisoes obrigatorias

- Threat model antes de alerta real.
- RIPD/DPIA antes de midia real.
- Politica de retencao antes de upload.
- Termos e privacidade antes de participantes reais.
- Matriz de dados de criancas/adolescentes antes de ativar perfis de filhos/dependentes.

## Responsaveis, filhos e anjos

Decisao 2026-05-05:

- adultos/responsaveis verificados podem adicionar filhos/dependentes;
- os responsaveis podem ser configurados como anjos padrao dos filhos/dependentes;
- menores nao podem convidar anjos, conveniados ou terceiros;
- convites devem ser bloqueados no app e tambem no backend;
- perfil de menor deve coletar apenas dados minimos para identificacao, seguranca e acionamento;
- video/audio/localizacao envolvendo menor exige consentimento versionado do responsavel, finalidade clara, retencao definida e revisao Doneda/Schneier;
- o risco de o agressor ser responsavel legal deve entrar no threat model antes de uso real.

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

## Build privado com midia local

Checkpoint 2026-05-03:

- `CAMERA` e `RECORD_AUDIO` ficam habilitados somente no APK privado de homologacao local;
- a gravacao inicia apenas apos acionamento do SOS e permissao explicita do Android;
- video/audio ficam no sandbox privado do app, com backup Android desativado no Manifest nativo;
- o arquivo e anexado ao pacote local e acessado pelo Cofre/Player;
- transmissao, upload, streaming, P2P, envio a anjos e exportacao seguem bloqueados ate backend, contrato, chaves, RBAC, auditoria, retencao e RIPD/DPIA;
- gravacao oculta, bypass de permissao, overlay e armazenamento externo continuam proibidos.
