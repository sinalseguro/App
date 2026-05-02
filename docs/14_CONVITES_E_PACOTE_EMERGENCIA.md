# 14 - Convites e Pacote de Emergencia

Data: 2026-05-02
Supervisao: Ze
Gerencia mobile: Cristine
Responsaveis: Hedy, Ada, Ritchie, Schneier, Doneda e Myers

## Objetivo

Criar a base tecnica que permite:

- gerar convite local para anjo de confianca;
- compartilhar o convite por WhatsApp ou outro app via share sheet do sistema;
- manter token opaco, expiravel e de uso unico;
- gravar pacote local de emergencia com horario, consentimento, georreferencia pontual e plano de entrega;
- permitir que a usuaria acesse a area de arquivos locais gravados no dispositivo;
- deixar o pacote pronto para envio pela API e por adaptador P2P quando essas camadas estiverem ativas.

## Escopo implementado

Convites:

- `createLocalInvitation()` gera identificador opaco por SHA-256 de entropia local;
- link publico aponta para `https://www.sinalseguro.com.br/baixar?convite=<codigo>`;
- deep link futuro aponta para `sinalseguro://convite?convite=<codigo>`;
- convite expira em 7 dias;
- convite fica salvo em cofre local do sistema via `expo-secure-store`;
- tela `app/convite.tsx` reconhece o codigo e deixa claro que o aceite real exige login proprio e API.

Pacote de emergencia:

- `recordEmergencyPackage()` cria pacote local com `clientAlertId`, `idempotencyKey`, horario, consentimento, localizacao e plano de entrega;
- localizacao e capturada apenas com permissao foreground do sistema;
- pacote fica salvo em cofre local do sistema via `expo-secure-store`, com indice sem dado sensivel em `AsyncStorage`;
- integridade do pacote e registrada por SHA-256;
- envelope de troca `sinalseguro.emergency-exchange.v1` fica pronto para backend/P2P futuro;
- tela inicial e tela de alerta mostram contagem da outbox local e status de gravacao.

Arquivos locais:

- tela `app/arquivos.tsx` lista os pacotes gravados no dispositivo;
- cada pacote mostra horario, hash SHA-256, status de georreferencia, status de midia e plano de entrega API/P2P;
- coordenadas completas ficam preservadas no cofre local e nao sao exibidas nesta etapa sem autenticacao forte;
- a tela deixa claro que os dados serao enviados somente quando backend/P2P estiverem prontos e autorizados.

## Limites de seguranca

- Este checkpoint nao grava audio, video, camera ou microfone.
- Midia real continua bloqueada no build publico ate RIPD/DPIA, consentimento, auditoria, retencao, revisao juridica e ambiente de homologacao.
- O pacote atual registra metadados tecnicos e localizacao pontual autorizada, nao evidencia audiovisual.
- Nenhum pacote e transmitido para terceiros enquanto API/backend/P2P nao estiverem implementados e autorizados.
- Nao ha acionamento de orgaos publicos, nem promessa de resposta emergencial.

## Pronto para API/P2P

O pacote local ja contem:

- `clientAlertId` para contrato `/alerts`;
- `idempotencyKey` para envio idempotente;
- `location` compatível com `LocationPoint`;
- `deliveryPlan.api.endpoint = /alerts`;
- `deliveryPlan.p2p.candidates = webrtc, nearby, multipeer`;
- lista de contatos autorizados pendentes de entrega;
- hash SHA-256 para verificacao de integridade.

## Criterios de aceite Myers/Schneier/Doneda

- `npm run typecheck` aprovado.
- `npm run lint` aprovado sem padroes sensiveis.
- `npm test` aprovado.
- Convite nao permite login como outra pessoa.
- Localizacao negada gera pacote mesmo assim, com status explicito.
- Area de arquivos locais lista pacotes gravados e status de envio futuro.
- Camera e microfone permanecem fora do build publico.
- Dados sensiveis nao aparecem em console, URL de API ou push.
- Docs deixam claro que midia real e transmissao estao bloqueadas.
