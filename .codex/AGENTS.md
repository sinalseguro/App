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

## Checkpoint atual

Fase 1: Home SOS fixa, splash aprovada, modais padronizados e Cofre iconografico.

Estado:
- tela inicial fixa, sem rolagem, com logo real no topo, SOS central e menu retratil por engrenagem;
- Tarcila supervisiona identidade visual e exige validacao fisica do splash nativo no proximo Android conectado;
- cofre local foi refatorado para tela fixa por icones, com Player e trilha em modais;
- fluxos criticos usam `BrandedDialog`, nao `Alert.alert`;
- cofre local exige confirmacao para excluir e bloqueia exclusao de chamado ativo;
- SOS tem singleton no servico para evitar dois chamados ativos no mesmo dispositivo;
- web e apenas simulador volatil, sem dados reais;
- build privado de homologacao local habilita video/audio no sandbox do app; backend, P2P, streaming e compartilhamento externo continuam bloqueados ate revisoes juridica, seguranca e infraestrutura.
- `app.json` mantem o padrao publico sem `CAMERA`/`RECORD_AUDIO`; o build privado ativa essas permissoes pelo Manifest nativo preparado.
- APK privado instalado no Android `192.168.0.4:5555` tem SHA-256 `056e41d7e1e91aef10c6763bb094bfe27973693c8c163b222c6f4be2952be67b`.
- inicializacao fria validada sem crash no log isolado do SinalSeguro.
