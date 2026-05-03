# 25 - Correcao do travamento Android na abertura

Data: 2026-05-03  
Coordenacao: Ze e Cristine  
Revisao: Margaret, Ada, Myers, Schneier e Tarcila

## Problema

O app instalado no Android ficava preso na splash nativa ao abrir. O aparelho estava conectado ao ADB por Wi-Fi (`192.168.0.4:5555`), mas o APK debug anterior tentava carregar o bundle JavaScript pelo Metro em `localhost:8081`.

Quando o Metro nao estava acessivel pelo dispositivo, o React Native nao carregava a tela raiz e a splash nativa permanecia visivel.

## Evidencia tecnica

O `logcat` da rodada anterior registrou falha de bundle:

- `Unable to load script`;
- tentativa de conexao em `localhost/127.0.0.1:8081`;
- ausencia de `index.android.bundle` dentro do APK debug comum.

## Correcao aplicada

- `app/_layout.tsx` ganhou fallback defensivo para ocultar a splash nativa por `useEffect`, alem do `onLayout`.
- `android/app/build.gradle` ganhou a propriedade `-PsinalBundleDebugJs=true`, que remove `debug` de `debuggableVariants` apenas quando solicitado.
- `MainApplication.kt` passou a usar `BuildConfig.DEBUG && !BuildConfig.SINAL_BUNDLED_DEBUG`, desligando o suporte nativo de desenvolvedor somente no APK bundled de validacao.
- `package.json` ganhou o comando `npm run build:android:debug:bundled`.
- O build privado atual usa o alias `npm run build:android:private` e o gate `npm run private:android:readiness`.
- O APK debug de validacao passou a embutir o bundle JS e assets, permitindo abrir sem Metro, sem `adb reverse` e sem consulta fatal ao packager.

## Validacao Android

Dispositivo detectado:

- `192.168.0.4:5555`;
- modelo `23129RA5FL`;
- produto `sapphire_global`.

USB fisico foi informado como conectado, mas `adb devices -l` enumerou apenas o transporte Wi-Fi nesta rodada. A instalacao foi feita pelo canal ADB ativo.

Com Metro desligado e `adb reverse --remove-all`, o app abriu a Home em cold start:

- `LaunchState: COLD`;
- `TotalTime: 5700`;
- sem `Unable to load script`;
- sem `Failed to connect`;
- sem `FATAL EXCEPTION`;
- sem `AndroidRuntime`.
- sem `setValueWithKeyAsync` no log isolado por PID.

## APK instalado

- Caminho: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256: `2bd9055863a51f46d4c41f24b768e22b25f43984990e0313f5fc4baa5d599c83`.
- Comando: `npm run build:android:debug:bundled`.
- Comando privado vigente: `npm run build:android:private`.

## Evidencias finais

- `docs/assets/mobile/2026-05-03-android-home-bundled.png`;
- `docs/assets/mobile/2026-05-03-android-configuracoes-bundled.png`;
- `docs/assets/mobile/2026-05-03-android-cofre-bundled.png`;
- `docs/assets/mobile/2026-05-03-android-sos-bundled-pos-localizacao.png`;
- `docs/assets/mobile/2026-05-03-android-cofre-pos-sos-bundled.png`.

## Resultado

Myers aprovou a validacao tecnica do bug de abertura: o app nao fica mais preso na splash quando instalado com o APK debug bundled.

Tarcila aprovou a continuidade visual para validacao: Home com marca no topo, botao SOS central com profundidade discreta, estado ativo com brilho/particulas e telas de Configuracoes/Cofre por icones.

Schneier e Doneda mantem os bloqueios de seguranca:

- camera e microfone seguem bloqueados no build publico;
- camera e microfone ficam habilitados apenas no APK privado de homologacao local;
- midia local no build privado permanece sem transmissao, upload, P2P ou compartilhamento externo;
- dados reais e chaves nao entram no Git;
- envio externo depende de backend, consentimento, contrato, auditoria e criptografia por envelope.

## Proxima acao

Na proxima fase, consolidar:

- endpoints reais de autenticacao, consentimentos, convites, alertas e atualizacao de app;
- OIDC Google/Apple sem segredos no repositorio;
- fluxo homologado de camera frontal/traseira/ambas somente apos aprovacao Doneda/Schneier;
- validacao visual final de Roberto no aparelho fisico.
