# 27 - Refino drawer, Cofre/Player e Configuracoes

Data: 2026-05-04  
Coordenacao: Ze e Cristine  
Validacao visual: Tarcila com Norman  
Validacao tecnica: Ada, Hedy, Myers e Schneier

## Objetivo

Fechar o ciclo de ajustes comentados no simulador web antes da nova validacao Android: Home mais limpa, SOS com efeito de bolha, drawer objetivo, Configuracoes sem banner tecnico e Cofre organizado por icones em grade vertical.

## Ajustes implementados

- O botao SOS manteve 75% de largura responsiva, ganhou reforco no efeito 3D de bolha e anel circular mais visivel.
- O trilho e a volta ativa do anel ganharam opacidade/espessura adicional para aparecer melhor durante o gesto, sem sair da borda circular.
- O anel de progresso continua preso a circunferencia do botao: horario para acionar e anti-horario para encerrar.
- O menu retratil agora apresenta `Cofre`, `Anjos`, `Player` e `Configuracoes`.
- `Cofre` abre a trilha de arquivos locais; `Player` abre diretamente a revisao segura.
- Toque fora do menu retratil fecha o menu.
- Toque fora dos modais SinalSeguro fecha a janela aberta quando isso nao apaga dados.
- A tela de Configuracoes removeu o banner/status tecnico do topo e manteve apenas a grade de recursos iconograficos.
- O modal do Cofre usa grade vertical de pacotes locais com acoes agrupadas em linhas/colunas: visualizar, compartilhar interno futuro, excluir e finalizar quando ativo.

## Evidencias browser

| Tela | Arquivo |
|---|---|
| Home SOS bolha | `docs/assets/mobile/2026-05-04-home-sos-bolha.png` |
| Drawer Cofre/Player | `docs/assets/mobile/2026-05-04-home-menu-cofre-player.png` |
| Configuracoes sem banner | `docs/assets/mobile/2026-05-04-configuracoes-sem-banner.png` |
| Cofre modal em grade | `docs/assets/mobile/2026-05-04-cofre-modal-grid.png` |

## Criterios de aceite

- Home nao deve rolar.
- O texto auxiliar externo `Solte` nao deve aparecer.
- Configuracoes nao deve exibir banner/status tecnico no topo.
- Drawer deve fechar ao tocar fora.
- Cofre deve listar pacotes em grade vertical e abrir acoes por icones.
- Player deve ser acessivel diretamente pelo drawer.
- Nenhum dado sensivel deve aparecer em log, URL, push ou documentacao.

## Validacao minima

```bash
npm run typecheck
npm run lint
npm test
git diff --check
```

## Proxima etapa

1. Reinstalar APK privado no Android conectado.
2. Validar no aparelho: abertura sem travamento, SOS, permissao de camera/microfone, gravacao local, cofre, player e exclusao.
3. Se Roberto aprovar a UX, seguir para integracao API/OIDC/convites persistidos e contrato de atualizacao.

## Atualizacao 2026-05-05

- Tarcila e Norman aprovaram o ajuste de direcao visual: SOS sem brilho verde, anel circular discreto na propria circunferencia do botao e efeito de bolha com profundidade.
- O texto visivel de compartilhamento foi ajustado para linguagem de produto: `Compartilhar pelo app`.
- Configuracoes permanece em grade iconografica e os detalhes longos devem ficar em ajuda padronizada por botao `(?)`, mantendo a tela como produto e nao prototipo tecnico.
- O codigo de seguranca local protege o encerramento do SOS e tambem pode bloquear o acesso a Cofre, Anjos, Player e Configuracoes quando estiver ativo.
- `Duas cameras` e a preferencia padrao do build privado. Quando a plataforma nao permitir captura simultanea, o pacote deve preservar a camera que conseguir gravar e registrar o fallback tecnico.
- O proximo checkpoint deve fechar validacao, APK privado e instalacao no Android conectado antes de seguir para API/OIDC/convites persistidos.
