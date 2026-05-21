# Checkpoint - Etapa 1.89 finish active call runtime state actions policy

Data: 2026-05-21

## Status

Refatoracao pura implementada e validada.

## Escopo

Consolidar em policy pura as acoes aplicaveis ao estado local no inicio runtime do encerramento do chamado ativo.

## Alteracoes

- Criado `src/features/emergency-home/finishActiveCallRuntimeStateActionsPolicy.ts`.
- Criada funcao `resolveFinishActiveCallRuntimeStateActions()`.
- `app/index.tsx` passou a usar a policy apos `resolveFinishActiveCallRuntimeStartActions()`.
- O componente continua responsavel por:
  - chamar `stopOwnerLiveVideoEvidence()`;
  - resetar chamada ao vivo;
  - limpar refs de autochamada;
  - aplicar `setLiveRemoteSessionId(null)`;
  - marcar `finishInProgress`;
  - atualizar status/progresso;
  - registrar log operacional real.
- Criado `scripts/finish-active-call-runtime-state-actions-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:finish-active-call-runtime-state-actions`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida do Node 20.16.0.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, `Authorization`, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.
- `npm run typecheck`: sem erro emitido, mas travou sem CPU e foi encerrado para nao deixar processo pendurado.

## Seguranca e privacidade

- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- A policy nao para video, nao reseta WebRTC, nao altera refs e nao manipula midia; apenas declara acoes locais derivadas.
- O log segue limitado a plataforma; nao inclui token, chave, SDP/ICE, path local, coordenada ou conteudo de midia.

## Android fisico

Sem build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica continua reservada para mudancas operacionais em chamada, camera, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Fechar junto com a Etapa 1.90, pois ambas reduzem o bloco de encerramento do chamado sem alterar comportamento operacional.
