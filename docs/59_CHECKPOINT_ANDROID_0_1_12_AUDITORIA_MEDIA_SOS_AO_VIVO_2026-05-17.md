# Checkpoint Android 0.1.12 - auditoria media do SOS ao vivo

Data: 2026-05-17  
Coordenacao: Ze  
Especialistas: Katia, Fabio, Doneda, Cristine, Tarcila, Lina e Eliane

## Objetivo

Dar continuidade ao SOS ao vivo Android aprovado manualmente na `0.1.11`, adicionando auditoria media e registro local seguro sem transformar a EC2 em servidor de midia.

## Implementado nesta etapa

- Backend/API passou a aceitar marcador saneado em `POST /api/emergency-sessions/{id}/audit-marker/`.
- O marcador so aceita eventos whitelistados da chamada ao vivo e rejeita campos inesperados como SDP, ICE, token, payload livre, caminho local ou midia.
- `call_session_id` nao e persistido em claro; quando enviado, fica apenas como hash de auditoria.
- Owner e anjo aceito podem registrar eventos proporcionais ao papel; terceiros nao enxergam a ocorrencia.
- App Android registra eventos saneados de handoff, offer, answer, conexao, falha, encerramento e estado de evidencia local.
- Solicitante ganhou registro local cifrado de evidencia operacional do SOS ao vivo, separado do historico do anjo.
- Home passou a exibir faixa persistente de status do chamado, usando o estado ja existente do fluxo de gravacao/transmissao.
- App sincronizado para Android `0.1.12`, `versionCode 14`.

## Limites preservados

- Audio/video bruto nao e enviado nem salvo na EC2.
- SDP e ICE continuam efemeros em `p2p-signals` e fora da auditoria permanente.
- A etapa ainda nao promete gravacao audiovisual completa da chamada ao vivo no solicitante.
- Registro local usa evidencia operacional cifrada; a gravacao audiovisual completa exige subfase nativa de captura unica ou gravacao do stream WebRTC.

## Validacoes desta etapa

- `npm run typecheck`: aprovado.
- `npm run test:live-call-history`: aprovado.
- `npm test`: aprovado.
- `npm run lint`: aprovado.
- `npm run private:android:readiness`: aprovado de forma condicionada, mantendo a pendencia conhecida de Node local para release publica.
- Backend: `python manage.py check`: aprovado.
- Backend: `python manage.py test sinalseguro_api.tests`: 49 testes aprovados.
- Backend: `python manage.py makemigrations --check --dry-run`: sem migracoes novas.
- Build Android debug bundled: aprovado para `0.1.12`/`versionCode 14`.
- APK final validado nos dois Androids fisicos por ADB: USB `armeabi-v7a` e Wi-Fi `arm64-v8a`.
- SHA-256 final do APK publicado: `f0e607ad0c36110653279687a776bdf3dd72a3e90f9322ea7d03041e47e1a8f7`.
- Teste fisico SOS: solicitante transmitiu `audio=1 video=1`; anjo recebeu `remote_stream_track audio=1 video=1`; ICE/WebRTC chegou a `connected`.
- Backend producao registrou a sessao testada como `finished`/`ended` e auditoria media com marcadores de handoff, offer, answer, connected, encerramento e evidencia local saneada.
- Tela do anjo corrigida para pedido encerrado: sem painel ativo residual, texto de consulta e botao `Encerrado`.
- Portal publicado em `/var/www/sinalseguro/releases/20260517T183651Z`.
- API de update retorna Android `0.1.12`/`versionCode 14` e hash esperado.
- Download oficial `sinalseguro_android.apk` conferido por hash apos publicacao.

## Resultado

Android `0.1.12` publicado para teste privado no portal e disponivel no canal de atualizacao do app.

## Proximo gate

Abrir a subfase de gravacao audiovisual local da chamada ao vivo, sem alterar o principio de que a midia bruta nao fica na EC2. A auditoria completa e cadeia de custodia forte ficam para homologacao juridica/institucional.
