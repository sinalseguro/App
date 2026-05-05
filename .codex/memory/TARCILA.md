# Memoria - Tarcila

Data: 2026-05-03  
Papel: guardia de identidade visual SinalSeguro para mobile.

## Decisoes vigentes

- O topo do app deve usar logo real, nao texto isolado.
- A splash nativa aprovada para este checkpoint e `assets/brand/sinalseguro-splash-approved.png`.
- Fundo institucional da splash: `#120A20`.
- Home deve ser limpa, fixa, sem rolagem e com foco no SOS.
- SOS deve ser grande, circular, responsivo e com profundidade discreta.
- Particulas do SOS ativo devem ser pequenas, lentas e nao alarmistas.
- Alertas criticos devem usar modal SinalSeguro com sombra, icone, titulo e botoes da identidade visual.
- Cofre deve ser iconografico, com recursos em modais e sem blocos tecnicos na primeira tela.
- Modais devem aceitar rolagem interna quando o conteudo exceder a altura util do Android.
- Prints de `Cofre fixo` e `Como funciona` recapturados em 2026-05-03 ja mostram as telas reais, nao a splash.

## Pendencias para aprovacao final

- Validar splash nativa no Android fisico reinstalado.
- Validar Home e Cofre em aparelho menor.
- Validar contraste e legibilidade no modo real do Android.
- Aprovar ou solicitar ajuste antes de release interna 3.

## Decisao visual - 2026-05-04

- SOS deve manter efeito de bolha 3D discreta: brilho superior, sombra interna e profundidade magenta/rosa.
- O anel de progresso precisa ser mais visivel durante pressao longa, mas sempre dentro da circunferencia do botao.
- Drawer aprovado para validacao com `Cofre`, `Anjos`, `Player` e `Configuracoes`.
- Configuracoes nao deve exibir banner tecnico no topo; a tela fica iconografica e direta.
- Cofre em modal deve organizar pacotes como icones em grade vertical, com acoes em linhas e colunas.
- Aprovado microajuste visual: anel de progresso do SOS mais legivel no gesto de pressao, sem virar aro externo e sem quebrar a bolha 3D.

## Pausa visual - 2026-05-05

- Pausa registrada antes de nova validacao visual para liberar espaco em disco.
- Na retomada, Tarcila deve revisar primeiro:
  - topo com logo simbolo sempre visivel;
  - SOS com bolha 3D mais realista e anel discreto, porem legivel;
  - modais com linguagem de produto, botao de ajuda `(?)` e sem justificativas tecnicas na camada principal;
  - Cofre/Player com menos texto e mais acao por icones.

## Ajuste visual - 2026-05-05 - browser final

- Roberto aprovou a direcao de manter os tres atalhos oficiais visiveis na Home: `Policia`, `Bombeiros` e `SAMU`; o numero `190` nao deve aparecer no rotulo visual do botao.
- A bolha SOS deve ter apenas uma transparencia superior em degradê, sem segunda faixa em formato de charuto.
- O estado `ATIVO` deve ficar acima das particulas e usar somente sombra verde no texto, sem faixa/charuto atras, sem trocar a massa magenta/rosa principal do botao.
- Browser local esta aberto em `http://localhost:8081/`; a Home tambem foi validada no Android instalado com os botoes `Policia`, `Bombeiros` e `SAMU`, sem numero no rotulo de `Policia`.
