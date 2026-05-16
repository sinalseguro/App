# Checkpoint F4.2 - Videochamada emergencial com um anjo

Data: 2026-05-16
Coordenacao: Ze
Especialistas: Katia, Fabio, Cristine, Doneda, Eliane, Lina e Tarcila
Status: implementado localmente e validado em dois Androids fisicos para o recorte MVP; publicacao no portal ainda nao executada nesta rodada.

## Decisao de escopo

O MVP Android da chamada emergencial fica focado em uma videochamada com um unico anjo aceito por ocorrencia.

Agentes homologados de instituicoes conveniadas ficam fora do app comum do MVP. Esse fluxo deve entrar depois em versao/variante institucional propria, com contrato, RBAC, MFA, auditoria, retencao, treinamento operacional e RIPD/DPIA.

## Como ficou o fluxo tecnico

- A ocorrencia SOS continua gravando midia local no aparelho da pessoa protegida.
- A API/EC2 cria e audita a ocorrencia, valida o anjo aceito, limita o roteamento a um destinatario e transporta apenas envelopes efemeros e sinalizacao WebRTC.
- A midia da chamada nao passa pelo backend.
- Apos a negociacao segura, audio/video trafegam P2P por WebRTC.
- No recorte atual, a pessoa protegida envia voz e recebe video/voz do anjo enquanto a camera traseira segue dedicada a gravacao local da ocorrencia.
- O anjo envia voz e video depois de aceitar o pedido e tocar em entrar na videochamada.
- O encerramento do SOS encerra a chamada e revoga/consome controles efemeros no backend.

## Implementado

- Backend limita destinatarios de chamada/alerta ao anjo aceito mais recente no MVP.
- `GET /api/emergency-sessions/{id}/live-recipients/` retorna somente o anjo aceito elegivel para a sessao.
- Home Android reidrata a sessao remota ativa apos restaurar pacote local.
- Home Android limita a entrega local a um anjo aceito.
- Tela `Alertas recebidos` libera `Entrar na videochamada` apenas para pedido ativo aceito.
- Runtime WebRTC Android aceita transceptores `sendrecv` e `recvonly`.
- Painel de chamada mostra video remoto quando disponivel, com rotulo para a imagem do anjo.
- Textos publicos foram ajustados de chamada generica para videochamada.
- `finish` do SOS limpa o estado visual da chamada ao voltar para Home.
- Fallback de criacao de ocorrencia remota evita bloquear SOS quando metadado de dispositivo vier temporariamente invalido.

## Evidencias fisicas

Diretorio:

- `docs/evidencias/android/2026-05-16-f4-2-video-unico-anjo/`

Evidencias principais:

- `screen-usb-after-call-pressed.png`: aparelho protegido com SOS ativo, gravacao local preservada e video do anjo renderizado.
- `screen-wifi-after-owner-call-pressed.png`: aparelho anjo conectado.
- `screen-usb-current-after-resume.png`: retomada com chamado ativo e chamada conectada.
- `screen-wifi-current-after-resume.png`: anjo conectado ao pedido mais recente.
- `screen-usb-after-ending-voice-call.png`: encerramento do SOS preserva pacote de midia local.
- `screen-usb-after-continue-voice-call.png`: retorno limpo para Home apos continuar.
- `logcat-usb-connected-summary.txt`, `logcat-wifi-connected-summary.txt`, `logcat-usb-voice-connected-summary.txt`, `logcat-wifi-voice-connected-summary.txt`: resumos saneados dos logs fisicos da chamada.

Observacao de seguranca: os logcats crus foram descartados antes do Git porque capturavam ruido de apps de terceiros do aparelho. Foram preservadas apenas evidencias visuais e linhas filtradas de WebRTC/SinalSeguro sem token, e-mail, `Authorization` ou identificadores de apps externos.

Consulta na EC2 confirmou sessao mais recente encerrada com:

- `recipient_count=1`;
- um envelope efemero;
- sete sinais P2P;
- status final `finished/ended`.

## Validacoes

- Backend local: 46 testes focados de plataforma aprovados.
- Deploy API EC2 aprovado, `nginx -t` ok, `sinalseguro-api` e `cereusia-crm` ativos, `cereusia.conf` preservado.
- Health publico: `https://api.sinalseguro.com.br/api/health` e `/api/health/ready` ok.
- Mobile: `npm run typecheck` aprovado.
- Mobile: `npm run lint` aprovado.
- Mobile: `npm test -- --runInBand` aprovado.
- Mobile: `npm run build:android:debug:bundled` aprovado.
- APK local: `android/app/build/outputs/apk/debug/app-debug.apk`.
- APK local atual: `versionName=0.1.8`, `versionCode=10`, SHA-256 `adc62dd434ac884c921d161c88c797300d25a3f7d26a7ad0ab5de7e79f2619a0`.
- APK instalado com sucesso no Android USB `0123456789ABCDEF`.
- Instalar APK grande no Android via transporte Wi-Fi `835` travou em transferencia; comandos leves continuam funcionando. Repetir instalacao por USB ou portal quando necessario.

## Limites conhecidos

- O video da pessoa protegida ainda nao e enviado ao anjo para nao disputar a camera traseira usada pela gravacao local da ocorrencia.
- Enviar video da pessoa protegida exigira uma subfase nativa de compartilhamento/duplicacao segura de camera ou mudanca explicita de politica de midia.
- O teste atual foi validado em rede local/mesmo ambiente; NAT restritivo ainda exige decisao futura sobre STUN/TURN ou relay efemero com custo e logs minimos.
- Push/full-screen, segundo plano real e versao institucional conveniada continuam fora deste checkpoint.

## Proxima recomendacao

Fechar a F4.2 do MVP como: pessoa protegida grava localmente, envia voz e recebe video/voz de um unico anjo. A proxima fatia deve tratar notificacao/chamada em segundo plano e politica de STUN/TURN, antes de expandir para multiplos papeis ou instituicoes.
