# Checkpoint Etapa 1.7 - Politica Pura de Status da Sincronizacao SOS

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Cristine, Eliane, Katia e Lucena
Status: etapa concluida localmente, sem alteracao de UX, backend, portal ou release publica.

## Objetivo

Continuar a refatoracao incremental da Home/SOS com uma fatia pequena, testavel e sem mudanca de comportamento: separar as mensagens e decisoes visuais da sincronizacao remota do SOS ativo.

## Implementacao

- Criado `src/features/emergency-home/remoteSyncStatusPolicy.ts`.
- Movidos para politica pura:
  - mensagem quando o SOS foi registrado na EC2/API e tem anjo destinatario;
  - mensagem quando o SOS foi registrado, mas ainda aguarda anjo disponivel;
  - mensagem quando falta login para avisar anjos pela internet;
  - mensagem generica de nova tentativa de sincronizacao;
  - decisao de expor `remoteSessionId` para a Home iniciar evidencia de chamada ao vivo.
- `app/index.tsx` passou a usar `resolveActiveRemoteSyncStatus()` e `activeRemoteSyncRetryMessage()`.
- Criado `scripts/remote-sync-status-policy.test.ts`.
- `package.json` ganhou `npm run test:remote-sync-status` e incluiu o gate em `npm test`.
- `scripts/smoke-test.mjs` passou a exigir a politica pura e o teste dedicado.

## Contratos Preservados

- Sem alteracao de layout, textos visiveis, fluxo de usuario, backend, portal, release, permissao, storage ou endpoint.
- EC2/API segue como plano de controle, sinalizacao e auditoria; audio/video bruto permanece fora do backend.
- A Home continua responsavel por orquestrar chamada de API, armazenamento local, live-call e estado React.
- A politica nova nao cria nem registra `packageId`, token, payload P2P, SDP/ICE, URI/path de midia ou dados pessoais.

## Gate de Seguranca

- Codex Security aplicado como validacao dirigida de diff.
- Rubrica:
  - sem novo storage;
  - sem novo endpoint ou rede;
  - sem nova permissao;
  - sem log runtime sensivel;
  - sem expor token, `Authorization`, `id_token`, `encrypted_key`, SDP, ICE, URI/path de midia ou payload P2P.
- Varredura dirigida no diff nao encontrou padroes sensiveis.

## Validacoes

- `npm run test:remote-sync-status`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia ambiental conhecida de Node local `20.16.0`.
- `git diff --check`: aprovado.

## Limites

- Sem build Android nesta fatia, porque a mudanca e TypeScript puro/teste e nao altera UI visual, codigo nativo, permissao, backend, portal ou asset.
- Sem validacao fisica Android nesta fatia, porque nao houve publicacao nem mudanca operacional pretendida.
- Antes de publicar proxima release que inclua esta refatoracao, repetir validacao fisica Android do SOS/anjo.

## Proxima Recomendacao

Prosseguir com outra fatia pequena apenas se ela continuar pura/testavel. Proxima area indicada: extrair uma politica pura para decisao de autochamada do solicitante apos aceite do anjo, sem mover WebRTC runtime nem tocar `app/alerta.tsx`.
