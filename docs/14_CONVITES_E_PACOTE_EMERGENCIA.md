# 14 - Convites e Pacote de Emergencia

Data: 2026-05-02
Supervisao: Ze
Gerencia mobile: Cristine
Responsaveis: Hedy, Ada, Ritchie, Schneier, Doneda e Myers

## Objetivo

Criar a base tecnica que permite:

- gerar convite local para anjo de confianca;
- compartilhar o convite por WhatsApp ou outro app via share sheet do sistema;
- manter pre-convite local com token opaco, expiracao sugerida e validacao online futura;
- gravar pacote local de emergencia com horario, consentimento, georreferencia pontual e plano de entrega;
- permitir que a usuaria acesse a area de arquivos locais gravados no dispositivo;
- manter o pacote bloqueado para envio externo ate backend, contrato, chaves, auditoria e adaptadores reais serem aprovados.

## Escopo implementado

Convites:

- `createLocalInvitation()` gera identificador opaco por SHA-256 de entropia local;
- link publico aponta para `https://www.sinalseguro.com.br/baixar?convite=<codigo>`;
- deep link futuro aponta para `sinalseguro://convite?convite=<codigo>`;
- pre-convite tem validade sugerida de 7 dias;
- convite fica salvo em cofre local do sistema via `expo-secure-store`;
- tela `app/convite.tsx` reconhece o codigo e deixa claro que o aceite real exige login proprio e API.
- convite e a unica excecao de share sheet neste build; ele nao transporta evidencia, midia, localizacao ou dados sensiveis da usuaria.

Pacote de emergencia:

- `startEmergencyPackage()` cria pacote local com `clientAlertId`, `idempotencyKey`, horario, consentimento, localizacao e plano de entrega;
- o servico impede dois chamados `recording_local` simultaneos no mesmo dispositivo;
- `recordEmergencyPackage()` e utilitario tecnico imediato e bloqueia execucao quando ja existe chamado ativo;
- localizacao e capturada apenas com permissao foreground do sistema;
- pacote fica salvo em cofre local do sistema via `expo-secure-store`, com indice sem dado sensivel em `AsyncStorage`;
- integridade do pacote e registrada por SHA-256;
- envelope de troca `sinalseguro.emergency-exchange.v1` fica preparado para backend/P2P futuro, mas marca adaptadores reais como nao prontos;
- tela inicial e tela de alerta mostram contagem da outbox local e status de gravacao.

Arquivos locais:

- tela `app/arquivos.tsx` lista os pacotes gravados no dispositivo;
- a experiencia passa a apresentar essa area como `Cofre local`;
- cada pacote mostra horario, hash tecnico resumido, status de georreferencia, status de midia e bloqueio de envio externo neste build;
- coordenadas completas ficam preservadas no cofre local e nao sao exibidas nesta etapa sem autenticacao forte;
- a tela deixa claro que os dados permanecem locais neste build; qualquer envio futuro depende de backend, contrato, chaves, auditoria e autorizacao.

## Limites de seguranca

- O build publico nao grava audio, video, camera ou microfone.
- O build privado de homologacao local pode gravar video/audio no sandbox do app quando a usuaria conceder `CAMERA` e `RECORD_AUDIO`.
- Midia local no build privado nao e transmitida para backend, anjos, P2P ou terceiros.
- Transmissao, exportacao e compartilhamento continuam bloqueados ate RIPD/DPIA, consentimento bilateral, auditoria, retencao, revisao juridica e backend de chaves.
- O pacote atual registra metadados tecnicos, localizacao pontual autorizada e, no build privado, asset local de video quando capturado.
- Nenhum pacote e transmitido para terceiros enquanto API/backend/P2P nao estiverem implementados e autorizados.
- Nao ha acionamento de orgaos publicos, nem promessa de resposta emergencial.

## Preparado para API/P2P futuro

O pacote local ja contem:

- `clientAlertId` para contrato `/alerts`;
- `idempotencyKey` para envio idempotente;
- `location` compatível com `LocationPoint`;
- `deliveryPlan.api.endpoint = /alerts`;
- `deliveryPlan.p2p.candidates = webrtc, nearby, multipeer`;
- `readyForBackend = false` e `readyForP2PAdapter = false` enquanto os adaptadores reais nao existirem;
- lista de referencias locais pendentes de contrato e validacao;
- hash SHA-256 para verificacao de integridade.

## Criterios de aceite Myers/Schneier/Doneda

- `npm run typecheck` aprovado.
- `npm run lint` aprovado sem padroes sensiveis.
- `npm test` aprovado.
- Convite nao permite login como outra pessoa.
- Localizacao negada gera pacote mesmo assim, com status explicito.
- Area de arquivos locais lista pacotes gravados e deixa o envio externo bloqueado.
- Camera e microfone permanecem fora do build publico e entram somente no build privado de midia local.
- Dados sensiveis nao aparecem em console, URL de API ou push.
- Docs deixam claro que midia real e transmissao estao bloqueadas.

## Validacao Android fisica

Status em 2026-05-02: aprovado para recursos locais em build debug de homologacao.

Resultados:

- convite local criado e preservado;
- deep link `sinalseguro://convite?convite=qa123` abriu a tela `Convite recebido`;
- alerta de teste criou pacote local com georreferencia consentida;
- area `Arquivos locais` listou pacotes, hash, status de georreferencia, midia bloqueada e plano API/P2P;
- persistencia validada apos fechar e reabrir o app;
- permissao de localizacao negada gerou pacote com status `permission_denied`;
- `aapt` confirmou ausencia de `CAMERA`, `RECORD_AUDIO`, `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE` e `WRITE_EXTERNAL_STORAGE`;
- logcat nao exibiu coordenadas, tokens, payloads sensiveis, upload, WebRTC ou crash.

Relatorio completo: `docs/15_VALIDACAO_ANDROID_RECURSOS_LOCAIS.md`.

## Evolucao: chamado ativo e finalizacao

Status em 2026-05-02: implementado no app shell.

Mudancas:

- pacote pode iniciar como `recording_local`;
- duracao padrao configuravel fica registrada em `plannedDurationSeconds`;
- `plannedDurationSeconds` representa tempo de gravacao local, nao duracao da emergencia;
- botao `SOS` ativo e Cofre encerram a coleta local sem apagar evidencia;
- finalizacao manual registra `manual_finish`;
- encerramento automatico antigo por `default_duration_elapsed` foi removido do fluxo ativo; o chamado encerra por acao manual;
- hash SHA-256 e recalculado apos o encerramento sem incluir o hash anterior no payload;
- pacote finalizado fica em `recorded_local`;
- midia local pode passar de `pending_local_recording` para `recorded_local` quando o arquivo de video e preservado.

Documento complementar: `docs/16_SEGUNDO_PLANO_ATALHO_FISICO_E_DURACAO.md`.
