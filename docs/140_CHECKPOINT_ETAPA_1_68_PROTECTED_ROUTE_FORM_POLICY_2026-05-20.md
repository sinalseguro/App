# Checkpoint - Etapa 1.68 protected route form policy

Data: 2026-05-20

## Status

Refatoracao pura implementada e validada.

## Escopo

Consolidar em policy reutilizavel os patches do formulario de rota protegida por codigo, reduzindo repeticao de `setProtectedRouteRequest`, `setProtectedRouteCodeInput`, `setProtectedRouteError` e `setMenuOpen` sem alterar o comportamento de bloqueio.

## Alteracoes

- Criado `src/features/emergency-home/protectedRouteFormPolicy.ts`.
- Criadas funcoes:
  - `resolveProtectedRouteRequestFormPatch()`;
  - `resolveProtectedRouteAcceptedFormPatch()`;
  - `resolveProtectedRouteClosedFormPatch()`;
  - `resolveProtectedRouteErrorFormPatch()`.
- `app/index.tsx` passou a aplicar patches de rota protegida por `applyProtectedRouteFormPatch()`, mantendo os efeitos React no componente.
- O fluxo preserva:
  - fechamento do menu ao pedir codigo;
  - manutencao do destino solicitado;
  - exibicao de erro quando o codigo falha;
  - limpeza do formulario quando o usuario aceita ou fecha o dialogo;
  - `unlockProtectedAccess()` e navegacao apos aceite valido.
- Criado `scripts/protected-route-form-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:protected-route-form`: aprovado.
- `npm run test:protected-route-access`: aprovado.
- `npm run test:protected-route-code`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm test`: aprovado.
- `git diff --check`: aprovado apos saneamento do pack local corrompido.
- Varredura dirigida nos arquivos alterados: sem token, `Authorization`, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou payload P2P novo.

## Observacoes de ambiente

- `npm run typecheck` nao emitiu erro, mas ficou preso no Node local ate ser interrompido por controle operacional.
- `npm run lint` encontrou `ETIMEDOUT` ao ler documentacao em iCloud, sem achado de segredo; a varredura dirigida dos arquivos alterados passou.
- O reparo Git desta rodada foi restrito a quarentena de packs/refs locais corrompidos, sem alterar arquivos de codigo do usuario.

## Android fisico

Sem build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. O daemon ADB foi reiniciado, mas nenhum dispositivo foi listado no momento da checagem. Validacao fisica continua reservada para mudancas operacionais em camera, chamada, gravacao, WebRTC, backend ou UX nativa real.

## Proxima recomendacao

Seguir com mais uma dupla de baixo risco somente depois de fechar commit/push desta rodada. Candidatos: aplicadores de dialogo e builders de apresentacao que ainda aparecem inline em `app/index.tsx`.
