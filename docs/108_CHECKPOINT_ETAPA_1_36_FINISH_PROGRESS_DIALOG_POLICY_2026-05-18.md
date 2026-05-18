# Checkpoint - Etapa 1.36 finish progress dialog policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a apresentacao do dialogo de progresso de encerramento da Home/SOS, sem alterar o estado real do encerramento, cofre local, criptografia, camera, gravacao, WebRTC, backend, storage ou layout.

## Alteracoes

- Criado `src/features/emergency-home/finishProgressDialogPolicy.ts`.
- Criado gate focado `scripts/finish-progress-dialog-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveFinishProgressDialogPresentation()` para:
  - normalizar progresso;
  - decidir se o modal pode fechar;
  - decidir icone/tonalidade;
  - centralizar labels e textos de acoes.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:finish-progress-dialog`.

## Validacoes

- `npm run test:finish-progress-dialog`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura que preserva a mesma logica visual ja existente. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Continuar com mais uma rodada de duas fatias puras se a proxima demanda for refatoracao da Home/SOS. Antes de qualquer alteracao operacional, fazer build/instalacao e validacao fisica nos Androids conectados.
