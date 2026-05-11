# 30 - Midia Criptografada em Chunks

Responsavel da tarefa: Ada  
Coordenacao: Ze  
Validacao obrigatoria: Schneier e Myers  
Data: 2026-05-06

## Objetivo

Preparar o app para videos grandes sem travar a interface, com armazenamento local criptografado e modelo compativel com arquiteturas cliente-servidor-cliente e P2P futuras.

## Estado implementado

- Gravacao continua centralizada em `EmergencyMediaRecorder`.
- Preservacao local passa por `EncryptedVideoStore`, sem copiar MP4 claro definitivo para o sandbox.
- Cada video recebe chave simetrica unica de 32 bytes.
- Chunks sao lidos por faixa com `position` e `length`, cifrados individualmente e salvos em `sinalseguro-media-encrypted/<assetId>/chunks/`.
- Algoritmo atual: XChaCha20-Poly1305, AEAD autenticado com nonce de 24 bytes por chunk.
- Manifesto seguro descreve chunks, offsets, tamanhos, hashes, nonces, tags, codec, duracao pendente, thumbnail pendente e envelopes de destinatarios futuros.
- Manifesto tambem e cifrado/autenticado e salvo como `manifest.sseg`.
- Chave local fica em `SecureStore` por `keyRef`, fora do manifesto e fora do Git.
- `EncryptedVideoDataSource` permite leitura por chunk/range para seek, replay e reproducao parcial sem materializar arquivo descriptografado completo.
- Exclusao do cofre remove diretorio cifrado e chave local.
- Player interno nao tenta abrir ciphertext como video.
- Player atual prepara automaticamente apenas o video selecionado ao abrir o Player, abrindo uma sessao local `127.0.0.1` com URL de capacidade efemera e suporte a `Range`.
- A reproducao Android descriptografa somente os chunks/faixas solicitados pelo player, sem gerar MP4 claro completo no cache de playback.
- Timeline custom mostra tempo atual/duracao, aceita toque/arraste para seek quando o asset esta pronto e usa duracao do manifesto/asset como fallback ate o player nativo publicar `duration`.
- Tela cheia usa `VideoView.enterFullscreen()` com controles nativos aceitos no Android nesta fase por limite do `expo-video`.
- Android usa captura frontal como padrao de homologacao e converte configuracao `both` para `frontal (modo leve)`, evitando montar duas cameras simultaneas em aparelhos que nao sustentam captura dupla.
- Chunks novos usam 512 KB para reduzir overhead de I/O/criptografia mantendo faixa pequena o suficiente para adaptador de range futuro.
- A preservacao agora reabre e verifica chave local, manifesto, chunks, hashes agregados e thumbnail criptografada antes de apagar qualquer MP4 claro temporario da captura.
- Thumbnail segura e gerada a partir do video original, cifrada como `thumbnail.sseg` com AAD proprio e a thumbnail clara temporaria e apagada em `finally`.
- `cache/Camera/*.mp4` e `cache/VideoThumbnails/*` sao limpos apos preservacao verificada; em falha de preservacao, o MP4 claro original nao e apagado automaticamente para evitar perda de evidencia antes de existir copia cifrada valida.
- Frente 1.2 adicionou diagnostico local saneado em `MediaDiagnostics`, sem log livre e sem rede, registrando apenas duracoes, contagens, tamanhos agregados e status por etapa.
- O snapshot de diagnostico fica no envelope local do asset criptografado como `encryptedVideo.diagnostics`, com eventos de captura, preservacao, thumbnail, verificacao, limpeza, abertura de loopback, streaming e proxy de primeiro progresso do player.
- A telemetria filtra nomes e valores sensiveis: nao persistir URI, URL, caminho, chave, token, nonce, tag, hash, coordenada, payload, e-mail, IP ou capability.
- Registros locais grandes do cofre nao sao mais gravados inteiros no SecureStore: `secureJsonStore` cifra o JSON com XChaCha20-Poly1305 em AsyncStorage e preserva no SecureStore apenas a chave pequena do namespace.
- A Frente 1.2 adicionou manutencao de residuos legados em `PlaintextMediaResidueCleaner`: videos `.mp4` claros ainda referenciados sao primeiro migrados para asset cifrado e so depois apagados; `.mp4` legado nao referenciado e removido.
- No iOS Release fisico, a captura de homologacao passou a usar H.264 (`avc1`) em segmento curto: o primeiro segmento e preservado como asset cifrado e o ciclo pesado e encerrado para nao degradar o aparelho durante o SOS.
- O encerramento manual no iOS agora mantem o gravador montado enquanto sinaliza `stopRecording` e aguarda ate 9s pela liquidacao de `recordAsync`; somente depois chama `finishEmergencyPackage`, evitando desmontar a camera antes da preservacao cifrada.
- A captura iOS usa `videoQuality="4:3"`, porque as qualidades `480p`, `720p`, `1080p` e `2160p` sao tratadas como Android pela API local do `expo-camera`; Android permanece em `480p`.
- Pacotes sem asset de video agora podem receber diagnostico local saneado de captura, exibido no cofre/player, para diferenciar camera que nao montou, camera que nao retornou arquivo, erro de gravacao e permissao negada.

