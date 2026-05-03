# 17 - Streaming Autorizado, Cofre, Player e Atalho 190

Data: 2026-05-02
Supervisao: Ze
Gerencia mobile: Cristine
Especialistas acionados: Tarcila, Norman, Ada, Hedy, Ritchie, Schneier, Doneda e Myers

## Objetivo

Reposicionar o app em torno do botao de emergencia e preparar, com seguranca juridica e tecnica, os fluxos futuros de:

- audio, video e localizacao em tempo real para anjos autorizados;
- gravacao e salvamento pelo destinatario autorizado;
- player para arquivos gravados ou recebidos;
- compartilhamento somente com pessoas autorizadas e dentro do SinalSeguro;
- atalho para ligar 190;
- criptografia e gestao de chaves pelo backend.

## Decisao de seguranca

Audio, video, streaming, recebimento por terceiros, salvamento no dispositivo do anjo e envio para autoridade ficam bloqueados no build publico ate existir:

- contrato eletronico bilateral versionado;
- aceite da pessoa protegida e do anjo em conta propria;
- registro de escopos: audio, video, localizacao pontual, localizacao em tempo real e salvamento criptografado;
- backend com autenticacao, RBAC, MFA administrativo e auditoria;
- criptografia de envelope por alerta e por destinatario autorizado;
- politica de retencao, revogacao, exclusao e incidente;
- RIPD/DPIA e revisao juridica Doneda/Schneier;
- homologacao com dados ficticios ou participantes consentidos.

## Fluxo futuro autorizado

1. A usuaria adiciona uma pessoa de confianca.
2. A pessoa aceita o convite usando conta propria.
3. Ambas aceitam o contrato eletronico bilateral e os escopos permitidos.
4. A usuaria configura se deseja permitir audio, video, localizacao em tempo real e salvamento criptografado pelo anjo.
5. Ao acionar o botao de emergencia, o app cria o pacote local e tenta envio pela API quando disponivel.
6. O backend valida contrato, escopos, dispositivos, chaves e autorizacao.
7. O anjo recebe alerta discreto e pode visualizar stream/dados somente dentro do SinalSeguro.
8. Se permitido, o anjo pode salvar copia criptografada em seu dispositivo.
9. Qualquer compartilhamento exige destino autorizado, justificativa, trilha de auditoria e uso exclusivo em processo judicial, procedimento protetivo ou atendimento autorizado.

## Criptografia e chaves

Modelo previsto:

- cada alerta/media asset recebe chave de conteudo propria;
- audio/video/localizacao sao criptografados antes de upload ou armazenamento persistente;
- backend guarda envelopes de chave por destinatario autorizado;
- chaves mestras ficam em cofre/KMS, nunca em Git, `.env` compartilhado ou app;
- acesso exige sessao autenticada, dispositivo reconhecido e escopo vigente;
- cada leitura, download, exportacao, revogacao e exclusao gera `audit_event`.

## Implementado neste checkpoint

UX/UI:

- splash custom com simbolo maior, nome `SinalSeguro` abaixo e barra de loading;
- fundo da splash ajustado para `#120A20`, contrastando melhor com a logo;
- Home reorganizada com botao circular central `SOS`;
- atalhos em grade: `Ligar 190`, `Anjos`, `Cofre`, `Config.`;
- `Arquivos locais` passa a ser apresentado como `Cofre local`;
- player visual `EvidencePlayerCard` mostra estado de midia, politica de criptografia e acoes futuras.

Funcionalidade controlada:

- atalho `Ligar 190` abre confirmacao antes de chamar `tel:190`;
- atalho 190 fica ativo por padrao, mas pode ser desativado em `Configuracoes`;
- preferencia futura de chamada ao anjo autorizado foi adicionada, sem ligacao automatica no build publico;
- configuracoes ganharam preferencias locais para solicitar escopos futuros de audio, video e localizacao em tempo real;
- preferencias de streaming sempre permanecem `homologation_blocked` no build publico;
- pacote de troca passa a marcar backend/P2P como nao prontos enquanto adaptadores reais nao existem;
- linguagem de usuaria remove `API/P2P` da Home e dos resumos principais.

Player/cofre:

- player real fica bloqueado quando `media.status = blocked_public_build`;
- botoes `Reproduzir`, `Salvar criptografado`, `Compartilhar autorizado` e `Excluir local` aparecem como desenho operacional, mas ficam bloqueados sem midia/autorizacao;
- hash completo deixou de ser elemento principal e aparece resumido no card.

## Atalho 190

Decisao:

- o app pode oferecer botao manual para ligar 190;
- nenhuma chamada automatica para 190 entra no MVP;
- o app nao promete integracao oficial, resposta policial ou transmissao direta para orgao publico;
- o anjo so pode acionar 190 com base legal, contexto de emergencia e autorizacao prevista no contrato.

## Bloqueios

- sem gravacao oculta;
- sem streaming publico;
- sem share sheet generico para evidencia;
- sem exportacao fora do app sem auditoria;
- sem chaves no app ou no repositorio;
- sem promessa de P2P/190 como garantia de emergencia;
- sem uso de acessibilidade, overlay ou botao de volume para contornar o sistema.

## Arquivos principais

- `src/components/AppLaunchScreen.tsx`;
- `src/components/PanicButton.tsx`;
- `src/components/EmergencyCallButton.tsx`;
- `src/components/EvidencePlayerCard.tsx`;
- `src/components/EmergencyPackageCard.tsx`;
- `src/features/evidence/evidencePolicy.ts`;
- `src/features/emergency/emergencyPreferences.ts`;
- `src/features/emergency/emergencyRecorder.ts`;
- `src/services/emergencyDelivery.ts`;
- `app/index.tsx`;
- `app/arquivos.tsx`;
- `app/configuracoes.tsx`;
- `app/_layout.tsx`.

## Criterios de aceite

- `npm run typecheck` aprovado;
- `npm run lint` aprovado;
- `npm test` aprovado;
- splash custom aparece com loading e sem efeito ornamental;
- Home prioriza botao circular central;
- atalho 190 exige confirmacao e pode ser desativado pela usuaria;
- Cofre local nao exibe coordenadas completas nem hash completo como conteudo principal;
- player real fica bloqueado sem midia/autorizacao;
- streaming fica documentado como homologacao futura;
- textos nao prometem integracao oficial, API, P2P ou resposta publica.

## Validacao Android

Em 2026-05-02, o build debug local foi revalidado no Android fisico `23129RA5FL` via ADB Wi-Fi:

- Home com botao central `SOS` e atalhos `Ligar 190`, `Anjos`, `Cofre`, `Config.`;
- dialogo de confirmacao antes de qualquer chamada 190;
- `Cofre local` com player visual e midia bloqueada;
- `Configuracoes` com atalho 190 configuravel, chamada futura ao anjo e escopos futuros de audio, video e localizacao em tempo real;
- logcat filtrado sem crash, camera, microfone, WebRTC, `/alerts`, `/media` ou upload.
