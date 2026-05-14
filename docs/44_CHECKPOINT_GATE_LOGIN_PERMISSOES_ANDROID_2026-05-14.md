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

## Validacao fisica

A primeira tentativa ficou bloqueada porque o dispositivo nao apareceu por USB e o endpoint Wi-Fi recusou conexao. Depois da reativacao de USB/Wi-Fi por Roberto, a validacao foi concluida por ADB Wi-Fi.

Resultado:

- instalacao do APK: `Success`;
- gate inicial exibido antes da Home;
- consentimentos e permissoes ja estavam concedidos no aparelho;
- login Google real acionado pela conta do aparelho;
- apos login, Home liberada;
- relaunch do app manteve acesso a Home;
- navegacao por `Anjos`, `Convite recebido` e `Perfis e papeis` funcionou;
- crash scan saneado sem padroes fatais do processo SinalSeguro.

Evidencias saneadas:

- `docs/evidencias/android/2026-05-14-gate-login-permissoes-final/`

## Publicacao no portal

Publicacao concluida no portal publico com linguagem de usuario final e nome estavel de arquivo:

- URL Android: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk`
- Pagina estavel: `https://www.sinalseguro.com.br/baixar/android`
- QR estavel: `https://www.sinalseguro.com.br/assets/app/sinalseguro-android-qr.svg`
- Manifesto: `https://www.sinalseguro.com.br/downloads/installers.json`
- Checksums: `https://www.sinalseguro.com.br/downloads/private/checksums.txt`
- Release EC2: `/var/www/sinalseguro/releases/20260514T185240Z`

Validacoes pos-deploy:

- `/baixar`, `/baixar/android`, `/baixar/ios`, `/versoes`, manifesto, QR, checksum e APK retornaram `200`;
- APK remoto tem SHA-256 `3f2d4b9ca6ba764979d4515d00712191fbda94dd0b164765e9d4ad9d70635897`;
- `sudo nginx -t`: aprovado;
- `cereusia-crm`: ativo;
- `sinalseguro-api`: ativo.

## Proximo passo

Roberto pode instalar o APK pelo portal em outro Android fisico e testar o fluxo completo entre dois aparelhos: login Google, convite de anjo, aceite do convite e comportamento de cada papel.
