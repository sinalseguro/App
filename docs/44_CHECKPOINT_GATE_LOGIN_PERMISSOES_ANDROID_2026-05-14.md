# Checkpoint - Gate de login, consentimentos e permissoes Android

Data: 2026-05-14
Coordenacao: Ze
Especialistas considerados: Katia, Doneda, Cristine, Eliane, Lina, Tarcila, Demi e Tereza

## Objetivo

Atender ao ajuste solicitado por Roberto: o app nao deve liberar acesso antes de login, aceite legal e permissoes concedidas no Android, usando a conta Google do aparelho para autenticacao.

## Implementacao

Arquivos alterados:

- `app/_layout.tsx`
- `src/features/access/AccessGate.tsx`

Comportamento novo:

- o layout raiz envolve o Stack principal com `AccessGate`;
- sem acesso validado, o usuario ve apenas a tela `Preparar acesso`;
- a Home, SOS, Cofre, Anjos, Convite, Perfis e Configuracoes ficam indisponiveis ate o gate ser concluido;
- a rota `oauthredirect` permanece liberada para retorno tecnico de autenticacao quando necessario.

## Regras do gate

O acesso so e liberado quando todos os itens abaixo estao completos:

- sessao SinalSeguro com usuario autenticado;
- aceite de termos;
- aceite de privacidade;
- aceite de uso emergencial/compartilhamento de dados;
- permissao de camera;
- permissao de microfone;
- permissao de localizacao em primeiro plano;
- permissao de notificacoes.

## Login Google

No Android, o fluxo usa Google Sign-In nativo quando o build esta com `EXPO_PUBLIC_GOOGLE_OIDC_WEB_CLIENT_ID` configurado.

O build desta rodada confirmou carregamento de `.env.local` pelo Expo, sem expor valores sensiveis nos logs preservados.

## Artefato gerado

- APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- SHA-256: `3f2d4b9ca6ba764979d4515d00712191fbda94dd0b164765e9d4ad9d70635897`
- Tamanho visual: `81M`
- Build: debug bundled Android, `arm64-v8a`

## Validacoes locais aprovadas

- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run typecheck`
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run lint`
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm test`
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run private:android:readiness`
- `node scripts/prepare-android-bundled-debug.mjs`
- `:app:assembleDebug -PsinalBundleDebugJs=true -PreactNativeArchitectures=arm64-v8a`
- `git diff --check` nos arquivos alterados

## Bloqueio de validacao fisica

O APK ainda nao foi instalado nesta rodada porque o dispositivo nao ficou disponivel para ADB:

- `adb devices -l`: sem aparelho listado;
- `system_profiler SPUSBDataType`: sem Android/ADB/MTP visivel no USB;
- `adb mdns services`: encontrou endpoint Wi-Fi `192.168.0.5:42471`;
- `adb connect 192.168.0.5:42471`: `Connection refused`.

## Decisao de publicacao

Nao publicar este APK novo no portal como release validado enquanto faltar o teste fisico real.

Antes de publicar, executar no Android fisico:

1. instalar o APK novo;
2. abrir o app e confirmar que a Home fica bloqueada;
3. entrar com Google usando a conta do aparelho;
4. aceitar termos, privacidade e uso emergencial;
5. conceder camera, microfone, localizacao e notificacoes;
6. confirmar abertura da Home apos concluir o gate;
7. acessar Anjos, Convite e Perfis;
8. verificar logcat saneado sem crash fatal do processo SinalSeguro.

## Proximo passo

Reconectar o Android por USB com transferencia de dados/depuracao autorizada ou reativar Depuracao sem fio com novo endpoint pareado. Depois repetir instalacao, login real e validacao visual/logs antes de publicar no portal.
