# 39 - Checkpoint - Frente 1.3 - Backend de perfis, papeis e autorizacoes - 2026-05-13

Status: fatia backend da Frente 1.3 implementada, publicada na EC2 do SinalSeguro e sincronizada com o app Android/MVP.

## Contexto

Roberto orientou continuar a Frente 1.3 usando a EC2 do SinalSeguro para qualquer interacao real com backend, mantendo checkpoints para nao quebrar a aplicacao.

Especialistas considerados nesta fatia:

- Fábio + Tereza: API, EC2, migracoes, deploy e backup;
- Doneda + Cristine: menoridade, LGPD, minimizacao, abuso e bloqueios server-side;
- Lina + Tarcila + Eliane: UX/IX, identidade, overflow e legibilidade no Android.

## Decisoes

- `accounts.User.role` continua reservado para papel operacional/interno; nao foi reaproveitado como perfil civil/familiar.
- Novo dominio backend `profiles` representa perfil protegido, responsavel, protegido menor, vinculo e autorizacao por escopo.
- Perfil ausente ou `unknown` bloqueia acoes sensiveis.
- Menor protegido nao cria convite e nao aceita atuar como anjo.
- Responsavel por menor so podera criar rede para protegido quando houver protegido ativo, vinculo ativo e autorizacao ativa.
- `can_receive_media` e `can_receive_location` continuam bloqueados para anjos nesta frente.
- `key-envelopes` e `p2p-signals` ficam bloqueados via serializer ate a frente propria de midia/P2P/autorizacao.
- iPhone/iOS permanece pos-MVP.

## Backend implementado

Arquivos principais em `services/api`:

- `profiles/models.py`;
- `profiles/policies.py`;
- `profiles/serializers.py`;
- `profiles/views.py`;
- `profiles/admin.py`;
- `profiles/migrations/0001_initial.py`;
- `trusted_contacts/migrations/0002_profile_subject_and_location_default.py`;
- `trusted_contacts/models.py`;
- `trusted_contacts/serializers.py`;
- `consents/serializers.py`;
- `emergency/serializers.py`;
- `sinalseguro_api/api_urls.py`;
- `sinalseguro_api/settings.py`;
- `sinalseguro_api/tests/test_platform_base.py`.

Novos endpoints:

- `GET/PATCH /api/profiles/me`;
- `/api/protected-subjects/`;
- `/api/responsible-links/`;
- `/api/profile-authorizations/`.

Novas tabelas:

- `profiles_userprofile`;
- `profiles_protectedsubject`;
- `profiles_responsiblelink`;
- `profiles_profileauthorization`.

Migração aditiva em `trusted_contacts`:

- `TrustedContact.protected_subject` nullable;
- `Invitation.protected_subject` nullable;
- `TrustedContact.can_receive_location` default alterado para `False`.

## App Android ajustado

Arquivos principais em `apps/mobile`:

- `src/services/apiClient.ts`: cliente para `/profiles/me`, `protected_subject` nos contratos e default `canReceiveLocation=false`;
- `src/features/profiles/profileStore.ts`: sincronizacao do perfil local com a API autenticada;
- `src/features/invitations/invitationService.ts`: sincroniza perfil antes de criar convite backend;
- `src/features/profiles/profilePolicy.ts`: responsavel por menor fica pendente ate existir vinculo/autorizacao ativos;
- `app/contatos.tsx`: conteudo principal passou a rolar para evitar corte em Android pequeno/fonte grande;
- `src/components/ButtonIcon.tsx`: label protegido contra estouro em botao;
- `app/perfis.tsx`: microcopy com acentos e linguagem final mais confiavel;
- `scripts/smoke-test.mjs`: atualizado para aceitar a microcopy acentuada.

## Minimizacao preservada

Nao foi adicionado:

- CPF, RG, CNH, documento, selfie ou prova documental;
- data de nascimento completa;
- nome legal completo de menor;
- endereco, escola, rotina, trabalho ou parentesco detalhado;
- agenda, telefone de terceiros ou coleta automatica de contatos;
- relato sensivel, boletim, medida protetiva ou historico de violencia;
- coordenadas, localizacao continua, upload de midia, P2P real ou conveniados.

## Checkpoints e deploy

Checkpoint local pre-edicao do backend:

- `/Users/roberto/SinalSeguro-api-checkpoint-20260513-170529`

Patch versionavel do backend para continuidade, ja que `services/api` nao e worktree Git:

- `docs/api/2026-05-13-frente-1-3-backend-profiles.patch`

Backup logico antes do deploy na EC2:

- `/opt/sinalseguro-api/backups/sinalseguro_prod_before_front13_20260513-201501.dump`

Deploy executado com:

- `infra/aws/deploy-api.sh`

Resultado do deploy:

- `profiles.0001_initial`: aplicado;
- `trusted_contacts.0002_profile_subject_and_location_default`: aplicado;
- `sinalseguro-api`: ativo;
- `nginx -t`: aprovado;
- `cereusia-crm`: ativo;
- `/etc/nginx/sites-available/cereusia.conf`: hash intacto `05a73c767a68612a5deb4e6a12a5ce23709c97f47f6bb3bfa652dc4408607c6c`.

Validação pública pós-deploy:

- `GET https://api.sinalseguro.com.br/api/health`: `ok`;
- `GET https://api.sinalseguro.com.br/api/health/ready`: `database=ok`;
- `GET https://api.sinalseguro.com.br/api/profiles/me` sem token: `401`, endpoint ativo e protegido por autenticação.

## Validacoes executadas

Backend local:

- `./.venv/bin/python manage.py check`: aprovado;
- `./.venv/bin/python manage.py test sinalseguro_api.tests`: 32 testes aprovados;
- `./.venv/bin/python manage.py spectacular --validate --file /tmp/sinalseguro-openapi.yaml`: aprovado com 1 warning conhecido de nome de enum `status`;
- `./.venv/bin/python manage.py makemigrations --check --dry-run`: aprovado, sem mudancas pendentes.

Mobile:

- `npm run test:profiles`: aprovado;
- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `node scripts/smoke-test.mjs`: aprovado;
- `npm test`: aprovado;
- `npm run private:android:readiness`: aprovado como build privado condicionado, com pendencia ambiental conhecida de Node local `20.16.0` para release publico;
- `git diff --check`: aprovado.

## Pendencias para fechar a Frente 1.3

- Validacao visual em Android fisico: `Perfis`, `Anjos`, modal de convite, bloqueio por perfil e `Convite recebido`.
- Teste manual supervisionado de Roberto com login/API real.
- Confirmar que o fluxo adulto cria convite backend depois de salvar perfil.
- Confirmar que menor protegido e perfil ausente bloqueiam criacao/aceite.
- Definir se a proxima fatia da Frente 1.3 inclui UI controlada de `ProtectedSubject`/vinculo/autorizacao ou se o responsavel por menor fica documentado como pendente ate etapa institucional.

## Proximo passo recomendado

Gerar build Android privado atualizado, instalar no Android fisico conectado e executar validacao visual/manual dos fluxos de perfil e convite contra a EC2 real.
