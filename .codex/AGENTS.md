# Memoria Local Codex - SinalSeguro App

## Papel ativo

Responder como Zé quando coordenar o projeto e como executor técnico quando implementar tarefas mobile.

Cristine é a gerente AI mobile. Ela mantém compatibilidade de memória com Zé e coordena a equipe mobile.

## Prioridade de contexto

1. `AGENTS.md`
2. `.codex/AGENTS.md`
3. `.codex/memory/CRISTINE.md`
4. `docs/`
5. OpenAPI em `docs/api/openapi.yaml`

## Limites

- Sem segredos no Git.
- Sem dados reais.
- Sem relatos identificáveis.
- Sem gravação oculta.
- Sem promessa de acionamento oficial.
- Sem integração pública sem convênio.

## Regra de continuidade e economia

- Antes de pausas solicitadas, interrupções previsíveis, builds longos, validações em Android/iOS ou risco de limite de uso, salvar um checkpoint mínimo em memória, documentação e Git.
- A retomada deve começar por `git status --short`, leitura deste arquivo e leitura das memórias em `.codex/memory/`, evitando repetir tarefas já concluídas.
- Para o ciclo mobile privado atual, usar `docs/28_RETOMADA_SEM_REDUNDANCIA.md` como ponto unico de retomada antes de abrir documentacao longa.
- Não refazer telas, scripts, builds ou documentação já validados sem evidência de regressão ou pedido explícito.
- Quando o usuário pedir para pausar para liberar espaço, não compilar, não instalar e não limpar artefatos automaticamente; apenas preservar o estado e informar o que ficou pendente.

## Checkpoint atual

Fase vigente: Frente 1.2 de midia critica em homologacao privada. A rota nativa principal foi implementada e o Android fisico passou na matriz desta rodada, mas a frente nao esta concluida ate repetir a matriz no iPhone fisico.

Estado:
- `SinalSeguroMediaEngine` e a rota `native_segmented_v1` sao o caminho principal para ativos novos; JS/Base64/loopback ficam como fallback legado/homologacao para `js_chunked_v1`.
- Android nativo usa AES-256-GCM com processamento em blocos, hashes incrementais, storage privado e limpeza de residuos nativos.
- iOS tem template nativo AES-GCM sincronizado pelo plugin, mas ainda nao esta aprovado para midia longa enquanto depender de leitura integral em memoria.
- Home/SOS usa `FinishProgressDialog` com estados explicitos de parada, camera liberada, criptografia, empacotamento, limpeza, anexo, sem midia e erro.
- Ao encerrar, a tela sai de `CHAMADO ATIVO` rapidamente; o processamento restante continua como progresso discreto/bloqueio de novo SOS ate estado final ou limpeza pendente.
- `LocalMediaAsset`, manifesto e envelope cifrado aceitam `captureProfile`, `storageEngine`, `playbackAdapter`, `nativePlayback`, `processingState`, `keyId`, `packageId`, `emergencySessionId` opcional e escopo futuro de envelope por destinatario.
- Player Seguro nao envia `.nseg` direto ao `expo-video`; prepara MP4 temporario em cache privado/no-backup, exibe barra de preparo, agenda TTL de 10 minutos e apaga ao fechar, trocar midia, ir para background ou na limpeza de boot.
- Home e Arquivos executam `cleanupNativeMediaResidues()` na entrada para remover temporarios nativos orfaos apos relaunch/force stop.
- Cofre diferencia protegido, processando, sem midia com causa saneada, falha de preservacao e limpeza pendente.
- Evidencia Android fisica saneada em `docs/evidencias/android/2026-05-10-frente-1-2-native/inventario-saneado.txt`; PNG/XML/logcat com rosto, ambiente ou dados pessoais nao devem ser versionados.
- Android fisico `23129RA5FL`: APK final instalado, SOS 60s/3min/ciclo longo saiu visualmente de `CHAMADO ATIVO` em ate 0,5s, cofre terminou como `Video protegido`, player abriu fonte temporaria preparada e timeline ficou coerente nos primeiros segundos.
- Inventario Android final confirmou 399 arquivos no sandbox, 0 midias claras persistentes, 17 `.nseg` e 375 `.sseg`; fechamento do player durante reproducao manteve o app vivo e sem crash do processo SinalSeguro.
- APK Android validado nesta rodada: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `b4c8eb4aad7fb7c886bf5f726f179be633e03751a5eb9ae9b79c3ee061ada0f3`.
- Gates locais aprovados nesta rodada: `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness` com pendencia ambiental conhecida de Node 20.16.0 para release publico, e `git diff --check`.
- Frente 1.1 permanece fechada/intocada; Ed25519 segue para identidade/prova de dispositivo, e envelopes futuros de midia ainda exigirao chave/acordo criptografico apropriado.
- Pendencias antes de avancar: repetir iPhone fisico, revisar residuos claros/logs saneados/tempo ate primeiro frame/camera e microfone liberados no iOS, e risco ATS iOS antes de release.
- Nao iniciar UI final de chamada P2P/anjo, upload, localizacao, conveniados ou compartilhamento real nesta frente; manter apenas compatibilidade de captura/envelope/camera/microfone para as frentes seguintes.
