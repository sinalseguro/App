# Checkpoint - SOS offline e vinculos de anjos visiveis

Data: 2026-05-15
Coordenacao: Ze
Especialistas considerados: Katia, Fabio, Doneda, Cristine, Lina, Tarcila, Eliane e Lucena

## Objetivo

Corrigir a lacuna observada por Roberto no fluxo de convite:

- apos aceitar o convite, o anjo precisa ver claramente que esta protegendo alguem e quem e a pessoa protegida;
- a pessoa que convidou precisa ver claramente quem aceitou ser seu anjo;
- apos primeiro login aprovado, o app precisa manter acesso local ao SOS mesmo sem internet;
- uma ocorrencia SOS gravada sem rede deve ficar preservada localmente e pronta para sincronizacao com a EC2 quando a rede voltar.

## Diagnostico

A consulta saneada em producao mostrou convites recentes ainda `pending`, sem registro de aceite confirmado no backend. Isso significa que o comportamento visto no aparelho nao podia ser tratado como aceite final se a API de producao ainda nao tinha criado o vinculo aceito.

No app, a tela `Anjos de confianca` dependia de um `Promise.all` com contatos, convites e relacionamentos. Se uma chamada falhasse, os relacionamentos aceitos podiam nao aparecer mesmo quando outra chamada ja tinha informacao valida.

Tambem havia risco no gate de acesso: ao tocar em `Validar login` sem internet, qualquer falha da API limpava a sessao local, bloqueando um usuario que ja tinha feito login anteriormente.

## Implementacao

Arquivos alterados:

- `src/services/apiClient.ts`
- `src/features/access/AccessGate.tsx`
- `src/features/invitations/trustedRelationshipStore.ts`
- `app/convite.tsx`
- `app/contatos.tsx`
- `src/features/emergency/emergencySyncQueue.ts`
- `app/index.tsx`
- `scripts/smoke-test.mjs`

Comportamento novo:

- erro de rede da API vira erro saneado com `status=0`, sem derrubar automaticamente sessao valida;
- o gate de acesso so limpa a sessao em `401`; falhas de rede preservam sessao local ja autenticada;
- o aceite de convite grava o relacionamento aceito em cache local criptografado no aparelho do anjo;
- a tela `Anjos de confianca` usa cache local de relacionamentos como fallback e busca contatos, convites e relacionamentos de forma independente;
- convites remotos aceitos/revogados deixam de continuar aparecendo como pendentes quando o relacionamento aceito ja esta conhecido;
- SOS consulta relacionamentos aceitos antes de criar o pacote local e inclui os IDs autorizados no plano local de entrega;
- pacote SOS finalizado entra em uma fila local criptografada de sincronizacao remota;
- quando o app volta ao foco, a fila tenta sincronizar a sessao de emergencia com a API na EC2, mantendo tentativa futura se estiver offline ou sem login.

## Regras preservadas

- Nao houve exposicao de token, telefone, e-mail bruto, link completo de convite, localizacao, midia ou evidencia nos contratos novos.
- Midia e localizacao para anjos continuam bloqueadas ate frente propria de envelopes, chaves, autorizacao, transporte e auditoria.
- Conveniados/autarquias continuam dependencia futura de contrato, RBAC, MFA, retencao, auditoria, RIPD/DPIA e orgao competente.
- iPhone/iOS segue pos-MVP.

## Validacoes concluidas

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run private:android:readiness`: aprovado.
- build Android debug bundled `arm64-v8a`: aprovado.

Artefato gerado:

- `android/app/build/outputs/apk/debug/app-debug.apk`
- SHA-256: `b941cc4839639a38fb0df22a20ab6ed11e4662dac85a184ef09ccf393b926def`
- tamanho: `77M`

## Limite fisico

O Android `23129RA5FL` apareceu inicialmente como `device`, mas as tentativas `adb install --no-streaming` e `adb install` ficaram presas sem retorno. Apos reiniciar o servidor ADB local, o aparelho passou para `offline`.

Por esse motivo, este checkpoint nao publica o APK no portal e nao declara validacao fisica concluida. O proximo passo e reconectar/desbloquear/autorizar o Android no ADB e instalar o APK acima para validar:

1. login ja realizado continua liberando o app sem internet;
2. aceite de convite mostra `Voce e anjo de <nome publico>` no aparelho anjo;
3. aparelho originador mostra o anjo em `Anjos autorizados` apos sincronizar;
4. SOS offline grava pacote local e, ao voltar a internet, tenta sincronizar a ocorrencia com a EC2.

