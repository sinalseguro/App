# Handoff - Frente 1.3 - Perfis, familia, maioridade e papeis - 2026-05-13

Status: pronta para iniciar apos fechamento e publicacao da Frente 1.2 Android.

## Contexto

Roberto aprovou manualmente a Frente 1.2 Android em 2026-05-13. O MVP passa a seguir pelo Android; iPhone/iOS fica em frente pos-MVP propria.

Nao reabrir SOS, Cofre, Player, motor nativo, build iOS, Appium/WDA, CoreDevice ou validacao iPhone nesta frente sem regressao objetiva ou nova decisao de escopo.

## Objetivo da Frente 1.3

Definir e implementar a base de perfis, familia, maioridade e papeis para viabilizar as frentes seguintes:

- Frente 2: rede de anjos e convites.
- Frente 3: ocorrencia/emergencia remota.
- Frente 4: chamada audio/video para anjos/responsaveis autorizados.
- Frente 5: localizacao ao vivo durante emergencia.
- Frente 7: conveniados/orgaos com contrato, RBAC, MFA, auditoria, retencao e RIPD/DPIA.

## Problema que esta frente resolve

P2P, anjos e conveniados nao podem ser implementados com seguranca enquanto o app nao souber:

- quem e adulto;
- quem e menor;
- quem e responsavel legal/operacional;
- quem e protegido;
- quem pode atuar como anjo;
- quem pode receber chamada/alerta;
- quando um convite e permitido;
- qual consentimento/autorizacao esta vigente.

## Especialistas e gates

- Zé: coordenacao, memoria e aceite final.
- Silvio: escopo de MVP e priorizacao.
- Katia: mobile Android e contratos no app.
- Fabio: backend/API e contratos de dados.
- Doneda: LGPD, menoridade, consentimento, bases legais e retencao.
- Cristine: seguranca, abuso, ameacas e limites de compartilhamento.
- Lina: UX dos fluxos de perfil/familia/autorizacao.
- Eliane: QA, regressao e criterios de aceite.
- Lucena: rastreabilidade tecnica e documentacao.

## Escopo inicial recomendado

1. Levantar estado atual de rotas, storage local, servicos API e OpenAPI relacionados a usuario, dispositivo, contatos, convites e consentimentos.
2. Mapear papeis minimos do MVP Android:
   - protegido adulto;
   - protegido menor;
   - responsavel;
   - anjo;
   - administrador local;
   - conveniado futuro, apenas como contrato/documentacao.
3. Definir regras:
   - menor nao convida anjos diretamente;
   - menor nao atua como anjo;
   - responsavel autoriza rede de apoio do menor;
   - adulto pode gerenciar sua propria rede;
   - anjo so recebe chamada/alerta apos aceite e autorizacao vigentes;
   - conveniado nao entra no MVP Android sem contrato e revisao juridica.
4. Implementar modelo local/API compatível com offline-first e sincronizacao posterior.
5. Atualizar UX de perfis/autorizacoes sem abrir chamada P2P real ainda.
6. Criar testes unitarios/contratuais para bloqueios de menoridade, aceite, revogacao e papeis.

## Fora de escopo nesta frente

- Chamada audio/video real.
- Upload de midia real.
- Localizacao ao vivo.
- Integracao oficial com orgaos publicos.
- Cadastro operacional de conveniados.
- iOS/iPhone.
- Alteracao dos contratos de midia ja aprovados na Frente 1.2.

## Gates de aceite

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run private:android:readiness` se a mudanca tocar escopo privado Android.
- `git diff --check`
- Revisao Doneda/Cristine para regras de menoridade, consentimento, autorizacao, revogacao e abuso.
- Revisao Lina/Eliane para clareza do fluxo de perfil/familia.

## Retomada rapida

```bash
cd "apps/mobile"
git status --short --branch
sed -n '1,220p' .codex/AGENTS.md
sed -n '1,220p' docs/37_HANDOFF_FRENTE_1_3_PERFIS_PAPEIS_2026-05-13.md
```

Se a Frente 1.3 comecar em outro chat, levar este documento como ponto de partida e manter o escopo restrito a papeis, familia, maioridade, consentimentos e autorizacoes.
