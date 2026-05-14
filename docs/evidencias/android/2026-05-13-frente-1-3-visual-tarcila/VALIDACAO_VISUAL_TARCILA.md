# Validacao visual Tarcila/Lina/Eliane - Frente 1.3 Android

device=Android fisico USB com identificador redigido

model=23129RA5FL

android=15

package=br.com.sinalseguro.app instalado

font_scale_before=1.0


## Telas capturadas
docs/evidencias/android/2026-05-13-frente-1-3-visual-tarcila/01-perfis-summary.txt
docs/evidencias/android/2026-05-13-frente-1-3-visual-tarcila/01-perfis.png
docs/evidencias/android/2026-05-13-frente-1-3-visual-tarcila/02-anjos-summary.txt
docs/evidencias/android/2026-05-13-frente-1-3-visual-tarcila/02-anjos.png
docs/evidencias/android/2026-05-13-frente-1-3-visual-tarcila/03-convite-sem-token-summary.txt
docs/evidencias/android/2026-05-13-frente-1-3-visual-tarcila/03-convite-sem-token.png
docs/evidencias/android/2026-05-13-frente-1-3-visual-tarcila/04-perfis-fonte-grande-summary.txt
docs/evidencias/android/2026-05-13-frente-1-3-visual-tarcila/04-perfis-fonte-grande.png
docs/evidencias/android/2026-05-13-frente-1-3-visual-tarcila/05-anjos-fonte-grande-summary.txt
docs/evidencias/android/2026-05-13-frente-1-3-visual-tarcila/05-anjos-fonte-grande.png
docs/evidencias/android/2026-05-13-frente-1-3-visual-tarcila/06-convite-fonte-grande-summary.txt
docs/evidencias/android/2026-05-13-frente-1-3-visual-tarcila/06-convite-fonte-grande.png

## Crash scan
Sem padroes fatais no recorte saneado.

## Leitura de UX/IX

- `Perfis e papeis`: quatro perfis aparecem em cartoes tocaveis amplos, com descricoes e bloqueio de convite antes da configuracao.
- `Anjos de confianca`: grade de status mantem botoes legiveis para Perfil, Estado, Criar convite, Prontidao, Anjos, Convites e Atualizar.
- `Convite recebido`: estado sem token exibe convite ausente, limite de seguranca, configuracao de perfil e acoes principais.
- Fonte ampliada `1.3`: os mesmos fluxos continuam acessiveis por rolagem, sem perda dos botoes principais.
- Ressalva Tarcila/Lina: fonte `1.3` mostra cortes/overflow em textos longos de `Perfis`, `Anjos` e `Convite recebido`; precisa de refinamento visual antes de aprovacao sem ressalva.
- Evidencia preservada: screenshots e sumarios de UI; logs brutos, intents e XMLs completos foram removidos para reduzir risco de exposicao.
