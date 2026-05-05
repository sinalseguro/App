# 30 - Midia Criptografada em Chunks

Responsavel da tarefa: Ada  
Coordenacao: Ze  
Validacao obrigatoria: Schneier e Myers  
Data: 2026-05-05

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
- Player interno nao tenta abrir ciphertext como video. Assets criptografados ficam marcados como dependentes de adaptador de range local.

## Limite tecnico atual

O `expo-video` atual recebe uma URI de midia. Para reproduzir video criptografado sob demanda sem gerar arquivo descriptografado completo, falta uma das duas pecas nativas:

- `EncryptedVideoDataSource` ligado ao player nativo como data source/range reader; ou
- servidor HTTP local com suporte a `Range`, autenticado e fechado ao loopback, que descriptografa somente os bytes solicitados.

Esta etapa implementa a camada segura e impede regressao para playback inseguro. A reproducao direta de assets legados ainda funciona; a reproducao de assets cifrados deve ser liberada apenas quando o adaptador de range estiver implementado.

## Plano por fases

1. Fase A - concluida nesta rodada:
   - store criptografado por chunks;
   - manifesto cifrado/autenticado;
   - fonte de dados por range;
   - testes unitarios de chunk, seek, replay, corrupcao e chave invalida;
   - smoke test atualizado.
2. Fase B - proxima:
   - adaptador local de reproducao por range para `expo-video`;
   - medicao de tempo ate primeiro frame, memoria e CPU em Android real;
   - thumbnail segura derivada sem persistir video claro completo.
3. Fase C - posterior:
   - envelope da chave do video com chave publica de destinatario;
   - contrato de compartilhamento cliente-servidor-cliente e P2P;
   - cota, retencao, limpeza de orfaos e trilha de auditoria ampliada.

## Validacoes

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado, incluindo `scripts/encrypted-video-store.test.ts`.

## Arquivos principais

- `src/features/emergency/VideoCryptoService.ts`: servico POO de chave, nonce, cifragem e decifragem AEAD.
- `src/features/emergency/EncryptedVideoManifest.ts`: contrato puro do manifesto e AAD.
- `src/features/emergency/EncryptedVideoStore.ts`: preservacao, manifesto, chunks, chave local e exclusao.
- `src/features/emergency/EncryptedVideoDataSource.ts`: leitura por range para seek/replay/descriptografia sob demanda.
- `src/features/emergency/mediaCapture.ts`: ponte minima entre gravacao atual e store criptografado.
- `src/components/EvidencePlayerCard.tsx`: bloqueia abertura direta de ciphertext no player URI.
- `scripts/encrypted-video-store.test.ts`: testes unitarios de criptografia e leitura parcial.
