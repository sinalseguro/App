# Checkpoint Etapa 1.20 - politica pura de confirmacao de encerramento por codigo

Data: 2026-05-18
Escopo: app mobile Android-first, refatoracao interna da Home/SOS.

## Objetivo

Extrair da Home a decisao apos a verificacao do codigo de seguranca no encerramento do chamado: finalizar imediatamente ou exibir erro mantendo o chamado ativo.

## Implementado

- Criado `src/features/emergency-home/finishCodePolicy.ts`.
- A policy decide:
  - finalizar direto quando o codigo nao e exigido;
  - bloquear com erro saneado quando a verificacao nao foi fornecida;
  - bloquear com a mensagem de falha quando o codigo esta incorreto ou bloqueado;
  - finalizar quando a verificacao retorna sucesso.
- `app/index.tsx` continua responsavel pelos efeitos reais:
  - chamar `verifySecurityCodeStatus()`;
  - atualizar `finishError`;
  - chamar `handleFinishActiveCall()`.
- Criado `scripts/finish-code-policy.test.ts`.
- `package.json` inclui `npm run test:finish-code`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura.

## Casos cobertos

- Encerramento sem exigencia de codigo finaliza direto.
- Codigo exigido sem verificacao mostra erro saneado.
- Codigo incorreto mostra erro e preserva chamado ativo.
- Codigo bloqueado mostra erro e preserva chamado ativo.
- Codigo correto permite finalizar.

## Seguranca e LGPD

- Mudanca restrita a regra pura/teste.
- A verificacao criptografica, lockout e armazenamento continuam em `src/security/protectedAccess.ts`.
- Nao adiciona endpoint, permissao, rede, storage, payload persistido, log runtime, backend ou portal.
- A policy nao conhece hash, salt, token, `Authorization`, `id_token`, `encrypted_key`, SDP/ICE, URI/path de midia, payload P2P, coordenada bruta ou chave privada.

## Validacoes

- `npm run test:finish-code`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida `node-local-debug` (`Node 20.16.0`; release publico exige `>=22.13.0`).
- `git diff --check`: aprovado antes deste checkpoint documental.

## Android/performance

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e refatoracao pura de decisao, sem alteracao de UX, renderizacao, camera, WebRTC, gravacao, backend ou portal.

## Decisao

A fatia e segura para continuidade da refatoracao. A Home/SOS ficou menor e a decisao do encerramento por codigo passou a ter contrato testavel sem alterar os efeitos reais.
