# Checkpoint Validacao Fisica Dois Androids SOS Anjo

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Katia, Eliane, Cristine, Lina, Tarcila e Lucena
Status: validacao fisica principal aprovada em dois Androids distintos com Android `0.1.15`.

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

- A EC2/API nao foi re-auditada em detalhe neste subpasso; a evidencia atual e fisica/visual dos dois apps.
- Logs completos nao foram versionados para evitar armazenamento de dados sensiveis, tokens, caminhos, payloads, midia ou identificadores desnecessarios.
- Antes de publicar uma release final como estavel, executar a auditoria media no backend/API para confirmar sessao, destinatario, sinais, encerramento e ausencia de midia bruta no servidor.

## Proxima acao recomendada

Executar a subetapa de auditoria media da EC2/API para este mesmo fluxo, sem trafegar midia bruta pelo backend:

- confirmar sessao criada e encerrada;
- confirmar destinatario anjo autorizado;
- confirmar sinais WebRTC consumidos/expirados;
- confirmar que nao ha sessoes ativas residuais;
- confirmar que o backend guarda apenas metadados/auditoria minima;
- depois disso, se nao houver divergencia, preparar a publicacao da release privada no portal/backend.
