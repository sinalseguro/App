# Checkpoint - Etapa 1.33 live call waiting dialog policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a apresentacao do dialogo exibido quando o usuario tenta chamar um anjo antes de existir sessao remota, sem alterar WebRTC, autochamada, aceite do anjo, backend, storage, notificacao, gravacao ou layout.

## Alteracoes

- Criado `src/features/emergency-home/liveCallWaitingDialogPolicy.ts`.
- Criado gate focado `scripts/live-call-waiting-dialog-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveLiveCallWaitingDialogPresentation()` para titulo, mensagem e label de confirmacao.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:live-call-waiting-dialog`.

## Validacoes

- `npm run test:live-call-waiting-dialog`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura de apresentacao. Validacao fisica/performance continua reservada para mudancas operacionais em WebRTC, camera, chamada, gravacao, backend ou UX nativa.
