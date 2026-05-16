# Checkpoint - SOS para anjos em Android fisico

Data: 2026-05-16  
Escopo: Android MVP, fluxo autenticado de SOS, roteamento para anjo aceito, resposta do anjo e encerramento sincronizado com a EC2 SinalSeguro.

## Resultado

- Corrigido o atraso do alerta ao anjo: o app passou a criar a sessao remota assim que o SOS inicia, sem esperar o encerramento da midia local.
- Corrigida referencia de dispositivo obsoleta: antes de criar a sessao remota, o app revalida/registra o dispositivo autenticado; em erro de referencia, limpa o vinculo local e tenta novamente.
- A tela de alertas recebidos passou a atualizar silenciosamente a cada 8 segundos enquanto estiver aberta.
- O encerramento do SOS sincroniza o estado final da sessao remota, encerrando tambem os destinatarios.
- O gravador Android recebeu fallback para aparelhos com apenas uma camera pronta: se a camera solicitada nao ficar pronta, alterna para a outra antes de desistir.

## Evidencia fisica

Diretorio:

- `docs/evidencias/android/2026-05-16-sos-anjos-fisico/`

Evidencias principais:

- `19-device-0123456789ABCDEF-sos-active-remote-created.png`: aparelho de origem com SOS ativo e sessao remota criada.
- `20-device-angel-alerta-after-update.png`: aparelho do anjo recebendo o pedido de apoio.
- `26-device-angel-after-acompanhar-second-tap.png`: anjo aceitando acompanhar.
- `28-device-origin-after-finish-complete-final-sos.png`: origem encerrando com video protegido.
- `29-device-angel-after-origin-ended.png`: anjo vendo o pedido encerrado.

## Validacao EC2

Sessao validada em producao:

- `status=active`, `phase=notifying`, `recipient=queued` apos inicio do SOS.
- `status=active`, `phase=accepted`, `recipient=accepted` apos aceite do anjo.
- `status=finished`, `phase=ended`, `recipient=ended` apos encerramento no aparelho de origem.

O backend continua sendo a autoridade para o estado juridicamente relevante: sessao, destinatario, aceite, encerramento e auditoria.

## Limites tecnicos atuais

- O fluxo validado nao e P2P direto entre aparelhos.
- A comunicacao atual app-servidor usa API autenticada na EC2, com transporte HTTPS e sessao do usuario.
- O dispositivo usa chave por aparelho e prova de posse no contrato de registro.
- A midia local fica criptografada no aparelho.
- Envelopes de chave para destinatarios e sinalizacao P2P/WebRTC continuam bloqueados ate frente propria, com consentimento, autorizacao, retencao, auditoria, UX e revisao de seguranca.

## Validacoes executadas

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `git diff --check`
- Instalacao e teste fisico nos dois Androids:
  - origem USB: `versionName=0.1.8`, `versionCode=10`
  - anjo ADB/Wi-Fi: `versionName=0.1.8`, `versionCode=10`

Artefato Android local:

- `android/app/build/outputs/apk/debug/app-debug.apk`
- SHA-256: `f00ea4256f17a626fa2f0656c5a6ef94d4b617712f1bf7d72ae43a9d1863e736`
