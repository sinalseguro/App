# Checkpoint - Etapa 1.65 emergency start runtime policy

Data: 2026-05-19

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair as acoes iniciais de runtime ao iniciar o SOS, sem alterar criacao do pacote, chamada telefonica, sincronizacao backend, cofre, WebRTC, UX ou layout.

## Alteracoes

- Criado `src/features/emergency-home/emergencyStartRuntimePolicy.ts`.
- Criada funcao `resolveEmergencyStartRuntimeActions()`.
- `app/index.tsx` passou a obter da policy:
  - status inicial `Pedindo ajuda...`;
  - log saneado `emergency_start_requested`;
  - limpeza de sessao remota ao iniciar novo SOS;
  - limpeza de estados de autochamada;
  - reset da chamada ao vivo;
  - marcacao de inicio em progresso.
- Os efeitos reais continuam em `app/index.tsx`: resetar chamada, limpar refs, atualizar estados React e registrar log operacional.
- Criado `scripts/emergency-start-runtime-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:emergency-start-runtime`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Android fisico

ADB confirmou o Android `23129RA5FL` via Wi-Fi nesta rodada, mas nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. Validacao fisica/performance continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Concluir o grupo com a extracao da falha controlada de inicio do SOS.
