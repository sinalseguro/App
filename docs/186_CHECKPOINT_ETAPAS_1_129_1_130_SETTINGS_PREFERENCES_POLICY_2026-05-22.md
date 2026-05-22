# Checkpoint - Etapas 1.129 e 1.130 Settings Preferences Policy

Data: 2026-05-22

## Escopo

Refatoracao pura da tela `Configuracoes`, mantendo a rodada em duas fatias pequenas e sem alterar layout, textos publicos, botoes, modais, permissao real, storage, login, API, SOS, chamada ao vivo, release ou build Android.

## Especialistas/Gates

- Zé: coordenacao e continuidade.
- Cristine/Codex Security: gate dirigido em preferencias sensiveis de audio, video, localizacao ao vivo, anjos, 190 e logs.
- Eliane: QA local proporcional.
- Lina/Tarcila: preservacao de UX/identidade visual, sem mudanca visual nesta rodada.

## Etapa 1.129 - preferencias de compartilhamento

- `settingsPresentationPolicy` passou a centralizar decisoes puras para:
  - ligar/desligar 190 junto com SOS;
  - alternar escopos futuros para anjos autorizados;
  - alternar salvamento protegido no app do anjo.
- A policy retorna apenas `nextPreferences` e `message`.
- `app/configuracoes.tsx` continua responsavel por persistir via `updatePreferences()`.
- O contrato `trustedStream.status = "homologation_blocked"` foi preservado e coberto por teste.

## Etapa 1.130 - preferencias de video local

- `settingsPresentationPolicy` passou a centralizar decisoes puras para:
  - ativar/desativar video local no SOS;
  - trocar modo de camera local.
- A policy retorna apenas `nextPreferences` e `message`.
- `app/configuracoes.tsx` continua responsavel por persistir preferencias e por solicitar permissoes reais de camera/microfone.
- O contrato `localVideoCapture.status = "enabled_local"` foi preservado e coberto por teste.

## Validacoes

- `npm run test:settings-presentation`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado; smoke ajustado para validar `homologation_blocked` e `enabled_local`.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado como pronto para build privado condicionado pela pendencia local de Node 20.16.0.
- `npm test`: aprovado.
- `npm run typecheck`: nao emitiu erro, mas ficou sem saida e ocioso; processo encerrado para nao ficar pendurado, comportamento ja conhecido nesta frente.

## Decisao

- Sem build Android nesta rodada por ser policy pura sem runtime nativo, sem mudanca visual e sem alteracao operacional de API/login/update/storage/permissoes reais.
- Proxima rodada recomendada: encerrar `Configuracoes` com revisao final de handlers restantes ou passar para a proxima tela pesada seguindo o mesmo padrao de policy + teste focado + smoke.
