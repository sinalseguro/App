# Checkpoint Android - Notificacao de chamado para o anjo

Data: 2026-05-17
Coordenacao: Ze
Especialistas: Katia, Fabio, Doneda, Cristine, Lina, Tarcila, Eliane e Lucena

## Objetivo

Preparar a experiencia de aviso do anjo para o SOS ao vivo, mantendo linguagem simples, sem expor dados sensiveis e sem ativar servico persistente de segundo plano antes de gate juridico/operacional proprio.

## Implementado nesta subetapa

- O canal Android `sinalseguro-emergency-alerts` passou a ser preparado no boot do app.
- O canal usa importancia alta do Android para chamados de emergencia recebidos pelo anjo.
- A notificacao local do anjo usa prioridade maxima no conteudo, vibracao e cor da marca.
- A notificacao continua abrindo a tela `Alertas recebidos`.
- A mensagem permanece voltada ao publico final, sem termos tecnicos internos.

## Limites preservados

- Nao foi ativado bypass de `Nao perturbe`.
- Nao foi ativado servico persistente em segundo plano.
- Nao foi criado canal push remoto ou FCM nesta subetapa.
- A notificacao nao carrega midia, SDP, ICE, token, localizacao crua nem dados pessoais alem do nome publico ja exibido no fluxo autorizado.

## Validacoes executadas

- `npm run typecheck`: aprovado.
- `git diff --check`: aprovado.
- Teste Django focado de `audit-marker`: aprovado novamente apos a subetapa, sem regressao no backend.

## Gates pendentes antes de release

- `npm run lint`.
- `npm test`.
- Build Android bundled completo.
- Validacao visual em Android fisico: permissao de notificacao concedida, pedido recebido, notificacao abre `/alerta`, e anjo entra no acompanhamento ao vivo.
- Definicao futura de segundo plano real/foreground service com Doneda, Cristine e Tereza antes de ativar qualquer persistencia.

## Proxima subetapa

Rodar validacoes completas locais, compilar APK debug bundled para instalacao fisica e testar dois Androids antes de publicar nova release privada.
