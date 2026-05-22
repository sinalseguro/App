# 03 - Timeline Mobile

Responsavel: Cristine  
Supervisao: Ze

## 2026-05-18 - Etapa 1.14 politica pura do ciclo da chamada owner

Status: implementada, validada e pronta para checkpoint Git.

- Ampliado `src/features/emergency-home/ownerLiveEvidencePolicy.ts` com `resolveOwnerLiveCallLifecycle()`.
- `app/index.tsx` continua aplicando limpeza, parada da evidencia, timestamp e `updateOwnerLiveEvidence()`, mas deixou de decidir inline o ciclo `connected`/`failed`/`ended`.
- `scripts/owner-live-evidence-policy.test.ts` passou a cobrir os novos casos de lifecycle owner.
- `scripts/smoke-test.mjs` passou a exigir a nova politica.
- Mudanca restrita a regra pura/teste; sem novo storage, endpoint, permissao, rede, backend, portal, camera, WebRTC real ou layout.
- Validacoes aprovadas: `npm run test:owner-live-evidence`, `node scripts/smoke-test.mjs`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness` condicionado e `git diff --check`.
- Checkpoint: `docs/86_CHECKPOINT_ETAPA_1_14_OWNER_LIVE_CALL_LIFECYCLE_POLICY_2026-05-18.md`.
- Proxima etapa: commit e push.

## 2026-05-18 - Etapa 1.13 politica pura de inicio da evidencia local do solicitante

Status: implementada, validada e pronta para checkpoint Git.

- Criado `src/features/emergency-home/ownerLiveEvidencePolicy.ts`.
- `app/index.tsx` continua chamando `startOwnerLiveVideoEvidence()`, mas deixou de manter inline os guards de papel, sessao remota, pacote, stream local e status da chamada.
- Criado `scripts/owner-live-evidence-policy.test.ts` e comando `npm run test:owner-live-evidence`.
- `npm test` e `scripts/smoke-test.mjs` passaram a cobrir a nova politica.
- Mudanca restrita a regra pura/teste; sem novo storage, endpoint, permissao, rede, backend, portal, camera, WebRTC real ou layout.
- Validacoes aprovadas: `npm run test:owner-live-evidence`, `node scripts/smoke-test.mjs`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness` condicionado e `git diff --check`.
- Checkpoint: `docs/85_CHECKPOINT_ETAPA_1_13_OWNER_LIVE_EVIDENCE_POLICY_2026-05-18.md`.
- Proxima etapa: commit e push.

## 2026-05-18 - Etapa 1.12 politica pura de handoff de midia ao vivo

Status: implementada, validada e pronta para checkpoint Git.

- Criado `src/features/emergency-home/mediaHandoffPolicy.ts`.
- `app/index.tsx` continua com todos os efeitos reais de camera, WebRTC, auditoria e logs saneados, mas deixou de decidir inline se a preparacao de midia deve prosseguir.
- Criado `scripts/media-handoff-policy.test.ts` e comando `npm run test:media-handoff`.
- `npm test` e `scripts/smoke-test.mjs` passaram a cobrir a nova politica.
- Mudanca restrita a regra pura/teste; sem novo storage, endpoint, permissao, rede, backend, portal, camera, WebRTC real ou layout.
- Validacoes aprovadas: `npm run test:media-handoff`, `node scripts/smoke-test.mjs`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness` condicionado e `git diff --check`.
- Checkpoint: `docs/84_CHECKPOINT_ETAPA_1_12_MEDIA_HANDOFF_POLICY_2026-05-18.md`.
- Proxima etapa: commit e push.

## 2026-05-18 - Etapa 1.11 politica pura do resultado final do SOS

Status: implementado, validado e pronto para checkpoint Git.

- Criado `src/features/emergency-home/finishOutcomePolicy.ts`.
- `app/index.tsx` continua aplicando efeitos de UI, evidencia local, auditoria e diagnostico, mas deixou de decidir inline o resultado final do encerramento.
- Criado `scripts/finish-outcome-policy.test.ts` e comando `npm run test:finish-outcome`.
- `npm test` e `scripts/smoke-test.mjs` passaram a cobrir a nova politica.
- Mudanca restrita a regra pura/teste; sem novo storage, endpoint, permissao, rede, backend, portal, camera, WebRTC real ou layout.
- Validacoes aprovadas: `npm run test:finish-outcome`, `node scripts/smoke-test.mjs`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness` condicionado e `git diff --check`.
- Checkpoint: `docs/83_CHECKPOINT_ETAPA_1_11_FINISH_OUTCOME_POLICY_2026-05-18.md`.
- Proxima fatia recomendada: policy pura para preparacao/entrega da midia para chamada ao vivo, sem mover os side effects de camera, WebRTC e auditoria.

## 2026-05-18 - Etapa 1.10 politica pura de status de processamento de midia

Status: concluida localmente, validada e pronta para checkpoint Git.

- Criado `src/features/emergency-home/mediaProcessingStatusPolicy.ts`.
- `app/index.tsx` passou a usar `shouldResolveMediaReleaseWaiter()` e `resolveMediaProcessingPresentation()` para mensagens e progresso de processamento de midia.
- Criado `scripts/media-processing-status-policy.test.ts` e comando `npm run test:media-processing-status`.
- `npm test` e `scripts/smoke-test.mjs` passaram a cobrir a nova politica.
- Sem alteracao de UX, backend, portal, release, permissao, storage, endpoint, WebRTC runtime, camera ou log runtime.
- Codex Security aplicado como validacao dirigida de diff: nenhum padrao sensivel novo em logs ou payloads; o unico `console.log` novo fica em teste local.
- Validacoes aprovadas: `npm run test:media-processing-status`, `node scripts/smoke-test.mjs`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness` condicionado e `git diff --check`.
- Checkpoint: `docs/82_CHECKPOINT_ETAPA_1_10_MEDIA_PROCESSING_STATUS_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.9 validacao Android da refatoracao Home/SOS

Status: validacao fisica Android concluida em build debug privado local; sem publicacao de release.

- Validada fisicamente a base apos as etapas 1.6, 1.7 e 1.8 de refatoracao pura da Home/SOS.
- Gates aprovados antes do build: `npm run typecheck`, `npm run lint`, `npm test` e `git diff --check`.
- `npm run private:android:readiness` ficou pronto para build privado condicionado pela pendencia conhecida de Node local `20.16.0`.
- Build multi-ABI inicial falhou por falta de espaco no CMake; nao houve evidencia de falha de codigo.
- Build debug focado em `armeabi-v7a` passou com `BUILD SUCCESSFUL`, para atender os dois aparelhos fisicos conectados no contexto de QA local.
- APK local validado: `versionName=0.1.15`, `versionCode=17`, SHA-256 `e6348935dcf864070323e3d16e5a6e0a505d91aee539903422ad87398ad67189`.
- Instalacao via ADB concluida com sucesso em `0123456789ABCDEF` e `5686add7`.
- Validacao visual: Home SOS abriu no `0123456789ABCDEF`; modal de preparacao de acesso abriu no `5686add7`.
- Logs: buffer de crash vazio, 0 ocorrencias de `FATAL`/`AndroidRuntime`/`Unhandled` e sem marcador sensivel apos rechecagem dirigida.
- Evidencias: `docs/evidencias/android/2026-05-18-refatoracao-home-sos-validacao/`.
- Checkpoint: `docs/81_CHECKPOINT_ETAPA_1_9_VALIDACAO_ANDROID_REFATORACAO_HOME_SOS_2026-05-18.md`.

## 2026-05-18 - Etapa 1.8 politica pura de autochamada do solicitante

Status: concluida localmente, validada e pronta para checkpoint Git.

- Criado `src/features/emergency-home/ownerAutoCallPolicy.ts`.
- `app/index.tsx` passou a usar `shouldAttemptOwnerAutoCall()`, `ownerAutoCallAttemptMessage()` e `ownerAutoCallRecipientStatus()` para decidir autochamada apos aceite do anjo.
- Criado `scripts/owner-auto-call-policy.test.ts` e comando `npm run test:owner-auto-call`.
- `npm test` e `scripts/smoke-test.mjs` passaram a cobrir a nova politica.
- Sem alteracao de UX, backend, portal, release, permissao, storage, endpoint ou log runtime.
- Validacoes aprovadas: `npm run test:owner-auto-call`, `node scripts/smoke-test.mjs`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness` condicionado e `git diff --check`.
- Checkpoint: `docs/80_CHECKPOINT_ETAPA_1_8_OWNER_AUTO_CALL_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.7 politica pura de status da sincronizacao SOS

Status: concluida localmente, validada e pronta para checkpoint Git.

- Criado `src/features/emergency-home/remoteSyncStatusPolicy.ts`.
- `app/index.tsx` passou a usar `resolveActiveRemoteSyncStatus()` e `activeRemoteSyncRetryMessage()` para mensagens da sincronizacao remota do SOS ativo.
- Criado `scripts/remote-sync-status-policy.test.ts` e comando `npm run test:remote-sync-status`.
- `npm test` e `scripts/smoke-test.mjs` passaram a cobrir a nova politica.
- Sem alteracao de UX, backend, portal, release, permissao, storage, endpoint ou log runtime.
- Codex Security aplicado como validacao dirigida de diff: nenhum padrao sensivel novo em logs ou payloads.
- Validacoes aprovadas: `npm run test:remote-sync-status`, `node scripts/smoke-test.mjs`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness` condicionado e `git diff --check`.
- Checkpoint: `docs/79_CHECKPOINT_ETAPA_1_7_REMOTE_SYNC_STATUS_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.6 politica pura do botao SOS

Status: concluida localmente, validada e pronta para checkpoint Git.

- Criado `src/features/emergency-home/panicTriggerPolicy.ts`.
- `app/index.tsx` passou a usar `resolvePanicTriggerDecision()` para decidir se o botao SOS ignora duplo acionamento, mostra protecao de midia, encerra chamado ativo, pede consentimento ou inicia novo SOS.
- `panicButtonLabel()` centraliza o rotulo do `PanicButton` sem alterar os textos visiveis.
- Criado `scripts/panic-trigger-policy.test.ts` e comando `npm run test:panic-trigger`.
- `npm test` e `scripts/smoke-test.mjs` passaram a cobrir a nova politica.
- Sem alteracao de UX, backend, portal, release, permissao, storage, endpoint ou log runtime.
- Validacoes aprovadas: `npm run test:panic-trigger`, `node scripts/smoke-test.mjs`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness` condicionado e `git diff --check`.
- Checkpoint: `docs/78_CHECKPOINT_ETAPA_1_6_PANIC_TRIGGER_POLICY_2026-05-18.md`.

## 2026-05-18 - Android 0.1.15 validado em dois aparelhos e publicado

Status: validacao fisica, auditoria media EC2/API e publicacao privada concluidas.

- Dois Androids distintos foram confirmados por ADB: `0123456789ABCDEF` e `5686add7`; a entrada Wi-Fi/mDNS do Redmi foi tratada como transporte duplicado, nao como terceiro aparelho.
- Ambos estavam em `versionName=0.1.15` e `versionCode=17`.
- ADB long press nao foi aceito como prova negativa do `PanicButton`; o acionamento inicial foi validado por toque fisico real.
- Solicitante exibiu `VOCE PEDIU AJUDA` e `Transmitindo ao anjo`; anjo exibiu `Acompanhando SOS` com video `Pessoa protegida`.
- Encerramento confirmou `Video protegido 100%`, retorno para Home e registro encerrado no anjo.
- EC2/API confirmou ausencia de sessoes ativas, sinais validos residuais, envelopes ativos e arquivos de midia bruta no backend.
- Sinais P2P efemeros antigos foram limpos; auditoria minima de sessoes/envelopes foi preservada.
- Portal publicado em `/var/www/sinalseguro/releases/20260518T112908Z`.
- API de update e portal apontam Android `0.1.15` / `versionCode=17`, SHA-256 `b4f58d1d322a890da5dab0e717d0c81ceb4fb897fb91ef96ae34522b2e1c664c`.
- Download real do APK publicado confirmou o mesmo SHA-256.
- Observacao QA: aparelhos ja em `versionCode=17` nao devem abrir modal de atualizacao para a mesma versao; validar modal em aparelho com codigo menor ou na proxima versao superior.
- Checkpoint: `docs/77_CHECKPOINT_VALIDACAO_FISICA_DOIS_ANDROIDS_SOS_ANJO_2026-05-18.md`.

## 2026-05-18 - Higienizacao de regeneraveis Android

Status: limpeza operacional concluida; sem alteracao de codigo do app, backend, portal ou release.

- ADB continuou listando apenas um Android como `device`.
- `adb mdns services` nao encontrou novos servicos ADB Wi-Fi.
- Dry-run encontrou 38 reciclaveis Android, total estimado de 2.2 GiB.
- Limpeza aplicada por `../../scripts/higienizar-reciclaveis-android.sh --select all --apply`.
- Resultado: 38 itens removidos, 0 falhas, espaco livre variando de 3.3 GiB para 5.4 GiB.
- Foram removidos apenas regeneraveis: `.gradle`, `.cxx`, `android/app/build`, `android/build`, duplicatas `* 2.*` de intermediarios e temporarios antigos em `/private/tmp`.
- O APK local foi removido como artefato regeneravel; o app validado segue instalado no Android fisico.
- Corrigido bug operacional no script raiz `scripts/higienizar-reciclaveis-mobile.sh` quando nao havia itens (`SIZES_KB[@]: unbound variable`); script raiz fica fora do Git do app mobile.
- Checkpoint: `docs/74_CHECKPOINT_HIGIENIZACAO_REGENERAVEIS_ANDROID_2026-05-18.md`.

## 2026-05-18 - Pre-validacao unilateral Android

Status: pre-validacao unilateral concluida; live-call fim a fim segue bloqueada ate dois Androids.

- Apenas um Android apareceu em ADB como `device`; gate fim a fim da chamada ao vivo nao foi executado.
- `npm run test:live-call-security` aprovado antes da rodada ADB.
- Android detectado: `br.com.sinalseguro.app`, `versionName=0.1.15`, `versionCode=17`, com camera, microfone, notificacoes e localizacao concedidas.
- App abriu via `am start -W` com `Status: ok`; primeira abertura mediu `WaitTime: 3134`.
- Processo do app ficou ativo e `mFocusedApp` apontou para `br.com.sinalseguro.app/.MainActivity`.
- `mCurrentFocus` permaneceu como `NotificationShade`; portanto esta rodada nao vale como validacao visual de tela.
- Log filtrado nao mostrou `FATAL EXCEPTION`, `AndroidRuntime` ou erro React Native fatal.
- `dumpsys media.camera` indicou cameras fechadas sem cliente ativo.
- Inventario local saneado: 26 arquivos no sandbox, 0 midias claras persistentes, 0 `.nseg`, 0 `.sseg`.
- Checkpoint: `docs/73_CHECKPOINT_PRE_VALIDACAO_UNILATERAL_ANDROID_2026-05-18.md`.

## 2026-05-18 - Pre-validacao fisica live-call Android

Status: checkpoint operacional; validacao fim a fim bloqueada ate dois Androids estarem disponiveis.

- Especialistas de seguranca/QA/mobile foram acionados para retomar apos os gates de live-call.
- Repositorio estava limpo e sincronizado em `main`, ultimo commit `325571e`.
- ADB detectou apenas um Android como `device`.
- Android detectado tem `br.com.sinalseguro.app` instalado em `versionName=0.1.15`, `versionCode=17`, com camera, microfone, notificacoes e localizacao concedidas.
- App nao estava rodando no momento do levantamento.
- Espaco local no Mac estava baixo, cerca de 3.3 GiB livres; nao iniciar build Android pesado sem limpeza/necessidade.
- Decisao: nao refatorar mais live-call sem necessidade objetiva; proxima mudanca em camera/WebRTC runtime/autoaceite/handoff/encerramento SOS exige validacao fisica Android em dois aparelhos.
- Checkpoint: `docs/72_CHECKPOINT_PRE_VALIDACAO_FISICA_LIVE_CALL_2026-05-18.md`.

## 2026-05-18 - Etapa 1.5 gate de logs sensiveis live-call

Status: concluida localmente, validada e pronta para checkpoint Git.

- Criado gate de seguranca `scripts/live-call-sensitive-logging.test.ts`.
- Novo comando `npm run test:live-call-security` foi adicionado ao `npm test`.
- O gate impede `console` runtime em `useLiveAudioCall.ts` e `liveCallControl.ts`, e restringe `liveWebRtcSession.ts` a telemetria saneada `SinalSeguroLiveCall`.
- O teste falha se linha de console runtime tentar registrar `Authorization`, access/refresh/id token, `encrypted_key`, SDP, ICE candidate, payload P2P, URI, `file://`, `DocumentDirectory` ou `cacheDirectory`.
- Sem alteracao de fluxo operacional, UI, backend, portal, release, WebRTC runtime, sinalizacao ou permissao.
- Validacoes aprovadas ate agora: `npm run test:live-call-security`, `node scripts/smoke-test.mjs` e `npm run typecheck`.
- Checkpoint: `docs/71_CHECKPOINT_ETAPA_1_5_LIVE_CALL_SECURITY_LOGGING_2026-05-18.md`.

## 2026-05-18 - Etapa 1.4 politica pura WebRTC live-call

Status: concluida localmente, validada e pronta para checkpoint Git.

- Extraida politica pura de WebRTC para `src/features/live-call/liveWebRtcPolicy.ts`.
- `src/services/liveWebRtcSession.ts` continua responsavel apenas por side effects nativos: abrir camera/microfone, criar `RTCPeerConnection`, registrar listeners, enviar ICE local, aplicar SDP/ICE e fechar tracks.
- A politica extraida cobre normalizacao de modos audio/video, constraints de midia, timeout de abertura, mapeamento de estado ICE/conexao e selecao de stream remoto priorizando stream com video.
- Novo gate `npm run test:live-webrtc` foi adicionado ao `npm test`.
- `scripts/smoke-test.mjs` passou a validar o contrato WebRTC distribuido entre servico de side effects e politica pura.
- Gate Codex Security/QA direcionado: sem novo storage, endpoint, permissao, log sensivel, token, Authorization, encrypted key, SDP, ICE, payload P2P, URI, path local ou midia.
- Validacoes aprovadas ate agora: `npm run test:live-webrtc`, `node scripts/smoke-test.mjs` e `npm run typecheck`.
- Sem build Android nesta fatia porque a mudanca foi TypeScript puro e nao toca UI visual, backend, portal, release, codigo nativo ou assets.
- Checkpoint: `docs/70_CHECKPOINT_ETAPA_1_4_LIVE_WEBRTC_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.3 politica pura de estado live-call

Status: concluida localmente, validada e pronta para checkpoint Git.

- Extraida politica pura de estado/ciclo da chamada ao vivo para `src/features/live-call/liveCallStatePolicy.ts`.
- `useLiveAudioCall.ts` continua como orquestrador de WebRTC, polling, API e timers; as transicoes de estado/mensagens previsiveis ficaram testaveis fora do hook.
- A politica extraida cobre estado inicial, chamada ativa, mensagens por papel, conexao, reconexao, falha, falha de polling, aceite de answer do owner, answer enviado pelo anjo e preservacao do stream remoto apenas quando a regra permitir.
- `LiveAudioCallPanel.tsx` passou a importar o tipo de estado do modulo de politica, sem alterar layout, textos visuais ou comportamento.
- Novo gate `npm run test:live-call-state` foi adicionado ao `npm test`.
- Gate Codex Security/QA direcionado: sem novo log runtime com token, Authorization, encrypted key, SDP, ICE, payload P2P, URI, path local ou midia; SDP/ICE continuam restritos a transporte/teste no modulo anterior.
- Validacoes aprovadas ate agora: `npm run test:live-call-state`, `npm run test:live-call-session`, `npm run typecheck`, `node scripts/smoke-test.mjs` e `npm run lint`.
- Sem build Android nesta fatia porque a mudanca foi TypeScript puro, sem UI visual, nativo, WebRTC runtime, backend ou assets.
- Checkpoint: `docs/69_CHECKPOINT_ETAPA_1_3_LIVE_CALL_STATE_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.2 politica pura de sessao live-call

Status: concluida localmente, validada e pronta para checkpoint Git.

- Extraida politica pura de sessao da chamada ao vivo para `src/features/live-call/liveCallSessionPolicy.ts`.
- `useLiveAudioCall.ts` permanece como orquestrador de WebRTC, polling e estado, sem alteracao de UX, textos, backend, portal ou release.
- A politica extraida cobre guards SDP/ICE, evento de auditoria por papel, status de evidencia por papel, papel oposto de sinalizacao e regra de renderizacao do stream remoto.
- O contrato de tipo foi endurecido para impedir fallback implicito para `owner` quando o papel da chamada estiver indefinido.
- Novo gate `npm run test:live-call-session` foi adicionado ao `npm test`.
- Gate Codex Security/QA direcionado: SDP/ICE seguem apenas como payload de transporte/teste; sem novo log de runtime com token, Authorization, encrypted key, SDP, ICE, payload P2P, URI, path local ou midia.
- Validacoes aprovadas: `npm run test:live-call-session`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness` e `git diff --check`.
- Observacao ambiental: `private:android:readiness` segue condicionado apenas pelo Node local `20.16.0`; release publico exige Node `>=22.13.0`, mas build privado debug aceita essa pendencia.
- Sem build Android nesta fatia porque a mudanca foi TypeScript puro, sem UI, nativo, WebRTC runtime, backend ou assets.
- Checkpoint: `docs/68_CHECKPOINT_ETAPA_1_2_LIVE_CALL_SESSION_POLICY_2026-05-18.md`.

## 2026-05-17 - Etapa 1.1 testes de contrato API e hardening de erro

Status: concluida localmente, validada e pronta para checkpoint Git.

- `SinalSeguroApiCore` passou a receber um store de sessao injetavel, mantendo a sessao real no `SecureStore` por `src/services/api/sessionStore.ts` e permitindo testes de contrato sem tocar no armazenamento nativo.
- `AuthApiClient.logout` deixa de tentar refresh quando `/auth/logout` retorna `401`; o app limpa a sessao local no `finally` e evita renovar token durante uma saida com access expirado.
- `ApiRequestError.details` agora recebe detalhes saneados: campos de `Authorization`, access/refresh/id token, convite, segredo, senha, envelope cifrado, payload P2P, SDP e ICE candidate sao redigidos antes de chegar na UI/camadas consumidoras.
- `extractApiErrorMessage` preserva mensagens uteis e codigos operacionais sem ecoar valores sensiveis de token.
- `scripts/api-client-contract.test.ts` cobre sessao corrompida, refresh valido/invalido, logout sem retry, login Google com busca de usuario, update publico sem Authorization, P2P/envelope exigindo autenticacao e redaction de erro sensivel.
- `npm test` passou a incluir `npm run test:api-client`.
- `scripts/smoke-test.mjs` foi ampliado para ler todos os modulos do cliente API separados por dominio, incluindo emergencia/P2P, releases, perfis, session store e utilitarios.
- Gate Codex Security direcionado: sem `console.` nos modulos de API; sem novo log de token, Authorization, id token, convite, payload P2P, SDP, ICE candidate ou envelope cifrado.
- Build Android debug bundled foi validado em recorte `arm64-v8a` por limite de espaco local; o APK gerado em `android/app/build/outputs/apk/debug/app-debug.apk` tem SHA-256 `a6c5fd8cb4947498c9b79087b699970df18edbde1e7f6ae36e7c25934404c69a`.
- Validacoes aprovadas: `npm run test:api-client`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness`, varredura sem `console.` em API e build Android debug bundled `arm64-v8a`.
- Observacao ambiental: `private:android:readiness` segue condicionado apenas pelo Node local `20.16.0`; release publico exige Node `>=22.13.0`, mas build privado debug aceita essa pendencia.
- Checkpoint: `docs/67_CHECKPOINT_ETAPA_1_1_TESTES_API_CLIENT_2026-05-17.md`.

## 2026-05-17 - Etapa 1 refatoracao apiClient por dominios

Status: concluida localmente, validada e pronta para checkpoint Git.

- `src/services/apiClient.ts` virou fachada compativel para preservar imports publicos existentes via `@/services/apiClient`.
- Schemas, tipos e contratos foram movidos para `src/services/api/contracts.ts`.
- Sessao segura, refresh, erro HTTP e request comum foram movidos para `src/services/api/core.ts`.
- Endpoints foram separados por dominio: `authClient`, `devicesClient`, `profilesClient`, `contactsClient`, `emergencyClient` e `releasesClient`.
- Utilitarios de plataforma, data e payload de login/logout foram movidos para `src/services/api/utils.ts`.
- `scripts/smoke-test.mjs` passou a ler os modulos novos para manter as mesmas garantias de Google real, consentimentos, anjos e aceite de convite.
- Escopo preservado: sem alteracao de layout, texto publico, UX, fluxo SOS/WebRTC, contrato de API, portal, release ou backend.
- Gate Codex Security direcionado: sem novos `console` nos modulos de API; tokens, `Authorization`, `id_token`, convite, payload P2P e envelope cifrado permanecem apenas como campos de transporte validados, sem log adicional.
- Validacoes aprovadas: `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness`, `git diff --check` e `npm run build:android:debug:bundled`.
- Observacao de build: a primeira tentativa Android falhou por duplicatas regeneraveis `* 2.*` em `android/app/build/intermediates`; a limpeza removeu somente esses arquivos regenerados e o build seguinte passou.
- Checkpoint: `docs/66_CHECKPOINT_ETAPA_1_API_CLIENT_DOMINIOS_2026-05-17.md`.

## 2026-05-17 - Checkpoint pre-refatoracao mobile

Status: documentado e congelado para iniciar refatoracao incremental sem alterar comportamento.

- Android base preservado: `0.1.15`, `versionCode 17`, APK `sinalseguro_android.apk`, SHA-256 `a7b90059ce2b976c9af18ca6a43754815e423a6832aa8835305a2a99b0bb6a64`.
- Backup local geral criado em `/Users/roberto/SinalSeguro-backups/pre-refatoracao-20260517T224401-0300`.
- Hotspots reconhecidos: `app/index.tsx`, `src/services/apiClient.ts`, `src/features/emergency/` e `src/features/live-call/`.
- Regra da refatoracao: sem mudanca de layout, UX, textos publicos, contratos de API ou fluxo SOS/WebRTC.
- Primeira subetapa recomendada: separar `apiClient.ts` por dominio mantendo fachada compativel.
- Checkpoint: `docs/65_CHECKPOINT_PRE_REFATORACAO_2026-05-17.md`.

## 2026-05-17 - Android 0.1.15 SOS ao vivo com preservacao final

Status: publicado no portal/API de update e validado fisicamente em dois Androids apos limpeza controlada.

- Pesquisa tecnica aplicada: WebRTC fica como plano de midia P2P, EC2/API como sinalizacao/auditoria, Trickle ICE reduz latencia e Android exige aguardar `stop`/finalizacao antes de consumir arquivo de gravacao.
- Corrigida corrida entre inicio pendente da gravacao do stream WebRTC e encerramento do SOS ao vivo.
- Encerramento deixa de chamar parada duplicada do gravador da camera quando a midia ja foi entregue ao fluxo WebRTC.
- Modal final passa a distinguir `Video protegido`, pendencia local e falha real.
- Android sincronizado para `0.1.15`, `versionCode 17`.
- APK SHA-256: `a7b90059ce2b976c9af18ca6a43754815e423a6832aa8835305a2a99b0bb6a64`.
- Validacoes aprovadas: `npm run typecheck`, `npm run lint`, `npm test`, `git diff --check` e build Android debug bundled.
- Validacao fisica: originador transmitiu audio/video, anjo visualizou o video da pessoa protegida, encerramento preservou o arquivo no cofre local cifrado.
- API publicada com `app_releases.0014_update_android_release_20260517_v0115`.
- Portal publicado em `/var/www/sinalseguro/releases/20260517T223450Z`; download real do APK confirmou o hash publicado.
- Limpeza controlada removeu historicos locais de SOS/chamadas dos dois Androids e zerou registros de emergencia no backend antes da rodada final.
- Rodada final pos-limpeza gerou uma sessao finalizada de validacao, com video protegido no originador e registro encerrado no anjo.
- Checkpoint: `docs/64_CHECKPOINT_ANDROID_0_1_15_SOS_AO_VIVO_PRESERVACAO_FINAL_2026-05-17.md`.

## 2026-05-17 - SOS ao vivo com audio local no pacote

Status: implementacao local iniciada e validada por compilacao Kotlin; ainda nao publicada.

- `SinalSeguroLiveVideoRecorder` passou a tentar capturar audio local Android em AAC durante a gravacao do stream WebRTC local.
- O gravador muxa audio AAC e video H.264 em MP4 temporario final antes do fluxo existente cifrar o arquivo como `.nseg`.
- `audioCaptured=true` so e retornado quando o arquivo final contem trilha de audio confirmada por `MediaExtractor`.
- Se o microfone local estiver indisponivel, se o Android bloquear captura simultanea ou se o mux falhar, o app preserva video-only como na `0.1.13`.
- A EC2/API permanece apenas como controle, sinalizacao e auditoria saneada; midia bruta continua fora do backend.
- Validacoes aprovadas: `npm run typecheck`, `git diff --check` e `android ./gradlew :app:compileDebugKotlin`.
- Gate pendente: teste fisico em dois Androids confirmando trilha de audio, limpeza de temporarios claros e SOS ao vivo sem regressao.
- Checkpoint: `docs/61_CHECKPOINT_ANDROID_SOS_AO_VIVO_AUDIO_LOCAL_2026-05-17.md`.

## 2026-05-17 - SOS ao vivo com reconexao controlada

Status: implementacao local iniciada; contrato TS e teste Django focado aprovados.

- Chamada ao vivo ganhou estado `reconnecting` para oscilacao curta de rede.
- UI mostra `Reconectando chamada` e mantem o SOS ativo em vez de apresentar falha final imediatamente.
- Se a chamada voltar, o app registra evento de reconexao concluida; se nao voltar no prazo, registra falha de reconexao.
- API passou a aceitar eventos saneados de reconexao para originador e anjo, alem de `connection_state=reconnecting`.
- Auditoria segue sem SDP, ICE, tokens, caminhos locais ou midia bruta.
- Esta subetapa nao ativa TURN/relay nem reinicio ICE automatico.
- Validacoes aprovadas: `npm run typecheck`, `git diff --check` e teste Django focado de `audit-marker`.
- Gate pendente: teste fisico com oscilacao de rede em dois Androids.
- Checkpoint: `docs/62_CHECKPOINT_ANDROID_SOS_AO_VIVO_RECONEXAO_CONTROLADA_2026-05-17.md`.

## 2026-05-17 - Notificacao local de chamado para o anjo

Status: implementacao local iniciada; ainda nao publicada.

- Canal Android de chamados de emergencia passa a ser preparado no boot do app.
- Canal `sinalseguro-emergency-alerts` usa importancia alta no Android.
- Notificacao local do anjo usa prioridade maxima no conteudo, vibracao e cor da marca, mantendo abertura em `Alertas recebidos`.
- Nao foi ativado bypass de `Nao perturbe`, foreground service, FCM/push remoto ou segundo plano persistente.
- Conteudo da notificacao permanece sem midia, SDP, ICE, token, localizacao crua ou termos tecnicos internos.
- Validacoes aprovadas: `npm run typecheck`, `git diff --check` e teste Django focado de `audit-marker`.
- Gate pendente: validacao visual em Android fisico com permissao de notificacao.
- Checkpoint: `docs/63_CHECKPOINT_ANDROID_NOTIFICACAO_CHAMADO_ANJO_2026-05-17.md`.

## 2026-05-16 - F4.3 recebimento de chamada pelo anjo e registro local

Status: implementado localmente no Android; testes automatizados aprovados, build/ADB em validacao nesta rodada.

- tela `Alertas recebidos` agora emite notificacao local de alta prioridade quando detecta chamado SOS ativo recebido pelo anjo;
- chamados ativos ainda nao aceitos sao aceitos pelo app do anjo durante a sincronizacao autorizada, criando registro local seguro automaticamente;
- o anjo passa a iniciar o modo de acompanhamento ao vivo automaticamente apos o registro, aguardando a oferta WebRTC da pessoa protegida;
- a Home da pessoa protegida tenta iniciar a videochamada automaticamente quando o backend informa que o anjo aceitou, com retentativas leves enquanto o SOS segue ativo;
- acao manual `Acompanhar ao vivo` permanece como fallback do usuario, nao como requisito principal do fluxo;
- historico `Registros de chamados` lista pessoa protegida, snapshot textual, data, duracao, status, abertura e compartilhamento;
- regra de compartilhamento limita o registro ao usuario protegido ou autoridade competente;
- backend continua sem receber audio/video da chamada; esta fatia salva registro operacional local, nao arquivo bruto de midia WebRTC;
- gravacao bruta de audio/video no aparelho do anjo permanece subfase nativa futura, pois exige consentimento/retencao/cadeia de custodia e nao pode ser gravação oculta;
- validacoes aprovadas ate aqui: `npm run typecheck`, `npm run lint`, `npm test` e `test:live-call-history`;
- evidencias anteriores da tela: `docs/evidencias/adb-usb-live-call-20260516-204707/`; evidencias novas devem ser salvas em diretorio proprio desta rodada.

## 2026-05-16 - F4.2 videochamada emergencial com um unico anjo

Status: implementado localmente e validado em dois Androids fisicos para o recorte MVP; publicacao no portal ainda nao executada nesta rodada.

- escopo ajustado: chamada emergencial do MVP Android foca um unico anjo aceito por ocorrencia;
- agentes homologados de instituicoes conveniadas ficam para versao/variante institucional futura, com contrato, RBAC, MFA, auditoria, retencao e RIPD/DPIA proprios;
- backend passou a limitar roteamento e `live-recipients` ao anjo aceito mais recente para o MVP;
- Home Android limita entrega local a um anjo aceito, reidrata sessao remota ativa e limpa estado visual da chamada ao encerrar o SOS;
- tela `Alertas recebidos` libera `Entrar na videochamada` somente apos aceite do anjo;
- runtime WebRTC Android usa P2P apos sinalizacao pela EC2; backend nao recebe nem armazena midia da chamada;
- pessoa protegida mantem gravacao local ativa, envia voz e recebe video/voz do anjo; anjo envia voz/video ao entrar na chamada;
- evidencias fisicas saneadas salvas em `docs/evidencias/android/2026-05-16-f4-2-video-unico-anjo/`;
- EC2 confirmou sessao mais recente finalizada com um destinatario, um envelope efemero e sete sinais P2P;
- validacoes aprovadas: backend com 46 testes focados, deploy API EC2, health/ready publicos, `npm run typecheck`, `npm run lint`, `npm test -- --runInBand` e `npm run build:android:debug:bundled`;
- APK local `0.1.8`/`versionCode 10` gerado com SHA-256 `adc62dd434ac884c921d161c88c797300d25a3f7d26a7ad0ab5de7e79f2619a0`;
- APK instalado no Android USB; transporte Wi-Fi respondeu comandos leves, mas travou em transferencia pesada do APK e deve ser retomado por USB ou portal.

## 2026-05-16 - Android 0.1.7 com versao instalada clara

Status: ajuste visual implementado, APK publicado e API/portal sincronizados.

- Android fisico `23129RA5FL` foi inspecionado por ADB e estava instalado em `versionName=0.1.5`, `versionCode=7`, embora a tela de atualizacao exibisse visualmente `Versao 0.1.6`, que era a versao disponivel no portal;
- captura visual salva em `docs/evidencias/android/2026-05-16-versao-fisica/01-estado-inicial.png` confirmou a ambiguidade para usuario final;
- corrigido o texto da tela de atualizacao para separar `Instalada <versao> (codigo <versionCode>)` de `Disponivel <versao> (codigo <versionCode>)`;
- dialogs de atualizacao passam a informar instalada/disponivel na mensagem, evitando confundir release publicada com app realmente instalado;
- app Android sincronizado para `versionName=0.1.7` e `versionCode=9`;
- APK privado SHA-256: `dc9c4274a05a290a81837d37831db47ff91003be6d8d51403f8f49281f91fb17`;
- validacoes locais: `npm run typecheck`, `npm run lint`, `npm test`, build Android privado e `aapt dump badging` com `versionCode 9`;
- API publicada com `app_releases.0008_update_android_release_20260516_v017`;
- portal publicado em `/var/www/sinalseguro/releases/20260516T122655Z`, mantendo `/baixar/android`, QR estavel e arquivo `sinalseguro_android.apk`;
- ADB instalou comandos leves, mas travou em instalacao pesada do APK nesse aparelho; instalacao/validacao final deve ocorrer pelo portal no Android fisico.

## 2026-05-16 - Android 0.1.6 publicado para teste manual de alertas

Status: APK novo publicado no portal oficial e API de update sincronizada.

