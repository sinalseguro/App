# Checkpoint Etapa 1.19 - politica pura de settlement da parada de midia

Data: 2026-05-18
Escopo: app mobile Android-first, refatoracao interna da Home/SOS.

## Objetivo

Extrair da Home a decisao de tratamento do retorno do gravador quando uma parada de midia e concluida: validar serial, decidir se o cofre/outbox deve ser atualizado, qual status inicial mostrar e quando atualizar o modal final.

## Implementado

- Ampliado `src/features/emergency-home/mediaProcessingStatusPolicy.ts`.
- A policy agora decide:
  - se o retorno do gravador pertence ao serial esperado;
  - se o resultado indica midia anexada ao cofre local;
  - se a Home deve atualizar a contagem do outbox;
  - qual mensagem de status exibir quando o video foi preservado;
  - quando substituir o modal por estado final `Video protegido`.
- `app/index.tsx` continua responsavel pelos efeitos reais:
  - resolver waiter de liberacao de midia;
  - registrar auditoria operacional saneada;
  - chamar `refreshOutboxCount()`;
  - atualizar `recordingStatus`;
  - aplicar `setFinishProgress()`;
  - concluir promessas pendentes do gravador.
- `scripts/media-processing-status-policy.test.ts` passou a cobrir settlement da parada de midia.
- `scripts/smoke-test.mjs` passou a exigir a nova regra pura para evitar regressao da logica inline.

## Casos cobertos

- Ignorar serial zero.
- Ignorar serial diferente do esperado.
- Aceitar apenas serial positivo igual ao esperado.
- Atualizar outbox/status quando ha arquivo anexado.
- Nao atualizar outbox/status quando nao ha asset anexado.
- Atualizar modal final apenas quando ele esta visivel e nao esta em estado `running`.

## Seguranca e LGPD

- Mudanca restrita a regra pura/teste.
- Nao adiciona endpoint, permissao, rede, storage, payload persistido, log runtime, backend ou portal.
- A policy nao conhece token, `Authorization`, `id_token`, `encrypted_key`, SDP/ICE, URI/path de midia, payload P2P, coordenada bruta, chave privada ou hash bruto.
- Varredura dirigida deve continuar tratando o `console.log` do teste local como permitido e logs operacionais existentes como saneados.

## Validacoes

- `npm run test:media-processing-status`: aprovado.
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

A fatia e segura para continuidade da refatoracao. A Home/SOS ficou menor e a regra de settlement da parada de midia passou a ter contrato testavel sem alterar efeitos reais do gravador.

## Proxima recomendacao

Continuar com outra regra pura pequena da Home/SOS. Se a proxima fatia tocar chamada real, camera, WebRTC, notificacao, gravacao ou UX, interromper a sequencia de policies puras e executar validacao fisica completa antes de seguir.
