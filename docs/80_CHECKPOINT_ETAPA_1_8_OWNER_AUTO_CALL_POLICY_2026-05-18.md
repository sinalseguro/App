# Checkpoint Etapa 1.8 - Politica Pura de Autochamada do Solicitante

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Cristine, Eliane, Katia e Lucena
Status: etapa concluida localmente, sem alteracao de UX, backend, portal ou release publica.

## Objetivo

Continuar a refatoracao incremental da Home/SOS com uma fatia pequena, testavel e sem mudanca de comportamento: separar a decisao de autochamada do solicitante apos aceite do anjo.

## Implementacao

- Criado `src/features/emergency-home/ownerAutoCallPolicy.ts`.
- Movidos para politica pura:
  - deteccao de chamada owner ja ativa para a sessao;
  - bloqueio quando a tentativa foi cancelada, pausada, ja iniciada ou esta em voo;
  - mensagem de tentativa de aviso ao anjo;
  - mensagem quando ainda nao ha anjo aceito;
  - mensagem e permissao para iniciar WebRTC quando existe destinatario aceito.
- `app/index.tsx` passou a usar `shouldAttemptOwnerAutoCall()`, `ownerAutoCallAttemptMessage()` e `ownerAutoCallRecipientStatus()`.
- Criado `scripts/owner-auto-call-policy.test.ts`.
- `package.json` ganhou `npm run test:owner-auto-call` e incluiu o gate em `npm test`.
- `scripts/smoke-test.mjs` passou a exigir a politica pura e o teste dedicado.

## Contratos Preservados

- Sem alteracao de layout, textos visiveis, fluxo de usuario, backend, portal, release, permissao, storage ou endpoint.
- A Home continua responsavel por chamar `listAcceptedLiveRecipients()`, preparar midia e iniciar `liveAudioCall.startOwnerAudioCall()`.
- A politica nova nao abre camera, microfone, WebRTC, API, arquivo local ou backend.
- EC2/API segue como plano de controle, sinalizacao e auditoria; audio/video bruto permanece fora do backend.

## Gate de Seguranca

- Mudanca restrita a regra pura/teste.
- Sem novo storage, endpoint, permissao, rede, payload persistido ou log runtime.
- Varredura dirigida do diff nao encontrou token, `Authorization`, `id_token`, `encrypted_key`, SDP, ICE, URI/path de midia ou payload P2P.

## Validacoes

- `npm run test:owner-auto-call`: aprovado.
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

Prosseguir somente com fatias puras/testaveis ou parar a refatoracao para build/validacao quando uma proxima etapa tocar WebRTC runtime, camera, `app/alerta.tsx`, encerramento do SOS ou midia local.
