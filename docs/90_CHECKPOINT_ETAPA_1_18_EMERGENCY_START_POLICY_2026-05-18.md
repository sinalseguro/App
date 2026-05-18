# Checkpoint Etapa 1.18 - politica pura de inicio do SOS

Data: 2026-05-18
Escopo: app mobile Android-first, refatoracao interna da Home/SOS.

## Objetivo

Extrair da Home a decisao inicial do acionamento SOS: politica do pacote local, captura de localizacao, atalho telefonico emergencial e mensagem inicial exibida apos criar o chamado.

## Implementado

- Criado `src/features/emergency-home/emergencyStartPolicy.ts`.
- A policy decide:
  - se deve capturar localizacao no pacote local;
  - qual modo de consentimento de localizacao sera passado ao motor de emergencia;
  - duracao padrao do pacote local;
  - tipo do pacote de teste/homologacao;
  - se o atalho telefonico emergencial deve ser aberto fora da web;
  - texto inicial de status com duracao e resultado da localizacao.
- `app/index.tsx` continua responsavel pelos efeitos reais:
  - listar relacionamentos aceitos;
  - chamar `startEmergencyPackage()`;
  - abrir o discador quando permitido;
  - iniciar sincronizacao remota;
  - registrar auditoria operacional saneada;
  - atualizar estados visuais da Home.
- Criado `scripts/emergency-start-policy.test.ts`.
- `package.json` inclui `npm run test:emergency-start` no conjunto completo.
- `scripts/smoke-test.mjs` passou a exigir a policy pura para evitar regressao da regra inline na Home.

## Casos cobertos

- Android com chamada 190 habilitada captura localizacao, preserva modo pre-autorizado e permite abrir discador.
- Web bloqueia captura local e discador, mas preserva o pacote local com duracao configurada.
- Mensagem inicial para gravacao ilimitada e localizacao capturada.
- Mensagem inicial para duracao em minutos e localizacao nao registrada.

## Seguranca e LGPD

- Mudanca restrita a regra pura/teste.
- Nao adiciona endpoint, permissao, rede, storage, payload persistido, log runtime, backend ou portal.
- A policy nao conhece token, `Authorization`, `id_token`, `encrypted_key`, SDP/ICE, URI/path de midia, payload P2P, coordenada bruta, chave privada ou hash bruto.
- Varredura dirigida do diff nao encontrou novo vazamento sensivel em runtime; o unico `console.log` novo fica no teste local dedicado.

## Validacoes

- `npm run test:emergency-start`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado pela pendencia local conhecida `node-local-debug` (`Node 20.16.0`; release publico exige `>=22.13.0`).
- `git diff --check`: aprovado antes deste checkpoint documental.

## Android/performance

Nao houve build, instalacao ou perfil Android nesta fatia porque a mudanca e refatoracao pura de decisao, sem alteracao de UX, renderizacao, camera, WebRTC, gravacao, backend ou portal.

O gate permanece: qualquer proxima alteracao operacional sensivel deve repetir validacao fisica owner -> anjo; se houver sintoma de startup/jank, coletar `gfxinfo`/`meminfo` focado no Android 32-bit.

## Decisao

A fatia e segura para continuidade da refatoracao. A Home/SOS ficou menor e a regra de inicio do chamado passou a ter contrato testavel sem alterar o fluxo real de acionamento.

## Proxima recomendacao

Continuar com outra regra pura pequena da Home/SOS, preferindo reduzir acoplamentos restantes sem mover side effects. Se a proxima fatia tocar chamada real, camera, WebRTC, notificacao, gravacao ou UX, interromper a sequencia de policies puras e executar validacao fisica completa antes de seguir.
