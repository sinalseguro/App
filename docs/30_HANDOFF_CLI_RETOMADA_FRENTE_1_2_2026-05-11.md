# Handoff Codex CLI - Frente 1.2 Midia Critica

Use este prompt no Codex CLI aberto na raiz do projeto SinalSeguro.

```text
Ze, voce esta no Codex CLI, na raiz do projeto SinalSeguro. Antes de qualquer acao, valide acesso real ao filesystem:

1. Rode:
   - pwd
   - ls ./
   - test -f AGENTS.md && echo AGENTS_OK
   - test -d apps/mobile && echo MOBILE_OK
   - test -f apps/mobile/package.json && echo MOBILE_PACKAGE_OK
   - git -C apps/mobile status --short --branch

2. Se `ls ./` ou a leitura da raiz falhar com `Operation not permitted`, `Input/output error`, pasta vazia indevida, ou se `apps/mobile` nao estiver acessivel, PARE. Informe exatamente o erro e aguarde Roberto. Nao tente corrigir via limpeza, reset, checkout, iCloud ou permissao destrutiva.

3. Se o acesso estiver normal, prossiga somente com esta tarefa de preservacao/continuidade. Nao implemente codigo novo, nao rode builds pesados e nao avance P2P, anjos, upload, localizacao, conveniados, Frente 2/3/4/5.

Contexto do bloqueio:
- O Codex GUI perdeu capacidade de enumerar a raiz do iCloud: `ls ./` em `/Users/roberto/Library/Mobile Documents/com~apple~CloudDocs/Desenvolvimento/SinalSeguro` retornou `Operation not permitted`.
- No mesmo GUI, escrita temporaria na raiz e em evidencias funcionou, e `apps/mobile` ficou acessivel por caminho direto.
- Roberto confirmou que outro Terminal e o Codex CLI conseguem acessar a raiz; portanto o problema parece estar no processo/permissao do Codex GUI, nao no repositorio.
- Foi criado backup de resgate fora do iCloud em `/Users/roberto/SinalSeguro-resgate-20260511-132114`, contendo patch/status/untracked/evidencias do `apps/mobile`; 338 arquivos, 408M, verificacao SHA OK.

Regras obrigatorias:
- Preserve todas as mudancas existentes. Nao use `git reset`, `git checkout --`, limpeza destrutiva ou remocao de untracked.
- Preserve especialmente:
  - `docs/29_PROXIMA_ETAPA_API_ANJOS 2.md`
  - `docs/evidencias/android/2026-05-10-frente-1-2-native/inventario-saneado 2.txt`
  - `docs/evidencias/android/2026-05-11-frente-1-2-native/`
  - `docs/evidencias/ios/`
  - `metro.config.js`
  - `scripts/expo-no-workspace-root.cjs`
  - `teste` se ainda existir, pois apareceu durante a emergencia operacional e deve ser tratado como arquivo do usuario ate verificacao.
- Nao declarar Frente 1.2 concluida.
- Nao mexer em contratos da Frente 1.1 de chaves/dispositivos.
- Para memoria, nao gravar segredos, UDID, token, caminho sensivel de container de dispositivo, chave, nonce, tag, hash bruto, IP, e-mail, coordenada ou payload.
- Se atualizar documentos, registre fatos e pendencias, sem inflar conclusoes.

Leitura minima, nesta ordem:
1. `AGENTS.md`
2. `.codex/AGENTS.md`
3. `apps/mobile/AGENTS.md`
4. `apps/mobile/.codex/AGENTS.md`
5. `docs/01_MEMORIA_DO_PROJETO.md`
6. `apps/mobile/docs/03_TIMELINE.md`
7. `apps/mobile/docs/30_HANDOFF_CLI_RETOMADA_FRENTE_1_2_2026-05-11.md` (este arquivo)
8. Se precisar de detalhe tecnico da frente, consulte apenas os trechos relevantes de:
   - `docs/tecnico/MIDIA_CRITICA_FRENTE_1_2.md`
   - `docs/tecnico/FRENTES_GLOBAIS_APP_BACKEND_MIDIA_ANJOS.md`
   - `docs/28_RETOMADA_SEM_REDUNDANCIA.md` se existir
   - `apps/mobile/.codex/memory/CRISTINE.md`

Estado tecnico atual da Frente 1.2:
- Objetivo da frente continua: estabilizar encerramento, gravacao, preservacao cifrada, cofre/player e compatibilidade futura para P2P, sem implementar chamada real, anjos, upload, localizacao ou conveniados.
- Decisao arquitetural vigente: usar `SinalSeguroMediaEngine` como caminho principal nativo; JS/Base64/loopback apenas como fallback legado/homologacao.
- A implementacao ja adicionou/ajustou:
  - Modal de encerramento com progresso e estado final `Video protegido`.
  - `captureStopLocked` no fluxo de emergencia para bloquear nova captura enquanto o encerramento esta em andamento.
  - `handleFinishActiveCall()` aguardando `waitForMediaRecorderStop(...)` antes de `finishEmergencyPackage()`.
  - Cofre com loading transiente para nao piscar `Nenhum arquivo local` enquanto atualiza.
  - Limpadores nativos iOS/Android evitando apagar residuos de camera recentes por TTL.
  - Classificacao saneada de erros/logs nativos/camera.
  - Ajustes de acessibilidade no botao SOS.

Arquivos modificados conhecidos em `apps/mobile`:
- `app/_layout.tsx`
- `app/arquivos.tsx`
- `app/index.tsx`
- `plugins/native-media-engine/android/SinalSeguroMediaEngineModule.kt`
- `plugins/native-media-engine/ios/SinalSeguroMediaEngine.swift`
- `plugins/with-sinalseguro-media-engine.js`
- `scripts/encrypted-video-store.test.ts`
- `scripts/prepare-android-bundled-debug.mjs`
- `src/components/LocalEvidenceRail.tsx`
- `src/components/PanicButton.tsx`
- `src/features/emergency/CameraCaptureResidueCleaner.ts`
- `src/features/emergency/EmergencyMediaRecorder.tsx`
- `src/features/emergency/MediaOperationalLog.ts`
- `src/features/emergency/mediaCapture.ts`

Validacoes locais ja passaram antes da emergencia:
- `npm run typecheck`
- `npm run lint`
- `git diff --check`
- `npm test`
- `npm run test:crypto`
- `npm run test:device-keys`
- `npm run private:android:readiness` passou com aviso local conhecido de Node 20 para release publica.

Android:
- Build privado/debug pelo app local passou.
- APK preservado em `apps/mobile/docs/evidencias/android/2026-05-11-frente-1-2-native/app-debug-85f52968.apk`.
- SHA-256: `85f52968ac464aca4b4b0fc868abf6bc81a1cfa015a26e62f5f19200262bf599`.
- Validacao fisica Android desta rodada ainda NAO foi feita porque nao havia device ADB conectado no GUI.

iOS:
- `npm run prepare:build:ios:secure-config` passou.
- Build iOS Release generic com xcconfig seguro passou.
- Instalacao no iPhone fisico passou com `ios-deploy`.
- Evidencias principais em `apps/mobile/docs/evidencias/ios/2026-05-11-frente-1-2-native/physical-recheck-130503/`.
- Dois ciclos curtos no iPhone fisico foram registrados:
  - gravacao iOS H.264 480p/650 kbps;
  - preservacao nativa `native_segmented_v1`;
  - `native_engine_preserve_success`;
  - `sourceDeleted: true`;
  - `preserve_local_video_attached` com `chunkCount: 1`;
  - `emergency_finish_package_result` com `attachedAssetCount: 1` e `mediaRecorded: true`.
- Inventario iOS de residuos claros ficou limpo:
  - `Documents` com `.sseg` e `.nseg`;
  - `Library/Caches/Camera` sem arquivos listados;
  - `/tmp` vazio;
  - sem match para `.mp4`, `.mov`, `.m4v`, `.3gp`, `.caf`, `.aac`, `.wav`.
- Syslog iOS confirmou camera/microfone passando de Hot para Cold:
  - 13:09:13 camera/mic cold apos primeiro ciclo.
  - 13:10:20 camera/mic cold apos segundo ciclo.
- Evidencia visual capturada: modal final com `Video protegido`, 100%, barra verde, texto `Video protegido, camera liberada e pacote local finalizado.`
- Tentativa de capturar cofre apos `Abrir cofre` nao registrou toque; a captura permaneceu no modal final. Portanto cofre visual pos-toque ainda fica pendente.
- Importante: os dois ciclos curtos terminaram por limite de segmento antes do toque final. Eles validam preservacao/camera liberada, mas ainda nao provam totalmente o encerramento antecipado enquanto a camera esta gravando.
- Um teste de encerramento antecipado com captura de screenshots/log foi iniciado, mas foi abortado por causa da emergencia operacional do acesso local. Trate como evidencia parcial, nao como gate aprovado.
- iOS segue com `capture_ios_segment_limit_reached` e `maxSegments: 1`; portanto midia longa iOS ainda NAO esta aprovada.

O que voce deve fazer agora no CLI:
1. Atualizar memoria/documentacao de continuidade, sem implementar codigo:
   - atualizar `apps/mobile/docs/03_TIMELINE.md` com checkpoint objetivo de 2026-05-11;
   - atualizar `docs/01_MEMORIA_DO_PROJETO.md` se o acesso raiz estiver normal, registrando apenas o resumo executivo e pendencias;
   - atualizar `apps/mobile/.codex/memory/CRISTINE.md` ou equivalente local se existir, com o checkpoint tecnico da Frente 1.2;
   - se existir `docs/28_RETOMADA_SEM_REDUNDANCIA.md`, atualizar com o ponto exato de retomada;
   - se algum destes arquivos nao existir, nao invente estrutura grande; crie no maximo um arquivo curto de checkpoint em `apps/mobile/docs/` com nome claro.
2. Registrar explicitamente:
   - o problema de acesso ocorreu no Codex GUI, nao confirmado no CLI;
   - backup de resgate criado em `/Users/roberto/SinalSeguro-resgate-20260511-132114`;
   - Android build OK mas Android fisico pendente;
   - iPhone curto OK para preservacao nativa e residuos claros, mas encerramento antecipado, cofre visual/player e midia longa iOS pendentes;
   - Frente 1.2 nao pode ser fechada nem permitir avancar frentes dependentes.
3. Rodar validacoes leves:
   - `git -C apps/mobile diff --check`
   - `git -C apps/mobile status --short --branch`
   - checar existencia dos diretorios de evidencia citados.
4. Nao commit/push a menos que Roberto peca explicitamente `salvar` com commit/publicacao.
5. Ao final, responda com:
   - arquivos de memoria/docs atualizados;
   - validacoes leves executadas;
   - estado exato para retomar no GUI depois do restart;
   - pendencias imediatas em ordem:
     1. resolver/permissao Codex GUI ou seguir pelo CLI;
     2. repetir teste iPhone de encerramento antecipado durante gravacao;
     3. capturar cofre visual/player;
     4. reconectar Android ADB e rodar validacao fisica;
     5. so depois considerar gates longos 60s/3min/5min.
```
