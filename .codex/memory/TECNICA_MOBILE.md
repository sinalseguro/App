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
- Preferencias de camera foram preparadas em `localVideoCapture`, sem permissao real.
- APK debug atualizado foi gerado por `./gradlew assembleDebug`.
- Encerramento de chamado ativo pelo Cofre agora passa por `BrandedDialog` e respeita `finishSafety.requireCode`.
- `BrandedDialog` tem `ScrollView` interno para modais com player/cofre em telas menores.
- `EmergencySettingsDrawer` evita `Pressable` dentro de `Pressable`; `Modo atual` e ajuda sao controles separados.
- `release:android:readiness` passa com Node 24 via `PATH="/Applications/Codex.app/Contents/Resources:$PATH"`.

## Pendencias tecnicas

- Reinstalar APK no Android quando o ADB detectar aparelho.
- Validar splash nativa instalada, nao apenas preview web.
- Evoluir adaptadores de outbox/API quando backend estiver pronto.
- Nao colocar blobs de midia no `SecureStore`; midia futura deve ir para arquivo criptografado do app.
