# 31 - Arquitetura de Compartilhamento em Tempo Real

Responsavel da tarefa: Ritchie  
Coordenacao: Ze  
Validacao obrigatoria: Schneier, Doneda e Myers  
Data: 2026-05-05

## Decisao

A EC2 existente sera tratada como servidor de coordenacao do SinalSeguro, nao como promessa de transmissao imediata neste build. Ela deve viabilizar login, vinculacao de dispositivo, registro de destinatarios, diretorio de chaves publicas, distribuicao de envelopes de chave, sinalizacao P2P e auditoria.

O transporte preferencial futuro para anjos autorizados sera P2P com criptografia ponta a ponta. O servidor pode coordenar e sinalizar, mas nao deve precisar acessar midia, audio ou localizacao em claro. Conveniados entram em fase posterior, com contrato, RBAC, MFA, retencao, auditoria e base juridica propria.

## Estado implementado no app

- `EmergencyDeliveryPlan` ganhou `remoteSharing`.
- `RemoteSharingPlan` centraliza a montagem do plano remoto em classe POO.
- Novos pacotes de emergencia registram:
  - EC2/`sinalseguro-api` como coordenador planejado;
  - login obrigatorio antes de compartilhamento remoto;
  - envelopes de chave por destinatario;
  - chaves efemeras de sessao para tempo real;
  - canais futuros de video, audio e localizacao;
  - politica de compartilhamento somente enquanto a emergencia estiver ativa;
  - P2P pendente por `webrtc`, `nearby` e `multipeer`;
  - conveniados como fase futura com contrato e auditoria.
- Pacotes antigos sao normalizados ao listar, sem quebrar cofre local.

## Blocos de implementacao

1. Identidade e dispositivo:
   - login real;
   - vinculo de dispositivo;
   - chave publica do dispositivo;
   - revogacao de sessao/dispositivo.
2. Anjos:
   - convite validado pelo backend;
   - aceite expresso;
   - chave publica do anjo;
   - estados pendente, aceito, revogado e bloqueado.
3. Emergencia ativa:
   - criar sessao remota idempotente;
   - publicar envelopes da chave de midia/sessao por destinatario;
   - sinalizar P2P;
   - transmitir video, audio e localizacao apenas se houver autorizacao.
4. Fallback servidor:
   - store-and-forward futuro, criptografado por envelope;
   - sem midia em claro na API;
   - retencao e limpeza auditadas.
5. Conveniados:
   - contratos;
   - RBAC/MFA;
   - trilha de auditoria;
   - base juridica e RIPD/DPIA.

## Regras de seguranca

- Nenhum compartilhamento remoto sem login, dispositivo registrado, aceite do anjo e chave publica valida.
- O servidor nunca deve registrar video, audio ou localizacao em claro.
- Chaves simetricas de midia devem ser embrulhadas por destinatario autorizado.
- Sessao ao vivo usa chaves efemeras e deve encerrar com a emergencia.
- Localizacao em tempo real e midia so trafegam durante `recording_local`.
- Conveniados nao compartilham o mesmo caminho operacional dos anjos ate existir contrato e controle de acesso proprio.

## Proxima etapa tecnica

Implementar no backend `sinalseguro-api` os contratos minimos para:

- `auth`;
- `devices`;
- `trusted_contacts`;
- `recipient_public_keys`;
- `emergency_sessions`;
- `key_envelopes`;
- `p2p_signaling`;
- `audit`.

No mobile, a proxima entrega deve criar cliente API idempotente e outbox remota sem enviar midia real ainda.
