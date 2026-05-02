# 09 - Testes QA

Responsavel: Myers

## Matriz inicial

| Area | Cenarios |
|---|---|
| Onboarding | aceite, recusa, leitura, retorno |
| Login | proprio, Google, Apple, sessao expirada |
| Convite | criado, aceito, expirado, usado duas vezes |
| Anjos | listar, adicionar, revogar |
| Alerta | teste, real, cancelar, falso positivo |
| Offline | sem rede, API fora, retry, deduplicacao |
| Localizacao | permitida, negada, revogada, indisponivel |
| Push | discreto, lock screen, deep link autenticado |
| Acessibilidade | fonte grande, leitor de tela, contraste |
| Plataforma | Android 7+, Android atual, iOS atual |

## Critérios de bloqueio

- Alerta perdido sem outbox.
- Dado sensivel em log, push ou URL.
- App promete resposta oficial.
- Fluxo de midia fora de homologacao.
- Falha de autorizacao em alerta ou anjo.

## Evidencias

- Prints saneados.
- Logs de teste sem dados sensiveis.
- Relatorio por fase.
- Lista de bugs e retestes.
- Aprovação Myers antes de release interno.
