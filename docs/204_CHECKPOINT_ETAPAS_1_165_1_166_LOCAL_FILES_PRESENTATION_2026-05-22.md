# Checkpoint - Etapas 1.165 e 1.166 - Apresentacao da tela Arquivos

Data: 2026-05-22

## Escopo

Refatoracao presentational da tela `Arquivos`, sem alterar cofre real, player, criptografia, Share nativo, exclusao local, encerramento de chamado, limpeza de residuos, abertura de mapa, paths locais ou fluxo UX.

## Executado

- Etapa 1.165: criada `src/features/emergency/localFilesPresentationPolicy.ts`.
- Etapa 1.166: criado `src/features/local-files/LocalFilesResourceGrid.tsx`.
- Adicionado `scripts/local-files-presentation-policy.test.ts`.
- Atualizado `scripts/smoke-test.mjs` para proteger a separacao entre apresentacao e efeitos reais.
- Atualizado `package.json` com `test:local-files-presentation`.

## Limites preservados

- `app/arquivos.tsx` continua responsavel por:
  - `listEmergencyPackages`;
  - `cleanupNativeMediaResidues`;
  - `runPlaintextMediaStorageMaintenance`;
  - `finishEmergencyPackage`;
  - `deleteEmergencyPackage`;
  - `Linking.canOpenURL` e `Linking.openURL`;
  - `checkAppUpdate`;
  - `router.push`;
  - estado React, dialogs reais e gate de acesso protegido.
- `EvidencePlayerCard` nao foi alterado.
- `LocalEvidenceRail` nao foi alterado.
- A policy nova apenas resolve textos, status, labels, atalhos e mensagens de apresentacao.
- A grade de atalhos apenas renderiza `ResourceTile` e chama callbacks recebidos da tela.

## Validacoes

- `npm run test:local-files-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm run test:crypto`: aprovado.
- `npm run test:protected-route-access`: aprovado.
- `npm run test:finish-code`: aprovado.
- `npm run test:finish-confirmation-dialog`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado; manteve apenas a pendencia local conhecida de Node 20.16.0 para release publico.
- `npm test`: aprovado.

## Seguranca e LGPD

- Nenhum token, segredo, credencial, path local real, coordenada real, payload P2P, SDP, ICE ou conteudo de midia foi adicionado.
- A decisao de abertura de mapa continua exigindo acao explicita e aviso sobre envio da localizacao exata ao app/servico escolhido.
- A exclusao local continua com confirmacao destrutiva e bloqueio para pacote em gravacao.
- O encerramento de chamado continua condicionado ao codigo quando a preferencia exigir.

## Decisao

Nao houve build Android nem instalacao fisica nesta rodada porque a mudanca e presentational e nao altera runtime nativo, midia, WebRTC, permissao, camera, microfone, cofre real, player real, API ou portal.

## Proxima recomendacao

Parar `app/arquivos.tsx` neste ponto. Proxima rodada deve priorizar outra superficie pequena e segura ou fazer uma revisao de cobertura das policies ja extraidas antes de tocar SOS, WebRTC, cofre real ou backend.