## Limite tecnico atual

O `expo-video` atual recebe uma URI de midia. A reproducao funcional desta etapa usa um servidor HTTP local fechado em `127.0.0.1`, criado apenas enquanto o player esta aberto. A URL contem uma capacidade aleatoria por sessao, aceita apenas `GET`/`HEAD`, rejeita multirange e ranges invalidos, e nao registra chave, URL ou bytes sensiveis em log.

Esta ponte ja evita materializar arquivo claro completo durante playback e viabiliza videos maiores com seek/replay. Para producao final, ainda deve ser substituida ou complementada por:

- `EncryptedVideoDataSource` ligado ao player nativo como data source/range reader; ou
- hardening nativo do loopback com lifecycle/telemetria de baixo nivel, se a rota nativa nao for adotada.

Esta etapa implementa a camada segura, impede abertura direta de ciphertext e entrega playback interno funcional por `Range`. O diretorio `cache/Camera/*.mp4` vem da captura nativa do Expo Camera antes da preservacao criptografada; nao e cache de playback. O hardening C2 limpa esses residuos somente depois que a preservacao cifrada foi reaberta e verificada. A Frente 1.2 tambem cobre residuos legados do antigo diretorio privado `sinalseguro-media`, migrando ativos referenciados para o formato cifrado antes da exclusao.

## Plano por fases

1. Fase A - concluida nesta rodada:
   - store criptografado por chunks;
   - manifesto cifrado/autenticado;
   - fonte de dados por range;
   - testes unitarios de chunk, seek, replay, corrupcao e chave invalida;
   - smoke test atualizado.
2. Fase B - concluida nesta rodada:
   - player interno funcional com preload automatico do asset selecionado;
   - cancelamento de preparo anterior quando o usuario troca de video;
   - controles customizados de play/pause, reiniciar, fullscreen e timeline com seek;
   - reducao de travamento com captura Android em modo leve e chunks de 512 KB.
3. Fase C1 - concluida nesta rodada:
   - servidor loopback local `Range` para `expo-video`;
   - descriptografia sob demanda por chunks, sem MP4 claro completo no cache de playback;
   - cancelamento/fechamento de sessao ao trocar asset, desmontar player ou app ir para background;
   - testes unitarios dos helpers HTTP de range e streaming parcial.
4. Fase C2 - concluida nesta rodada:
   - thumbnail segura derivada sem persistir video claro completo;
   - limpeza automatica dos residuos temporarios de captura `cache/Camera` e `cache/VideoThumbnails` apos preservacao verificada;
   - metadado `plaintextCleanup` no asset para auditar `deleted` ou `cleanup_pending`;
   - testes unitarios de thumbnail criptografada, falha controlada de thumbnail e limpeza restrita a residuos `.mp4` do cache de camera;
   - avaliar data source nativo para substituir o loopback quando o app sair da homologacao.
5. Fase D - posterior:
   - diagnostico fisico Android/iOS com telemetria saneada da Frente 1.2;
   - envelope da chave do video com chave publica de destinatario;
   - contrato de compartilhamento cliente-servidor-cliente e P2P;
   - cota, retencao, limpeza de orfaos e trilha de auditoria ampliada.
6. Fase E - obrigatoria antes de producao:
   - substituir JS/Base64/loopback por captura nativa segmentada, criptografia nativa por segmento e player nativo/data source cifrado;
   - manter nenhum video claro completo persistido permanentemente;
   - preparar upload futuro apenas de segmentos cifrados.

