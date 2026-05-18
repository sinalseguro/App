# Checkpoint Pre-validacao Fisica Live-call Android

Data: 2026-05-18
Coordenacao: Ze
Especialistas: Cristine, Eliane, Katia e Lucena
Status: checkpoint operacional; sem alteracao de codigo, UX, backend, portal ou release.

## Objetivo

Retomar a frente apos os gates de refatoracao/seguranca da live-call e impedir que a proxima etapa avance sem evidencia fisica suficiente.

## Estado encontrado

- Branch `main` sincronizada com `origin/main`.
- Ultimo commit confirmado: `325571e Adiciona gate de logs sensiveis live-call`.
- App instalado no Android detectado:
  - pacote: `br.com.sinalseguro.app`;
  - `versionName=0.1.15`;
  - `versionCode=17`;
  - `lastUpdateTime=2026-05-17 19:20:32`.
- Permissoes runtime concedidas no aparelho detectado:
  - camera;
  - microfone;
  - notificacoes;
  - localizacao fina/aproximada.
- App nao estava em execucao no momento do levantamento (`pidof` sem processo ativo).
- ADB listou apenas um Android como `device`; validacao live-call fim a fim precisa de dois Androids.
- Espaco local no Mac estava baixo no momento do levantamento: cerca de 3.3 GiB livres; nao iniciar build Android pesado sem limpeza/necessidade.

## Decisao de seguranca/QA

Nao continuar refatorando live-call sem uma necessidade objetiva. Os ultimos passos ja extraem regras puras e adicionam gates de seguranca:

- `test:live-call-session`;
- `test:live-call-state`;
- `test:live-webrtc`;
- `test:live-call-security`.

A proxima mudanca em camera, WebRTC runtime, autoaceite, handoff de midia, encerramento do SOS, notificacao de anjo ou sincronizacao de sessao deve exigir validacao fisica Android em dois aparelhos antes de fechamento.

## Gate fisico necessario

Pre-condicoes:

- Dois Androids aparecendo em `adb devices -l` como `device`, ou um segundo Android testado manualmente sob supervisao e com evidencia minima saneada.
- Ambos com versao esperada instalada ou atualizados pelo fluxo aprovado.
- Ambos autenticados com conta propria.
- Vinculo de anjo aceito e visivel nos dois lados.
- Permissoes de camera, microfone, notificacoes e rede concedidas.

Fluxo minimo:

1. Originador aciona SOS.
2. API/EC2 cria ou sincroniza a sessao remota.
3. Anjo recebe o chamado e entra como anjo.
4. Originador transmite audio/video.
5. Anjo visualiza/ouve a pessoa protegida em tempo real.
6. Encerramento preserva evidencia local no originador quando aplicavel.
7. Backend registra auditoria saneada sem midia bruta, SDP, ICE, tokens, URI ou caminhos locais.
8. Logs filtrados nao mostram crash, ANR, `AndroidRuntime`, erro React Native fatal ou vazamento sensivel.

## Evidencias permitidas

- Versao instalada e permissoes saneadas.
- Estados de tela sem dados pessoais.
- Linhas filtradas `SinalSeguroLiveCall` com contagem de tracks e estado saneado.
- Resumo de sessoes API sem tokens, SDP, ICE, payload bruto, email, telefone, IP, coordenada ou midia.
- Inventario local saneado quando houver preservacao de evidencia.

## Evidencias proibidas no Git

- Logcat bruto.
- Capturas com mensagens pessoais, notificacoes externas, contatos, telefone, email, mapas, coordenadas ou ambiente identificavel.
- SDP, ICE candidate, Authorization, access/refresh/id token, convite, `encrypted_key`, payload P2P bruto.
- URI/path local de midia, midia bruta ou arquivo temporario em claro.

## Proxima acao recomendada

Reconectar/disponibilizar o segundo Android e repetir o gate fisico de SOS ao vivo. Se apenas um Android estiver disponivel, manter a frente como preparada e bloqueada para validacao fim a fim, sem publicar nova release nem declarar aprovacao operacional da live-call.