- app Android sincronizado para `versionName=0.1.6` e `versionCode=8`;
- APK privado gerado em `android/app/build/outputs/apk/debug/app-debug.apk` e promovido para `distribution/android/out/sinalseguro-android.apk`;
- SHA-256: `0b2fad382ae3f7054c0d1092ec2b2ed9414b4dc0f2c95c75d05f21761241ddf3`;
- conteúdo da release: primeira tela Android `Alertas recebidos`, atalho `Alertas` na Home e contrato mobile/API para ocorrencias SOS roteadas a anjos aceitos;
- validacoes locais: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build:android:private`, Django `check`, testes focados de `app-releases/current` e `aapt dump badging` com `versionCode 8`;
- API publicada com `app_releases.0007_update_android_release_20260516_v016`;
- portal publicado em `/var/www/sinalseguro/releases/20260516T120523Z`, mantendo `/baixar/android`, QR estavel e arquivo `sinalseguro_android.apk`;
- deploy inicial do portal falhou por falta de espaco na EC2; foram removidas somente releases antigas/parcial nao ativas, preservando a release ativa e uma anterior para rollback;
- validacao pos-deploy: manifesto publico `0.1.6`, API de update `versionCode 8`, APK no servidor com hash esperado, `/baixar/android` HTTP 200, API health/ready ok, `nginx -t` aprovado, `sinalseguro-api` e `cereusia-crm` ativos, `cereusia.conf` preservado.

## 2026-05-16 - Android 0.1.5, convite somente com validacao no backend

- causa do erro anexado: link recebido apontava para token que nao existia como convite disponivel no backend de producao;
- `createLocalInvitation` passou a exigir sessao Google/API e criar convite pelo backend antes de liberar compartilhamento;
- `Convite recebido` consulta `POST /api/invitations/status` antes de permitir aceite, limpa token pendente indisponivel e bloqueia `Aceitar como anjo` quando o servidor nao reconhecer o convite;
- `Anjos de confianca` fecha o modal de compartilhamento quando a sessao expira e orienta a entrar com Google antes de criar novo convite seguro;
- APK Android privado `0.1.5`/`versionCode 7` gerado em `android/app/build/outputs/apk/debug/app-debug.apk`;
- SHA-256: `4518789cbcc844f5f8ff87dcd13009f00f7ffbc252d5cea01e2ec50855b239a2`;
- validacoes locais: `npm run lint`, `npm run typecheck`, `npm test`, `npm run private:android:readiness` com pendencia conhecida de Node local para build publico, e build Android debug bundled aprovados;
- validacao fisica: dois Androids receberam a `0.1.5`; link invalido exibiu `Convite indisponivel`, `Aceite bloqueado` e botao de aceite desativado;
- aceite manual de Roberto: testes fisicos manuais validados em 2026-05-16; fluxo de convite/aceite considerado aprovado para continuidade do MVP Android;
- publicacao: API em producao com `versionCode 7`, portal `/var/www/sinalseguro/releases/20260516T034600Z`, APK publico `sinalseguro_android.apk?v=0.1.5-20260516` e hash baixado conferido.

## 2026-05-16 - Android 0.1.4, anjos sincronizados e aceite visivel

- o usuario que ja atua como anjo pode criar a propria rede de anjos quando seu perfil adulto/responsavel permite;
- aceite de convite sincroniza perfil ativo antes de registrar dispositivo e aceitar o token na API;
- `GET /api/trusted-contacts/` passou a expor `contact_display_name` saneado para fallback visual do originador;
- auditoria de `invitation_accept` passou a registrar IDs minimos de convite, contato, originador e recebedor, sem token, telefone, e-mail bruto, midia ou localizacao;
- tela `Anjos de confianca` mostra resumo direto, usa `Meus anjos`, remove pendencias locais quando o backend ja retornou aceite/revogacao e sincroniza ao foco, ao voltar ao foreground e a cada 15s enquanto aberta;
- `Convite recebido > Ver meus vinculos` abre diretamente o painel `Sou anjo de`;
- APK Android privado `0.1.4`/`versionCode 6` gerado em `android/app/build/outputs/apk/debug/app-debug.apk`;
- SHA-256: `93b06f022aac21ddf296eeaa34fc126ed353341c0cda7ebee311203d7ed05139`;
- validacoes ate o build: `typecheck`, `lint`, `npm test`, readiness Android privado, build Android debug bundled, Django `check`, `makemigrations --check --dry-run` e 36 testes backend aprovados.

## 2026-05-15 - Android 0.1.3 para update publico, login sem flash e sincronizacao de anjos

Status: codigo, build e validacoes locais aprovados; publicacao EC2 e validacao fisica por update no app entram como gate final desta rodada.

Resultado:

- app Android sincronizado para `versionName=0.1.3` e `versionCode=5`;
- `GET /api/app-releases/current` passa a permitir consulta sem login, mantendo download apenas no portal oficial validado por host/caminho/checksum;
- o layout raiz verifica atualizacao durante a abertura e mostra modal proprio quando houver versao nova;
- o gate de acesso nao exibe o painel de login enquanto ainda esta validando sessao, consentimentos e permissoes;
- a tela `Anjos de confianca` sincroniza ao voltar ao foco para refletir aceite recente no aparelho que enviou convite;
- mensagens de erro da API agora preservam detalhes de serializer como token invalido/usado, perfil bloqueado e dispositivo sem chave publica;
- o contrato de relacionamento nao expõe `protected_subject` para quem atua como anjo.

Artefato:

- APK local: `android/app/build/outputs/apk/debug/app-debug.apk`;
- APK portal: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk?v=0.1.3-20260515`;
- SHA-256: `36f8518b72ff5711ff65893b675db5b47d36ef185aa34bf790a7356e6c3f2ae2`;
- `aapt dump badging`: `versionCode='5'`, `versionName='0.1.3'`, `targetSdkVersion='36'`.

Validacoes locais:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run private:android:readiness` com Node 22: aprovado;
- build Android debug bundled: aprovado;
- backend local: `manage.py check`, 35 testes e `makemigrations --check --dry-run` aprovados;
- portal local: `npm run validate` com Node 22 aprovado;
- `git diff --check` nos repos mobile e portais aprovado.

## 2026-05-15 - Android 0.1.2 preparado para update no app e portal

Status: codigo, build, backend e portal publicados; instalacao automatizada no Android fisico ficou bloqueada por transporte ADB instavel.

Resultado:

- app Android sincronizado para `versionName=0.1.2` e `versionCode=4`;
- painel `Atualizacao` continua consultando `GET /api/app-releases/current` com JWT SinalSeguro e compara `versionCode`, permitindo que aparelhos em `0.1.1` vejam a atualizacao;
- APK privado debug bundled gerado com bundle JS embutido, sem depender de Metro;
- artefato copiado para `distribution/android/out/sinalseguro-android.apk` e para o portal com nome publico estavel `sinalseguro_android.apk`;
- portal, manifesto e backend de release foram alinhados para `0.1.2` mantendo QR e URL publica estaveis.

Artefato:

- APK local: `android/app/build/outputs/apk/debug/app-debug.apk`;
- APK portal: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk?v=0.1.2-20260515`;
- SHA-256: `1ee74e9dd3675a150f3a1264abf99437c494f268d0f63cde9a9bd6b1fb182539`;
- `aapt dump badging`: `versionCode='4'`, `versionName='0.1.2'`, `targetSdkVersion='36'`.

Validacoes:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run private:android:readiness`: aprovado;
- build Android debug bundled `arm64-v8a`: aprovado.
- backend local: `manage.py check`, 35 testes e `makemigrations --check --dry-run` aprovados;
- portal local: `npm run validate` aprovado;
- API EC2: migration `app_releases.0003_update_android_release_20260515_v012`, health/ready ok, `sinalseguro-api=active`, `cereusia-crm=active`;
- portal EC2: release `/var/www/sinalseguro/releases/20260515T220003Z`;
- producao: `/baixar/android`, manifesto, checksum e APK `0.1.2` com SHA-256 esperado.

Limite fisico:

- o Android `23129RA5FL` voltou como `device` e respondeu comandos curtos;
- o aparelho instalado ainda estava em `versionName=0.1.1`, `versionCode=3`;
- `adb install`, `adb push` do APK inteiro, tentativa de TCP ADB e envio em partes travaram o transporte USB;
- a validacao visual local no aparelho fica pendente, mas a atualizacao pelo portal fica liberada para teste manual pelo download oficial.

## 2026-05-15 - Interface de vinculo anjo/protegido no Android

Status: contrato app/API implementado, publicado na EC2 e instalado no Android fisico visivel; aceite fisico real permanece pendente porque o convite no backend ainda esta `pending` e o segundo Android nao apareceu de forma confiavel no ADB.

Resultado:

- backend passou a devolver o relacionamento aceito por papel em `GET /api/trusted-contacts/relationships`;
- aceite de convite em `POST /api/invitations/accept` agora retorna o mesmo contrato de relacionamento, com `relationship_role`, `owner_display_name` e `contact_display_name`;
- app Android passou a separar a tela `Anjos de confianca` em `Anjos` e `Sou anjo`;
- quando o usuario e protegido/originador, `Anjos` lista quem aceitou ser anjo;
- quando o usuario e recebedor, `Sou anjo` mostra de quem ele e anjo;
- a tela `Convite recebido` mostra `Voce e anjo de ...` apos aceite e oferece `Ver meus vinculos`;
- dados sensiveis, midia e localizacao continuam fora do convite e fora da tela de relacao.

Validacoes:

- API local: `manage.py test sinalseguro_api.tests`, `manage.py check`, `makemigrations --check --dry-run` e `spectacular --validate` aprovados;
- mobile: `npm run typecheck`, `npm run lint`, `npm test` e `git diff --check` aprovados;
- EC2: deploy da API concluido, `sinalseguro-api=active`, `cereusia-crm=active`, `nginx -t` aprovado, health/ready ok e hash de `cereusia.conf` preservado;
- Android fisico: APK debug `arm64-v8a` instalado no aparelho `23129RA5FL`, com `versionName=0.1.1` e `versionCode=3`;
- evidencia visual confirmou o tile `Sou anjo` na tela `Anjos de confianca` e modal de `Convites` ainda com convite pendente.

Limite fisico atual:

- o Android disponivel pelo ADB ficou instavel e depois saiu da depuracao;
- a EC2 confirmou que os contatos/convites recentes ainda nao tinham `contact_user` nem `accepted_at`;
- como o token claro nao e armazenado no backend e nao foi encontrado em SMS/notificacao acessivel pelo ADB, o aceite real precisa ser retomado abrindo o link recebido no aparelho anjo ou reconectando os dois Androids.

Evidencias saneadas:

- `docs/evidencias/android/2026-05-15-convite-anjo-relacionamento/01-contatos-sou-anjo-tile.png`
- `docs/evidencias/android/2026-05-15-convite-anjo-relacionamento/02-convites-pendente.png`

## 2026-05-15 - Convite web/app publicado e release Android sincronizada

Status: fluxo tecnico de convite web/app publicado em producao; teste fisico final depende de o Android voltar a aparecer como `device` no ADB.

Resultado:

- backend passou a expor status publico minimo de convite por `POST /api/invitations/status`;
- convites novos usam `https://www.sinalseguro.com.br/convite#convite=<codigo>`;
- revogacao de contato invalida convites pendentes relacionados;
- app Android preserva convite pendente em armazenamento cifrado durante login, consentimentos e permissoes;
- App Links Android adicionados para `www.sinalseguro.com.br/convite`;
- portal publicou `/convite`, `/.well-known/assetlinks.json`, redirecionamento legado `/convite/<codigo>` e APK Android `0.1.1`.

Artefato:

- APK local: `distribution/android/out/sinalseguro-android.apk`;
- APK portal: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk?v=0.1.1-20260515`;
- SHA-256: `dbfe42edce5f8ad9197aa105ea45bd9113b74bfb6f2f5e2a14dd9586946f8fff`;
- release EC2 final: `/var/www/sinalseguro/releases/20260515T124519Z`.

Validacoes:

- `npm run typecheck`, `npm run lint`, `npm test` e build Android privado aprovados;
- API de producao: `manage.py check`, `migrate`, `collectstatic`, readiness e status publico de convite aprovados;
- portal: build/validate aprovado em `/tmp`, `/convite` HTTP 200, `/convite/teste-saneado` HTTP 302 para fragmento, manifest/checksum/assetlinks/APK publicados;
- `nginx -t` aprovado e `cereusia.conf` preservado.

Limite:

- Android nao apareceu em `adb devices -l`; a descoberta Wi-Fi anunciou uma porta ADB, mas a conexao foi recusada. O envio real por WhatsApp/SMS e o aceite entre dois aparelhos ficam para a retomada com ADB ativo.

## 2026-05-13 - Frente 1.3: Android validado e release privado publicado no portal

Status: Android fisico validado para a fatia de perfis/anjos/convite da Frente 1.3; release privado Android publicado no portal publico. iPhone/iOS permanece pos-MVP e sem release ativo no portal.

Especialistas acionados:

- Katia/Eliane: build, instalacao ADB, validação visual Android e leitura de logs.
- Demi/Tereza: pacote de download, QR, manifesto e deploy EC2 dos portais.
- Tarcila/Lina/Doneda: microcopy publica para Android disponivel e iPhone posteriormente.
- Cristine: checkpoint, memoria mobile e continuidade.

Validacao Android fisica:

- Device: modelo `23129RA5FL` com identificador redigido.
- APK instalado: `distribution/android/out/sinalseguro-android.apk`.
- SHA-256: `19ad59c4b9c4c47c8316f3a24d354626ee11a3442be910841fcd1e73283cd08b`.
- Telas validadas por ADB/screenshot/UI dump: `Perfis e papeis`, `Anjos de confianca` e `Convite recebido`.
- Perfil nao definido bloqueou convite; convite sem token mostrou orientacao para configurar perfil adulto.
- Log saneado do recorte nao mostrou `FATAL EXCEPTION`, `AndroidRuntime`, `ReactNativeJS Error`, ANR ou crash do processo SinalSeguro.

Publicacao portal:

- Release EC2: `/var/www/sinalseguro/releases/20260513T215810Z`.
- Android: `https://www.sinalseguro.com.br/downloads/private/android/sinalseguro_android.apk`.
- QR Android: `https://www.sinalseguro.com.br/assets/app/sinalseguro-android-qr.svg`.
- Versao/data exibida no portal: `0.1.0` em `13/05/2026`.
- Manifesto: `https://www.sinalseguro.com.br/downloads/installers.json`, contendo apenas Android.
- `/baixar/ios` informa em linguagem publica que a versao para iPhone sera disponibilizada posteriormente.
- Release iPhone antigo retorna `404`; a URL versionada antiga de QR pode permanecer em cache externo, mas nao e referenciada pelo portal atual.

Gates:

- Mobile: `typecheck`, `lint`, `npm test`, build Android privado para device, instalacao ADB e validação visual/logs.
- Portal: `npm run validate`, `infra/aws/deploy-portais.sh`, curls pos-deploy, `nginx -t`, `cereusia-crm=active`, `sinalseguro-api=active`, API health/ready ok.

Atualizacao de politica e UX:

- APK/AAB/IPA privados nao ficam mais rastreados no Git; o portal publica o APK a partir de arquivo local validado por checksum com nome estavel `sinalseguro_android.apk`.
- `infra/aws/deploy-portais.sh` passa a falhar se o APK local nao existir ou se o SHA-256 divergir do checksum versionado.
- README do app e README do portal foram atualizados com URL, SHA-256, manifesto e regra de publicacao somente no portal.
- Download publico ajustado para linguagem de usuario final, sem termos internos, com fluxo em ate tres interacoes e QR Android estavel para `/baixar/android`.
- Validacao visual complementar Tarcila/Lina/Eliane cobriu `Perfis`, `Anjos de confianca` e `Convite recebido` com fonte normal e fonte 1.3; fonte restaurada para 1.0 e crash scan sem padroes fatais. A fonte 1.3 ficou com ressalva de UX por cortes/overflow em textos longos.

Checkpoint detalhado:

- `docs/40_CHECKPOINT_FRENTE_1_3_ANDROID_RELEASE_PORTAL_2026-05-13.md`

## 2026-05-14 - Frente 1.3: refinamento UX fonte ampliada e APK novo pronto

Status: correcao de UX para fonte ampliada implementada e APK Android novo gerado; validacao visual fisica final segue pendente porque o Android nao apareceu no ADB/USB no momento da retomada.

Especialistas acionados:

- Katia/Tereza: diagnostico de build Android, limpeza de reciclaveis e comando de menor pressao.
- Tarcila/Lina/Eliane: criterios de aceite visual para fonte `1.3` em `Perfis`, `Anjos de confianca` e `Convite recebido`.
- Cristine/Lucena: checkpoint, limites de escopo, evidencias saneadas e continuidade.

Resultado:

- Build aprovado: `:app:assembleDebug`, `BUILD SUCCESSFUL in 8m 49s`.
- APK gerado: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256: `9497463b801c1fb6dacb5ed978391b07fa473abfdb7b56e895e4b3a75ffe3146`.
- Tamanho: `80610429 bytes`.
- `private:android:readiness`: aprovado com `0 pendencia(s)`.

Bloqueio:

- `adb devices -l` nao listou aparelho.
- `adb mdns services` nao descobriu Android sem fio.
- macOS nao indicou Android/ADB/MTP visivel no USB.

Proximo passo:

- Assim que o Android voltar como `device`, instalar o APK acima, validar fonte `1.0` e `1.3`, restaurar fonte `1.0`, registrar screenshots/UI dumps saneados e crash scan antes de fechar a Frente 1.3 sem ressalvas.

### Atualizacao posterior - Android conectado e validado por Ze

Status: validacao tecnica de Ze concluida e pronta para teste manual do Roberto; fechamento definitivo ainda depende do aceite manual do Roberto.

Resultado:

- Android voltou por ADB; instalacao final ocorreu por Wi-Fi com `adb install --no-streaming -r -d`.
- Microcopy publica corrigida em `app/perfis.tsx`, removendo `Frente 1.3` e `P2P` da tela `Perfis e papeis`.
- APK final: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256 final: `abaf6fc9331e01b121789452dd0bce5f660ae417c85247d10acecac2ad7f41d9`.
- Evidencias: `docs/evidencias/android/2026-05-14-frente-1-3-visual-final/`.
- Fonte `1.0` e `1.3` validadas em `Perfis e papeis`, `Anjos de confianca` e `Convite recebido`; fonte restaurada para `1.0`.
- Crash scan saneado sem padroes fatais do processo SinalSeguro.
- Performance debug registrada: cold start por deep link em `Anjos de confianca` com fonte `1.3` mediu `8.3s` e jank alto; item mantido para hardening posterior de startup/performance.

Gates:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm run test:profiles`: aprovado.
- `:app:assembleDebug -PsinalBundleDebugJs=true -PreactNativeArchitectures=arm64-v8a`: aprovado.
- Instalacao fisica Android: aprovada via Wi-Fi ADB.

### Atualizacao posterior - validacao de convites e atualizacao no Android conectado

Status: Roberto aprovou manualmente a rodada anterior; Ze retomou com USB/Wi-Fi conectados e registrou evidencia complementar no aparelho visivel por ADB.

Resultado:

- ADB listou apenas um Android `23129RA5FL`; a validacao entre dois aparelhos fisicos ainda depende do segundo dispositivo aparecer como `device`.
- App instalado no aparelho: `versionName=0.1.1`, `versionCode=3`.
- API publica e readiness responderam `ok`, com `database=ok`.
- Tela `Anjos de confianca` validada com perfil `Adulto protegido`, estado `Aguardando aceite`, `Criar convite` permitido, `Convites` com 2 itens e `Atualizar` concluindo em `Anjos atualizados.`
- Modal `Convites` mostrou 1 convite validado pela API e 1 pre-convite local, ambos `COMPARTILHADO`, mantendo o texto publico sem expor evidencia, localizacao ou dado sensivel.
- Deep link direto para `sinalseguro://contatos` sem sessao visivel permaneceu no gate `Preparar acesso`, respeitando login, consentimentos e permissoes.
- Login Google no Android fisico concluiu com a conta do dispositivo; apos retorno ao app, `Criar convite` passou para modo `API`.
- Logcat saneado do acionamento `Atualizar` nao mostrou crash, `AndroidRuntime`, `ReactNativeJS Error` ou ANR.
- Evidencias complementares: `docs/evidencias/android/2026-05-14-dois-dispositivos-convites/`.

## 2026-05-11 - Frente 1.2: retomada CLI e checkpoint iOS parcial

Status: acesso pelo CLI normal; problema de enumeracao da raiz ficou associado ao Codex GUI. Frente 1.2 segue aberta, sem permissao para avancar frentes dependentes.

Contexto operacional:

- `pwd`, `ls ./`, `AGENTS.md`, `apps/mobile/package.json` e `git -C apps/mobile status --short --branch` foram validados no CLI.
- O erro anterior `Operation not permitted` ocorreu no Codex GUI ao enumerar a raiz iCloud; nao foi reproduzido nesta retomada CLI.
- Backup de resgate criado fora do iCloud: `/Users/roberto/SinalSeguro-resgate-20260511-132114`, com patch/status/untracked/evidencias do `apps/mobile`.
- A rodada atual e apenas de memoria/documentacao; sem codigo novo, build pesado, commit, push, limpeza destrutiva ou avanco de P2P/anjo/upload/localizacao/conveniados.

Checkpoint tecnico preservado:

- Decisao vigente mantida: `SinalSeguroMediaEngine` e `native_segmented_v1` sao o caminho principal; JS/Base64/loopback ficam como fallback legado/homologacao.
- Android build/debug desta rodada passou e APK foi preservado em `docs/evidencias/android/2026-05-11-frente-1-2-native/app-debug-85f52968.apk`, SHA-256 `85f52968ac464aca4b4b0fc868abf6bc81a1cfa015a26e62f5f19200262bf599`.
- Android fisico desta rodada ainda esta pendente porque nao havia device ADB conectado no momento da emergencia operacional.
- iPhone fisico teve dois ciclos curtos registrados com H.264 480p/650 kbps, preservacao nativa `native_segmented_v1`, sucesso de preservacao, origem apagada e pacote final com um asset anexado.
- Inventario iOS de residuos claros ficou limpo: sem `.mp4`, `.mov`, `.m4v`, `.3gp`, `.caf`, `.aac` ou `.wav` em locais inspecionados.
- Syslog iOS confirmou camera/microfone passando para estado frio apos os ciclos curtos.
- Evidencia visual iOS registrou modal final `Video protegido` com 100% e barra verde.

Limites que impedem fechamento:

- Os ciclos curtos iOS terminaram por limite de segmento antes do toque final; portanto ainda nao provam totalmente o encerramento antecipado enquanto a camera esta gravando.
- A tentativa de teste de encerramento antecipado foi abortada pela emergencia operacional de acesso local e fica como evidencia parcial.
- A captura visual apos `Abrir cofre` permaneceu no modal final; cofre visual pos-toque e Player seguem pendentes.
- iOS segue com `capture_ios_segment_limit_reached` e `maxSegments: 1`; midia longa iOS nao esta aprovada.
- Frente 1.2 nao pode ser declarada concluida nem liberar Frente 2/3/4/5.

Pendencias imediatas:

1. Resolver permissao/estado do Codex GUI ou seguir operacionalmente pelo CLI.
2. Repetir no iPhone o teste de encerramento antecipado durante gravacao.
3. Capturar Cofre visual pos-toque e Player.
4. Reconectar Android ADB e rodar validacao fisica.
5. So depois considerar gates longos de 60s, 3min e 5min.

## 2026-05-11 - Frente 1.2: Android fisico validado com player e encerramento corrigidos

Status: Android fisico aprovado para a matriz desta rodada; Frente 1.2 ainda nao esta concluida porque falta repetir o gate em iPhone fisico.

Especialistas acionados:

- Ada/Cristine: rota nativa Android, gravacao sem `maxDuration` automatico e preservacao cifrada.
- Norman/Myers: encerramento visual, modal/progresso, cofre e timeline do Player nos primeiros segundos.
- Schneier/Doneda: inventario sem midia clara persistente e logs/evidencias saneados.
- Kim/Knuth: controle de espaco, hash do APK, timeline e memoria de retomada.

Implementado nesta continuacao:

- Android deixou de usar `maxDuration` no `recordAsync`; o encerramento agora e explicito para evitar `ERROR_DURATION_LIMIT_REACHED` sem URI e pacotes salvos sem midia.
- `SinalSeguroMediaEngine` Android deixou de usar `CipherInputStream` no preparo do player e passou a descriptografar MP4 temporario com `cipher.update` em blocos e `doFinal`.
- `EvidencePlayerCard` normaliza offset inicial da timeline e protege chamadas `pause`, `play`, `replace`, `seek`, `currentTime` e `duration` contra shared object liberado ao fechar o modal.
- Smoke test foi ajustado para bloquear regressao desses tres pontos.

Validacao Android fisica:

- APK final instalado: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256 final: `b4c8eb4aad7fb7c886bf5f726f179be633e03751a5eb9ae9b79c3ee061ada0f3`.
- Android fisico `23129RA5FL` via USB, build instalado em 2026-05-11 07:58.
- SOS 60s, 3min e ciclo longo foram executados; encerramento visual saiu de `CHAMADO ATIVO` em ate 0,5s e o ciclo longo finalizou como `Video protegido`.
- Inventario final saneado do sandbox: 399 arquivos, 0 midias claras persistentes, 17 `.nseg` e 375 `.sseg`.
- Player revalidado: preparo antes do play, primeiro frame, timeline nos primeiros segundos em 0:00, 0:02 e 0:07, fechamento durante reproducao sem crash do processo SinalSeguro.
- Log final do player nao mostrou `Process: br.com.sinalseguro.app`, `JavascriptException`, `Cannot use shared object` nem `VideoPlayer.pause`.
- `gfxinfo` do ciclo longo: 45992 frames, 239 janky frames (0,52%), p50 20ms, p90 29ms, p95 32ms, p99 38ms.

Gates finais:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: aprovado com pendencia ambiental conhecida de Node local 20.16.0 para release publico.
- `git diff --check`: aprovado.

Pendencias:

- Repetir iPhone fisico antes de declarar a Frente 1.2 concluida.
- Nao avancar chamada P2P/anjo, upload, localizacao ou conveniados; esta frente segue apenas com compatibilidade de captura/envelope/camera/microfone.
- Antes de qualquer nova build Android/iOS, limpar regeneraveis porque o pos-build deixou `/` abaixo do gate de 10 GiB.

## 2026-05-10 - Frente 1.2: checkpoint de interrupcao, encerramento e compatibilidade de midia

Status: checkpoint salvo para retomada; implementacao local validada por gates, mas validacao fisica final ainda pendente.

Especialistas acionados:

- Ada/Cristine: captura segmentada, estado do recorder, compatibilidade Android/iOS e contrato mobile.
- Katherine/Margaret: continuidade React Native/Expo, modal de encerramento e estado assicrono do SOS.
- Norman/Myers: UX de encerramento, feedback visual, timeline do Player e evidencias Android.
- Schneier/Doneda: logs saneados, sem upload/compartilhamento real, sem URI/chave/token/coordenada em diagnosticos.
- Kim: limpeza de regeneraveis e controle de espaco antes de build.
- Knuth: memoria, timeline e retomada sem redundancia.

Implementado:

- Modal de encerramento com barra de progresso, estados de sucesso/alerta/falha e acao para abrir o Cofre.
- Encerramento do SOS deixa de depender visualmente do termino imediato da camera: o pacote sai do modo ativo, o recorder continua montado para anexar midia tardia e novo SOS fica bloqueado enquanto ha protecao pendente.
- Diagnosticos saneados sao persistidos quando o pacote termina sem midia.
- Android e iOS passam a seguir perfil conservador de midia: segmentos de 12s, 480p, bitrate de homologacao 650 kbps e H.264/MP4 quando a plataforma suporta.
- Perfil de compatibilidade de captura foi adicionado aos assets/envelopes: plataforma, versao, camera solicitada/runtime/real, tier de compatibilidade, tamanhos/lentes/codecs disponiveis e flags de envelope futuro para P2P.
- Player Seguro teve sincronismo de timeline ajustado com polling mais frequente e estado de tempo/duracao dedicado.
- `PanicButton` ganhou `onLongPress` nativo como fallback, preservando o timer visual e evitando disparo duplo.
- Busca direta por pacote no cofre seguro reduz custo ao finalizar/anexar/diagnosticar um pacote especifico.

Evidencia Android obtida antes da ultima correcao:

- APK instalado no Android fisico modelo `23129RA5FL` com identificador redigido.
- O modal apareceu, mas ficou em `Encerrando gravacao` 24% e o topo ainda mostrava `CHAMADO ATIVO`.
- Logcat confirmou fechamento tardio da camera/CameraX e evento `Recorder: stop() called on a recording that is no longer active`.
- A partir disso, foi aplicada correcao adicional: segmentacao Android curta e saida visual imediata do estado ativo.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test -- --runInBand`: aprovado.
- `git diff --check`: aprovado.
- Limpeza de regeneraveis recuperou cerca de 2,7 GiB reais.
- APK privado gerado: `distribution/android/out/sinalseguro-android.apk`.
- SHA-256 do APK: `d00beb8f7b551300a1f750ca059ad294f040947d796868176124eb44003df9f4`.

Pendencias:

- Instalar e validar fisicamente o APK `d00beb8f7b551300a1f750ca059ad294f040947d796868176124eb44003df9f4`.
- Confirmar em Android fisico: encerramento visual imediato, modal evoluindo, Cofre protegido/processando/sem midia com causa saneada, ausencia de residuo `.mp4` claro permanente e Player com timeline fluida.
- Repetir no iPhone fisico, pois Roberto confirmou que a demora de encerramento tambem ocorria no iPhone.
- Nao iniciar UI final de chamada P2P/anjo neste checkpoint; manter apenas a compatibilidade de captura/envelope e liberacao correta de camera/microfone.

## 2026-05-07 - Frente 1.1: chaves reais por dispositivo

Status: concluido, publicado em producao e homologado no Android e no iPhone fisicos.

Especialistas acionados:

- Ada/Cristine: armazenamento local seguro, migracao do vinculo antigo e contrato mobile.
- Ritchie: serializer, modelo, endpoints e testes Django.
- Schneier/Doneda: chave privada somente no aparelho, metadados saneados, revogacao e perda.
- Myers: typecheck, lint, testes mobile e testes backend.

Decisoes:

- Algoritmo escolhido: `ed25519-v1`.
- Formato da chave publica: `sseg-device-public-key-v1:ed25519:<base64url-raw-32>`.
- A chave privada fica no `SecureStore` nativo com escopo do dispositivo; a API recebe apenas chave publica, hash, metadados saneados e `key_proof`.
- `POST /api/devices/` passa a exigir prova de posse assinada.
- `POST /api/devices/{id}/rotate-key/` rotaciona a chave publica com assinatura da nova chave.
- `POST /api/devices/{id}/mark-lost/` revoga por perda de aparelho.
- Hash legado e usado apenas para migrar o mesmo dispositivo para a chave Ed25519, sem expor segredo.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado, incluindo prova Ed25519.
- Backend `manage.py check`: aprovado.
- Backend `manage.py test sinalseguro_api.tests.test_platform_base`: aprovado.
- iPhone fisico: build corrigido com xcconfig temporario, `Info.plist` sem URL scheme vazio, login Google sem fechar o app e API confirmando iOS ativo com `ed25519-v1`.

Fora de escopo:

- Anjos, chamada, midia remota, localizacao em tempo real e conveniados.

## 2026-05-07 - Frente 1 iOS: build fisico instalado e limpeza entre plataformas

Status: build iOS privada compilada, instalada e validada no iPhone fisico.

Especialistas acionados:

- Ada/Cristine: build iOS, Google Sign-In nativo e consistencia com Android.
- Kim: limpeza de regeneraveis e uso de DerivedData temporario para pouca area livre local.
- Schneier/Myers: saneamento de logs, ausencia de segredos versionados e validacao fisica.

Decisoes:

- Ao alternar Android -> iOS, limpar regeneraveis Android antes da build iOS: `android/app/build`, `android/build`, `android/.gradle` e temporarios `sinalseguro-android-*`.
- Ao alternar iOS -> Android, limpar regeneraveis iOS antes da build Android: `ios/build`, DerivedData temporario `sinalseguro-ios-deriveddata` e logs temporarios, preservando `ios/Pods` quando a proxima build iOS ainda for necessaria.
- Builds iOS usam segredo local em `.env.local` e xcconfig temporario fora do Git; logs de Xcode/devices devem ser redigidos antes de qualquer registro.
- `npm run prepare:build:ios:secure-config` gera `/private/tmp/sinalseguro-ios-secrets.xcconfig` a partir do ambiente local e impede build iOS sem Web Client ID, iOS Client ID e URL scheme configurados.
- `ios/Podfile` passou a corrigir o script phase do `EXConstants` no `post_install`, porque o caminho iCloud contem espaco e o podspec do Expo nao cotava `$PODS_TARGET_SRCROOT`.
- `app.config.js` fornece `iosUrlScheme` ao plugin Google Sign-In somente a partir de ambiente local, sem versionar o valor real.
- Scripts versionados foram adicionados em `scripts/` na raiz para o workflow local: `prepare-platform-build.mjs` e `patch-ios-pods-path-spaces.mjs`, chamados no app por `prepare:build:ios`, `prepare:build:android` e `patch:ios:path-spaces`; o script app-local `scripts/prepare-ios-secure-build-config.mjs` gera o xcconfig iOS temporario sem imprimir valores reais.

Validacoes:

- Android regeneravel foi limpo e o espaco livre subiu de cerca de 7,9 GiB para cerca de 13 GiB antes do build iOS.
- `xcodebuild Release` para iPhone fisico: aprovado.
- `.app` compilado contem URL scheme Google iOS esperada, sem imprimir o valor.
- Instalacao no iPhone via `ios-deploy`: aprovada.
- API publica segue `health=ok` e readiness `database=ok`.
- EC2: `sinalseguro-api` e `cereusia-crm` ativos.
- Frente 1.1 iOS: build corrigido validou URL schemes, `Entrar com Google` nao fechou mais o app e a API confirmou dispositivo iOS ativo com `key_algorithm=ed25519-v1`.

Bloqueios:

- `devicectl` nao encontrou provider CoreDevice, mas `ios-deploy` funcionou para instalar.
- Teste de convites Android/iOS segue fora desta frente e depende de novo prompt com Android reconectado no ADB.

## 2026-05-05 - Midia criptografada em chunks

Status: implementado localmente e validado por typecheck, lint e testes unitarios.

Especialistas acionados:

- Ada/Ritchie: mapeamento do fluxo de gravacao, armazenamento, manifesto e player.
- Schneier/Myers: riscos de arquivo claro, hash em memoria, chunk corrompido, chave invalida e QA de regressao.

Decisoes:

- Videos novos deixam de ser preservados como MP4 claro no sandbox e passam para `EncryptedVideoStore`.
- Cada video recebe chave simetrica unica e chunks cifrados individualmente com XChaCha20-Poly1305.
- Manifesto seguro passa a guardar offsets, tamanhos, nonces, tags, hashes, codec, thumbnail pendente e envelopes futuros.
- `EncryptedVideoDataSource` implementa leitura por range para seek/replay sem descriptografar o arquivo inteiro.
- Player URI atual nao deve abrir ciphertext; assets cifrados ficam marcados como dependentes de adaptador local de range.
- Proxima etapa tecnica e ligar a fonte por range ao player nativo/local HTTP loopback e medir TTFF, memoria e CPU em Android real.

Documentacao:

- `docs/30_MIDIA_CRIPTOGRAFADA_CHUNKS.md`.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado com smoke e testes de cripto/range.

## 2026-05-06 - Midia segura C2: thumbnail cifrada e limpeza de residuos

Status: implementado e validado localmente no Android fisico.

Especialistas acionados:

- Ada: arquitetura POO de store, thumbnail e limpeza de residuos.
- Schneier: regra de nao apagar MP4 claro antes de preservar e verificar copia cifrada.
- Myers: inventario ADB absoluto para provar ausencia de residuo claro no cache nativo.

Decisoes:

- `EncryptedVideoStore` reabre a chave local, o manifesto cifrado e todos os chunks antes de apagar qualquer arquivo claro temporario da captura.
- `SecureVideoThumbnailStore` gera a thumbnail a partir do video original, cifra como `thumbnail.sseg` e apaga a thumbnail clara temporaria mesmo em falha.
- `CameraCaptureResidueCleaner` limpa somente residuos `.mp4` sob `cache/Camera` depois de preservacao verificada, sem tocar no diretorio cifrado.
- Falhas de thumbnail viram `pending_secure_derivation`; falhas de limpeza viram `cleanup_pending`; falhas de preservacao nao apagam o video claro original.
- O modelo permanece preparado para envelopes de chave por destinatario na fase futura de compartilhamento com anjos/EC2/P2P.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm test`: aprovado.
- `npm run lint`: aprovado.
- `npm run build:android:private`: aprovado.
- APK privado instalado no Android fisico `[ip-redigido]:5555`, SHA-256 `024150800908109199f84e1be2ef5bd9c72ae1f6986ecee0a8269f2c44ca1323`.
- SOS iniciou e encerrou; asset `7c967904-589c-452c-85fc-8203aee83be9` foi preservado com `manifest.sseg`, chunks `.sseg` e `thumbnail.sseg`.
- Inventario ADB absoluto confirmou `cache/Camera` vazio, `cache/VideoThumbnails` vazio e nenhum `.mp4` claro nesses caches apos preservacao.
- Evidencias em `docs/evidencias/android/2026-05-06-capture-cleanup-thumbnail/`.

Proximo bloco:

- Retomar a trilha remota sem alterar esta interface de midia: envelopes de chave, sessao de emergencia e entrega controlada para anjos autenticados via EC2/API, mantendo midia/audio/localizacao criptografados.

## 2026-05-05 - Plano remoto EC2, P2P e conveniados

Status: implementado como contrato local de arquitetura; transmissao real segue bloqueada.

Especialistas acionados:

- Ritchie/Kim: EC2 como servidor de coordenacao `sinalseguro-api`.
- Ada: contrato mobile para sessao remota durante emergencia ativa.
- Schneier/Doneda/Myers: bloqueios de compartilhamento, chaves, auditoria, RBAC e fase futura de conveniados.

Decisoes:

- A EC2 existente sera considerada coordenadora de login, dispositivos, diretorio de chaves publicas, envelopes de chave, sinalizacao P2P e auditoria.
- O transporte preferencial futuro para anjos e P2P com criptografia ponta a ponta; servidor nao deve acessar midia/audio/localizacao em claro.
- Compartilhamento em tempo real fica limitado ao periodo de emergencia ativa.
- Conveniados ficam separados em fase futura com contrato, RBAC, MFA, retencao, auditoria e RIPD/DPIA.
- `EmergencyDeliveryPlan` ganhou `remoteSharing` e pacotes antigos sao normalizados ao listar.

Documentacao:

