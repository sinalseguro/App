# 05 - Design System Mobile

Responsaveis: Tarcila, Norman e Ada

## Objetivo

Garantir uma experiencia visual e interativa unica em Android e iOS, respeitando restricoes de cada plataforma apenas quando necessario.

## Tokens

- `colors`: paleta SinalSeguro, estados de risco, fundo discreto e contraste.
- `spacing`: escala de espacamento.
- `radius`: cantos consistentes.
- `typography`: Poppins quando disponivel; fallback do sistema.
- `shadow`: elevacao discreta.
- `motion`: duracoes e easing sem animacoes excessivas.

## Componentes obrigatorios

- `ButtonIcon`
- `PanicButton`
- `ConsentCard`
- `InviteCard`
- `StatusBanner`
- `SafeScreen`
- `PermissionGate`

## Regras visuais

- Nao expor palavras sensiveis na tela inicial discreta.
- Nao depender apenas de cor.
- Garantir alvos de toque amplos.
- Usar contraste forte.
- Evitar linguagem visual alarmista.
- Manter a marca aprovada por Tarcila.

## Bloqueios

- Tela que revele risco em lock screen.
- Iconografia que sugira parceria publica inexistente.
- Modo visual que engane a usuaria sobre gravacao ou permissao.
