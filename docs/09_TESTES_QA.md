# 09 - Testes QA

Responsavel: Myers

## Estado de QA em 2026-05-07

Referencia canonica: `../../../docs/tecnico/ESTADO_ATUAL_APP_BACKEND_2026-05-07.md`.

- Gates desta atualizacao documental aprovados: `npm run typecheck`, `npm run lint` e `npm test`.
- API publica validada por health/readiness: `health=ok` e `database=ok`.
- Android privado mais recente ja valida resolucao dos redirects `br.com.sinalseguro.app:/oauthredirect`, `sinalseguro:/oauthredirect` e `sinalseguro://configuracoes`.
- Frente 1 de identidade social/sessao concluida em Android fisico e iOS logado; o bloqueio de `Custom URI scheme` fica apenas como evidencia historica.
- Proximo bloqueio de QA: Frente 1.1 precisa provar chaves reais por dispositivo, posse da chave privada, rotacao, revogacao, perda de aparelho, assinatura de operacoes criticas e nao exposicao de segredo em logs.
- Ainda precisam de reteste depois das chaves reais: convite/aceite com duas contas/dispositivos, envelopes de chave, emergencia autenticada, logout com blacklist e alternancia de anjo em ocorrencia ativa.
- Testes locais do backend nao foram repetidos nesta rodada porque `services/api/.venv` esta ausente no workspace raiz.

## Matriz inicial

| Area | Cenarios |
|---|---|
| Onboarding | aceite, recusa, leitura, retorno |
| Login | proprio, Google, Apple, sessao expirada |
| Convite | criado, aceito, expirado, usado duas vezes |
| Anjos | listar, adicionar, revogar |
| Alerta | teste, real, cancelar, falso positivo, pacote local, hash |
| Arquivos locais | listar pacotes, atualizar, verificar hash, status de envio |
| Offline | sem rede, API fora, retry, deduplicacao |
| Localizacao | permitida, negada, revogada, indisponivel |
| Push | discreto, lock screen, deep link autenticado |
| Acessibilidade | fonte grande, leitor de tela, contraste |
| Plataforma | Android 7+, Android atual, iOS atual |

## Critérios de bloqueio

- Alerta perdido sem outbox.
- Dado sensivel em log, push ou URL.
- App promete resposta oficial.
- Fluxo de midia fora de homologacao.
- Falha de autorizacao em alerta ou anjo.

## Evidencias

- Prints saneados.
- Logs de teste sem dados sensiveis.
- Relatorio por fase.
- Lista de bugs e retestes.
- Aprovação Myers antes de release interno.

## Distribuicao

- QR Android abre `/baixar/android`.
- QR iOS abre `/baixar/ios`.
- Links de instalacao nao prometem artefato antes de assinatura.
- GitHub Release deve conter hash SHA-256.
- Portal deve informar status quando instalador ainda estiver pendente.
- Nenhum build de debug deve ser divulgado como producao.

## Etapa 1 Android instalavel

Checklist minimo de Myers:

- instalar APK em Android 7+ e Android atual;
- abrir app, onboarding, home, alerta de teste, contatos e configuracoes;
- confirmar que alerta permanece simulado e nao transmite dados;
- confirmar que camera e microfone nao sao solicitados;
- confirmar que `SYSTEM_ALERT_WINDOW` e armazenamento legado nao aparecem no APK;
- testar permissao de notificacao em Android 13+;
- revisar edge-to-edge/safe area em Android moderno com target SDK 36;
- registrar hash, dispositivo, versao e resultado sem dados pessoais.

## Convites e pacote local

Checklist minimo de Myers:

- gerar convite local e confirmar link publico com parametro `convite`;
- confirmar que deep link futuro nao autentica outra pessoa;
- compartilhar convite via share sheet sem dado sensivel adicional;
- acionar alerta de teste e confirmar pacote local em outbox;
- abrir area `Arquivos locais` e confirmar que os pacotes gravados aparecem;
- confirmar que a tela exibe horario, hash, status de georreferencia, midia bloqueada e plano API/P2P;
- confirmar que coordenadas completas nao sao exibidas sem autenticacao forte;
- validar pacote com localizacao permitida, negada e servico indisponivel;
- confirmar que API e P2P ficam como pendentes, sem transmissao real;
- confirmar que midia real permanece bloqueada e sem permissao de camera/microfone.

## Checkpoint 2026-05-03 - Home SOS fixa

Checklist executado por Myers com supervisao de Tarcila, Norman, Ada, Hedy, Schneier e Doneda:

- validar `http://localhost:8081/`, nao `/arquivos`, quando o objetivo for tela inicial;
- confirmar Home sem `SafeScreen`/`ScrollView` e sem rolagem na superficie de emergencia;
- confirmar que titulo/subtitulo duplicados foram removidos do corpo;
- confirmar SOS circular com largura responsiva de 75% e texto legivel;
- confirmar atalhos oficiais visiveis como `Policia`, `Bombeiros` e `SAMU`, com numeros preservados somente na confirmacao de chamada;
- confirmar drawer por engrenagem com modo atual, cofre/player, anjos, convites, configuracoes e atividade;
- acionar SOS por gesto longo no Android fisico e confirmar estado `ATIVO`;
- verificar `logcat` sem `FATAL`, `AndroidRuntime`, `RedBox`, `Unable to load script` ou `setValueWithKeyAsync`;
- registrar evidencias saneadas em `docs/evidencias/browser/2026-05-03-home-sos-refatorada/` e `docs/evidencias/android/2026-05-03-home-sos-refatorada/`.

## Checkpoint 2026-05-03 - Revisao especialistas

Checklist complementar de Myers:

- confirmar que `startEmergencyPackage()` nao cria dois chamados `recording_local` simultaneos;
- confirmar que `recordEmergencyPackage()` nao finaliza chamado ativo por engano;
- confirmar que excluir pacote local exige confirmacao;
- confirmar que pacote ativo nao pode ser excluido pelo cofre;
- confirmar que drawer da Home nao mostra jargao `backend/P2P`;
- confirmar que `Policia`, `Bombeiros` e `SAMU` aparecem por padrao e nao sao ocultados por preferencia local;
- confirmar que fallback web do cofre usa memoria volatil e nao `sessionStorage`;
- confirmar que a documentacao de splash corresponde ao `app.json` atual.

## Checkpoint 2026-05-06 - Midia criptografada C2

Checklist executado:

- rodar `npm run typecheck`, `npm test`, `npm run lint` e `npm run build:android:private`;
- instalar o APK privado no Android fisico conectado por ADB;
- acionar SOS por gesto longo e confirmar estado ativo sem travamento;
- encerrar SOS por gesto longo e aguardar preservacao criptografada;
- confirmar asset cifrado com `manifest.sseg`, chunks `.sseg` e `thumbnail.sseg`;
- confirmar por ADB absoluto que `cache/Camera` fica vazio apos preservacao;
- confirmar por ADB absoluto que `cache/VideoThumbnails` fica vazio apos derivacao da thumbnail;
- confirmar que nao ha `.mp4` claro nos caches nativos apos preservacao verificada;
- salvar screenshot/logcat/inventario em `docs/evidencias/android/2026-05-06-capture-cleanup-thumbnail/`.

Resultado:

- aprovado no Android fisico `192.168.0.4:5555`;
- APK SHA-256 `024150800908109199f84e1be2ef5bd9c72ae1f6986ecee0a8269f2c44ca1323`;
- asset validado `7c967904-589c-452c-85fc-8203aee83be9`, com `manifest.sseg`, 22 chunks e `thumbnail.sseg`;
- `cache/Camera` e `cache/VideoThumbnails` vazios no inventario final.

## Frente 1.2 - Midia critica, performance e player

Checklist Myers para a proxima reproducao fisica:

- confirmar worktree limpo antes da bateria;
- instalar build privado atual sem alterar contratos de chaves/dispositivos;
- executar gravacoes de 30s, 60s, 3min e 5min em Android fisico;
- repetir a matriz em iPhone fisico quando instalacao/lancamento estiver operacional;
- medir tempo ate camera pronta, duracao real de captura, tempo de preservacao cifrada, tempo de thumbnail, tempo de verificacao e tempo de limpeza;
- medir memoria e CPU do processo durante captura, preservacao e player;
- registrar tamanho do MP4 temporario, quantidade de chunks, tamanho medio de chunk, tamanho total cifrado e overhead;
- medir tempo ate primeiro frame no Player Seguro;
- se o Player falhar, registrar etapa/codigo tecnico saneado, sem URI, caminho completo, token, chave, e-mail, IP ou payload sensivel;
- confirmar que nao fica `.mp4` claro permanente em cache ou diretorio privado apos preservacao verificada;
- confirmar que logs nao contem midia, caminho sensivel, token, chave privada, e-mail, IP ou payload sensivel.

Criterio de decisao:

- correcao pontual se a medicao isolar falha especifica de player/loopback/codec/estado;
- refatoracao nativa se JS/Base64/loopback exceder limite aceitavel de CPU, memoria, I/O, tempo ate primeiro frame ou degradacao apos gravacoes longas.

## Checkpoint 2026-05-08 - Frente 1.2 iOS sem midia no player

Diagnostico Myers/Schneier:

- prints do iPhone mostraram `Sem midia`, `Nenhum video neste arquivo`, `Sem camera` e eventos com duracao/localizacao preservadas;
- container do app confirmou `/Documents` sem `manifest.sseg`, chunks ou thumbnails apos o teste;
- logo, o player nao era a causa primaria: ele recebia pacote sem asset de video;
- causa provavel isolada no Release iOS: encerramento dependia de um unico `recordAsync` longo e do `stopRecording`; quando esse retorno nao chegava, o pacote era finalizado sem midia.

Correcao aplicada:

- iOS grava em segmentos curtos H.264 (`avc1`);
- cada segmento concluido e preservado no cofre criptografado imediatamente;
- o encerramento do SOS nao precisa mais esperar um unico video longo para existir ao menos um asset;
- registro historico: o botao de encerramento chegou a finalizar o chamado imediatamente e apenas sinalizar a camera para parar em paralelo;
- se o iOS devolver um segmento depois do encerramento, o asset ainda pode ser anexado ao pacote ja finalizado;
- seletor do player diferencia segmentos repetidos da mesma camera (`Frontal 1`, `Frontal 2`, ...).

Evidencia adicional 2026-05-08:

- SOS iniciado antes da atualizacao permaneceu ativo apos reinstalacao porque o estado `recording_local` fica preservado no armazenamento local;
- o comportamento de nao interromper por fechamento/reinstalacao e correto como regra de seguranca, mas o botao seguro precisava finalizar o pacote sem depender da camera;
- logs fisicos: iPhone visto por USB em `xcdevice`; `devicectl` sem provider CoreDevice; `ios-deploy` instalou Release corrigido, mas launch/debug foi bloqueado por lockscreen;
- container antes do novo teste desbloqueado: `/Documents/` vazio, consistente com os pacotes anteriores sem midia.

Validacao obrigatoria pendente:

- desbloquear o iPhone e abrir o build `Release` instalado em 2026-05-08;
- executar SOS manual de pelo menos 12s;
- encerrar pelo botao e confirmar que o estado ativo sai rapidamente, sem aguardar timeout de camera;
- confirmar no container a presenca de `manifest.sseg`, chunks `.sseg` e, quando disponivel, `thumbnail.sseg`;
- abrir o Player Seguro no iPhone e confirmar preparo/reproducao do primeiro segmento cifrado;
- se falhar, registrar causa tecnica saneada sem URI, caminho, token, chave, e-mail, IP ou payload sensivel.

### Atualizacao 2026-05-08 - iOS sem asset apos botao corrigido

Resultado do novo teste manual:

- SOS no iPhone ficou ativo por mais de 30s;
- encerramento pelo botao funcionou;
- o item novo no cofre ainda apareceu como `Sem midia`;
- o player nao abriu porque nao havia asset local para reproduzir.

Nova correcao para validar:

- iOS usa `videoQuality="4:3"`; Android permanece em `480p`;
- pacote sem video agora guarda diagnostico saneado de captura (`camera_mount_error`, `camera_no_file_returned`, `camera_recording_error` ou `media_permissions_denied`);
- cofre/player devem mostrar a causa tecnica saneada quando nao houver asset;
- build `Release` iOS foi recompilado e instalado; launch automatico depende de iPhone desbloqueado.

Checklist Myers para o proximo teste no iPhone:

- desbloquear iPhone e abrir SinalSeguro;
- acionar SOS por pelo menos 20s;
- encerrar pelo botao seguro e confirmar que sai do estado ativo rapidamente;
- abrir o cofre e verificar se o item mostra `Protegido` ou uma causa tecnica saneada;
- se houver video, abrir o Player Seguro e validar primeiro frame/progresso;
- apos o teste, coletar container com `ios-deploy` e confirmar presenca ou ausencia de `manifest.sseg`, chunks `.sseg` e `thumbnail.sseg`;
- se ainda falhar, usar a causa tecnica persistida para decidir entre preview iOS visivel/tamanho real, codec default sem `avc1`, ou modulo nativo de captura segmentada.

Controle fisico iPhone pelo Mac:

