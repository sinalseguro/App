# Fechamento da Frente 1.2 Android - 2026-05-13

Status: Frente 1.2 encerrada para o escopo Android do MVP, apos aprovacao manual de Roberto.

## Decisao

Roberto validou fisicamente as atualizacoes do app na Frente 1.2 e aprovou o resultado. A frente pode ser considerada concluida no escopo Android do MVP.

Esta decisao nao homologa iPhone/iOS. O suporte iOS permanece pos-MVP, conforme `docs/34_DECISAO_MVP_ANDROID_IOS_POS_MVP_2026-05-13.md`.

## Base aprovada

- SOS com midia local Android.
- Preservacao cifrada nativa por segmento.
- Cofre local com pacote protegido.
- Player seguro com experiencia unificada para usuario leigo.
- Camera/microfone liberados apos encerramento.
- Inventario saneado sem midia clara persistente.
- Evidencias em `docs/evidencias/android/2026-05-13-frente-1-2-validacao-fisica/`.

APK validado antes da higienizacao:

- `android/app/build/outputs/apk/debug/app-debug.apk`
- SHA-256 `50fe4c831174899e5728579709ec906470c6c55d4aad1f205c162da1be0444db`

Observacao: o APK local foi removido posteriormente na higienizacao de reciclaveis Android, mas o hash, evidencias e checkpoint foram preservados. Para reinstalar, fazer novo build privado Android.

## Proxima frente recomendada

A proxima frente deve ser a Frente 1.3: perfis, familia, maioridade e papeis.

Motivo tecnico:

- P2P, anjos e instituicoes dependem de saber quem e adulto, menor, responsavel, protegido, anjo, admin ou conveniado.
- Menores nao podem convidar anjos, atuar como anjos ou acionar terceiros fora das regras de responsavel/conveniado autorizado.
- Chamada para anjos/responsaveis depende de autorizacao, papel, consentimento e relacionamento valido antes de WebRTC/sinalizacao.

Depois da Frente 1.3, a sequencia natural e:

1. Frente 2 - rede de anjos e convites.
2. Frente 3 - emergencia/ocorrencia remota.
3. Frente 4 - chamada audio/video com anjos/responsaveis autorizados.
4. Frente 5 - localizacao ao vivo durante emergencia.
5. Frente 7 - conveniados/orgaos, somente com contrato, RBAC/MFA, auditoria, retencao e RIPD/DPIA.
