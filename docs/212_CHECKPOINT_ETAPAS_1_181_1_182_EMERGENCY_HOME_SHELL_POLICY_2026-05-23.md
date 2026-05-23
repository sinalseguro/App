# Checkpoint - Etapas 1.181 e 1.182 - Policies visuais da Home

Data: 2026-05-23

## Escopo

Refatoracao presentational em duas fatias pequenas, seguindo o fluxo SS com revisao proporcional de Cristine/Eliane/Lina:

- Etapa 1.181: `EmergencyTopBar` passou a usar `emergencyTopBarPresentationPolicy` para label de contexto, icone do menu e exibicao do menu.
- Etapa 1.182: `EmergencySettingsDrawer` passou a usar `emergencySettingsDrawerPresentationPolicy` para ordem, labels, chaves simbolicas de icone, tamanho de icone, role e ajuste de texto do drawer.

## Arquivos alterados

- `src/features/emergency-home/EmergencyTopBar.tsx`
- `src/features/emergency-home/emergencyTopBarPresentationPolicy.ts`
- `src/features/emergency-home/EmergencySettingsDrawer.tsx`
- `src/features/emergency-home/emergencySettingsDrawerPresentationPolicy.ts`
- `scripts/emergency-home-shell-presentation-policy.test.ts`
- `scripts/smoke-test.mjs`
- `package.json`

## Contratos preservados

- `EmergencyTopBar` continua responsavel por `AppTopBar`, `menuOpen`, `onToggleMenu`, `onMenuPress={onToggleMenu}`, JSX e props reais.
- `EmergencySettingsDrawer` continua responsavel por `Pressable`, `Text`, `View`, `StyleSheet`, `theme`, icones Lucide, `onNavigate`, rotas e paineis reais.
- A policy do drawer nao contem rotas nem paineis; os destinos `/arquivos` + `cofre`, `/arquivos` + `player`, `/contatos`, `/alerta`, `/perfis` e `/configuracoes` permanecem no componente.
- `AppTopBar`, `PanicButton`, `BrandedDialog`, gate protegido, cofre, player, SOS/WebRTC, backend, storage e publicacao ficaram fora do escopo desta rodada.

## Validacoes

- `npm run test:emergency-home-shell-presentation`: aprovado.
- `npm run test:action-components-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: pronto para build privado condicionado, mantendo a pendencia local conhecida de Node 20.16.0 para release publico.
- `npm test`: aprovado.

## Risco e decisao

O drawer leva a areas sensiveis como cofre e player, por isso as rotas permaneceram no componente e nao foram movidas para a policy visual. A policy ficou restrita a apresentacao e o smoke bloqueia retorno de jargao tecnico como `backend/P2P`.

## Proxima recomendacao

Executar nova microtriagem antes da proxima dupla. Evitar `PanicButton`, `AppTopBar`, `BrandedDialog`, `ProtectedAccessGate`, `EvidencePlayerCard`, `LocalEvidenceRail`, `EmergencyPackageCard`, SOS/WebRTC, cofre, player, backend e storage sem rodada dedicada de risco e validacao fisica.
