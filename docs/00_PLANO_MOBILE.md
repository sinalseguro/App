# 00 - Plano Mobile SinalSeguro

Data: 2026-05-02
Atualizacao de estado real: 2026-05-07
Supervisao: Ze
Gerencia mobile: Cristine

## Objetivo

Desenvolver o app SinalSeguro para Android e iOS com a mesma experiencia de UX/UI/IX, priorizando rapidez, discricao, seguranca, consentimento e continuidade.

## Estado real em 2026-05-07

Referencia canonica do projeto: `../../../docs/tecnico/ESTADO_ATUAL_APP_BACKEND_2026-05-07.md`.

- App mobile ja possui Home SOS, Cofre local, Player, midia local criptografada em chunks, cliente API real, login e-mail/Google/Apple preparado, dispositivos, consentimentos, anjos/convites e contratos para emergencia/envelopes/sinalizacao.
- Backend Django/DRF ja esta implementado/publicado em base modular; a API nao deve mais ser descrita como placeholder em documentos atuais.
- API publica `https://api.sinalseguro.com.br/api` foi validada nesta atualizacao com `health=ok` e readiness `database=ok`.
- Frente 1 de identidade social/sessao concluida em Android fisico e iOS logado; o antigo bloqueio de `Custom URI scheme` fica como registro historico.
- Frente 1.1 de chaves reais por dispositivo esta em execucao na sessao `019e0346-97cd-7153-87ba-730bd455b5db`.
- Proxima frente apos a 1.1: midia critica, gravacao, criptografia, player e performance.
- APK privado local mais recente: SHA-256 `e975046c54c756af14feba64fe40b83877252bb96bca0d97f2d334624218801b`; release publico tecnico continua `android-v0.1.0-internal.2`.
- Dados reais sensiveis, midia remota, localizacao ao vivo, videochamada, conveniados e orgaos publicos permanecem fora do MVP publico ate revisao juridica, seguranca, QA, retencao e RIPD/DPIA.

## MVP publico inicial

- Onboarding seguro.
- Login proprio, Google e Apple/OIDC.
- Cadastro minimo.
- Consentimentos versionados.
- Rede de anjos.
- Convite unico, opaco, expiravel e de uso unico.
- Botao de panico in-app por pressao longa ou sequencia.
- Alerta de teste e alerta real.
- Janela de cancelamento para falso positivo.
- Localizacao pontual consentida.
- Outbox local criptografada para offline/retry.
- Push discreto.
- Integracao API-first.

## Fora do MVP inicial

- Acionamento direto de orgaos publicos.
- P2P como caminho critico.
- Gravacao oculta.
- Rede social.
- Dados reais sensiveis sem RIPD/DPIA.
- Producao publica com midia sem revisao juridica.

## Princípios

- Privacidade por desenho.
- Menor privilegio.
- Mesma experiencia em Android e iOS.
- Permissoes incrementais.
- Linguagem simples, nao culpabilizante e sem jargoes.
- Logs sem dados sensiveis.
- Documentacao e comentarios em portugues.

## Critério de pronto da fase inicial

- App shell abre sem erro.
- Rotas principais existem.
- Design tokens e componentes base existem.
- Memoria da Cristine esta criada.
- Timeline e backlog estao versionados.
- Git publico esta configurado sem segredos.
- README possui marca aprovada por Tarcila.
- QR codes de Android/iOS apontam para paginas publicas estaveis.
- Distribuicao de instalaveis esta documentada sem publicar artefatos nao assinados como producao.