- `docs/31_ARQUITETURA_COMPARTILHAMENTO_TEMPO_REAL.md`.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm test`: aprovado.

## 2026-05-05 - Interface de midia do Cofre e Player

Status: implementado e validado no browser local.

Decisoes:

- Este chat fica dedicado apenas a interface de midia; integracao backend/mobile/CRM segue na sessao bifurcada `019df9a8-1894-7002-b7f8-199eaaf3f118`.
- `LocalEvidenceRail` agora diferencia visualmente arquivo protegido, local, parcial e vazio sem expor jargao tecnico.
- `EvidencePlayerCard` passou a tratar estados de video legado, video protegido e ausencia de midia com rotulos centralizados.
- `mediaInterfacePresentation` centraliza rotulos de protecao, tamanho, camera, armazenamento e playback.
- O topo da rota `/arquivos` reflete `Player seguro` ou `Cofre local` conforme o painel ativo.
- Browser web foi corrigido para nao quebrar em `Linking.openSettings()` quando a tela de Configuracoes for acessada durante validacao.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- Browser local: `http://localhost:8081/arquivos?painel=cofre` e `http://localhost:8081/arquivos?painel=player` renderizaram sem erro.

## 2026-05-02 - Checkpoint inicial

Status: publicado no GitHub; aguardando instaladores assinados.

Decisoes:

- App criado em `apps/mobile`.
- Stack React Native + Expo Dev Client/EAS.
- Android 7+ e iOS 15.1+.
- Cristine criada como gerente AI mobile.
- Documentacao, memoria e estrutura inicial versionadas.
- OpenAPI inicial copiada para `docs/api/openapi.yaml`.
- Commit local inicial criado em `main`.
- Remote configurado como `https://github.com/sinalseguro/App.git`.
- Push para o remoto resolvido com a chave SSH `id_ed25519_github_sinalseguro` e alias local `github-sinalseguro-admin`.
- Tarcila aprovou o uso operacional da logo ja aplicada nos portais para o README do app.
- QR codes Android/iOS gerados em `assets/qr/`.
- Manifesto de instaladores criado em `distribution/installers.json`.
- Documentacao de distribuicao e lifecycle adicionada.

Entregas esperadas no fechamento:

- Git inicial em `main`.
- Remote `https://github.com/sinalseguro/App.git`.
- App shell com rotas principais.
- Design tokens e componentes obrigatorios.
- Sem segredos, dados reais ou arquivos sensiveis.

Validacoes executadas:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado com checagem local contra padroes sensiveis.
- `npm test`: aprovado com smoke test.
- `npm run assets:qr`: aprovado.
- `npm audit --omit=dev --audit-level=high`: sem vulnerabilidades altas/criticas; permanecem moderadas transitivas da cadeia Expo que exigem correcao upstream ou `--force` com quebra de SDK.

Proximo passo operacional:

- Gerar APK Android assinado e publicar em GitHub Releases quando a permissao estiver resolvida.
- Preparar TestFlight/App Store para iOS com conta Apple e documentos de privacidade.

## 2026-05-03 - Refino de identidade, modais, Cofre fixo e splash aprovada

Status: implementado e validado no Browser Use; APK debug reconstruido; instalacao Android pendente por ausencia de dispositivo no ADB.

Especialistas acionados:

- Tarcila/Norman: identidade visual, topo com logo, splash, SOS 3D discreto, modais e Cofre iconografico.
- Ada/Hedy/Margaret: arquitetura React Native, tela fixa, componentes reutilizaveis e APK debug.
- Schneier/Doneda/Myers: bloqueio de midia real, permissoes, cofre, confirmacoes e gates.

Decisoes:

- Splash nativa passa a usar `assets/brand/sinalseguro-splash-approved.png`.
- Topos internos usam `AppTopBar` com logo, contexto, voltar e menu.
- Fluxos criticos deixam de usar `Alert.alert` e passam a usar `BrandedDialog`.
- Cofre local vira tela fixa por icones e abre Player/Cofre em modal.
- Dados tecnicos do Cofre ficam no menu sanduiche.
- Pagina `Como funciona` criada para explicar fluxo, privacidade e limites.
- Preferencia de camera frontal/traseira/ambas foi preparada somente como homologacao; build publico segue sem `CAMERA` e `RECORD_AUDIO`.

Evidencias:

- `docs/assets/mobile/2026-05-03-home-sos.png`;
- `docs/assets/mobile/2026-05-03-home-menu.png`;
- `docs/assets/mobile/2026-05-03-cofre-fixo.png`;
- `docs/assets/mobile/2026-05-03-cofre-player-modal.png`;
- `docs/assets/mobile/2026-05-03-funcionamento.png`;
- relatorio: `docs/22_REFINO_IDENTIDADE_MODAL_COFRE_SPLASH.md`;
- especificacao viva: `docs/23_ESPECIFICACAO_DESENVOLVIMENTO_APP.md`.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.

## 2026-05-03 - Ajuste prioritario do anel SOS e cameras

Status: implementado, build privado gerado e instalado no Android.

Especialistas acionados:

- Tarcila/Norman: anel de progresso dentro da circunferencia visual do botao SOS.
- Ada/Hedy: configuracao frontal/traseira/duas cameras com fallback tecnico.
- Myers: gates locais, instalacao e cold start no Android.
- Cristine/Knuth: memoria viva e documentacao.

Decisoes:

- O progresso do gesto usa camada SVG recortada pela propria circunferencia do botao, sem anel externo.
- O acionamento permanece em sentido horario; o encerramento usa sentido anti-horario.
- A opcao `Duas cameras` tenta captura dupla no build privado; se a plataforma bloquear, tenta frontal e depois traseira antes de seguir sem video.
- O card `Midia` em Configuracoes mostra a camera selecionada.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm test`: aprovado.
- `npm run lint`: aprovado.
- `npm run build:android:private`: aprovado.
- APK instalado no Android `[ip-redigido]:5555`: `Success`.
- Cold start: `TotalTime: 3442`, sem erro fatal filtrado.
- Browser simulator aberto em `http://localhost:8081/`.
- `npm run private:android:readiness`: aprovado como build privado condicionado.
- `npm run build:android:private`: `BUILD SUCCESSFUL`.
- `adb install -r`: `Success` no Android `23129RA5FL` via `[ip-redigido]:5555`.
- Cold start Android apos ajuste do topo: `Status: ok`, `LaunchState: COLD`, `TotalTime: 6026`.
- Logcat filtrado sem falhas fatais.

Artefatos:

- APK privado: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256: `b6993cf4056d9926e582e9579621f4e32f468fc83e1cc66185678652b51df22f`.
- Evidencia Android do topo com simbolo sem texto: `docs/assets/mobile/2026-05-03-android-topo-simbolo.png`.
- Browser Use em `http://localhost:8081/`: aprovado.
- `./gradlew assembleDebug`: aprovado.

Android:

- APK debug: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256: `481d9aca5dd1cabb36520440f7959c71b542af5619803aadbe5170164b300e70`.
- `adb devices -l`: sem dispositivos conectados; reinstalacao fisica ficou pendente.

Handoff:

- Agentes dos portais devem usar este checkpoint e a sessao `019ddfad-a214-72a3-9b50-ba204e1c9351` para refatorar conteudo publico com foco no app, gratuidade, privacidade, cofre e botao SOS.

Complemento de continuidade:

- Schneier/Doneda/Myers identificaram que o Cofre encerrava chamado ativo por um caminho menos protegido.
- `app/arquivos.tsx` foi ajustado para exigir `BrandedDialog`, confirmacao e codigo local opcional no encerramento pelo Cofre.
- `BrandedDialog` recebeu rolagem interna para telas menores e fonte ampliada.
- `docs/23_ESPECIFICACAO_DESENVOLVIMENTO_APP.md` passou a documentar permissoes transitivas observadas no APK debug.
- Prints de `Cofre fixo` e `Como funciona` foram recapturados com a tela real, nao com splash/loading.
- Registro historico: `EmergencySettingsDrawer` chegou a separar modo e ajuda em botoes irmaos; checkpoint posterior substituiu esse arranjo por um drawer sem metricas/status e apenas com acoes iconograficas.
- Relatorio complementar criado em `docs/24_CONTINUIDADE_COFRE_ENCERRAMENTO_QA.md`.
- Gates aprovados no complemento: `typecheck`, `lint`, `test`, `git diff --check`, `release:android:readiness` com Node 24 e `assembleDebug`.
- `adb devices -l` seguiu sem dispositivo; tentativa de `adb connect [ip-redigido]:5555` retornou `Connection refused`.

## 2026-05-02 - Acesso GitHub resolvido

Status: concluido.

- Chave publica `SHA256:D8EsPR5ldcu1hfb5vUbJFupSLsktofuGVPdr7gXg29A` cadastrada na conta GitHub `sinalseguro` como chave de autenticacao com leitura/escrita.
- Alias local `github-sinalseguro-admin` criado em `~/.ssh/config`.
- `origin` do app atualizado para `git@github-sinalseguro-admin:sinalseguro/App.git`.
- `main` publicado em `sinalseguro/App`.
- `push --dry-run` validado para `sinalseguro/App`, `sinalseguro/portais` e `sinalseguro/empresa`.

## 2026-05-02 - Etapa 1 Android instalavel iniciada

Status: APK assinado publicado em GitHub Releases para homologacao controlada.

Especialistas acionados:

- Kim: release EAS, GitHub Releases, hashes e deploy do portal.
- Ada/Margaret: compatibilidade Expo/Android, `minSdkVersion 24`, `targetSdkVersion 36`, APK preview e AAB futuro.
- Schneier/Doneda/Myers: segredos, permissoes, logs, LGPD, QA e bloqueios de homologacao.

Decisoes:

- Etapa 1 libera somente APK interno tecnico de app shell e alerta simulado.
- `eas.json` passa a declarar `preview.android.buildType = apk` e `production.android.buildType = app-bundle`.
- Camera e microfone ficam fora das permissoes do primeiro instalavel; midia volta apenas em homologacao controlada com RIPD/DPIA.
- Logs de acionamento simulado foram removidos do fluxo de alerta.
- `npm run release:android:readiness` passa a ser o gate operacional antes de qualquer build Android.
- `expo-build-properties` passa a concentrar `minSdkVersion 24`, `targetSdkVersion 36` e `deploymentTarget 15.1`.
- Peers nativos exigidos pelo Expo Doctor foram adicionados: `expo-font`, `react-native-svg` e `react-native-worklets`.
- Nova Arquitetura React Native permanece ativa por exigencia do Expo Router/Reanimated; o build local foi limitado a ABIs ARM para reduzir CMake/NDK.
- Android SDK local foi preparado com `android-36`.
- Keystore de upload foi criada fora do repositorio, com senhas no Keychain.
- APK local assinado gerado em `distribution/android/out/sinalseguro-android.apk`, ignorado pelo Git.
- SHA-256 do APK: `a920c116adff07f9121281c1cd3d086daeee969dd014741658d24dd128c280f5`.
- Release notes e checksum saneados foram versionados em `distribution/android/`.
- GitHub Release publicada: `https://github.com/sinalseguro/App/releases/tag/android-v0.1.0-internal.1`.
- Portal e manifestos foram atualizados para apontar ao APK e checksum.
- Deploy dos portais concluido em `cereus_web:/var/www/sinalseguro/releases/20260502T183150Z`.

Bloqueios atuais:

- ambiente local deve usar Node 22.13+;
- EAS remoto autenticado continua pendente;
- build local deve priorizar ABIs ARM para celulares reais;
- keystore/credencial Android precisa permanecer fora do Git;
- producao publica segue bloqueada ate QA, privacidade, backend homologado e trilha de loja;
- nenhum APK deve ser publicado sem SHA-256, release notes saneadas e revisoes Myers/Schneier/Doneda/Cristine.

Validacoes executadas:

- `npm run doctor`: aprovado, 17/17 checks;
- `npm run release:android:readiness`: aprovado como pronto condicionado, com pendencias de SDK local e assinatura;
- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run assets:qr`: aprovado;
- `npm audit --omit=dev --audit-level=high`: sem vulnerabilidades altas/criticas; permanecem moderadas transitivas da cadeia Expo.

## 2026-05-02 - Validacao visual Tarcila e Android interno 2

Status: APK Android interno 2 publicado em GitHub Releases e validado em aparelho fisico via ADB Wi-Fi.

Especialistas acionados:

- Tarcila: validacao do uso da identidade visual, logo, icone, splash e nome oficial do app.
- Norman/Ada: ajustes de tela inicial, lockup e consistencia visual Android/iOS.
- Myers/Schneier: QA de instalacao, permissao e ausencia de permissao sensivel prematura.

Decisoes:

- Nome oficial permanece `SinalSeguro` em app, README, portal e label Android.
- Icone do app usa o simbolo aprovado em fundo institucional `#1E1B2E`.
- Splash usa logo SinalSeguro e fundo institucional, sem marcas de terceiros.
- Tela inicial usa `BrandLockup` com simbolo e nome, sem assinatura textual.
- Botao de panico simulado passa para `colors.panic = #C2185B`.
- Sombra do design system passa a usar `shadowOpacity`, evitando reduzir a opacidade do botao.

Evidencias:

- APK local: `distribution/android/out/sinalseguro-android.apk` (ignorado pelo Git).
- SHA-256: `dbad294407038cac954fd3154bac6c4ea9dbb30b4e79164f58807e83f0d358cb`.
- Versao instalada no Android fisico: `versionCode=2`, `versionName=0.1.0`.
- Label Android validado: `SinalSeguro`.
- Assinatura APK Scheme v2: valida.
- Permissoes validadas sem `CAMERA`, `RECORD_AUDIO`, `SYSTEM_ALERT_WINDOW`, `READ_EXTERNAL_STORAGE` ou `WRITE_EXTERNAL_STORAGE`.
- Captura local saneada: `/tmp/sinalseguro-android-qa/home-v2.png`.

Portal:

- Portal publicado em `cereus_web:/var/www/sinalseguro/releases/20260502T191004Z`.
- Manifesto publico `https://www.sinalseguro.com.br/downloads/installers.json` validado com `android-v0.1.0-internal.2` e SHA-256 correto.
- Paginas `/baixar`, `/baixar/android` e `/baixar/ios` retornaram HTTP 200.

Pendencias:

- Remover ativos visuais duplicados do portal somente com confirmacao explicita de exclusao.

## 2026-05-02 - Convites e pacote local de emergencia

Status: base tecnica implementada para convites, georreferencia pontual e pacote local pronto para API/P2P futuro.

Especialistas acionados:

- Hedy/Ada: funcoes mobile de convite, pacote local, outbox e preparo de entrega.
- Ritchie: alinhamento com contratos `invitations` e `alerts` do OpenAPI.
- Schneier/Doneda: bloqueios de midia real, cofre local, consentimento e ausencia de transmissao.
- Myers: criterios de teste para convite, outbox, localizacao e permissao negada.

Decisoes:

- Convite local gera codigo opaco, expiravel em 7 dias e de uso unico.
- Link publico de convite usa `https://www.sinalseguro.com.br/baixar?convite=<codigo>` para manter QR/link estavel.
- Deep link futuro usa `sinalseguro://convite?convite=<codigo>`.
- Aceite real exige login proprio, consentimento e validacao de API; o app nao permite entrar como outra pessoa.
- Botao de teste grava pacote local com horario, consentimento, localizacao pontual autorizada, manifesto de midia bloqueada e plano de entrega.
- Area `Arquivos locais` permite visualizar pacotes gravados, hash, status de georreferencia, midia bloqueada e plano de envio futuro.
- Pacote local fica em cofre do sistema via `expo-secure-store`, com indice sem dado sensivel em `AsyncStorage`.
- Hash SHA-256 registra integridade do pacote.
- API e P2P ficam como adaptadores pendentes; nenhuma transmissao real ocorre neste checkpoint.
- Camera, microfone e midia real continuam bloqueados no build publico.

Arquivos principais:

- `src/features/invitations/invitationService.ts`;
- `src/features/emergency/emergencyRecorder.ts`;
- `src/features/emergency/emergencyOutbox.ts`;
- `src/features/emergency/locationCapture.ts`;
- `src/features/emergency/packagePresentation.ts`;
- `src/components/EmergencyPackageCard.tsx`;
- `app/arquivos.tsx`;
- `src/storage/secureJsonStore.ts`;
- `docs/14_CONVITES_E_PACOTE_EMERGENCIA.md`.

Proximo passo:

- Validar no Android fisico geracao de convite, permissao de localizacao permitida/negada e persistencia da outbox apos reiniciar o app.
- Conectar envio real somente quando backend, autorizacao, termos, retencao e revisao de seguranca estiverem prontos.

## 2026-05-02 - Validacao Android dos recursos locais

Status: concluido em aparelho Android fisico com ADB Wi-Fi.

Especialistas acionados:

- Cristine: continuidade, checkpoint e registro de memoria.
- Ada/Hedy/Margaret: instalacao Android, fluxo de convite, alerta de teste, outbox e compatibilidade.
- Myers/Schneier: permissoes, logcat, ausencia de midia real, ausencia de transmissao e criterios de bloqueio.
- Doneda: minimizacao de dados e evidencias sem contatos/conversas reais.

Decisoes e ajustes:

- O aparelho foi configurado para ADB Wi-Fi em `[ip-redigido]:5555`.
- O APK debug validado tem SHA-256 `a3b04d9e29349319ead70200c75c030d980b6b1b67feb8a5d34ec78c6b6b71b5`.
- Foi identificado e corrigido `SYSTEM_ALERT_WINDOW` em manifest debug gerado pelo Expo.
- Foi criado plugin local `./plugins/with-android-debug-permission-hardening` para preservar essa regra nos proximos prebuilds.
- Evidencias com contatos/conversa do aparelho foram descartadas por privacidade.

Validacoes:

- app abriu sem crash;
- convite local criado e listado como pendente;
- share sheet abriu para envio do convite;
- deep link `sinalseguro://convite?convite=qa123` abriu a tela correta;
- alerta de teste criou pacote local com georreferencia consentida;
- tela `Arquivos locais` exibiu hash, status de entrega, status de midia e plano API/P2P;
- outbox persistiu apos `force-stop` e reabertura;
- negacao oficial de localizacao gerou pacote local com `permission_denied`;
- `aapt` e `dumpsys package` confirmaram ausencia de camera, microfone, overlay e storage legado;
- logcat do processo do app nao mostrou crash, coordenadas, tokens, payloads sensiveis, upload, `/alerts`, WebRTC, camera ou microfone;
- sandbox do app nao possui arquivos de audio, video ou imagem.

Evidencias:

- `docs/15_VALIDACAO_ANDROID_RECURSOS_LOCAIS.md`;
- `docs/evidencias/android/2026-05-02-recursos-locais/`.

## 2026-05-02 - Duracao, finalizacao, GPS agil e limites de segundo plano

Status: implementado no app shell; segundo plano e atalho fisico ficam bloqueados para build publico e documentados para homologacao.

Especialistas acionados:

- Ada/Hedy/Margaret/Katherine: limites Android/iOS, Expo Location e arquitetura mobile.
- Norman/Myers: UX de emergencia, estados do chamado, falso positivo e testes.
- Schneier/Doneda: permissoes, LGPD, background location e bloqueios de loja.
- Cristine/Knuth: memoria, timeline e lifecycle.

Decisoes:

- GPS "sem pedir sempre" passa a significar reutilizar permissao foreground ja concedida, nunca burlar o dialogo do sistema.
- Configuracoes ganhou pre-autorizacao de localizacao e leitura de status de permissao.
- Tempo padrao de gravacao passou por evolucao posterior: `Ilimitado`, `1min`, `5min`, `15min`, `30min`, `60min`.
- Chamado local ativo usa status `recording_local`.
- Usuaria pode finalizar manualmente o chamado; o pacote nao e apagado, e fechado com `manual_finish`.
- O chamado ativo nao encerra automaticamente por tempo; encerramento automatico antigo foi removido do fluxo ativo.
- Hash do pacote finalizado e recalculado sem carregar o bloco `integrity` anterior.
- Background location nao entra no build publico; exige homologacao com foreground service/notificacao persistente e revisao Doneda/Schneier.
- Atalho por volume com tela travada fica como pesquisa futura nativa, sem promessa no MVP.
- Startup Android recebeu `SplashScreen.hideAsync()` no layout raiz e foi validado em aparelho fisico.
- Tarcila aprovou splash, icone, adaptive icon atual e lockup para homologacao interna.
- Validacao fisica confirmou configuracao de duracao `30s`, recarregamento de preferencias no foco, chamado ativo, finalizacao manual e pacote em `Arquivos locais`.
- `Configuracoes` passou a tratar ausencia de `ACCESS_BACKGROUND_LOCATION` como bloqueio esperado, sem quebrar a tela.

Documentacao:

- `docs/16_SEGUNDO_PLANO_ATALHO_FISICO_E_DURACAO.md`.
- `docs/12_TARCILA_LOGO_README.md`.

## 2026-05-02 - Botao central, cofre/player, streaming autorizado e 190

Status: UX implementada no app shell; streaming real, player real e compartilhamento externo seguem bloqueados para build publico.

Especialistas acionados:

- Tarcila/Norman: splash, identidade visual, botao circular, atalhos e cofre.
- Ada/Hedy/Ritchie: preferencias de midia, contrato bilateral, player, backend e chaves.
- Schneier/Doneda/Myers: seguranca, LGPD, retencao, auditoria e criterios de bloqueio.

Decisoes:

- splash custom passa a ter simbolo maior, nome `SinalSeguro` abaixo e barra de loading;
- fundo da splash muda para `#120A20` para diferenciar melhor a logo;
- efeitos ornamentais foram removidos da splash;
- Home prioriza botao circular central `SOS`;
- atalhos principais ficam em grade: `Ligar 190`, `Anjos`, `Cofre`, `Config.`;
- botao 190 abre confirmacao e usa `tel:190`, sem promessa de integracao oficial;
- atalho 190 fica ativo por padrao, configuravel pela usuaria e sem acionamento automatico;
- chamada para anjo autorizado entra como preferencia futura, exigindo contato validado, contrato e confirmacao;
- `Arquivos locais` passa a ser tratado como `Cofre local`;
- player visual mostra midia bloqueada, politica de criptografia e acoes futuras;
- configuracoes permitem solicitar escopos futuros de audio, video e localizacao em tempo real, sempre bloqueados como `homologation_blocked`;
- envio backend/P2P deixa de ser marcado como pronto no envelope local enquanto adaptadores reais nao existem;
- compartilhar evidencia por share sheet generico fica bloqueado.

Documentacao:

- `docs/17_STREAMING_COFRE_PLAYER_E_190.md`.

Validacoes executadas:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run release:android:readiness`: pronto condicionado, com assinatura externa e diretorio nativo gerado como pendencias esperadas;
- Android fisico `23129RA5FL`: Home com `SOS`, atalho 190 com confirmacao, `Cofre local` com player bloqueado e `Configuracoes` com escopos futuros validados via ADB Wi-Fi.

## 2026-05-03 - Splash sem logo nativa antiga e Cofre com acoes em raio

Status: pronto para validacao simulada no Android conectado, com Metro ativo.

Especialistas acionados:

- Tarcila/Norman/Myers: revisao de splash, Home, player, trilha retratil e menu em raio.
- Schneier/Doneda/Ritchie: revisao de consentimento, convites, estados locais, delete e bloqueio de compartilhamento.
- Ada/Margaret/Myers: rebuild, instalacao e validacao Android via ADB Wi-Fi.

Decisoes:

- splash nativa Android remove a logo horizontal antiga; decisao posterior substituiu o drawable transparente pelo simbolo discreto aprovado;
- nao ha plugin blank ativo no estado vigente; `app.json` define a splash nativa com `sinalseguro-splash-approved.png`;
- pacote finalizado fica em `recorded_local`, sem promessa de fila/entrega;
- `consentSnapshot.sharing` passa a `blocked_until_contract_backend_audit`;
- contatos mock nao entram como autorizados no pacote de emergencia;
- pre-convites locais nao prometem aceite, revogacao ou uso controlado sem backend;
- delete local grava tombstone/auditoria antes de remover do dispositivo;
- player fica em area dedicada e a trilha de arquivos abre acoes em raio no pacote selecionado.

Validacoes executadas:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `./gradlew :app:assembleDebug --console=plain`: aprovado;
- instalacao Android via ADB Wi-Fi: `Success`;
- Metro validado com `packager-status:running`;
- Home, Cofre, player, trilha retratil, acoes em raio e compartilhamento bloqueado validados em Android fisico;
- evidencias salvas em `docs/evidencias/android/2026-05-03-ux-cofre/`;
- relatorio criado em `docs/18_VALIDACAO_UX_SPLASH_COFRE_ANDROID.md`.

## 2026-05-03 - Refino splash, SOS ativo, player local e simulador web

Status: implementado e validado no navegador; aguardando rebuild Android final.

Especialistas acionados:

- Tarcila/Norman: identidade visual, splash nativa com simbolo discreto, SOS ativo e layout do Cofre.
- Ada/Margaret/Kim: Expo web, dependencia `react-native-web`, splash nativa e build Android.
- Hedy: protocolo do botao SOS ativo, encerramento e player local.
- Schneier/Doneda/Myers: codigo de encerramento, hash local, exclusao, logs e criterios de aceite.

Decisoes:

- a splash nativa volta a exibir apenas o simbolo aprovado, evitando tela roxa vazia antes do React;
- a splash React continua com simbolo maior, nome `SinalSeguro` e loading;
- `SplashScreen.preventAutoHideAsync()` fica restrito a Android/iOS para nao bloquear web;
- simulador web passa a funcionar com `react-native-web`;
- SOS ativo exibe estado `ATIVO` e particulas discretas, com ate 8 pontos simultaneos;
- quando existe chamado ativo, o mesmo SOS serve para encerrar com o mesmo gesto de segurar;
- encerramento sem codigo usa confirmacao; encerramento com codigo usa modal proprio do app;
- codigo de encerramento vem desativado por padrao e fica salvo como hash local;
- player local ganhou controles de revisao, progresso e reinicio;
- exclusao local pelo raio deixa de depender de alerta nativo e remove o pacote direto do cofre local com tombstone.

Validacoes executadas:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run web -- --clear`: aprovado apos instalar `react-native-web`;
- Browser Use validou Home e `Cofre local` em `http://localhost:8081`;
- `./gradlew :app:assembleDebug --console=plain`: aprovado;
- `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`: aprovado;
- `npm run release:android:readiness`: pronto condicionado, com pendencias esperadas de assinatura release e diretorio nativo gerado;
- Android debug carregou bundle pelo Metro e `logcat` registrou `ReactNativeJS: Running "main"`;
- captura visual Android ficou bloqueada por overlay MIUI `NotificationShade`/AOD e `ScreenOnProximitySensorGuide`;
- evidencias salvas em `docs/evidencias/browser/2026-05-03-simulador/`;
- relatorio criado em `docs/19_REFINO_SPLASH_SOS_PLAYER_BROWSER.md`.

## 2026-05-03 - Home SOS fixa e modular validada em Browser/Android

Status: implementado, instalado no Android e pronto para validacao visual do usuario.

Especialistas acionados:

- Tarcila/Norman: revisao de identidade visual, home fixa, proporcao do SOS, icones oficiais e menu retratil.
- Ada/Hedy/Margaret: modularizacao mobile, gesto SOS, modelo de chamada oficial e validacao Android.
- Schneier/Doneda: fallback web controlado, codigo de encerramento sem padrao universal e limites de privacidade.
- Myers: gates locais, Browser Use, ADB, screenshot e logcat.

Decisoes:

- Home deixou de usar `SafeScreen` e `ScrollView`;
- header nativo foi removido da rota inicial para evitar duplicidade visual;
- titulo/subtitulo antigos do corpo foram removidos;
- SOS central passou a ocupar area responsiva com `width: "75%"` e `aspectRatio: 1`;
- tela principal fica fixa com apenas SOS e atalhos oficiais `Policia 190`, `Bombeiros 193` e `SAMU 192`;
- cofre/player, anjos, convites, configuracoes e atividade ficam no menu retratil da engrenagem;
- Home foi modularizada em `src/features/emergency-home/`, com componentes e modelo de chamada em arquivos proprios;
- `EmergencyCallTarget` concentra os dados e URI `tel:` dos canais oficiais;
- fallback web nao chama `expo-secure-store` e a simulacao web nao captura localizacao real;
- falha de persistencia do SOS passa a ser controlada, sem marcar chamado ativo se o pacote local nao for preservado;
- codigo universal `1900` deixou de ser padrao valido; ativacao exige novo codigo salvo como hash local.

Validacoes executadas:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run release:android:readiness`: pronto condicionado;
- `git diff --check`: aprovado;
- Browser Use validou explicitamente `http://localhost:8081/`;
- `./gradlew :app:assembleDebug --console=plain`: aprovado;
- `adb -s [ip-redigido]:5555 install -r android/app/build/outputs/apk/debug/app-debug.apk`: aprovado;
- Android fisico validou Home, drawer e SOS ativo por gesto longo;
- `logcat` ficou sem `FATAL`, `AndroidRuntime`, `RedBox`, `Unable to load script` ou `setValueWithKeyAsync`.

Documentacao:

- `docs/20_HOME_SOS_FIXA_MODULAR_ANDROID_BROWSER.md`.

Evidencias:

- `docs/evidencias/browser/2026-05-03-home-sos-refatorada/01-home-sos-fixa.png`;
- `docs/evidencias/android/2026-05-03-home-sos-refatorada/01-home-sos-fixa.png`;
- `docs/evidencias/android/2026-05-03-home-sos-refatorada/02-home-drawer.png`;
- `docs/evidencias/android/2026-05-03-home-sos-refatorada/03-sos-ativo.png`.

## 2026-05-03 - Revisao especialistas Home/Cofre/Seguranca

Status: implementado, validado e salvo no checkpoint.

Especialistas acionados:

- Tarcila/Norman: apontaram bloqueio de exclusao destrutiva sem confirmacao e jargao tecnico no drawer.
- Ada/Hedy: apontaram risco de multiplos chamados ativos e atalho 190 configuravel sem efeito na Home.
- Myers/Schneier/Doneda: apontaram necessidade de Node correto no readiness, web apenas simulador, reconciliacao da splash e bloqueios de seguranca.

Decisoes:

- `startEmergencyPackage()` impoe singleton/idempotencia no servico;
- `recordEmergencyPackage()` bloqueia se ja houver chamado ativo;
- `Excluir` no cofre exige confirmacao e fica bloqueado para pacote ativo;
- drawer da Home usa texto operacional, sem `backend/P2P`;
- `Policia 190` respeita `call190ShortcutEnabled`;
- `Bombeiros 193` e `SAMU 192` continuam como canais oficiais manuais;
- fallback web do cofre usa memoria volatil, sem `sessionStorage`;
- docs de splash foram reconciliados: splash nativa usa simbolo discreto aprovado, nao plugin blank.

Documentacao:

- `docs/21_REVISAO_ESPECIALISTAS_HOME_COFRE_SEGURANCA.md`.

Validacoes executadas:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run release:android:readiness`: pronto condicionado;
- `git diff --check`: aprovado;
- `./gradlew :app:assembleDebug --console=plain`: aprovado;
- `curl -fsS http://localhost:8081`: servidor web ativo;
- ADB sem dispositivo conectado nesta rodada.

## 2026-05-03 - Correcao do travamento Android na abertura

Status: implementado, instalado e validado no aparelho fisico.

Especialistas acionados:

- Margaret/Ada: build Android/Expo e dependencia Metro;
- Myers: validacao ADB, logcat e evidencias;
- Tarcila/Norman: continuidade visual da Home, Configuracoes, Cofre e SOS ativo;
- Schneier/Doneda: limites de midia, permissoes e dados sensiveis;
- Cristine/Knuth: memoria, especificacao e documentacao.

Decisoes:

- o APK debug de validacao passa a ter comando dedicado `npm run build:android:debug:bundled`;
- a propriedade Gradle `-PsinalBundleDebugJs=true` embute o JS no APK debug e remove a dependencia de Metro/`localhost:8081`;
- `MainApplication.kt` desliga o suporte nativo de desenvolvedor quando `SINAL_BUNDLED_DEBUG=true`, evitando consulta ao packager no APK de validacao;
- `app/_layout.tsx` ganhou fallback de `SplashScreen.hideAsync()` para evitar retencao da splash nativa;
- o endpoint futuro `/app/releases/latest` foi documentado no OpenAPI para a acao `Atualizar app`;
- Configuracoes registra aceite local de termos, privacidade e compartilhamento emergencial;
- camera/microfone continuam bloqueados no build publico, com preparo de preferencia para homologacao.

## 2026-05-03 - Build privado com midia local

Status: implementado em codigo e preparado para build/validacao Android privada.

Especialistas acionados:

- Tarcila/Norman: revisao visual do header, Home fixa, SOS, Cofre e Configuracoes.
- Ada/Hedy/Margaret: integracao `expo-camera`, gravacao local e APK debug bundled.
- Schneier/Doneda/Myers: permissoes, backup Android, perda de video no encerramento e gate privado.
- Cristine/Knuth: memoria, especificacao e continuidade.

Decisoes:

- O build publico segue sem midia, transmissao, stream, P2P ou compartilhamento externo.
- O build privado de homologacao local habilita `CAMERA` e `RECORD_AUDIO`.
- O SOS inicia pacote `recording_local` e, no Android/iOS, monta `EmergencyMediaRecorder`.
- Ao encerrar o SOS, a camera e parada e o video e copiado para `sinalseguro-media/` no sandbox privado antes de atualizar o Cofre.
- `android:allowBackup` fica `false` no Manifest nativo do build privado.
- Hash SHA-256 do asset de video e calculado a partir do conteudo preservado em base64.
- Tempo configuravel passou a significar tempo de gravacao local: `Ilimitado`, `1min`, `5min`, `15min`, `30min`, `60min`.
- A emergencia/chamado encerra somente por acao manual da usuaria, com confirmacao e codigo local opcional.
- Configuracoes foi compactada para reduzir risco de corte em telas Android menores, mantendo tela fixa e modais.

Arquivos principais:

- `src/features/emergency/EmergencyMediaRecorder.tsx`;
- `src/features/emergency/mediaCapture.ts`;
- `src/components/EvidencePlayerCard.tsx`;
- `scripts/android-private-media-readiness.mjs`;
- `scripts/prepare-android-bundled-debug.mjs`;
- `docs/26_BUILD_PRIVADO_MIDIA_LOCAL.md`.

Validacoes previstas para fechamento:

- `npm run typecheck`;
- `npm run lint`;
- `npm test`;
- `npm run private:android:readiness`;
- `npm run build:android:private`;
- `adb install`;
- cold start Android e logcat filtrado;
- teste manual: SOS inicia gravacao, encerramento preserva video, Cofre abre Player.

Validacoes executadas:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run build:android:debug:bundled`: aprovado;
- `adb -s [ip-redigido]:5555 install -r android/app/build/outputs/apk/debug/app-debug.apk`: aprovado;
- app abriu com Metro desligado e `adb reverse --remove-all`;
- cold start Android final: `TotalTime: 5700`;
- `logcat` isolado por PID sem `Unable to load script`, `Failed to connect`, `FATAL EXCEPTION`, `AndroidRuntime` ou `setValueWithKeyAsync`;
- SOS de teste entrou em `CHAMADO ATIVO`, capturou localizacao pontual e nao reproduziu o erro `ExpoSecureStore.default.setValueWithKeyAsync is not a function`.

Artefatos:

- `android/app/build/outputs/apk/debug/app-debug.apk`;
- SHA-256 `2bd9055863a51f46d4c41f24b768e22b25f43984990e0313f5fc4baa5d599c83`;
- `docs/25_CORRECAO_TRAVAMENTO_ANDROID_BUNDLE.md`;
- `docs/assets/mobile/2026-05-03-android-home-bundled.png`;
- `docs/assets/mobile/2026-05-03-android-configuracoes-bundled.png`;
- `docs/assets/mobile/2026-05-03-android-cofre-bundled.png`;
- `docs/assets/mobile/2026-05-03-android-sos-bundled-pos-localizacao.png`.

Observacao:

- Roberto informou USB conectado, mas `adb devices -l` enumerou apenas o transporte Wi-Fi `[ip-redigido]:5555`; a instalacao usou o canal ADB ativo.

## 2026-05-03 - APK privado com midia local instalado

Status: build privado gerado, instalado e aberto no Android fisico.

Resultado:

- `npm run build:android:private`: aprovado;
- artefato `android/app/build/outputs/apk/debug/app-debug.apk`;
- tamanho aproximado: 103 MB;
- SHA-256 `056e41d7e1e91aef10c6763bb094bfe27973693c8c163b222c6f4be2952be67b`;
- `adb -s [ip-redigido]:5555 install -r android/app/build/outputs/apk/debug/app-debug.apk`: `Success`;
- permissoes de camera, microfone, localizacao fina/aproximada e notificacoes concedidas via ADB para homologacao privada;
- cold start Android: `Status: ok`, `LaunchState: COLD`, `TotalTime: 4103`;
- logcat filtrado sem crash fatal, erro de bundle Metro, `setValueWithKeyAsync`, `RedBox` ou `Exception`.
- revalidacao final de abertura Android: `TotalTime: 5787`, log `/tmp/sinalseguro-private-media-logcat-final.txt`, sem ocorrencias fatais filtradas.

Gates executados no fechamento:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run private:android:readiness`: pronto condicionado para build privado;
- `npm run release:android:readiness`: bloqueado corretamente para release publico por Node local e instrumentacao privada de midia.

Evidencias:

- `docs/assets/mobile/2026-05-03-android-private-media-home.png`;
- `docs/assets/mobile/2026-05-03-android-private-media-home-final.png`;
- `/tmp/sinalseguro-private-media-logcat.txt`.

Pendencia de validacao manual:

- a injecao de toque por ADB nao acionou os controles nesta rodada;
- Roberto/Myers devem validar manualmente no aparelho: SOS inicia camera, encerramento preserva video, Cofre lista o pacote e Player reproduz o arquivo local.

## Modelo de registro

| Data | Evento | Responsavel | Impacto | Proximo passo |
|---|---|---|---|---|
|  |  |  |  |  |

## 2026-05-03 - Refinos de midia, cofre e topo

Status: implementado e validado em gates locais.

Especialistas acionados:

