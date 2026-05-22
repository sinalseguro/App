# Checkpoint - Etapas 1.161 e 1.162 - Policy Visual de Como Funciona

Data: 2026-05-22

## Escopo

Rodada SS de refatoracao presentational em `app/funcionamento.tsx`, mantendo duas fatias pequenas por vez.

- Etapa 1.161: mover o catalogo dos passos de `Como funciona` para policy pura `howItWorksPresentationPolicy`.
- Etapa 1.162: adicionar gate focado e smoke arquitetural para impedir regressao da policy.

## Alteracoes

- `src/features/onboarding/howItWorksPresentationPolicy.ts`
  - adiciona `howItWorksSteps` com `id`, `iconKey`, `title` e `text`;
  - mantem o catalogo como dados puros, sem JSX, tema, estilos, API, storage, permissao, Share, localizacao, camera, microfone ou navegacao.
- `app/funcionamento.tsx`
  - passa a importar `howItWorksSteps`;
  - mantem `SafeScreen`, titulo/subtitulo, grid, cards, estilos e renderizacao dos icones Lucide na tela;
  - adiciona `renderHowItWorksIcon()` para mapear `iconKey` para o icone visual.
- `scripts/how-it-works-presentation-policy.test.ts`
  - valida os 6 passos, a ordem publica, as chaves de icone e a ausencia de JSX no catalogo.
- `scripts/smoke-test.mjs`
  - passa a exigir a nova policy;
  - bloqueia retorno de catalogo inline na tela;
  - bloqueia JSX, tema, API, Share, storage e navegacao dentro da policy.
- `package.json`
  - adiciona `test:how-it-works-presentation`;
  - inclui o teste focado na suite `npm test`.

## Limites preservados

`app/funcionamento.tsx` continua responsavel por:

- tela `SafeScreen`;
- titulo, subtitulo, grid, card e estilos;
- renderizacao visual dos icones;
- composicao de UI.

A policy permanece responsavel apenas por dados publicos de apresentacao. Ela nao executa efeitos, nao acessa dados sensiveis, nao usa storage, nao navega, nao solicita permissao e nao promete resposta oficial, protecao garantida, prova judicial, envio automatico ou gravacao oculta.

## QA e seguranca

- Mudanca restrita a apresentacao local da tela `Como funciona`.
- Sem novo storage, endpoint, permissao, rede, payload persistido, backend, portal ou release.
- Textos publicos preservam tom conservador: apoio a rede de confianca, midia/localizacao apenas autorizadas, preservacao local e entrega autorizada.
- Nao introduz log novo, chave, token, hash, codigo, identity token, SDP, ICE, payload P2P, URI local, path de arquivo, coordenada, telefone, nome real novo ou conteudo de midia.
- Revisao Cristine/Eliane confirmou que a tela deve parar neste ponto apos sincronizar o smoke; o smoke foi atualizado para cobrir a policy nova.

## Validacoes

Aprovadas:

- `npm run test:how-it-works-presentation`
- `node scripts/smoke-test.mjs`
- `npm run typecheck`
- `npm run lint`
- `npm run private:android:readiness`
- `npm test`
- `git diff --check`

Observacoes:

- `npm run private:android:readiness` manteve a pendencia local ja conhecida: Node 20.16.0 abaixo do requisito de release publica, aceitavel para build privado debug.
- Sem build/instalacao Android porque a fatia e presentational e nao altera runtime fisico, UX nativa, camera, microfone, gravacao, WebRTC real, storage de midia, cofre, player ou portal.

## Proxima recomendacao

Parar `app/funcionamento.tsx` neste ponto. A proxima rodada SS deve avaliar `app/convite.tsx` para extrair policy apresentacional do aceite, mantendo token, validacao backend, cache, aceite real e navegacao na tela.
