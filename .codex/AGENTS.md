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

Fase vigente: Frente 1.2 de midia critica em checkpoint de interrupcao. Implementacao local validada por gates, mas ainda nao declarar concluida ate instalar e testar fisicamente o APK novo em Android e repetir no iPhone.

Estado:
- SOS e Cofre/Player seguem com UX base aprovada; as mudancas desta frente foram restritas ao encerramento, feedback de progresso, captura/preservacao e timeline do player.
- Roberto confirmou que o bug de demora ao encerrar persistia no Android e no iPhone; esta retomada corrigiu a saida visual imediata do chamado ativo e manteve a camera anexando midia em paralelo.
- Home/SOS usa `FinishProgressDialog` para informar encerramento/protecao da midia e bloqueia novo SOS enquanto ha midia pendente.
- Android e iOS usam perfil conservador de homologacao: segmentos de 12s, 480p, bitrate alvo 650 kbps e metadados de compatibilidade de camera/hardware.
- `LocalMediaAsset`, manifesto e envelope cifrado aceitam `captureProfile` para preparar P2P futuro sem implementar chamada real.
- `Cofre` diferencia protegido, processando e sem midia com causa saneada.
- `EvidencePlayerCard` recebeu ajuste de sincronismo de timeline nos segundos iniciais.
- `SecureJsonStore` e `emergencyRecorder` evitam varredura de todos os pacotes ao finalizar/anexar/diagnosticar pacote especifico.
- Frente 1.1 gera chave Ed25519 por dispositivo, guarda a chave privada somente no SecureStore e envia a API apenas chave publica/hash, metadados saneados e prova de posse.
- Backend publicado exige `key_proof`, rejeita assinatura invalida quando aplicavel e registra rotacao/perda por endpoint dedicado.
- Android fisico e iPhone fisico validaram Google Sign-In, JWT interno, SecureStore e dispositivo autenticado com `key_algorithm=ed25519-v1`.
- Build iOS privado corrigido deve usar `npm run prepare:build:ios:secure-config` e `-xcconfig /private/tmp/sinalseguro-ios-secrets.xcconfig` para evitar URL scheme Google vazio no `Info.plist`.
- APK privado mais recente gerado apos a correcao: `distribution/android/out/sinalseguro-android.apk`, SHA-256 `d00beb8f7b551300a1f750ca059ad294f040947d796868176124eb44003df9f4`.
- Esse APK ainda precisa de instalacao/validacao fisica final; o teste anterior mostrou modal preso em 24% e topo ainda como `CHAMADO ATIVO`, antes da ultima correcao de segmentacao Android + saida visual imediata.
- Retomada obrigatoria: ler `docs/28_RETOMADA_SEM_REDUNDANCIA.md` e `docs/03_TIMELINE.md`, checar `df -h /`, instalar/testar o APK novo, coletar screenshots imediato/2s/8s/fim, revisar logcat saneado e residuos claros.
- Nao iniciar a UI final de chamada P2P/anjo nesta frente; manter apenas compatibilidade de captura/envelope e liberacao correta de camera/microfone para a frente seguinte.
