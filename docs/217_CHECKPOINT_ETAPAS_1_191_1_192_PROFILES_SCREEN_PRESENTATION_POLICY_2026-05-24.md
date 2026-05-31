# Checkpoint - Etapas 1.191 e 1.192 - Tela de perfis

Data: 2026-05-24

## Escopo

Refatoracao presentational de baixo risco na tela de perfis, mantendo regras de maioridade, armazenamento seguro, navegacao, convites, backend e fluxos reais inalterados.

## Etapas

- Etapa 1.191: criada `src/features/profiles/profilesScreenPresentationPolicy.ts` para centralizar copy da tela, status locais e aviso de limites.
- Etapa 1.192: a mesma policy centraliza parametros visuais de icones, text-fit dos cards de perfil, text-fit do status discreto e apresentacao do botao de retorno para anjos.

## Limites preservados

- `app/perfis.tsx` continua responsavel por `getActiveProtectionProfile`, `saveActiveProtectionProfile`, `useEffect`, `setProfile`, `setStatus` e `router.push("/contatos")`.
- `src/features/profiles/profilePolicy.ts` continua responsavel por regras de maioridade, convites, aceite como anjo e autorizacao para entrega futura.
- `ProfileOptionCard` e `ProfilesContinueButton` continuam componentes locais apresentacionais sem storage, API, Share, navegacao real ou estado real.
- Nao houve mudanca em SOS, PanicButton, WebRTC, cofre/player runtime, login, gate protegido, backend, portal ou release.

## Validacoes executadas

- `npm run test:profiles`
- `node scripts/smoke-test.mjs`
- `npm run typecheck`
- `npm run lint`

Todas aprovadas nesta etapa.

## Observacao de build

Build/instalacao Android nao foram executados porque esta fatia altera apenas policy pura de apresentacao e componente React sem runtime nativo.
