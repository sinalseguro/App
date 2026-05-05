# Memoria - Ada, Hedy e Margaret

Data: 2026-05-03  
Papel: arquitetura mobile React Native/Expo, SOS, Cofre e Android.

## Estado tecnico

- `AppTopBar`, `BrandedDialog` e `ResourceTile` sao componentes compartilhados.
- Home SOS permanece fixa e sem `SafeScreen`.
- Cofre local foi convertido para tela fixa por icones.
- `SafeScreen` ficou para paginas informativas/configuracoes.
- `PanicButton` usa pressao longa para acionar e encerrar.
- Singleton/idempotencia de chamado ativo permanece em `emergencyRecorder`.
- Build privado de midia local usa `EmergencyMediaRecorder` com `expo-camera` para gravar video/audio no sandbox do app.
- APK privado atualizado foi gerado por `npm run build:android:private`.
- Encerramento de chamado ativo pelo Cofre agora passa por `BrandedDialog` e respeita `finishSafety.requireCode`.
- `BrandedDialog` tem `ScrollView` interno para modais com player/cofre em telas menores.
- `EmergencySettingsDrawer` evita `Pressable` dentro de `Pressable`; `Modo atual` e ajuda sao controles separados.
- O gate privado vigente e `private:android:readiness`; o gate publico `release:android:readiness` deve bloquear enquanto o workspace contem instrumentacao privada de midia (`expo-camera`/`expo-video`).

## Pendencias tecnicas

- Validar manualmente no Android fisico o gesto SOS completo com camera em ambiente controlado.
- Evoluir adaptadores de outbox/API quando backend estiver pronto.
- Nao colocar blobs de midia no `SecureStore`; midia local deve permanecer em arquivo do sandbox do app com hash e criptografia por envelope na etapa de backend.

## Atualizacao tecnica - 2026-05-04

- `EmergencySettingsDrawer` recebe navegacao por painel: `Cofre` envia `/arquivos?painel=cofre` e `Player` envia `/arquivos?painel=player`.
- `app/arquivos.tsx` interpreta `painel` por `useLocalSearchParams` e abre o modal correspondente sem criar telas duplicadas.
- `BrandedDialog` usa backdrop pressionavel para fechar ao tocar fora; conteudo interno impede propagacao.
- `LocalEvidenceRail` abandonou a trilha horizontal e passou a usar grade vertical com acoes iconograficas por pacote.
- `PanicButton` mantem o anel SVG dentro da circunferencia do botao, com sentido horario para acionar e anti-horario para encerrar.

## Atualizacao tecnica - 2026-05-05 - checkpoint de pausa

- Implementacao pausada por pedido do Roberto para liberar espaco em disco.
- Nao rodar build ou instalacao Android ate nova autorizacao de continuidade.
- Ponto de retomada tecnico: revisar `EvidencePlayerCard`, `mediaCapture`, `types`, `LocalEvidenceRail`, `PanicButton`, `packagePresentation`, `contactMocks` e `scripts/smoke-test.mjs`.
- Risco tecnico principal ainda pendente: `mediaCapture` nao deve ler videos longos integralmente em Base64 para calcular hash; precisa limite e fallback de manifesto/hash tecnico ate streaming/chunking real.
- Retomar com validacao leve primeiro: `npm run typecheck`, `npm run lint`, `npm test`, `git diff --check`.