- iPhone Mirroring nao se aplica ao iPhone 8 Plus em iOS 16.7.15 porque exige iOS 18+;
- QuickTime/AirPlay servem como espelho/gravacao visual, sem toque remoto automatizado;
- Appium 2 + XCUITest/WebDriverAgent e a rota de QA remoto, mas neste Mac o WDA compilou e falhou ao iniciar no iPhone fisico; precisa ajuste de assinatura/preinstalacao do WebDriverAgentRunner antes de virar fluxo operacional.

### Atualizacao 2026-05-08 - build Debug iOS para diagnostico operacional

Resultado:

- novo print/teste fisico do iPhone as 07:56 continuou mostrando pacote `Sem midia`;
- listagem do container apos o teste continuou sem `manifest.sseg`, chunks ou thumbnail;
- `Library/Caches/Camera` tambem ficou sem arquivo recuperavel, indicando falha antes da preservacao criptografada;
- Appium 3 + XCUITest driver recente foi testado, mas WebDriverAgent segue bloqueado pelo Xcode ao iniciar o runner no aparelho fisico.

Build instalado para proximo teste:

- iOS `Debug` com bundle JS embutido;
- log operacional persistente em `Documents/sinalseguro-debug/media-operational-log.jsonl`;
- eventos cobrem SOS, prontidao da camera, permissao, `recordAsync`, stop, preservacao, cifragem, verificacao e pacote sem asset;
- saneamento obrigatorio: sem URI, caminho sensivel, token, chave, nonce, tag, hash, coordenada, e-mail, IP, payload ou capability.

Checklist Myers:

- desbloquear iPhone e abrir SinalSeguro Debug;
- executar SOS por 20s a 60s;
- encerrar pelo botao seguro;
- conferir cofre/player;
- baixar o JSONL operacional e classificar a causa: camera nao montada, camera sem arquivo, erro de gravacao, stop pendente, preservacao indisponivel ou erro de cifragem/verificacao;
- a partir da causa, aplicar correcao pontual antes de qualquer refatoracao maior.

## Checkpoint 2026-05-08 - iOS log isolou desmontagem prematura da camera

Evidencia do JSONL operacional:

- permissao e prontidao da camera foram concedidas;
- `recordAsync` iniciou em iOS com estrategia nativa e preview visivel;
- o encerramento disparou `stopRecording`, mas o pacote/cofre recebeu `attachedAssetCount=0`;
- o componente de camera desmontou ainda com `recordingActive=true`;
- nao houve evento de arquivo retornado nem preservacao cifrada antes da tela mostrar `Sem midia`.

Causa tecnica classificada por Myers:

- falha anterior ao Player Seguro;
- encerramento do SOS finalizava o pacote e desmontava o gravador antes de a API nativa devolver o arquivo gravado;
- player nao abria porque nao existia `manifest.sseg`/chunk para reproduzir.

Correcao validada estaticamente:

- `HomeScreen` aguarda `waitForMediaRecorderStop` antes de `finishEmergencyPackage`;
- timeout controlado de 9s gera evento saneado `emergency_media_stop_timeout`;
- `EmergencyMediaRecorder` liquida o stop com status `attached`, `empty`, `error` ou `idle`;
- smoke test bloqueia regressao na ordem stop da camera -> finalizacao do pacote.

Gates executados:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `git diff --check`: aprovado;
- build iOS `Release`: aprovado;
- instalacao no iPhone fisico: aprovada; auto-launch bloqueado por lockscreen.

Reteste fisico obrigatorio:

- iPhone desbloqueado e app aberto manualmente;
- SOS com duracao minima de 20s;
- encerramento pelo botao seguro;
- validar cofre/player e depois baixar o JSONL;
- aprovado somente se houver asset protegido reproduzivel ou causa tecnica saneada conclusiva sem dado sensivel.

## Checkpoint 2026-05-08 - iOS `recordAsync` falhou imediatamente

Evidencia Myers:

- novo print mostrou causa saneada `Gravacao de video interrompida pela camera`;
- JSONL do teste 10:35 mostrou `capture_camera_ready` e `capture_record_async_start`;
- `capture_record_async_error` ocorreu imediatamente no primeiro segmento;
- nao houve `capture_preserve_start`, `capture_preserve_success` ou chunks;
- no encerramento, o stop liquidou como `idle`, porque a captura ja tinha falhado antes.

Correcao aplicada:

- bloqueio de duplo acionamento enquanto `startEmergencyPackage` ainda esta criando pacote;
- warm-up iOS antes de chamar `recordAsync`;
- retry controlado de `recordAsync` em falha rapida no iOS;
- novo motivo saneado `camera_output_not_ready`.

Gates:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `git diff --check`: aprovado.

## Checkpoint 2026-05-08 - iOS gravou, mas indice chegou depois do timeout

Evidencia Myers do teste 11:16:

- camera pronta, permissao concedida e `recordAsync` retornou arquivo;
- fonte temporaria tinha cerca de 4,8 MB;
- preservacao cifrada criou 10 chunks e `manifest.sseg`;
- criptografia e verificacao completa demoraram cerca de 56s combinados;
- o encerramento timeoutou em 9s e o pacote foi mostrado `Sem midia` antes de o asset ser anexado.

Correcao aplicada:

- iOS grava H.264 `480p` com bitrate alvo menor para reduzir tamanho de origem;
- chunks iOS de 2 MB reduzem custo de I/O e base64;
- verificacao iOS `bounded` valida chave, manifesto e chunks de borda; playback continua autenticando chunks quando lidos;
- encerramento bloqueia toques repetidos e aguarda ate 30s antes de fallback;
- texto de fallback diferencia midia ainda protegendo de camera interrompida.

Reteste fisico obrigatorio:

- instalar novo Release;
- iniciar SOS no iPhone por 20s a 30s;
- encerrar uma vez pelo botao;
- aguardar retorno do app sem abrir cofre antes do status final;
- validar que o cofre mostra `Protegido`/video e que o player abre o asset cifrado;
- baixar JSONL e confirmar tempos de `preserve_encrypt_chunks_success`, `preserve_verify_success`, `preserve_local_video_attached` e ausencia de `emergency_media_stop_timeout`.

Atualizacao posterior do QA iOS:

- se o iPhone mostrar lentidao ao encerrar, verificar primeiro se o JSONL possui `emergency_finish_button_pressed` na sessao mais recente;
- se nao houver esse evento e houver sequencia continua de `capture_record_async_start`/`preserve_*`, a regressao e saturacao do ciclo de midia, nao ausencia de camera;
- a build seguinte deve limitar iOS a um segmento local curto por chamado e registrar `capture_ios_segment_limit_reached`;
- reteste esperado: SOS acima de 20s, cofre com pelo menos 1 video protegido, encerramento responsivo e sem novo arquivo claro estagnado em cache depois de finalizado.

## Checkpoint 2026-05-09 - Frente 1.2 ponte nativa e build Android

Escopo validado:

- ponte JS `SinalSeguroMediaEngine` existe com contratos `encryptSegment`, `openEncryptedAsset`, `closePlaybackHandle` e `cleanupMediaResidues`;
- config plugin versionado sincroniza os arquivos nativos Android/iOS a partir de `plugins/native-media-engine/`;
- Android compila o modulo Kotlin nativo e registra o package manualmente;
- envelopes atuais seguem compatíveis com `js_chunked_v1`; caminho nativo so abre quando o ativo declarar `native_segmented_v1`.

Gates executados:

- `npm run typecheck`: aprovado;
- `npm run lint`: aprovado;
- `npm test`: aprovado;
- `npm run test:crypto`: aprovado;
- `npm run test:device-keys`: aprovado;
- `git diff --check`: aprovado;
- `./scripts/sinalseguro-mobile-dash.sh --action build-android --no-clean --yes`: aprovado;
- APK Android privado: `apps/mobile/distribution/android/out/sinalseguro-android.apk`;
- SHA-256 Android: `9d60f820a4dc8d9556482df957b409637b111ab5988a0e8122da6cc03879f9bc`;
- readiness Android privado: 0 pendencias.

Visual web local:

- `http://localhost:19006/`: Home SOS renderizou com botao SOS, logo e atalhos Policia/Bombeiros/SAMU;
- `http://localhost:19006/arquivos?painel=player`: modal Player Seguro renderizou estado sem arquivo, controles desabilitados e acao para abrir cofre;
- Cofre local renderizou estado vazio com modal compacto e sem sobreposicao aparente.

Nao executado neste checkpoint:

- build iOS, porque `ios/Pods` foi removido na limpeza e o espaco livre apos o build Android ficou abaixo do gate de 14 GiB;
- testes fisicos 30s/60s/3min/5min, porque ainda falta ativo nativo real e novo build iOS;
- validacao Schneier/Doneda fisica completa de residuos/logs, que depende dos testes em aparelho.