## Validacoes

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado, incluindo `scripts/encrypted-video-store.test.ts`.
- `npm run build:android:private`: aprovado em 2026-05-06, APK debug bundled gerado.
- Android fisico via ADB: APK instalado, SOS iniciou sem travar, encerramento preservou video e player abriu midia interna.
- Evidencias Android: `../../docs/evidencias/android/2026-05-06-player-duration/`.
- Validacao de duracao: video de 1min01s preservado com 47 chunks protegidos e reproduzido; video final de 33s preservado com 13 chunks protegidos e reproduzido.
- Validacao Player Seguro: evidencias em `../../docs/evidencias/android/2026-05-06-player-preload-controls/`; APK SHA-256 `f19623b9b9aa10d7cbd1262c3b1ad2a864d32db91acefd7a0974091366660df2`; preload automatico, primeiro frame, timeline `0:00 / 0:31`, play/pause, seek para `0:24 / 0:31`, fullscreen nativo e retorno ao modal validados no Android fisico.
- Validacao Player Seguro por `Range`: evidencias em `../../docs/evidencias/android/2026-05-06-player-range-streaming/`; APK SHA-256 `82e1ab82251a9ed812204bb06021e41f0ebd627d5c8bc6a6d26ff45e1c1c46e1`; abertura com primeiro frame, timeline `0:00 / 0:32`, seek para `0:24 / 0:31`, fullscreen nativo em `00:25 / 00:32`, reproducao completa ate `0:31 / 0:31` e replay em `0:01 / 0:31` com botao `Pausar` validados no Android fisico.
- Validacao C2 de residuos e thumbnail: evidencias em `../../docs/evidencias/android/2026-05-06-capture-cleanup-thumbnail/`; APK SHA-256 `024150800908109199f84e1be2ef5bd9c72ae1f6986ecee0a8269f2c44ca1323`; SOS iniciou e encerrou no Android fisico, asset `7c967904-589c-452c-85fc-8203aee83be9` foi preservado com `manifest.sseg`, 22 chunks e `thumbnail.sseg`; inventario ADB absoluto confirmou `cache/Camera` vazio, `cache/VideoThumbnails` vazio e nenhum `.mp4` claro nesses caches apos preservacao.
- Validacao Frente 1.2 em Android fisico: gravacao longa reproduziu CPU sustentada acima do aceitavel apos cerca de 50s, confirmando necessidade de refatoracao nativa para producao; correcao incremental migrou registros grandes para envelope cifrado em AsyncStorage, eliminou aviso de SecureStore >2048 bytes, reconciliou residuos legados `.mp4` de 3 para 0 e abriu/reproduziu video cifrado de homologacao no Player Seguro.
- Validacao Frente 1.2 em iOS fisico: o build `Release` inicial instalou e abriu, mas testes manuais mostraram pacotes com duracao/localizacao e sem asset (`Sem midia`, `Nenhum video neste arquivo`); o container confirmou ausencia de `manifest.sseg`/chunks.
- Atualizacao iOS 2026-05-08: apos o botao ser corrigido, novo teste manual com mais de 30s ainda produziu pacote `Sem midia`; foi aplicada correcao de qualidade iOS `4:3` e diagnostico persistido no pacote.
- Log operacional iOS 2026-05-08: evidenciou camera pronta e `recordAsync` iniciado, mas `capture_component_cleanup` ocorreu com `recordingActive=true` antes de qualquer `capture_record_async_result` ou `capture_preserve_success`; a correcao atual aguarda o stop da midia antes de finalizar o pacote.
- Build `Release` iOS recompilado e instalado no iPhone fisico apos a correcao de espera do stop; launch automatico ficou bloqueado pelo lockscreen. Validacao final depende de iPhone desbloqueado para SOS manual de pelo menos 20s, encerramento pelo botao e conferencia de `manifest.sseg`/chunks ou timeout tecnico saneado.
- Teste 10:35 no iPhone: apos corrigir a ordem de encerramento, `recordAsync` passou a falhar imediatamente no primeiro segmento, antes da preservacao; a captura iOS agora usa warm-up antes de gravar e retry controlado para falhas rapidas, alem de bloquear duplo acionamento do SOS enquanto o pacote ainda esta sendo criado.

## Arquivos principais