- Tarcila/Norman: topo com simbolo sem texto e remocao do feedback verde do SOS ativo.
- Ada/Hedy: fluxo de permissao de camera/microfone e registro correto da camera usada.
- Schneier/Myers: bloqueio de exclusao de chamado ativo no servico e preservacao do pacote quando arquivo local nao puder ser removido.
- Cristine/Knuth: memoria e documentacao do checkpoint.

Decisoes:

- O topo usa `sinalseguro-symbol.png` como logomarca sem texto; o nome `SinalSeguro` continua como texto da UI para contraste.
- O SOS ativo nao usa mais halo/glow verde; o feedback visual segue magenta/rosa da identidade visual.
- O anel de progresso foi ajustado para rodar na circunferencia do botao SOS, sem escapar da borda em telas responsivas.
- A gravacao solicita permissao de camera/microfone antes de esperar `CameraView.onCameraReady`.
- `Duas cameras` continua disponivel como preferencia de homologacao; o build privado tenta captura dupla e registra `requestedCameraMode` para auditoria tecnica quando houver fallback.
- O Player usa progresso real do `expo-video` quando ha arquivo local.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.

## 2026-05-03 - Home limpa, player compacto e duas cameras padrao

Status: implementado; validacao final em browser/Android neste checkpoint.

Especialistas acionados:

- Tarcila/Norman: remover ruido visual da Home, padronizar menus e manter identidade visual.
- Ada/Hedy: migrar preferencias para `Duas cameras` como padrao de homologacao.
- Myers/Schneier: registrar riscos de memoria/cota para gravacoes longas antes de uso real.
- Cristine/Knuth: atualizar memoria, especificacao e documentacao de build privado.

Decisoes:

- Home nao exibe mais o texto auxiliar `Solte`.
- Drawer inicial e drawer do Cofre usam o mesmo menu de acoes iconograficas, sem metricas ou textos tecnicos.
- Modais de ligacao destacam `190`, `193` e `192` como numero principal, com sombra e contraste.
- Fundo da Home remove riscos/linhas e usa particulas/circulos sutis.
- `Duas cameras` passa a ser preferencia padrao e migracao das configuracoes antigas.
- Player do Cofre foi compactado para priorizar video, seletor de camera, controles e metadados essenciais.

Pendencias tecnicas registradas:

- Substituir hash de video por rotina incremental/binaria antes de gravacoes longas.
- Definir cota/retencao local para captura ilimitada e dupla.

## 2026-05-03 - Anel SOS mais visivel

Status: implementado; em validacao browser/Android.

Especialistas acionados:

- Tarcila/Norman: revisar contraste do anel sem quebrar a circunferencia do botao.
- Ada/Hedy: manter direcao horaria para acionar e anti-horaria para encerrar.
- Myers: validar que o anel aparece no Android fisico durante pressao longa.

Decisoes:

- O anel continua dentro da circunferencia do SOS, sem aro externo deslocado.
- Trilho e progresso ganharam mais opacidade e espessura, mantendo o efeito discreto.
- Preferencias antigas anteriores ao `schemaVersion 6` migram para `Duas cameras`.
- APK privado reinstalado no Android `[ip-redigido]:5555`, SHA-256 `f5a407ca1937f589f8d1c1f4dc1d2f251e8cf1f7031e59ef76f3ac3373724f15`, cold start `TotalTime: 4487`.
- Evidencias salvas em `docs/assets/mobile/2026-05-03-android-ring-visivel-home.png` e `docs/assets/mobile/2026-05-03-android-ring-visivel-hold.png`; log filtrado por PID em `docs/evidencias/android/2026-05-03-ring-player-private/logcat-launch-app.txt`.

## 2026-05-04 - Drawer Cofre/Player, Configuracoes limpa e Cofre em grade

Status: implementado em codigo e documentado para validacao Android.

Especialistas acionados:

- Tarcila/Norman: SOS com efeito de bolha, menu mais objetivo e Configuracoes sem banner tecnico.
- Ada/Hedy: rotas `Cofre` e `Player` separadas por parametro de painel e cofre em grade vertical.
- Myers/Schneier: manter fechamento por toque fora sem perda de dados, bloquear compartilhamento externo e preservar exclusao auditada.
- Cristine/Knuth: memoria, especificacao e evidencia do checkpoint.

Decisoes:

- Drawer da Home e do Cofre passa a mostrar `Cofre`, `Anjos`, `Player` e `Configuracoes`.
- `Cofre` abre a trilha de arquivos; `Player` abre a revisao segura.
- Configuracoes removeu o bloco de status `Preferencias carregadas`.
- Modais e drawer fecham ao tocar fora.
- Cofre local exibe pacotes em grade vertical com acoes iconograficas em linhas/colunas.
- SOS manteve o anel dentro da circunferencia e ganhou mais contraste para o gesto de pressao longa.

Evidencias:

- `docs/assets/mobile/2026-05-04-home-sos-bolha.png`;
- `docs/assets/mobile/2026-05-04-home-menu-cofre-player.png`;
- `docs/assets/mobile/2026-05-04-configuracoes-sem-banner.png`;
- `docs/assets/mobile/2026-05-04-cofre-modal-grid.png`.

Documento do ciclo:

- `docs/27_REFINO_DRAWER_COFRE_PLAYER_CONFIG.md`.

## 2026-05-04 - Continuidade documental apos interrupcao

Status: protocolo documental registrado; sem alteracao de codigo do app nesta rodada.

Responsaveis:

- Cristine/Knuth: continuidade documental e memoria mobile.
- Zé: supervisao de consistencia com a memoria mestre.
- Myers/Schneier: devem ser acionados quando a retomada envolver build, instalacao, permissao, midia, dados, seguranca ou validacao tecnica.

Decisoes de continuidade:

- toda retomada deve ler memoria local e timeline antes de executar nova etapa;
- a primeira checagem deve ser `git status --short` no repo `apps/mobile`;
- alteracoes de outros agentes ou do usuario nao devem ser revertidas;
- a proxima acao deve reaproveitar o que ja esta documentado, evitando redundancia;
- antes de build longo, instalacao Android/iOS, publicacao ou validacao demorada, salvar checkpoint minimo em docs/memoria quando houver estado novo consolidado;
- manter lista de pendencias, artefatos, hashes, aparelho/ADB usado, gates, bloqueios e publicacoes;
- validar antes de publicar e registrar claramente o resultado.

Checkpoint mobile atual:

- SOS segue em refino UX/IX com efeito de bolha, anel de pressao mais visivel e feedback magenta/rosa;
- Home permanece limpa, sem texto auxiliar redundante, com drawer iconografico;
- Cofre e Player foram separados no drawer;
- Cofre local usa grade vertical e acoes por icones;
- codigo de seguranca para encerramento continua local, opcional, com hash e sem codigo universal padrao;
- midia privada continua restrita a homologacao controlada;
- script/gate de APK privado Android continua separado do gate publico;
- instalacao Android e cold start ja foram validados em ciclos recentes no aparelho `23129RA5FL` via ADB Wi-Fi;
- validacao manual pendente: SOS inicia camera, encerramento preserva video, Cofre lista pacote e Player reproduz midia local.

Pendencias para proxima sessao:

1. Verificar `git status --short` antes de tocar qualquer arquivo.
2. Confirmar se o APK privado vigente ainda corresponde ao ultimo hash documentado ou se houve novo build por outro agente.
3. Validar manualmente no Android fisico o fluxo SOS com midia local.
4. Registrar hash, aparelho, logcat, evidencias e resultado de QA.
5. Publicar apenas depois de gates e aceite compatíveis com o risco.

## 2026-05-05 - Checkpoint de pausa para liberar disco

Status: pausado por solicitacao do Roberto; estado preservado para retomada.

Responsaveis:

- Zé/Cristine: salvar memoria, evitar retrabalho e publicar checkpoint.
- Ada/Hedy: retomar ajustes tecnicos sem repetir o que ja esta validado.
- Tarcila/Norman: retomar revisao visual de SOS, modais, Cofre e Player.
- Myers/Schneier: validar antes do proximo APK privado.

Decisoes:

- Quando houver risco de limite de uso, interrupcao, build longo ou pausa para limpeza de disco, salvar memoria e Git antes de continuar.
- Durante a pausa nao executar build, instalacao, limpeza automatica ou validacao pesada.
- A retomada deve comecar por `git status --short` e leitura das memorias locais.

Pendencias de retomada:

1. Finalizar refinamento de modais com linguagem de produto e ajuda em `(?)`.
2. Simplificar fluxo do codigo de seguranca.
3. Ajustar hash de video grande para nao carregar arquivo inteiro em memoria.
4. Validar visualmente no browser `localhost:8081`.
5. Rodar gates leves, gerar APK privado pelo script e instalar no Android quando Roberto liberar espaco.

## 2026-05-05 - Retomada final do ciclo privado Android

Status: em fechamento para validacao, APK privado e publicacao Git.

Responsaveis:

- Zé/Cristine: coordenacao, continuidade, memoria e publicacao.
- Tarcila/Norman: aprovacao visual do SOS, drawer, modais e Cofre/Player.
- Ada/Hedy: fluxo tecnico de SOS, midia local, duas cameras, cofre e player.
- Schneier/Doneda/Myers: seguranca, LGPD, bloqueios de compartilhamento externo e QA.

Decisoes e ajustes consolidados:

- SOS usa botao circular responsivo com efeito de bolha 3D, anel interno de progresso na circunferencia e particulas discretas.
- O anel continua horario para acionar e anti-horario para encerrar; foi calibrado para aparecer sem virar aro externo dominante.
- O feedback ativo preserva a massa magenta/rosa da identidade SinalSeguro e usa halo verde apenas como sombra pulsante atras do texto `ATIVO`, por decisao visual posterior do Roberto.
- Configuracoes mantem tela principal iconografica e modais de produto com ajuda `(?)`.
- `Duas cameras` e o padrao de homologacao privada, com fallback para camera unica quando o aparelho ou a plataforma impedir captura simultanea.
- Cofre/Player lista arquivos em grade vertical com titulo, data, duracao, player local, mapa e compartilhamento pelo app quando autorizado.
- O texto `Envio futuro` saiu das acoes visiveis e virou linguagem de produto: `Compartilhar pelo app`.
- Codigo de seguranca protege encerramento do SOS e acesso a Cofre, Anjos, Player e Configuracoes quando habilitado.
- Regra de continuidade reforcada: antes de interrupcoes, travamentos, builds longos, limpeza de disco ou limite de uso, salvar memoria, documentacao e Git.

Pendencias imediatas:

1. Rodar `typecheck`, `lint`, `test`, `private:android:readiness` e `git diff --check`.
2. Validar visualmente no browser local.
3. Gerar APK privado pelo script `scripts/gerar-aplicativo.sh`.
4. Instalar no Android conectado por USB.
5. Commitar e publicar o checkpoint.

## 2026-05-05 - Solucao de continuidade sem redundancia

Status: roteiro de retomada criado para evitar consumo de limite com releitura repetida.

Decisao:

- `docs/28_RETOMADA_SEM_REDUNDANCIA.md` passa a ser o primeiro documento operacional para fechar o ciclo atual.
- A retomada deve usar uma fila unica: revisar somente arquivos alterados, fechar pendencias comentadas, rodar gates, validar browser, gerar APK privado, instalar no Android se o ADB listar o aparelho, documentar e publicar.
- Se o Android nao aparecer no ADB, a instalacao nao deve ser tentada; registrar bloqueio e seguir somente com o que puder ser validado localmente.
- Google/iCloud/login social entram por etapa propria de OIDC/backend, sem usar credenciais ou contas logadas como material versionado.

Proxima acao:

1. Continuar diretamente da fila em `docs/28_RETOMADA_SEM_REDUNDANCIA.md`.
2. Nao refazer plano de agentes, stack, arquitetura ou pesquisa ampla.
3. Encerrar o ciclo atual com validacao e Git antes de abrir a proxima etapa.

## 2026-05-05 - Ajustes finais solicitados no browser

Status: implementado, validado no browser local e instalado no Android fisico.

Especialistas:

- Norman/Tarcila: revisaram a Home, a bolha SOS e o estado `ATIVO`.
- Myers/Schneier: revisaram duracao no Cofre, mapas externos, Anjo bloqueado e minimizacao de dados.

Ajustes:

- A Home passa a renderizar `Policia`, `Bombeiros` e `SAMU` como atalhos oficiais sempre ativos por padrao, com os numeros preservados apenas no fluxo de confirmacao antes de ligar.
- O atalho de Anjo permanece desativado/preparatorio ate gestao de anjos, aceite real, contrato, termos e auditoria.
- A bolha SOS troca as duas transparencias superiores por uma unica camada SVG com degradê que some em direcao ao centro.
- O texto `ATIVO` fica acima das particulas e usa apenas sombra verde no proprio texto, sem faixa ou camada em formato de charuto atras.
- A grade do Cofre e o Player passam a mostrar duracao/tempo de gravacao do arquivo.
- O modal de mapa oferece `Maps` da plataforma e `Google Maps`, valida `canOpenURL` no nativo e avisa que abrir mapa externo envia a localizacao exata ao app escolhido.
- Os links de mapa permanecem multiplataforma: Apple Maps, Google Maps e `geo:` para Android/handlers compativeis.

Validacao local:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: aprovado.
- Browser aberto em `http://localhost:8081/`: Home validada com `Policia`, `Bombeiros` e `SAMU`, sem `Policia 190`.
- `npm run build:android:private`: aprovado.
- APK privado: `android/app/build/outputs/apk/debug/app-debug.apk`.
- Tamanho do APK: `119M`.
- SHA-256 do APK: `daf5a22d163acc468a9470e1bd2178606f1b547c55bdf824a22eefe5d3f022d1`.
- `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`: `Success` no Android `23129RA5FL`.
- `adb shell am start -n br.com.sinalseguro.app/.MainActivity`: app iniciou e ficou como foco atual.
- Evidencia Android final: `docs/evidencias/android/2026-05-05-apk-privado-final/home-apk-final-after-wake.png`.
- Evidencia de estado final inativo no aparelho: `docs/evidencias/android/2026-05-05-apk-privado-final/estado-final-aparelho.png`.
- Logcat de pos-instalacao registrado em `docs/evidencias/android/2026-05-05-apk-privado-final/logcat-app-pos-instalacao-final.txt`.

Observacao:

- O `uiautomator dump` oscilou por estado de idle/animações no aparelho, mas `dumpsys window` confirmou `br.com.sinalseguro.app/.MainActivity` como foco e a captura visual confirmou a Home instalada.

## 2026-05-05 - Revisao do plano global e proxima fase

Status: revisado e pronto para orientar a proxima etapa apos o fechamento do APK privado.

Decisao:

- A proxima etapa do plano global e `API e Anjos`, conforme Fase 4 do cronograma e Epico D do backlog.
- O documento operacional da proxima etapa e `docs/29_PROXIMA_ETAPA_API_ANJOS.md`.
- Antes de abrir essa fase, falta apenas publicar o checkpoint Git se Roberto quiser fechar a etapa no remoto nesta sessao.

Escopo inicial da proxima fase naquela data, hoje superado pela implementacao modular registrada em 2026-05-07:

- Transformar `services/api` em API modular.
- Implementar dominios iniciais de `auth`, `devices`, `consents`, `trusted_contacts`, `invitations`, `alerts`, `app_updates` e auditoria saneada.
- Conectar o mobile via cliente API minimo, preservando fallback local/offline.
- Manter midia real, streaming, P2P critico e integracao oficial com orgaos publicos fora do escopo ate revisoes juridica, LGPD, seguranca e convenios.

## 2026-05-05 - Plano OIDC, videochamada e localizacao ao vivo

Status: documentado para continuidade e pronto para execucao em fases.

Especialistas:

- Ada/Ritchie/Kim: arquitetura app, API, EC2, OIDC, dispositivos e chaves.
- Brenda/Berners: CRM, hub de login e gestao operacional.
- Norman/Tarcila: UX/IX de login, anjos, consentimentos e CRM.
- Schneier/Doneda/Myers: seguranca, LGPD, ECA Digital, lojas e QA.

Decisoes:

- A proxima execucao tecnica comeca por Google Auth Platform no projeto `sinalseguro`, client OAuth Android e configuracao segura de `GOOGLE_OIDC_CLIENT_IDS`.
- Videochamada para anjo autorizado sera desenhada como WebRTC P2P, com API apenas para login, convites, auditoria, envelopes de chave e sinalizacao.
- Localizacao em tempo real fica limitada ao periodo de emergencia ativa, com canal criptografado e sem coordenadas em logs.
- CRM/Gestao tera modulos de usuarios, dispositivos, anjos, convites, consentimentos, auditoria, termos e hub de login; conveniados ficam em modulo futuro separado.
- Menores ficam bloqueados para uso real ate politica especifica ECA Digital/LGPD.

Documento operacional:

- `docs/32_PLANO_LOGIN_VIDEOCHAMADA_ANJOS_LOCALIZACAO.md`.

## 2026-05-05 - F0 OIDC Android configurada

Status: Google Auth Platform configurada e backend preparado.

Entregas:

- projeto Google Cloud `sinalseguro` recebeu configuracao Google Auth Platform;
- publico OAuth ficou `Externo` em modo `Testando`;
- client OAuth Android criado para `br.com.sinalseguro.app` com SHA-1 do APK privado atual;
- conta SinalSeguro adicionada como usuaria de teste;
- client ID real guardado apenas no Keychain local, `.env.local` ignorado pelo Git e `/etc/sinalseguro-api.env` da EC2;
- JSON baixado pelo Console foi removido de `Downloads`;
- API reiniciada e validada na EC2.

Validacao:

- `sinalseguro-api`: ativo.
- `cereusia-crm`: ativo.
- readiness local EC2: `database=ok`.
- health por host `api.sinalseguro.com.br`: `ok`.
- `nginx -t`: aprovado.
- hash de `/etc/nginx/sites-available/cereusia.conf`: inalterado.
- `POST /api/auth/google` com token invalido retornou erro controlado, sem falha 500.

## 2026-05-05 - Diretriz gratuita e perfis de menores

Status: regra de produto/compliance registrada para a proxima fase.

Decisoes:

- desenvolvimento, testes e operacao inicial devem permanecer em niveis gratuitos sempre que tecnicamente viavel;
- nenhum billing pago, TURN pago, servico gerenciado pago ou upgrade de Google Cloud/AWS/Cloudflare deve ser ativado sem aprovacao explicita, limite de custo e registro em memoria;
- Android real esta conectado para a proxima validacao do login do app;
- convites de anjos ficam restritos a contas adultas verificadas ou responsaveis autorizados;
- pais/responsaveis podem adicionar filhos/dependentes e configurar a propria conta como anjo/responsavel do menor;
- filhos/dependentes menores nao podem convidar anjos, conveniados ou terceiros;
- o bloqueio deve existir no app e no backend, nao apenas na interface;
- o desenho deve considerar o risco de o agressor ser responsavel legal antes de ativar uso real com menores.

Documentos atualizados:

- `docs/32_PLANO_LOGIN_VIDEOCHAMADA_ANJOS_LOCALIZACAO.md`;
- `docs/08_SEGURANCA_LGPD.md`.

## 2026-05-06 - Complemento F1/F2/F3 API, dispositivos e anjos

Status: implementado localmente, validado em mobile/API e publicado na EC2.

Entregas:

- `DeviceBindingService` POO criado no mobile para gerar segredo privado local, publicar apenas material publico/hash e registrar dispositivo autenticado em `/devices/`;
- login por e-mail e Google passou a executar bootstrap autenticado com `/auth/me`, registro de dispositivo e consentimentos versionados;
- API client mobile recebeu contratos para consentimentos, trusted contacts, convites e aceite de convite;
- convites de anjo usam API quando ha login e mantem fallback local pre-convite quando nao ha sessao;
- tela de convite aceita vinculo somente com conta propria e dispositivo registrado;
- backend adicionou escopo de consentimento `login` e migracao `consents.0002_add_login_scope`;
- backend passou a negar aceite de convite sem dispositivo ativo com chave publica/hash e protege o aceite com transacao.

Validacao:

- Mobile: `npm run typecheck`, `npm run lint`, `npm test`.
- Android privado: `npm run private:android:readiness` com a pendencia local conhecida de Node `20.16.0`.
- API: `manage.py check`, `makemigrations --check --dry-run`, `manage.py test`, `manage.py spectacular --validate`.
- EC2: health/readiness `ok`, `sinalseguro-api` ativo, `cereusia-crm` ativo, `sudo nginx -t` aprovado, hash de `cereusia.conf` inalterado.
- Deploy: `infra/aws/deploy-api.sh` executado com sucesso; migração `consents.0002_add_login_scope` aplicada e confirmada por `showmigrations`.

Bloqueio registrado:

- Bloqueio real de convites criados por menores depende de modelo de responsaveis/dependentes/age assurance ainda inexistente; nao foi criado campo improvisado.

Proximo bloco:

- Validar login Google real no Android fisico, testar convite com duas contas/dispositivos e iniciar envelopes de emergencia.

## 2026-05-06 - UX/IX da interface de Anjos integrada

Status: implementado no mobile e validado no browser local.

Entregas:

- tela `Anjos de confianca` reorganizada com padrao visual SinalSeguro, `StatusBanner`, `ButtonIcon`, `InviteCard` e `BrandedDialog`;
- mocks de anjos deixaram de alimentar a tela integrada;
- tela passou a listar vinculos reais por `/trusted-contacts/` e convites reais por `/invitations/` quando houver sessao autenticada;
- pre-convites locais continuam permitidos sem login, mas aparecem em secao propria para nao simular anjo autorizado;
- modal de convite confirma antes do compartilhamento e informa que evidencias, localizacao e dados sensiveis nao sao enviados;
- API client mobile recebeu listagem e revogacao de trusted contacts e invitations.

Validacao:

- `npm run typecheck`;
- `npm run lint`;
- `npm test`;
- Browser Use em `http://localhost:8081/contatos`, com tela principal e modal de convite verificados visualmente.

Proximo bloco:

- Validar login Google real no Android fisico, convite fim a fim com duas contas/dispositivos e iniciar envelopes de emergencia.

## 2026-05-06 - Midia criptografada funcional no Android

Status: implementado e validado em Android fisico.

Entregas:

- gravacao Android estabilizada em camera frontal por padrao e modo leve quando a preferencia antiga estiver em `both`;
- `EncryptedVideoPlaybackCache` criado para preparar playback criptografado somente sob demanda no player interno;
- player deixou de descriptografar/preparar automaticamente ao abrir a tela, reduzindo travamento no cofre/player;
- chunks novos ajustados para 512 KB com yield/backpressure e menos updates de progresso no React;
- `EncryptedVideoDataSource` passou a permitir caminho de playback sem hash plaintext redundante, mantendo autenticacao AEAD e verificacao do ciphertext.

Validacao:

- `npm run typecheck`;
- `npm test`;
- `npm run lint`;
- `npm run build:android:private`;
- APK instalado no Android fisico via ADB, SHA-256 `f2a1144a70be15aeb993436cc27b658b6c20958537ba427cf1444ef9d8746edd`;
- SOS iniciou sem travar, encerrou e preservou video no cofre;
- player abriu video de `1min01s` com `47 partes protegidas` e video final de `33s` com `13 partes protegidas`;
- evidencias em `docs/evidencias/android/2026-05-06-player-duration/`.

Proximo bloco:

- substituir cache privado transitorio por data source nativo ou servidor local loopback com `Range`, para reproduzir videos grandes sem materializar arquivo claro completo.

## 2026-05-06 - Player Seguro com preload, timeline e fullscreen

Status: implementado e validado em Android fisico.

Entregas:

- `EvidencePlayerCard` inicia preload automatico apenas do video criptografado selecionado ao abrir o Player;
- troca de asset aborta o preparo anterior, limpa cache parcial e prepara somente o novo asset;
- `EncryptedVideoPlaybackCache` recebeu cancelamento por `AbortSignal`, progresso por chunk e limpeza de arquivo parcial em erro/cancelamento;
- controles customizados do Player incluem play/pause, reiniciar, timeline com toque/arraste para seek e botao de tela cheia;
- timeline usa duracao do manifesto/asset como fallback ate o `expo-video` publicar `duration`, evitando `0:00 / 0:00` apos preload concluido;
- `VideoView` usa `textureView` para melhorar captura/overlay no Android e `enterFullscreen()` para fullscreen nativo.

Validacao:

- `npm run typecheck`;
- `npm test`;
- `npm run lint`;
- `npm run build:android:private`;
- APK instalado no Android fisico via ADB Wi-Fi `[ip-redigido]:5555`;
- SHA-256 final do APK: `f19623b9b9aa10d7cbd1262c3b1ad2a864d32db91acefd7a0974091366660df2`;
- Player abriu com preload automatico, exibiu primeiro frame, timeline `0:00 / 0:31`, play/pause, seek para `0:24 / 0:31`, fullscreen nativo e retorno ao modal;
- evidencias em `docs/evidencias/android/2026-05-06-player-preload-controls/`.

Proximo bloco:

- evoluir a ponte de cache transitorio para data source nativo ou servidor loopback `Range`, mantendo o contrato de chunks criptografados para videos grandes e compartilhamento futuro.

## 2026-05-06 - Player Seguro por Range local

Status: implementado e validado em Android fisico.

Entregas:

- `EncryptedVideoDataSource` passou a expor streaming por faixa, descriptografando somente os chunks que intersectam o range solicitado;
- `EncryptedVideoRangeHttp` centraliza parse de `Range`, rejeicao de multirange/range invalido e headers `206/200/416` sem dependencias nativas;
- `EncryptedVideoLoopbackServer` abre uma sessao efemera em `[ip-redigido]`, com URL de capacidade aleatoria, `GET/HEAD` apenas, cleanup de sockets e encerramento ao trocar asset, desmontar player ou app ir para background;
- `EvidencePlayerCard` usa o loopback como fonte principal do `expo-video`, mantendo controles customizados de play/pause, reiniciar, timeline e fullscreen;
- `EncryptedVideoPlaybackCache` ficou como compatibilidade/limpeza de cache legado, nao como caminho principal de reproducao criptografada;
- smoke tests e testes unitarios passaram a cobrir streaming parcial e helpers HTTP de range.

Validacao:

- `npm run typecheck`;
- `npm test`;
- `npm run lint`;
- `npm run build:android:private`;
- APK instalado no Android fisico via ADB Wi-Fi `[ip-redigido]:5555`;
- SHA-256 final do APK: `82e1ab82251a9ed812204bb06021e41f0ebd627d5c8bc6a6d26ff45e1c1c46e1`;
- Player abriu com primeiro frame, timeline `0:00 / 0:32`, seek para `0:24 / 0:31`, fullscreen nativo em `00:25 / 00:32`, retorno ao modal, reproducao completa ate `0:31 / 0:31` e replay com botao `Pausar` em `0:01 / 0:31`;
- evidencias em `docs/evidencias/android/2026-05-06-player-range-streaming/`.

Observacao:

- ainda existem arquivos `cache/Camera/*.mp4` gerados pela captura nativa antes da preservacao criptografada; eles nao sao o cache de playback do Player Seguro. O proximo bloco de hardening deve limpar esses residuos de captura assim que a preservacao criptografada for confirmada.

Proximo bloco:

- limpeza segura dos residuos temporarios de captura, thumbnail segura e avaliacao de data source nativo para substituir o loopback em producao final.

## 2026-05-06 - Diagnostico e base de login iOS

Status: implementado no codigo e backend; validacao Apple/Google no iPhone depende de credenciais/capabilities externas.

Entregas:

- app mobile recebeu servico `AppleIdentityService`, cliente `/auth/apple` e UX de erro clara para Google iOS sem Client ID;
- API recebeu endpoint `/auth/apple`, validacao OIDC Apple, vinculo `ExternalIdentity` por provedor e suporte a relogin Apple sem e-mail;
- EC2 foi atualizada com migracao de identidade externa e `APPLE_OIDC_CLIENT_IDS=br.com.sinalseguro.app`, sem registrar segredo em Git ou docs;
- `app.config.js` passou a ativar Apple Sign-In e Push no iOS apenas por flags de ambiente, mantendo build USB com Personal Team sem entitlements pagos;
- `app.json` fica sem Apple Sign-In estatico para evitar gerar capability em prebuild gratuito por acidente.

Validacao:

- API local: `manage.py check`, `makemigrations --check --dry-run`, `test sinalseguro_api.tests` e OpenAPI validado;
- deploy API: `infra/aws/deploy-api.sh`, migracao `accounts.0002_externalidentity`, `nginx -t`, health check e `cereusia.conf` intacto;
- mobile: `npm run typecheck`, `npm test`, `npm run lint`;
- iOS Release genérico compilou em `/tmp/sinalseguro-ios-auth-release-derived/Build/Products/Release-iphoneos/SinalSeguro.app`, com `main.jsbundle` e assinatura Personal Team sem `com.apple.developer.applesignin` nem `aps-environment`;
- instalacao USB no iPhone `R1_iPh` falhou porque o macOS nao enumerou o aparelho por USB no CoreDevice; `ios-deploy --detect` encontrou o aparelho apenas por Wi-Fi uma vez, mas a instalacao depois expirou.

Bloqueios externos:

- Google no iPhone exige OAuth Client ID do tipo iOS para bundle `br.com.sinalseguro.app`, preenchido em `.env.local` e autorizado no backend em `GOOGLE_OIDC_CLIENT_IDS`;
- Apple Sign-In nativo exige Team Apple Developer Program com capability `Sign in with Apple`; Personal Team gratuito nao provisiona essa entitlement no iPhone fisico.

Proximo bloco:

- criar OAuth Client ID iOS no Google Cloud, habilitar Apple Developer Program/Team se Apple Sign-In for obrigatorio, reconectar o iPhone por USB confiavel e instalar o `.app` fisico para validar login fim a fim.

## 2026-05-06 - Frente 1 Android: Login Google, JWT e dispositivo

Status: base mobile/API validada; login Google real no Android fisico ficou bloqueado porque o aparelho nao apareceu no ADB nesta retomada.

Entregas:

- API publica reconfirmada em `https://api.sinalseguro.com.br/api`, com `health=ok` e readiness `database=ok`;
- `.env.local` existe no app e contem as variaveis esperadas de API e Google OIDC, sem imprimir valores;
- painel `Configuracoes > Login` passou a exibir estado claro de Google OIDC configurado ou pendente para a plataforma atual, sem mostrar Client ID;
- login social agora persiste JWT no SecureStore e chama `auth/me` quando a resposta de token nao vier com usuario;
- bootstrap autenticado existente foi preservado: apos login, o app registra `/devices/`, associa dispositivo local e tenta sincronizar consentimentos versionados;
- registro de dispositivo nao envia push token nesta frente e envia apenas material publico/hash do vinculo local;
- logout segue chamando `/auth/logout` com refresh token e limpa sessao/dispositivo remoto localmente.

Validacao:

- `npm run typecheck`: aprovado com Node >= 22;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run private:android:readiness`: aprovado condicionado pela pendencia conhecida de projeto Android ainda nao gerado;
- `git diff --check`: aprovado;
- ADB: `adb devices -l` sem dispositivo; `adb connect [ip-redigido]:5555` retornou conexao recusada.

Pendencias:

- validar `Entrar com Google` no Android fisico quando o aparelho estiver conectado;
- confirmar no fluxo fisico que `/auth/google` emite JWT interno, `auth/me` retorna usuario, `/devices/` registra o aparelho e logout revoga refresh token;
- substituir a base atual de vinculo/hash por par de chaves criptografico real do dispositivo, com assinatura, rotacao, revogacao e perda de aparelho, na Frente 1.1.

Proximo bloco:

- Rede de anjos, convite, aceite, revogacao e chave publica real por dispositivo.

## 2026-05-07 - Frente 1 Android: validacao USB/ADB e bloqueio Google OAuth

Status: app privado instalado e validado no Android fisico; login Google real bloqueado no provedor antes de chegar a API.

Entregas:

- script `prepare-android-bundled-debug.mjs` ajustado para o Android prebuild atual, incluindo descoberta local do SDK via `ANDROID_HOME`/`ANDROID_SDK_ROOT` sem versionar `android/local.properties`;
- APK privado gerado com sucesso em build local Android, sem ativar camera, microfone, streaming, upload, P2P real ou integracao oficial;
- APK instalado no Android fisico por ADB apos instabilidade do transporte USB;
- `Configuracoes > Login` abriu no app fisico, confirmou API configurada e Google OIDC configurado para Android sem mostrar Client ID;
- botao `Testar API` no app fisico retornou `API SinalSeguro online: ok.`;
- botao `Entrar com Google` abriu o fluxo OAuth do Google no Android.

Validacao:

- API publica `https://api.sinalseguro.com.br/api/health`: `ok`;
- readiness publica `https://api.sinalseguro.com.br/api/health/ready`: `database=ok`;
- `.env.local` existe e contem as chaves esperadas, com valores nao impressos;
- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run build:android:private`: aprovado;
- APK final: `android/app/build/outputs/apk/debug/app-debug.apk`;
- SHA-256 do APK validado: `c527276c91ed274295062fb0d194b1c6f1f5e8ee0e9a00574e433f618247de31`;
- app lancado no pacote `br.com.sinalseguro.app` em Android 15;
- logs verificados sem crash do app e sem registrar token, refresh token, ID token, Client ID real, e-mail pessoal, IP em claro, user-agent em claro ou payload sigiloso.

Bloqueio externo:

- Google OAuth retornou `Erro 400: invalid_request` antes do consentimento, com a mensagem saneada `Custom URI scheme is not enabled for your Android client.`;
- por esse bloqueio, o fluxo real ainda nao chegou a `POST /auth/google`;
- consequentemente, JWT interno, persistencia final da sessao no SecureStore, `auth/me`, registro autenticado em `/devices/` e logout com revogacao de refresh token permanecem pendentes de validacao fisica no caminho Google.

Pendencias:

- habilitar o suporte de custom URI scheme no OAuth Android privado do Google Cloud, sem registrar Client ID real;
- repetir `Configuracoes > Login > Entrar com Google` no Android fisico;
- confirmar emissao de JWT interno, `auth/me`, registro de dispositivo em `/devices/` e revogacao de refresh token no logout;
- fechar Frente 1.1 com par de chaves real por dispositivo, assinatura, rotacao, revogacao e perda de aparelho.

## 2026-05-07 - Frente 1 Android: redirect OAuth nativo corrigido

Status: ajuste local aplicado; bloqueio restante e configuracao externa no Google Cloud.

Diagnostico por ADB:

- a tela do Android confirmou `Acesso bloqueado: a solicitacao do app SinalSeguro e invalida`;
- os detalhes do Google confirmaram `Erro 400: invalid_request` e `Custom URI scheme is not enabled for your Android client.`;
- o APK instalado aceitava `sinalseguro://`, mas nao aceitava o redirect nativo usado pelo provider Google do Expo: `br.com.sinalseguro.app:/oauthredirect`.

Correcao local:

- `app.json` passou a registrar os schemes `sinalseguro` e `br.com.sinalseguro.app`;
- prebuild Android atualizou o Manifest nativo;
- APK privado recompilado e reinstalado no Android fisico;
- ADB confirmou que `br.com.sinalseguro.app:/oauthredirect`, `sinalseguro:/oauthredirect` e `sinalseguro://configuracoes` resolvem para `br.com.sinalseguro.app`.

Validacao:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run build:android:private`: aprovado;
- `git diff --check`: aprovado no app mobile;
- APK validado: `android/app/build/outputs/apk/debug/app-debug.apk`;
- SHA-256 do APK: `e975046c54c756af14feba64fe40b83877252bb96bca0d97f2d334624218801b`.

Resposta sobre usuarios de teste Google:

- a tela do Google Auth Platform confirmou que, enquanto o status de publicacao estiver em `Testing`, apenas usuarios de teste conseguem acessar o app;
- para evitar pre-cadastro manual de cada usuaria, o caminho correto nesta frente e manter apenas login basico e publicar o app OAuth para publico externo;
- a lista de 100 test users e o limite de 100 novos usuarios passam a ser risco real se o app solicitar escopos sensiveis/restritos ou cair em tela de app nao verificado.

Acao externa pendente:

- no Google Cloud, abrir o OAuth Client Android privado do projeto `sinalseguro` e habilitar `Custom URI scheme`, sem copiar Client ID real para Git, docs, chat ou logs;
- apos a propagacao do Google, repetir o login fisico para validar `POST /auth/google`, JWT interno, SecureStore, `auth/me`, `/devices/` e logout com revogacao.

## 2026-05-07 - Documentacao app/backend reconciliada com estado real

Status: documentacao atualizada para refletir que app e API ja estao em MVP tecnico controlado, nao apenas em fase de planejamento.

Entregas documentais:

- criado snapshot canonico em `../../../docs/tecnico/ESTADO_ATUAL_APP_BACKEND_2026-05-07.md`;
- README do app atualizado para separar release publico `android-v0.1.0-internal.2` do APK privado local `e975046c54c756af14feba64fe40b83877252bb96bca0d97f2d334624218801b`;
- documentos `00`, `02`, `07`, `09`, `10`, `23`, `29` e `32` alinhados ao estado real de API, auth, anjos, distribuicao e bloqueios;
- docs raiz e tecnicos do projeto atualizados para remover leitura atual de API como placeholder.

Validacao registrada:

- API publica `https://api.sinalseguro.com.br/api/health`: `ok`;
- API publica `https://api.sinalseguro.com.br/api/health/ready`: `database=ok`;
- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado.

Limite honesto:

- testes locais do backend nao foram repetidos nesta atualizacao porque `services/api/.venv` esta ausente apos higienizacao de dependencias regeneraveis;
- login Google real continua bloqueado ate ajuste externo `Custom URI scheme` no OAuth Android privado do Google Cloud.

## 2026-05-07 - Frente 1 Android: callback Google corrigido e APK instalado

Status: correcao mobile aplicada; validacao fisica final aguardando desbloqueio do aparelho.

Acao externa concluida no Google Cloud:

- `Custom URI scheme` foi habilitado no OAuth Android privado do projeto `sinalseguro`;
- nenhuma acao de billing/free trial foi ativada;
- Client ID real, contas, tokens e URLs de callback com codigo foram mantidos fora da documentacao e dos logs.

Correcao mobile:

- adicionado callback nativo `app/oauthredirect.tsx` para impedir `Unmatched Route` quando o Google retorna para `sinalseguro://oauthredirect`;
- `WebBrowser.maybeCompleteAuthSession()` passou para o layout raiz;
- fluxo Google agora abre OAuth com PKCE, guarda apenas estado/verificador efemero no SecureStore, troca o codigo por ID token e entao chama `POST /auth/google`;
- conclusao do login centraliza persistencia JWT, `auth/me` quando necessario, bootstrap de dispositivo em `/devices/` e consentimentos;
- `app.json` segue com os schemes `sinalseguro` e `br.com.sinalseguro.app`.

Validacao:

- API publica `health=ok` e readiness `database=ok`;
- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run build:android:private`: aprovado apos recriar `node_modules` pelo lockfile;
- APK instalado no Android fisico;
- SHA-256 do APK privado instalado: `669ccbc6a701b6f1ecec18d9bda93761074be3c754e918042e73e197b672d8b0`.

Limite atual:

- antes do novo APK, o Google ja chegou ao seletor de conta e retornou codigo ao app, confirmando que o bloqueio `Custom URI scheme is not enabled` foi removido;
- no novo APK, a validacao fisica final ficou bloqueada porque o aparelho entrou em keyguard/NotificationShade e `wm dismiss-keyguard` nao removeu o bloqueio;
- assim que o aparelho for desbloqueado, repetir `Configuracoes > Login > Entrar com Google` e confirmar `POST /auth/google`, JWT interno, SecureStore, `auth/me`, `/devices/` e logout com revogacao.

## 2026-05-07 - Frente 1 Android: OAuth publicado para login aberto

Status: ajuste externo gratuito aplicado; reteste Android aguarda reconexao/desbloqueio do aparelho.

Contexto:

- a tela `Publico-alvo` do Google Auth Platform estava em `Testing`;
- a propria tela informou que apenas usuarios de teste acessam o app nesse estado;
- a tela `Acesso a dados` foi conferida antes da mudanca e nao listava escopos confidenciais nem restritos.

Acao externa:

- o app OAuth foi publicado em producao para publico externo;
- nenhuma acao de billing/free trial foi ativada;
- Client ID real, contas, tokens e e-mails foram mantidos fora da documentacao.

Resultado:

- o status passou a `Em producao`;
- nao deve ser necessario pre-cadastrar cada usuaria como test user enquanto o app seguir limitado ao login basico;
- ADB perdeu o dispositivo apos a publicacao, entao a validacao Android final ainda depende de reconectar/desbloquear o aparelho.

## 2026-05-07 - Frente 1 Android: Google Sign-In nativo validado no aparelho

Status: Frente 1 Android concluida fim a fim no Android fisico.

Diagnostico final:

- mesmo com OAuth publicado e Custom URI habilitado, o fluxo Android por navegador/Custom URI continuou bloqueado pela politica atual de resposta segura do Google;
- a solucao gratuita e adequada para Android passou a ser Google Sign-In nativo via Google Play Services;
- o fluxo AuthSession/PKCE permanece no codigo como base para plataformas/fases futuras, mas Android usa o caminho nativo.

Ajustes:

- adicionada integracao `@react-native-google-signin/google-signin` no app privado;
- `Configuracoes > Login` detecta Android e inicia Google Sign-In nativo;
- o app usa Web Client ID somente a partir de ambiente local/seguro para obter ID token, sem versionar ou documentar o valor;
- a API EC2 recebeu a audiencia Web em `/etc/sinalseguro-api.env`, com restart apenas de `sinalseguro-api`;
- nenhum token, refresh token, ID token, client secret, Client ID real, e-mail, IP, user-agent ou payload sigiloso foi registrado em codigo, Git ou documentacao.

Validacao:

- API publica: `health=ok`;
- readiness publica: `database=ok`;
- Android fisico abriu o seletor nativo de contas Google para `br.com.sinalseguro.app`;
- login Google retornou ID token ao app, `POST /auth/google` emitiu sessao SinalSeguro e o JWT interno foi persistido no SecureStore;
- `Validar sessao` confirmou `auth/me`;
- dispositivo autenticado foi registrado em `/devices/`;
- logout revogou a sessao/refresh token interno, limpou a sessao local e removeu o vinculo remoto local do dispositivo;
- logs do processo do app no Android nao continham token, refresh token, access token, Client ID real ou e-mail;
- `sinalseguro-api` e `cereusia-crm` permaneceram ativos; `cereusia.conf` nao foi alterado;
- gates aprovados: `npm run typecheck`, `npm run lint`, `npm test`, `git diff --check` e build Android privado;
- APK privado instalado/validado: SHA-256 `1ca183fe0c68bd4ad45f9330da1ef93ca14bbd1789d5ed0015eada2a19d4087f`.

Pendencia tecnica:

- Frente 1.1 deve fechar par de chaves real por dispositivo, assinatura, rotacao, revogacao e perda de aparelho; a Frente 1 nao expos push token nem chave privada.

## 2026-05-07 - Frente 1 iOS/Android: sessao unica validada em aparelhos fisicos

Status: checkpoint cruzado concluido com iPhone logado e Android atualizado.

Validacao fisica:

- iPhone fisico concluiu login Google no app privado e o backend confirmou dispositivo iOS ativo;
- Android recebeu o APK debug bundled recompilado via ADB Wi-Fi e abriu sem crash;
- `Configuracoes > Login` no Android confirmou API e Google Sign-In nativo configurados;
- tentativa de login Google no Android com a mesma conta ativa no iPhone foi bloqueada por modal visivel `Login bloqueado neste aparelho`;
- backend confirmou bloqueio recente com ativo `ios` e tentativa `android`;
- o usuario permaneceu com Android revogado e iOS ativo;
- chave publica/hash do dispositivo ativo existem no backend e push token segue ausente.

Validacao tecnica:

- API publica `health=ok` e readiness `database=ok`;
- `npm run build:android:debug:bundled`: aprovado;
- APK instalado no Android fisico via ADB Wi-Fi;
- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `manage.py test sinalseguro_api.tests.test_platform_base`: aprovado;
- `git diff --check`: aprovado em `apps/mobile` e `repos/empresa`.

Decisao operacional:

- alternancia Android/iOS deve limpar regeneraveis da plataforma anterior antes da nova compilacao, por limite de armazenamento local;
- scripts operacionais globais continuam em `scripts/` na raiz e comentados.

Proxima frente recomendada:

- Frente 1.1, chaves reais por dispositivo, esta concluida, publicada em producao e homologada no Android fisico. A proxima frente e Frente 1.2, midia critica. Rede de anjos passa a ser Frente 2, depois das chaves reais, da midia critica e da frente de perfis/familia/maioridade.

## 2026-05-07 - Frentes globais reorganizadas

Status: documentacao e memoria atualizadas; sem implementacao de codigo.

Decisoes:

- Documento canonico criado em `../../../docs/tecnico/FRENTES_GLOBAIS_APP_BACKEND_MIDIA_ANJOS.md`.
- Background significa prontidao para acionar/receber ocorrencia, nao camera/microfone/GPS permanentes.
- Camera, microfone e GPS so abrem durante ocorrencia ativa, com permissao e indicador do sistema.
- A pessoa protegida pode iniciar audio/video com anjos ou responsaveis autorizados; localizacao nao entra por padrao nessa chamada.
- Pais/responsaveis podem adicionar filhos menores como protegidos e controlar a rede de protecao dos filhos.
- Filhos menores nao adicionam anjos, nao sao anjos e acionam SOS para pais/responsaveis ou conveniados autorizados.
- Adulto pode ser anjo de varios usuarios, mas so atende uma ocorrencia SOS ativa por vez.
- Modulo atual de midia JS/Base64/loopback permanece como prova tecnica; arquitetura final deve usar WebRTC nativo, gravacao segmentada, criptografia nativa por segmento e player nativo.

Ordem atual:

1. Frente 1.1 - chaves reais por dispositivo. Status: concluida, publicada em producao e homologada no Android e no iPhone fisicos.
2. Frente 1.2 - midia critica, gravacao, criptografia, player e performance.
3. Frente 1.3 - perfis, familia, maioridade e papeis.
4. Frente 2 - anjos e convites.
5. Frente 3 - ocorrencia SOS e roteamento.
6. Frente 4 - chamada audio/video.
7. Frente 5 - midia operacional e nuvem cifrada.
8. Frente 6 - localizacao em tempo real.
9. Frente 7 - conveniados e orgaos.
10. Frente 8 - compliance, lojas, academico e empresa.

## 2026-05-07 - Frente 1.1 Android: homologacao fisica pos-deploy concluida

Status: Android concluido; iOS homologado no iPhone fisico.

Validacao fisica:

- APK privado recompilado com a Frente 1.1 e instalado no Android fisico via ADB apos estabilizar o transporte;
- app abriu sem crash e a rota `sinalseguro://configuracoes` abriu `Configuracoes`;
- `Configuracoes > Login` mostrou sessao conectada e dispositivo autenticado registrado;
- `Testar API` retornou `API SinalSeguro online: ok.`;
- `Validar sessao` executou `auth/me`, bootstrap autenticado de dispositivo e consentimentos, retornando `Sessao SinalSeguro validada. Dispositivo registrado e consentimentos sincronizados.`;
- consulta saneada na API de producao confirmou Android ativo com `key_algorithm=ed25519-v1`, chave publica presente, hash publico presente e `key_registered_at` preenchido;
- logcat do processo do app nao apresentou padroes de e-mail, Bearer, ID token, refresh token, chave privada ou `key_proof`.

Validacao tecnica:

- APK validado: `android/app/build/outputs/apk/debug/app-debug.apk`;
- SHA-256 do APK: `9b37ed50604da58cd4bbe11622de7802c0335140e262e895b444da30ea5217f7`;
- API publica: `health=ok` e readiness `database=ok`;
- `git diff --check`: aprovado.

Decisao operacional:

- homologacao Android da Frente 1.1 esta fechada;
- atualizacao posterior em 2026-05-07: iPhone/iOS tambem foi homologado com build corrigido, Google Sign-In sem fechamento do app e API confirmando `ed25519-v1` ativo;
- Frente 1.2 de midia critica pode ser aberta em chat proprio, sem alterar o contrato de chaves/dispositivos.

## 2026-05-07 - Frente 1.2: abertura do diagnostico de midia critica

Status: diagnostico aberto; sem alteracao de codigo mobile.

Confirmacoes:

- Frente 1.1 de chaves reais por dispositivo esta fechada, publicada e homologada em Android/iPhone fisicos.
- `apps/mobile`, `repos/empresa` e `repos/portais` estavam limpos em `main...origin/main` no inicio da Frente 1.2.
- Contratos de chaves/dispositivos ficam congelados nesta frente salvo reconciliacao explicita.

Mapa tecnico inicial:

- captura: `EmergencyMediaRecorder.tsx` e `mediaCapture.ts`;
- cofre/pacote: `emergencyRecorder.ts`, `types.ts` e apresentacao de midia;
- criptografia: `VideoCryptoService.ts`, `EncryptedVideoStore.ts`, `EncryptedVideoManifest.ts`, `EncryptedVideoDataSource.ts` e `videoByteEncoding.ts`;
- player: `EvidencePlayerCard.tsx`, `EncryptedVideoLoopbackServer.ts`, `EncryptedVideoRangeHttp.ts` e `EncryptedVideoPlaybackCache.ts`;
- thumbnails e residuos: `SecureVideoThumbnailStore.ts` e `CameraCaptureResidueCleaner.ts`;
- testes: `scripts/encrypted-video-store.test.ts`.

Leitura inicial:

- o caminho atual JS/Base64/loopback e funcional em homologacao, mas potencialmente caro para videos longos;
- a preservacao criptografa e depois verifica novamente todos os chunks antes da limpeza, preservando seguranca mas dobrando custo de leitura/descriptografia/hash;
- o player falha com mensagem generica, sem causa tecnica saneada suficiente.

Bloqueio de reproducao imediata:

- nenhum Android apareceu em `adb devices -l`;
- iPhone apareceu em `xcrun xctrace list devices`, mas `xcrun devicectl list devices` retornou erro de CoreDevice/provedor.

Proximo passo:

- medir Android/iOS fisicos com gravacoes de 30s, 60s, 3min e 5min;
- registrar CPU, memoria, I/O, chunks, tempos de criptografia/descriptografia, preservacao, thumbnail, limpeza e tempo ate primeiro frame;
- decidir correcao pontual ou refatoracao nativa apenas apos evidencia.

Validacoes nesta abertura:

- `npm run test:crypto`: aprovado;
- `git diff --check`: aprovado antes das edicoes documentais.

## 2026-05-07 - Frente 1.2: equipe operacional e telemetria saneada

Status: implementacao inicial de instrumentacao local; sem rede, sem midia remota e sem alteracao de chaves/dispositivos.

Equipe acionada sob coordenacao de Ze:

- Ada/Cristine: mapeamento dos pontos de instrumentacao em gravacao, preservacao, thumbnail, limpeza, loopback e player;
- Schneier: regras de telemetria saneada, bloqueio de URI/capability/chaves/tokens/coordenadas e gates do loopback;
- Myers: matriz Android/iOS fisica para medir CPU, memoria, I/O, chunks, preservacao e tempo ate primeiro frame;
- Doneda: fica como gate se houver mudanca de consentimento, retencao, compartilhamento, upload ou uso real de midia;
- Knuth: rastreabilidade em docs, memoria e timeline.

Implementado:

- novo `src/features/emergency/MediaDiagnostics.ts`;
- eventos estruturados em memoria, sem `console.log` livre, sem rede e sem exportacao automatica;
- snapshot saneado anexado ao `encryptedVideo.diagnostics` do asset local;
- marcadores para `capture_recording`, `preserve_source_stat`, `preserve_encrypt_chunks`, `preserve_thumbnail`, `preserve_verify`, `preserve_cleanup`, `preserve_total`, `loopback_open`, `loopback_stream`, `playback_prepare` e `playback_first_progress`;
- filtros de seguranca para impedir metricas com `uri`, `url`, `path`, `key`, `token`, `nonce`, `tag`, `sha`, coordenada, payload, e-mail, IP ou capability;
- player persiste diagnostico saneado no pacote local apos preparo e primeiro progresso, sem registrar URL do loopback.

Proxima validacao fisica:

- reconectar/desbloquear Android e repetir matriz Myers de 30s, 60s, 3min e 5min;
- repetir no iPhone quando instalacao/lancamento fisico estiver estavel;
- usar os snapshots `encryptedVideo.diagnostics` apenas como apoio de QA, sem anexar midia real ou caminhos sensiveis.

## 2026-05-08 - Frente 1.2: correcao iOS para pacote sem video

Status: correcao incremental implementada e build iOS instalado; validacao manual final pendente por iPhone bloqueado.

Evidencia:

- Android fisico segue funcional para gravacao, cofre e player cifrado;
- no iPhone Release, testes manuais mostraram que a gravacao iniciava, mas o player recebia pacote sem asset (`Sem midia`, `Nenhum video neste arquivo`);
- inventario do container confirmou ausencia de `manifest.sseg`, chunks e thumbnails apos o teste;
- isso isola o bug antes do player: o encerramento iOS nao retornava/preservava o video;
- apos a atualizacao inicial, um SOS anterior continuou ativo depois da reinstalacao e o encerramento pelo botao ainda demorava cerca de 30s, apontando dependencia indevida do retorno da camera.

Implementado:

- `EmergencyMediaRecorder` passou a usar captura iOS segmentada em H.264 (`avc1`) com segmentos curtos;
- cada segmento e preservado como asset cifrado assim que fecha;
- o encerramento do SOS passa a aceitar segmentos ja preservados em vez de depender de um unico arquivo longo;
- registro historico: `HomeScreen` chegou a finalizar o pacote local imediatamente no botao seguro e a parar a camera em paralelo, sem aguardar `recordAsync`/`stopRecording`;
- se o iOS devolver um segmento apos o encerramento, o pacote ja finalizado ainda pode receber o asset cifrado;
- o player identifica segmentos repetidos da mesma camera por indice.

Validacoes:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `git diff --check`: aprovado;
- build `Release` iOS aprovado com xcconfig local saneado;
- instalacao do novo build no iPhone fisico aprovada;
- logs fisicos: iPhone visto por USB em `xcdevice`; `devicectl` sem provider CoreDevice; `ios-deploy` instalou Release, mas launch/debug foi bloqueado pelo lockscreen;
- lancamento remoto bloqueado pelo lockscreen; proxima acao e iPhone desbloqueado, SOS manual de pelo menos 12s, encerramento rapido pelo botao e conferencia de `manifest.sseg`/chunks no container.

## 2026-05-08 - Frente 1.2: iOS ainda sem asset e diagnostico persistido

Status: nova correcao incremental instalada; proximo SOS manual deve confirmar se o iOS passa a devolver arquivo ou, em falha, mostrar causa tecnica saneada no cofre/player.

Evidencia adicional:

- Roberto validou novo SOS no iPhone com mais de 30s; o botao de encerramento passou a funcionar corretamente;
- o pacote recem-gravado ainda apareceu no cofre como `Sem midia` e o player nao rodou por ausencia de asset;
- o container continuou sem midia cifrada apos os pacotes antigos, confirmando que a falha segue antes do player;
- preferencias locais baixadas do iPhone mostraram `cameraMode=front`, entao o problema nao era tentativa de duas cameras;
- a tipagem local do `expo-camera` indica que `480p`, `720p`, `1080p` e `2160p` sao qualidades Android; iOS deve usar `4:3`.

Implementado:

- `EmergencyMediaRecorder` agora usa `videoQuality="4:3"` no iOS e mantem `480p` no Android;
- o app persiste diagnostico de captura no proprio pacote quando a camera nao monta, nao retorna arquivo, falha durante gravacao ou perde permissao;
- o cofre/player exibem causa tecnica saneada em vez de apenas `Nenhum video neste arquivo`, sem URI, caminho, chave, token, coordenada, e-mail, IP ou payload sensivel;
- o diagnostico adicionou a etapa `capture_mount` e continua usando apenas metricas agregadas;
- build `Release` iOS recompilado e instalado no iPhone fisico; launch automatico foi bloqueado por lockscreen, mas a instalacao concluiu.

Controle fisico do iPhone pelo Mac:

- iPhone Mirroring da Apple nao atende este aparelho porque exige iOS 18 ou posterior e o iPhone de teste esta em iOS 16.7.15;
- QuickTime/AirPlay podem ajudar como visualizacao/gravacao da tela, mas nao entregam toque/controle remoto confiavel para QA automatizado;
- Appium 2 + XCUITest e a rota viavel para controle por MacBook: `appium-xcuitest-driver` foi instalado localmente e o WebDriverAgent compilou/assinou, mas o Xcode recusou iniciar o runner no iPhone fisico com erro de execucao de teste;
- pendencia operacional: configurar/preinstalar WebDriverAgentRunner assinado para este iPhone ou ajustar a combinacao Appium/Xcode/WDA antes de usar toque/screenshot remoto em tempo real.

Validacoes:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- build `Release` iOS: aprovado;
- instalacao no iPhone fisico: aprovada;
- `git diff --check`: pendente apos atualizacao documental final.

## 2026-05-08 - Frente 1.2: iOS Debug com log operacional persistente

Status: controle remoto total do iPhone ainda bloqueado; app iOS fisico instalado em Debug com log operacional saneado para diagnostico do pacote `Sem midia`.

Evidencia:

- novo teste manual no iPhone as 07:56 ainda gerou item `Sem midia`/`Sem video`;
- inventario do container apos o teste mostrou ausencia de `manifest.sseg`, chunks, thumbnails e arquivos em `Library/Caches/Camera`;
- a falha segue antes do player/loopback/criptografia de playback: a camera iOS nao entregou arquivo preservavel para o cofre;
- Appium foi atualizado para rota Appium 3 + XCUITest driver recente, mas o WebDriverAgent continuou bloqueado pelo Xcode com erro de inicializacao de runner no iPhone fisico.

Implementado:

- novo `MediaOperationalLog` grava JSONL local em `Documents/sinalseguro-debug/media-operational-log.jsonl` apenas no iOS;
- o log e persistente, limitado em tamanho, sem rede, sem `console.log` livre e com saneamento de URI, caminho, chave, token, nonce, tag, hash, coordenada, payload, e-mail, IP e capability;
- foram instrumentadas etapas de inicio/encerramento do SOS, prontidao da camera, `recordAsync`, stop solicitado, preservacao local, cifragem de chunks, verificacao e pacote sem asset;
- build `Debug` iOS com bundle embutido foi compilado e instalado no iPhone fisico via USB.

Proxima validacao:

- executar novo SOS no iPhone com o build Debug instalado;
- encerrar pelo botao seguro;
- puxar `Documents/sinalseguro-debug/media-operational-log.jsonl`;
- se o log indicar camera nao pronta/montada, testar preview iOS com tamanho real/visivel;
- se indicar `recordAsync` sem retorno ou erro de codec, remover `codec`/bitrate iOS e testar default nativo antes de decidir modulo nativo.

## 2026-05-08 - Frente 1.2: causa iOS isolada por log operacional

Status: correcao pontual aplicada e novo Release instalado; reteste fisico pendente com iPhone desbloqueado.

Evidencia coletada:

- JSONL operacional confirmou permissao concedida, camera pronta e `recordAsync` iniciado no iPhone;
- ao encerrar o SOS, o app registrou stop solicitado com zero assets;
- em seguida, o componente de camera desmontou ainda com gravacao ativa;
- nao houve retorno de arquivo nem inicio/sucesso de preservacao cifrada antes do pacote aparecer `Sem midia`.

Decisao:

- player continua sintoma, nao causa primaria;
- a falha estava na ordem de encerramento: o pacote era finalizado e a camera desmontada antes de a API nativa devolver o arquivo.

Implementado:

- `HomeScreen` agora sinaliza o stop da camera e aguarda `waitForMediaRecorderStop` antes de `finishEmergencyPackage`;
- `EmergencyMediaRecorder` liquida o stop com `attached`, `empty`, `error` ou `idle`;
- timeout de 9s registra `emergency_media_stop_timeout` saneado e permite finalizar o chamado mesmo se o iOS nao responder;
- smoke test garante que `waitForMediaRecorderStop` ocorra antes de `finishEmergencyPackage`.

Validacoes:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `git diff --check`: aprovado;
- build iOS `Release`: aprovado;
- instalacao no iPhone fisico: aprovada; auto-launch bloqueado porque o aparelho estava travado.

Proxima validacao:

- desbloquear o iPhone, abrir SinalSeguro manualmente, iniciar SOS por pelo menos 20s e encerrar pelo botao seguro;
- conferir cofre/player;
- se continuar `Sem midia`, baixar o JSONL e procurar `emergency_media_stop_timeout`, retorno de `recordAsync` e eventos de preservacao.

## 2026-05-08 - Frente 1.2: iOS `recordAsync` falha antes do encerramento

Status: nova correcao incremental aplicada; Release precisa de reteste fisico.

Evidencia do teste 10:35:

- o cofre/player mostrou `Gravacao de video interrompida pela camera`;
- JSONL operacional confirmou camera pronta, permissao concedida e `recordAsync` chamado;
- `recordAsync` falhou em menos de 1s, antes de qualquer `capture_preserve_start`;
- ao encerrar o SOS, o gravador ja estava `idle`, logo o botao nao era mais a causa do pacote sem midia neste teste;
- tambem houve duas tentativas de inicio do SOS antes de o primeiro pacote terminar de ser criado.

Implementado:

- `HomeScreen` bloqueia duplo acionamento enquanto o pacote SOS ainda esta sendo criado (`startInProgress`);
- iOS ganha warm-up curto entre `onCameraReady` e `recordAsync`;
- se `recordAsync` falhar rapido no iOS, o app registra `capture_record_async_retry`, aguarda e tenta novamente antes de classificar falha definitiva;
- diagnostico pode diferenciar `camera_output_not_ready` de erro generico de gravacao.

Validacoes locais:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `git diff --check`: aprovado.

## 2026-05-08 - Frente 1.2: iOS grava, mas preservacao cifrada atrasava cofre

Status: hotfix aplicado; novo build iOS Release precisa de reteste fisico.

Evidencia do teste 11:16:

- `recordAsync` passou a retornar arquivo no iPhone;
- fonte clara temporaria tinha cerca de 4,8 MB e foi transformada em 10 chunks cifrados;
- criptografia levou aproximadamente 29s e a verificacao completa levou mais 27s;
- o timeout de encerramento de 9s finalizou o pacote antes de `preserve_local_video_attached`;
- os chunks cifrados e `manifest.sseg` existiam no container, mas o cofre foi aberto antes do indice ser atualizado.

Implementado:

- iOS passa a gravar em H.264 (`avc1`), `480p` e bitrate alvo controlado;
- chunks iOS aumentados para 2 MB para reduzir overhead de FileSystem/base64;
- verificacao iOS passa a modo `bounded`: valida chave, manifesto autenticado, consistencia de metadados e chunks de borda; a autenticacao completa continua acontecendo por chunk no playback;
- timeout de encerramento subiu para 30s e foi adicionado bloqueio sincrono contra multiplos encerramentos simultaneos;
- mensagem de timeout passou a indicar que a midia ainda esta sendo protegida, sem classificar falsamente como camera interrompida.

Decisao Schneier/Myers:

- hotfix incremental e aceitavel para homologacao fisica, porque nao persiste video claro permanentemente e mantem AEAD/hash por chunk;
- para producao, permanece obrigatoria refatoracao nativa de captura segmentada, criptografia nativa por segmento e player/data source nativo.

## 2026-05-08 - Frente 1.2: iOS saturava encerramento com ciclo continuo

Status: hotfix adicional implementado; build iOS Release precisa ser reinstalado e retestado.

Evidencia do teste fisico mais recente:

- o container do iPhone ja continha `manifest.sseg`, chunks e thumbnails cifrados, portanto havia midia preservada;
- o JSONL mostrou nova sessao com varios segmentos iOS sucessivos, cada um gravado, cifrado e verificado durante o SOS;
- nao apareceu evento `emergency_finish_button_pressed` na sessao mais recente antes da coleta, indicando que o toque de encerramento ficou atrasado ou nao entrou no handler enquanto o JS seguia ocupado;
- havia arquivo temporario de camera em cache durante a sessao ativa, reforcando que o app ainda estava em ciclo de captura.

Correcao aplicada:

- iOS fisico de homologacao deixa de gravar/cifrar indefinidamente durante o SOS;
- a captura iOS agora preserva um unico segmento curto H.264/480p por chamado e encerra o ciclo pesado, mantendo o chamado ativo com metadados ate o usuario finalizar pelo botao;
- cofre/player atualizam a lista ao abrir os modais para reduzir leitura de indice antigo;
- home executa limpeza de residuos de camera quando nao ha chamado ativo.

Decisao Schneier/Myers:

- a solucao e uma contencao incremental para homologacao no iPhone 8/iOS 16, reduzindo risco de travamento e de residuo claro temporario;
- para gravacao real de varios minutos, a decisao tecnica continua sendo refatorar para captura nativa segmentada, criptografia nativa por segmento e player/data source nativo.

## 2026-05-09 - Frente 1.2: motor nativo versionado e build Android

Status: primeira ponte nativa persistente implementada e validada no Android; iOS aguardando novo gate de espaco/Pods.

Implementado:

- `SinalSeguroMediaEngine` foi adicionado como ponte JS com interface minima para `encryptSegment`, `openEncryptedAsset`, `closePlaybackHandle` e `cleanupMediaResidues`;
- Android recebeu modulo nativo Kotlin com AES-256-GCM por segmento, restricao a storage privado do app, handles saneados de playback e limpeza de residuos nativos;
- iOS recebeu templates Swift/ObjC equivalentes com CryptoKit/AES-GCM, restricao a Documents/Caches/Application Support/tmp e bridge React Native;
- como `android/` e `ios/` sao regeneraveis/ignorados no Git, o motor foi persistido por `plugins/with-sinalseguro-media-engine.js` e templates em `plugins/native-media-engine/`;
- `app.json`, build Android privado e dashboard iOS passam a sincronizar o motor nativo antes de build/prebuild;
- envelopes atuais continuam em `js_chunked_v1` com `range_data_source_required`; o player so usa `native_encrypted_source` quando um ativo novo declarar `storageEngine: "native_segmented_v1"`;
- o loopback JS permanece fallback de homologacao para ativos existentes, sem virar caminho principal de novos ativos nativos;
- metadados futuros de P2P foram preparados no envelope (`keyId`, `packageId`, `emergencySessionId`, `envelopeScope`) sem alterar contratos da Frente 1.1.

Validacoes:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run test:crypto`: aprovado;
- `npm run test:device-keys`: aprovado;
- `git diff --check`: aprovado;
- build Android privado pelo dashboard aprovado em 2026-05-09, APK em `distribution/android/out/sinalseguro-android.apk`, SHA-256 `9d60f820a4dc8d9556482df957b409637b111ab5988a0e8122da6cc03879f9bc`;
- readiness Android privado aprovado com `CAMERA`, `RECORD_AUDIO`, bloqueio de permissao externa e `allowBackup=false`;
- visual web local validado em `http://localhost:19006/` e `http://localhost:19006/arquivos?painel=player`: Home SOS, modal Player Seguro sem arquivo e modal Cofre local renderizaram sem quebra visual aparente.

Limites ainda abertos:

- iOS build/test nao foi executado nesta passada porque a limpeza removeu `ios/Pods` e o espaco livre apos o build Android ficou abaixo do gate de 14 GiB;
- testes fisicos Android/iPhone de 30s, 60s, 3min e 5min ainda precisam ser feitos com ativo nativo real;
- a captura segmentada nativa ainda nao substituiu a captura Expo; esta etapa fechou a ponte nativa persistente e o caminho de compatibilidade.

## 2026-05-10 - Frente 1.2: checkpoint nativo, Android curto e salvamento

Status: implementacao nativa salva em homologacao privada; Frente 1.2 ainda nao concluida.

Implementado:

- `preserveLocalVideoAsset` virou roteador entre `SinalSeguroMediaEngine` nativo e fallback JS por chunks;
- Android nativo usa AES-256-GCM por stream em blocos, hash incremental e storage privado;
- envelopes aceitam algoritmo legado `xchacha20poly1305` e nativo `aes-256-gcm`, alem de `storageEngine`, `playbackAdapter`, `processingState`, `nativePlayback`, `captureProfile`, `keyId`, `packageId` e `emergencySessionId`;
- Home/SOS ganhou estados explicitos para parada, camera liberada, criptografia, empacotamento, limpeza, anexo, sem midia e erro;
- Player Seguro prepara MP4 temporario reproduzivel em cache privado/no-backup antes de tocar, com barra de preparo, TTL, limpeza ao fechar/trocar/background e limpeza de boot em Home/Arquivos;
- loopback local fica apenas como fallback para ativos legados `js_chunked_v1`.

Validacoes:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run test:crypto`: aprovado;
- `npm run test:device-keys`: aprovado;
- `npm run private:android:readiness`: aprovado com pendencia ambiental conhecida de Node local;
- `git diff --check`: aprovado;
- `npm run build:android:private`: aprovado;
- APK Android final: `android/app/build/outputs/apk/debug/app-debug.apk`;
- SHA-256: `5e664df9a9982569a0ce05e737af01fcc105057d892438e10ffbe07ac1f28afd`.

Android fisico `23129RA5FL`:

- APK final instalado por USB;
- teste curto confirmou saida visual de `CHAMADO ATIVO` em ate 0,5s, cofre com midia protegida e player abrindo fonte preparada;
- inventario saneado confirmou 0 midias claras persistentes apos fechamento real do player;
- teste de MP4 temporario artificial confirmou limpeza no relaunch apos estabilizacao do app.

Limites:

- evidencias visuais e logcat detalhado nao foram versionados por risco de identificacao; ficou apenas inventario saneado;
- Android 60s/3min/5min e iPhone fisico ainda sao obrigatorios;
- iOS nativo ainda nao esta aprovado para midia longa enquanto depender de leitura integral;
- chamada P2P/anjo, upload, localizacao e conveniados continuam fora desta frente.

## 2026-05-11 - Frente 1.2: checkpoint GUI, player unificado e proxima correcao de recuperacao

Status: em execucao. A frente permanece aberta.

Registrado nesta retomada:

- iOS Release compilou com sucesso, mas nao deve ser instalado como final porque ajustes de UX foram aplicados depois do inicio do build.
- Android ADB nao apresentou aparelho conectado; a validacao fisica Android fica aguardando reconexao.
- O player/cofre foram ajustados para tratar segmentos nativos da mesma camera como um unico video protegido na apresentacao.
- Ada/Myers apontaram lacuna: pacote `recording_local` interrompido sai do estado ativo, mas ainda precisa tentar recuperar residuo claro privado de camera antes de gravar causa saneada `sem midia`.

Proxima acao: implementar recuperacao restrita ao cache privado de camera, sem logar URI/caminho e sem reativar camera/microfone.

## 2026-05-13 - Decisao de escopo: MVP Android primeiro, iOS pos-MVP

Status: decisao operacional aprovada por Roberto. A conclusao do MVP passa a focar Android; iPhone/iOS deixa de bloquear a Frente 1.2 e vai para etapa pos-MVP.

Motivo:

- as tentativas de destravar iPhone/iOS passaram a consumir ciclos demais e bloquear o andamento do projeto;
- Android ja possui evidencia fisica forte da Frente 1.2, com SOS, cofre, player, criptografia nativa e inventario saneado;
- a prioridade de produto agora e entregar o MVP 100% funcional no Android e viabilizar as proximas frentes.

Entraves iOS documentados:

- `devicectl`/CoreDevice listou o iPhone como indisponivel e falhou com usage assertion;
- `idevicedebug` relancou o app, mas nao entregou deep link de navegacao;
- validacao visual dependeu de screenshot via cabo e acao manual no aparelho;
- Xcode 26.5 mostrou SDK `iphoneos26.5`, mas marcou o destino iOS como inelegivel dizendo que iOS 26.5 nao estava instalado;
- tentativa de `xcodebuild -downloadPlatform iOS` ficou silenciosa por varios minutos e foi interrompida para nao travar tempo/espaco;
- cofre passou a mostrar o pacote de 1min38 como `1 video`, mas o player nativo unificado falhou com `playback_prepare_error` para `assetCount: 8`;
- hipotese preservada: fragilidade do merge iOS com `AVMutableComposition`/`AVAssetExportSession` em multiplos MP4 curtos e possivel impacto de nomes temporarios longos;
- patch iOS experimental de export normalizado foi iniciado, mas nao validado e nao conta como gate aprovado.

Nova regra:

- nao rodar novas tentativas de build, instalacao, debug ou validacao fisica iPhone durante a conclusao do MVP Android;
- preservar evidencias iOS em `docs/evidencias/ios/2026-05-13-frente-1-2-unified-player/`;
- usar `docs/34_DECISAO_MVP_ANDROID_IOS_POS_MVP_2026-05-13.md` como handoff da decisao;
- finalizar Frente 1.2 pelo caminho Android, com nova rodada fisica Android proporcional antes de liberar as proximas frentes do MVP.

## 2026-05-13 - Frente 1.2: Android rebuildado, instalado e validado fisicamente

Status: Android aprovado por Zé/QA para teste manual supervisionado de Roberto. A frente continua aberta ate Roberto aprovar o fluxo manual.

Executado:

- `android/` foi regenerado por build privado, preservando iPhone/iOS fora do escopo do MVP imediato;
- motor nativo Android foi endurecido para aceitar origem apenas em `filesDir`, `cacheDir` e `noBackupFilesDir`, removendo `externalCacheDir` e `getExternalFilesDir` da lista aceita;
- smoke test passou a bloquear regressao que reabra raizes externas para entrada de midia;
- APK final instalado no Android fisico `23129RA5FL` por USB.

Validacoes locais:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run private:android:readiness`: aprovado com pendencia ambiental conhecida de Node local para release publico;
- `git diff --check`: aprovado;
- `npm run build:android:private`: aprovado;
- APK: `android/app/build/outputs/apk/debug/app-debug.apk`;
- SHA-256: `50fe4c831174899e5728579709ec906470c6c55d4aad1f205c162da1be0444db`.

Android fisico:

- instalacao `adb install -r`: `Success`;
- primeiro ciclo SOS gravou `Video 1min 48s`, finalizou em `Video protegido` 100%, abriu cofre como `1 video` e player reproduziu o arquivo unificado ate pelo menos `0:23 / 1:46`;
- ciclos curtos pos-rebuild confirmaram reentrada da camera/microfone, nova finalizacao `Video protegido` 100%, `Continuar` fechando o modal para Home, cofre com `Video 31s`/`1 video` e player final reproduzindo `0:01 / 0:29`;
- `dumpsys media.camera` confirmou conexao/desconexao do pacote SinalSeguro e dump final sem cliente ativo de camera;
- inventario saneado final pos-rebuild confirmou 418 arquivos, 375 `.sseg`, 22 `.nseg` e 0 midias claras persistentes `.mp4/.mov/.m4v/.3gp/.avi/.webm`.

Evidencias:

- resumo versionavel em `docs/evidencias/android/2026-05-13-frente-1-2-validacao-fisica/RELATORIO_VALIDACAO_ANDROID.md`;
- inventario saneado em `docs/evidencias/android/2026-05-13-frente-1-2-validacao-fisica/inventario-saneado.txt`;
- capturas PNG locais preservadas no mesmo diretorio, sem publicacao automatica.

Limites:

- logcat bruto ficou apenas em `/tmp` e nao deve ser versionado;
- iPhone/iOS permanece pos-MVP;
- nao fechar a Frente 1.2 sem teste manual e aceite explicito de Roberto.

## 2026-05-13 - Pausa da Frente 1.2 e higienizacao de reciclaveis Android

Status: pausa controlada aguardando Roberto concluir demanda paralela do portal web governo/business. Nenhuma acao de portal foi executada nesta frente.

Executado:

- dry-run de `./scripts/higienizar-reciclaveis-android.sh --select all` identificou 3.1 GiB de reciclaveis Android;
- aplicacao com `./scripts/higienizar-reciclaveis-android.sh --select all --apply`;
- removidos 5 itens: `apps/mobile/.expo`, `apps/mobile/android/.gradle`, `apps/mobile/android/app/.cxx`, `apps/mobile/android/app/build`, `apps/mobile/android/build`;
- relatorio do script: 0 falhas, 4.1 GiB livres antes, 6.6 GiB livres depois, variacao real de 2.5 GiB; conferencia final posterior indicou 6.3 GiB livres;
- dry-run posterior confirmou `nenhum reciclavel encontrado`.

Impacto:

- APK local validado foi removido junto com `android/app/build`, como artefato regeneravel;
- app validado segue instalado no Android fisico;
- checksum, evidencias e estado de aprovacao tecnica permanecem preservados na documentacao;
- para teste manual, usar o app instalado; para reinstalar, rebuild Android privado sera necessario.

Checkpoint detalhado:

- `docs/35_CHECKPOINT_PAUSA_FRENTE_1_2_HIGIENIZACAO_ANDROID_2026-05-13.md`.

## 2026-05-13 - Frente 1.2 Android aprovada por Roberto

Status: Frente 1.2 encerrada para o escopo Android do MVP.

Roberto validou fisicamente as atualizacoes feitas no app e aprovou a Frente 1.2.

Decisoes:

- Android fica aprovado como base de midia critica do MVP;
- iPhone/iOS permanece pos-MVP e nao deve bloquear as proximas frentes Android;
- nao ha liberacao automatica de P2P/anjos/conveniados sem frente propria;
- fechamento detalhado em `docs/36_FECHAMENTO_FRENTE_1_2_ANDROID_2026-05-13.md`.

Proxima frente recomendada:

- Frente 1.3 - perfis, familia, maioridade e papeis.

Justificativa:

- a chamada com anjos/responsaveis e qualquer fluxo P2P dependem primeiro de papeis, relacoes autorizadas, maioridade, consentimentos e limites de menores.

## 2026-05-13 - Frente 1.3 iniciada: perfis, familia, maioridade e papeis

Status: abertura tecnica implementada no app Android/MVP.

Executado:

- especialistas acionados para produto/rastreabilidade, mobile/API, LGPD/seguranca e UX/QA;
- criada politica local testavel de perfis e papeis;
- criada tela `Perfis e papeis`;
- tela `Anjos` passou a exigir perfil permitido antes de criar convite;
- tela `Convite recebido` passou a bloquear menor ou perfil ausente antes de aceitar como anjo;
- menu da Home ganhou atalho para Perfis;
- teste `profile-policy.test.ts` entrou no `npm test`;
- smoke test passou a bloquear regressao de menor convidar ou atuar como anjo.

Validacoes rapidas:

- `npm run test:profiles`: aprovado;
- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `node scripts/smoke-test.mjs`: aprovado;
- `npm test`: aprovado;
- `npm run private:android:readiness`: aprovado como build privado condicionado, com pendencia ambiental conhecida de Node local para release publico;
- `git diff --check`: aprovado.

Limite:

- este checkpoint ainda e controle local/mobile; o backend server-side de perfis, vinculo responsavel-protegido e autorizacao por escopo ainda precisa ser implementado antes de liberar Frente 2 de anjos.

Checkpoint:

- `docs/38_CHECKPOINT_ABERTURA_FRENTE_1_3_PERFIS_PAPEIS_2026-05-13.md`.

## 2026-05-13 - Frente 1.3 backend publicado: perfis e autorizacoes

Status: fatia backend publicada na EC2 do SinalSeguro e app Android sincronizado com o novo contrato.

Executado:

- criado dominio backend `profiles` com perfil da conta, protegido, vinculo responsavel-protegido e autorizacao por escopo;
- adicionados endpoints `/api/profiles/me`, `/api/protected-subjects/`, `/api/responsible-links/` e `/api/profile-authorizations/`;
- `trusted_contacts` ganhou FKs nullable para protegido e default `can_receive_location=False`;
- convites agora exigem perfil permitido no backend;
- menor protegido e perfil ausente ficam bloqueados server-side;
- responsavel por menor so passa quando houver protegido ativo, vinculo ativo e autorizacao ativa;
- `can_receive_media`, `can_receive_location`, `key-envelopes` e `p2p-signals` continuam bloqueados nesta frente;
- app Android sincroniza perfil local com `/api/profiles/me` antes de criar convite backend;
- ajustes UX aplicados em `Anjos`, `ButtonIcon` e microcopy de `Perfis`.

EC2:

- backup antes do deploy: `/opt/sinalseguro-api/backups/sinalseguro_prod_before_front13_20260513-201501.dump`;
- deploy via `infra/aws/deploy-api.sh`;
- migrations aplicadas: `profiles.0001_initial` e `trusted_contacts.0002_profile_subject_and_location_default`;
- health/readiness publicos aprovados com `database=ok`;
- `cereusia.conf` preservado com hash `05a73c767a68612a5deb4e6a12a5ce23709c97f47f6bb3bfa652dc4408607c6c`.

Validacoes:

- backend: `manage.py check`, `manage.py test sinalseguro_api.tests`, `spectacular --validate`, `makemigrations --check --dry-run`;
- mobile: `test:profiles`, `typecheck`, `lint`, `smoke-test`, `npm test`, `private:android:readiness`, `git diff --check`.

Checkpoint:

- `docs/39_CHECKPOINT_FRENTE_1_3_BACKEND_PERFIS_AUTORIZACOES_2026-05-13.md`.

## 2026-05-14 - Cronograma app ajustado apos Governo/Business

Status: sem entrave para continuar a Frente 1.3 Android.

Contexto:

- os portais Governo/Business e o pacote Governo/PB consolidaram a rota de sustentabilidade por piloto, operacao assistida, convenios/contratos, suporte e manutencao institucional;
- essa evolucao nao altera o foco imediato do MVP Android, mas adiciona gates obrigatorios para integracao governamental futura.

Decisoes aplicadas:

- Android continua como foco do MVP;
- iPhone/iOS permanece pos-MVP;
- a proxima frente viavel apos a Frente 1.3 segue sendo anjos/convites;
- conveniados, orgaos publicos, smart cities e modulo de tornozeleira/proximidade ficam em frente futura condicionada;
- qualquer integracao governamental real depende de mesa tecnica, ACT/convênio/contrato, acordo de dados, RIPD/DPIA, homologacao, ePING/OpenAPI, RBAC/MFA, auditoria, protocolo humano de resposta e orgao competente.

Cronograma versionado:

- `docs/41_CRONOGRAMA_APP_INTEGRACAO_GOVERNO_2026-05-14.md`.

Proxima acao tecnica:

- continuar a Frente 1.3 Android preservando perfis, papeis, autorizacoes, bloqueios server-side e refinamento UX de fonte ampliada antes de fechar sem ressalvas.

## 2026-05-14 - Frente 1.3: refinamento UX de fonte ampliada

Status: correcao de codigo aplicada e validacoes locais aprovadas; validacao visual fisica pendente porque `adb devices -l` nao listou aparelho conectado.

Executado:

- `StatusBanner` recebeu line-height maior para titulo e texto;
- `SafeScreen` recebeu line-height maior em titulo, subtitulo e rodape;
- `ResourceTile` passou a permitir ate duas linhas para titulo/descricao, com menor reducao automatica e altura minima maior;
- `app/perfis.tsx` recebeu altura minima e line-height maiores nos cards de perfil.

Validacoes:

- `npm ci --ignore-scripts` restaurou dependencias locais removidas na limpeza de regeneraveis;
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run typecheck`: aprovado;
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run lint`: aprovado;
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run test:profiles`: aprovado;
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm test`: aprovado;
- `git diff --check` limitado aos arquivos alterados: aprovado.

Limite:

- nao fechar a ressalva visual Tarcila/Lina/Eliane sem nova captura em Android fisico com fonte `1.3`.

Checkpoint:

- `docs/42_REFINAMENTO_UX_FRENTE_1_3_FONTE_2026-05-14.md`.

## 2026-05-14 - Gate de login, consentimentos e permissoes

Status: ajuste de codigo aplicado, build Android aprovado, validacao fisica concluida e APK privado publicado no portal.

Executado:

- criado gate de acesso no layout raiz do app;
- o app agora bloqueia a Home e demais telas ate concluir login Google/SinalSeguro, aceite legal e permissoes essenciais;
- o build confirmou carregamento de `.env.local` com configuracoes publicas de API/Google;
- APK privado debug bundled gerado com SHA-256 `3f2d4b9ca6ba764979d4515d00712191fbda94dd0b164765e9d4ad9d70635897`.

Validacoes:

- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run typecheck`: aprovado;
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run lint`: aprovado;
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm test`: aprovado;
- `PATH=/opt/homebrew/opt/node@22/bin:$PATH npm run private:android:readiness`: aprovado;
- build Android debug bundled `arm64-v8a`: aprovado;
- `git diff --check` dos arquivos alterados: aprovado;
- instalacao fisica Android via ADB Wi-Fi: aprovado;
- login Google real no aparelho: aprovado;
- relaunch apos login mantendo acesso a Home: aprovado;
- navegacao pos-login por Home, Anjos, Convite e Perfis: aprovado;
- crash scan saneado pos-login/navegacao: sem padroes fatais.

Publicacao:

- APK Android privado publicado no portal com nome estavel `sinalseguro_android.apk`;
- QR Android mantido estavel em `/baixar/android`;
- manifesto publico atualizado em `https://www.sinalseguro.com.br/downloads/installers.json`;
- checksum publicado: `3f2d4b9ca6ba764979d4515d00712191fbda94dd0b164765e9d4ad9d70635897`;
- release EC2: `/var/www/sinalseguro/releases/20260514T185240Z`.

## 2026-05-14 - Atualizacao Android com checagem via API e download estavel

Status: codigo aplicado, APK novo gerado, portal e API de producao sincronizados; instalacao USB/ADB e validacao visual fisica desta versao final foram aprovadas manualmente no Android.

Executado:

- criado `src/services/appUpdate.ts` para consultar `GET /api/app-releases/current` com sessao autenticada e reaproveitar o estado de verificação por 24 horas;
- `app/_layout.tsx` passou a disparar checagem automática ao abrir o app;
- `app/configuracoes.tsx` ganhou o painel `Atualizacao` com `Verificar atualizacao` e `Baixar versao Android`;
- `app.json`, `package.json`, `package-lock.json` e `android/app/build.gradle` foram sincronizados para `0.1.1` e `versionCode 3`;
- `services/api/app_releases` adicionou a release Android atual com endpoint autenticado, auditoria e migration inicial;
- portal público atualizado para manter o arquivo fixo `sinalseguro_android.apk`, com checksum e versão alinhados.

Validacoes:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run build:android:private`: aprovado;
- `aapt dump badging`: aprovado com `versionCode='3'` e `versionName='0.1.1'`;
- `manage.py check` com venv temporaria em `/tmp`: aprovado;
- `manage.py makemigrations --check --dry-run` com venv temporaria em `/tmp`: aprovado;
- testes focados do endpoint `app-releases/current`: aprovados;
- `adb devices -l`: validacao manual concluida com aparelho Android reconectado;
- captura visual real do painel `Atualizacao`: aprovada manualmente;
- abertura do download no navegador do aparelho com o caminho público estável: aprovada manualmente.

Checkpoint:

- `apps/mobile/docs/45_CHECKPOINT_ATUALIZACAO_ANDROID_2026-05-14.md`.
- APK SHA-256 final: `8cab34dc0838637f7713999b56c8ba28d36fb071f02735a7836beb5cfbb91cc1`.

## 2026-05-15 - Retomada de convite entre aparelhos

Status: validacao parcial; bloqueio operacional permanece no segundo Android e no envio SMS.

Executado:

- API de producao validada com `health/ready` e banco `ok`.
- EC2 consultada com ambiente real do servico `sinalseguro-api`, sem expor dados pessoais: convites recentes estavam `pending`, contatos recentes tinham midia/localizacao bloqueadas, e auditoria de convite registrava `ip_hash` e `user_agent_hash`.
- ADB seguiu listando apenas o Android `23129RA5FL`; o segundo aparelho ainda nao apareceu como `device`.
- Google Messages abriu o rascunho do convite SMS, mas retornou falha de envio; temporarios com telefone/token foram removidos.
- Teste local Django focado em convites voltou a travar sem saida util no venv do repositorio e foi encerrado.

Proximo passo:

- Roberto precisa confirmar/reencaminhar o SMS manualmente no aparelho ou reconectar o segundo Android em ADB; depois disso, validar aceite, rejeicao de replay e mudanca de status para anjo aceito.
- Especialistas registraram que o app cria o convite seguro via API e usa o compartilhamento nativo do Android; a falha atual e operacional no Google Messages/operadora, nao evidencia falha de criacao do convite. O proximo gate deve ser fisico, em dois Androids, com evidencias saneadas e sem telefone/token/link completo.

## 2026-05-15 - SOS offline e vinculos de anjos visiveis

Status: codigo aplicado, gates locais e build Android aprovados; instalacao fisica bloqueada por ADB `offline`.

Executado:

- `AccessGate` preserva sessao local ja autenticada quando a falha e rede/indisponibilidade, limpando sessao somente em `401`;
- `apiClient` converte falha de rede em erro saneado `status=0`;
- relacionamentos de anjo/protegido passam a ter cache local criptografado em `trustedRelationshipStore`;
- aceite de convite salva imediatamente o vinculo aceito no aparelho do anjo;
- `Anjos de confianca` usa cache local e chamadas independentes para nao ocultar vinculos aceitos quando convites/contatos falharem;
- SOS inclui anjos aceitos no plano local de entrega e enfileira sincronizacao remota da ocorrencia para a EC2 quando a rede voltar;
- smoke test passou a proteger acesso offline, cache de vinculos e fila de sincronizacao.

Validacoes:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run private:android:readiness`: aprovado;
- build Android debug bundled `arm64-v8a`: aprovado;
- APK local: `android/app/build/outputs/apk/debug/app-debug.apk`;
- SHA-256: `b941cc4839639a38fb0df22a20ab6ed11e4662dac85a184ef09ccf393b926def`.

Bloqueio:

- `adb install --no-streaming` e `adb install` ficaram presos no Android `23129RA5FL`;
- apos `adb kill-server/start-server`, o aparelho passou para `offline`;
- nao publicar o APK no portal antes de reinstalar e validar fisicamente o fluxo.

Checkpoint:

- `docs/46_CHECKPOINT_OFFLINE_ANJOS_SOS_2026-05-15.md`.

## 2026-05-16 - Frente 3 SOS e roteamento para anjos

Status: primeira fatia implementada, API publicada na EC2 e APK debug instalado em um Android fisico; aceite completo em dois aparelhos ainda pendente.

Executado:

- API `emergency` ganhou fase canonica de ocorrencia e destinatarios `EmergencyRecipient`;
- `/api/emergency-sessions/` continua idempotente e agora roteia para anjos aceitos com alerta permitido, conta propria e dispositivo ativo com chave publica;
- `/api/emergency-sessions/received/` lista pedidos recebidos pelo anjo autenticado;
- `/api/emergency-sessions/{id}/respond/` permite visto, aceite, recusa e encerramento;
- aceite de uma nova ocorrencia pelo mesmo anjo encerra a anterior, preservando uma ocorrencia ativa por anjo;
- app Android ganhou tela `Alertas recebidos`, atalho no menu da Home e contrato mobile para `phase`, `recipient_count` e `recipients`;
- API publicada por `infra/aws/deploy-api.sh` com backup pre-migracao em `/opt/sinalseguro-api/backups/sinalseguro_prod_before_front3_20260516T043702Z.dump`.

Validacoes:

- `manage.py check`: aprovado;
- `manage.py test sinalseguro_api.tests.test_platform_base`: aprovado, 39 testes;
- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run build:android:debug:bundled`: aprovado;
- pos-deploy: `health`, `ready`, `sinalseguro-api`, `cereusia-crm`, `nginx -t` e hash de `cereusia.conf` aprovados;
- Android `0123456789ABCDEF`: instalacao aprovada, app abriu sem crash e gate de login/legal bloqueou corretamente acesso a `/alerta` sem sessao autenticada;
- Android `5686add7`: `adb install` e `adb install --no-streaming` ficaram presos e foram encerrados.

Checkpoint:

- `docs/51_CHECKPOINT_FRENTE_3_SOS_ROTEAMENTO_2026-05-16.md`.

## 2026-05-17 - SOS/anjo validado com retry EC2 e chamada P2P

Status: retomada validada fisicamente em dois Androids conectados.

Executado:

- Corrigido o caso em que o SOS ficava ativo apenas localmente sem sessao nova na EC2.
- A Home agora tenta sincronizar o pacote ativo com a EC2 a cada 5 segundos enquanto o SOS estiver ativo e ainda nao existir `liveRemoteSessionId`.
- O app do anjo, aberto na Home, detectou a sessao recebida em foreground e abriu `Alertas recebidos`.
- A sessao validada `3b717e39-dfd8-459c-bc15-4176f1128463` ficou `active/accepted`, com destinatario `angel/accepted`.
- A sinalizacao P2P registrou `offer`/`ice` owner->angel e `answer`/`ice` angel->owner com `senderDeviceId` e `recipientDeviceId` nos dois sentidos.
- A pessoa protegida exibiu `Anjo na chamada`; o anjo exibiu `Atendendo como anjo`.
- Encerramento final sincronizou a EC2 para `finished/ended` e destinatario `ended`.

Validacoes:

- `npm run typecheck`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm test`: aprovado.
- `npm run lint`: aprovado.
- `npm run build:android:debug:bundled`: aprovado.
- APK instalado nos dois Androids: `versionName=0.1.8`, `versionCode=10`, SHA-256 `253ca236b1e9f78d3d747d0caca18e475fdce937dd86dd5be8ae49e7b1062c49`.

Checkpoint:

- `docs/57_CHECKPOINT_F4_3_RECEBIMENTO_CHAMADA_REGISTRO_2026-05-16.md`.

## 2026-05-18 - Etapa 1.15 validacao Android das policies Home/SOS

Status: validacao fisica Android concluida em dois aparelhos; sem publicacao de release.

Executado:

- Dois Androids fisicos foram confirmados no ADB: `0123456789ABCDEF` (`armeabi-v7a`) e `5686add7` (`arm64-v8a`), tratando o transporte Wi-Fi/mDNS duplicado do Redmi como o mesmo aparelho.
- Gates pre-build aprovados: `typecheck`, `lint`, `npm test` e readiness Android privado condicionado pela pendencia ambiental conhecida de Node local `20.16.0` para release publica.
- Build multi-ABI falhou por falta de espaco em `stripDebugDebugSymbols`; a validacao seguiu com builds separados por ABI.
- APK `armeabi-v7a`: `BUILD SUCCESSFUL`, SHA-256 `01be88bec3e3bad7e142799dfa176201d557730408a09cf393b34ebb99185538`, instalado no Android 32-bit.
- APK `arm64-v8a`: `BUILD SUCCESSFUL`, SHA-256 `131d8a96a60590e91811f85696539a5e8a296087e424fcf044c9e145d4b49961`, instalado no Redmi 64-bit.
- Ambos confirmaram `versionName=0.1.15` e `versionCode=17`.
- Redmi abriu diretamente na Home SOS; Android 32-bit demorou cerca de 55s, mas chegou na Home SOS.
- Crash buffer vazio nos dois aparelhos; sem `FATAL EXCEPTION`, ANR, `TypeError` ou `ReferenceError` nos recortes filtrados.
- Evidencia leve de performance: Redmi com jank baixo no recorte (`2.06%`), Android 32-bit com jank/startup mais pesado (`23.71%` apos estabilizacao), mantendo o aparelho 32-bit como sentinela de performance.
- Logs, screenshots, APKs e meminfo brutos ficaram fora do Git.

Checkpoint:

- `docs/87_CHECKPOINT_VALIDACAO_ANDROID_ETAPA_1_15_POLICIES_HOME_SOS_2026-05-18.md`.

## 2026-05-18 - Etapa 1.16 politica pura de limpeza da chamada ao vivo

Status: refatoracao pura implementada, validada e sem publicacao de release.

Executado:

- Criado `src/features/emergency-home/liveCallCleanupPolicy.ts` para decidir quando limpar estado de chamada ao vivo sem pacote operacional.
- `app/index.tsx` preserva os efeitos reais: limpar refs de autochamada, limpar `liveRemoteSessionId`, resetar chamada idle ou parar chamada ativa/orfa.
- Criado `scripts/live-call-cleanup-policy.test.ts` e script `npm run test:live-call-cleanup`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura para evitar regressao para regra inline.
- Validacoes aprovadas: teste focado, smoke-test, `typecheck`, `lint`, `npm test`, readiness Android privado condicionado e `git diff --check`.
- Varredura dirigida de seguranca nao encontrou novo token, `Authorization`, `id_token`, `encrypted_key`, SDP/ICE, URI/path de midia, payload P2P ou endpoint.
- Sem build Android nesta fatia porque nao houve mudanca operacional de UX, camera, WebRTC, gravacao, backend ou portal.

Checkpoint:

- `docs/88_CHECKPOINT_ETAPA_1_16_LIVE_CALL_CLEANUP_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.17 politica pura de solicitacao de encerramento

Status: refatoracao pura implementada, validada e sem publicacao de release.

Executado:

- Criado `src/features/emergency-home/finishRequestPolicy.ts` para decidir se a Home ignora a solicitacao de encerramento, abre confirmacao por codigo ou finaliza direto.
- `app/index.tsx` preserva os efeitos reais: limpar formulario de codigo, abrir modal e chamar `handleFinishActiveCall()`.
- Criado `scripts/finish-request-policy.test.ts` e script `npm run test:finish-request`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura para evitar regressao para regra inline.
- Validacoes aprovadas: teste focado, smoke-test, `typecheck`, `lint`, `npm test`, readiness Android privado condicionado e `git diff --check`.
- Varredura dirigida de seguranca nao encontrou novo token, `Authorization`, `id_token`, `encrypted_key`, SDP/ICE, URI/path de midia, payload P2P ou endpoint.
- Sem build Android nesta fatia porque nao houve mudanca operacional de UX, camera, WebRTC, gravacao, backend ou portal.

Checkpoint:

- `docs/89_CHECKPOINT_ETAPA_1_17_FINISH_REQUEST_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.18 politica pura de inicio do SOS

Status: refatoracao pura implementada, validada e sem publicacao de release.

Executado:

- Criado `src/features/emergency-home/emergencyStartPolicy.ts` para decidir a politica inicial do pacote SOS, captura de localizacao, modo de consentimento, atalho telefonico emergencial e mensagem inicial do chamado.
- `app/index.tsx` preserva os efeitos reais: listar relacionamentos, criar pacote local, abrir discador quando permitido, sincronizar backend, registrar auditoria saneada e atualizar estados visuais.
- Criado `scripts/emergency-start-policy.test.ts` e script `npm run test:emergency-start`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura para evitar regressao para regra inline.
- Validacoes aprovadas: teste focado, smoke-test, `typecheck`, `lint`, `npm test`, readiness Android privado condicionado e `git diff --check`.
- Varredura dirigida de seguranca nao encontrou novo token, `Authorization`, `id_token`, `encrypted_key`, SDP/ICE, URI/path de midia, payload P2P ou endpoint.
- Sem build Android nesta fatia porque nao houve mudanca operacional de UX, camera, WebRTC, gravacao, backend ou portal.

Checkpoint:

- `docs/90_CHECKPOINT_ETAPA_1_18_EMERGENCY_START_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.19 politica pura de settlement da parada de midia

Status: refatoracao pura implementada, validada e sem publicacao de release.

Executado:

- Ampliado `src/features/emergency-home/mediaProcessingStatusPolicy.ts` para decidir tratamento do retorno do gravador: serial valido, midia anexada, refresh do outbox, status de video preservado e modal final.
- `app/index.tsx` preserva os efeitos reais: resolver waiter, registrar auditoria saneada, atualizar outbox/status/modal e concluir promessa pendente.
- `scripts/media-processing-status-policy.test.ts` passou a cobrir settlement da parada de midia.
- `scripts/smoke-test.mjs` passou a exigir a policy pura para evitar regressao para regra inline.
- Validacoes aprovadas: teste focado, smoke-test, `typecheck`, `lint`, `npm test`, readiness Android privado condicionado e `git diff --check`.
- Sem build Android nesta fatia porque nao houve mudanca operacional de UX, camera, WebRTC, gravacao, backend ou portal.

Checkpoint:

- `docs/91_CHECKPOINT_ETAPA_1_19_MEDIA_STOP_SETTLEMENT_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.20 politica pura de confirmacao de encerramento por codigo

Status: refatoracao pura implementada, validada e sem publicacao de release.

Executado:

- Criado `src/features/emergency-home/finishCodePolicy.ts` para decidir se a confirmacao de encerramento por codigo finaliza o chamado ou mostra erro mantendo o chamado ativo.
- `app/index.tsx` preserva os efeitos reais: chamar `verifySecurityCodeStatus()`, atualizar `finishError` e chamar `handleFinishActiveCall()`.
- Criado `scripts/finish-code-policy.test.ts` e script `npm run test:finish-code`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura para evitar regressao para regra inline.
- Validacoes aprovadas: teste focado, smoke-test, `typecheck`, `lint`, `npm test`, readiness Android privado condicionado e `git diff --check`.
- Sem build Android nesta fatia porque nao houve mudanca operacional de UX, camera, WebRTC, gravacao, backend ou portal.

Checkpoint:

- `docs/92_CHECKPOINT_ETAPA_1_20_FINISH_CODE_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.21 politica pura de rota protegida por codigo

Status: refatoracao pura implementada, validada e sem publicacao de release.

Executado:

- Criado `src/features/emergency-home/protectedRouteCodePolicy.ts` para decidir se a rota protegida deve ser ignorada, bloquear com erro ou liberar acesso e navegar.
- `app/index.tsx` preserva os efeitos reais: chamar `verifySecurityCodeStatus()`, atualizar erro, limpar campos, chamar `unlockProtectedAccess()` e navegar.
- Criado `scripts/protected-route-code-policy.test.ts` e script `npm run test:protected-route-code`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura para evitar regressao para regra inline.
- Validacoes aprovadas: teste focado, smoke-test, `typecheck`, `lint`, `npm test`, readiness Android privado condicionado e `git diff --check`.
- Sem build Android nesta fatia porque nao houve mudanca operacional de UX, camera, WebRTC, gravacao, backend ou portal.

Checkpoint:

- `docs/93_CHECKPOINT_ETAPA_1_21_PROTECTED_ROUTE_CODE_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.22 validacao Android da consolidacao Home/SOS

Status: consolidacao fisica Android aprovada para as policies puras das etapas 1.20 e 1.21.

Executado:

- Build debug bundled multi-ABI gerado apos limpeza de duplicatas regeneraveis em `node_modules/*/android/build`.
- APK local de QA instalado nos dois Androids fisicos: `0123456789ABCDEF` (`armeabi-v7a`) e `5686add7` (`arm64-v8a`).
- Ambos confirmaram `versionName=0.1.15` e `versionCode=17`.
- Home/SOS abriu nos dois aparelhos com identidade visual preservada: `SinalSeguro`, `MODO DISCRETO`, botao `SOS`, estado `Pronto para pedir ajuda` e botoes `Policia`, `Bombeiros` e `SAMU`.
- Logs filtrados nao apresentaram crash, ANR, erro React Native nao tratado ou excecao fatal.
- Evidencias brutas locais ficaram fora do Git; somente resumo saneado foi versionado.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: aprovado condicionado pela pendencia conhecida de Node local para release publica.
- `git diff --check`: aprovado.
- Build Android debug bundled: aprovado.
- ADB install/reinstall: aprovado nos dois aparelhos.
- Startup observado: `WaitTime=9374ms` no Android 32-bit e `WaitTime=2898ms` no Redmi 64-bit.
- `gfxinfo` em tela estavel: 21,27% janky no Android 32-bit e 0,60% janky no Redmi 64-bit.

Checkpoint:

- `docs/94_CHECKPOINT_VALIDACAO_ANDROID_ETAPA_1_22_CONSOLIDACAO_POLICIES_HOME_SOS_2026-05-18.md`.

## 2026-05-18 - Etapa 1.23 politica pura do painel de chamada ao vivo

Status: refatoracao pura implementada, validada e sem publicacao de release.

Executado:

- Criado `src/features/emergency-home/liveCallPanelPolicy.ts` para decidir exibicao do painel, faixa de status, afastamento do recorder e bloqueio do botao primario.
- `app/index.tsx` preserva os efeitos reais de WebRTC, chamada, camera, gravacao e auditoria; somente consulta a policy para renderizacao/entrada.
- Criado `scripts/live-call-panel-policy.test.ts` e script `npm run test:live-call-panel`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura para evitar regressao para regra inline.
- Validacoes aprovadas: teste focado, smoke-test, `typecheck`, `lint`, `npm test`, readiness Android privado condicionado e `git diff --check`.
- Sem build Android nesta fatia porque nao houve mudanca operacional de UX nativa, camera, WebRTC, gravacao, backend ou portal.

Checkpoint:

- `docs/95_CHECKPOINT_ETAPA_1_23_LIVE_CALL_PANEL_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.24 politica pura de mensagens do pacote SOS local

Status: refatoracao pura implementada, validada e sem publicacao de release.

Executado:

- Criado `src/features/emergency-home/localSosPackageStatusPolicy.ts` para centralizar mensagens do estado local do pacote SOS.
- `app/index.tsx` preserva os efeitos reais de inicio, recuperacao, chamada ao vivo, preservacao, encerramento e erro; somente consulta a policy para textos recorrentes.
- Criado `scripts/local-sos-package-status-policy.test.ts` e script `npm run test:local-sos-package-status`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura para evitar regressao para mensagens inline na Home.
- Validacoes aprovadas: teste focado, smoke-test, `typecheck`, `lint`, `npm test`, readiness Android privado condicionado e `git diff --check`.
- Sem build Android nesta fatia porque nao houve mudanca operacional de camera, WebRTC, gravacao, storage, backend ou portal.

Checkpoint:

- `docs/96_CHECKPOINT_ETAPA_1_24_LOCAL_SOS_PACKAGE_STATUS_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.25 politica pura de confirmacao de ligacao emergencial

Status: refatoracao pura implementada, validada e sem publicacao de release.

Executado:

- Criado `src/features/emergency-home/emergencyCallConfirmationPolicy.ts` para centralizar titulo, mensagem e labels do modal de ligacao emergencial.
- `app/index.tsx` preserva o efeito real de `Linking.openURL(target.callUri)` e apenas consulta a policy para apresentacao.
- Criado `scripts/emergency-call-confirmation-policy.test.ts` e script `npm run test:emergency-call-confirmation`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura para evitar regressao para regra inline.
- Validacoes aprovadas: teste focado, smoke-test, `typecheck`, `lint`, `npm test`, readiness Android privado condicionado e `git diff --check`.
- Sem build Android nesta fatia porque nao houve mudanca operacional de UX nativa, chamada real, camera, WebRTC, gravacao, backend ou portal.

Checkpoint:

- `docs/97_CHECKPOINT_ETAPA_1_25_EMERGENCY_CALL_CONFIRMATION_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.26 politica pura de acesso inicial a rotas protegidas

Status: refatoracao pura implementada, validada e sem publicacao de release.

Executado:

- Criado `src/features/emergency-home/protectedRouteAccessPolicy.ts` para decidir entre navegar direto ou solicitar codigo de seguranca.
- `app/index.tsx` preserva a verificacao real em `isProtectedAccessUnlocked()`, o desbloqueio em `unlockProtectedAccess()` e a navegacao final.
- Criado `scripts/protected-route-access-policy.test.ts` e script `npm run test:protected-route-access`.
- `scripts/smoke-test.mjs` passou a exigir a policy pura para evitar regressao para regra inline.
- Validacoes aprovadas: teste focado, smoke-test, `typecheck`, `lint`, `npm test`, readiness Android privado condicionado e `git diff --check`.
- Sem build Android nesta fatia porque nao houve mudanca operacional de UX nativa, criptografia, storage, camera, WebRTC, gravacao, backend ou portal.

Checkpoint:

- `docs/98_CHECKPOINT_ETAPA_1_26_PROTECTED_ROUTE_ACCESS_POLICY_2026-05-18.md`.

## 2026-05-18 - Validacao fisica dois Androids SOS/anjo

Status: validado fisicamente em dois Androids distintos com Android `0.1.15`.

Executado:

- ADB mostrou dois Androids reais distintos: `0123456789ABCDEF` e `5686add7`; a entrada Wi-Fi/mDNS do Redmi foi ignorada como transporte duplicado.
- Ambos os aparelhos estavam com `versionName=0.1.15` e `versionCode=17`.
- A simulacao de pressao longa por ADB nao foi considerada evidencia confiavel para o `PanicButton`; o acionamento foi validado por toque fisico real.
- O Android `0123456789ABCDEF` acionou o SOS e exibiu `VOCE PEDIU AJUDA` / `Transmitindo ao anjo`.
- O Android `5686add7` recebeu o chamado em `Alertas recebidos`, exibiu `Voce e anjo de Roberto Dantas Castro`, `Acompanhando SOS` e video com rotulo `Pessoa protegida`.
- A chamada foi encerrada; o solicitante encerrou o SOS e exibiu `Video protegido 100%`, com retorno para Home em `SOS` e mensagem `Chamado encerrado. Video preservado no cofre local`.
- O anjo exibiu o pedido como `Encerrado` e manteve registro local finalizado com snapshot e duracao.

Limite:

- Esta subetapa validou app/dispositivos. A auditoria media na EC2/API ainda deve confirmar sessao, destinatario, sinais, encerramento e ausencia de midia bruta no backend antes de publicar como release final.

Checkpoint:

- `docs/77_CHECKPOINT_VALIDACAO_FISICA_DOIS_ANDROIDS_SOS_ANJO_2026-05-18.md`.

## 2026-05-18 - Android 0.1.15 rebuild e instalacao unilateral

Status: APK privado recompilado e instalado em um Android fisico; validacao SOS/anjo fim a fim segue bloqueada por ausencia do segundo Android no ADB.

Executado:

- `../../scripts/gerar-aplicativo.sh privado --overwrite --install`.
- Gates `typecheck`, `lint`, `npm test`, build Android privado e readiness Android privado aprovados.
- APK local preservado em `distribution/android/out/sinalseguro-android.apk`, SHA-256 `b4f58d1d322a890da5dab0e717d0c81ceb4fb897fb91ef96ae34522b2e1c664c`.
- Instalacao ADB aprovada em `br.com.sinalseguro.app` com `versionName=0.1.15`, `versionCode=17` e `lastUpdateTime=2026-05-18 07:07:46`.
- Validacao visual unilateral confirmou Home/SOS pronta em modo discreto.
- Build consumiu espaco local ate cerca de `361 MiB`; regeneraveis Android foram limpos novamente e o disco voltou para cerca de `2.9 GiB`, preservando o APK final.

Checkpoint:

- `docs/75_CHECKPOINT_ANDROID_0_1_15_REBUILD_INSTALACAO_UNILATERAL_2026-05-18.md`.

## 2026-05-18 - Gate dois Androids bloqueado por duplicidade ADB

Status: Roberto informou dois Androids conectados, mas ADB confirmou apenas um aparelho fisico exposto por USB e Wi-Fi/mDNS.

Executado:

- `adb devices -l` mostrou duas entradas com o mesmo aparelho.
- Confirmado mesmo `serialno`, mesmo modelo, mesmo `android_id` e mesmo IP interno.
- Barramento USB do macOS mostrou apenas um Android/Redmi.
- ADB foi reiniciado e a conexao Wi-Fi duplicada foi limpa; restou um Android real visivel.
- App visivel segue instalado em `versionName=0.1.15`, `versionCode=17`.

Decisao:

- Nao executar SOS/anjo com duas entradas que representam o mesmo aparelho.
- Gate fim a fim segue bloqueado ate o segundo Android aparecer com identificador distinto.

Checkpoint:

- `docs/76_CHECKPOINT_GATE_DOIS_ANDROIDS_BLOQUEADO_DUPLICIDADE_ADB_2026-05-18.md`.

## 2026-05-17 - Android 0.1.13 video local protegido no SOS ao vivo

Status: APK privado `0.1.13` publicado no portal/API de update; fluxo fisico principal validado em dois Androids.

Executado:

- Android sincronizado para `versionName=0.1.13` e `versionCode=15`.
- App passou a preservar video local cifrado da chamada ao vivo do solicitante em `.nseg`.
- Encerramento do SOS passou a aguardar `finish` remoto explicito para nao deixar sessao ativa na EC2.
- Modal final `Video protegido` teve o botao `Continuar` validado visualmente.
- UX de queda foi ajustada para mostrar confirmacao central pendente se a API falhar no encerramento remoto.
- Portal/API publicados com link estavel `sinalseguro_android.apk` e cache-buster `0.1.13-20260517T203152Z`.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `git diff --check`: aprovado.
- `npm run build:android:debug:bundled`: aprovado.
- `aapt dump badging`: `versionCode='15'`, `versionName='0.1.13'`.
- APK SHA-256 `7b9c6f110313ade8b4740200edbf77cdbe0e92b5654ecd5aaf42a8d8f08e8bae`.
- Dois Androids fisicos atualizados para `0.1.13`.
- Rodada fisica do fluxo confirmou anjo vendo video da pessoa protegida, solicitante transmitindo ao anjo, `.nseg` local preservado e backend final com `active_sessions=0`, `active_live_envelopes=0`, `open_signals=0`.
- API EC2 publicada com migration de update, `sinalseguro-api` e `cereusia-crm` ativos, `nginx -t` aprovado e health/ready publicos 200.
- Portal publicado em `/var/www/sinalseguro/releases/20260517T205023Z`, com rollback anterior preservado em `20260517T183651Z`.
- Download real do APK publicado confirmou SHA-256 `7b9c6f110313ade8b4740200edbf77cdbe0e92b5654ecd5aaf42a8d8f08e8bae`.

Checkpoint:

- `docs/60_CHECKPOINT_ANDROID_0_1_13_SOS_AO_VIVO_VIDEO_LOCAL_2026-05-17.md`.

## 2026-05-17 - Android 0.1.12 auditoria media do SOS ao vivo

Status: APK privado `0.1.12` publicado no portal/API de update apos validacao fisica em dois Androids.

Executado:

- Android sincronizado para `versionName=0.1.12` e `versionCode=14`.
- Backend/API recebeu marcador saneado de auditoria da chamada ao vivo em `/api/emergency-sessions/{id}/audit-marker/`.
- Marcadores de auditoria registram papel, estado, dispositivo e hash de `callSessionId`, sem SDP, ICE, payload livre, token, caminho local ou midia.
- App Android registra eventos de handoff, offer, answer, conexao, falha, encerramento e evidencia local.
- Solicitante passou a manter registro local cifrado de evidencia operacional do SOS ao vivo, separado do historico do anjo.
- Home passou a exibir faixa persistente com estado real do chamado, incluindo gravacao, transmissao, protecao e pacote sem video quando a camera e entregue ao WebRTC.
- Tela do anjo deixa de exibir painel ativo quando o backend ja encerrou a ocorrencia; cards encerrados usam texto de consulta e botao `Encerrado`.
- API de update publicada com Android `0.1.12`/`versionCode 14`; portal manteve o nome estavel `sinalseguro_android.apk`.

Validacoes:

- `npm run typecheck`: aprovado.
- `npm run test:live-call-history`: aprovado.
- `npm test`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado condicionado pela pendencia conhecida de Node local para release publica.
- API: `python manage.py check`, `python manage.py test sinalseguro_api.tests` com 49 testes e `makemigrations --check --dry-run` aprovados.
- Build Android debug bundled aprovado; APK final SHA-256 `f0e607ad0c36110653279687a776bdf3dd72a3e90f9322ea7d03041e47e1a8f7`.
- ADB confirmou `versionName=0.1.12`/`versionCode=14` nos dois Androids.
- Teste fisico: owner com `local_stream audio=1 video=1`, anjo com `remote_stream_track audio=1 video=1`, WebRTC/ICE conectado e primeiro frame renderizado.
- Backend producao confirmou sessao de teste `finished`/`ended`, marcadores de auditoria media saneados e ausencia de SDP/ICE/midia bruta na auditoria permanente.
- Portal publicado em `/var/www/sinalseguro/releases/20260517T183651Z`; manifesto, API de update, pagina `/baixar/android`, APK e hash foram conferidos.

Checkpoint:

- `docs/59_CHECKPOINT_ANDROID_0_1_12_AUDITORIA_MEDIA_SOS_AO_VIVO_2026-05-17.md`.

## 2026-05-17 - Android 0.1.11 release privada e teste SOS ao vivo

Status: release privada preparada para portal/API; SOS ao vivo validado em dois Androids; gravacao audiovisual local completa da chamada ao vivo segue pendente.

Executado:

- Android elevado para `versionName=0.1.11` e `versionCode=13`.
- APK privado debug bundled gerado com SHA-256 `2196c90158d6a521bc6f8f1bf9f78f922ba6dc264394544f512acc9222889145`.
- APK instalado no Android USB `armeabi-v7a` e no Android Wi-Fi `arm64-v8a`.
- Camera padrao do SOS local migrada para traseira e handoff para WebRTC ampliado para 12s.
- EC2/API e dispositivos foram limpos de sessoes, sinais, envelopes e arquivos efemeros antes dos testes, preservando auditoria, login, permissoes e vinculos.
- Teste fisico confirmou solicitante transmitindo ao anjo, anjo vendo `Pessoa protegida`, WebRTC conectado e renderizando frames.
- Backend confirmou sessao ativa/aceita, envelope `live_session`, sinais `offer`/`answer`/`ice` e encerramento sem sinais pendentes.
- Observacao tecnica: o solicitante ainda encerrou com pacote local sem arquivo de video quando a camera foi entregue ao WebRTC; o anjo manteve registro seguro local.

Validacoes:

- `npm run typecheck`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test -- --runInBand`: aprovado.
- `npm run private:android:readiness`: aprovado com pendencia conhecida de Node local para build privado debug.
- Build Android privado aprovado; `aapt dump badging` confirmou `versionCode 13`, `versionName 0.1.11` e ABIs `arm64-v8a`/`armeabi-v7a`.
- API/portal publicados na EC2; endpoint de atualizacao retorna `0.1.11`/`versionCode 13`, URL com cache-buster `0.1.11-20260517T121152Z` e SHA-256 `2196c90158d6a521bc6f8f1bf9f78f922ba6dc264394544f512acc9222889145`.
- Download publico do APK validado com `130889547` bytes e SHA-256 correto; `installers.json`, `checksums.txt`, Nginx, `sinalseguro-api` e `cereusia-crm` aprovados.
- Limpeza final para nova rodada manual: dispositivos sem historico local de chamados/convites antigos/chamadas ao vivo; EC2/API com `sessions=0`, `recipients=0`, `envelopes=0`, `signals=0`, preservando auditoria, logins, perfis e vinculos aceitos.

