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

## Limite tecnico atual

O `expo-video` atual recebe uma URI de midia. A reproducao funcional desta etapa usa um servidor HTTP local fechado em `127.0.0.1`, criado apenas enquanto o player esta aberto. A URL contem uma capacidade aleatoria por sessao, aceita apenas `GET`/`HEAD`, rejeita multirange e ranges invalidos, e nao registra chave, URL ou bytes sensiveis em log.

Esta ponte ja evita materializar arquivo claro completo durante playback e viabiliza videos maiores com seek/replay. Para producao final, ainda deve ser substituida ou complementada por:

- `EncryptedVideoDataSource` ligado ao player nativo como data source/range reader; ou
- hardening nativo do loopback com lifecycle/telemetria de baixo nivel, se a rota nativa nao for adotada.

Esta etapa implementa a camada segura, impede abertura direta de ciphertext e entrega playback interno funcional por `Range`. O diretorio `cache/Camera/*.mp4` vem da captura nativa do Expo Camera antes da preservacao criptografada; nao e cache de playback. O hardening C2 limpa esses residuos somente depois que a preservacao cifrada foi reaberta e verificada.

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
   - envelope da chave do video com chave publica de destinatario;
   - contrato de compartilhamento cliente-servidor-cliente e P2P;
   - cota, retencao, limpeza de orfaos e trilha de auditoria ampliada.

## Validacoes

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado, incluindo `scripts/encrypted-video-store.test.ts`.
- `npm run build:android:private`: aprovado em 2026-05-06, APK debug bundled gerado.
- Android fisico via ADB: APK instalado, SOS iniciou sem travar, encerramento preservou video e player abriu midia interna.
- Evidencias Android: `../../docs/evidencias/android/2026-05-06-player-duration/`.
- Validacao de duracao: video de 1min01s preservado com 47 chunks protegidos e reproduzido; video final de 33s preservado com 13 chunks protegidos e reproduzido.
- Validacao Player Seguro: evidencias em `../../docs/evidencias/android/2026-05-06-player-preload-controls/`; APK SHA-256 `f19623b9b9aa10d7cbd1262c3b1ad2a864d32db91acefd7a0974091366660df2`; preload automatico, primeiro frame, timeline `0:00 / 0:31`, play/pause, seek para `0:24 / 0:31`, fullscreen nativo e retorno ao modal validados no Android fisico `192.168.0.4:5555`.
- Validacao Player Seguro por `Range`: evidencias em `../../docs/evidencias/android/2026-05-06-player-range-streaming/`; APK SHA-256 `82e1ab82251a9ed812204bb06021e41f0ebd627d5c8bc6a6d26ff45e1c1c46e1`; abertura com primeiro frame, timeline `0:00 / 0:32`, seek para `0:24 / 0:31`, fullscreen nativo em `00:25 / 00:32`, reproducao completa ate `0:31 / 0:31` e replay em `0:01 / 0:31` com botao `Pausar` validados no Android fisico `192.168.0.4:5555`.
- Validacao C2 de residuos e thumbnail: evidencias em `../../docs/evidencias/android/2026-05-06-capture-cleanup-thumbnail/`; APK SHA-256 `024150800908109199f84e1be2ef5bd9c72ae1f6986ecee0a8269f2c44ca1323`; SOS iniciou e encerrou no Android fisico, asset `7c967904-589c-452c-85fc-8203aee83be9` foi preservado com `manifest.sseg`, 22 chunks e `thumbnail.sseg`; inventario ADB absoluto confirmou `cache/Camera` vazio, `cache/VideoThumbnails` vazio e nenhum `.mp4` claro nesses caches apos preservacao.

## Arquivos principais

- `src/features/emergency/VideoCryptoService.ts`: servico POO de chave, nonce, cifragem e decifragem AEAD.
- `src/features/emergency/EncryptedVideoManifest.ts`: contrato puro do manifesto e AAD.
- `src/features/emergency/EncryptedVideoStore.ts`: preservacao, manifesto, chunks, chave local e exclusao.
- `src/features/emergency/EncryptedVideoDataSource.ts`: leitura e streaming por range para seek/replay/descriptografia sob demanda.
- `src/features/emergency/EncryptedVideoRangeHttp.ts`: parser e headers HTTP puros para `Range`, `HEAD`, `GET` e erros controlados.
- `src/features/emergency/EncryptedVideoLoopbackServer.ts`: servidor local efemero em `127.0.0.1` para entregar somente faixas descriptografadas ao `expo-video`.
- `src/features/emergency/EncryptedVideoPlaybackCache.ts`: compatibilidade/limpeza do cache transitorio legado, sem uso como caminho principal do player criptografado.
- `src/features/emergency/SecureVideoThumbnailStore.ts`: derivacao de thumbnail, criptografia autenticada e exclusao da thumbnail temporaria clara.
- `src/features/emergency/CameraCaptureResidueCleaner.ts`: limpeza restrita dos residuos `.mp4` do cache nativo de camera apos preservacao verificada.
- `src/features/emergency/mediaCapture.ts`: ponte minima entre gravacao atual e store criptografado.
- `src/components/EvidencePlayerCard.tsx`: inicia preload automatico do asset selecionado, aborta preparo antigo, exibe progresso, timeline controlavel e fullscreen.
- `scripts/encrypted-video-store.test.ts`: testes unitarios de criptografia e leitura parcial.
