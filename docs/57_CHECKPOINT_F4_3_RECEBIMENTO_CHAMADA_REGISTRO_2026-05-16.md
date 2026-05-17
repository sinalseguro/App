# Checkpoint F4.3 - Recebimento de chamada e registro do anjo

Data: 2026-05-16
Coordenacao: Ze
Especialistas aplicados: Lina, Doneda, Cristine e Eliane
Status: implementado no Android local e validado fisicamente em dois Androids conectados.

## Decisao de fluxo

O app do anjo passa a tratar chamado SOS recebido como chamada emergencial operacional:

- chamado ativo recebido e autorizado deve ser aceito pelo app do anjo;
- o app do anjo deve exibir notificacao local quando detectar o chamado ativo;
- o registro local seguro fica ativo em background assim que o app do anjo sincroniza o chamado autorizado;
- o app do anjo inicia automaticamente o modo de acompanhamento ao vivo, aguardando a oferta WebRTC da pessoa protegida;
- "Acompanhar ao vivo" fica como acao manual de fallback, nao como requisito principal;
- historico local lista chamadas por pessoa protegida, com snapshot, data, duracao, status e acao de abrir/compartilhar;
- compartilhamento do registro fica limitado ao usuario protegido ou autoridade competente, respeitando necessidade, finalidade e minimizacao.

## Implementado

- `app/alerta.tsx` agora autoaceita chamados ativos ainda nao aceitos quando a tela sincroniza alertas recebidos.
- `app/alerta.tsx` dispara notificacao local de chamado recebido por `notifyIncomingEmergency`.
- `app/alerta.tsx` salva/atualiza o registro local de chamada em background antes de abrir ou aguardar a videochamada.
- `app/alerta.tsx` inicia automaticamente `startAngelAudioCall` depois do registro local e mantém o botao `Acompanhar ao vivo` como fallback.
- `app/index.tsx` tenta iniciar automaticamente a videochamada da pessoa protegida apos o aceite do anjo aparecer em `live-recipients`.
- `app/_layout.tsx` instala o handler de notificacoes em foreground e leva toque na notificacao para `/alerta`.
- `app/alerta.tsx` bloqueia recusa/visualizacao simples depois que o chamado ja entrou no estado aceito/registrado.
- `src/services/liveWebRtcSession.ts` passa a negociar transceiver de video `recvonly` mesmo quando a pessoa protegida ja captura audio local, evitando painel conectado sem imagem remota.
- `src/features/live-call/incomingEmergencyNotification.ts` cria canal Android de alta prioridade e conteudo opaco/minimo para SOS recebido.
- `src/features/live-call/liveCallHistoryPolicy.ts` centraliza a politica pura de registro, duracao, snapshot e texto de compartilhamento.
- `src/features/live-call/liveCallHistory.ts` persiste o historico local no `secureJsonStore`.
- `scripts/live-call-history-policy.test.ts` cobre a politica do registro local.
- `scripts/smoke-test.mjs` passou a proteger o contrato de notificacao local, aceite/registro em background, inicio automatico do tempo real e historico seguro.

## Privacidade e limites legais

- O backend continua sem receber audio/video da chamada WebRTC.
- O registro local implementado nesta fatia e um registro operacional criptografado/local do evento recebido: ocorrencia, pessoa protegida, datas, duracao, status, snapshot textual e regra de compartilhamento.
- A notificacao atual e local/in-app: se o app do anjo estiver fechado e sem JS ativo, push real via backend/FCM/Expo Push ainda sera subfase propria.
- Gravacao do audio/video bruto da chamada WebRTC em arquivo local ainda nao foi implementada nesta fatia. Para gravar midia real da chamada do inicio ao fim sera necessaria subfase nativa propria, com consentimento claro, notificacao persistente, retencao, criptografia, exclusao, cadeia de custodia, risco de menor/ECA e validacao fisica em dois dispositivos.
- A UX usa "registro seguro" para evitar promessa de gravação oculta ou arquivo audiovisual ainda inexistente.
- Conveniados/orgaos seguem fora do app comum do MVP ate contrato formal, RBAC, MFA, auditoria, retencao, RIPD/DPIA e homologacao institucional.

## Validacoes

