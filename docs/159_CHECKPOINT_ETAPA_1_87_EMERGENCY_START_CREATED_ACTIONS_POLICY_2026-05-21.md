# Checkpoint - Etapa 1.87 emergency start created actions policy

Data: 2026-05-21

## Status

Refatoracao pura implementada e validada.

## Escopo

Consolidar em policy pura as acoes locais apos a criacao do pacote SOS: log saneado de pacote criado e status inicial exibido ao usuario.

## Alteracoes

- Criado `src/features/emergency-home/emergencyStartCreatedActionsPolicy.ts`.
- Criada funcao `resolveEmergencyStartCreatedActions()`.
- `app/index.tsx` passou a usar a policy apos `resolveEmergencyStartPresentation()`.
- O componente continua responsavel por:
  - chamar `startEmergencyPackage()`;
  - chamar `refreshOutboxCount()`;
  - abrir chamada telefonica quando configurado;
  - registrar log operacional real;
  - aplicar `setRecordingStatus()`.
- Criado `scripts/emergency-start-created-actions-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:emergency-start-created-actions`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida do Node 20.16.0.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, `Authorization`, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.
- `npm run typecheck`: sem erro emitido, mas travou sem CPU e foi encerrado para nao deixar processo pendurado.

## Seguranca e privacidade

- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- A policy nao cria pacote, nao abre telefone, nao acessa midia e nao chama API; apenas declara log e status derivados da apresentacao inicial.
- O log contem apenas `localVideoEnabled`, `locationCaptured` e plataforma; nao inclui token, chave, SDP/ICE, path local, coordenada ou conteudo de midia.

## Android fisico

Sem build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica continua reservada para mudancas operacionais em chamada, camera, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Fechar junto com a Etapa 1.88, pois ambas reduzem o bloco de inicio do SOS sem alterar comportamento operacional.
