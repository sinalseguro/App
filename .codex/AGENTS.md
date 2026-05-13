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

Fase vigente: checkpoint de fechamento da Frente 1.2 Android e preparacao da Frente 1.3. Roberto aprovou manualmente a Frente 1.2 no Android em 2026-05-13; iPhone/iOS permanece pos-MVP e nao deve bloquear o MVP Android.

Estado:
- `SinalSeguroMediaEngine` e a rota `native_segmented_v1` sao o caminho principal para ativos novos; JS/Base64/loopback ficam como fallback legado/homologacao para `js_chunked_v1`.
- Android nativo usa AES-256-GCM com processamento em blocos, hashes incrementais, storage privado e limpeza de residuos nativos.
- iOS tem template nativo AES-GCM sincronizado pelo plugin, mas fica fora do MVP imediato e nao deve bloquear a frente Android.
- Home/SOS usa `FinishProgressDialog` com estados explicitos de parada, camera liberada, criptografia, empacotamento, limpeza, anexo, sem midia e erro.
- Ao encerrar, a tela sai de `CHAMADO ATIVO` rapidamente; o processamento restante continua como progresso discreto/bloqueio de novo SOS ate estado final ou limpeza pendente.
- `LocalMediaAsset`, manifesto e envelope cifrado aceitam `captureProfile`, `storageEngine`, `playbackAdapter`, `nativePlayback`, `processingState`, `keyId`, `packageId`, `emergencySessionId` opcional e escopo futuro de envelope por destinatario.
- Player Seguro nao envia `.nseg` direto ao `expo-video`; prepara MP4 temporario em cache privado/no-backup, exibe barra de preparo, agenda TTL de 10 minutos e apaga ao fechar, trocar midia, ir para background ou na limpeza de boot.
- Home e Arquivos executam `cleanupNativeMediaResidues()` na entrada para remover temporarios nativos orfaos apos relaunch/force stop.
- Cofre diferencia protegido, processando, sem midia com causa saneada, falha de preservacao e limpeza pendente.
- Evidencia Android fisica saneada em `docs/evidencias/android/2026-05-13-frente-1-2-validacao-fisica/`; PNG/logcat com contexto visual ou dados pessoais nao devem ser publicados sem revisao.
- Android fisico `23129RA5FL`: APK final instalado, SOS principal gerou `Video 1min 48s`, cofre mostrou `1 video`, player unificado reproduziu ate pelo menos `0:23 / 1:46`; no binario final, ciclo adicional gerou `Video 31s`, cofre mostrou `1 video`, player iniciou reproducao e `Continuar` retornou para Home.
- Inventario Android final pos-rebuild confirmou 418 arquivos no sandbox, 0 midias claras persistentes, 22 `.nseg` e 375 `.sseg`; `dumpsys media.camera` final ficou sem cliente ativo.
- APK Android validado nesta rodada: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `50fe4c831174899e5728579709ec906470c6c55d4aad1f205c162da1be0444db`.
- Pausa operacional de 2026-05-13: Roberto vai atuar em demanda paralela do portal web governo/business fora desta frente. Nao executar nada de portal aqui; manter este chat aguardando retomada Android.
- Higienizacao Android executada com `../../scripts/higienizar-reciclaveis-android.sh --select all --apply`: removidos `.expo`, `android/.gradle`, `android/app/.cxx`, `android/app/build` e `android/build`; liberacao real de 2.5 GiB, script reportou 6.6 GiB livres e conferencia final posterior indicou 6.3 GiB livres.
- O APK local foi removido como artefato regeneravel, mas o app validado segue instalado no Android fisico. Para retomar sem reinstalar, ir direto ao teste manual; para reinstalar, rebuild Android privado sera necessario.
- Gates locais aprovados nesta rodada: `npm run typecheck`, `npm run lint`, `npm test`, `npm run private:android:readiness` com pendencia ambiental conhecida de Node 20.16.0 para release publico, e `git diff --check`.
- Frente 1.1 permanece fechada/intocada; Ed25519 segue para identidade/prova de dispositivo, e envelopes futuros de midia ainda exigirao chave/acordo criptografico apropriado.
- Roberto aprovou manualmente a Frente 1.2 Android em 2026-05-13. A frente fica fechada para o escopo Android do MVP; iPhone/iOS segue em frente pos-MVP propria.
- Proxima frente recomendada: Frente 1.3 - perfis, familia, maioridade e papeis. Nao pular direto para P2P/anjos antes de fechar papeis, responsaveis, menores, consentimentos e autorizacoes.
- Nao iniciar UI final de chamada P2P/anjo, upload, localizacao, conveniados ou compartilhamento real nesta frente; manter apenas compatibilidade de captura/envelope/camera/microfone para as frentes seguintes.
- Proximo arquivo de retomada: `docs/37_HANDOFF_FRENTE_1_3_PERFIS_PAPEIS_2026-05-13.md`.