- `src/features/emergency/VideoCryptoService.ts`: servico POO de chave, nonce, cifragem e decifragem AEAD.
- `src/features/emergency/EncryptedVideoManifest.ts`: contrato puro do manifesto e AAD.
- `src/features/emergency/EncryptedVideoStore.ts`: preservacao, manifesto, chunks, chave local e exclusao.
- `src/features/emergency/EncryptedVideoDataSource.ts`: leitura e streaming por range para seek/replay/descriptografia sob demanda.
- `src/features/emergency/EncryptedVideoRangeHttp.ts`: parser e headers HTTP puros para `Range`, `HEAD`, `GET` e erros controlados.
- `src/features/emergency/EncryptedVideoLoopbackServer.ts`: servidor local efemero em `127.0.0.1` para entregar somente faixas descriptografadas ao `expo-video`.
- `src/features/emergency/EncryptedVideoPlaybackCache.ts`: compatibilidade/limpeza do cache transitorio legado, sem uso como caminho principal do player criptografado.
- `src/features/emergency/MediaDiagnostics.ts`: diagnostico local saneado para Frente 1.2, sem log livre e sem rede.
- `src/features/emergency/MediaOperationalLog.ts`: log operacional iOS persistente e saneado para diagnostico fisico de captura sem asset.
- `src/features/emergency/mediaInterfacePresentation.ts`: rotulos de protecao, contagem e causa tecnica saneada para pacotes sem video.
- `src/features/emergency/PlaintextMediaResidueCleaner.ts`: reconciliacao de videos claros legados referenciados e exclusao de residuos `.mp4` nao referenciados.
- `src/features/emergency/SecureVideoThumbnailStore.ts`: derivacao de thumbnail, criptografia autenticada e exclusao da thumbnail temporaria clara.
- `src/features/emergency/CameraCaptureResidueCleaner.ts`: limpeza restrita dos residuos `.mp4` do cache nativo de camera apos preservacao verificada.
- `src/storage/secureJsonStore.ts`: cofre de registros JSON com envelope cifrado em AsyncStorage e chave pequena por namespace no SecureStore.
- `src/features/emergency/EmergencyMediaRecorder.tsx`: captura local; no iOS usa segmentos curtos H.264 preservados imediatamente para reduzir perda de midia no encerramento.
- `src/features/emergency/mediaCapture.ts`: ponte minima entre gravacao atual e store criptografado.
- `src/features/emergency/SinalSeguroMediaEngine.ts`: ponte JS para motor nativo versionado, com fallback quando o modulo nao esta disponivel.
- `src/components/EvidencePlayerCard.tsx`: inicia preload automatico do asset selecionado, aborta preparo antigo, exibe progresso, timeline controlavel e fullscreen.
- `plugins/with-sinalseguro-media-engine.js`: config plugin e sincronizador local para arquivos nativos regeneraveis.
- `plugins/native-media-engine/`: templates Android Kotlin e iOS Swift/ObjC do motor nativo.
- `scripts/encrypted-video-store.test.ts`: testes unitarios de criptografia e leitura parcial.

## Checkpoint nativo 2026-05-09

A Frente 1.2 passou a ter uma ponte nativa persistente, sem trocar ainda o formato principal dos ativos ja existentes.

Decisoes:

- ativos gerados pelo store atual continuam `storageEngine: "js_chunked_v1"` e `playbackAdapter: "range_data_source_required"`;
- ativos futuros podem declarar `storageEngine: "native_segmented_v1"` e `playbackAdapter: "native_encrypted_source"`;
- o player tenta abrir fonte nativa somente nesse segundo caso; se nao houver ativo nativo, permanece no loopback local de homologacao;
- campos `keyId`, `packageId`, `emergencySessionId`, `envelopeScope` e `recipientKeyEnvelopes` ficam prontos para envelopes por destinatario/P2P futuro;
- nenhum upload, rede de anjos, WebRTC completo, localizacao de midia ou conveniado foi habilitado.

Motor nativo versionado:

- Android: modulo Kotlin via React Native package manual, AES-256-GCM, arquivos restritos ao storage privado do app, handles de playback saneados e limpeza de `cache/sinalseguro-native-media`;
- iOS: templates Swift/ObjC com CryptoKit/AES-GCM e restricao a Documents/Caches/Application Support/tmp;
- persistencia: config plugin `plugins/with-sinalseguro-media-engine.js`, porque `android/` e `ios/` sao regeneraveis/ignorados.

