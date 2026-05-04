# 24 - Continuidade, Cofre protegido e QA

Data: 2026-05-03  
Responsavel: Ze  
Coordenacao mobile: Cristine  
Revisao visual: Tarcila e Norman  
Revisao tecnica: Ada, Hedy e Margaret  
Revisao seguranca/LGPD/QA: Schneier, Doneda e Myers

## Objetivo

Corrigir o bloqueio apontado pelos especialistas no Cofre local e deixar o checkpoint documentado para validacao simulada, Android fisico e continuidade dos portais.

## Ajustes implementados

- O botao `Finalizar` do Cofre nao encerra mais chamado ativo diretamente.
- O Cofre agora reutiliza o mesmo protocolo de seguranca da Home:
  - confirmacao em `BrandedDialog`;
  - codigo local opcional quando `finishSafety.requireCode` estiver ativo;
  - hash SHA-256 comparado localmente;
  - chamado permanece ativo quando o codigo estiver incorreto.
- `BrandedDialog` ganhou rolagem interna para reduzir risco de overflow em telas Android menores ou com fonte ampliada.
- A matriz de permissoes em `docs/23_ESPECIFICACAO_DESENVOLVIMENTO_APP.md` foi atualizada com permissoes transitivas observadas no APK debug.
- Prints de `Cofre fixo` e `Como funciona` foram recapturados porque os anteriores podiam registrar a splash/loading.
- Registro historico: o drawer da Home chegou a separar modo e ajuda para remover aninhamento no simulador web; checkpoint posterior removeu modo/status da Home e manteve apenas acoes iconograficas.

## Evidencias atualizadas

- `docs/assets/mobile/2026-05-03-home-sos.png`
- `docs/assets/mobile/2026-05-03-home-menu.png`
- `docs/assets/mobile/2026-05-03-cofre-fixo.png`
- `docs/assets/mobile/2026-05-03-cofre-player-modal.png`
- `docs/assets/mobile/2026-05-03-funcionamento.png`

## Validacoes executadas

```bash
npm run typecheck
npm run lint
npm test
git diff --check
PATH="/Applications/Codex.app/Contents/Resources:$PATH" npm run release:android:readiness
cd android && ./gradlew assembleDebug
```

Resultado:

- TypeScript: aprovado.
- Lint sensivel: aprovado.
- Smoke test: aprovado.
- `git diff --check`: aprovado.
- Readiness Android com Node 24: pronto condicionado.
- `assembleDebug`: aprovado.
- Browser web: registro historico do arranjo com modo/ajuda; a interface atual usa drawer simplificado com acoes para cofre/player, anjos, convites e configuracoes.

Pendencias esperadas no readiness:

- assinatura release fora do Git ainda nao configurada por variaveis `SINAL_APP_ANDROID_KEYSTORE_PATH` e `SINAL_APP_ANDROID_KEY_ALIAS`;
- diretorio nativo `android/` gerado e ignorado pelo Git.

## APK debug

- Caminho: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256: `481d9aca5dd1cabb36520440f7959c71b542af5619803aadbe5170164b300e70`.
- Pacote: `br.com.sinalseguro.app`.
- `minSdk`: 24.
- `targetSdk`: 36.

## Permissoes observadas no APK debug

Diretas e esperadas:

- `ACCESS_COARSE_LOCATION`
- `ACCESS_FINE_LOCATION`
- `POST_NOTIFICATIONS`
- `INTERNET`
- `VIBRATE`
- `ACCESS_NETWORK_STATE`

Transitivas a revisar antes de release publica:

- `RECEIVE_BOOT_COMPLETED`
- `WAKE_LOCK`
- `USE_BIOMETRIC`
- `USE_FINGERPRINT`
- `com.google.android.c2dm.permission.RECEIVE`
- permissoes de badge/launcher de fabricantes.

Confirmado ausente no build publico atual:

- `CAMERA`
- `RECORD_AUDIO`
- `SYSTEM_ALERT_WINDOW`
- armazenamento externo legado.

## Android fisico

`adb devices -l` nao retornou dispositivo nesta rodada. A tentativa de reconectar o IP historico `192.168.0.5:5555` retornou `Connection refused`.

Quando o Android reaparecer:

```bash
adb devices -l
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
adb reverse tcp:8081 tcp:8081
```

Manter Metro aberto em `http://localhost:8081` para validacao do APK debug/dev.

## Criterios de aceite da proxima validacao Android

- Splash nativa abre sem a splash antiga horizontal.
- Home fixa nao rola e mostra logo, SOS central e atalhos oficiais.
- SOS aciona por pressao longa, muda para `ATIVO` e mostra particulas discretas.
- Encerramento pela Home exige confirmacao e codigo quando ativado.
- Encerramento pelo Cofre exige o mesmo protocolo.
- Cofre abre Player e trilha em modais sem overflow.
- Excluir pacote local exige confirmacao e nao permite excluir chamado ativo.
- Logs nao exibem coordenadas completas, tokens, midia, chaves ou payloads sensiveis.

## Estado de release

Nao liberar release interna 3 ate:

- Android fisico voltar ao ADB;
- Tarcila aprovar splash/Home/Cofre no aparelho;
- Myers validar fluxo de SOS, encerramento, Cofre e permissoes;
- Schneier/Doneda aprovarem a matriz de permissoes e ausencia de midia real no build publico.
