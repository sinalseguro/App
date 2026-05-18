# Checkpoint - Etapa 1.37 finish progress state policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao de estado do progresso de encerramento da Home/SOS, sem alterar os efeitos reais de encerramento, cofre local, criptografia, camera, gravacao, WebRTC, backend, storage ou layout.

## Alteracoes

- Criado `src/features/emergency-home/finishProgressStatePolicy.ts`.
- Criado gate focado `scripts/finish-progress-state-policy.test.ts`.
- `app/index.tsx` passou a usar:
  - `idleFinishProgressState`;
  - `resolveNextFinishProgressState()`;
  - `resolveClosedFinishProgressState()`;
  - `resolveVaultOpeningFinishProgressState()`.
- `showFinishProgress()`, `closeFinishProgress()` e `openVaultFromFinishProgress()` preservam os mesmos efeitos e callbacks reais, mas com regra pura testavel.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:finish-progress-state`.

## Validacoes

- `npm run test:finish-progress-state`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura de estado React/TypeScript. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Continuar com a segunda fatia da rodada: extrair a decisao de navegacao da Home/SOS, preservando `router.push()` e fechamento do menu em `app/index.tsx`.