Validacoes:

- `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:crypto`, `npm run test:device-keys` e `git diff --check`: aprovados;
- build Android privado aprovado, SHA-256 `9d60f820a4dc8d9556482df957b409637b111ab5988a0e8122da6cc03879f9bc`;
- visual web local de Home, Player e Cofre verificado sem quebra visual aparente;
- iOS build/test pendente por falta de gate de espaco e Pods ausentes apos limpeza.

## Hotfix iOS 2026-05-08

O teste fisico das 11:16 confirmou que o iPhone ja conseguia gravar e criar chunks cifrados, mas o pipeline JS/base64 era lento demais para a experiencia de encerramento:

- arquivo temporario claro: cerca de 4,8 MB;
- chunks gerados: 10;
- criptografia: aproximadamente 29s;
- verificacao completa: aproximadamente 27s;
- resultado visivel: cofre aberto antes do anexo, aparentando `Sem midia`.

Medidas aplicadas para homologacao:

- captura iOS em H.264 (`avc1`), `480p` e bitrate alvo controlado;
- chunk iOS de 2 MB;
- verificacao `bounded` no iOS, com chave, manifesto autenticado, consistencia de metadados e chunks de borda;
- autenticacao completa permanece no player sob demanda, porque cada chunk e AEAD e tem hash individual;
- timeout de encerramento subiu para 30s e o app bloqueia encerramentos repetidos.

Hotfix adicional do mesmo dia:

- logs fisicos posteriores mostraram que o iPhone criava assets cifrados, mas ficava preso em ciclo de gravacao/criptografia/verificacao a cada segmento;
- durante esse ciclo o toque de encerramento podia atrasar ou nao entrar no handler, mantendo o SOS ativo e a UX lenta;
- a homologacao iOS passa a limitar a captura local a um segmento curto por chamado, preservado no cofre, enquanto Android permanece no fluxo funcional ja validado;
- o cofre/player atualizam a lista ao abrir e a home limpa residuos de camera quando nao ha chamado ativo.

Risco aceito por Schneier para homologacao:

- a verificacao `bounded` nao reabre todos os chunks no encerramento; corrupcao de chunk intermediario sera detectada no playback/range;
- o video claro temporario so pode ser removido depois de manifest/chunks verificados no modo configurado;
- o iOS fisico de homologacao registra apenas um segmento local ate a refatoracao nativa, para evitar travamento e residuo claro prolongado;
- para producao, a decisao continua sendo migrar para criptografia nativa por segmento e player/data source nativo.

## Complemento nativo 2026-05-10 - `native_segmented_v1`

A Frente 1.2 passou a usar a ponte nativa como caminho principal para novos ativos quando disponivel.

Contrato:

- `js_chunked_v1` continua valido para ativos legados e homologacao;
- `native_segmented_v1` usa `aes-256-gcm`, `playbackAdapter: "native_encrypted_source"` e metadados `nativePlayback`;
- `recipientKeyEnvelopes` permanece preparatorio; nenhum envelope real de anjo foi criado nesta frente;
- `captureProfile`, `packageId`, `keyId` e `emergencySessionId` existem para compatibilidade futura, sem chamada real, upload ou localizacao.

Preservacao:

- Android cifra por stream em blocos e calcula hashes de plaintext/ciphertext incrementalmente;
- a chave fica no SecureStore e o segmento cifrado fica no sandbox privado;
- falhas devem remover chave orfa, segmento parcial e registrar apenas erro saneado;
- iOS tem template AES-GCM, mas ainda nao esta liberado para videos longos enquanto usar leitura integral do arquivo.

Playback:

- `.nseg` nao e fonte tocavel para `expo-video`;
- o app prepara MP4 temporario em cache privado/no-backup antes do play e exibe progresso;
- o temporario e apagado ao fechar player, trocar midia, app ir para background, expirar TTL ou na limpeza de boot;
- loopback fica somente como fallback para `js_chunked_v1`.

Checkpoint Android:

- APK final validado no Android fisico curto: SHA-256 `5e664df9a9982569a0ce05e737af01fcc105057d892438e10ffbe07ac1f28afd`;
- inventario saneado confirmou ausencia de midia clara persistente apos fechamento do player;
- Frente 1.2 continua pendente de Android 60s/3min/5min e iPhone fisico antes de fechamento.
