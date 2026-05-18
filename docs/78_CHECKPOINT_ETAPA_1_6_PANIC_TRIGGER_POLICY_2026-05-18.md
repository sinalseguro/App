# Checkpoint Etapa 1.6 - Politica Pura do Botao SOS

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Cristine, Eliane, Katia e Lucena
Status: etapa concluida localmente, sem alteracao de UX, backend, portal ou release publica.

## Objetivo

Continuar a refatoracao incremental da Home/SOS com uma fatia pequena, testavel e sem mudanca de comportamento: separar a decisao do botao SOS de `app/index.tsx`.

## Implementacao

- Criado `src/features/emergency-home/panicTriggerPolicy.ts`.
- Movidos para politica pura:
  - decisao de ignorar acionamento enquanto o chamado esta sendo criado;
  - decisao de mostrar progresso de protecao de midia quando a camera ja foi encerrada;
  - decisao de encerrar chamado ativo;
  - gate de consentimento para gravacao local;
  - decisao de iniciar novo pacote SOS;
  - rotulo do `PanicButton` conforme estado da Home.
- `app/index.tsx` passou a chamar `resolvePanicTriggerDecision()` e `panicButtonLabel()`, preservando textos, botoes, modais e fluxo operacional existentes.
- Criado `scripts/panic-trigger-policy.test.ts`.
- `package.json` ganhou `npm run test:panic-trigger` e incluiu o gate em `npm test`.
- `scripts/smoke-test.mjs` passou a exigir a politica pura e o teste dedicado.

## Contratos Preservados

- Sem alteracao em layout, identidade visual, rotas, backend, portal, release ou permissoes.
- O botao SOS continua:
  - ignorando duplo acionamento durante criacao do pacote;
  - mostrando protecao de video quando a midia esta pendente;
  - encerrando chamado ativo;
  - exigindo consentimento antes de gravacao local;
  - iniciando novo SOS quando permitido.
- O gate de consentimento continua usando termos, privacidade e compartilhamento emergencial local.
- EC2/API segue como plano de controle, sinalizacao e auditoria; audio/video bruto permanece fora do backend.

## Gate de Seguranca

- A refatoracao moveu apenas regra pura, sem novo storage, endpoint, permissao, log runtime, payload persistido ou chamada de rede.
- Varredura dirigida dos arquivos tocados nao encontrou log runtime novo nem tokens, `Authorization`, `id_token`, `encrypted_key`, SDP, ICE, URI/path de midia ou payload P2P.
- Ocorrencias encontradas na varredura foram somente `console.log` do teste e `candidateCount` de recuperacao de midia ja existente em `app/index.tsx`.

## Validacoes

- `npm run test:panic-trigger`: aprovado.
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

Prosseguir com outra fatia pequena e testavel da Home/SOS somente se continuar sem alterar UX. Proxima area indicada: extrair uma politica pura para mensagens/estado de sincronizacao remota do SOS ativo, mantendo `app/index.tsx` como orquestrador ate haver testes suficientes.