Checkpoint:

- `docs/58_CHECKPOINT_ANDROID_0_1_11_SOS_AO_VIVO_RELEASE_2026-05-17.md`.

## 2026-05-17 - Hardening visual da Home apos chamada

Status: implementado, buildado e instalado nos dois Androids.

Executado:

- Home limpa `liveRemoteSessionId` e estado WebRTC local quando nao ha SOS ativo, inicializacao, encerramento ou midia pendente.
- O card `Chamada com anjo` agora so aparece na Home quando existe SOS ativo relacionado.
- Validacao visual no Android USB mostrou a Home limpa com botao `SOS`, sem card residual.
- EC2 conferida com `0` sessoes ativas apos a instalacao.

Validacoes:

- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm test`: aprovado.
- `npm run lint`: aprovado.
- `npm run build:android:debug:bundled`: aprovado.
- APK instalado nos dois Androids, SHA-256 `475a462efeceead71baab0de7551e05aa8f8dacce895bd9e0c47528f7b334335`.

Observacao:

- Segundo Android abriu no gate de login apos reinstalacao; antes do proximo teste completo de anjo, refazer login no aparelho.

## 2026-05-17 - Video SOS transmitido do solicitante para o anjo

Status: corrigido e validado fisicamente em dois Androids.

Executado:

- Confirmado em log que o WebRTC ja entregava ao anjo `remote_stream_track audio=1 video=1`; a falha restante era renderizacao do painel.
- `useLiveAudioCall` passou a preservar `remoteStream` e `remoteStreamUrl` quando o anjo recebe `ontrack`, evitando sobrescrita por estados posteriores de aceite/entrada.
- `LiveAudioCallPanel` passou a renderizar o `RTCView` por URL estavel do stream remoto.
- O build Android local passou a respeitar `reactNativeArchitectures` tambem no filtro NDK, permitindo APK fisico `armeabi-v7a` para o aparelho USB antigo sem publicar esse artefato como release.

Validacoes:

- `npm run typecheck`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test -- --runInBand`: aprovado.
- Build Android debug bundled local aprovado com `-PreactNativeArchitectures=armeabi-v7a`.
- APK instalado nos dois Androids: `versionName=0.1.8`, `versionCode=10`, SHA-256 `32cd04e6ba9859cfd9df23234911d8e44f66dadd2261c2c75bbf01c13aa40a40`.
- Owner USB transmitiu o SOS; anjo Wi-Fi exibiu o video remoto com rotulo `Pessoa protegida`.
- EC2 apos o teste final: `0` sessoes ativas; sessao de validacao `9228ecac-1bb6-473d-ac95-4b4eeec9935c` encerrada como `finished/ended`.

Checkpoint:

- `docs/57_CHECKPOINT_F4_3_RECEBIMENTO_CHAMADA_REGISTRO_2026-05-16.md`.

## 2026-05-18 - Etapa 1.27 progresso de recuperacao interrompida Home/SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `interruptedRecoveryProgressPolicy` para centralizar as mensagens de progresso da recuperacao de chamado interrompido e de residuo temporario privado.
- `app/index.tsx` manteve os efeitos reais de recuperacao, criptografia, cofre local e auditoria saneada.
- `npm test` passou a executar `test:interrupted-recovery-progress`.

Validacoes:

- `test:interrupted-recovery-progress`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado e `git diff --check`: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/99_CHECKPOINT_ETAPA_1_27_INTERRUPTED_RECOVERY_PROGRESS_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.28 progresso de encerramento Home/SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishFlowProgressPolicy` para centralizar mensagens de progresso do encerramento, parada da camera, protecao da midia, sincronizacao remota e falha.
- `app/index.tsx` manteve os efeitos reais de camera, WebRTC, cofre local, fila de sincronizacao e backend.
- `npm test` passou a executar `test:finish-flow-progress`.

Validacoes:

- `test:finish-flow-progress`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado e `git diff --check`: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/100_CHECKPOINT_ETAPA_1_28_FINISH_FLOW_PROGRESS_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.29 modal de consentimento de gravacao Home/SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `recordingConsentDialogPolicy` para centralizar titulo, mensagem e labels do modal de consentimento de gravacao.
- `app/index.tsx` manteve o efeito real de navegar para `/configuracoes` quando o usuario abre os termos.
- `npm test` passou a executar `test:recording-consent-dialog`.

Validacoes:

- `test:recording-consent-dialog`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/101_CHECKPOINT_ETAPA_1_29_RECORDING_CONSENT_DIALOG_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.30 modal de falha ao iniciar chamado Home/SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `emergencyStartFailureDialogPolicy` para centralizar titulo, mensagem e label do modal de falha ao iniciar chamado.
- `app/index.tsx` manteve os efeitos reais de limpar pacote ativo, registrar status de falha e preservar logs saneados.
- `npm test` passou a executar `test:emergency-start-failure-dialog`.

Validacoes:

- `test:emergency-start-failure-dialog`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/102_CHECKPOINT_ETAPA_1_30_EMERGENCY_START_FAILURE_DIALOG_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.31 dialogo de rota protegida Home/SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `protectedRouteDialogPolicy` para centralizar titulo, mensagem, labels, placeholder e accessibility label do dialogo de rota protegida.
- `app/index.tsx` manteve os efeitos reais de verificacao criptografica, lockout, desbloqueio e navegacao.
- `npm test` passou a executar `test:protected-route-dialog`.

Validacoes:

- `test:protected-route-dialog`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/103_CHECKPOINT_ETAPA_1_31_PROTECTED_ROUTE_DIALOG_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.32 dialogo de encerramento por codigo Home/SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishConfirmationDialogPolicy` para centralizar titulo, mensagem, labels, placeholder e accessibility label do dialogo de encerramento por codigo.
- `app/index.tsx` manteve os efeitos reais de confirmacao, verificacao criptografica e encerramento do chamado.
- `npm test` passou a executar `test:finish-confirmation-dialog`.

Validacoes:

- `test:finish-confirmation-dialog`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/104_CHECKPOINT_ETAPA_1_32_FINISH_CONFIRMATION_DIALOG_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.33 dialogo de chamada aguardando anjo Home/SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `liveCallWaitingDialogPolicy` para centralizar titulo, mensagem e label do dialogo exibido quando ainda nao ha sessao remota para chamar anjo.
- `app/index.tsx` manteve os efeitos reais de preparar midia e iniciar WebRTC quando existe sessao remota.
- `npm test` passou a executar `test:live-call-waiting-dialog`.

Validacoes:

- `test:live-call-waiting-dialog`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/105_CHECKPOINT_ETAPA_1_33_LIVE_CALL_WAITING_DIALOG_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.34 atividade visual e wake lock Home/SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `emergencyHomeActivityPolicy` para centralizar decisao de wake lock, estado visual ativo e faixa ativa/inativa de status.
- `app/index.tsx` manteve os componentes reais `EmergencyRecordingWakeLock`, `EmergencyTopBar`, `BrandBackground`, `PanicButton` e status band.
- `npm test` passou a executar `test:emergency-home-activity`.

Validacoes:

- `test:emergency-home-activity`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/106_CHECKPOINT_ETAPA_1_34_EMERGENCY_HOME_ACTIVITY_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.35 acessibilidade do numero emergencial Home/SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `emergencyCallHeroPolicy` para centralizar `accessibilityHint` e `accessibilityLabel` do numero emergencial no modal de chamada.
- `app/index.tsx` manteve o componente visual `CallNumberHero` e o efeito real de discagem.
- `npm test` passou a executar `test:emergency-call-hero`.

Validacoes:

- `test:emergency-call-hero`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/107_CHECKPOINT_ETAPA_1_35_EMERGENCY_CALL_HERO_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.36 dialogo de progresso do encerramento Home/SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishProgressDialogPolicy` para centralizar progresso normalizado, possibilidade de fechar, icone/tonalidade e labels do dialogo de progresso.
- `app/index.tsx` manteve o componente `FinishProgressDialog`, tema visual e callbacks reais de continuar/abrir cofre.
- `npm test` passou a executar `test:finish-progress-dialog`.

Validacoes:

- `test:finish-progress-dialog`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/108_CHECKPOINT_ETAPA_1_36_FINISH_PROGRESS_DIALOG_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.37 estado do progresso de encerramento Home/SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishProgressStatePolicy` para centralizar estado inicial, merge/clamp de progresso, fechamento permitido e ocultacao ao abrir o cofre.
- `app/index.tsx` manteve os efeitos reais de encerramento, callbacks do modal, cofre local, midia, backend e WebRTC.
- `npm test` passou a executar `test:finish-progress-state`.

Validacoes:

- `test:finish-progress-state`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/109_CHECKPOINT_ETAPA_1_37_FINISH_PROGRESS_STATE_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.38 navegacao da Home/SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `homeNavigationPolicy` para centralizar a decisao entre rota simples e abertura de `/arquivos` com painel.
- `app/index.tsx` manteve o efeito real de fechar menu e chamar `router.push()`.
- `npm test` passou a executar `test:home-navigation`.

Validacoes:

- `test:home-navigation`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- ADB confirmou os Androids conectados, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/110_CHECKPOINT_ETAPA_1_38_HOME_NAVIGATION_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.39 estado de midia pendente Home/SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `mediaStopPendingPolicy` para centralizar a decisao de marcar midia pendente e limpar `mediaRecorderPackageId` apenas quando a liberacao real exige.
- `app/index.tsx` manteve os efeitos reais de refs, estado React e preservacao do pacote local.
- `npm test` passou a executar `test:media-stop-pending`.

Validacoes:

- `test:media-stop-pending`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/111_CHECKPOINT_ETAPA_1_39_MEDIA_STOP_PENDING_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.40 payload de auditoria owner da chamada ao vivo

Status: refatoracao pura implementada e validada.

Executado:

- Criada `ownerLiveAuditMarkerPolicy` para centralizar o payload de auditoria local do solicitante com `role: owner`.
- `app/index.tsx` manteve o efeito real de obter device id e chamar `recordLiveAuditMarker()`.
- `npm test` passou a executar `test:owner-live-audit-marker`.

Validacoes:

- `test:owner-live-audit-marker`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- ADB confirmou os Androids conectados, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/112_CHECKPOINT_ETAPA_1_40_OWNER_LIVE_AUDIT_MARKER_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.41 waiter de liberacao de midia para chamada ao vivo

Status: refatoracao pura implementada e validada.

Executado:

- Criada `mediaReleaseWaiterPolicy` para centralizar a decisao de resolver requisicao anterior e payload de timeout de liberacao de midia.
- `app/index.tsx` manteve os efeitos reais de timer, promise, ref e log operacional.
- `npm test` passou a executar `test:media-release-waiter`.

Validacoes:

- `test:media-release-waiter`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/113_CHECKPOINT_ETAPA_1_41_MEDIA_RELEASE_WAITER_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.42 waiter de parada do recorder

Status: refatoracao pura implementada e validada.

Executado:

- Criada `mediaStopWaiterPolicy` para centralizar resolucao de requisicao anterior, resultado de erro controlado e payload de timeout de parada do recorder.
- `app/index.tsx` manteve os efeitos reais de timer, promise, ref, log operacional e ordem de parada antes de finalizar pacote.
- `npm test` passou a executar `test:media-stop-waiter`.

Validacoes:

- `test:media-stop-waiter`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- ADB confirmou os Androids conectados, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/114_CHECKPOINT_ETAPA_1_42_MEDIA_STOP_WAITER_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.43 sinalizacao de parada do recorder

Status: refatoracao pura implementada e validada.

Executado:

- Criada `mediaStopSignalPolicy` para centralizar a decisao de sinalizar stop, incrementar serial e preparar payload de log.
- `app/index.tsx` manteve os efeitos reais de ref, log operacional, estado React e retorno do serial.
- `npm test` passou a executar `test:media-stop-signal`.

Validacoes:

- `test:media-stop-signal`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/115_CHECKPOINT_ETAPA_1_43_MEDIA_STOP_SIGNAL_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.44 settlement da pending request de parada do recorder

Status: refatoracao pura implementada e validada.

Executado:

- Criada `mediaStopSettlementRequestPolicy` para centralizar payload de settlement e decisao de resolver pending request por serial.
- `app/index.tsx` manteve os efeitos reais de log, `clearTimeout`, limpeza de ref e `pendingRequest.resolve(result)`.
- `npm test` passou a executar `test:media-stop-settlement-request`.

Validacoes:

- `test:media-stop-settlement-request`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- ADB confirmou os Androids conectados, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/116_CHECKPOINT_ETAPA_1_44_MEDIA_STOP_SETTLEMENT_REQUEST_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.45 guarda inicial do encerramento ativo

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishActiveCallStartPolicy` para centralizar a guarda de inicio do encerramento, selecao da sessao remota e decisao de midia entregue a chamada ao vivo.
- `app/index.tsx` manteve os efeitos reais de evidencia ao vivo, chamada, refs, estado React, backend, cofre e auditoria.
- `npm test` passou a executar `test:finish-active-call-start`.

Validacoes:

- `test:finish-active-call-start`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/117_CHECKPOINT_ETAPA_1_45_FINISH_ACTIVE_CALL_START_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.46 limpeza final do encerramento ativo

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishActiveCallCleanupPolicy` para centralizar a decisao de limpar finalidade de stop, liberar captura, limpar midia pendente e soltar o encerramento em progresso.
- `app/index.tsx` manteve os efeitos reais de refs e estados React no `finally` de `handleFinishActiveCall()`.
- `npm test` passou a executar `test:finish-active-call-cleanup`.

Validacoes:

- `test:finish-active-call-cleanup`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- ADB confirmou os Androids conectados, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/118_CHECKPOINT_ETAPA_1_46_FINISH_ACTIVE_CALL_CLEANUP_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.47 sincronizacao remota final do encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishRemoteSyncPolicy` para centralizar selecao do estado remoto final, decisao de retry apos finish direto e payload de log de falha remota.
- `app/index.tsx` manteve os efeitos reais de API, fila local, retry e log operacional.
- `npm test` passou a executar `test:finish-remote-sync`.

Validacoes:

- `test:finish-remote-sync`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/119_CHECKPOINT_ETAPA_1_47_FINISH_REMOTE_SYNC_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.48 resumo do pacote finalizado

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishPackageResultPolicy` para centralizar contagem de midias anexadas, flag de midia gravada e payload de `emergency_finish_package_result`.
- `app/index.tsx` manteve os efeitos reais de log, outcome, evidencia owner, auditoria e diagnostico.
- `npm test` passou a executar `test:finish-package-result`.

Validacoes:

- `test:finish-package-result`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- ADB confirmou os Androids conectados, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/120_CHECKPOINT_ETAPA_1_48_FINISH_PACKAGE_RESULT_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.49 evidencia owner final do encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishOwnerLiveEvidencePolicy` para centralizar a atualizacao final de evidencia local do owner no encerramento do SOS.
- `app/index.tsx` manteve os efeitos reais de persistencia local segura e fallback quando nao ha sessao remota.
- `npm test` passou a executar `test:finish-owner-live-evidence`.

Validacoes:

- `test:finish-owner-live-evidence`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/121_CHECKPOINT_ETAPA_1_49_FINISH_OWNER_LIVE_EVIDENCE_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.50 auditoria owner final do encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishOwnerLiveAuditPolicy` para centralizar evento de auditoria final, `connectionState: "ended"` e status local de evidencia.
- `app/index.tsx` manteve os efeitos reais de device binding e chamada a `recordLiveAuditMarker()`.
- `npm test` passou a executar `test:finish-owner-live-audit`.

Validacoes:

- `test:finish-owner-live-audit`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura de seguranca dirigida: aprovados.
- ADB confirmou os Androids conectados, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/122_CHECKPOINT_ETAPA_1_50_FINISH_OWNER_LIVE_AUDIT_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.51 diagnostico final sem midia

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishNoMediaDiagnosticPolicy` para centralizar a decisao de persistir diagnostico saneado quando o encerramento termina sem arquivo de midia local.
- `app/index.tsx` manteve o efeito real de `persistFinishNoMediaDiagnostic()`.
- `npm test` passou a executar `test:finish-no-media-diagnostic`.

Validacoes:

- `test:finish-no-media-diagnostic`, `smoke-test`, `typecheck`, `lint`, `npm test` e `private:android:readiness` condicionado: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/123_CHECKPOINT_ETAPA_1_51_FINISH_NO_MEDIA_DIAGNOSTIC_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.52 acoes finais do encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishCompletionActionsPolicy` para centralizar status final, progresso final e limpeza do formulario de confirmacao apos o outcome.
- `app/index.tsx` manteve os efeitos reais de estado React e apresentacao.
- `npm test` passou a executar `test:finish-completion-actions`.

Validacoes:

- `test:finish-completion-actions`, `smoke-test`, `typecheck`, `lint`, `npm test` e `private:android:readiness` condicionado: aprovados.
- ADB confirmou Android fisico `23129RA5FL` via Wi-Fi, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/124_CHECKPOINT_ETAPA_1_52_FINISH_COMPLETION_ACTIONS_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.53 pacote ausente no encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishMissingPackagePolicy` para centralizar status e progresso quando `finishEmergencyPackage()` nao retorna pacote.
- `app/index.tsx` manteve os efeitos reais de estado React e apresentacao.
- `npm test` passou a executar `test:finish-missing-package`.

Validacoes:

- `test:finish-missing-package`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/125_CHECKPOINT_ETAPA_1_53_FINISH_MISSING_PACKAGE_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.54 falha controlada do encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishFailureActionsPolicy` para centralizar evento de log, payload saneado, status final e progresso de erro no `catch` do encerramento.
- `app/index.tsx` manteve os efeitos reais de log, estado React e apresentacao.
- `npm test` passou a executar `test:finish-failure-actions`.

Validacoes:

- `test:finish-failure-actions`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- ADB confirmou Android fisico `23129RA5FL` via Wi-Fi, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/126_CHECKPOINT_ETAPA_1_54_FINISH_FAILURE_ACTIONS_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.55 inicio da parada de midia no encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishMediaStopStartPolicy` para centralizar bloqueio de captura, estado pendente, pacote do recorder e progresso inicial da parada de midia.
- `app/index.tsx` manteve os efeitos reais de setters React e espera do recorder.
- `npm test` passou a executar `test:finish-media-stop-start`.

Validacoes:

- `test:finish-media-stop-start`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/127_CHECKPOINT_ETAPA_1_55_FINISH_MEDIA_STOP_START_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.56 resultado da parada de midia no encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishMediaStopResultPolicy` para centralizar limpeza de pending, evento de log saneado e progresso final da parada de midia.
- `app/index.tsx` manteve os efeitos reais de log, estado React e apresentacao.
- `npm test` passou a executar `test:finish-media-stop-result`.

Validacoes:

- `test:finish-media-stop-result`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- ADB confirmou Android fisico `23129RA5FL` via Wi-Fi, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/128_CHECKPOINT_ETAPA_1_56_FINISH_MEDIA_STOP_RESULT_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.57 inicio da sincronizacao remota no encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Atualizada `finishRemoteSyncPolicy` com `resolveFinishRemoteSyncStartActions()` para centralizar fila remota obrigatoria e progresso `Sincronizando chamado`.
- `app/index.tsx` manteve os efeitos reais de fila local e apresentacao.
- `test:finish-remote-sync` passou a cobrir a decision.

Validacoes:

- `test:finish-remote-sync`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/129_CHECKPOINT_ETAPA_1_57_FINISH_REMOTE_SYNC_START_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.58 modo da sincronizacao remota no encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Atualizada `finishRemoteSyncPolicy` com `resolveFinishRemoteSyncMode()` para centralizar selecao entre `direct_finish` e `pending_sync`.
- `app/index.tsx` manteve os efeitos reais de API direta, retry e sincronizacao pendente.
- `test:finish-remote-sync` passou a cobrir sessao valida, `null` e string vazia.

Validacoes:

- `test:finish-remote-sync`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- ADB confirmou Android fisico `23129RA5FL` via Wi-Fi, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/130_CHECKPOINT_ETAPA_1_58_FINISH_REMOTE_SYNC_MODE_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.59 entrada do outcome final do encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishOutcomeInputPolicy` para centralizar a montagem da entrada de `resolveFinishOutcomePolicy()`.
- `app/index.tsx` manteve os efeitos reais e o algoritmo de outcome final.
- `test:finish-outcome-input` passou a cobrir o objeto de decisao.

Validacoes:

- `test:finish-outcome-input`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- ADB confirmou Android fisico `23129RA5FL` via Wi-Fi, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/131_CHECKPOINT_ETAPA_1_59_FINISH_OUTCOME_INPUT_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.60 conclusao owner no encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishOwnerCompletionPolicy` para agrupar `evidenceUpdate` e `auditMarker` finais do owner.
- `app/index.tsx` manteve os efeitos reais de storage/auditoria local.
- `test:finish-owner-completion` passou a cobrir caminhos protegido e falho.

Validacoes:

- `test:finish-owner-completion`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/132_CHECKPOINT_ETAPA_1_60_FINISH_OWNER_COMPLETION_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.61 runtime inicial do encerramento ativo

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishActiveCallRuntimeStartPolicy` para centralizar progresso inicial, status local, log saneado e flags de runtime no inicio do encerramento.
- `app/index.tsx` manteve os efeitos reais de parar evidencia ao vivo, resetar chamada, limpar refs e atualizar estados React.
- `test:finish-active-call-runtime-start` passou a cobrir sessao remota presente e ausente.

Validacoes:

- `test:finish-active-call-runtime-start`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- ADB confirmou Android fisico `23129RA5FL` via Wi-Fi, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/133_CHECKPOINT_ETAPA_1_61_FINISH_RUNTIME_START_POLICY_2026-05-18.md`.

## 2026-05-18 - Etapa 1.62 acoes pos-outcome do encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishPostOutcomeActionsPolicy` para agrupar `completionActions` e `noMediaDiagnostic`.
- `app/index.tsx` manteve os efeitos reais de persistir diagnostico, atualizar status, progresso e limpar formulario.
- `test:finish-post-outcome` passou a cobrir caminho com diagnostico e caminho protegido sem diagnostico.

Validacoes:

- `test:finish-post-outcome`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/134_CHECKPOINT_ETAPA_1_62_FINISH_POST_OUTCOME_POLICY_2026-05-18.md`.

## 2026-05-19 - Etapa 1.63 acoes de settlement da parada de midia

Status: refatoracao pura implementada e validada.

Executado:

- Criada `mediaStopSettledActionsPolicy` para centralizar tratamento do serial, log saneado e apresentacao da midia encerrada.
- `app/index.tsx` manteve os efeitos reais de resolver waiter, atualizar outbox/status/progresso e registrar log.
- `test:media-stop-settled-actions` cobre serial valido e serial ignorado.

Validacoes:

- `test:media-stop-settled-actions`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- ADB confirmou Android fisico `23129RA5FL` via Wi-Fi, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/135_CHECKPOINT_ETAPA_1_63_MEDIA_STOP_SETTLED_ACTIONS_POLICY_2026-05-19.md`.

## 2026-05-19 - Etapa 1.64 conclusao do pedido pendente de parada de midia

Status: refatoracao pura implementada e validada.

Executado:

- Criada `mediaStopPendingRequestCompletionPolicy` para centralizar limpeza de timeout, referencia pendente e resolucao da promise.
- `app/index.tsx` manteve os efeitos reais de `clearTimeout()`, limpeza de ref e `resolve(result)`.
- `test:media-stop-pending-request-completion` cobre serial compativel, serial divergente e ausencia de pedido pendente.

Validacoes:

- `test:media-stop-pending-request-completion`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/136_CHECKPOINT_ETAPA_1_64_MEDIA_STOP_PENDING_REQUEST_COMPLETION_POLICY_2026-05-19.md`.

## 2026-05-19 - Etapa 1.65 runtime inicial do SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `emergencyStartRuntimePolicy` para centralizar status inicial, log saneado, reset de chamada, limpeza de sessao remota e estado de inicio em progresso.
- `app/index.tsx` manteve os efeitos reais de reset, limpeza de refs, estados React e log operacional.
- `test:emergency-start-runtime` cobre payload Android com video local e payload iOS sem video local.

Validacoes:

- `test:emergency-start-runtime`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- ADB confirmou Android fisico `23129RA5FL` via Wi-Fi, mas sem build/perfil porque a mudanca nao altera UX nativa, chamada, camera, gravacao, WebRTC, backend ou storage.

Checkpoint:

- `docs/137_CHECKPOINT_ETAPA_1_65_EMERGENCY_START_RUNTIME_POLICY_2026-05-19.md`.

## 2026-05-19 - Etapa 1.66 falha controlada ao iniciar SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `emergencyStartFailureActionsPolicy` para centralizar log, status, limpeza de pacote ativo e dialogo de falha no inicio.
- `app/index.tsx` manteve os efeitos reais de log com erro, limpeza de estado, status e modal.
- `test:emergency-start-failure-actions` cobre payload saneado, status e dialogo.

Validacoes:

- `test:emergency-start-failure-actions`, `smoke-test`, `typecheck`, `lint`, `npm test`, `private:android:readiness` condicionado, `git diff --check` e varredura dirigida: aprovados.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/138_CHECKPOINT_ETAPA_1_66_EMERGENCY_START_FAILURE_ACTIONS_POLICY_2026-05-19.md`.

## 2026-05-20 - Etapa 1.67 formulario de confirmacao do encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishConfirmationFormPolicy` para centralizar patches reutilizaveis do formulario de encerramento do SOS.
- `app/index.tsx` manteve os efeitos React reais em `applyFinishConfirmationFormPatch()`.
- `test:finish-confirmation-form` cobre abertura do modal por codigo, encerramento direto e limpeza final do formulario.

Validacoes:

- `test:finish-confirmation-form`, `test:finish-request`, `test:finish-completion-actions`, `smoke-test`, `npm test`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso no Node local ate interrupcao operacional.
- `lint` completo encontrou `ETIMEDOUT` ao ler documentacao em iCloud; varredura dirigida dos arquivos alterados nao encontrou padrao sensivel.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/139_CHECKPOINT_ETAPA_1_67_FINISH_CONFIRMATION_FORM_POLICY_2026-05-20.md`.

## 2026-05-20 - Etapa 1.68 formulario de rota protegida

Status: refatoracao pura implementada e validada.

Executado:

- Criada `protectedRouteFormPolicy` para centralizar patches reutilizaveis do formulario de rota protegida por codigo.
- `app/index.tsx` manteve os efeitos React reais em `applyProtectedRouteFormPatch()`.
- `test:protected-route-form` cobre pedido de codigo, erro, aceite e fechamento do dialogo.

Validacoes:

- `test:protected-route-form`, `test:protected-route-access`, `test:protected-route-code`, `smoke-test`, `npm test`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso no Node local ate interrupcao operacional.
- `lint` completo encontrou `ETIMEDOUT` ao ler documentacao em iCloud; varredura dirigida dos arquivos alterados nao encontrou padrao sensivel.
- Git local tinha packs/refs antigos corrompidos; foram isolados em quarentena `.git/objects/pack/corrupt-20260520-083643` e o fetch de `main` voltou a funcionar.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/140_CHECKPOINT_ETAPA_1_68_PROTECTED_ROUTE_FORM_POLICY_2026-05-20.md`.

## 2026-05-20 - Etapa 1.69 acoes de confirmacao de encerramento por codigo

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishCodeConfirmationActionsPolicy` para transformar a decisao de codigo em patch de erro ou autorizacao explicita de encerramento.
- `app/index.tsx` manteve `verifySecurityCodeStatus()`, `applyFinishConfirmationFormPatch()` e `handleFinishActiveCall()` como efeitos reais no componente.
- `test:finish-code-confirmation-actions` cobre erro e caminho de encerramento autorizado.

Validacoes:

- `test:finish-code-confirmation-actions`, `test:finish-code`, `test:finish-confirmation-form`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/141_CHECKPOINT_ETAPA_1_69_FINISH_CODE_CONFIRMATION_ACTIONS_POLICY_2026-05-20.md`.

## 2026-05-20 - Etapa 1.70 acoes de desbloqueio de rota protegida

Status: refatoracao pura implementada e validada.

Executado:

- Criada `protectedRouteUnlockActionsPolicy` para transformar a decisao de codigo em patch, autorizacao de desbloqueio e alvo de navegacao.
- `app/index.tsx` manteve `verifySecurityCodeStatus()`, `applyProtectedRouteFormPatch()`, `unlockProtectedAccess()` e `navigateRoute()` como efeitos reais no componente.
- `test:protected-route-unlock-actions` cobre pedido ausente, erro, desbloqueio sem request e desbloqueio com alvo valido.

Validacoes:

- `test:protected-route-unlock-actions`, `test:protected-route-code`, `test:protected-route-form`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/142_CHECKPOINT_ETAPA_1_70_PROTECTED_ROUTE_UNLOCK_ACTIONS_POLICY_2026-05-20.md`.

## 2026-05-20 - Etapa 1.71 conclusao do waiter de liberacao de midia

Status: refatoracao pura implementada e validada.

Executado:

- Criada `mediaReleaseWaiterCompletionPolicy` para centralizar a decisao de concluir o waiter de liberacao de midia antes da chamada ao vivo.
- `app/index.tsx` manteve `clearTimeout()`, limpeza de ref e resolucao da promise como efeitos reais no componente.
- `test:media-release-waiter-completion` cobre ausencia e presenca de request pendente.

Validacoes:

- `test:media-release-waiter-completion`, `test:media-release-waiter`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/143_CHECKPOINT_ETAPA_1_71_MEDIA_RELEASE_WAITER_COMPLETION_POLICY_2026-05-20.md`.

## 2026-05-20 - Etapa 1.72 timeout do waiter de liberacao de midia

Status: refatoracao pura implementada e validada.

Executado:

- Criada `mediaReleaseTimeoutActionsPolicy` para centralizar a decisao de timeout do waiter de liberacao de midia antes da chamada ao vivo.
- `app/index.tsx` manteve `setTimeout()`, limpeza de ref, `appendMediaOperationalLog()` e resolucao da promise como efeitos reais no componente.
- `test:media-release-timeout-actions` cobre timeout com e sem request pendente.

Validacoes:

- `test:media-release-timeout-actions`, `test:media-release-waiter`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/144_CHECKPOINT_ETAPA_1_72_MEDIA_RELEASE_TIMEOUT_ACTIONS_POLICY_2026-05-20.md`.

## 2026-05-20 - Etapa 1.73 update de evidencia local owner

Status: refatoracao pura implementada e validada.

Executado:

- Criada `ownerLiveEvidenceUpdatePolicy` para centralizar a decisao de atualizar evidencia local owner somente com sessao remota valida.
- `app/index.tsx` manteve `updateOwnerLiveCallEvidenceRecord()` como efeito real no componente.
- `test:owner-live-evidence-update` cobre ausencia de sessao e update permitido.

Validacoes:

- `test:owner-live-evidence-update`, `test:owner-live-evidence`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/145_CHECKPOINT_ETAPA_1_73_OWNER_LIVE_EVIDENCE_UPDATE_POLICY_2026-05-20.md`.

## 2026-05-20 - Etapa 1.74 acoes de marcador de auditoria owner

Status: refatoracao pura implementada e validada.

Executado:

- Criada `ownerLiveAuditMarkerActionsPolicy` para centralizar a decisao de registrar marcador de auditoria owner somente com sessao remota valida.
- `app/index.tsx` manteve `deviceBindingService.getRegisteredApiDeviceId()`, `resolveOwnerLiveAuditMarkerInput()` e `recordLiveAuditMarker()` como efeitos reais no componente.
- `test:owner-live-audit-marker-actions` cobre ausencia de sessao e marcador permitido.

Validacoes:

- `test:owner-live-audit-marker-actions`, `test:owner-live-audit-marker`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/146_CHECKPOINT_ETAPA_1_74_OWNER_LIVE_AUDIT_MARKER_ACTIONS_POLICY_2026-05-20.md`.

## 2026-05-20 - Etapa 1.75 pedido de inicio de video owner

Status: refatoracao pura implementada e validada.

Executado:

- Criada `ownerLiveVideoStartRequestPolicy` para centralizar a decisao de reutilizar gravacao ativa, reutilizar pedido pendente, substituir gravacao ativa ou iniciar nova gravacao owner.
- `app/index.tsx` manteve retorno da gravacao/promise, parada da gravacao anterior e inicio real de gravacao como efeitos do componente.
- `test:owner-live-video-start-request` cobre reutilizacao ativa, reutilizacao pendente, substituicao e inicio novo.

Validacoes:

- `test:owner-live-video-start-request`, `test:owner-live-evidence`, `test:owner-live-evidence-update`, `test:owner-live-audit-marker-actions`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/147_CHECKPOINT_ETAPA_1_75_OWNER_LIVE_VIDEO_START_REQUEST_POLICY_2026-05-20.md`.

## 2026-05-20 - Etapa 1.76 resultado do inicio de video owner

Status: refatoracao pura implementada e validada.

Executado:

- Criada `ownerLiveVideoStartOutcomePolicy` para centralizar acoes derivadas de metadata-only, gravacao iniciada e erro controlado.
- `app/index.tsx` manteve inicio real de gravacao, refs, update de evidencia, marcador de auditoria, status e log como efeitos do componente.
- `test:owner-live-video-start-outcome` cobre gravacao iniciada, metadata-only e erro controlado.

