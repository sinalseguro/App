# Checkpoint Etapa 1.2 - Politica pura de sessao live-call

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Cristine, Eliane, Katia e Lucena
Status: etapa concluida localmente, sem alteracao de UX, backend, portal ou release publica.

## Objetivo

Continuar a refatoracao incremental no hotspot SOS/live-call com uma fatia pequena, testavel e sem mudanca de comportamento: separar regras puras da sessao de chamada ao vivo para reduzir o peso de `useLiveAudioCall.ts`.

## Implementacao

- Criado `src/features/live-call/liveCallSessionPolicy.ts`.
- Movidos para politica pura:
  - identificacao de payload SDP;
  - identificacao de payload ICE;
  - evento de auditoria por papel e tipo de evento;
  - status de evidencia local por papel;
  - papel oposto de sinalizacao;
  - decisao de renderizacao de stream remoto.
- `useLiveAudioCall.ts` passou a importar essas regras e continua responsavel apenas por orquestracao de WebRTC, polling, estado e chamadas API.
- Criado `scripts/live-call-session-policy.test.ts`.
- `package.json` ganhou `npm run test:live-call-session` e incluiu esse gate em `npm test`.

## Contratos Preservados

- Sem alteracao em `app/index.tsx`, `app/alerta.tsx`, `src/services/liveCallControl.ts`, backend, portal ou release.
- Owner continua transmitindo audio/video para o anjo.
- Anjo continua sendo o unico papel que renderiza o stream remoto da pessoa protegida.
- Sinalizacao continua respeitando `owner -> angel` para `offer/ice` e `angel -> owner` para `answer/ice`.
- Auditoria continua registrando eventos saneados por papel.
- EC2/API segue como plano de controle, sinalizacao e auditoria; audio/video bruto permanece fora do backend.

## Gate de Seguranca

- `liveAuditEvent`, `liveEvidenceStatusForRole` e `oppositeLiveSignalRole` agora exigem `LiveAudioRole` definido; isso evita fallback implicito para `owner`.
- `sendIceCandidate` so envia sinal quando `runtime.role` existe.
- SDP/ICE permanecem apenas como payload de transporte e dados de teste, sem novo log de runtime.
- Nenhum token, `Authorization`, `encrypted_key`, payload P2P, URI de midia, caminho local sensivel ou dado pessoal foi adicionado a logs.

## Validacoes

- `npm run test:live-call-session`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto condicionado pela pendencia ambiental conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida dos arquivos tocados: sem novo log runtime sensivel; ocorrencias de SDP/ICE ficam restritas a transporte/teste.

## Limites

- Sem build Android nesta fatia, porque a alteracao e TypeScript puro e nao toca UI, nativo, assets, backend ou publicacao.
- Sem validacao fisica Android nesta fatia, porque o fluxo operacional e visual nao mudou.
- Nao foram tocados `prepareMediaForOwnerLiveCall`, autoaceite em `app/alerta.tsx` nem encerramento do SOS em `app/index.tsx`.

## Proxima Recomendacao

Seguir para outra extracao pequena e testavel dentro de live-call antes de mexer nas telas:

- preferir politica pura ou adaptador sem side effects;
- manter `app/index.tsx` e `app/alerta.tsx` fora da proxima fatia ate existir teste suficiente;
- exigir ADB/teste fisico somente quando tocar camera, UI, autoaceite, handoff de midia ou encerramento do SOS.
