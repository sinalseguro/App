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
- Frente 1.1 de chaves reais por dispositivo esta concluida, publicada em producao e homologada no Android fisico; iOS sera validado posteriormente.
- Proxima frente: midia critica, gravacao, criptografia, player e performance.
- APK privado Android da homologacao 1.1: SHA-256 `9b37ed50604da58cd4bbe11622de7802c0335140e262e895b444da30ea5217f7`; release publico tecnico continua `android-v0.1.0-internal.2`.
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
