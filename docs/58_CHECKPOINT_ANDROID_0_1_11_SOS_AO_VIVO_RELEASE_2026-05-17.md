# Checkpoint Android 0.1.11 - SOS ao vivo, release privada e pendencia de gravacao local

Data: 2026-05-17
Coordenacao: Ze
Especialistas aplicados: Katia, Fabio, Tereza, Cristine, Eliane, Lina e Tarcila
Status: release privada publicada para testes manuais e atualizacao pelo app; SOS ao vivo validado; gravacao audiovisual local completa da chamada ao vivo segue como proxima subfase tecnica.

## Escopo executado

- Build Android privado recompilado como `versionName=0.1.11` e `versionCode=13`.
- APK gerado com `arm64-v8a` e `armeabi-v7a`.
- SHA-256 do APK: `2196c90158d6a521bc6f8f1bf9f78f922ba6dc264394544f512acc9222889145`.
- APK instalado via ADB USB no Android antigo `armeabi-v7a`.
- APK instalado via ADB Wi-Fi no Android `arm64-v8a`.
- Canal de atualizacao preparado para portal/API com nome publico estavel `sinalseguro_android.apk`.

## Ajustes tecnicos

- `emergencyPreferences` migrou o padrao de camera do SOS local para traseira em `schemaVersion=9`, evitando tentativa de camera frontal em aparelho que so expunha camera traseira.
- `LiveWebRtcSession` passou a usar perfil WebRTC mais leve, com `640x360`, ideal de 12 fps e maximo de 15 fps.
- `LiveWebRtcSession` ganhou timeout controlado de abertura de midia e logs saneados para estado de conexao.
- `useLiveAudioCall.startOwnerAudioCall()` passou a retornar sucesso/falha para permitir retry sem marcar uma chamada como iniciada quando a camera/WebRTC falha.
- Home SOS so marca autochamada como iniciada quando a abertura da chamada retorna sucesso.
- Handoff da camera local para WebRTC foi ampliado de 4,5s para 12s para reduzir perda de arquivo local em Android fisico lento.

## Higienizacao antes dos testes

Dispositivos:

- USB: removidas 5 chaves locais efemeras; restante efemero `0`.
- Wi-Fi: removidas 3 chaves locais efemeras; restante efemero `0`.
- Arquivos de midia/cache de teste removidos dos sandboxes dos apps.
- Login, permississoes, SecureStore e vinculos de anjos preservados.

EC2/API:

- Antes da limpeza final: `sessions=1`, `recipients=1`, `envelopes=1`, `signals=9`, `audit_events=1242`.
- Depois da limpeza final: `sessions=0`, `active_sessions=0`, `recipients=0`, `envelopes=0`, `signals=0`, `audit_events=1242`.
- Auditoria, usuarios, dispositivos e vinculos aceitos foram preservados.

## Publicacao privada e validacao externa

- API publicada na EC2 com `app_releases.0010` e, em seguida, `app_releases.0011` para cache-buster unico do APK atual.
- Portal publicado em `/var/www/sinalseguro/releases/20260517T121652Z`.
- `GET /api/app-releases/current?platform=android&version_code=12` retornou `version=0.1.11`, `version_code=13`, `download_url` com `?v=0.1.11-20260517T121152Z` e SHA-256 `2196c90158d6a521bc6f8f1bf9f78f922ba6dc264394544f512acc9222889145`.
- Manifesto publico `downloads/installers.json` retornou Android `0.1.11`/`versionCode 13` e o mesmo SHA-256.
- Download publico do APK pela URL versionada retornou `130889547` bytes e SHA-256 `2196c90158d6a521bc6f8f1bf9f78f922ba6dc264394544f512acc9222889145`.
- Nginx, `sinalseguro-api` e `cereusia-crm` ficaram ativos; `cereusia.conf` foi preservado pelos scripts de deploy.

## Higienizacao final para nova rodada manual

