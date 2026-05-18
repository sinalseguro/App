# Checkpoint - Etapa 1.26 protected route access policy

Data: 2026-05-18

## Status

Refatoracao pura implementada e validada.

## Escopo

Extrair a decisao inicial de acesso a rotas protegidas da Home/SOS, sem alterar criptografia, verificacao do codigo, armazenamento da sessao protegida, layout, backend ou navegacao final.

## Alteracoes

- Criado `src/features/emergency-home/protectedRouteAccessPolicy.ts`.
- Criado gate focado `scripts/protected-route-access-policy.test.ts`.
- `app/index.tsx` passou a usar `resolveProtectedRouteAccessDecision()` antes de abrir rota protegida ou solicitar codigo.
- A verificacao criptografica, lockout e desbloqueio continuam em `src/security/protectedAccess.ts`.
- `scripts/smoke-test.mjs` passou a exigir a policy.
- `package.json` recebeu `npm run test:protected-route-access`.

## Validacoes

- `npm run test:protected-route-access`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia conhecida de Node local.
- `git diff --check`: aprovado.
- Varredura dirigida do diff: sem token, Authorization, chave privada, `encrypted_key`, SDP/ICE, URI/path local de midia ou log runtime novo.

## Android fisico

Nao houve build nem teste fisico Android nesta fatia porque a mudanca e uma policy pura de decisao. ADB retornou somente o Redmi via Wi-Fi/mDNS no momento desta rodada; teste fisico fim a fim continua exigido apenas para mudancas operacionais em SOS, chamada, camera, WebRTC, gravacao, backend ou UX nativa.

## Proxima recomendacao

Continuar com mais duas fatias puras em `app/index.tsx`, priorizando regras de apresentacao/progresso ainda inline. Antes de qualquer build, reconfirmar dois Androids distintos em `adb devices -l` se a proxima etapa tocar runtime operacional.
