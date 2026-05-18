# Checkpoint Etapa 1.16 - politica pura de limpeza da chamada ao vivo

Data: 2026-05-18
Escopo: app mobile Android-first, refatoracao interna da Home/SOS.

## Objetivo

Extrair da Home a decisao de limpeza do estado de chamada ao vivo quando nao ha chamado ativo, inicio, encerramento ou processamento de midia em andamento.

## Implementado

- Criado `src/features/emergency-home/liveCallCleanupPolicy.ts`.
- A policy decide:
  - quando preservar o estado por existir pacote ativo;
  - quando preservar o estado por inicio de chamado em andamento;
  - quando preservar o estado por parada/protecao de midia em andamento;
  - quando preservar o estado por encerramento em andamento;
  - quando nao ha nada a limpar;
  - quando limpar a sessao remota e resetar chamada idle;
  - quando limpar a sessao remota e parar uma chamada ainda ativa/orfa.
- `app/index.tsx` continua responsavel pelos efeitos reais:
  - limpar refs de autochamada;
  - limpar `liveRemoteSessionId`;
  - chamar `resetLiveAudioCall()`;
  - chamar `stopLiveAudioCall()`.
- Criado `scripts/live-call-cleanup-policy.test.ts`.
- `package.json` inclui `npm run test:live-call-cleanup` no conjunto completo.
- `scripts/smoke-test.mjs` passou a exigir a policy pura para evitar regressao da regra inline na Home.

## Casos cobertos

- Nao limpar quando ha pacote ativo.
- Nao limpar durante inicio de chamado.
- Nao limpar durante parada/protecao de midia.
- Nao limpar durante encerramento.
- Nao agir quando nao ha sessao remota e chamada ja esta idle.
- Limpar sessao remota e resetar estado quando chamada esta idle mas sobrou sessao remota.
- Limpar sessao remota e parar chamada quando sobrou chamada ativa sem pacote operacional.

## Seguranca e LGPD

- Mudanca restrita a regra pura/teste.
- Nao adiciona endpoint, permissao, rede, storage, payload persistido, log runtime, backend ou portal.
- A policy nao conhece token, `Authorization`, `id_token`, `encrypted_key`, SDP/ICE, URI/path de midia, payload P2P, coordenada, chave privada ou hash bruto.
- Varredura dirigida nao encontrou novo vazamento sensivel no diff; o unico `console.log` novo fica no teste local dedicado.

## Validacoes

- `npm run test:live-call-cleanup`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida `node-local-debug` (`Node 20.16.0`; release publico exige `>=22.13.0`).
- `git diff --check`: aprovado.
- `adb devices -l`: dois Androids fisicos continuam visiveis, com transporte Wi-Fi/mDNS duplicado do Redmi tratado como mesmo aparelho.

## Android/performance

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e refatoracao pura de decisao, sem alteracao de UX, renderizacao, camera, WebRTC, gravacao, backend ou portal. O gate Android permanece: qualquer proxima alteracao operacional sensivel deve repetir validacao fisica owner -> anjo e, se houver sintoma de jank/startup, coletar `gfxinfo`/`meminfo` focado no aparelho 32-bit.

## Decisao

A fatia e segura para continuidade da refatoracao. A Home/SOS ficou menor e a regra de limpeza de chamada ao vivo passou a ter contrato testavel sem alterar efeitos reais.

## Proxima recomendacao

Continuar com outra regra pura pequena da Home/SOS. Se a proxima fatia tocar chamada real, camera, WebRTC, notificacao, gravacao ou UX, parar a refatoracao pura e executar validacao fisica completa antes de seguir.
