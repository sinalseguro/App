# 11 - Lifecycle do App

Responsavel: Cristine  
Supervisao: Ze

## Ciclo saudavel

1. Planejar fase e criterios de aceite.
2. Atualizar backlog e timeline.
3. Implementar em branch curta.
4. Validar com Myers e Schneier.
5. Revisar LGPD com Doneda quando houver dado, permissao ou compartilhamento.
6. Revisar UX/visual com Norman e Tarcila quando houver tela, marca ou asset.
7. Gerar release interna sem segredos.
8. Registrar decisao em memoria e documentacao.
9. Publicar somente artefatos aprovados.

## Branches previstas

| Branch | Uso |
|---|---|
| `main` | Checkpoints publicos estaveis |
| `codex/mobile-foundation` | Base Expo, rotas, tema e memoria |
| `codex/mobile-design-system` | Tokens, componentes e UX visual |
| `codex/mobile-alert-flow` | Botao de panico, cancelamento, outbox e permissao |
| `codex/mobile-api-integration` | Cliente API, auth, devices, convites e alertas |

## Estados de release

| Estado | Descricao | Pode ir ao publico? |
|---|---|---|
| `docs` | Documentacao e app shell sem dados reais | Sim |
| `internal-dev` | Build tecnico para equipe | Somente equipe |
| `homologacao-controlada` | Teste com participantes consentidos e ambiente isolado | Restrito |
| `piloto-institucional` | Operacao com termo formal | Restrito ao convenio |
| `publico` | Produto revisado para loja | Somente apos aprovacoes |

## Memoria obrigatoria

Cristine atualiza:

- `.codex/memory/CRISTINE.md`;
- `docs/03_TIMELINE.md`;
- `docs/02_BACKLOG.md`;
- este lifecycle quando o processo mudar.

Zé consolida decisões macro em `docs/01_MEMORIA_DO_PROJETO.md` no repositorio documental.