Validacoes:

- `test:owner-live-video-start-outcome`, `test:owner-live-evidence`, `test:owner-live-evidence-update`, `test:owner-live-audit-marker-actions`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/148_CHECKPOINT_ETAPA_1_76_OWNER_LIVE_VIDEO_START_OUTCOME_POLICY_2026-05-20.md`.

## 2026-05-20 - Etapa 1.77 pedido de preservacao de video owner

Status: refatoracao pura implementada e validada.

Executado:

- Criada `ownerLiveVideoPreserveRequestPolicy` para centralizar a decisao de reutilizar promise de preservacao, aguardar inicio pendente, ignorar por ausencia/in-flight ou iniciar preservacao.
- `app/index.tsx` manteve promise real, refs, await de inicio pendente e controle de preservacao como efeitos do componente.
- `test:owner-live-video-preserve-request` cobre reutilizacao, aguardo pendente, ausencia, in-flight e inicio de preservacao.

Validacoes:

- `test:owner-live-video-preserve-request`, `test:owner-live-video-preserve-outcome`, `test:owner-live-video-start-request`, `test:owner-live-video-start-outcome`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/149_CHECKPOINT_ETAPA_1_77_OWNER_LIVE_VIDEO_PRESERVE_REQUEST_POLICY_2026-05-20.md`.

## 2026-05-20 - Etapa 1.78 resultado da preservacao de video owner

Status: refatoracao pura implementada e validada.

Executado:

- Criada `ownerLiveVideoPreserveOutcomePolicy` para centralizar acoes de fonte parada, conclusao protegida e erro controlado.
- `app/index.tsx` manteve parada nativa, preservacao no cofre, update de evidencia, auditoria, status e logs como efeitos do componente.
- `test:owner-live-video-preserve-outcome` cobre ausencia de fonte, fonte valida, conclusao terminal, conclusao nao terminal e erro.

Validacoes:

- `test:owner-live-video-preserve-outcome`, `test:owner-live-video-preserve-request`, `test:owner-live-video-start-request`, `test:owner-live-video-start-outcome`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/150_CHECKPOINT_ETAPA_1_78_OWNER_LIVE_VIDEO_PRESERVE_OUTCOME_POLICY_2026-05-20.md`.

## 2026-05-20 - Etapa 1.79 acoes iniciais do handoff de midia owner

Status: refatoracao pura implementada e validada.

Executado:

- Criada `mediaHandoffStartActionsPolicy` para centralizar acoes iniciais da preparacao de midia para chamada owner.
- `app/index.tsx` manteve refs, estado React, evidencia, auditoria, log e sinalizacao real de parada do recorder como efeitos do componente.
- `test:media-handoff-start-actions` cobre status, evidencia, auditoria, log e flags derivadas do stage inicial.

Validacoes:

- `test:media-handoff-start-actions`, `test:media-handoff-release-actions`, `test:media-handoff`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/151_CHECKPOINT_ETAPA_1_79_MEDIA_HANDOFF_START_ACTIONS_POLICY_2026-05-20.md`.

## 2026-05-20 - Etapa 1.80 acoes de liberacao do handoff de midia owner

Status: refatoracao pura implementada e validada.

Executado:

- Criada `mediaHandoffReleaseActionsPolicy` para centralizar espera, conclusao e limpeza da liberacao de camera/midia antes da chamada owner.
- `app/index.tsx` manteve `signalMediaRecorderStop()`, `waitForMediaRecorderRelease()`, flags React, evidencia, auditoria e logs como efeitos do componente.
- `test:media-handoff-release-actions` cobre ausencia de serial, espera, conclusao e limpeza.

Validacoes:

- `test:media-handoff-release-actions`, `test:media-handoff-start-actions`, `test:media-handoff`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/152_CHECKPOINT_ETAPA_1_80_MEDIA_HANDOFF_RELEASE_ACTIONS_POLICY_2026-05-20.md`.

## 2026-05-21 - Etapa 1.81 acoes de tentativa da autochamada owner

Status: refatoracao pura implementada e validada.

Executado:

- Criada `ownerAutoCallAttemptActionsPolicy` para centralizar decisao e acoes iniciais da tentativa de autochamada owner.
- `app/index.tsx` manteve timers, refs, status React, log real e consulta aos anjos aceitos como efeitos do componente.
- `test:owner-auto-call-attempt-actions` cobre bloqueios de tentativa e caminho permitido com status/log saneado.

Validacoes:

- `test:owner-auto-call-attempt-actions`, `test:owner-auto-call-result-actions`, `test:owner-auto-call`, `smoke-test`, `npm test`, `private:android:readiness`, `git diff --check` dirigido, lint dirigido e varredura dirigida: aprovados.
- `npm run lint` global travou sem CPU em duas tentativas e foi encerrado.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/153_CHECKPOINT_ETAPA_1_81_OWNER_AUTO_CALL_ATTEMPT_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.82 acoes de resultado da autochamada owner

Status: refatoracao pura implementada e validada.

Executado:

- Criada `ownerAutoCallResultActionsPolicy` para centralizar status de destinatarios, marcacao de chamada iniciada, erro controlado e limpeza de in-flight.
- `app/index.tsx` manteve preparacao de midia, chamada WebRTC, refs, log real e limpeza do ciclo como efeitos do componente.
- `test:owner-auto-call-result-actions` cobre ausencia/presenca de anjo, resultado iniciado/falho, erro e finally.

Validacoes:

- `test:owner-auto-call-result-actions`, `test:owner-auto-call-attempt-actions`, `test:owner-auto-call`, `smoke-test`, `npm test`, `private:android:readiness`, `git diff --check` dirigido, lint dirigido e varredura dirigida: aprovados.
- `npm run lint` global travou sem CPU em duas tentativas e foi encerrado.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/154_CHECKPOINT_ETAPA_1_82_OWNER_AUTO_CALL_RESULT_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.83 acoes do lifecycle da chamada owner

Status: refatoracao pura implementada e validada.

Executado:

- Criada `ownerLiveCallLifecycleActionsPolicy` para centralizar timestamps, limpeza de sessao iniciada e motivo controlado para parada da evidencia owner.
- `app/index.tsx` manteve refs, parada real de video e update real da evidencia como efeitos do componente.
- `test:owner-live-call-lifecycle-actions` cobre decisao ignorada, chamada conectada e chamada encerrada/falha com limpeza.

Validacoes:

- `test:owner-live-call-lifecycle-actions`, `test:owner-live-evidence`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/155_CHECKPOINT_ETAPA_1_83_OWNER_LIVE_CALL_LIFECYCLE_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.84 acoes de limpeza da chamada ao vivo

Status: refatoracao pura implementada e validada.

Executado:

- Criada `liveCallCleanupActionsPolicy` para centralizar reset/parada da chamada ao vivo e flags de limpeza local.
- `app/index.tsx` manteve limpeza de refs, estado React e chamada real de reset/stop como efeitos do componente.
- `test:live-call-cleanup-actions` cobre ausencia de cleanup, reset idle e parada de chamada ativa.

Validacoes:

- `test:live-call-cleanup-actions`, `test:live-call-cleanup`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/156_CHECKPOINT_ETAPA_1_84_LIVE_CALL_CLEANUP_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.85 acoes de tentativa da sincronizacao remota ativa

Status: refatoracao pura implementada e validada.

Executado:

- Criada `activeRemoteSyncAttemptActionsPolicy` para centralizar bloqueios e log saneado da tentativa de sincronizacao remota ativa.
- `app/index.tsx` manteve timers, refs, busca de pacote, chamada API e log real como efeitos do componente.
- `test:active-remote-sync-attempt-actions` cobre cancelamento, pacote ausente, tentativa em andamento, sessao remota existente e caminho permitido.

Validacoes:

- `test:active-remote-sync-attempt-actions`, `test:remote-sync-status`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/157_CHECKPOINT_ETAPA_1_85_ACTIVE_REMOTE_SYNC_ATTEMPT_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.86 acoes de conclusao da sincronizacao remota ativa

Status: refatoracao pura implementada e validada.

Executado:

- Criada `activeRemoteSyncCompletionActionsPolicy` para centralizar guardas de pacote, aplicacao de resultado, erro controlado e limpeza de in-flight.
- `app/index.tsx` manteve `getActiveEmergencyPackage()`, `syncEmergencyPackageWithApi()`, `applyRemoteSyncState()`, `setRecordingStatus()` e log real como efeitos do componente.
- `test:active-remote-sync-completion-actions` cobre pacote cancelado/ausente/alterado, resultado ausente, erro cancelado, erro aplicavel e finally.

Validacoes:

- `test:active-remote-sync-completion-actions`, `test:active-remote-sync-attempt-actions`, `test:remote-sync-status`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/158_CHECKPOINT_ETAPA_1_86_ACTIVE_REMOTE_SYNC_COMPLETION_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.87 acoes de pacote SOS criado

Status: refatoracao pura implementada e validada.

Executado:

- Criada `emergencyStartCreatedActionsPolicy` para centralizar log saneado e status inicial apos criacao do pacote SOS.
- `app/index.tsx` manteve criacao do pacote, refresh, chamada telefonica opcional, log real e estado React como efeitos do componente.
- `test:emergency-start-created-actions` cobre video/localizacao habilitados e status derivado da apresentacao inicial.

Validacoes:

- `test:emergency-start-created-actions`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/159_CHECKPOINT_ETAPA_1_87_EMERGENCY_START_CREATED_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.88 acoes de sincronizacao inicial do SOS

Status: refatoracao pura implementada e validada.

Executado:

- Criada `emergencyStartRemoteSyncActionsPolicy` para centralizar log de resultado, opcoes de aplicacao do estado remoto inicial e log de erro.
- `app/index.tsx` manteve `syncEmergencyPackageWithApi()`, `appendMediaOperationalLog()` e `applyRemoteSyncState()` como efeitos do componente.
- `test:emergency-start-remote-sync-actions` cobre resultado com/sem sessao remota e erro controlado.

Validacoes:

- `test:emergency-start-remote-sync-actions`, `test:emergency-start-created-actions`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/160_CHECKPOINT_ETAPA_1_88_EMERGENCY_START_REMOTE_SYNC_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.89 acoes de estado runtime do encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishActiveCallRuntimeStateActionsPolicy` para centralizar acoes locais aplicaveis ao iniciar o encerramento do chamado ativo.
- `app/index.tsx` manteve parada de video, reset da chamada, limpeza de refs, estado React, progresso e log real como efeitos do componente.
- `test:finish-active-call-runtime-state-actions` cobre limpeza de sessao owner e motivo controlado para parada de evidencia.

Validacoes:

- `test:finish-active-call-runtime-state-actions`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/161_CHECKPOINT_ETAPA_1_89_FINISH_ACTIVE_CALL_RUNTIME_STATE_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.90 acoes de requisicao de parada de midia no encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishMediaStopRequestActionsPolicy` para centralizar a decisao de sinalizar parada do recorder e as acoes iniciais quando existe serial.
- `app/index.tsx` manteve `signalMediaRecorderStop()`, flags React, `waitForMediaRecorderStop()` e log/progresso real como efeitos do componente.
- `test:finish-media-stop-request-actions` cobre chamada entregue ao vivo, parada local e serial de parada presente/ausente.

Validacoes:

- `test:finish-media-stop-request-actions`, `test:finish-media-stop-start`, `test:finish-media-stop-result`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/162_CHECKPOINT_ETAPA_1_90_FINISH_MEDIA_STOP_REQUEST_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.91 acoes de requisicao da sincronizacao remota final

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishRemoteSyncRequestActionsPolicy` para centralizar o plano inicial da sincronizacao remota final do encerramento.
- `app/index.tsx` manteve fila remota, chamada direta de encerramento remoto, retry de pendencias, log e progresso como efeitos do componente.
- `test:finish-remote-sync-request-actions` cobre modo direto com sessao remota e modo de sincronizacao pendente.

Validacoes:

- `test:finish-remote-sync-request-actions`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/163_CHECKPOINT_ETAPA_1_91_FINISH_REMOTE_SYNC_REQUEST_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.92 acoes consolidadas de resultado final do pacote

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishPackageOutcomeActionsPolicy` para consolidar resumo do pacote, entrada do outcome, resultado final, evidencia/auditoria owner e acoes posteriores.
- `app/index.tsx` manteve log operacional, update de evidencia, marcador de auditoria, persistencia diagnostica e estado React como efeitos do componente.
- `test:finish-package-outcome-actions` cobre resultado protegido e persistencia diagnostica quando a chamada ao vivo nao devolve video local.

Validacoes:

- `test:finish-package-outcome-actions`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/164_CHECKPOINT_ETAPA_1_92_FINISH_PACKAGE_OUTCOME_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.93 acoes de branch de pacote ausente no encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishMissingPackageBranchActionsPolicy` para centralizar a decisao de aplicar o branch de pacote ausente e retornar apos status/progresso.
- `app/index.tsx` manteve `setRecordingStatus()`, `showFinishProgress()` e retorno controlado como efeitos do componente.
- `test:finish-missing-package-branch-actions` cobre resultado presente, pacote ausente sem serial e pacote ausente com serial.

Validacoes:

- `test:finish-missing-package-branch-actions`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/165_CHECKPOINT_ETAPA_1_93_FINISH_MISSING_PACKAGE_BRANCH_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.94 acoes de falha e cleanup final do encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishFailureCleanupActionsPolicy` para centralizar acoes de falha runtime e cleanup final do encerramento.
- `app/index.tsx` manteve log real, status, progresso, refs e estados React como efeitos do componente.
- `test:finish-failure-cleanup-actions` cobre falha runtime e cleanup final com/sem `mediaStopPurpose`.

Validacoes:

- `test:finish-failure-cleanup-actions`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/166_CHECKPOINT_ETAPA_1_94_FINISH_FAILURE_CLEANUP_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.95 acoes de sincronizacao remota direta no encerramento

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishRemoteSyncDirectActionsPolicy` para centralizar retry apos tentativa direta e resolucao do estado remoto final.
- `app/index.tsx` manteve chamadas reais de API e sincronizacao pendente como efeitos do componente.
- `test:finish-remote-sync-direct-actions` cobre tentativa direta finalizada, falha com retry e preferencia pelo estado de retry do mesmo pacote.

Validacoes:

- `test:finish-remote-sync-direct-actions`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/167_CHECKPOINT_ETAPA_1_95_FINISH_REMOTE_SYNC_DIRECT_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapa 1.96 acoes de conclusao da sincronizacao remota final

Status: refatoracao pura implementada e validada.

Executado:

- Criada `finishRemoteSyncCompletionActionsPolicy` para centralizar resultado pendente, log de falha remota e flag `remoteFinishFailed`.
- `app/index.tsx` manteve sincronizacao pendente, log real e resultado local do pacote como efeitos do componente.
- `test:finish-remote-sync-completion-actions` cobre resultado pendente encontrado/ausente e falha remota saneada.

Validacoes:

- `test:finish-remote-sync-completion-actions`, `smoke-test`, `lint`, `npm test`, `private:android:readiness`, `git diff --check` e varredura dirigida: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser fatia pura sem mudanca operacional.

Checkpoint:

- `docs/168_CHECKPOINT_ETAPA_1_96_FINISH_REMOTE_SYNC_COMPLETION_ACTIONS_POLICY_2026-05-21.md`.

## 2026-05-21 - Validacao ampla local pos-refatoracao Home/SOS

Status: validacao local ampla concluida; validacao Android fisica pendente por ambiente.

Executado:

- Revisado `handleFinishActiveCall` apos as fatias 1.81 a 1.96.
- Confirmado que o metodo ficou majoritariamente como orquestrador de efeitos reais, com regras puras extraidas e testadas.
- Nao foi identificada nova borda pura com ganho suficiente para justificar mais duas extracoes antes da validacao fisica.

Validacoes:

- `smoke-test`, `lint`, `npm test` e `private:android:readiness`: aprovados.
- `typecheck` nao emitiu erro, mas ficou preso sem CPU e foi encerrado para nao deixar processo pendurado.
- `adb devices -l` nao listou Android conectado.
- Espaco livre local observado: aproximadamente 5.3 GiB.

Decisao:

- Nao iniciar build/instalacao Android nesta rodada; build adiado para a proxima retomada.
- Proxima etapa recomendada: conectar Android, garantir espaco livre suficiente, executar build privado, instalar e validar fisicamente Home/SOS/encerramento.

Checkpoint:

- `docs/169_CHECKPOINT_VALIDACAO_AMPLA_LOCAL_POS_REFATORACAO_HOME_SOS_2026-05-21.md`.

## 2026-05-21 - Etapas 1.97 e 1.98 apresentacao de anjos e convites

Status: refatoracao pura implementada e validada.

Executado:

- Criada `trustedAngelsPresentationPolicy` para centralizar regras puras de apresentacao da tela `Anjos de confianca`.
- Etapa 1.97: extraidas descricao, detalhe, data curta e normalizacao visual de convites.
- Etapa 1.98: extraidos status, nomes, detalhes, descricoes, resumos e banner principal de vinculos de anjos.
- `app/contatos.tsx` continua responsavel por estado React, sincronizacao real, compartilhamento, revogacao e navegacao.
- Novo gate `npm run test:trusted-angels-presentation` foi adicionado ao `npm test`.

Validacoes:

- `test:trusted-angels-presentation`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- Sem build Android por pedido de pausa do build e por ser mudanca pura de apresentacao sem runtime nativo.

Checkpoint:

- `docs/170_CHECKPOINT_ETAPAS_1_97_1_98_TRUSTED_ANGELS_PRESENTATION_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapas 1.99 e 1.100 merge/listas de anjos e convites

Status: refatoracao pura implementada e validada.

Executado:

- Criada `trustedAngelsListPolicy` para centralizar regras puras de merge/listagem da tela `Anjos de confianca`.
- Etapa 1.99: extraido merge de convites locais/remotos, ocultando convites cujo contato ja foi aceito/revogado e preservando ordenacao por criacao.
- Etapa 1.100: extraidas listas de `linkedContacts`, `angelLinks`, secoes de convites e contador de convites.
- `app/contatos.tsx` continua responsavel por estado React, sincronizacao real, compartilhamento, revogacao e navegacao.
- Novo gate `npm run test:trusted-angels-list` foi adicionado ao `npm test`.

Validacoes:

- `test:trusted-angels-list`, `test:trusted-angels-presentation`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `adb devices -l` listou Android `23129RA5FL` via Wi-Fi/mDNS em duas entradas do mesmo aparelho; sem build, instalacao ou teste fisico nesta rodada.
- Sem build Android por ser mudanca pura de listagem/apresentacao sem runtime nativo.

Checkpoint:

- `docs/171_CHECKPOINT_ETAPAS_1_99_1_100_TRUSTED_ANGELS_LIST_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapas 1.101 e 1.102 acoes de convite e revogacao de anjos

Status: refatoracao pura implementada e validada.

Executado:

- Criada `trustedAngelsActionPolicy` para centralizar decisoes puras dos handlers da tela `Anjos de confianca`.
- Etapa 1.101: extraidos inicio do compartilhamento de convite, label saneado, bloqueio por perfil e tratamento de falha/sessao expirada.
- Etapa 1.102: extraidos planos de revogacao de convite, revogacao de vinculo e fallback de falha.
- `app/contatos.tsx` continua responsavel por API real, Share, storage local, cache, refresh e estado React.
- Novo gate `npm run test:trusted-angels-action` foi adicionado ao `npm test`.

Validacoes:

- `test:trusted-angels-action`, `test:trusted-angels-list`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- Sem build Android por ser mudanca pura de decisao/status sem runtime nativo.

Checkpoint:

- `docs/172_CHECKPOINT_ETAPAS_1_101_1_102_TRUSTED_ANGELS_ACTION_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapas 1.103 e 1.104 refresh de anjos

Status: refatoracao pura implementada e validada.

Executado:

- Criada `trustedAngelsRefreshPolicy` para centralizar decisoes puras do ciclo de atualizacao da tela `Anjos de confianca`.
- Etapa 1.103: extraidos inicio do refresh, busy visivel/silencioso, estado local/cache, estado sem sessao e falha local.
- Etapa 1.104: extraidos resultado remoto de contatos/convites/vinculos/cache e abertura de painel por parametro.
- `app/contatos.tsx` continua responsavel por API real, cache real, storage local, timers, AppState e estado React.
- Novo gate `npm run test:trusted-angels-refresh` foi adicionado ao `npm test`.

Validacoes:

- `test:trusted-angels-refresh`, `test:trusted-angels-action`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- Sem build Android por ser mudanca pura de decisao/status sem runtime nativo.

Checkpoint:

- `docs/173_CHECKPOINT_ETAPAS_1_103_1_104_TRUSTED_ANGELS_REFRESH_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapas 1.105 e 1.106 resumo e prontidao de anjos

Status: refatoracao pura implementada e validada.

Executado:

- Criada `trustedAngelsDashboardPolicy` para centralizar decisoes puras de resumo visual da tela `Anjos de confianca`.
- Etapa 1.105: extraidas descricoes dos cards principais de perfil, estado, convite, prontidao, meus anjos, sou anjo, convites e atualizacao.
- Etapa 1.106: extraidos labels e flags de prontidao de conta, dispositivo e API.
- `app/contatos.tsx` continua responsavel por renderizacao, navegacao, modais, estado React e efeitos reais.
- Novo gate `npm run test:trusted-angels-dashboard` foi adicionado ao `npm test`.

Validacoes:

- `test:trusted-angels-dashboard`, `test:trusted-angels-refresh`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- Sem build Android por ser mudanca pura de apresentacao derivada sem runtime nativo.

Checkpoint:

- `docs/174_CHECKPOINT_ETAPAS_1_105_1_106_TRUSTED_ANGELS_DASHBOARD_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapas 1.107 e 1.108 dialogs e acoes visuais de convites

Status: refatoracao pura implementada e validada.

Executado:

- Criada `trustedAngelsDialogPolicy` para centralizar decisoes puras de visibilidade da tela `Anjos de confianca`.
- Etapa 1.107: extraidos booleans de dialogs e paineis de estado, prontidao, meus anjos, sou anjo e convites.
- Etapa 1.108: extraida regra de exibicao da acao de revogar convite e chave visual de card por sincronizacao/origem.
- `app/contatos.tsx` continua responsavel por renderizacao, clique, navegacao, modais, estado React e efeitos reais.
- Novo gate `npm run test:trusted-angels-dialog` foi adicionado ao `npm test`.

Validacoes:

- `test:trusted-angels-dialog`, `test:trusted-angels-dashboard`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- Sem build Android por ser mudanca pura de decisao visual sem runtime nativo.

Checkpoint:

- `docs/175_CHECKPOINT_ETAPAS_1_107_1_108_TRUSTED_ANGELS_DIALOG_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapas 1.109 e 1.110 paineis de vinculos e convites

Status: refatoracao pura implementada e validada.

Executado:

- Criada `trustedAngelsPanelPolicy` para centralizar modelos puros de paineis da tela `Anjos de confianca`.
- Etapa 1.109: extraidos itens e estados vazios dos paineis `Meus anjos` e `Sou anjo`.
- Etapa 1.110: extraidas secoes do painel de convites validados/locais e estado vazio.
- `app/contatos.tsx` continua responsavel por renderizacao, icones, cliques, navegacao, modais, estado React e efeitos reais.
- Novo gate `npm run test:trusted-angels-panel` foi adicionado ao `npm test`.

Validacoes:

- `test:trusted-angels-panel`, `test:trusted-angels-dialog`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e sem CPU; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de apresentacao derivada sem runtime nativo.

Checkpoint:

- `docs/176_CHECKPOINT_ETAPAS_1_109_1_110_TRUSTED_ANGELS_PANEL_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapas 1.111 e 1.112 contadores e ciclo de refresh

Status: refatoracao pura implementada e validada.

Executado:

- Extraida `buildTrustedAngelsAcceptedCounts()` para centralizar contadores aceitos de `Meus anjos` e `Sou anjo`.
- Extraidas `TRUSTED_ANGELS_REFRESH_INTERVAL_MS` e `shouldRefreshTrustedAngelsOnAppState()` para centralizar o intervalo de 15 segundos e a regra de refresh quando o app volta para `active`.
- `app/contatos.tsx` continua responsavel por timers, AppState, refresh real, renderizacao, navegacao, modais, estado React e efeitos reais.

Validacoes:

- `test:trusted-angels-dashboard`, `test:trusted-angels-refresh`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e sem CPU; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de policy sem runtime nativo.

Checkpoint:

- `docs/177_CHECKPOINT_ETAPAS_1_111_1_112_TRUSTED_ANGELS_DERIVED_REFRESH_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapas 1.113 e 1.114 navegacao e labels de dialogs

Status: refatoracao pura implementada e validada.

Executado:

- Criada `trustedAngelsNavigationPolicy` para centralizar decisao pura de rota do menu da tela `Anjos de confianca`.
- Etapa 1.113: extraida regra especial que abre `/arquivos` com parametro de painel quando a navegacao exige esse contexto.
- Etapa 1.114: extraidos labels de acoes dos dialogs para `buildTrustedAngelsDialogActionLabels()` em `trustedAngelsDialogPolicy`.
- `app/contatos.tsx` continua responsavel por renderizacao, `router.push`, modais, estado React e handlers reais.
- Novo gate `npm run test:trusted-angels-navigation` foi adicionado ao `npm test`.

Validacoes:

- `test:trusted-angels-navigation`, `test:trusted-angels-dialog`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e sem CPU; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de policy sem runtime nativo.

Checkpoint:

- `docs/178_CHECKPOINT_ETAPAS_1_113_1_114_TRUSTED_ANGELS_NAVIGATION_DIALOG_LABELS_2026-05-21.md`.

## 2026-05-21 - Etapas 1.115 e 1.116 cards do dashboard de anjos

Status: refatoracao pura implementada e validada.

Executado:

- `trustedAngelsDashboardPolicy` passou a centralizar o modelo dos 8 cards principais da tela `Anjos de confianca`.
- Etapa 1.115: extraidas linhas puras de cards com `key`, `label`, `description`, `icon` e `action`.
- Etapa 1.116: extraida decisao pura de acao dos cards: rota, painel, dialog e refresh.
- `app/contatos.tsx` continua responsavel por renderizar `ResourceTile`, icones reais, `router.push`, `setPanel`, `setDialog` e `refreshAngels()`.

Validacoes:

- `test:trusted-angels-dashboard`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e sem CPU; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de policy sem runtime nativo.

Checkpoint:

- `docs/179_CHECKPOINT_ETAPAS_1_115_1_116_TRUSTED_ANGELS_DASHBOARD_TILE_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapas 1.117 e 1.118 apresentacao da tela Configuracoes

Status: refatoracao pura implementada e validada.

Executado:

- Criada `settingsPresentationPolicy` para iniciar a extracao segura da tela `Configuracoes`.
- Etapa 1.117: extraidos status de permissao, label de camera local e status visual de contato/anjo.
- Etapa 1.118: extraidos titulos de paineis, resumo de termos/privacidade e mensagens de ajuda.
- `app/configuracoes.tsx` continua responsavel por efeitos reais: login, API, permissoes, storage, camera, microfone, localizacao e navegacao.
- Novo gate `npm run test:settings-presentation` foi adicionado ao `npm test`.

Validacoes:

- `test:settings-presentation`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e sem CPU; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de policy sem runtime nativo.

Checkpoint:

- `docs/180_CHECKPOINT_ETAPAS_1_117_1_118_SETTINGS_PRESENTATION_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapas 1.119 e 1.120 cards da tela Configuracoes

Status: refatoracao pura implementada e validada.

Executado:

- `settingsPresentationPolicy` passou a centralizar tambem o modelo dos 8 cards principais da tela `Configuracoes`.
- Etapa 1.119: extraidas linhas puras de cards com `key`, `label`, `description`, `icon` simbolico e `action`.
- Etapa 1.120: extraido alvo puro de painel dos cards com `buildSettingsDashboardTileAction()`.
- `app/configuracoes.tsx` continua responsavel por renderizar `ResourceTile`, icones reais, `setActivePanel`, login/API/permissoes/storage/camera/microfone/localizacao/navegacao.

Validacoes:

- `test:settings-presentation`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e sem CPU; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de policy sem runtime nativo.

Checkpoint:

- `docs/181_CHECKPOINT_ETAPAS_1_119_1_120_SETTINGS_DASHBOARD_TILE_POLICY_2026-05-21.md`.

## 2026-05-21 - Etapas 1.121 e 1.122 localizacao e codigo em Configuracoes

Status: refatoracao pura implementada e validada.

Executado:

- `settingsPresentationPolicy` passou a centralizar tambem modelos puros dos paineis de localizacao e codigo de seguranca.
- Etapa 1.121: extraido `buildSettingsLocationPanelState()` com textos/status dos gates de permissao.
- Etapa 1.122: extraido `buildSettingsSecurityCodePanelState()` com status e labels publicos do codigo de seguranca.
- `app/configuracoes.tsx` continua responsavel por efeitos reais: pedir permissao, abrir ajustes do sistema, validar/hash de codigo, limpar acesso protegido, persistir preferencias, login/API/storage/camera/microfone/localizacao/navegacao.

Validacoes:

- `test:settings-presentation`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e com 0% CPU; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de policy sem runtime nativo.

Checkpoint:

- `docs/182_CHECKPOINT_ETAPAS_1_121_1_122_SETTINGS_LOCATION_SECURITY_POLICY_2026-05-21.md`.

## 2026-05-22 - Etapas 1.123 e 1.124 compartilhamento e video em Configuracoes

Status: refatoracao pura implementada e validada.

Executado:

- `settingsPresentationPolicy` passou a centralizar tambem modelos puros dos paineis de compartilhamento e video local.
- Etapa 1.123: extraido `buildSettingsSharingPanelState()` com resumo de anjo convidado, labels, bloqueios e chaves das acoes de compartilhamento.
- Etapa 1.124: extraido `buildSettingsVideoPanelState()` com labels e selecao dos botoes de video/camera.
- `app/configuracoes.tsx` continua responsavel por efeitos reais: ligar 190 junto com SOS, alternar stream para anjos, salvamento protegido pelo anjo, permissoes reais de camera/microfone, trocar camera, persistir preferencias e executar handlers.
- `scripts/smoke-test.mjs` foi sincronizado para validar os textos contratuais de anjo/190 na policy em vez de exigir texto hard-coded na tela.

Validacoes:

- `test:settings-presentation`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e com 0% CPU; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de policy sem runtime nativo.

Checkpoint:

- `docs/183_CHECKPOINT_ETAPAS_1_123_1_124_SETTINGS_SHARING_VIDEO_POLICY_2026-05-22.md`.

## 2026-05-22 - Etapas 1.125 e 1.126 atualizacao e login em Configuracoes

Status: refatoracao pura implementada e validada.

Executado:

- `settingsPresentationPolicy` passou a centralizar tambem modelos puros dos paineis de atualizacao e login.
- Etapa 1.125: extraido `buildSettingsUpdatePanelState()` com labels, estados visuais e bloqueios dos botoes de atualizacao.
- Etapa 1.126: extraido `buildSettingsLoginPanelState()` com status da conta, API, dispositivo, Google, Apple e labels/bloqueios de botoes.
- `app/configuracoes.tsx` continua responsavel por efeitos reais: validar sessao, login/logout, bootstrap autenticado, limpeza de sessao, consulta de API, Google/Apple, verificacao de atualizacao, abertura do portal e estado React.
- `scripts/smoke-test.mjs` foi sincronizado para validar texto de dispositivo autenticado na policy sem perder o contrato de bootstrap/logout na tela.

Validacoes:

- `test:settings-presentation`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e praticamente ocioso; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de policy sem runtime nativo.

Checkpoint:

- `docs/184_CHECKPOINT_ETAPAS_1_125_1_126_SETTINGS_UPDATE_LOGIN_POLICY_2026-05-22.md`.

## 2026-05-22 - Etapas 1.127 e 1.128 acoes de atualizacao e login em Configuracoes

Status: refatoracao pura implementada e validada.

Executado:

- `settingsPresentationPolicy` passou a centralizar tambem as acoes tipadas dos paineis de atualizacao e login.
- Etapa 1.127: `buildSettingsUpdatePanelState()` agora retorna acoes `verify-update` e `download-update`, mantendo os efeitos reais em `app/configuracoes.tsx`.
- Etapa 1.128: `buildSettingsLoginPanelState()` agora retorna acoes de validar sessao, sair, e-mail, API, Google e Apple, mantendo autenticacao, bootstrap, logout, API e provedores externos na tela.
- `app/configuracoes.tsx` ganhou `handleUpdatePanelAction()` e `handleLoginPanelAction()` apenas como roteadores das intencoes tipadas para handlers reais ja existentes.
- `scripts/smoke-test.mjs` foi sincronizado para validar as chaves tipadas e impedir regressao para botoes hard-coded sem contrato.

Validacoes:

- `test:settings-presentation`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e ocioso; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de policy/action routing sem runtime nativo.

Checkpoint:

- `docs/185_CHECKPOINT_ETAPAS_1_127_1_128_SETTINGS_ACTIONS_POLICY_2026-05-22.md`.

## 2026-05-22 - Etapas 1.129 e 1.130 preferencias de compartilhamento e video em Configuracoes

Status: refatoracao pura implementada e validada.

Executado:

- `settingsPresentationPolicy` passou a centralizar decisoes puras de preferencias sensiveis da tela `Configuracoes`.
- Etapa 1.129: extraidas funcoes puras para 190 junto com SOS, escopos futuros de anjos autorizados e salvamento protegido no app do anjo.
- Etapa 1.130: extraidas funcoes puras para ativar/desativar video local no SOS e trocar modo de camera local.
- `app/configuracoes.tsx` continua responsavel por executar `updatePreferences()`, solicitar permissoes reais de camera/microfone, estado React e handlers.
- `scripts/smoke-test.mjs` foi sincronizado para validar `trustedStream.status = "homologation_blocked"` e `localVideoCapture.status = "enabled_local"` na policy.

Validacoes:

- `test:settings-presentation`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e ocioso; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de policy sem runtime nativo.

Checkpoint:

- `docs/186_CHECKPOINT_ETAPAS_1_129_1_130_SETTINGS_PREFERENCES_POLICY_2026-05-22.md`.

## 2026-05-22 - Etapas 1.131 e 1.132 termos e duracao em Configuracoes

Status: refatoracao pura implementada e validada; tela `Configuracoes` encerrada nesta fase.

Executado:

- `settingsPresentationPolicy` passou a centralizar tambem estado/acao visual do painel `Termos e privacidade`.
- Etapa 1.131: extraido `buildSettingsLegalPanelState()` com itens de resumo e acao de aceite local.
- Etapa 1.132: extraido `buildSettingsDurationPanelState()` com acoes tipadas de duracao, labels por `formatDuration()` e estilo selecionado.
- `app/configuracoes.tsx` continua responsavel por `acceptLegalConsent()`, `acceptedAt`, persistencia de duracao, `updatePreferences()`, estado React e handlers reais.
- `scripts/smoke-test.mjs` foi sincronizado para validar os novos contratos de policy e handlers finos.

Validacoes:

- `test:settings-presentation`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e ocioso; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de policy sem runtime nativo.

Checkpoint:

- `docs/187_CHECKPOINT_ETAPAS_1_131_1_132_SETTINGS_LEGAL_DURATION_POLICY_2026-05-22.md`.

## 2026-05-22 - Etapas 1.133 e 1.134 apresentacao de Alertas recebidos

Status: refatoracao pura implementada e validada.

Executado:

- Iniciada a proxima area apos `Configuracoes`: `app/alerta.tsx`.
- Etapa 1.133: criada `src/features/live-call/receivedAlertPresentationPolicy.ts` para centralizar data, ordenacao de pedidos recebidos, label de fase e label de status do arquivo local.
- Etapa 1.134: extraida a apresentacao pura do card de pedido recebido e do bloco de chamada recebida: titulo, corpo, status, labels, acessibilidade e gates visuais derivados.
- `app/alerta.tsx` continua responsavel pelos efeitos reais: API, aceite/recusa/visualizacao, notificacao, chamada em tempo real, arquivo local, Share e sincronizacao.
- `scripts/smoke-test.mjs` foi sincronizado para validar os textos contratuais na policy e manter checks de API/tempo real na tela.

Validacoes:

- `test:received-alert-presentation`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e ocioso por mais de 1 minuto; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de policy sem runtime nativo.

Checkpoint:

- `docs/188_CHECKPOINT_ETAPAS_1_133_1_134_RECEIVED_ALERT_PRESENTATION_POLICY_2026-05-22.md`.

## 2026-05-22 - Etapas 1.135 e 1.136 runtime de Alertas recebidos

Status: refatoracao pura implementada e validada.

Executado:

- Criada `src/features/live-call/receivedAlertRuntimePolicy.ts` para regras puras do runtime de alertas recebidos.
- Etapa 1.135: extraidos guardas puros de chamada ativa, preservando bloqueio contra iniciar a mesma sessao novamente ou outra sessao enquanto uma chamada segue ativa.
- Etapa 1.136: extraidas decisoes puras de arquivo local: status `connected`/`failed`, registro existente, registro ausente e encerramento de registro.
- `app/alerta.tsx` continua responsavel pelos efeitos reais: autoaceite, notificacao, API, WebRTC, storage seguro, refs mutaveis, reset de chamada, Share e estado React.
- `scripts/smoke-test.mjs` foi sincronizado para validar a nova policy sem enfraquecer os checks de autoaceite autorizado, arquivo local e tempo real.

Validacoes:

- `test:received-alert-runtime`, `test:received-alert-presentation`, `test:live-call-history`, `smoke-test`, `lint`, `private:android:readiness` e `npm test`: aprovados.
- `typecheck` nao emitiu erro, mas ficou sem saida e ocioso por mais de 1 minuto; foi encerrado para nao deixar processo pendurado.
- Sem build Android por ser mudanca pura de policy sem runtime nativo.

Checkpoint:

- `docs/189_CHECKPOINT_ETAPAS_1_135_1_136_RECEIVED_ALERT_RUNTIME_POLICY_2026-05-22.md`.
