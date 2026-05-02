# SinalSeguro App

App mobile Android e iOS do SinalSeguro.

Status: checkpoint inicial de desenvolvimento.  
Coordenacao geral: Ze.  
Gerente AI mobile: Cristine.

## Objetivo

Criar um app gratuito para pessoas em situacao de vulnerabilidade, com rede de anjos, convite unico, botao de panico in-app, alerta discreto, localizacao pontual consentida, outbox criptografada e integracao API-first.

O app nao substitui 190, 180, delegacias, saude, assistencia social, Defensoria, Ministerio Publico, Judiciario ou qualquer servico oficial.

## Stack

- React Native com Expo Dev Client/EAS.
- TypeScript.
- Expo Router.
- Android 7+.
- iOS 15.1+.
- Design system unico para Android e iOS.

## Comandos

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run start
```

Builds internos serao feitos por EAS quando Kim liberar as credenciais e perfis fora do repositorio.

## Limites

- Nao versionar `.env`, tokens, chaves, credenciais, dados reais ou relatos identificaveis.
- Nao implementar gravacao oculta.
- Nao usar acessibilidade para burlar permissoes do sistema.
- Nao prometer acionamento de orgao publico sem convenio formal.
- P2P fica como pesquisa futura/best-effort.
- Midia real fica bloqueada para producao ate RIPD/DPIA, retencao e revisao juridica.

## Documentacao

- `docs/00_PLANO_MOBILE.md`
- `docs/01_CRONOGRAMA.md`
- `docs/02_BACKLOG.md`
- `docs/03_TIMELINE.md`
- `docs/04_AGENTES.md`
- `docs/05_DESIGN_SYSTEM.md`
- `docs/06_UX_UI_IX.md`
- `docs/07_ARQUITETURA.md`
- `docs/08_SEGURANCA_LGPD.md`
- `docs/09_TESTES_QA.md`
- `docs/api/openapi.yaml`
