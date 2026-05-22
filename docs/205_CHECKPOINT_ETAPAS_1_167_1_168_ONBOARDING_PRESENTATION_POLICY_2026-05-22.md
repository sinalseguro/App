# Checkpoint - Etapas 1.167 e 1.168 - Onboarding presentation policy

Data: 2026-05-22

## Status

Refatoracao presentational implementada, validada e pronta para continuidade.

## Escopo executado

- Etapa 1.167: extraida `src/features/onboarding/onboardingPresentationPolicy.ts` para concentrar `onboardingScreenCopy`, `onboardingSteps` e tipos da tela `Boas-vindas`.
- Etapa 1.168: extraida `src/components/consentCardPresentationPolicy.ts` para normalizar a apresentacao do status do `ConsentCard`.
- `app/onboarding.tsx` continua responsavel apenas por montar `SafeScreen` e renderizar `ConsentCard`.
- `ConsentCard` continua componente visual; apenas delega o label de status para helper puro.

## Limites preservados

- Sem alteracao de layout, navegacao, autenticacao, SOS, WebRTC, cofre, player, backend, portal ou release.
- Sem novo storage, endpoint, permissao, coleta, persistencia, log sensivel, token, chave, telefone, coordenada, path local ou conteudo de midia.
- Textos continuam conservadores e nao prometem resposta oficial, protecao garantida, prova judicial, envio automatico ou gravacao oculta.

## Gates adicionados

- `scripts/onboarding-presentation-policy.test.ts` valida copy, ordem dos passos, status permitidos, ausencia de termos internos e ausencia de acoplamento com React Native, API, storage, Share ou roteamento nas policies.
- `scripts/smoke-test.mjs` agora exige a policy de onboarding, a policy do `ConsentCard` e bloqueia regressao para copy inline ou efeitos reais.
- `package.json` inclui `test:onboarding-presentation` na suite principal.

## Validacoes

- `npm run test:onboarding-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado; pendencia local conhecida de Node 20.16.0 versus requisito publico >=22.13.0.
- `git diff --check`: aprovado.

## Decisao

Sem build/instalacao Android nesta rodada porque a alteracao e puramente presentational e nao altera runtime nativo, chamada real, camera, microfone, cofre, player ou fluxo de midia.

## Proxima recomendacao

Continuar a refatoracao em duas fatias pequenas, escolhendo outra superficie de baixo risco apos nova leitura do estado atual. Evitar mexer em SOS/WebRTC/cofre/backend sem uma rodada dedicada de risco, testes e validacao fisica.