- `npm run typecheck`: aprovado.
- `npm run lint`: aprovado.
- `npm test`: aprovado.
- `npm run test:live-call-history`: aprovado.
- `npm run build:android:debug:bundled`: aprovado.
- APK local final: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256 do APK final: `a0cc379f59a680e752fb2593af9f5c72b2a2ada290e8232de85ae4df7130b091`.
- ADB USB: `adb -s 0123456789ABCDEF install -r android/app/build/outputs/apk/debug/app-debug.apk` aprovado.
- ADB Wi-Fi: `adb -t 835 install -r -d --no-streaming android/app/build/outputs/apk/debug/app-debug.apk` aprovado.
- Versao instalada nos dois Androids: `versionName=0.1.8`, `versionCode=10`.
- Android fisico USB: modelo reportado `mobile terminal`, Android `8.1.0`, SDK `27`.
- Deep link/rota `sinalseguro://alerta` abriu a tela `Alertas recebidos` sem crash.
- EC2 antes do teste final: `active_count=0` apos encerramento de duas ocorrencias antigas de homologacao com auditoria `manual_test_cleanup`.
- EC2 durante o teste final: uma sessao ativa em `phase=accepted`, destinatario `accepted`, sinais P2P `offer`/`answer`/`ice` e envelope `live_session` ativo.
- EC2 apos encerramento final: `active_count=0`; sessao final `finished/ended`, destinatario `ended`, 0 sinais P2P pendentes e 0 envelopes ativos.
- Validacao visual fisica: pessoa protegida manteve `CHAMADO ATIVO` e midia local; anjo recebeu pedido, entrou em `Registro seguro ativo`; ambos chegaram a `Acompanhamento ao vivo conectado`; no segundo ciclo validado a pessoa protegida exibiu `Imagem do anjo`.

## Evidencia

Diretorio:

- `docs/evidencias/android/2026-05-16-f4-3-notificacao-registro-ao-vivo/`

Arquivos:

- `13-wifi-alerta-after-reinstall.png`: anjo recebeu notificacao local `SOS recebido` e card de registro seguro.
- `18-usb-after-sos-17s.png` e `19-wifi-after-sos-17s.png`: primeiro ciclo conectou o ao vivo nos dois lados.
- `24-usb-final-run-connected.png` e `25-wifi-final-run-connected.png`: ciclo final apos correção WebRTC, com aceite/registro ativo e negociacao em andamento.
- `26-usb-final-run-late.png` e `27-wifi-final-run-late.png`: ciclo final conectado; pessoa protegida exibindo imagem recebida do anjo e anjo em acompanhamento conectado.
- `30-usb-final-ended-confirm.png`: pacote local protegido a 100% apos encerramento.
- `backend-final-session-sanitized.txt`: evidencia sanitizada da sessao final na EC2.
- `logcat-usb-final-app-only.txt` e `logcat-wifi-final-app-only.txt`: logs restritos ao PID do app; sem crash do processo SinalSeguro durante o teste.

## Proxima recomendacao

Fechar esta fatia como validada para Android MVP: alerta local, registro seguro automatico e acompanhamento ao vivo P2P com um anjo funcionaram em dois aparelhos fisicos. A proxima subfase recomendada e push real em segundo plano/fora do app e, separadamente, gravacao nativa da midia WebRTC recebida/enviada pelo anjo somente com consentimento, indicador persistente, retencao e cadeia de custodia aprovados por Doneda/Cristine/Eliane.

## Atualizacao de retomada - 2026-05-17

Motivo: no teste fisico seguinte, o aparelho da pessoa protegida entrou em SOS local, mas a EC2 nao recebeu uma nova sessao valida; com isso, o app do anjo nao tinha pedido ativo para aceitar.

Implementado nesta retomada:

- `app/_layout.tsx` manteve o bridge em foreground para detectar chamado recebido no aparelho do anjo fora da tela `/alerta` e abrir o atendimento.
- `app/index.tsx` ganhou retry controlado do SOS ativo: enquanto houver pacote local ativo e ainda nao houver `liveRemoteSessionId`, a Home tenta sincronizar o pacote ativo com a EC2 a cada 5 segundos.
- A UX do solicitante agora mostra estados de usuario final como `Você pediu ajuda`, `Aguardando anjo`, `Anjo entrou. Chamando agora` e `SOS local ativo. Tentando avisar seus anjos pela internet`.
- `scripts/smoke-test.mjs` passou a bloquear regressao do retry do pacote ativo, do bridge do anjo, da rota por papel/dispositivo e do auto-start da chamada.

Validacoes desta retomada:

- `npm run typecheck`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm test`: aprovado.
- `npm run lint`: aprovado.
- `npm run build:android:debug:bundled`: aprovado.
- APK debug gerado antes da limpeza: `android/app/build/outputs/apk/debug/app-debug.apk`.
- SHA-256 do APK instalado: `253ca236b1e9f78d3d747d0caca18e475fdce937dd86dd5be8ae49e7b1062c49`.
- APK instalado nos dois Androids: USB `0123456789ABCDEF` e Wi-Fi `transport_id=835`.
- Versao instalada nos dois Androids: `versionName=0.1.8`, `versionCode=10`.
- Por falta de espaco no Mac, apos a instalacao fisica o output regeneravel `android/app/build` foi removido; se for preciso reinstalar, reconstruir o APK.

Evidencia fisica desta retomada:

- Diretorio: `docs/evidencias/android/2026-05-16-f4-3-final-physical/`.
- `30-owner-10s-after-sync-retry-sos.png`: pessoa protegida em SOS ativo.
- `31-angel-10s-after-sync-retry-sos.png`: app do anjo saiu da Home e abriu `Alertas recebidos`.
- `32-owner-60s-after-sync-retry-sos.png`: pessoa protegida com `Anjo na chamada` e midia local ativa.
- `33-angel-60s-after-sync-retry-sos.png`: anjo em `Atendendo como anjo`, falando com Roberto Dantas Castro.
- `36-owner-after-ending-wait.png`: encerramento final com `Video protegido` 100%.
- `37-owner-final-home-after-validated-sos.png`: Home voltou para `SOS`.

Evidencia EC2 desta retomada:

- Sessao final validada: `3b717e39-dfd8-459c-bc15-4176f1128463`.
- Durante o atendimento: `status=active`, `phase=accepted`.
- Destinatario: `relationship_role=angel`, `status=accepted`, `accepted_at=2026-05-17 02:30:56.9545+00`.
- Sinalizacao P2P: `offer` e `ice` sairam de `owner` para `angel`; `answer` e `ice` voltaram de `angel` para `owner`, com `senderDeviceId` e `recipientDeviceId` preenchidos nos dois sentidos.
- Envelope de chave: `scope=live_session`, `algorithm=webrtc-dtls-srtp-v1`, `status=active` durante a chamada.
- Encerramento: a sessao ficou `finished/ended` e o destinatario ficou `ended` em `2026-05-17 02:35:19+00`.

Conclusao desta retomada:

- O comportamento que parecia devolver a chamada para o aparelho de origem foi corrigido no ciclo validado: o owner criou a sessao na EC2, o anjo recebeu/aceitou, o P2P negociou com papeis opostos e dispositivos distintos, e a chamada foi encerrada com auditoria.
- Fica como hardening visual posterior remover ou atualizar o painel `Chamada com anjo` quando a sessao ja foi encerrada, porque apos o encerramento a Home ainda pode exibir o card desabilitado ate a proxima atualizacao de estado.

## Hardening visual - 2026-05-17

Motivo: apos um ciclo de SOS/anjo encerrado, a Home podia voltar para o botao `SOS` mas ainda manter o card `Chamada com anjo` desabilitado, gerando ambiguidade para usuario leigo.

Implementado:

- `app/index.tsx` agora limpa `liveRemoteSessionId`, estado local de WebRTC e listas internas de autochamada quando nao ha SOS ativo, inicializacao, finalizacao ou midia pendente.
- O painel `LiveAudioCallPanel` na Home passou a ser renderizado apenas quando existe SOS ativo e uma chamada/sessao relacionada ao SOS.
- `EmergencyMediaRecorder` tambem deixa de reservar espaco para painel de chamada quando nao ha SOS ativo.
- `scripts/smoke-test.mjs` passou a proteger o contrato `liveCallPanelVisible` e a limpeza do estado idle.

Validacoes:

- `node scripts/smoke-test.mjs`: aprovado.
- `npm run typecheck`: aprovado.
- `npm test`: aprovado.
- `npm run lint`: aprovado.
- `npm run build:android:debug:bundled`: aprovado.
- APK instalado nos dois Androids: `versionName=0.1.8`, `versionCode=10`.
- SHA-256 do APK instalado nesta rodada: `475a462efeceead71baab0de7551e05aa8f8dacce895bd9e0c47528f7b334335`.
- EC2 apos abertura da nova versao: `0` sessoes ativas.
- Validacao visual: `38-owner-after-ui-cleanup-install-home.png` mostra Home limpa, apenas com botao `SOS` e sem card residual de chamada.

Observacao operacional:

- Apos a instalacao, o segundo Android abriu no gate de login; antes do proximo teste fisico completo como anjo, ele precisa estar logado novamente com a conta Google do aparelho.
- Por espaco em disco, o output regeneravel `android/app/build`, `android/.gradle` e `android/build` foi removido apos a instalacao. Se for preciso reinstalar, reconstruir o APK.

## Direcao correta da videochamada - 2026-05-17

Motivo: Roberto validou que, ao apertar SOS, o anjo precisa ver e ouvir a transmissao do aparelho que pediu ajuda. No ciclo fisico anterior, a EC2, a sinalizacao P2P e o WebRTC ja entregavam `audio=1 video=1` ao anjo, mas a interface nao renderizava o video recebido.

Diagnostico:

- O owner estava capturando camera e microfone WebRTC depois do handoff da midia local.
- O anjo recebia `ontrack`, criava `VideoTrackAdapter`, iniciava playout de audio e registrava `[SinalSeguroLiveCall] remote_stream_track audio=1 video=1`.
- A tela do anjo continuava sem quadro de video porque o estado posterior de entrada como anjo sobrescrevia o `remoteStream` recebido antes da renderizacao.

Implementado:

- `src/features/live-call/useLiveAudioCall.ts` passou a armazenar `remoteStreamUrl` junto com o `remoteStream`.
- O `onRemoteStream` agora usa o papel real do runtime e so renderiza stream remoto no papel `angel`; o owner segue como transmissor.
- A atualizacao posterior do fluxo do anjo preserva `remoteStream` e `remoteStreamUrl` se a midia ja chegou.
- `src/features/live-call/LiveAudioCallPanel.tsx` renderiza o `RTCView` por `remoteStreamUrl` estavel e usa `key` por URL para forcar montagem limpa.
- `android/app/build.gradle` passou a respeitar `reactNativeArchitectures` tambem em `ndk.abiFilters`; isso permitiu gerar APK fisico local `armeabi-v7a` sem carregar ABIs desnecessarias no Mac com pouco espaco.
- `scripts/smoke-test.mjs` passou a bloquear regressao de `remoteStreamUrl`, `streamUrlFrom`, preservacao do stream e direcao owner->anjo.

Validacoes desta rodada:

- `npm run typecheck`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test -- --runInBand`: aprovado.
- `npm run build:android:debug:bundled` equivalente via `./gradlew assembleDebug -PsinalBundleDebugJs=true -PreactNativeArchitectures=armeabi-v7a --no-daemon`: aprovado.
- APK instalado nos dois Androids: `versionName=0.1.8`, `versionCode=10`, `primaryCpuAbi=armeabi-v7a`.
- SHA-256 do APK instalado nesta validacao local: `32cd04e6ba9859cfd9df23234911d8e44f66dadd2261c2c75bbf01c13aa40a40`.
- Aviso: este APK `armeabi-v7a` e artefato de teste fisico local; release publica deve ser gerada com `arm64-v8a` incluido.

