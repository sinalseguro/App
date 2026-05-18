# Checkpoint Validacao Fisica Dois Androids SOS Anjo

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Katia, Eliane, Cristine, Lina, Tarcila e Lucena
Status: validacao fisica principal aprovada em dois Androids distintos com Android `0.1.15`; auditoria media EC2/API e publicacao privada portal/API concluidas.

## Objetivo

Retomar o gate que estava bloqueado por duplicidade ADB e validar o fluxo real:

- solicitante aciona SOS;
- anjo recebe o chamado;
- anjo acompanha video em tempo real da pessoa protegida;
- solicitante encerra o chamado;
- video local fica preservado no cofre do solicitante;
- anjo recebe registro encerrado para consulta operacional.

## Dispositivos ADB

`adb devices -l` passou a mostrar dois aparelhos reais distintos:

- `0123456789ABCDEF`, modelo `mobile_terminal`, via USB;
- `5686add7`, modelo `23129RA5FL`, via USB;
- a entrada Wi-Fi/mDNS `adb-5686add7-...` foi tratada como transporte duplicado do Redmi e nao como terceiro aparelho.

Ambos estavam com:

- pacote `br.com.sinalseguro.app`;
- `versionName=0.1.15`;
- `versionCode=17`.

## Observacao de automacao

O ADB conseguiu tocar a interface e abrir componentes, mas a simulacao de pressao longa no `PanicButton` nao foi confiavel para iniciar o SOS. Foram testados `swipe` e `motionevent`; o componente nao entrou em estado visual de pressionado.

Decisao de QA:

- nao usar long press ADB como evidencia negativa do botao SOS;
- para este gate, o acionamento inicial deve ser validado por toque fisico real;
- ADB continua valido para abrir app, capturar tela, limpar logs, confirmar versao e encerrar/inspecionar estados auxiliares.

## Evidencia funcional

Validacao fisica aprovada:

- o Android `0123456789ABCDEF` ficou como solicitante;
- a Home do solicitante exibiu `VOCE PEDIU AJUDA` e `Transmitindo ao anjo`;
- o Android `5686add7` recebeu o pedido em `Alertas recebidos`;
- o anjo exibiu `Voce e anjo de Roberto Dantas Castro`, `Acompanhando SOS` e video com rotulo `Pessoa protegida`;
- apos sair da chamada, o solicitante continuou com SOS ativo ate o encerramento;
- o encerramento no solicitante exibiu `Video protegido 100%` e `Video protegido e anexado ao cofre local`;
- depois de continuar, a Home voltou para `SOS` e mostrou `Chamado encerrado. Video preservado no cofre local`;
- o anjo passou a mostrar o pedido como `Encerrado` e um registro local finalizado com snapshot e duracao.

## Resultado tecnico

Este checkpoint valida o fluxo principal de experiencia e midia entre dois aparelhos:

- solicitante transmite video/audio ao anjo;
- anjo acompanha o evento ativo em tempo real;
- chamada pode ser encerrada sem travar a Home;
- SOS pode ser encerrado e preservar video local no cofre do solicitante;
- anjo mantem registro operacional encerrado.

O principio arquitetural permanece:

- EC2/API atua como plano de controle, autorizacao, sinalizacao e auditoria;
- audio/video bruto deve trafegar entre dispositivos autorizados e permanecer fora do backend;
- registros locais e auditoria minima precisam continuar coerentes para revisao posterior.

## Limites desta validacao

- Logs completos nao foram versionados para evitar armazenamento de dados sensiveis, tokens, caminhos, payloads, midia ou identificadores desnecessarios.
- A automacao ADB segue insuficiente como prova de acionamento inicial do `PanicButton`; quando a pressao longa automatizada nao entrar no estado visual de pressao, usar toque fisico real supervisionado.
- Como os dois Androids fisicos ja estao em `versionCode=17`, eles nao devem abrir modal de atualizacao para a mesma versao. O canal de atualizacao deve ser testado em aparelho com `versionCode` menor que `17` ou em proxima versao numericamente superior.

## Auditoria EC2/API

Auditoria media executada apos o teste fisico:

- `sinalseguro-api` permaneceu `active`;
- health check correto: `/api/health/ready`;
- ultima sessao de teste ficou `finished` / `ended`, com 1 destinatario, 1 envelope ao vivo e sinais P2P efemeros consumidos;
- nao havia sessoes ativas, envelopes ao vivo ativos, sinais validos nao consumidos ou destinatarios abertos em sessao ativa;
- `/opt/sinalseguro-api/media` permaneceu sem arquivos de midia bruta;
- limpeza efemera removeu 18 sinais P2P antigos e preservou auditoria minima de sessoes/envelopes.

Resultado: a EC2/API atuou como plano de controle, autorizacao, sinalizacao e auditoria minima, sem armazenar audio/video bruto da chamada.

## Publicacao privada Android

Publicacao concluida para teste autorizado:

- portal publicado em `/var/www/sinalseguro/releases/20260518T112908Z`;
- pagina Android publicada em `https://www.sinalseguro.com.br/baixar/android`;
- nome publico do APK preservado: `sinalseguro_android.apk`;
- link direto versionado: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk?v=0.1.15-20260518T112447Z`;
- endpoint de update retornou Android `0.1.15`, `versionCode=17`, status `available` e SHA-256 `b4f58d1d322a890da5dab0e717d0c81ceb4fb897fb91ef96ae34522b2e1c664c`;
- download real do APK publicado gerou o mesmo SHA-256;
- `installers.json` e `checksums.txt` ficaram sincronizados;
- `nginx -t`, `sinalseguro-api`, `cereusia-crm` e health/ready foram aprovados;
- auditoria de dependencias de producao do portal (`npm audit --omit=dev --audit-level=high`) retornou 0 vulnerabilidades.

## Proxima acao recomendada

Roberto pode atualizar/instalar pelo portal em aparelho de teste autorizado e repetir o fluxo manual. Se o aparelho ja estiver em `0.1.15` / `versionCode=17`, o teste esperado e download/instalacao pelo portal ou aguardar a proxima versao com `versionCode` superior para validar modal de atualizacao dentro do app.