- USB: removidas 8 chaves locais de historico/teste; ficaram somente preferencias, perfil e relacionamentos aceitos.
- Wi-Fi: removidas 13 chaves locais de historico/teste; ficaram somente preferencias, perfil e relacionamentos aceitos.
- Caches de video/http removidos dos sandboxes dos apps.
- EC2/API final: `sessions=0`, `active_sessions=0`, `recipients=0`, `envelopes=0`, `signals=0`, `audit_events=1274`.
- Cadastros, logins, permissoes, SecureStore, auditoria e vinculos aceitos foram preservados.

## Validacoes locais

- `npm run typecheck`: aprovado.
- `node scripts/smoke-test.mjs`: aprovado.
- `npm run lint`: aprovado.
- `npm test -- --runInBand`: aprovado.
- `npm run private:android:readiness`: aprovado com pendencia conhecida de Node local para build privado debug.
- Build Android privado: aprovado.
- `aapt dump badging`: `versionCode='13'`, `versionName='0.1.11'`, `native-code: 'arm64-v8a' 'armeabi-v7a'`.

## Validacao fisica

Rodada 0.1.10:

- SOS no USB criou sessao na EC2.
- Anjo Wi-Fi recebeu alerta e abriu `Alertas recebidos`.
- Anjo recebeu video ao vivo com rotulo `Pessoa protegida`.
- Backend registrou 1 sessao ativa, 1 destinatario aceito, 1 envelope `live_session` e sinais `offer`, `answer` e `ice`.
- Encerramento marcou sessao `finished/ended`, destinatario `ended`, 0 sinais pendentes e 0 envelopes ativos.
- Pendencia observada: solicitante encerrou como `Chamado salvo sem video`.

Rodada 0.1.11:

- SOS no USB criou sessao na EC2.
- Aos 25s, o USB estava em `Transmitindo ao anjo`.
- Aos 25s, o anjo Wi-Fi exibia video ao vivo da pessoa protegida.
- Log do anjo confirmou `remote_stream_track audio=1 video=1`.
- Log do anjo confirmou `connection_state=connected` e `ice_connection_state=connected`.
- Renderizacao de video no anjo chegou a cerca de 15 fps.
- Backend durante chamada: `sessions=1`, `active_sessions=1`, `recipients=1`, `envelopes=1`, `signals=9`, `signal_types=['answer', 'ice', 'offer']`.
- Backend apos encerramento: sessao `finished/ended`, destinatario `ended`, `pending_signals=0`, `active_live_envelopes=0`.
- Pendencia mantida: solicitante encerrou como `Chamado salvo sem video`; o anjo manteve registro seguro local finalizado com snapshot/duracao.

## Conclusao tecnica

O fluxo central de emergencia ao vivo esta funcional no Android: quem aciona SOS transmite audio/video, o anjo autorizado recebe e acompanha em tempo real, e a EC2 atua como plano de controle com autorizacao, sinalizacao, envelope e auditoria minima. Nao houve armazenamento de audio/video bruto na EC2.

A parte ainda nao fechada e a gravacao audiovisual local completa da chamada ao vivo enquanto o mesmo aparelho usa a camera para WebRTC. Em aparelho fisico de homologacao, a camera foi entregue ao WebRTC e a chamada funcionou, mas o pacote local do solicitante ficou sem arquivo de video. Isso exige subfase propria de captura unica/gravacao de stream WebRTC ou pipeline nativo equivalente, com indicador persistente, consentimento, retencao, criptografia e cadeia de custodia.

## Evidencias locais

- `docs/evidencias/android/2026-05-17-android-0110-release-clean-sos/`
- `docs/evidencias/android/2026-05-17-android-0111-release-clean-sos/`

As evidencias brutas ficam fora do Git por conterem telas/logs de aparelhos fisicos.

## Proxima recomendacao

Roberto deve atualizar os aparelhos pelo app/portal e validar manualmente o fluxo de SOS ao vivo entre os Androids limpos. Depois, abrir subfase tecnica dedicada para gravacao audiovisual da chamada ao vivo sem capturas concorrentes de camera.
