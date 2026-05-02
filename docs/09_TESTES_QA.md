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

## Distribuicao

- QR Android abre `/baixar/android`.
- QR iOS abre `/baixar/ios`.
- Links de instalacao nao prometem artefato antes de assinatura.
- GitHub Release deve conter hash SHA-256.
- Portal deve informar status quando instalador ainda estiver pendente.
- Nenhum build de debug deve ser divulgado como producao.

## Etapa 1 Android instalavel

Checklist minimo de Myers:

- instalar APK em Android 7+ e Android atual;
- abrir app, onboarding, home, alerta de teste, contatos e configuracoes;
- confirmar que alerta permanece simulado e nao transmite dados;
- confirmar que camera e microfone nao sao solicitados;
- confirmar que `SYSTEM_ALERT_WINDOW` e armazenamento legado nao aparecem no APK;
- testar permissao de notificacao em Android 13+;
- revisar edge-to-edge/safe area em Android moderno com target SDK 36;
- registrar hash, dispositivo, versao e resultado sem dados pessoais.
