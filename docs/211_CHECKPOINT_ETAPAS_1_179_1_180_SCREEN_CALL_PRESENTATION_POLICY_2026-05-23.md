# Checkpoint - Etapas 1.179 e 1.180 - Policies visuais de SafeScreen e EmergencyCallButton

Data: 2026-05-23

## Escopo

Refatoracao presentational em duas fatias pequenas, seguindo o fluxo SS com revisao proporcional de Cristine/Eliane/Lina:

- Etapa 1.179: `SafeScreen` passou a usar `safeScreenPresentationPolicy` para defaults de exibicao e ajustes de texto.
- Etapa 1.180: `EmergencyCallButton` passou a usar `emergencyCallButtonPresentationPolicy` para copy publica, labels do modal e tamanhos de icone.

## Arquivos alterados

- `src/components/SafeScreen.tsx`
- `src/components/safeScreenPresentationPolicy.ts`
- `src/components/EmergencyCallButton.tsx`
- `src/components/emergencyCallButtonPresentationPolicy.ts`
- `scripts/screen-components-presentation-policy.test.ts`
- `scripts/smoke-test.mjs`
- `package.json`

## Contratos preservados

- `SafeScreen` continua responsavel por `SafeAreaView`, `ScrollView`, `AppTopBar`, `BrandLockup`, JSX, estilos e tema.
- `EmergencyCallButton` continua responsavel por `useState`, `BrandedDialog`, `ButtonIcon`, `PhoneCall`, `theme.colors`, callbacks, JSX e `Linking.openURL("tel:190")`.
- A policy de chamada publica nao contem `tel:190`, `Linking`, tema, icones, React, storage, API, Share, router ou efeitos.
- A ligacao real para 190 permanece fixa no componente, nao em policy externa.
- `PanicButton`, SOS/WebRTC, cofre, player, backend, storage e publicacao ficaram fora do escopo desta rodada.

## Validacoes

- `npm run test:screen-components-presentation`: aprovado.
- `npm run test:presentation-components`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado, mantendo a pendencia local conhecida de Node 20.16.0 para release publico.
- `npm test`: aprovado.

## Risco e decisao

A primeira microtriagem considerou `PanicButton`, mas a revisao especializada recomendou evitar SOS visual nesta rodada. A decisao final foi manter `PanicButton` intacto e usar `SafeScreen` + `EmergencyCallButton`, com guardrail explicito para que o telefone real `tel:190` permaneca no componente.

## Proxima recomendacao

Executar nova microtriagem antes da proxima dupla. Evitar `PanicButton`, `AppTopBar`, `BrandedDialog`, `ProtectedAccessGate`, `EvidencePlayerCard`, `LocalEvidenceRail`, `EmergencyPackageCard`, SOS/WebRTC, cofre, player, backend e storage sem rodada dedicada de risco e validacao fisica.