Validacao fisica:

- Android owner USB `0123456789ABCDEF`: pressionou SOS, ficou em `Transmitindo ao anjo` e capturou a camera do evento.
- Android anjo Wi-Fi `transport_id=835`: abriu `Alertas recebidos`, entrou como anjo e exibiu o video remoto com o rotulo `Pessoa protegida`.
- EC2 durante a chamada final: sessao `9228ecac-1bb6-473d-ac95-4b4eeec9935c` ficou ativa/aceita e depois foi encerrada como `finished/ended`.
- EC2 apos limpeza final: `0` sessoes ativas.

Evidencias principais:

- `docs/evidencias/android/2026-05-16-f4-3-final-physical/91-owner-preserve-sos-20s.png`: owner em SOS ativo antes da conexao.
- `docs/evidencias/android/2026-05-16-f4-3-final-physical/93-owner-preserve-sos-75s.png`: owner transmitindo ao anjo.
- `docs/evidencias/android/2026-05-16-f4-3-final-physical/94-angel-preserve-sos-75s.png`: anjo vendo o video da pessoa protegida com rotulo `Pessoa protegida`.
- `docs/evidencias/android/2026-05-16-f4-3-final-physical/94-angel-preserve-logcat.txt`: log com `remote_stream_track audio=1 video=1`, `VideoTrackAdapter` e audio `fine`.
- `docs/evidencias/android/2026-05-16-f4-3-final-physical/97-owner-after-close-final.png`: pacote local finalizado como `Video protegido` 100%.
- `docs/evidencias/android/2026-05-16-f4-3-final-physical/98-owner-ready-after-final-close.png` e `99-angel-ready-after-final-close.png`: dispositivos deixados sem sessao ativa.

Conclusao:

- Corrigido o comportamento central: quem aciona o SOS transmite video/audio; o anjo recebe e acompanha a transmissao em tempo real.
- Mantido o desenho arquitetural aprovado: backend/EC2 como plano de controle e auditoria minima; midia pos-conexao via WebRTC P2P/DTLS-SRTP, sem audio/video bruto passando pelo backend.
