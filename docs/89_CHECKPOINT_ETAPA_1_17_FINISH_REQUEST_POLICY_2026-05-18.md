# Checkpoint Etapa 1.17 - politica pura de solicitacao de encerramento

Data: 2026-05-18
Escopo: app mobile Android-first, refatoracao interna da Home/SOS.

## Objetivo

Extrair da Home a decisao anterior ao encerramento real do chamado: ignorar quando nao pode encerrar, abrir confirmacao por codigo ou iniciar a finalizacao imediatamente.

## Implementado

- Criado `src/features/emergency-home/finishRequestPolicy.ts`.
- A policy decide:
  - ignorar quando nao ha pacote ativo;
  - ignorar quando o encerramento ja esta em andamento;
  - ignorar quando o ref interno de encerramento ja esta em andamento;
  - abrir confirmacao quando o codigo de seguranca e exigido;
  - iniciar finalizacao direta quando nao ha codigo exigido.
- `app/index.tsx` continua responsavel pelos efeitos reais:
  - limpar erro e input do codigo;
  - abrir modal de confirmacao;
  - chamar `handleFinishActiveCall()`.
- Criado `scripts/finish-request-policy.test.ts`.
- `package.json` inclui `npm run test:finish-request` no conjunto completo.
- `scripts/smoke-test.mjs` passou a exigir a policy pura para evitar regressao da regra inline na Home.

## Casos cobertos

- Sem pacote ativo nao prossegue.
- Encerramento em andamento nao prossegue.
- Ref interno de encerramento em andamento nao prossegue.
- Com codigo exigido, reseta formulario e abre confirmacao.
- Sem codigo exigido, reseta formulario e finaliza direto.

## Seguranca e LGPD

- Mudanca restrita a regra pura/teste.
- Nao adiciona endpoint, permissao, rede, storage, payload persistido, log runtime, backend ou portal.
- A policy nao conhece token, `Authorization`, `id_token`, `encrypted_key`, SDP/ICE, URI/path de midia, payload P2P, coordenada, chave privada ou hash bruto.
- Varredura dirigida do diff nao encontrou novo vazamento sensivel; o unico `console.log` novo fica no teste local dedicado.

## Validacoes

- `npm run test:finish-request`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida `node-local-debug` (`Node 20.16.0`; release publico exige `>=22.13.0`).
- `git diff --check`: aprovado.
- `adb devices -l`: dois Androids fisicos continuam visiveis, com transporte Wi-Fi/mDNS duplicado do Redmi tratado como mesmo aparelho.

## Android/performance

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e refatoracao pura de decisao, sem alteracao de UX, renderizacao, camera, WebRTC, gravacao, backend ou portal.

O gate permanece: qualquer proxima alteracao operacional sensivel deve repetir validacao fisica owner -> anjo; se houver sintoma de startup/jank, coletar `gfxinfo`/`meminfo` focado no Android 32-bit.

## Decisao

A fatia e segura para continuidade da refatoracao. A Home/SOS ficou menor e a regra de solicitacao de encerramento passou a ter contrato testavel sem alterar o fluxo real de encerramento.

## Proxima recomendacao

Continuar com outra regra pura pequena da Home/SOS. Se a proxima fatia tocar chamada real, camera, WebRTC, notificacao, gravacao ou UX, interromper a sequencia de policies puras e executar validacao fisica completa antes de seguir.
