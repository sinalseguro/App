# Checkpoint - Etapa 1.91 - Finish Remote Sync Request Actions Policy

Data: 2026-05-21

## Escopo

Refatoracao pura no bloco de encerramento do chamado ativo, sem alterar UX, backend, WebRTC, camera, storage real, contrato de API ou release.

## Implementado

- Criada `src/features/emergency-home/finishRemoteSyncRequestActionsPolicy.ts`.
- A nova policy centraliza o plano inicial da sincronizacao remota final:
  - acoes de inicio vindas de `resolveFinishRemoteSyncStartActions()`;
  - modo remoto vindo de `resolveFinishRemoteSyncMode()`;
  - escolha entre `direct_finish` e `pending_sync` preservada.
- `app/index.tsx` continua responsavel pelos efeitos reais:
  - `queueEmergencyPackageForRemoteSync()`;
  - `finishRemoteEmergencySessionForPackage()`;
  - `syncPendingEmergencyPackagesWithApi()`;
  - progresso, log e estado React.
- Adicionado `scripts/finish-remote-sync-request-actions-policy.test.ts`.
- `scripts/smoke-test.mjs` e `package.json` passaram a exigir o novo gate.

## Validacoes

- `npm run test:finish-remote-sync-request-actions`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm run typecheck`: nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.

## Seguranca

- Nao houve novo endpoint, storage, permissao, segredo, token, payload persistido, SDP/ICE ou conteudo de midia.
- A nova policy apenas compoe decisoes puras ja existentes.
- Validacao dirigida Codex Security/Cristine aplicada no diff desta rodada.

## Resultado

Fatia 1.91 concluida. A sincronizacao remota final ficou mais legivel e testavel, mantendo o plano de controle na policy e os efeitos reais no componente.
