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

## Gate Android Etapa 1

Antes de qualquer APK Android:

1. ler `docs/13_ETAPA_1_ANDROID_INSTALAVEL.md`;
2. rodar `npm run release:android:readiness`;
3. resolver bloqueios de ambiente, EAS, SDK e assinatura;
4. manter keystore, tokens e senhas fora do Git;
5. publicar somente APK assinado com `checksums.txt` e release notes saneadas;
6. atualizar timeline, memoria Cristine e portal depois de validar o download.

## Gate Convites E Pacote Local

Antes de evoluir backend, P2P ou midia:

1. confirmar que convites continuam opacos, expiraveis e sem autenticar terceiros;
2. confirmar que o pacote local grava horario, consentimento, localizacao pontual e hash;
3. manter midia real bloqueada no build publico;
4. validar que API e P2P aparecem apenas como plano de entrega pendente;
5. rodar `npm run typecheck`, `npm run lint` e `npm test`;
6. atualizar `docs/14_CONVITES_E_PACOTE_EMERGENCIA.md`, timeline e memoria.

## Memoria obrigatoria

Cristine atualiza:

- `.codex/memory/CRISTINE.md`;
- `docs/03_TIMELINE.md`;
- `docs/02_BACKLOG.md`;
- este lifecycle quando o processo mudar.

Zé consolida decisões macro em `docs/01_MEMORIA_DO_PROJETO.md` no repositorio documental.
