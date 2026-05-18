# Checkpoint Etapa 1.21 - politica pura de rota protegida por codigo

Data: 2026-05-18
Escopo: app mobile Android-first, refatoracao interna da Home/SOS.

## Objetivo

Extrair da Home a decisao apos a verificacao do codigo para rotas protegidas: ignorar ausencia de solicitacao, exibir erro ou liberar acesso e navegar.

## Implementado

- Criado `src/features/emergency-home/protectedRouteCodePolicy.ts`.
- A policy decide:
  - ignorar quando nao ha rota protegida pendente;
  - bloquear com erro saneado quando a verificacao nao foi fornecida;
  - bloquear com a mensagem de falha quando o codigo esta incorreto ou bloqueado;
  - liberar acesso e navegar quando a verificacao retorna sucesso.
- `app/index.tsx` continua responsavel pelos efeitos reais:
  - chamar `verifySecurityCodeStatus()`;
  - atualizar `protectedRouteError`;
  - limpar solicitacao/campos;
  - chamar `unlockProtectedAccess()`;
  - navegar para a rota solicitada.
- Criado `scripts/protected-route-code-policy.test.ts`.
- `package.json` inclui `npm run test:protected-route-code`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura.

## Casos cobertos

- Sem rota pendente, nao executa fluxo.
- Rota pendente sem verificacao mostra erro saneado.
- Codigo incorreto bloqueia a area protegida.
- Codigo bloqueado mantem a area protegida bloqueada.
- Codigo correto libera e navega.

## Seguranca e LGPD

- Mudanca restrita a regra pura/teste.
- A verificacao criptografica, lockout e sessao protegida continuam em `src/security/protectedAccess.ts`.
- Nao adiciona endpoint, permissao, rede, storage, payload persistido, log runtime, backend ou portal.
- A policy nao conhece hash, salt, token, `Authorization`, `id_token`, `encrypted_key`, SDP/ICE, URI/path de midia, payload P2P, coordenada bruta ou chave privada.

## Validacoes

- `npm run test:protected-route-code`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida `node-local-debug` (`Node 20.16.0`; release publico exige `>=22.13.0`).
- `git diff --check`: aprovado antes deste checkpoint documental.

## Android/performance

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e refatoracao pura de decisao, sem alteracao de UX, renderizacao, camera, WebRTC, gravacao, backend ou portal.

## Decisao

A fatia e segura para continuidade da refatoracao. A Home/SOS ficou menor e a decisao de rota protegida por codigo passou a ter contrato testavel sem alterar os efeitos reais de desbloqueio e navegacao.
