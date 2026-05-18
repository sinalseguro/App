# Checkpoint Etapa 1.10 - Politica Pura de Status de Processamento de Midia

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Cristine, Eliane, Katia e Lucena
Status: etapa concluida localmente, sem alteracao de UX, backend, portal ou release publica.

## Objetivo

Continuar a refatoracao incremental da Home/SOS com uma fatia pequena, testavel e sem mudanca de comportamento: separar as mensagens e o progresso visual emitidos durante o processamento da midia.

## Implementacao

- Criado `src/features/emergency-home/mediaProcessingStatusPolicy.ts`.
- Movidos para politica pura:
  - estados que liberam o waiter de camera/midia;
  - mensagens do handoff para chamada ao vivo;
  - titulos, detalhes, progresso e status do modal de encerramento/protecao da midia.
- `app/index.tsx` passou a usar `shouldResolveMediaReleaseWaiter()` e `resolveMediaProcessingPresentation()`.
- Criado `scripts/media-processing-status-policy.test.ts`.
- `package.json` ganhou `npm run test:media-processing-status` e incluiu o gate em `npm test`.
- `scripts/smoke-test.mjs` passou a exigir a politica pura e o teste dedicado.
- README atualizado para refletir a nova organizacao da Home/SOS.

## Contratos Preservados

- Sem alteracao de layout, textos visiveis, fluxo de usuario, backend, portal, release, permissao, storage ou endpoint.
- A Home continua responsavel pelos efeitos: `setRecordingStatus()`, `showFinishProgress()` e `resolveMediaReleaseWaiter()`.
- A politica nova nao abre camera, microfone, WebRTC, API, arquivo local ou backend.
- EC2/API segue como plano de controle, sinalizacao e auditoria; audio/video bruto permanece fora do backend.

## Gate de Seguranca

- Mudanca restrita a regra pura/teste.
- Sem novo storage, endpoint, permissao, rede, payload persistido ou log runtime.
- Varredura dirigida dos arquivos tocados nao encontrou token, `Authorization`, `id_token`, `encrypted_key`, SDP, ICE, URI/path de midia ou payload P2P em log runtime.
- O unico `console.log` novo esta no teste local dedicado, seguindo o padrao dos demais testes de politica.

## Validacoes

- `npm run test:media-processing-status`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia ambiental conhecida de Node local `20.16.0`.
- `git diff --check`: aprovado.
- ADB: dois Androids fisicos visiveis; o Redmi segue duplicado por transporte Wi-Fi/mDNS e nao deve ser contado como terceiro aparelho.

## Limites

- Sem build Android nesta fatia, porque a mudanca e TypeScript puro/teste e nao altera UI visual, codigo nativo, permissao, backend, portal ou asset.
- Sem perfil Android de performance nesta fatia, porque nao houve mudanca de runtime, camera, WebRTC, loop de midia ou renderizacao; o skill de performance fica reservado para a proxima mudanca operacional sensivel.
- Antes de publicar proxima release que inclua esta refatoracao, repetir validacao fisica Android do SOS/anjo.

## Proxima Recomendacao

A proxima fatia recomendada e a sugerida pelo especialista auxiliar: extrair a politica pura do resultado final de encerramento do SOS, desde que seja feita com teste dedicado e sem mover chamadas assincromas, camera, WebRTC, persistencia ou auditoria para dentro da politica.
