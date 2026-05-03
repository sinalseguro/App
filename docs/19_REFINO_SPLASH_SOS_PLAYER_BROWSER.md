# 19 - Refino Splash, SOS, Player E Simulador Web

Data: 2026-05-03  
Responsavel: Ze  
Coordenacao mobile: Cristine  
Especialistas: Tarcila, Norman, Ada, Margaret, Kim, Hedy, Schneier, Doneda e Myers

## Contexto

Roberto reportou que a abertura ainda mostrava tela roxa vazia antes da splash com logo/loading, que o simulador no navegador nao funcionava, que o SOS precisava mudar visualmente quando ativo, que o encerramento exigia protocolo seguro, e que o player/exclusao local precisavam funcionar melhor.

## Decisoes

- Tarcila validou a direcao de usar simbolo discreto na splash nativa para evitar tela vazia.
- A splash React continua sendo a tela principal de identidade, com simbolo maior, nome `SinalSeguro` e barra de loading.
- O `preventAutoHideAsync` ficou restrito a Android/iOS, evitando bloqueio visual no web.
- O simulador web passa a ser suportado com `react-native-web`, mantendo a mesma base React Native/Expo.
- O botao SOS passa a ter estado ativo com particulas discretas, no maximo 8 simultaneas, subindo e desaparecendo em ritmos lentos.
- Quando ha chamado ativo, o mesmo botao SOS muda para `ATIVO` e o gesto de segurar passa a pedir encerramento.
- O encerramento abre confirmacao. Quando a seguranca extra estiver ativa, exige codigo local.
- O codigo de encerramento vem desativado por padrao e e salvo somente como hash local.
- O player local ganhou controles de revisao, linha do tempo e reinicio, sem liberar audio/video real no build publico.
- A exclusao local deixou de depender de `Alert` nativo e passa a executar diretamente pelo botao do raio, removendo o pacote da listagem e registrando tombstone local.
- O compartilhamento externo de evidencia continua bloqueado.

## Arquivos Principais

- `app.json`
- `app/_layout.tsx`
- `app/index.tsx`
- `app/configuracoes.tsx`
- `app/arquivos.tsx`
- `src/components/PanicButton.tsx`
- `src/components/EvidencePlayerCard.tsx`
- `src/components/LocalEvidenceRail.tsx`
- `src/features/emergency/emergencyPreferences.ts`
- `scripts/smoke-test.mjs`

## Evidencias

- `docs/evidencias/browser/2026-05-03-simulador/home-sos-web.png`
- `docs/evidencias/browser/2026-05-03-simulador/cofre-player-web.png`
- `docs/evidencias/browser/2026-05-03-simulador/android-home-devclient-adbreverse.png`

## Validacoes Executadas

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run web -- --clear`: aprovado apos instalacao de `react-native-web`.
- Browser Use: Home e `Cofre local` renderizaram em `http://localhost:8081`.
- `./gradlew :app:assembleDebug --console=plain`: aprovado.
- `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`: aprovado.
- `npm run release:android:readiness`: pronto condicionado, com pendencias esperadas de assinatura release e diretorio nativo gerado.

## Observacao Android

O APK debug foi instalado e o processo carregou o bundle pelo Metro. O `logcat` registrou `ReactNativeJS: Running "main"`, sem `FATAL`, `AndroidRuntime`, `RedBox` ou erro de bundle. A captura visual do aparelho ficou bloqueada por camada do sistema MIUI (`NotificationShade`/AOD e `ScreenOnProximitySensorGuide`), portanto a evidencia visual aprovada desta revisao ficou no simulador web. Para validacao final no aparelho, a tela precisa estar acordada/desbloqueada sem overlay do sistema, ou deve ser gerado APK preview/release com bundle embarcado.

## Bloqueios Mantidos

- Sem camera, microfone, streaming real, exportacao real ou envio de evidencia neste build publico.
- Sem uso de acessibilidade, overlay ou captura de botao fisico para burlar Android/iOS.
- Dados sensiveis nao entram em push, URL, log ou status textual.
- Integracao real com backend/P2P segue dependente de auth, consentimento, chaves, auditoria, retencao e revisao Doneda/Schneier.

## Proximos Passos

1. Rebuild Android e instalacao no aparelho conectado.
2. Validar SOS ativo, encerramento com e sem codigo, Cofre/player e exclusao local no Android.
3. Gerar APK preview/release com bundle JS embarcado para evitar dependencia do Metro.
4. Se aprovado, publicar release interna 3 e atualizar portal/manifestos.
