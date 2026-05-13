# 38 - Checkpoint de abertura - Frente 1.3 - Perfis, familia, maioridade e papeis - 2026-05-13

Status: Frente 1.3 iniciada no app Android/MVP, com primeira fatia local implementada e testavel.

## Contexto

Roberto aprovou manualmente a Frente 1.2 Android em 2026-05-13. O foco do MVP permanece Android; iPhone/iOS esta em frente pos-MVP e nao deve bloquear este ciclo.

Esta frente existe para impedir que anjos, chamada P2P, emergencia remota, localizacao ao vivo ou conveniados sejam ativados antes de o app entender papeis, maioridade, responsaveis, consentimentos e autorizacoes.

## Especialistas acionados

- Zé: coordenacao, memoria e checkpoint.
- Silvio + Lucena: escopo MVP, sequencia incremental e rastreabilidade.
- Kátia + Fábio: leitura mobile/API e contratos tecnicos.
- Doneda + Cristine: LGPD, menoridade, abusos, consentimento e seguranca.
- Lina + Eliane: UX, guardrails para usuario leigo e QA sem device fisico.

Conclusao conjunta: a frente deve comecar por contrato de dominio e bloqueios de papel, nao por P2P, chamada, upload, localizacao ou conveniados.

## Primeira fatia implementada

Arquivos principais:

- `src/features/profiles/profilePolicy.ts`
- `src/features/profiles/profileStore.ts`
- `app/perfis.tsx`
- `app/contatos.tsx`
- `app/convite.tsx`
- `scripts/profile-policy.test.ts`
- `scripts/smoke-test.mjs`
- `package.json`

Entregue:

- politica pura de perfis e papeis para MVP Android;
- tela local `Perfis e papeis`;
- persistencia local cifrada do perfil ativo via `secureJsonStore`;
- bloqueio de `Criar convite` quando o perfil nao permite;
- bloqueio de aceite como anjo quando o perfil local e menor ou nao definido;
- teste automatizado de politica de perfis;
- smoke test protegendo a regressao de menor convidar/atuar como anjo;
- menu da Home com atalho para `Perfis`.

Perfis locais iniciais:

- adulto usando para si;
- responsavel por menor;
- menor protegido;
- responsavel sem menor vinculado.

## Regras aplicadas agora

- perfil ausente nao cria convite de anjo;
- adulto protegido pode preparar a propria rede;
- responsavel por menor pode preparar rede autorizada do menor;
- menor protegido nao cria convite;
- menor protegido nao aceita atuar como anjo;
- responsavel sem menor vinculado fica em estado conservador para convite;
- anjo so pode receber entrega futura se o vinculo estiver aceito e a autorizacao estiver vigente.

## Minimização de dados

Nesta primeira fatia nao foram coletados:

- CPF, RG, CNH, foto de documento ou selfie;
- data de nascimento completa;
- endereco, escola, trabalho, rotina ou parentesco detalhado;
- nome legal completo de menor;
- agenda do telefone;
- telefone de terceiros;
- relato de violencia, boletim, medida protetiva ou dado sensivel;
- localizacao continua;
- midia enviada a terceiros;
- dados operacionais de conveniados.

## Fora de escopo preservado

- iOS/iPhone;
- motor de midia, SOS, Cofre e Player da Frente 1.2;
- WebRTC/P2P real;
- chamada audio/video real;
- upload de midia;
- localizacao ao vivo;
- conveniados e orgaos;
- integracao oficial com servicos publicos;
- coleta documental de responsabilidade legal.

## Gates locais ja executados nesta abertura

- `npm run test:profiles`: aprovado;
- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `node scripts/smoke-test.mjs`: aprovado;
- `npm test`: aprovado;
- `npm run private:android:readiness`: aprovado como build privado condicionado, com pendencia ambiental conhecida de Node local `20.16.0` para release publico;
- `git diff --check`: aprovado.

Gates ainda pendentes para fechamento da Frente 1.3:

- testes backend/Django quando a API receber modelo server-side de perfis/familia;
- validacao visual Android apos UX final da frente;
- aceite manual de Roberto.

## Proximo passo tecnico

Implementar a contraparte server-side da politica:

- modelo API para perfil protegido/responsavel;
- vinculo responsavel-protegido;
- autorizacao por escopo;
- bloqueio server-side de convite criado por menor;
- bloqueio de menor atuando como anjo;
- extensao de OpenAPI e testes Django.

Ate esse backend existir, o bloqueio mobile reduz risco de UX/fluxo, mas nao deve ser tratado como controle unico para producao real.
