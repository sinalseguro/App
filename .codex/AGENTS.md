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

Fase vigente: midia privada criptografada local fechada para homologacao Android, pronta para a proxima etapa de envelopes de chave, sessao remota e anjos.

Estado:
- SOS e Cofre/Player seguem com UX aprovada para esta etapa; nao redesenhar sem novo comentario visual do Roberto.
- Videos novos sao preservados por `EncryptedVideoStore` em chunks `.sseg` com chave unica, manifesto cifrado/autenticado e playback por loopback local `127.0.0.1` com `Range`.
- Player Seguro usa preload do asset selecionado, timeline custom, seek, replay e fullscreen nativo.
- Thumbnail segura e salva como `thumbnail.sseg`; thumbnail clara temporaria e removida.
- MP4 claro temporario da captura nativa so e apagado depois de reabrir e verificar chave, manifesto, chunks, hashes e thumbnail.
- Falha de preservacao nao apaga o MP4 original; falha de limpeza fica como `cleanup_pending`.
- Build privado C2 validado em Android fisico `192.168.0.4:5555`; APK SHA-256 `024150800908109199f84e1be2ef5bd9c72ae1f6986ecee0a8269f2c44ca1323`.
- Evidencias principais: `docs/evidencias/android/2026-05-06-capture-cleanup-thumbnail/`.
- Proxima etapa correta: envelopes de chave, sessao remota de emergencia e entrega controlada para anjos autenticados via EC2/API, sem mexer novamente na interface de midia salvo regressao comprovada.
