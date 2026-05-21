# Checkpoint - Etapa 1.70 protected route unlock actions policy

Data: 2026-05-20

## Status

Refatoracao pura implementada e validada.

## Escopo

Consolidar em policy pura a acao derivada da confirmacao por codigo em rotas protegidas, mantendo desbloqueio e navegacao reais dentro de `app/index.tsx`.

## Alteracoes

- Criado `src/features/emergency-home/protectedRouteUnlockActionsPolicy.ts`.
- Criada funcao `resolveProtectedRouteUnlockActions()`.
- `app/index.tsx` passou a transformar a decisao de `resolveProtectedRouteCodeDecision()` em:
  - patch de erro quando o codigo falha;
  - limpeza do formulario e alvo de navegacao quando o codigo e aceito;
  - ignorar com seguranca quando nao existe pedido de rota protegido.
- O componente continua responsavel por:
  - verificar codigo por `verifySecurityCodeStatus()`;
  - aplicar patch React por `applyProtectedRouteFormPatch()`;
  - executar `unlockProtectedAccess()`;
  - navegar por `navigateRoute()`.
- Criado `scripts/protected-route-unlock-actions-policy.test.ts`.
- `package.json` e `scripts/smoke-test.mjs` passaram a exigir o novo gate.

## Validacoes

- `npm run test:protected-route-unlock-actions`: aprovado.
- `npm run test:protected-route-code`: aprovado.
- `npm run test:protected-route-form`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida do Node 20.16.0.
- `npm run typecheck`: sem erro emitido, mas travou sem CPU e foi encerrado para nao deixar processo pendurado.
- `git diff --check`: aprovado.
- Varredura dirigida dos arquivos alterados: sem segredo ou payload sensivel novo.

## Seguranca e privacidade

- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- A policy nao chama `unlockProtectedAccess()`, nao navega e nao valida codigo.
- O desbloqueio so fica autorizado quando a decisao e `unlock_and_navigate` e existe pedido de rota protegido valido.

## Android fisico

Sem build, instalacao ou perfil Android nesta fatia porque a mudanca e uma policy pura. `adb devices -l` nao listou aparelhos no momento da checagem desta rodada; isso nao bloqueia a fatia por nao haver mudanca operacional.

## Proxima recomendacao

Depois do commit/push desta dupla, continuar com duas fatias de baixo risco em areas que ainda tenham decisao inline, evitando timers de chamada/remote sync ate haver necessidade objetiva.
