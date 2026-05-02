# 01 - Cronograma Mobile

Data inicial: 2026-05-02  
Gerencia: Cristine  
Supervisao: Ze

## Fases

| Fase | Periodo | Objetivo | Responsaveis | Entregas |
|---|---|---|---|---|
| 0 | 2026-05-02 a 2026-05-03 | Preparacao | Cristine, Kim, Knuth | Repo, memoria, docs, timeline, .gitignore |
| 0.1 | 2026-05-02 a 2026-05-03 | Distribuicao preparada | Cristine, Tarcila, Kim | Logo README, QR codes, paginas de instalacao e plano de release |
| 0.2 | 2026-05-02 a 2026-05-03 | Etapa 1 Android instalavel | Cristine, Kim, Ada, Margaret, Myers, Schneier, Doneda | Plano de release Android, EAS APK explicito, readiness, checklist, criterios de bloqueio |
| 1 | 2026-05-04 a 2026-05-10 | Design system | Tarcila, Norman, Ada | Tokens, componentes, splash, telas-base |
| 2 | 2026-05-11 a 2026-05-17 | UX/IX navegavel | Norman, Myers, Tarcila | Onboarding, login, home, panico, contatos |
| 3 | 2026-05-18 a 2026-05-24 | Base tecnica | Ada, Katherine, Margaret | Expo Router, storage, tema, permissoes |
| 4 | 2026-05-25 a 2026-05-31 | API e anjos | Ritchie, Ada, Hedy | Auth, devices, consents, contacts, invitations |
| 5 | 2026-06-01 a 2026-06-07 | Botao de panico | Hedy, Norman, Myers | Gesto, cancelamento, teste/real, idempotencia |
| 6 | 2026-06-08 a 2026-06-14 | Notificacoes | Hedy, Ritchie, Kim | Push discreto, ack, deduplicacao |
| 7 | 2026-06-15 a 2026-06-21 | Midia homologada | Hedy, Doneda, Schneier | Cofre local, hash, upload retomavel |
| 8 | 2026-06-22 a 2026-06-28 | QA e release interno | Myers, Kim, Cristine | Testes, relatorios, build EAS interno |

## Regra de atualização

Cristine deve atualizar `docs/03_TIMELINE.md` em todo checkpoint de fase, mudanca de escopo, bloqueio ou decisao tecnica.

## Marcos de distribuicao

| Marco | Condicao |
|---|---|
| QR publico | URLs estaveis publicadas no portal |
| Android interno | APK assinado, hash SHA-256 e release notes |
| iOS interno | TestFlight com conta Apple e revisao de privacidade |
| Loja publica | Politicas, RIPD/DPIA quando aplicavel, QA, seguranca e aprovacao de loja |
